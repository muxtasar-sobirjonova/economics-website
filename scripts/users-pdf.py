#!/usr/bin/env python3
"""
Turns the Supabase CSV export of the User table into a readable PDF.

    python3 scripts/users-pdf.py <export.csv> [output.pdf]

The CSV is expected to come from this query in the Supabase SQL editor:

    select "name", "email", "activeTrack", "lessonsCompleted", "createdAt"
    from "User" where "deletedAt" is null order by "createdAt" desc;

Any subset of those columns works; unknown columns are carried through.
"""
import csv
import re
import sys
from collections import Counter
from datetime import datetime, timezone
from pathlib import Path

from reportlab.lib import colors
from reportlab.lib.pagesizes import A4, landscape
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.units import mm
from reportlab.platypus import (
    SimpleDocTemplate, Table, TableStyle, Paragraph, Spacer,
)

INK = colors.HexColor("#1B1D2A")
MUTED = colors.HexColor("#5C6072")
FAINT = colors.HexColor("#8A8FA3")
LINE = colors.HexColor("#D9DBE5")
ACCENT = colors.HexColor("#6E5FC4")
SOFT = colors.HexColor("#EEEFF5")

PRETTY = {
    "name": "Name",
    "email": "Email",
    "activeTrack": "Track",
    "lessonsCompleted": "Lessons",
    "createdAt": "Registered",
}

TRACK_SHORT = {
    "ENTREPRENEURSHIP_ECONOMICS": "Entrepreneurship",
    "DEVELOPMENT_ECONOMICS": "Development",
    "BEHAVIORAL_ECONOMICS": "Behavioral",
}


def tidy(col: str, value: str) -> str:
    v = (value or "").strip()
    if not v:
        return "—"
    if col == "activeTrack":
        return TRACK_SHORT.get(v, v.replace("_", " ").title())
    if col == "createdAt":
        # Supabase writes a two-digit offset (+00); %z wants +0000 or +00:00.
        s = v.replace("Z", "+00:00")
        if re.search(r"[+-]\d{2}$", s):
            s += ":00"
        for fmt in ("%Y-%m-%d %H:%M:%S.%f%z", "%Y-%m-%d %H:%M:%S%z",
                    "%Y-%m-%dT%H:%M:%S.%f%z", "%Y-%m-%dT%H:%M:%S%z",
                    "%Y-%m-%d %H:%M:%S", "%Y-%m-%d"):
            try:
                return datetime.strptime(s, fmt).strftime("%d %b %Y")
            except ValueError:
                continue
        return v[:10]
    return v


def main() -> int:
    if len(sys.argv) < 2:
        print(__doc__.strip())
        return 1

    src = Path(sys.argv[1])
    if not src.exists():
        print(f"Not found: {src}")
        return 1
    out = Path(sys.argv[2]) if len(sys.argv) > 2 else src.with_suffix(".pdf")

    with src.open(newline="", encoding="utf-8-sig") as fh:
        rows = list(csv.DictReader(fh))

    if not rows:
        print("The CSV has no rows.")
        return 1

    cols = list(rows[0].keys())

    styles = getSampleStyleSheet()
    h1 = ParagraphStyle("h1", parent=styles["Title"], fontName="Helvetica-Bold",
                        fontSize=20, textColor=INK, alignment=0, spaceAfter=2)
    sub = ParagraphStyle("sub", parent=styles["Normal"], fontName="Helvetica",
                         fontSize=9.5, textColor=MUTED, spaceAfter=14)
    lead = ParagraphStyle("lead", parent=styles["Normal"], fontName="Helvetica",
                          fontSize=10.5, textColor=INK, spaceAfter=10)
    cell = ParagraphStyle("cell", parent=styles["Normal"], fontName="Helvetica",
                          fontSize=8.5, leading=11, textColor=INK)
    head = ParagraphStyle("head", parent=cell, fontName="Helvetica-Bold",
                          fontSize=7.5, textColor=FAINT)

    doc = SimpleDocTemplate(
        str(out), pagesize=landscape(A4),
        leftMargin=16 * mm, rightMargin=16 * mm,
        topMargin=14 * mm, bottomMargin=14 * mm,
        title="Registered users", author="That's So Econ",
    )

    story = [
        Paragraph("Registered users", h1),
        Paragraph(
            f"That&#8217;s So Econ &#183; {len(rows)} active accounts &#183; "
            f"exported {datetime.now(timezone.utc).strftime('%d %B %Y')}",
            sub,
        ),
    ]

    if "activeTrack" in cols:
        counts = Counter(tidy("activeTrack", r.get("activeTrack", "")) for r in rows)
        breakdown = " &#183; ".join(f"{k}: <b>{v}</b>" for k, v in counts.most_common())
        story.append(Paragraph(f"By track &#8212; {breakdown}", lead))

    if "lessonsCompleted" in cols:
        done = [int(r["lessonsCompleted"]) for r in rows
                if (r.get("lessonsCompleted") or "").strip().isdigit()]
        if done:
            started = sum(1 for d in done if d > 0)
            story.append(Paragraph(
                f"Progress &#8212; <b>{started}</b> of {len(rows)} have completed at least one lesson; "
                f"most lessons by one account: <b>{max(done)}</b>.", lead))

    story.append(Spacer(1, 6))

    data = [[Paragraph(PRETTY.get(c, c), head) for c in cols]]
    for r in rows:
        data.append([Paragraph(tidy(c, r.get(c, "")), cell) for c in cols])

    # Give names and emails the room; keep the numeric columns tight.
    weights = {"name": 3.0, "email": 4.0, "activeTrack": 2.0,
               "lessonsCompleted": 1.2, "createdAt": 1.8}
    total_w = doc.width
    ws = [weights.get(c, 2.0) for c in cols]
    widths = [total_w * w / sum(ws) for w in ws]

    table = Table(data, colWidths=widths, repeatRows=1)
    table.setStyle(TableStyle([
        ("BACKGROUND", (0, 0), (-1, 0), SOFT),
        ("LINEBELOW", (0, 0), (-1, 0), 0.8, ACCENT),
        ("GRID", (0, 1), (-1, -1), 0.4, LINE),
        ("VALIGN", (0, 0), (-1, -1), "MIDDLE"),
        ("TOPPADDING", (0, 0), (-1, -1), 5),
        ("BOTTOMPADDING", (0, 0), (-1, -1), 5),
        ("LEFTPADDING", (0, 0), (-1, -1), 6),
        ("RIGHTPADDING", (0, 0), (-1, -1), 6),
        ("ROWBACKGROUNDS", (0, 1), (-1, -1), [colors.white, colors.HexColor("#FAFAFE")]),
    ]))
    story.append(table)

    story.append(Spacer(1, 10))
    story.append(Paragraph(
        "Contains personal data &#8212; names and email addresses. Keep it off shared drives and out of chats.",
        ParagraphStyle("foot", parent=sub, textColor=FAINT, fontSize=8, spaceAfter=0)))

    def stamp(canvas, _doc):
        canvas.saveState()
        canvas.setFont("Helvetica", 7.5)
        canvas.setFillColor(FAINT)
        canvas.drawRightString(landscape(A4)[0] - 16 * mm, 9 * mm, f"Page {canvas.getPageNumber()}")
        canvas.restoreState()

    doc.build(story, onFirstPage=stamp, onLaterPages=stamp)
    print(f"Wrote {out}  ({len(rows)} rows)")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
