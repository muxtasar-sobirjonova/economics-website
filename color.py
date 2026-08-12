from PIL import Image
from collections import Counter

img = Image.open('public/favicon.png')
img = img.convert('RGB')
pixels = list(img.getdata())

# Count colors, ignore pure black and pure white
counts = Counter(p for p in pixels if not (p[0] < 10 and p[1] < 10 and p[2] < 10) and not (p[0] > 245 and p[1] > 245 and p[2] > 245))
print(counts.most_common(1))
