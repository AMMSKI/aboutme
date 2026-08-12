import os
from struct import pack, unpack
import zlib

def process_leaf_image(input_path, output_png_path, output_svg_path):
    with open(input_path, 'rb') as f:
        data = f.read()

    # Read PNG header and IHDR
    if not data.startswith(b'\x89PNG\r\n\x1a\n'):
        raise ValueError("Not a valid PNG")

    pos = 8
    width = height = 0
    idat_chunks = []

    while pos < len(data):
        length = unpack('>I', data[pos:pos+4])[0]
        chunk_type = data[pos+4:pos+8]
        chunk_data = data[pos+8:pos+8+length]
        pos += 12 + length

        if chunk_type == b'IHDR':
            width, height, bit_depth, color_type = unpack('>IIBB', chunk_data[:10])
        elif chunk_type == b'IDAT':
            idat_chunks.append(chunk_data)

    raw_data = zlib.decompress(b''.join(idat_chunks))
    
    # Process scanlines
    bpp = 3 if color_type == 2 else 4
    stride = 1 + width * bpp
    unfiltered = bytearray()
    
    prev_line = bytearray(width * bpp)
    for y in range(height):
        filter_type = raw_data[y * stride]
        line = bytearray(raw_data[y * stride + 1 : (y + 1) * stride])
        
        if filter_type == 1: # Sub
            for i in range(bpp, len(line)):
                line[i] = (line[i] + line[i - bpp]) & 0xff
        elif filter_type == 2: # Up
            for i in range(len(line)):
                line[i] = (line[i] + prev_line[i]) & 0xff
        elif filter_type == 3: # Average
            for i in range(len(line)):
                left = line[i - bpp] if i >= bpp else 0
                line[i] = (line[i] + ((left + prev_line[i]) // 2)) & 0xff
        elif filter_type == 4: # Paeth
            for i in range(len(line)):
                left = line[i - bpp] if i >= bpp else 0
                up = prev_line[i]
                corner = prev_line[i - bpp] if i >= bpp else 0
                p = left + up - corner
                pa = abs(p - left)
                pb = abs(p - up)
                pc = abs(p - corner)
                if pa <= pb and pa <= pc:
                    nearest = left
                elif pb <= pc:
                    nearest = up
                else:
                    nearest = corner
                line[i] = (line[i] + nearest) & 0xff
        
        unfiltered.extend(line)
        prev_line = line

    # Create RGBA output with transparent background
    rgba_bytes = bytearray()
    for y in range(height):
        rgba_bytes.append(0) # Filter type 0 (None)
        for x in range(width):
            idx = (y * width + x) * bpp
            r, g, b = unfiltered[idx], unfiltered[idx+1], unfiltered[idx+2]
            
            # Leaf color matching: sage green
            brightness = (r + g + b) / 3.0
            if g > 45 and g > r and brightness > 30:
                # Sage leaf pixel -> Keep sage green color with full opacity
                rgba_bytes.extend([r, g, b, 255])
            elif brightness > 35 and g >= r - 5:
                # Soft antialiased edge
                alpha = int(min(255, (brightness - 15) * 6))
                rgba_bytes.extend([r, g, b, alpha])
            else:
                # Dark background -> 100% Transparent
                rgba_bytes.extend([0, 0, 0, 0])

    # Write clean transparent PNG chunk by chunk
    def make_chunk(chunk_type, chunk_data):
        return pack('>I', len(chunk_data)) + chunk_type + chunk_data + pack('>I', zlib.crc32(chunk_type + chunk_data) & 0xffffffff)

    png_out = bytearray(b'\x89PNG\r\n\x1a\n')
    ihdr_data = pack('>IIBBBBB', width, height, 8, 6, 0, 0, 0)
    png_out.extend(make_chunk(b'IHDR', ihdr_data))
    png_out.extend(make_chunk(b'IDAT', zlib.compress(bytes(rgba_bytes))))
    png_out.extend(make_chunk(b'IEND', b''))

    with open(output_png_path, 'wb') as f:
        f.write(png_out)

process_leaf_image(
    '/Users/alanm/.gemini/antigravity/brain/2f6b9c9b-c19c-4380-9220-cc7b80101757/media__1786560330744.png',
    '/Users/alanm/MyProjects/PortfolioSite/public/icon.png',
    '/Users/alanm/MyProjects/PortfolioSite/src/app/icon.svg'
)
print("SUCCESS")
