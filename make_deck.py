"""
AIstate Pitch Deck generator — 6 slides
Run: python make_deck.py
Output: AIstate_Pitch_Deck.pptx in the same folder
"""
from pptx import Presentation
from pptx.util import Inches, Pt
from pptx.dml.color import RGBColor
from pptx.enum.text import PP_ALIGN
from pptx.enum.shapes import MSO_AUTO_SHAPE_TYPE

prs = Presentation()
prs.slide_width  = Inches(13.33)
prs.slide_height = Inches(7.50)

# ── Palette ──────────────────────────────────────────────────────────────────
NAVY    = RGBColor(0x0f, 0x22, 0x40)
NAVY2   = RGBColor(0x1a, 0x34, 0x58)
NAVY3   = RGBColor(0x0d, 0x1c, 0x34)
BRAND   = RGBColor(0x26, 0x7b, 0xd1)
WHITE   = RGBColor(0xFF, 0xFF, 0xFF)
SLATE   = RGBColor(0x94, 0xa3, 0xb8)
LIGHT   = RGBColor(0xf1, 0xf5, 0xf9)
MUTED   = RGBColor(0x64, 0x74, 0x8b)
RED     = RGBColor(0xef, 0x44, 0x44)
AMBER   = RGBColor(0xf5, 0x9e, 0x0b)
SKY     = RGBColor(0x38, 0xbd, 0xf8)
GREEN   = RGBColor(0x22, 0xc5, 0x5e)
PURPLE  = RGBColor(0xa8, 0x55, 0xf7)

BLANK = prs.slide_layouts[6]   # blank layout

# ── Helpers ──────────────────────────────────────────────────────────────────
def rect(slide, l, t, w, h, fill=None, line=None):
    s = slide.shapes.add_shape(
        MSO_AUTO_SHAPE_TYPE.RECTANGLE,
        Inches(l), Inches(t), Inches(w), Inches(h)
    )
    if fill:
        s.fill.solid(); s.fill.fore_color.rgb = fill
    else:
        s.fill.background()
    if line:
        s.line.color.rgb = line
    else:
        s.line.fill.background()
    return s

def oval(slide, l, t, w, h, fill):
    s = slide.shapes.add_shape(
        MSO_AUTO_SHAPE_TYPE.OVAL,
        Inches(l), Inches(t), Inches(w), Inches(h)
    )
    s.fill.solid(); s.fill.fore_color.rgb = fill
    s.line.fill.background()
    return s

def txt(slide, text, l, t, w, h, size=14, bold=False,
        color=WHITE, align=PP_ALIGN.LEFT, italic=False, wrap=True):
    tb = slide.shapes.add_textbox(Inches(l), Inches(t), Inches(w), Inches(h))
    tb.word_wrap = wrap
    tf = tb.text_frame; tf.word_wrap = wrap
    p = tf.paragraphs[0]; p.alignment = align
    r = p.add_run()
    r.text   = text
    r.font.size   = Pt(size)
    r.font.bold   = bold
    r.font.italic = italic
    r.font.color.rgb = color
    return tb

# ─────────────────────────────────────────────────────────────────────────────
# SLIDE 1  ·  TITLE
# ─────────────────────────────────────────────────────────────────────────────
s1 = prs.slides.add_slide(BLANK)
rect(s1, 0, 0, 13.33, 7.5, NAVY)
rect(s1, 0, 0, 0.10,  7.5, BRAND)          # brand left strip

oval(s1, 9.8, -1.8, 6.0, 6.0, NAVY2)       # decorative circle top-right
oval(s1, -1.2, 5.8,  3.5, 3.5, NAVY2)      # decorative circle bottom-left

# accent dot
rect(s1, 1.2, 0.55, 0.35, 0.06, BRAND)

txt(s1, "MOMENI",  1.2, 0.7,  5, 0.45, size=11, bold=True,  color=BRAND)
txt(s1, "AIstate", 1.2, 1.35, 10, 1.65, size=80, bold=True,  color=WHITE)
txt(s1, "Intelligent Property Management, Built for Real Estate Managers",
    1.2, 3.15, 9.5, 0.65, size=22, color=SLATE)
