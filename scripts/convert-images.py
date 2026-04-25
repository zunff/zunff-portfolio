#!/usr/bin/env python3
"""
批量转换图片为 WebP 格式，用于项目展示截图

功能：
- 扫描指定目录下的 png/jpg/jpeg/webp 文件
- 转换为 WebP（质量 80）
- 可选：裁切/缩放到 16:9（1280x720）
- 输出到指定目录，保留原文件

使用：
  python3 scripts/convert-images.py [输入目录] [输出目录] [--resize]

示例：
  python3 scripts/convert-images.py ./raw-images ./public/images/projects --resize
  python3 scripts/convert-images.py ./raw-images ./public/images/projects  # 不缩放，只转格式
"""

import argparse
from pathlib import Path
from PIL import Image
import sys

SUPPORTED_EXTS = {'.png', '.jpg', '.jpeg', '.webp'}
TARGET_WIDTH = 1280
TARGET_HEIGHT = 720
QUALITY = 80


def resize_to_16_9(img: Image.Image) -> Image.Image:
    """裁切或缩放图片到 16:9 比例"""
    w, h = img.size
    target_ratio = TARGET_WIDTH / TARGET_HEIGHT
    current_ratio = w / h

    if abs(current_ratio - target_ratio) < 0.01:
        # 已经是 16:9，直接缩放
        return img.resize((TARGET_WIDTH, TARGET_HEIGHT), Image.Resampling.LANCZOS)

    # 裁切到 16:9
    if current_ratio > target_ratio:
        # 宽图，裁切左右
        new_w = int(h * target_ratio)
        left = (w - new_w) // 2
        img = img.crop((left, 0, left + new_w, h))
    else:
        # 高图，裁切上下
        new_h = int(w / target_ratio)
        top = (h - new_h) // 2
        img = img.crop((0, top, w, top + new_h))

    return img.resize((TARGET_WIDTH, TARGET_HEIGHT), Image.Resampling.LANCZOS)


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
                img = resize_to_16_9(img)

            # 保存为 WebP
            img.save(output_path, 'webp', quality=QUALITY)

        return True, None
    except Exception as e:
        return False, str(e)


def main():
    parser = argparse.ArgumentParser(description='批量转换图片为 WebP 格式')
    parser.add_argument('input_dir', type=str, help='输入目录')
    parser.add_argument('output_dir', type=str, help='输出目录')
    parser.add_argument('--resize', action='store_true', help='裁切/缩放到 16:9 (1280x720)')
    args = parser.parse_args()

    input_dir = Path(args.input_dir)
    output_dir = Path(args.output_dir)

    if not input_dir.exists():
        print(f"❌ 输入目录不存在: {input_dir}")
        sys.exit(1)

    # 创建输出目录
    output_dir.mkdir(parents=True, exist_ok=True)

    # 扫描图片
    images = []
    for ext in SUPPORTED_EXTS:
        images.extend(input_dir.glob(f'*{ext}'))
        images.extend(input_dir.glob(f'*{ext.upper()}'))

    if not images:
        print(f"❌ 输入目录没有找到图片: {input_dir}")
        sys.exit(1)

    print(f"📁 找到 {len(images)} 张图片")
    print(f"🎯 输出目录: {output_dir}")
    print(f"📐 缩放: {'是 (16:9, 1280x720)' if args.resize else '否 (保持原尺寸)'}")
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
