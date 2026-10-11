import cv2, numpy as np
from PIL import Image, ImageDraw, ImageFilter
src = cv2.imread('../../../images/5.webp'); H, W = src.shape[:2]
rgb = cv2.cvtColor(src, cv2.COLOR_BGR2RGB)
def gc(rect, it=6, extra_bg=None):
    x0, y0, x1, y1 = rect; m = np.zeros((H, W), np.uint8); bg = np.zeros((1, 65), np.float64); fg = np.zeros((1, 65), np.float64)
    cv2.grabCut(src, m, (x0, y0, x1 - x0, y1 - y0), bg, fg, it, cv2.GC_INIT_WITH_RECT)
    a = np.where((m == 1) | (m == 3), 255, 0).astype(np.uint8)
    n, lab, st, _ = cv2.connectedComponentsWithStats(a)           # keep the largest blob(s)
    if n > 1:
        keep = 1 + np.argsort(-st[1:, cv2.CC_STAT_AREA])[:2]; keep = [k for k in keep if st[k, cv2.CC_STAT_AREA] > 0.15 * st[keep[0], cv2.CC_STAT_AREA]]
        a = np.isin(lab, keep).astype(np.uint8) * 255
    a = cv2.morphologyEx(a, cv2.MORPH_CLOSE, np.ones((5, 5), np.uint8)); a = cv2.GaussianBlur(a, (5, 5), 0)
    return a
def save(name, a, rect):
    x0, y0, x1, y1 = rect; out = np.dstack([rgb, a])[y0:y1, x0:x1]
    Image.fromarray(out, 'RGBA').save(f'img2/{name}.png'); return out
R = {'lime': (55, 852, 312, 1098), 'bergamot': (8, 738, 332, 1012), 'peel': (128, 1058, 306, 1238), 'lav1': (768, 540, 962, 928),
     'lav2': (962, 698, 1086, 938), 'amber': (848, 888, 1086, 1108), 'wood': (318, 1102, 922, 1448), 'wood2': (862, 1102, 1086, 1268)}
A = {k: gc(r) for k, r in R.items()}
A['bergamot'] = np.minimum(A['bergamot'], 255 - A['lime'])          # the lime sits in front of it
for k in R: save(k, A[k], R[k])
# grains: small circles out of the sky
for i, (cx, cy, r) in enumerate([(958, 279, 11), (943, 742, 10), (950, 652, 9), (868, 800, 9), (940, 528, 7)]):
    m = Image.new('L', (W, H), 0); ImageDraw.Draw(m).ellipse([cx - r, cy - r, cx + r, cy + r], fill=255); m = m.filter(ImageFilter.GaussianBlur(1.2))
    save(f'grain{i}', np.asarray(m), (cx - r - 3, cy - r - 3, cx + r + 4, cy + r + 4))
# the bottle: measured shapes, not grabCut (glass is transparent)
def rr(d, b, r): d.rounded_rectangle(b, r, fill=255)
glass = Image.new('L', (W, H), 0); rr(ImageDraw.Draw(glass), [326, 500, 748, 1021], 22)
cap = Image.new('L', (W, H), 0); dc = ImageDraw.Draw(cap); rr(dc, [409, 315, 666, 459], 8); rr(dc, [457, 452, 609, 506], 4)
for nm, m, box in [('glass', glass, (326, 500, 749, 1022)), ('cap', cap, (409, 315, 667, 507))]:
    a = np.asarray(m.filter(ImageFilter.GaussianBlur(0.8))); save(nm, a, box)
# label back (for the far side of the turn): the label area, desaturated paper
lab = rgb[610:869, 455:689].astype(float); g = lab.mean(2, keepdims=True); paper = (0.25 * lab + 0.75 * (g * 0 + np.array([214, 204, 160]))).clip(0, 255).astype(np.uint8)
Image.fromarray(paper).save('img2/label_back.png')
# plate: the scene with the bottle painted out
mask = np.maximum(np.asarray(glass), np.asarray(cap)); mask = cv2.dilate(mask, np.ones((15, 15), np.uint8))
small = cv2.resize(src, (W // 2, H // 2)); ms = cv2.resize(mask, (W // 2, H // 2))
pl = cv2.inpaint(small, ms, 21, cv2.INPAINT_TELEA); pl = cv2.resize(pl, (W, H), interpolation=cv2.INTER_CUBIC)
pl = cv2.GaussianBlur(pl, (0, 0), 6); mf = cv2.GaussianBlur(mask, (0, 0), 6)[..., None] / 255.0
plate = (src * (1 - mf) + pl * mf).astype(np.uint8); cv2.imwrite('img2/plate.jpg', plate, [cv2.IMWRITE_JPEG_QUALITY, 93])
cv2.imwrite('img2/scene.jpg', src, [cv2.IMWRITE_JPEG_QUALITY, 95])
# contact sheet on magenta
tiles = []
for k in list(R) + ['grain0', 'grain1', 'glass', 'cap']:
    t = Image.open(f'img2/{k}.png'); bg = Image.new('RGB', t.size, (255, 0, 255)); bg.paste(t, mask=t.split()[3]); bg.thumbnail((260, 260)); tiles.append(bg)
sh = Image.new('RGB', (260 * 6, 260 * 2), (40, 40, 40))
for i, t in enumerate(tiles): sh.paste(t, ((i % 6) * 260, (i // 6) * 260))
sh.save('cutouts.png'); Image.open('img2/plate.jpg').resize((362, 483)).save('plate_small.png')
