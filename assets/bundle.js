/* @ds-bundle: {"format":4,"namespace":"Wanta","components":[{"name":"Wordmark"},{"name":"SideNav"},{"name":"Button"},{"name":"Announce"},{"name":"FormatSwitch"},{"name":"CopyField"},{"name":"Plate"},{"name":"Glyph"},{"name":"FeatureRow"}]} */
(function () {
  var React = window.React;
  var h = React.createElement;
  var useState = React.useState, useEffect = React.useEffect, useRef = React.useRef;

  function cx() { return Array.prototype.filter.call(arguments, Boolean).join(" "); }

  // Token readers: every canvas colour comes from tokens.css.
  function token(name) {
    return getComputedStyle(document.documentElement).getPropertyValue("--" + name).trim() || "#000000";
  }
  function rgb(hex) {
    var m = /^#?([0-9a-f]{2})([0-9a-f]{2})([0-9a-f]{2})/i.exec(hex);
    return m ? [parseInt(m[1], 16), parseInt(m[2], 16), parseInt(m[3], 16)] : [0, 0, 0];
  }
  function mix(a, b, t) { return [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t, a[2] + (b[2] - a[2]) * t]; }

  // Seeded RNG + value noise, so a plate is the same picture on every load.
  function rng(seed) {
    var s = seed >>> 0 || 1;
    return function () { s ^= s << 13; s ^= s >>> 17; s ^= s << 5; return ((s >>> 0) % 100000) / 100000; };
  }
  function noise2(seed) {
    var r = rng(seed), N = 256, p = [], g = [], i;
    for (i = 0; i < N; i++) { p[i] = i; g[i] = r(); }
    for (i = N - 1; i > 0; i--) { var j = Math.floor(r() * (i + 1)), t = p[i]; p[i] = p[j]; p[j] = t; }
    function v(x, y) { return g[p[(p[x & 255] + y) & 255]]; }
    function sm(t) { return t * t * (3 - 2 * t); }
    return function (x, y) {
      var xi = Math.floor(x), yi = Math.floor(y), xf = x - xi, yf = y - yi;
      var a = v(xi, yi), b = v(xi + 1, yi), c = v(xi, yi + 1), d = v(xi + 1, yi + 1);
      var u = sm(xf), w = sm(yf);
      return a + (b - a) * u + (c - a) * w + (a - b - c + d) * u * w;
    };
  }
  function fbm(n, x, y) { var s = 0, a = .5, f = 1; for (var o = 0; o < 5; o++) { s += a * n(x * f, y * f); f *= 2.03; a *= .5; } return s; }
  var BAYER = [0, 8, 2, 10, 12, 4, 14, 6, 3, 11, 1, 9, 15, 7, 13, 5];

  function useTheme() {
    var st = useState(0), bump = st[1];
    useEffect(function () {
      var mo = new MutationObserver(function () { bump(function (n) { return n + 1; }); });
      mo.observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme"] });
      var mq = window.matchMedia("(prefers-color-scheme: dark)");
      var on = function () { bump(function (n) { return n + 1; }); };
      mq.addEventListener && mq.addEventListener("change", on);
      return function () { mo.disconnect(); mq.removeEventListener && mq.removeEventListener("change", on); };
    }, []);
    return st[0];
  }

  /* ---------------- Wordmark ---------------- */
  function Wordmark(props) {
    var pill = props.pill, scale = props.scale || 1;
    var kids = [h("span", { key: "t", className: "wn-wordmark-text", style: { "--wn-scale": scale } }, "WANTA")];
    if (pill) {
      kids.push(h("span", { key: "d", className: "wn-wordmark-div", "aria-hidden": true }));
      kids.push(props.avatar
        ? h("img", { key: "a", className: "wn-wordmark-avatar", src: props.avatar, alt: "" })
        : h("span", { key: "a", className: "wn-wordmark-avatar", "aria-hidden": true }));
    }
    return h(props.href ? "a" : "span", { href: props.href, className: cx("wn-wordmark", pill && "is-pill", props.className), "aria-label": "Wanta" }, kids);
  }

  /* ---------------- FormatSwitch: the same page for a person or for an AI agent ---------------- */
  function FormatSwitch(props) {
    var v = props.value || "human";
    function item(id, label, href, type) {
      return h("a", { href: href, type: type, "aria-current": v === id ? "page" : undefined,
        onClick: props.onChange ? function (e) { e.preventDefault(); props.onChange(id); } : undefined }, label);
    }
    return h("div", { className: "wn-format", role: "group", "aria-label": "Формат страницы" },
      item("human", props.humanLabel || "Человек", props.humanHref || "#"),
      item("agent", props.agentLabel || "Агент", props.agentHref || "index.md", "text/markdown"));
  }

  /* ---------------- SideNav ---------------- */
  function Chevron() {
    return h("svg", { className: "wn-nav-chev", viewBox: "0 0 10 10", "aria-hidden": true },
      h("path", { d: "M1.5 3.5 5 7l3.5-3.5", fill: "none", stroke: "currentColor", strokeWidth: 1.4 }));
  }
  function SideNav(props) {
    var items = props.items || [], toc = props.toc || [];
    var initial = props.collapsed == null ? false : props.collapsed;
    var st = useState(!initial), open = st[0], setOpen = st[1];
    useEffect(function () { if (props.collapsed != null) setOpen(!props.collapsed); }, [props.collapsed]);
    var current = items.filter(function (i) { return i.id === props.active; })[0] || items[0] || { label: "" };

    var list = h("ul", { className: "wn-nav-global", id: "wn-nav-global" }, items.map(function (it) {
      return h("li", { key: it.id }, h("a", { href: it.href || "#", "aria-current": it.id === props.active ? "page" : undefined, target: it.external ? "_blank" : undefined, rel: it.external ? "noopener" : undefined },
        it.label, it.external ? h("span", { className: "wn-nav-ext", "aria-hidden": true }, "↗") : null));
    }));

    var global = open ? list : h("button", { type: "button", className: "wn-nav-toggle", "aria-expanded": "false", "aria-controls": "wn-nav-global", onClick: function () { setOpen(true); } }, current.label, h(Chevron));

    var at = toc.map(function (t) { return t.id; }).indexOf(props.activeToc);
    var tocBlock = toc.length ? h(React.Fragment, null,
      h("div", { className: "wn-nav-rule", "aria-hidden": true }),
      h("div", { className: "wn-toc-wrap" },
        h("div", { className: "wn-label" }, props.tocLabel || "На этой странице"),
        h("ol", { className: "wn-toc", style: { "--wn-progress": toc.length > 1 ? Math.max(0, at) / (toc.length - 1) : 0 } },
          h("span", { className: "wn-toc-path", "aria-hidden": true }),
          h("span", { className: "wn-toc-done", "aria-hidden": true }),
          toc.map(function (t, i) {
            return h("li", { key: t.id }, h("a", { href: "#" + t.id, "aria-current": i === at ? "true" : undefined, "data-passed": i < at ? "true" : undefined, onClick: props.onTocClick ? function (e) { e.preventDefault(); props.onTocClick(t.id); } : undefined }, t.label));
          })))) : null;

    return h("nav", { className: cx("wn-nav", props.className), "aria-label": "Навигация по сайту" },
      h(Wordmark, { href: props.homeHref || "#", scale: 1.5 }),
      props.format ? h(FormatSwitch, { value: props.format, onChange: props.onFormat, agentHref: props.agentHref }) : null,
      global, tocBlock);
  }

  /* ---------------- Button ---------------- */
  function Button(props) {
    var v = props.variant || "primary";
    var tag = props.href ? "a" : "button";
    var cell = v === "primary" ? h("span", { className: "wn-btn-cell", "aria-hidden": true }, h("i"))
      : props.external ? h("span", { className: "wn-btn-cell", "aria-hidden": true }, "↗") : null;
    return h(tag, { href: props.href, type: tag === "button" ? "button" : undefined, onClick: props.onClick, className: cx("wn-btn", "wn-btn-" + v, !cell && "is-plain", props.className) }, props.children, cell);
  }

  /* ---------------- Announce ---------------- */
  function Announce(props) {
    return h("div", { className: "wn-announce" },
      h("span", { className: "wn-announce-text" }, h("span", { className: "wn-announce-dot", "aria-hidden": true }), props.children),
      props.actionLabel ? h("a", { href: props.href || "#" }, props.actionLabel, h("span", { "aria-hidden": true }, "↗")) : null);
  }

  /* ---------------- CopyField ---------------- */
  function CopyField(props) {
    var st = useState(false), done = st[0], setDone = st[1];
    function copy() {
      var p = navigator.clipboard && navigator.clipboard.writeText ? navigator.clipboard.writeText(props.value || "") : Promise.reject();
      p.then(function () { setDone(true); setTimeout(function () { setDone(false); }, 1600); }, function () {});
    }
    var m = useState(false), open = m[0], setOpen = m[1];
    var field = h("button", { type: "button", className: "wn-copy", "data-done": done ? "true" : "false", onClick: copy, title: props.value },
      h("span", { className: "wn-copy-text" }, done ? h("b", null, props.doneLabel || "Ссылка скопирована") : h(React.Fragment, null, h("b", null, props.label), props.hint ? h("span", null, " · " + props.hint) : null)),
      h("span", { className: "wn-copy-icon", "aria-hidden": true },
        done ? h("svg", { width: 16, height: 16, viewBox: "0 0 16 16", fill: "none", stroke: "currentColor", strokeWidth: 1.8, strokeLinecap: "round", strokeLinejoin: "round" }, h("path", { d: "M3.5 8.5l3 3 6-7" }))
          : h("svg", { width: 16, height: 16, viewBox: "0 0 16 16", fill: "none", stroke: "currentColor", strokeWidth: 1.5, strokeLinejoin: "round" },
          h("rect", { x: 5.5, y: 5.5, width: 8, height: 8, rx: 2.5 }), h("path", { d: "M10.5 3.5v-.5a1 1 0 0 0-1-1h-6a1 1 0 0 0-1 1v6a1 1 0 0 0 1 1h.5" }))));
    if (!props.menu || !props.menu.length) return field;
    return h("div", { className: "wn-copy-group" }, field,
      h("button", { type: "button", className: "wn-copy-more", "aria-expanded": open ? "true" : "false", "aria-label": props.menuLabel || "Открыть в ИИ-ассистенте", onClick: function () { setOpen(!open); } },
        h("svg", { width: 12, height: 12, viewBox: "0 0 10 10", "aria-hidden": true }, h("path", { d: "M1.5 3.5 5 7l3.5-3.5", fill: "none", stroke: "currentColor", strokeWidth: 1.5, strokeLinecap: "round", strokeLinejoin: "round" }))),
      open ? h("div", { className: "wn-copy-menu" },
        props.menuTitle ? h("span", { className: "wn-label" }, props.menuTitle) : null,
        props.menu.map(function (it) { return h("a", { key: it.label, href: it.href, target: "_blank", rel: "noopener" }, it.label, h("span", { "aria-hidden": true }, "↗")); })) : null);
  }

  /* ---------------- Plate: duotone "city from above" with saved-place patches ---------------- */
  function drawPlate(cv, opt) {
    var W = 880, H = 400, cell = 2, dpr = Math.min(window.devicePixelRatio || 1, 2);
    cv.width = W * dpr; cv.height = H * dpr;
    var ctx = cv.getContext("2d"); ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    var sh = rgb(token("dusk-shadow")), pr = rgb(token("dusk-print")), gl = rgb(token("dusk-glow")), co = rgb(token("coral"));
    var tones = [sh, mix(sh, pr, .55), pr, mix(pr, gl, .5), gl];
    var n = noise2(opt.seed), n2 = noise2(opt.seed + 7);
    var cols = W / cell, rows = H / cell, img = ctx.createImageData(cols, rows), d = img.data;
    var field = new Float32Array(cols * rows);
    for (var y = 0; y < rows; y++) for (var x = 0; x < cols; x++) {
      var u = x / 70, v = y / 70;
      var wx = fbm(n2, u * .8, v * .8) * 2.2, wy = fbm(n2, u * .8 + 5.2, v * .8 + 1.3) * 2.2;
      var f = fbm(n, u + wx, v + wy);
      f = Math.min(1, Math.max(0, (f - .28) * 2.1));
      field[y * cols + x] = f;
      var lv = f * (tones.length - 1), lo = Math.floor(lv), fr = lv - lo;
      var th = (BAYER[(y & 3) * 4 + (x & 3)] + .5) / 16;
      var c = tones[Math.min(tones.length - 1, lo + (fr > th ? 1 : 0))];
      var k = (y * cols + x) * 4; d[k] = c[0]; d[k + 1] = c[1]; d[k + 2] = c[2]; d[k + 3] = 255;
    }
    // Patches: saved places. Squares on an 8px grid, coral dithered over the plate's shadow.
    var r = rng(opt.seed * 31 + 3), patches = [], tries = 0;
    while (patches.length < opt.patches && tries++ < 400) {
      var s = [40, 48, 56][Math.floor(r() * 3)];
      var px = Math.round((24 + r() * (W - s - 48)) / 8) * 8, py = Math.round((24 + r() * (H - s - 48)) / 8) * 8;
      var ok = patches.every(function (q) { return px + s + 24 < q.x || q.x + q.s + 24 < px || py + s + 24 < q.y || q.y + q.s + 24 < py; });
      if (ok) patches.push({ x: px, y: py, s: s });
    }
    var ptones = [sh, mix(sh, co, .5), co, mix(co, [255, 255, 255], .25)];
    patches.forEach(function (q) {
      var rr = q.s / 2 / cell, ccx = q.x / cell + rr, ccy = q.y / cell + rr;
      for (var y = q.y / cell; y < (q.y + q.s) / cell; y++) for (var x = q.x / cell; x < (q.x + q.s) / cell; x++) {
        if ((x + .5 - ccx) * (x + .5 - ccx) + (y + .5 - ccy) * (y + .5 - ccy) > rr * rr) continue;
        var f = field[y * cols + x], lv = Math.min(.999, f * 1.25) * (ptones.length - 1), lo = Math.floor(lv), fr = lv - lo;
        var th = (BAYER[(y & 3) * 4 + (x & 3)] + .5) / 16;
        var c = ptones[Math.min(ptones.length - 1, lo + (fr > th ? 1 : 0))];
        var k = (y * cols + x) * 4; d[k] = c[0]; d[k + 1] = c[1]; d[k + 2] = c[2];
      }
    });
    var tmp = document.createElement("canvas"); tmp.width = cols; tmp.height = rows; tmp.getContext("2d").putImageData(img, 0, 0);
    ctx.imageSmoothingEnabled = false; ctx.drawImage(tmp, 0, 0, W, H);
    // The one saved place in focus: a hairline frame offset by 4px.
    var a = patches[0];
    if (a && opt.focus) { ctx.strokeStyle = token("coral"); ctx.lineWidth = 1; ctx.beginPath(); ctx.arc(a.x + a.s / 2, a.y + a.s / 2, a.s / 2 + 6, 0, Math.PI * 2); ctx.stroke(); }
  }
  function Plate(props) {
    var ref = useRef(null), theme = useTheme();
    var seed = props.seed || 14, count = props.patches == null ? 9 : props.patches;
    useEffect(function () { if (ref.current) drawPlate(ref.current, { seed: seed, patches: count, focus: props.focus !== false }); }, [seed, count, props.focus, theme]);
    return h("figure", { className: cx("wn-plate", props.className) },
      h("canvas", { ref: ref, role: "img", "aria-label": props.alt || "Иллюстрация: город сверху, отмеченные сохранённые места" }),
      props.caption ? h("figcaption", { className: "wn-label" }, props.caption.map(function (c, i) { return h("span", { key: i }, i === 0 ? h("i", { "aria-hidden": true }) : null, c); })) : null);
  }

  /* ---------------- Glyph: line-art tiles ---------------- */
  var GLYPHS = {
    // save — a wire globe collapsing to one point
    save: function (ctx, S, r, line, faint, pin) {
      var c = S / 2;
      for (var i = 0; i < 11; i++) {
        var rot = i / 11 * Math.PI, ry = S * .34 * Math.abs(Math.cos(i * .37));
        ctx.strokeStyle = i % 3 ? faint : line; ctx.beginPath(); ctx.ellipse(c, c, S * .34, Math.max(2, ry), rot, 0, Math.PI * 2); ctx.stroke();
      }
      ctx.strokeStyle = line; ctx.beginPath(); ctx.ellipse(c, S * .2, S * .2, S * .04, 0, 0, Math.PI * 2); ctx.stroke();
      ctx.fillStyle = pin; ctx.beginPath(); ctx.arc(c, c, 4.5, 0, Math.PI * 2); ctx.fill();
    },
    // near — contour lines of a hill, the saved place at the summit
    near: function (ctx, S, r, line, faint, pin) {
      var n = noise2(Math.floor(r() * 999) + 1), cx0 = S * .55, cy0 = S * .45;
      for (var k = 1; k <= 13; k++) {
        ctx.strokeStyle = k % 4 ? faint : line; ctx.beginPath();
        for (var a = 0; a <= 64; a++) {
          var t = a / 64 * Math.PI * 2, rr = k * S * .03 * (1 + .45 * (n(Math.cos(t) * 1.6 + k * .12, Math.sin(t) * 1.6) - .5));
          var x = cx0 + Math.cos(t) * rr * 1.15, y = cy0 + Math.sin(t) * rr;
          a ? ctx.lineTo(x, y) : ctx.moveTo(x, y);
        }
        ctx.stroke();
      }
      ctx.fillStyle = pin; ctx.beginPath(); ctx.arc(cx0, cy0, 4.5, 0, Math.PI * 2); ctx.fill();
    },
    // act — many wandering paths, one route that commits
    act: function (ctx, S, r, line, faint, pin) {
      var tx = S * .74, ty = S * .3;
      for (var p = 0; p < 22; p++) {
        var x = S * .12 + r() * S * .3, y = S * .5 + r() * S * .38; ctx.strokeStyle = faint; ctx.beginPath(); ctx.moveTo(x, y);
        for (var s = 0; s < 14; s++) { x += (r() - .5) * S * .12 + (tx - x) * .04; y += (r() - .5) * S * .12 + (ty - y) * .04; ctx.lineTo(x, y); }
        ctx.stroke();
      }
      ctx.strokeStyle = line; ctx.lineWidth = 1.4; ctx.beginPath(); ctx.moveTo(S * .2, S * .78);
      ctx.bezierCurveTo(S * .5, S * .8, S * .4, S * .32, tx, ty); ctx.stroke();
      ctx.fillStyle = pin; ctx.beginPath(); ctx.arc(tx, ty, 4.5, 0, Math.PI * 2); ctx.fill();
    }
  };
  function Glyph(props) {
    var ref = useRef(null), theme = useTheme(), kind = props.kind || "save", size = props.size || 128;
    useEffect(function () {
      var cv = ref.current; if (!cv) return;
      var dpr = Math.min(window.devicePixelRatio || 1, 2); cv.width = size * dpr; cv.height = size * dpr;
      var ctx = cv.getContext("2d"); ctx.setTransform(dpr, 0, 0, dpr, 0, 0); ctx.clearRect(0, 0, size, size); ctx.lineWidth = .8;
      var w = rgb(token("print-white")), g = rgb(token("dusk-glow"));
      var line = "rgba(" + w.join(",") + ",.95)", faint = "rgba(" + g.join(",") + ",.75)";
      (GLYPHS[kind] || GLYPHS.save)(ctx, size, rng((props.seed || 5) * 97), line, faint, token("coral"));
    }, [kind, size, props.seed, theme]);
    return h("canvas", { ref: ref, className: cx("wn-glyph", props.className), style: { width: size, height: size }, role: "img", "aria-label": props.alt || "" });
  }

  /* ---------------- FeatureRow ---------------- */
  function FeatureRow(props) {
    return h("div", { className: "wn-feature" },
      props.illustration
        ? h("img", { className: "wn-feature-art", src: props.illustration, alt: "", width: 128, height: 128, loading: "lazy", decoding: "async" })
        : h(Glyph, { kind: props.glyph, seed: props.seed }),
      h("div", { style: { minWidth: 0 } }, h("h3", null, props.title), h("p", null, props.children)));
  }

  window.Wanta = Object.assign(window.Wanta || {}, { Wordmark: Wordmark, SideNav: SideNav, Button: Button, Announce: Announce, FormatSwitch: FormatSwitch, CopyField: CopyField, Plate: Plate, Glyph: Glyph, FeatureRow: FeatureRow });
})();
