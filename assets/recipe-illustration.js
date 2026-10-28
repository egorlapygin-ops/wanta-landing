(function () {
  var h = React.createElement;

  function TiltCard(props) {
    var ref = React.useRef(null);
    React.useEffect(function () {
      var element = ref.current;
      var motion = window.matchMedia("(min-width: 761px) and (hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference)");
      var frame = 0, x = 0, y = 0;
      var strength = 10;

      function reset() {
        cancelAnimationFrame(frame); frame = 0;
        element.classList.remove("is-tilting");
        ["--tilt-x", "--tilt-y"].forEach(function (name) {
          element.style.removeProperty(name);
        });
      }
      function draw() {
        frame = 0;
        element.style.setProperty("--tilt-x", (-y * strength).toFixed(2) + "deg");
        element.style.setProperty("--tilt-y", (x * strength).toFixed(2) + "deg");
      }
      function move(event) {
        if (!motion.matches || event.pointerType !== "mouse") return;
        // Measure the stationary wrapper so the tilt cannot move its own target.
        var box = element.getBoundingClientRect();
        if (!box.width || !box.height) return;
        x = Math.max(-1, Math.min(1, (event.clientX - box.left) / box.width * 2 - 1));
        y = Math.max(-1, Math.min(1, (event.clientY - box.top) / box.height * 2 - 1));
        element.classList.add("is-tilting");
        if (!frame) frame = requestAnimationFrame(draw);
      }

      element.addEventListener("pointerenter", move);
      element.addEventListener("pointermove", move);
      element.addEventListener("pointerleave", reset);
      element.addEventListener("pointercancel", reset);
      motion.addEventListener("change", reset);
      window.addEventListener("blur", reset);
      return function () {
        reset();
        element.removeEventListener("pointerenter", move);
        element.removeEventListener("pointermove", move);
        element.removeEventListener("pointerleave", reset);
        element.removeEventListener("pointercancel", reset);
        motion.removeEventListener("change", reset);
        window.removeEventListener("blur", reset);
      };
    }, [props.kind]);
    return h("div", { ref: ref, className: "recipe-tilt recipe-tilt-" + props.kind }, props.children);
  }

  function ReelArt() {
    return h("svg", { className: "recipe-reel-art", viewBox: "0 0 160 160", fill: "none", strokeLinecap: "round", strokeLinejoin: "round" },
      h("g", { stroke: "var(--dusk-glow)", strokeWidth: 1 },
        h("circle", { cx: 80, cy: 80, r: 68, strokeDasharray: "2 6" }),
        h("path", { d: "M48 35c-8 10 9 13 1 23M76 24c-9 11 10 14 1 26M101 36c-8 10 9 13 1 22" }),
        h("path", { d: "M31 128h98M43 136h74" })),
      h("g", { stroke: "var(--print-white)", strokeWidth: 1.6 },
        h("ellipse", { cx: 80, cy: 91, rx: 54, ry: 19 }),
        h("path", { d: "M26 91c7 26 26 35 54 35s47-9 54-35" }),
        h("path", { d: "M45 91c6-12 20 8 26-3s20 11 29-2 14 1 15 6M47 100c7-12 19 5 29-6s15 11 23 1M55 81c10-8 15 9 23 1s16 5 22 0" }),
        h("path", { d: "M112 78l21-32M126 43l10 7M130 38l10 7M134 33l10 7M126 43l8-10M131 47l8-11M136 50l8-10" }),
        h("path", { d: "M82 74c-13-17-28-8-19 4 7 8 19-4 19-4ZM82 74c8-19 24-15 20-1-3 9-20 1-20 1Z" })));
  }

  var MARKETS = {
    ozon: { name: "Ozon", url: "https://www.ozon.ru/search/?text=" },
    wb: { name: "Wildberries", url: "https://www.wildberries.ru/catalog/0/search.aspx?search=" },
    market: { name: "Яндекс Маркет", url: "https://market.yandex.ru/search?text=" }
  };
  var PRODUCTS = [
    { kind: "shirt", name: "Голубая рубашка", market: "ozon", article: "OZ-001", query: "рубашка женская голубая оверсайз" },
    { kind: "trousers", name: "Широкие брюки", market: "wb", article: "WB-002", query: "брюки женские широкие бежевые" },
    { kind: "bag", name: "Сумка-багет", market: "market", article: "YM-003", query: "сумка багет бордовая" }
  ];
  // Public VkusVill catalog prices checked on 2026-10-28; final prices are set by VkusVill.
  // Product kinds match the allowlist in lib/vkusvill-cart.mjs.
  var GROCERIES = [
    { kind: "pasta", name: "Паста «Паппарделле»", detail: "с яйцом", price: 215 },
    { kind: "tomatoes", name: "Томаты черри", detail: "400 г", price: 520 },
    { kind: "herbs", name: "Итальянские травы", detail: "12 г", price: 74 }
  ];

  function MarketLogo(props) {
    return h("span", { className: "market-logo market-logo-" + props.market, "aria-hidden": true },
      props.market === "ozon" ? "OZON" : props.market === "wb" ? "WB" : "М");
  }

  function FashionItem(props) {
    var art;
    if (props.kind === "bag") {
      art = h("g", { stroke: "#432c32", strokeWidth: 1.5, strokeLinejoin: "round" },
        h("path", { d: "M27 51 35 17Q60 2 85 17L94 51", fill: "none", strokeWidth: 4 }),
        h("path", { d: "M18 46Q60 39 102 46L97 80Q60 91 23 80Z", fill: "#4c303a" }),
        h("path", { d: "m20 48 5 13Q60 69 95 61l5-13", fill: "#66454e" }),
        h("path", { d: "M27 76q33 7 66 0", stroke: "#946e75", fill: "none" }),
        h("rect", { x: 54, y: 59, width: 12, height: 6, rx: 1, fill: "#d2b783", stroke: "none" }));
    } else if (props.kind === "trousers") {
      art = h("g", { stroke: "#938271", strokeWidth: 1.3, strokeLinejoin: "round" },
        h("path", { d: "M38 10h44l12 76-27 4-8-55-7 55-26-4Z", fill: "#c8b8a5" }),
        h("path", { d: "M38 16h45M60 16v19M39 20l9 3m32-3-9 3M40 30l-5 49m42-49 6 49", fill: "none" }),
        h("path", { d: "m42 34-3 42m34-42 5 42", stroke: "#ded3c4", strokeWidth: 3 }));
    } else {
      art = h("g", { stroke: "#759daa", strokeWidth: 1.2, strokeLinejoin: "round" },
        h("path", { d: "m43 17-15 6L9 65l17 8 12-26-3 37q25 8 50 0l-3-37 12 26 17-8-19-42-15-6Z", fill: "#badce8" }),
        h("path", { d: "m43 17 8-6h18l8 6-10 16-7-8-7 8Z", fill: "#d9ecf3" }),
        h("path", { d: "M60 25v61M40 43h13v12H40M14 61l15 7m62 0 15-7", fill: "none" }),
        h("path", { d: "M34 28 23 57M86 28l11 29", fill: "none", stroke: "#e2f2f8", strokeWidth: 3 }),
        [38, 49, 60, 71].map(function (y) { return h("circle", { key: y, cx: 63, cy: y, r: 1, fill: "#759daa", stroke: "none" }); }));
    }
    return h("svg", { viewBox: "0 0 120 100", fill: "none", "aria-hidden": true, focusable: "false" }, art);
  }

  function OutfitArt() {
    return h("span", { className: "recipe-reel-art outfit-art" },
      h("svg", { viewBox: "0 0 240 300", fill: "none", "aria-hidden": true, focusable: "false" },
        h("ellipse", { cx: 128, cy: 278, rx: 46, ry: 6, fill: "#d6cbc3" }),
        h("ellipse", { cx: 124, cy: 149, rx: 69, ry: 122, stroke: "#d2c4b8", strokeDasharray: "2 6" }),
        // A full outfit: loose blue shirt, wide trousers, shoulder bag.
        h("g", { strokeLinecap: "round", strokeLinejoin: "round" },
          h("path", { d: "M108 53q-13-35 13-37 27-3 22 32l-4 19h-30Z", fill: "#302a2a" }),
          h("path", { d: "M115 50h16v23h-16Z", fill: "#ba8268" }),
          h("path", { d: "M109 33q15 7 24-6 9 25-7 32-16 3-17-26Z", fill: "#dca48a" }),
          h("path", { d: "M109 34q-5-22 17-18 19 2 17 23-7-4-13-14-8 10-21 9Z", fill: "#302a2a" }),
          h("path", { d: "m120 47 5 1m-6-9h1m10-1h1", stroke: "#805440", strokeWidth: 1.2 }),
          h("circle", { cx: 110, cy: 44, r: 2, stroke: "#e4be75", strokeWidth: 1.4 }),
          h("path", { d: "M99 143h48l12 119-23 3-13-87-9 87-23-3Z", fill: "#c7b6a2", stroke: "#9c8873", strokeWidth: 1.3 }),
          h("path", { d: "M100 151h48m-27 0 2 27m-18-14-8 89m42-89 13 89", stroke: "#a89580", strokeWidth: 1.2 }),
          h("path", { d: "m105 178-5 69m38-69 9 69", stroke: "#ded0bd", strokeWidth: 3 }),
          h("path", { d: "M92 261h22l3 12-11 3-24-2q-3-7 10-13Zm45 1h22l10 11q0 5-24 3l-9-3Z", fill: "#f5f1e8", stroke: "#a69b8e", strokeWidth: 1.2 }),
          h("path", { d: "m83 272 33 1m23-1 28 1", stroke: "#c9beb0" }),
          h("path", { d: "m112 65-17 7-14 26-11 39 14 7 17-35-4 36q28 11 53-1l-5-38 14 34 16-9-19-52-24-14Z", fill: "#b9dce8", stroke: "#789faa", strokeWidth: 1.3 }),
          h("path", { d: "m112 65 10 10 10-10 8 6-12 17-6-10-7 10-10-17Z", fill: "#dcecf3", stroke: "#789faa", strokeWidth: 1.1 }),
          h("path", { d: "m122 80 3 67M101 94l-2 18m43-18 3 16M105 96h12v14h-12Z", stroke: "#8ab0be", strokeWidth: 1.1 }),
          h("path", { d: "m89 105-11 28m71-34 15 30m-58-7-4 17m32-19 7 21", stroke: "#d8edf4", strokeWidth: 2.4 }),
          h("path", { d: "m71 137-3 12q1 10 6 9l9-16m77-4 4 13q4 7 8 2l-2-16", fill: "#dca48a", stroke: "#b98469", strokeWidth: 1 }),
          h("path", { d: "m140 78 15 68", stroke: "#4c303a", strokeWidth: 3.5 }),
          h("path", { d: "m147 143 25-4 5 25q-13 8-30 5Z", fill: "#573641", stroke: "#39252d", strokeWidth: 1.3 }),
          h("path", { d: "m148 145 24-4-1 13-21 4Z", fill: "#74525b" }),
          h("rect", { x: 158, y: 152, width: 5, height: 3, rx: 1, fill: "#d9bc7d" })),
        h("g", { stroke: "#85736a", strokeWidth: 1, fill: "none" },
          h("path", { d: "m107 105-20-22H72M118 205l-31 25H72m88-72 17-21h9" }),
          [[107, 105], [118, 205], [160, 158]].map(function (point, i) {
            return h("circle", { key: i, cx: point[0], cy: point[1], r: 3, fill: "#fffaf4", stroke: "#6a574e" });
          }))),
      PRODUCTS.map(function (item) {
        return h("span", { key: item.kind, className: "outfit-callout outfit-callout-" + item.kind },
          h(MarketLogo, { market: item.market }),
          h("span", { className: "outfit-article" }, "арт. " + item.article));
      }));
  }

  function GroceryArt(props) {
    var art;
    if (props.kind === "pasta") {
      art = h("g", null,
        h("rect", { x: 12, y: 4, width: 36, height: 54, rx: 6, fill: "#f1e8c9", stroke: "#dad3bd" }),
        h("rect", { x: 16, y: 8, width: 28, height: 46, rx: 3, fill: "#eed074" }),
        [20, 26, 32, 38].map(function (x) {
          return h("path", { key: x, d: "M" + x + " 12q-4 12 1 22t0 17", stroke: "#dca62e", strokeWidth: 3, fill: "none" });
        }),
        h("rect", { x: 12, y: 13, width: 36, height: 21, fill: "#fbf8ea" }),
        h("rect", { x: 12, y: 13, width: 36, height: 5, fill: "#b84a32" }),
        h("path", { d: "M18 23h24m-22 4h20m-17 4h14", stroke: "#9b7550", strokeWidth: 1.3 }));
    } else if (props.kind === "tomatoes") {
      art = h("g", null,
        h("rect", { x: 5, y: 11, width: 50, height: 43, rx: 5, fill: "#2c3427" }),
        [0, 1, 2].map(function (row) {
          return [0, 1, 2, 3].map(function (col) {
            var x = 13 + col * 11, y = 19 + row * 13;
            return h("g", { key: row + "-" + col },
              h("circle", { cx: x, cy: y, r: 6, fill: (row + col) % 2 ? "#eb4a2c" : "#c92e23" }),
              h("circle", { cx: x - 1.5, cy: y - 2, r: 1.4, fill: "#ff9b6c" }),
              h("path", { d: "m" + (x - 3) + " " + (y - 4) + " 3 1 2-2m-2 2 1 2", stroke: "#6b9950", strokeWidth: 1 }));
          });
        }));
    } else {
      art = h("g", null,
        h("path", { d: "M13 4h34l-1 54H14Z", fill: "#d7c5a3", stroke: "#b6a181" }),
        h("path", { d: "M14 9h32M14 53h32", stroke: "#8f8063", strokeWidth: 1.6 }),
        h("rect", { x: 17, y: 15, width: 26, height: 27, rx: 1, fill: "#f0eadc" }),
        h("path", { d: "M22 20h16m-13 4h10", stroke: "#5b624a", strokeWidth: 1.4 }),
        h("path", { d: "m26 36 9-9m-8 7-4-3m7 0-1-4m3 2 5 1m-7 3 5 3", stroke: "#728257", strokeWidth: 1.4 }));
    }
    return h("svg", { viewBox: "0 0 60 64", fill: "none", "aria-hidden": true, focusable: "false" }, art);
  }

  function GroceryBasket() {
    var state = React.useState([1, 1, 1]), quantities = state[0], setQuantities = state[1];
    var loadingState = React.useState(false), loading = loadingState[0], setLoading = loadingState[1];
    var errorState = React.useState(""), error = errorState[0], setError = errorState[1];
    var requestRef = React.useRef(null);
    var count = quantities.reduce(function (sum, quantity) { return sum + quantity; }, 0);
    var total = GROCERIES.reduce(function (sum, item, i) { return sum + item.price * quantities[i]; }, 0);
    var ending = count % 100 >= 11 && count % 100 <= 14 ? "товаров" : count % 10 === 1 ? "товар" : count % 10 >= 2 && count % 10 <= 4 ? "товара" : "товаров";

    React.useEffect(function () {
      return function () { if (requestRef.current) requestRef.current.abort(); };
    }, []);

    function changeQuantity(index, delta) {
      if (requestRef.current) return;
      setError("");
      setQuantities(function (current) {
        return current.map(function (quantity, i) { return i === index ? Math.max(0, Math.min(40, quantity + delta)) : quantity; });
      });
    }

    async function orderBasket() {
      if (!count || requestRef.current) return;
      var controller = new AbortController();
      requestRef.current = controller;
      var timeout = setTimeout(function () { controller.abort(); }, 25000);
      setLoading(true);
      setError("");
      try {
        var selected = {};
        GROCERIES.forEach(function (item, i) { selected[item.kind] = quantities[i]; });
        var response = await fetch("/api/vkusvill-cart", {
          method: "POST", headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ quantities: selected }), signal: controller.signal
        });
        if (!response.ok) throw new Error("Basket unavailable");
        var data = await response.json();
        var url = new URL(data.url);
        if (url.protocol !== "https:" || ["vkusvill.ru", "www.vkusvill.ru"].indexOf(url.hostname) === -1
            || url.username || url.password || url.port || url.pathname !== "/mobile"
            || !url.searchParams.has("basket") || !/^\d+$/.test(url.searchParams.get("share") || "")) {
          throw new Error("Invalid basket link");
        }
        window.location.assign(url.href);
      } catch (failure) {
        setError("Не удалось собрать корзину. Попробуй ещё раз.");
      } finally {
        clearTimeout(timeout);
        requestRef.current = null;
        setLoading(false);
      }
    }

    return h("div", { className: "recipe-basket", role: "group", "aria-label": "Корзина ВкусВилла" },
      h("div", { className: "basket-head" },
        h("span", { className: "basket-title" }, "Корзина"),
        h("span", { className: "basket-brand" }, "ВкусВилл")),
      h("div", { className: "basket-items" }, GROCERIES.map(function (item, i) {
        return h("div", { key: item.kind, className: "basket-item" + (quantities[i] === 0 ? " is-empty" : "") },
          h("span", { className: "basket-thumb" }, h(GroceryArt, { kind: item.kind })),
          h("div", { className: "basket-item-info" },
            h("span", { className: "basket-item-name" }, item.name, " ", h("span", { className: "basket-item-detail" }, item.detail)),
            h("div", { className: "basket-item-bottom" },
              h("span", { className: "basket-item-price" + (i === 0 ? " is-special" : "") }, item.price + " ₽", h("small", null, "/шт")),
              h("div", { className: "basket-quantity", role: "group", "aria-label": "Количество: " + item.name },
                h("button", { type: "button", onClick: function () { changeQuantity(i, -1); }, disabled: loading || quantities[i] === 0, "aria-label": "Уменьшить количество: " + item.name }, "−"),
                h("span", { "aria-live": "polite", "aria-atomic": true }, quantities[i] + " шт"),
                h("button", { type: "button", onClick: function () { changeQuantity(i, 1); }, disabled: loading || quantities[i] === 40, "aria-label": "Увеличить количество: " + item.name }, "+")))));
      })),
      h("div", { className: "basket-order-wrap" },
        h("button", { type: "button", className: "basket-order", onClick: orderBasket, disabled: !count || loading, "aria-busy": loading || undefined, "aria-label": loading ? "Собираем корзину во ВкусВилле" : count ? "Заказать — перейти с выбранными товарами во ВкусВилл" : "Заказать — корзина пуста" },
          h("span", null, loading ? "Собираем корзину…" : "Заказать"),
          h("span", { className: "basket-total-price", "aria-live": "polite", "aria-atomic": true }, total.toLocaleString("ru-RU") + " ₽")),
        h("span", { className: "basket-order-nudge", "aria-hidden": true, hidden: !count || loading },
          // Hand-drawn Cyrillic lettering: «нажми», independent of installed fonts.
          h("svg", { className: "basket-nudge-word", viewBox: "0 0 106 34", fill: "none", stroke: "currentColor", strokeWidth: 1.8, strokeLinecap: "round", strokeLinejoin: "round", focusable: "false" },
            h("g", { transform: "translate(2 4) rotate(-5 50 12)" },
              h("path", { d: "M6 4Q5 12 3 23M5 14Q10 12 16 12M18 3Q16 13 15 23" }),
              h("path", { d: "M32 10C28 5 22 9 21 16s6 10 10 1M34 8q-3 10-2 14 1 3 4-1" }),
              h("path", { d: "M40 8q1 6 9 7-6 2-11 8M51 6l-4 18M60 7q-4 7-11 8 5 2 8 8" }),
              h("path", { d: "m62 24 4-16q1 9 4 13 4-9 9-14l-1 16" }),
              h("path", { d: "M87 8q-4 10-3 15 6-1 14-15l-2 15q1 3 5-1" }))),
          h("svg", { className: "basket-nudge-arrow", viewBox: "0 0 128 68", fill: "none", stroke: "currentColor", strokeWidth: 1.7, strokeLinecap: "round", strokeLinejoin: "round", focusable: "false" },
            h("path", { d: "M104 6C120 28 77 57 10 55M22 47 10 55l13 7" })),
          h("svg", { className: "basket-nudge-arrow-compact", viewBox: "0 0 36 36", fill: "none", stroke: "currentColor", strokeWidth: 1.6, strokeLinecap: "round", strokeLinejoin: "round", focusable: "false" },
            h("path", { d: "M3 3c23-3 29 12 21 26m-6-7 6 7 7-6" })))),
      h("span", { className: "basket-example-note" }, count + " " + ending + " · Цены уточняются во ВкусВилле"),
      h("span", { className: "basket-error", role: "alert" }, error));
  }

  function SwitchIcon() {
    return h("svg", { width: 16, height: 16, viewBox: "0 0 16 16", fill: "none", stroke: "currentColor", strokeWidth: 1.4, strokeLinecap: "round", strokeLinejoin: "round", "aria-hidden": true },
      h("path", { d: "M3 5h10l-3-3M13 11H3l3 3" }));
  }

  function ReelFace(props) {
    return h("span", { className: "recipe-reel recipe-reel-face" + (props.products ? " is-products" : "") + (props.active ? " is-front" : " is-back"), "aria-hidden": true },
      h("span", { className: "recipe-reel-top" }, "Сохранённый ролик",
        h("svg", { width: 12, height: 16, viewBox: "0 0 12 16", fill: "none", stroke: "currentColor", strokeWidth: 1.3 }, h("path", { d: "M2 1h8v13L6 11l-4 3Z" }))),
      props.products ? h(OutfitArt) : h(ReelArt),
      h("span", { className: "recipe-reel-bottom" },
        h("span", { className: "recipe-play" }, h("svg", { width: 10, height: 12, viewBox: "0 0 10 12", fill: "currentColor" }, h("path", { d: "M2 1l7 5-7 5Z" }))),
        h("span", { className: "recipe-reel-title" }, props.products ? "Образ из рилса" : "Паста на ужин", h("span", { className: "recipe-reel-time" }, props.products ? "0:24" : "0:18"))));
  }

  function RecipeIllustration() {
    var state = React.useState(false), products = state[0], setProducts = state[1];
    var hasSwitched = React.useRef(false);
    var resultId = React.useId();
    var reelButton = React.useRef(null);

    function changeScenario(event) {
      // Keep focus on the persistent stack when the result control disappears.
      reelButton.current.focus({ preventScroll: event.detail !== 0 });
      hasSwitched.current = true;
      setProducts(function (current) { return !current; });
    }

    function changeFromRecipe(event) {
      if (!event.target.closest(".recipe-basket, button, a")) changeScenario(event);
    }

    return h("div", { className: "recipe-illustration", role: "group", "aria-label": "Попробуйте Wanta: из ролика в рецепт или подборку товаров" },
      h("div", { className: "recipe-scene" + (hasSwitched.current ? " has-switched" : ""), "data-scenario": products ? "products" : "recipe" },
        h(TiltCard, { kind: "reel" }, h("div", { className: "recipe-reel-stack" },
          h("button", { type: "button", ref: reelButton, className: "recipe-reel-button", onClick: changeScenario, "aria-label": products ? "Показать пример с рецептом" : "Показать пример с товарами", "aria-controls": resultId },
            h("span", { className: "recipe-reel-deck" }, h(ReelFace, { products: false, active: !products }), h(ReelFace, { products: true, active: products }))),
          h("span", { className: "recipe-reel-hint", "aria-hidden": true }, h(SwitchIcon), "Нажми, чтобы сменить пример"))),
        h("svg", { className: "recipe-connector", viewBox: "0 0 64 64", fill: "none", "aria-hidden": true },
          h("path", { d: "M5 32h54", stroke: "currentColor", strokeWidth: 1.5, strokeDasharray: "2 5" }),
          h("circle", { cx: 32, cy: 32, r: 14, fill: "var(--paper)", stroke: "currentColor" }),
          h("path", { d: "M26 32h12m-5-5 5 5-5 5", stroke: "currentColor", strokeWidth: 1.5, strokeLinecap: "round", strokeLinejoin: "round" })),
        h("div", { className: "recipe-card-wrap", id: resultId },
          h("div", { className: "recipe-card recipe-result recipe-clickable" + (!products ? " is-active" : ""), onClick: changeFromRecipe, "aria-hidden": products, inert: products ? "" : undefined },
            h("div", { className: "recipe-card-top" }, h("span", { className: "recipe-card-label" }, "Рецепт из ролика"), h("span", { className: "recipe-example" }, "Пример")),
            h("div", { className: "recipe-card-title" }, "Паста с томатами"),
            h("div", { className: "recipe-meta" }, h("span", null, "20 мин"), h("span", null, "2 порции")),
            h("ol", { className: "recipe-steps", "aria-label": "Шаги приготовления" },
              h("li", null, h("span", null, "Отвари пасту.")),
              h("li", null, h("span", null, "Обжарь нарезанные томаты.")),
              h("li", null, h("span", null, "Добавь пасту, перемешай и посыпь травами."))),
            h(GroceryBasket),
            h("button", { type: "button", className: "recipe-switch-label recipe-switch-back", onClick: changeScenario, tabIndex: products ? -1 : 0 }, h(SwitchIcon), "А если в ролике — вещи?")),
          h("div", { className: "recipe-card recipe-result product-result" + (products ? " is-active" : ""), "aria-hidden": !products, inert: !products ? "" : undefined },
            h("div", { className: "recipe-card-top" }, h("span", { className: "recipe-card-label" }, "Товары из ролика"), h("span", { className: "recipe-example" }, "Пример")),
            h("div", { className: "recipe-card-title" }, "Весь образ найден"),
            h("div", { className: "recipe-meta" }, h("span", null, "3 находки"), h("span", null, "В разработке")),
            h("div", { className: "recipe-product-list" }, PRODUCTS.map(function (item) {
              var market = MARKETS[item.market];
              return h("a", { key: item.kind, className: "recipe-product", href: market.url + encodeURIComponent(item.query), target: "_blank", rel: "noopener noreferrer", tabIndex: products ? 0 : -1, "aria-label": item.name + " — найти на " + market.name + " (новая вкладка)" },
                h("span", { className: "recipe-product-image" }, h(FashionItem, { kind: item.kind })),
                h("span", { className: "recipe-product-info" },
                  h("span", { className: "recipe-product-name" }, item.name),
                  h("span", { className: "recipe-product-article" }, "Арт. " + item.article),
                  h("span", { className: "recipe-product-store" }, h(MarketLogo, { market: item.market }), h("span", null, market.name), h("span", { className: "recipe-product-arrow", "aria-hidden": true }, "↗"))));
            })),
            h("div", { className: "recipe-product-note" }, "Пример подбора · демо-артикулы"),
            h("button", { type: "button", className: "recipe-switch-label recipe-switch-back", onClick: changeScenario, tabIndex: products ? 0 : -1 }, h(SwitchIcon), "Вернуться к рецепту")))),
      h("span", { className: "recipe-live-status", role: "status", "aria-live": "polite", "aria-atomic": true }, products ? "Пример с товарами. Рубашка, брюки и сумка: Ozon, Wildberries и Яндекс Маркет." : "Пример с рецептом. Паста с томатами и корзина ингредиентов во ВкусВилле."));
  }

  window.WantaRecipeIllustration = RecipeIllustration;
})();
