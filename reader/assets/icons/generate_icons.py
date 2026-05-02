#!/usr/bin/env python3
"""
Generate PWA icons for MCU Doomsday Reader
Creates 144x144, 192x192, and 512x512 PNG icons
"""

from PIL import Image, ImageDraw, ImageFont
import os

def create_mcu_icon(size, output_path):
    """Create a simple MCU-themed icon"""
    # Create image with dark red background
    img = Image.new('RGB', (size, size), color='#8b0000')
    draw = ImageDraw.Draw(img)
    
    # Draw a stylized "MCU" text or Avengers-style "A"
    # For simplicity, we'll create a geometric design
    
    # Draw outer circle (gold)
    margin = size // 10
    draw.ellipse([margin, margin, size-margin, size-margin], 
                 fill='#8b0000', outline='#ffd700', width=size//20)
    
    # Draw inner design - stylized "A" for Avengers
    center = size // 2
    top = size // 4
    bottom = size * 3 // 4
    width = size // 3
    
    # Draw triangle for "A"
    points = [
        (center, top),  # Top point
        (center - width//2, bottom),  # Bottom left
        (center + width//2, bottom),  # Bottom right
    ]
    draw.polygon(points, fill='#ffd700')
    
    # Draw horizontal bar in "A"
    bar_y = center + size // 10
    bar_height = size // 15
    draw.rectangle([
        center - width//3, bar_y,
        center + width//3, bar_y + bar_height
    ], fill='#8b0000')
    
    # Draw inner circle cutout
    inner_margin = size // 3
    draw.ellipse([inner_margin, inner_margin, 
                  size-inner_margin, size-inner_margin], 
                 fill='#8b0000')
    
    # Save the image
    img.save(output_path, 'PNG')
    print(f"✅ Created {output_path} ({size}x{size})")

def main():
    """Generate all required icon sizes"""
    script_dir = os.path.dirname(os.path.abspath(__file__))
    
    sizes = [
        (144, 'icon-144.png'),
        (192, 'icon-192.png'),
        (512, 'icon-512.png'),
    ]
    
    print("🎨 Generating MCU Doomsday Reader PWA Icons...")
    print()
    
    for size, filename in sizes:
        output_path = os.path.join(script_dir, filename)
        create_mcu_icon(size, output_path)
    
    print()
    print("✨ All icons generated successfully!")
    print("📱 Icons are ready for PWA installation")

if __name__ == '__main__':
    main()

# Made with Bob