txt(s1, "AI email triage  ·  Smart scheduling  ·  Tenant case history  ·  Drag-and-drop calendar",
    1.2, 3.9, 11, 0.45, size=13, color=RGBColor(0x60, 0x82, 0xa5))

rect(s1, 1.2, 4.8, 3.2, 0.05, BRAND)
txt(s1, "Prototype  ·  June 2026", 1.2, 5.0, 6, 0.38, size=11, color=MUTED)

# ─────────────────────────────────────────────────────────────────────────────
# SLIDE 2  ·  PROBLEM  (Desirability 25%)
# ─────────────────────────────────────────────────────────────────────────────
s2 = prs.slides.add_slide(BLANK)
rect(s2, 0,   0, 5.2,  7.5, NAVY)
rect(s2, 5.2, 0, 8.13, 7.5, WHITE)
rect(s2, 0,   0, 0.10, 7.5, BRAND)

txt(s2, "01  ·  PROBLEM", 0.5, 0.45, 4.5, 0.35, size=10, bold=True, color=BRAND)
txt(s2, "Property managers are drowning in noise",
    0.5, 0.95, 4.4, 1.5, size=26, bold=True, color=WHITE)

# user quote card
rect(s2, 0.45, 3.6, 4.4, 2.1, NAVY2)
rect(s2, 0.45, 3.6, 0.06, 2.1, BRAND)
txt(s2, '"I spend more time sorting emails than solving actual tenant problems."',
    0.65, 3.75, 4.0, 1.1, size=12, italic=True, color=WHITE)
txt(s2, "— Tim Parker, Real Estate Manager · MOMENI",
    0.65, 4.9, 4.0, 0.4, size=10, bold=True, color=BRAND)

# right panel — pain-point cards
txt(s2, "The Reality", 5.7, 0.45, 7, 0.5, size=17, bold=True, color=NAVY)

pain = [
    (RED,   "Critical emails go unnoticed",
             "Safety issues like gas leaks buried under routine requests"),
    (AMBER, "50+ emails a day, zero prioritisation",
             "No way to see what needs action vs. what can wait"),
    (BRAND, "Calendar chaos",
             "Tasks manually re-created from emails — copy-paste every time"),
    (MUTED, "No tenant context",
             "Every interaction starts from scratch — no case history"),
]
py = 1.1
for col, title, desc in pain:
    rect(s2, 5.5, py, 7.55, 1.0, LIGHT)
    rect(s2, 5.5, py, 0.07, 1.0, col)
    txt(s2, title, 5.75, py + 0.08, 7.1, 0.4, size=13, bold=True, color=NAVY)
    txt(s2, desc,  5.75, py + 0.52, 7.1, 0.38, size=11, color=MUTED)
    py += 1.12

# ─────────────────────────────────────────────────────────────────────────────
# SLIDE 3  ·  SOLUTION  (Solution 20%)
# ─────────────────────────────────────────────────────────────────────────────
s3 = prs.slides.add_slide(BLANK)
rect(s3, 0, 0, 13.33, 7.5, LIGHT)
rect(s3, 0, 0, 13.33, 1.15, NAVY)
rect(s3, 0, 0, 0.10,  7.5,  BRAND)

txt(s3, "02  ·  SOLUTION", 0.4, 0.18, 5, 0.35, size=10, bold=True, color=BRAND)
txt(s3, "One intelligent command centre for property management",
    0.4, 0.58, 12.5, 0.52, size=22, bold=True, color=WHITE)

# 6 feature cards  3 × 2
feats = [
    (RED,    "P1–P4 Smart Inbox",
             "AI classifies every email by severity.\nSafety alerts surface instantly."),
    (BRAND,  "AI Draft Replies",
             "One-click replies with full tenant\ncontext — signed by the manager."),
    (AMBER,  "Drag-and-Drop Calendar",
             "Tasks auto-generated from emails.\nDrag to reschedule, no typing needed."),
    (GREEN,  "Tenant Case Drawer",
             "Lease, rent, complaints, repairs,\ntimeline — one slide-over panel."),
    (SKY,    "File Intelligence",
             "Upload a lease or invoice — AI extracts\ndates, rent, clauses automatically."),
    (PURPLE, "Global Search",
             "Search tenants, emails, files, tasks\nand notes — all from one bar."),
]
cw, ch = 3.85, 2.0
gx, gy = 0.24, 0.28
ox, oy = 0.4, 1.32

