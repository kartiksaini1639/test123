# Spectre v2 — a synthesized cinematic score (no samples) + the sound effects, one room, mastered together.
import sys, numpy as np
sys.path.insert(0, "/root/.claude/skills/onetake/scripts")
from sfx_palette import *
from scipy import signal

DUR = 30.0; N = int(SR * DUR); t_all = np.arange(N) / SR
hz = lambda m: 440 * 2 ** ((m - 69) / 12)
rng = np.random.default_rng(3)
music = np.zeros((N, 2))

def add(buf, sig, t0, gain=1.0, pan=0.0):
    i0 = int(t0 * SR); sig = np.asarray(sig)
    if sig.ndim == 1: sig = np.stack([sig * np.sqrt(0.5 * (1 - pan)), sig * np.sqrt(0.5 * (1 + pan))], 1)
    n = min(len(sig), len(buf) - i0); buf[i0:i0 + n] += sig[:n] * gain

def env(n, att, rel, dur):
    t = np.arange(n) / SR; return np.clip(np.minimum(t / max(att, 1e-3), (dur - t) / max(rel, 1e-3)), 0, 1)

def pad(notes, dur, att=1.5, rel=2.0, cut=1800, wob=0.15):
    """a wide string-synth pad: detuned saws per channel through a slowly breathing low-pass"""
    n = int(SR * dur); t = np.arange(n) / SR; out = np.zeros((n, 2))
    for ch, det in ((0, (-0.09, 0.05, 0.13)), (1, (-0.12, 0.02, 0.10))):
        x = np.zeros(n)
        for m in notes:
            for d in det:
                f = hz(m) * (1 + d / 100); ph = (f * t + rng.random()) % 1
                x += (2 * ph - 1) * 0.6 + np.sin(2 * np.pi * f * t) * 0.4
        # breathing filter, processed in blocks
        y = np.zeros(n); B = 2048
        for i in range(0, n, B):
            fc = cut * (1 + wob * np.sin(2 * np.pi * 0.13 * (i / SR) + ch))
            b, a = signal.butter(2, min(fc, SR / 2 - 100) / (SR / 2)); y[i:i + B] = signal.lfilter(b, a, x[max(0, i - 600):i + B])[-len(x[i:i + B]):]
        out[:, ch] = y
    out *= env(n, att, rel, dur)[:, None]; return out / (np.abs(out).max() + 1e-9)

def bell(m, dur=2.2, idx=2.2, ratio=3.5):
    """FM celesta / bell"""
    n = int(SR * dur); t = np.arange(n) / SR; f = hz(m)
    I = idx * np.exp(-t * 3.5); x = np.sin(2 * np.pi * f * t + I * np.sin(2 * np.pi * f * ratio * t))
    x += 0.25 * np.sin(2 * np.pi * 2 * f * t) * np.exp(-t * 5)
    return x * np.exp(-t * 2.2) * np.minimum(1, t / 0.003)

def harp(m, dur=2.0):
    """Karplus-Strong pluck"""
    f = hz(m); p = int(SR / f); n = int(SR * dur); buf = rng.uniform(-1, 1, p); out = np.zeros(n)
    for i in range(n):
        out[i] = buf[i % p]; buf[i % p] = 0.5 * (buf[i % p] + buf[(i + 1) % p]) * 0.996
    return lp(out, 4200) * np.minimum(1, np.arange(n) / 30)

def piano(m, dur=3.0):
    n = int(SR * dur); t = np.arange(n) / SR; f = hz(m); x = np.zeros(n)
    for k, a in enumerate([1, 0.45, 0.22, 0.12, 0.06]):
        x += a * np.sin(2 * np.pi * f * (k + 1) * (1 + 0.0004 * k * k) * t) * np.exp(-t * (1.1 + 0.9 * k))
    return x * np.minimum(1, t / 0.004)

def drone(m, dur, att=2, rel=2):
    n = int(SR * dur); t = np.arange(n) / SR; f = hz(m)
    x = np.sin(2 * np.pi * f * t) + 0.3 * np.sin(2 * np.pi * 2 * f * t + 0.5 * np.sin(2 * np.pi * 0.2 * t))
    return x * env(n, att, rel, dur)

