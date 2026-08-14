from PIL import Image

img = Image.open('public/favicon.png')
img = img.convert('RGBA')
pixels = img.load()

width, height = img.size

# We know the symbol is on the left and has a certain height.
# Let's find the true bounding box by finding the first column with non-white and first row
left = width
top = height
bottom = 0

for x in range(width):
    for y in range(height):
        r, g, b, a = pixels[x, y]
        if a > 10 and not (r > 240 and g > 240 and b > 240):
            if x < left: left = x

for y in range(height):
    for x in range(width):
        r, g, b, a = pixels[x, y]
        if a > 10 and not (r > 240 and g > 240 and b > 240):
            if y < top: top = y
            if y > bottom: bottom = y

# The symbol is a square, so its width is equal to its height
symbol_height = bottom - top
# We crop a square from 'left' and 'top'
cropped = img.crop((left, top, left + symbol_height, top + symbol_height))
cropped.save('public/favicon_cropped.png')
print(f"Cropped square: left={left}, top={top}, size={symbol_height}")