for i, (accent, title, desc) in enumerate(feats):
    col, row = i % 3, i // 3
    x = ox + col * (cw + gx)
    y = oy + row * (ch + gy)
    rect(s3, x,        y,    cw,   ch,   WHITE)
    rect(s3, x,        y,    0.07, ch,   accent)
    txt(s3, title, x+0.2, y+0.2,  cw-0.35, 0.45, size=14, bold=True, color=NAVY)
    txt(s3, desc,  x+0.2, y+0.7,  cw-0.35, 1.15, size=11, color=MUTED)

# ─────────────────────────────────────────────────────────────────────────────
# SLIDE 4  ·  PROTOTYPE  (Prototype 25%)
# ─────────────────────────────────────────────────────────────────────────────
s4 = prs.slides.add_slide(BLANK)
rect(s4, 0, 0, 13.33, 7.5, WHITE)
rect(s4, 0, 0, 13.33, 1.05, NAVY)
rect(s4, 0, 0, 0.10,  7.5,  BRAND)

txt(s4, "03  ·  PROTOTYPE", 0.4, 0.17, 5, 0.35, size=10, bold=True, color=BRAND)
txt(s4, "Built, validated, and running — live demo ready",
    0.4, 0.55, 12, 0.46, size=22, bold=True, color=WHITE)

# left — feature checklist
chk = [
    ("Dashboard",      "Priority summary cards → urgent emails → today's tasks → notes pad"),
    ("Email Inbox",    "Chronological + filters, AI classification, manual override, draft"),
    ("Calendar",       "Daily slots / Weekly columns / Monthly grid — all drag-and-drop"),
    ("File Upload",    "Real .txt/.csv/.json read; PDF/image object-URL preview + AI fields"),
    ("Tenant Drawer",  "Lease · rent · complaints · repairs · timeline — one slide-over"),
    ("Global Search",  "Cross-entity: tenants, emails, files, tasks, notes — instant results"),
]
cy = 1.22
for feat, detail in chk:
    rect(s4, 0.35, cy + 0.04, 0.06, 0.42, BRAND)
    txt(s4, feat,   0.58, cy,        4.5, 0.4,  size=13, bold=True, color=NAVY)
    txt(s4, detail, 0.58, cy + 0.4,  6.0, 0.38, size=10, color=MUTED)
    cy += 0.87

# right — stat boxes
stats = [
    ("0",    "API calls",    "Fully self-contained"),
    ("10",   "Mock tenants", "Complete case history"),
    ("4-tier","AI Priority", "P1 Safety → P4 Low"),
    ("100%", "Frontend",     "npm run dev — that's it"),
]
sx, sy = 7.8, 1.22
for val, label, sub in stats:
    rect(s4, sx, sy, 2.7, 1.3, LIGHT)
    rect(s4, sx, sy, 2.7, 0.06, BRAND)
    txt(s4, val,   sx+0.1, sy+0.1,  2.5, 0.6,  size=26, bold=True, color=NAVY, align=PP_ALIGN.CENTER)
    txt(s4, label, sx+0.1, sy+0.7,  2.5, 0.35, size=12, bold=True, color=NAVY, align=PP_ALIGN.CENTER)
    txt(s4, sub,   sx+0.1, sy+1.0,  2.5, 0.28, size=10, color=MUTED, align=PP_ALIGN.CENTER)
    sy += 1.46

# bottom note
rect(s4, 0.35, 6.75, 12.63, 0.5, RGBColor(0xe0, 0xf2, 0xfe))
txt(s4, "LIVE DEMO:  cd \"C:\\AI STATE\\frontend\"  →  npm run dev  →  open localhost:5173",
    0.55, 6.8, 12.3, 0.4, size=11, bold=False, color=NAVY)

