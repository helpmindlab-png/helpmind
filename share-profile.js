/* share-profile.js
 * Energy Profile PNG generator (no overlap layout)
 * - Canvas render (1080x1350)
 * - Safe footer area (no text overlap)
 * - Korean-safe wrapText (character-based)
 * - Soft/bright aesthetic + readable text shadow
 */

(function () {
  "use strict";

  // ---------- Public API ----------
  // window.MindSparkProfileImage.downloadProfilePNG({ scores, labels, title, subtitle, brand })
  window.MindSparkProfileImage = {
    downloadProfilePNG,
    renderToCanvas, // optional if you want preview in a <canvas>
  };

  // ---------- Defaults ----------
  const DEFAULTS = {
    width: 1080,
    height: 1350,
    title: "에너지 프로파일",
    subtitle: "3가지 흐름을 한눈에",
    brand: "MindSpark",
    footer: "익명 집계 데이터 기반 비교 · 직접적인 인과관계를 단정할 수 없다",
    labels: {
      social: "사회적 에너지",
      recovery: "감정 회복 속도",
      fatigue: "관계 피로도",
    },
    colors: {
      indigo: "rgba(109,94,252,0.95)",
      rose: "rgba(255,111,174,0.95)",
      sky: "rgba(56,189,248,0.95)",
      white: "rgba(255,255,255,0.92)",
      whiteSoft: "rgba(255,255,255,0.78)",
      shadow: "rgba(0,0,0,0.18)",
    },
  };

  // ---------- Main: Download PNG ----------
  async function downloadProfilePNG(options = {}) {
    const cfg = normalizeOptions(options);
    const canvas = document.createElement("canvas");
    canvas.width = cfg.width;
    canvas.height = cfg.height;

    renderToCanvas(canvas, cfg);

    await new Promise((resolve) => {
      canvas.toBlob((blob) => {
        if (!blob) return resolve();
        const a = document.createElement("a");
        a.href = URL.createObjectURL(blob);
        a.download = cfg.filename || "mind-spark-profile.png";
        a.click();
        URL.revokeObjectURL(a.href);
        resolve();
      }, "image/png", 1.0);
    });
  }

  // ---------- Optional: Render into an existing canvas ----------
  function renderToCanvas(canvas, options = {}) {
    const cfg = normalizeOptions(options);
    canvas.width = cfg.width;
    canvas.height = cfg.height;
    const ctx = canvas.getContext("2d");

    // High-quality text rendering
    ctx.textBaseline = "alphabetic";
    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = "high";

    drawBackground(ctx, cfg);
    drawGlassCard(ctx, cfg);
    drawHeader(ctx, cfg);
    drawRadar(ctx, cfg);
    drawBarsAndFooter(ctx, cfg);
  }

  // ---------- Option normalize ----------
  function normalizeOptions(options) {
    const base = structuredClone(DEFAULTS);

    // scores required
    // scores: { socialEnergy: number(1-5), recoverySpeed: number(1-5), relationshipFatigue: number(1-5) }
    const scores = options.scores || {
      socialEnergy: 3.0,
      recoverySpeed: 3.0,
      relationshipFatigue: 3.0,
    };

    base.scores = {
      socialEnergy: clamp(scores.socialEnergy ?? 3.0, 1, 5),
      recoverySpeed: clamp(scores.recoverySpeed ?? 3.0, 1, 5),
      relationshipFatigue: clamp(scores.relationshipFatigue ?? 3.0, 1, 5),
    };

    if (options.width) base.width = options.width;
    if (options.height) base.height = options.height;
    if (options.title) base.title = options.title;
    if (options.subtitle) base.subtitle = options.subtitle;
    if (options.brand) base.brand = options.brand;
    if (options.footer) base.footer = options.footer;
    if (options.filename) base.filename = options.filename;

    if (options.labels) {
      base.labels = { ...base.labels, ...options.labels };
    }
    if (options.colors) {
      base.colors = { ...base.colors, ...options.colors };
    }

    return base;
  }

  // ---------- Draw: Background ----------
  function drawBackground(ctx, cfg) {
    const W = cfg.width;
    const H = cfg.height;

    // base gradient
    const g = ctx.createLinearGradient(0, 0, W, H);
    g.addColorStop(0, "rgba(109,94,252,0.55)");
    g.addColorStop(0.55, "rgba(255,111,174,0.42)");
    g.addColorStop(1, "rgba(255,255,255,0.18)");
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, W, H);

    // soft diagonal sheen
    ctx.globalAlpha = 0.18;
    ctx.fillStyle = "rgba(255,255,255,1)";
    for (let i = -H; i < W; i += 54) {
      ctx.save();
      ctx.translate(i, 0);
      ctx.rotate((-18 * Math.PI) / 180);
      ctx.fillRect(0, 0, 22, H * 1.6);
      ctx.restore();
    }
    ctx.globalAlpha = 1;

    // vignette (soft)
    const v = ctx.createRadialGradient(W * 0.5, H * 0.55, 100, W * 0.5, H * 0.55, H * 0.8);
    v.addColorStop(0, "rgba(255,255,255,0)");
    v.addColorStop(1, "rgba(0,0,0,0.10)");
    ctx.fillStyle = v;
    ctx.fillRect(0, 0, W, H);
  }

  // ---------- Draw: Glass card container ----------
  function drawGlassCard(ctx, cfg) {
    const W = cfg.width;
    const H = cfg.height;

    cfg.card = {
      x: 70,
      y: 90,
      w: W - 140,
      h: H - 180,
      r: 44,
    };

    const { x, y, w, h, r } = cfg.card;

    // Card fill (more opaque for readability)
    ctx.save();
    ctx.fillStyle = "rgba(255,255,255,0.16)";
    roundRect(ctx, x, y, w, h, r);
    ctx.fill();
    ctx.restore();

    // Inner panel (glass)
    ctx.save();
    ctx.fillStyle = "rgba(255,255,255,0.12)";
    ctx.strokeStyle = "rgba(255,255,255,0.35)";
    ctx.lineWidth = 3;
    roundRect(ctx, x, y, w, h, r);
    ctx.fill();
    ctx.stroke();
    ctx.restore();
  }

  // ---------- Draw: Header ----------
  function drawHeader(ctx, cfg) {
    const { x, y, w } = cfg.card;

    // text shadow for readability
    setTextShadow(ctx, cfg.colors.shadow, 12, 0, 6);

    // icon
    ctx.save();
    ctx.fillStyle = "rgba(255,215,92,0.95)";
    ctx.font = "900 64px system-ui, -apple-system, Segoe UI, Roboto, Noto Sans KR";
    ctx.fillText("✨", x + 70, y + 120);
    ctx.restore();

    // title
    ctx.save();
    ctx.fillStyle = cfg.colors.white;
    ctx.font = "900 78px system-ui, -apple-system, Segoe UI, Roboto, Noto Sans KR";
    ctx.fillText(cfg.title, x + 165, y + 125);
    ctx.restore();

    // subtitle
    ctx.save();
    ctx.fillStyle = cfg.colors.whiteSoft;
    ctx.font = "800 44px system-ui, -apple-system, Segoe UI, Roboto, Noto Sans KR";
    ctx.fillText(cfg.subtitle, x + 70, y + 200);
    ctx.restore();

    clearTextShadow(ctx);

    // small label (top-left)
    ctx.save();
    ctx.fillStyle = "rgba(255,255,255,0.78)";
    ctx.font = "800 40px system-ui, -apple-system, Segoe UI, Roboto, Noto Sans KR";
    ctx.fillText(cfg.labels.social, x + 70, y + 260);
    ctx.restore();
  }

  // ---------- Draw: Radar ----------
  function drawRadar(ctx, cfg) {
    const { x, y, w } = cfg.card;
    const W = cfg.width;

    // Radar center area (top-mid)
    const radarCenterX = x + w * 0.52;
    const radarCenterY = y + 520;
    const radius = Math.min(W, cfg.height) * 0.16;

    // axis labels positions
    const labelTop = cfg.labels.social;
    const labelRight = "감정 회복";
    const labelLeft = "관계 피로도";

    // grid triangle (3 axes) - 5 levels
    ctx.save();
    ctx.strokeStyle = "rgba(255,255,255,0.30)";
    ctx.lineWidth = 2;

    for (let lvl = 1; lvl <= 5; lvl++) {
      const rr = (radius * lvl) / 5;
      drawTriangle(ctx, radarCenterX, radarCenterY, rr);
      ctx.stroke();
    }

    // axis lines
    ctx.strokeStyle = "rgba(255,255,255,0.26)";
    ctx.lineWidth = 2;
    const pts = trianglePoints(radarCenterX, radarCenterY, radius);
    ctx.beginPath();
    ctx.moveTo(radarCenterX, radarCenterY);
    ctx.lineTo(pts[0].x, pts[0].y);
    ctx.moveTo(radarCenterX, radarCenterY);
    ctx.lineTo(pts[1].x, pts[1].y);
    ctx.moveTo(radarCenterX, radarCenterY);
    ctx.lineTo(pts[2].x, pts[2].y);
    ctx.stroke();

    // values polygon
    const s = cfg.scores;
    const v1 = mapToRadius(s.socialEnergy, radius);
    const v2 = mapToRadius(s.recoverySpeed, radius);
    const v3 = mapToRadius(s.relationshipFatigue, radius);

    const valPts = trianglePoints(radarCenterX, radarCenterY, 1);
    // We need each axis radius individually:
    const axisPts = trianglePoints(radarCenterX, radarCenterY, radius);

    const pTop = lerpPoint(radarCenterX, radarCenterY, axisPts[0].x, axisPts[0].y, v1 / radius);
    const pRight = lerpPoint(radarCenterX, radarCenterY, axisPts[1].x, axisPts[1].y, v2 / radius);
    const pLeft = lerpPoint(radarCenterX, radarCenterY, axisPts[2].x, axisPts[2].y, v3 / radius);

    ctx.fillStyle = "rgba(109,94,252,0.22)";
    ctx.strokeStyle = "rgba(109,94,252,0.90)";
    ctx.lineWidth = 6;

    ctx.beginPath();
    ctx.moveTo(pTop.x, pTop.y);
    ctx.lineTo(pRight.x, pRight.y);
    ctx.lineTo(pLeft.x, pLeft.y);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();

    // points
    drawPoint(ctx, pTop.x, pTop.y, cfg.colors.indigo);
    drawPoint(ctx, pRight.x, pRight.y, cfg.colors.rose);
    drawPoint(ctx, pLeft.x, pLeft.y, cfg.colors.sky);

    ctx.restore();

    // axis labels (readable)
    setTextShadow(ctx, "rgba(0,0,0,0.14)", 10, 0, 4);
    ctx.fillStyle = "rgba(255,255,255,0.90)";
    ctx.font = "900 44px system-ui, -apple-system, Segoe UI, Roboto, Noto Sans KR";
    ctx.textAlign = "center";
    ctx.fillText(labelTop, radarCenterX, radarCenterY - radius - 30);
    ctx.textAlign = "left";
    ctx.fillText(labelLeft, radarCenterX - radius - 120, radarCenterY + 10);
    ctx.textAlign = "left";
    ctx.fillText(labelRight, radarCenterX + radius - 20, radarCenterY + 10);
    ctx.textAlign = "left";
    clearTextShadow(ctx);
  }

  // ---------- Draw: Bars + Footer (NO OVERLAP) ----------
  function drawBarsAndFooter(ctx, cfg) {
    const { x, y, w, h } = cfg.card;
    const s = cfg.scores;

    // Layout zones: bars zone + footer zone
    // Bars: start near bottom but keep a dedicated footer area
    const footerH = 140;                // reserved footer height
    const barsZoneBottom = y + h - footerH;
    const barsTop = barsZoneBottom - 340; // bars area height

    const rowGap = 110;
    const barH = 26;

    const leftPad = 70;
    const rightPad = 70;
    const labelW = 320;
    const scoreW = 220;

    const labelX = x + leftPad;
    const scoreX = x + w - rightPad;
    const barX = labelX + labelW + 20;
    const barW = w - leftPad - rightPad - labelW - 20 - scoreW;

    // text style
    setTextShadow(ctx, "rgba(0,0,0,0.16)", 10, 0, 4);
    ctx.fillStyle = "rgba(255,255,255,0.92)";

    // rows
    drawMetricRow(ctx, cfg, {
      i: 0,
      top: barsTop,
      rowGap,
      label: cfg.labels.social,
      score: s.socialEnergy,
      color: cfg.colors.indigo,
      labelX, barX, barW, barH, scoreX
    });

    drawMetricRow(ctx, cfg, {
      i: 1,
      top: barsTop,
      rowGap,
      label: cfg.labels.recovery,
      score: s.recoverySpeed,
      color: cfg.colors.rose,
      labelX, barX, barW, barH, scoreX
    });

    drawMetricRow(ctx, cfg, {
      i: 2,
      top: barsTop,
      rowGap,
      label: cfg.labels.fatigue,
      score: s.relationshipFatigue,
      color: cfg.colors.sky,
      labelX, barX, barW, barH, scoreX
    });

    clearTextShadow(ctx);

    // Footer: wrapped text on left + brand on right
    const footerTop = barsZoneBottom + 36;

    setTextShadow(ctx, "rgba(0,0,0,0.14)", 10, 0, 4);
    ctx.fillStyle = "rgba(255,255,255,0.84)";
    ctx.font = "850 30px system-ui, -apple-system, Segoe UI, Roboto, Noto Sans KR";
    ctx.textAlign = "left";

    // Keep footer text from colliding with brand by limiting width
    const footerMaxW = w - leftPad - rightPad - 220;
    wrapKorean(ctx, cfg.footer, x + leftPad, footerTop, footerMaxW, 38);

    ctx.textAlign = "right";
    ctx.fillStyle = "rgba(255,255,255,0.78)";
    ctx.font = "900 34px system-ui, -apple-system, Segoe UI, Roboto, Noto Sans KR";
    ctx.fillText(cfg.brand, x + w - rightPad, y + h - 70);

    ctx.textAlign = "left";
    clearTextShadow(ctx);
  }

  function drawMetricRow(ctx, cfg, p) {
    const yy = p.top + p.i * p.rowGap;

    // Label
    setTextShadow(ctx, cfg.colors.shadow, 10, 0, 4);
    ctx.fillStyle = "rgba(255,255,255,0.92)";
    ctx.font = "900 44px system-ui, -apple-system, Segoe UI, Roboto, Noto Sans KR";
    ctx.textAlign = "left";
    ctx.fillText(p.label, p.labelX, yy);

    // Score (right aligned)
    ctx.textAlign = "right";
    ctx.font = "900 44px system-ui, -apple-system, Segoe UI, Roboto, Noto Sans KR";
    ctx.fillText(`Score ${p.score.toFixed(1)}`, p.scoreX, yy);

    // Bar background
    ctx.textAlign = "left";
    clearTextShadow(ctx);
    ctx.fillStyle = "rgba(255,255,255,0.22)";
    roundRect(ctx, p.barX, yy + 22, p.barW, p.barH, 999);
    ctx.fill();

    // Bar fill
    ctx.fillStyle = p.color;
    const fillW = Math.max(18, (p.score / 5) * p.barW);
    roundRect(ctx, p.barX, yy + 22, fillW, p.barH, 999);
    ctx.fill();
  }

  // ---------- Helpers ----------
  function clamp(v, min, max) {
    return Math.max(min, Math.min(max, Number(v)));
  }

  function roundRect(ctx, x, y, w, h, r) {
    const rr = Math.min(r, w / 2, h / 2);
    ctx.beginPath();
    ctx.moveTo(x + rr, y);
    ctx.arcTo(x + w, y, x + w, y + h, rr);
    ctx.arcTo(x + w, y + h, x, y + h, rr);
    ctx.arcTo(x, y + h, x, y, rr);
    ctx.arcTo(x, y, x + w, y, rr);
    ctx.closePath();
  }

  function setTextShadow(ctx, color, blur, offsetX, offsetY) {
    ctx.shadowColor = color;
    ctx.shadowBlur = blur;
    ctx.shadowOffsetX = offsetX;
    ctx.shadowOffsetY = offsetY;
  }
  function clearTextShadow(ctx) {
    ctx.shadowColor = "transparent";
    ctx.shadowBlur = 0;
    ctx.shadowOffsetX = 0;
    ctx.shadowOffsetY = 0;
  }

  // Korean-friendly wrap: character-based (handles no-spaces Korean)
  function wrapKorean(ctx, text, x, y, maxWidth, lineHeight) {
    let line = "";
    let yy = y;

    for (let i = 0; i < text.length; i++) {
      const testLine = line + text[i];
      const w = ctx.measureText(testLine).width;
      if (w > maxWidth && line.length > 0) {
        ctx.fillText(line, x, yy);
        line = text[i];
        yy += lineHeight;
      } else {
        line = testLine;
      }
    }
    if (line) ctx.fillText(line, x, yy);
    return yy;
  }

  function trianglePoints(cx, cy, r) {
    // Up, right-bottom, left-bottom (equilateral triangle)
    const a1 = (-90 * Math.PI) / 180;
    const a2 = (30 * Math.PI) / 180;
    const a3 = (150 * Math.PI) / 180;
    return [
      { x: cx + r * Math.cos(a1), y: cy + r * Math.sin(a1) },
      { x: cx + r * Math.cos(a2), y: cy + r * Math.sin(a2) },
      { x: cx + r * Math.cos(a3), y: cy + r * Math.sin(a3) },
    ];
  }

  function drawTriangle(ctx, cx, cy, r) {
    const pts = trianglePoints(cx, cy, r);
    ctx.beginPath();
    ctx.moveTo(pts[0].x, pts[0].y);
    ctx.lineTo(pts[1].x, pts[1].y);
    ctx.lineTo(pts[2].x, pts[2].y);
    ctx.closePath();
  }

  function lerpPoint(x1, y1, x2, y2, t) {
    return { x: x1 + (x2 - x1) * t, y: y1 + (y2 - y1) * t };
  }

  function mapToRadius(score, maxR) {
    // score is 1..5 => map to 0.15..1.0 of radius (so minimum isn't too tiny)
    const t = (score - 1) / 4; // 0..1
    return maxR * (0.18 + t * 0.82);
  }

  function drawPoint(ctx, x, y, color) {
    ctx.save();
    ctx.fillStyle = color;
    ctx.strokeStyle = "rgba(255,255,255,0.90)";
    ctx.lineWidth = 4;

    ctx.beginPath();
    ctx.arc(x, y, 11, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();

    ctx.restore();
  }
})();