def wind(dur, lo=300, hi=1600, att=2, rel=2):
    n = int(SR * dur); t = np.arange(n) / SR; out = np.zeros((n, 2))
    for ch in (0, 1):
        x = sweep_bp(rng.standard_normal(n), lo, hi, 0.8, 32); out[:, ch] = x * (0.6 + 0.4 * np.sin(2 * np.pi * 0.11 * t + ch * 2))
    return out * env(n, att, rel, dur)[:, None] / (np.abs(out).max() + 1e-9)

# ── harmony along the cut (D minor, modal) ─────────────────────────────────
D2, D3 = 38, 50
add(music, wind(5.0, 280, 1400), 0.0, 0.10)
add(music, pad([50, 57, 64, 65, 72], 6.6, att=1.2, rel=1.6, cut=1500), 0.0, 0.30)          # Dm9 — the valley
add(music, drone(D2, 6.4, 1.5, 1.5), 0.0, 0.16)
for i, (m, tt) in enumerate([(74, 0.35), (69, 0.95), (77, 1.55), (76, 2.4), (72, 3.2), (74, 4.0)]):   # a slow motif over the turn
    add(music, piano(m, 3.2), tt, 0.16, pan=-0.2 + 0.08 * i)
# into the glass: Bbmaj9, a harp arpeggio
add(music, pad([46, 53, 57, 62, 72], 4.6, att=0.8, rel=1.4, cut=2600), 6.1, 0.28)
add(music, drone(34, 4.5, 0.5, 1.5), 6.3, 0.14)
arp = [58, 62, 65, 69, 74, 69, 65, 62]
for k in range(16):
    tt = 6.4 + k * 0.25
    if tt > 10.3: break
    add(music, harp(arp[k % 8] + (12 if k >= 8 and k % 2 else 0), 1.6), tt, 0.11 * (0.8 + 0.4 * rng.random()), pan=-0.4 + 0.8 * ((k % 8) / 7))
# heart: Gm9, celesta
add(music, pad([43, 50, 58, 62, 69], 4.2, att=0.6, rel=1.5, cut=1900), 11.3, 0.28)
add(music, drone(31, 4.0, 0.5, 1.3), 11.5, 0.14)
for k, (m, dt) in enumerate([(74, 0.0), (77, 0.5), (81, 1.0), (79, 1.75), (74, 2.25), (70, 2.75)]):
    add(music, bell(m, 2.4), 11.6 + dt, 0.10, pan=0.35 - 0.12 * k)
# base: Fmaj7/C, low and warm, slow piano
add(music, pad([36, 48, 53, 57, 64], 4.4, att=0.5, rel=1.4, cut=1100), 15.1, 0.32)
add(music, drone(29, 4.2, 0.4, 1.0), 15.3, 0.18)
for m, dt in [(53, 0.0), (60, 0.8), (64, 1.6), (57, 2.6)]:
    add(music, piano(m, 3.5), 15.4 + dt, 0.15, pan=-0.15)
# the whip: A sus → resolves on the name
add(music, pad([45, 52, 57, 62, 64], 2.2, att=0.3, rel=0.6, cut=2400), 18.9, 0.24)
add(music, pad([50, 57, 62, 65, 69, 76], 8.6, att=0.25, rel=2.5, cut=2200), 21.3, 0.32)     # Dm(add9) — SPECTRE
add(music, drone(D2, 8.4, 0.3, 2.0), 21.3, 0.18)
for m, dt in [(62, 0.0), (69, 0.7), (74, 1.4), (77, 2.2), (76, 3.2)]:
    add(music, piano(m, 3.4), 21.4 + dt, 0.14, pan=0.1)
# the black: a low D, the bells ring out
add(music, drone(26, 3.5, 0.15, 2.5), 26.55, 0.24)
add(music, pad([38, 50, 57, 64, 69], 3.4, att=0.2, rel=2.5, cut=1300), 26.55, 0.28)
for m, dt in [(74, 0.35), (81, 0.55), (86, 0.8)]: add(music, bell(m, 3.0, 1.6), 26.55 + dt, 0.09)
for m, dt in [(86, 0.0), (89, 0.12), (93, 0.24)]: add(music, bell(m, 2.2, 1.0), 28.05 + dt, 0.05, pan=-0.3 + 0.3 * dt * 8)