# ─────────────────────────────────────────────────────────────────────────────
# SLIDE 5  ·  IMPACT  (Impact 5%)
# ─────────────────────────────────────────────────────────────────────────────
s5 = prs.slides.add_slide(BLANK)
rect(s5, 0, 0, 13.33, 7.5, NAVY3)
rect(s5, 0, 0, 0.10,  7.5, BRAND)
oval(s5, 8.5, 3.2, 6.0, 6.0, NAVY2)   # decorative bg circle

txt(s5, "04  ·  IMPACT", 0.5, 0.4, 4.5, 0.35, size=10, bold=True, color=BRAND)
txt(s5, "From one manager to an industry",
    0.5, 0.88, 9.5, 0.72, size=32, bold=True, color=WHITE)
txt(s5, "Property management is underserved by AI — AIstate is purpose-built to scale.",
    0.5, 1.72, 9, 0.46, size=14, color=SLATE)

horizons = [
    (BRAND, "Now",       [
        "Full working prototype",
        "All core flows covered",
        "Zero running cost",
    ]),
    (SKY,   "6 Months",  [
        "Live email & calendar APIs",
        "Real tenant database",
        "Multi-manager logins",
    ]),
    (GREEN, "2+ Years",  [
        "Predictive maintenance AI",
        "Portfolio view (multi-building)",
        "Mobile app for on-site use",
    ]),
]
hx = 0.5
for col, title, pts in horizons:
    rect(s5, hx, 2.55, 3.9, 4.3, NAVY2)
    rect(s5, hx, 2.55, 3.9, 0.08, col)
    txt(s5, title, hx+0.2, 2.7,  3.5, 0.52, size=20, bold=True, color=col)
    py = 3.38
    for pt in pts:
        txt(s5, f"→   {pt}", hx+0.2, py, 3.5, 0.5, size=12, color=WHITE)
        py += 0.62
    hx += 4.25

# ─────────────────────────────────────────────────────────────────────────────
# SLIDE 6  ·  CLOSING / Q&A
# ─────────────────────────────────────────────────────────────────────────────
s6 = prs.slides.add_slide(BLANK)
rect(s6, 0, 0, 13.33, 7.5, NAVY)
rect(s6, 0, 0, 0.10,  7.5, BRAND)

oval(s6, 3.4, 0.8, 6.5, 6.5, NAVY2)   # large centred circle

txt(s6, "MOMENI",  5.4, 1.55, 2.8, 0.5, size=11, bold=True, color=BRAND, align=PP_ALIGN.CENTER)
txt(s6, "AIstate", 3.5, 2.1, 6.5, 1.7, size=72, bold=True, color=WHITE, align=PP_ALIGN.CENTER)
txt(s6, "Every tenant. Every issue. Handled intelligently.",
    3.2, 3.95, 7.0, 0.55, size=16, color=SLATE, align=PP_ALIGN.CENTER)
rect(s6, 5.5, 4.65, 2.5, 0.06, BRAND)

txt(s6, "Questions  &  Live Demo",
    3.5, 4.85, 6.5, 0.55, size=17, bold=True, color=BRAND, align=PP_ALIGN.CENTER)

# summary chips bottom
chips = [
    ("Desirability",    "Problem framed + user insight"),
    ("Solution",        "6 features, clearly differentiated"),
    ("Prototype",       "Live, functional, no backend needed"),
    ("Impact",          "Clear path from demo to product"),
]
cx = 0.5
for label, detail in chips:
    rect(s6, cx, 6.35, 3.0, 0.85, NAVY2)
    txt(s6, label,  cx+0.15, 6.4,  2.7, 0.35, size=11, bold=True, color=BRAND)
    txt(s6, detail, cx+0.15, 6.75, 2.7, 0.35, size=9,  color=SLATE)
    cx += 3.21

# ─────────────────────────────────────────────────────────────────────────────
import os, sys
out = os.path.join(os.path.dirname(os.path.abspath(__file__)), "AIstate_Pitch_Deck.pptx")
prs.save(out)
print(f"Saved to: {out}")
