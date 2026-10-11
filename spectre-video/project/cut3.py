import cv2, numpy as np
from PIL import Image
src = cv2.imread('../../../images/5.webp'); rgb = cv2.cvtColor(src, cv2.COLOR_BGR2RGB); H, W = src.shape[:2]
def save(name, a, r):
    x0, y0, x1, y1 = r; Image.fromarray(np.dstack([rgb, a])[y0:y1, x0:x1], 'RGBA').save(f'img2/{name}.png')
el = np.zeros((H, W), np.uint8); cv2.ellipse(el, (184, 975), (121, 114), -8, 0, 360, 255, -1); el = cv2.GaussianBlur(el, (5, 5), 0)
full = np.zeros((H, W), np.uint8); full[852:1098, 55:312] = np.asarray(Image.open('img2/lime.png'))[..., 3]
save('lime', np.minimum(full, el), (55, 852, 312, 1098))
V = cv2.cvtColor(src, cv2.COLOR_BGR2HSV)[..., 2].astype(float) / 255
bgV = cv2.GaussianBlur(cv2.morphologyEx((V * 255).astype(np.uint8), cv2.MORPH_CLOSE, np.ones((25, 25), np.uint8)), (0, 0), 4).astype(float) / 255
a = np.clip(((bgV - V) - 0.035) / 0.07, 0, 1)
for nm, r in [('lav1', (768, 540, 962, 928)), ('lav2', (962, 698, 1086, 938))]:
    m = np.zeros((H, W)); x0, y0, x1, y1 = r; m[y0:y1, x0:x1] = a[y0:y1, x0:x1]
    m8 = (m * 255).astype(np.uint8); m8 = cv2.morphologyEx(m8, cv2.MORPH_CLOSE, np.ones((3, 3), np.uint8))
    save(nm, cv2.GaussianBlur(m8, (3, 3), 0), r)
tiles = []
for k in ['lime', 'lav1', 'lav2', 'amber', 'wood2']:
    t = Image.open(f'img2/{k}.png'); bgc = Image.new('RGB', t.size, (255, 0, 255)); bgc.paste(t, mask=t.split()[3]); bgc.thumbnail((300, 300)); tiles.append(bgc)
sh = Image.new('RGB', (300 * 5, 300), (40, 40, 40))
for i, t in enumerate(tiles): sh.paste(t, (i * 300, 0))
sh.save('cutouts3.png')