# room on the music
ir = impulse(2.6); wet = np.stack([signal.fftconvolve(music[:, c], ir[:, c])[:N] for c in (0, 1)], 1)
music = music * 0.75 + wet * 0.55

# ── the effects, from the cut ──────────────────────────────────────────────
s = Score(dur=DUR, T60=1.5)
s.place(air(2.7, 300, 1800, 0.9, 0.5), 1.6, 0.30, send=0.5, pan=-0.4, pan_to=0.4)            # the turn
for k in range(4): s.place(glass(hz(88 + k * 2), 0.8, 0.4), 2.1 + k * 0.55, 0.04, pan=-0.3 + 0.2 * k, send=0.7)
s.place(air(1.9, 140, 3200, 1.0, 0.75), 4.55, 0.50, send=0.5, pan=0.15, pan_to=-0.1)          # dive
s.place(sub(58, 1.0), 6.4, 0.40, send=0.2)
s.place(air(1.3, 2600, 380, 1.1, 0.5), 10.35, 0.36, send=0.5)
s.place(sub(52, 0.8), 11.6, 0.28, send=0.25)
s.place(air(0.9, 2200, 260, 1.2, 0.55), 14.55, 0.40, send=0.45)
s.place(sub(46, 1.1), 15.4, 0.42, send=0.2); s.place(wood(120, 0.18), 15.4, 0.16, send=0.3)
s.place(air(0.95, 220, 6500, 0.9, 0.55), 19.15, 0.70, send=0.4, pan=-0.3, pan_to=0.3)          # whip
s.place(sub(54, 0.9), 20.0, 0.50, send=0.25)
for i, tt in enumerate([20.3, 20.6, 20.9]):
    s.place(sub(60 - 4 * i, 0.4), tt, 0.60, send=0.15); s.place(wood(170 + 30 * i, 0.12), tt, 0.30, send=0.2)
s.place(sub(44, 1.4), 21.45, 0.26, send=0.3)
for i, tt in enumerate([22.0, 22.45, 22.9]): s.place(glass(hz(81 + 3 * i), 1.0, 0.5), tt, 0.07, pan=[-0.5, 0.5, 0.4][i], send=0.6)
s.place(glass(hz(88), 1.0, 0.5), 23.75, 0.06, send=0.6)
s.place(air(1.0, 300, 3000, 1.0, 0.8), 25.9, 0.35, send=0.5)                                     # into the label
s.place(sub(36, 2.2), 26.55, 0.46, send=0.35)
sfx = s.mix(peak_db=-6.0)[:N]

# ── master ─────────────────────────────────────────────────────────────────
music = np.stack([hp(music[:, c], 30) for c in (0, 1)], 1); music /= np.abs(music).max() + 1e-9
# duck the music a little under the big hits
duck = np.ones(N)
for tt in [6.4, 15.4, 20.0, 20.3, 20.6, 20.9, 26.6]:
    i = int(tt * SR); n = int(0.6 * SR); duck[i:i + n] = np.minimum(duck[i:i + n], 1 - 0.35 * np.exp(-np.arange(n) / SR * 5))
gate = np.ones(N); i0, i1, i2 = int(25.75 * SR), int(26.1 * SR), int(26.55 * SR)
gate[i0:i1] = np.linspace(1, 0, i1 - i0) ** 2; gate[i1:i2] = 0
mix = music * 0.42 * (duck * gate)[:, None] + sfx * 0.9
fade = np.ones(N); fade[-int(1.2 * SR):] = np.linspace(1, 0, int(1.2 * SR)) ** 1.5; mix *= fade[:, None]
mix = np.tanh(mix / (np.abs(mix).max() + 1e-9) * 1.25) ; mix = mix / np.abs(mix).max() * 10 ** (-4.0 / 20)
import wave
with wave.open(sys.argv[1] if len(sys.argv) > 1 else 'score2.wav', 'wb') as w:
    w.setnchannels(2); w.setsampwidth(2); w.setframerate(SR); w.writeframes((mix * 32767).astype(np.int16).tobytes())
rms = 20 * np.log10(np.sqrt((mix ** 2).mean()) + 1e-12); print(f'ok · peak -4.0 dBFS · rms {rms:.1f} dBFS')
