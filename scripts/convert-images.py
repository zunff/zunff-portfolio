#!/usr/bin/env python3
"""
批量转换图片为 WebP 格式，用于项目展示截图

功能：
- 支持单张图片或整个目录的转换
- 扫描指定目录下的 png/jpg/jpeg/webp 文件
- 转换为 WebP（质量 80）
- 可选：填充到 16:9（1280x720），深蓝灰主题底色
- 输出到指定目录，保留原文件

使用：
  python3 scripts/convert-images.py [输入路径] [输出目录] [--resize]

示例：
  # 批量转换目录
  python3 scripts/convert-images.py ./raw-images ./public/images/projects --resize
  python3 scripts/convert-images.py ./raw-images ./public/images/projects  # 不缩放

  # 单张图片转换
  python3 scripts/convert-images.py ./screenshot.png ./public/images/projects --resize
"""

import argparse
from pathlib import Path
from PIL import Image
import sys

SUPPORTED_EXTS = {'.png', '.jpg', '.jpeg', '.webp'}
TARGET_WIDTH = 1280
TARGET_HEIGHT = 720
QUALITY = 80
FILL_COLOR = (41, 48, 71)  # 深蓝灰底色，与项目截图风格一致


def fill_to_16_9(img: Image.Image) -> Image.Image:
    """填充图片到 16:9 比例，优先填充左右，使用固定主题色"""
    w, h = img.size
    target_ratio = TARGET_WIDTH / TARGET_HEIGHT
    current_ratio = w / h

    if abs(current_ratio - target_ratio) < 0.01:
        # 已经是 16:9，直接缩放
        return img.resize((TARGET_WIDTH, TARGET_HEIGHT), Image.Resampling.LANCZOS)

    # 创建目标尺寸的画布，使用固定主题色
    if img.mode in ('RGBA', 'P'):
        canvas = Image.new('RGBA', (TARGET_WIDTH, TARGET_HEIGHT), FILL_COLOR)
    else:
        canvas = Image.new('RGB', (TARGET_WIDTH, TARGET_HEIGHT), FILL_COLOR)

    # 计算缩放后的尺寸（保持原比例）
    if current_ratio > target_ratio:
        # 宽图，优先填充上下
        new_w = TARGET_WIDTH
        new_h = int(TARGET_WIDTH / current_ratio)
        resized = img.resize((new_w, new_h), Image.Resampling.LANCZOS)

        # 居中放置（填充上下）
        y_offset = (TARGET_HEIGHT - new_h) // 2
        canvas.paste(resized, (0, y_offset))
    else:
        # 高图，优先填充左右（符合需求）
        new_h = TARGET_HEIGHT
        new_w = int(TARGET_HEIGHT * current_ratio)
        resized = img.resize((new_w, new_h), Image.Resampling.LANCZOS)

        # 居中放置（填充左右）
        x_offset = (TARGET_WIDTH - new_w) // 2
        canvas.paste(resized, (x_offset, 0))

    return canvas


def convert_image(input_path: Path, output_path: Path, resize: bool):
    """转换单张图片"""
    try:
        with Image.open(input_path) as img:
            # 转换 RGBA 模式（PNG 透明度）
            if img.mode in ('RGBA', 'P'):
                img = img.convert('RGBA')
            else:
                img = img.convert('RGB')

            # 缩放
            if resize:
                img = fill_to_16_9(img)

            # 保存为 WebP
            img.save(output_path, 'webp', quality=QUALITY)

        return True, None
    except Exception as e:
        return False, str(e)


def main():
    parser = argparse.ArgumentParser(description='批量转换图片为 WebP 格式')
    parser.add_argument('input', type=str, help='输入目录或单张图片路径')
    parser.add_argument('output_dir', type=str, help='输出目录')
    parser.add_argument('--resize', action='store_true', help='填充到 16:9 (1280x720)，深蓝灰主题底色')
    args = parser.parse_args()

    input_path = Path(args.input)
    output_dir = Path(args.output_dir)

    if not input_path.exists():
        print(f"❌ 输入路径不存在: {input_path}")
        sys.exit(1)

    # 创建输出目录
    output_dir.mkdir(parents=True, exist_ok=True)

    # 判断是单文件还是目录
    if input_path.is_file():
        if input_path.suffix.lower() not in SUPPORTED_EXTS:
            print(f"❌ 不支持的文件格式: {input_path.suffix}")
            sys.exit(1)
        images = [input_path]
    else:
        # 扫描目录下图片
        images = []
        for ext in SUPPORTED_EXTS:
            images.extend(input_path.glob(f'*{ext}'))
            images.extend(input_path.glob(f'*{ext.upper()}'))

        if not images:
            print(f"❌ 输入目录没有找到图片: {input_path}")
            sys.exit(1)

    print(f"📁 找到 {len(images)} 张图片")
    print(f"🎯 输出目录: {output_dir}")
    print(f"📐 填充: {'是 (16:9, 1280x720, 智能主题色背景)' if args.resize else '否 (保持原尺寸)'}")
    print(f"🎯 质量: {QUALITY}%")
    print()

    # 转换
    success_count = 0
    for i, img_path in enumerate(sorted(images), 1):
        output_path = output_dir / f"{img_path.stem}.webp"
        success, error = convert_image(img_path, output_path, args.resize)

        if success:
            size_kb = output_path.stat().st_size / 1024
            print(f"✅ [{i}/{len(images)}] {img_path.name} -> {output_path.name} ({size_kb:.1f}KB)")
            success_count += 1
        else:
            print(f"❌ [{i}/{len(images)}] {img_path.name}: {error}")

    print()
    print(f"✨ 完成！成功转换 {success_count}/{len(images)} 张图片")


if __name__ == '__main__':
    main()
