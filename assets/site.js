(function () {
  var h = React.createElement;

  // A native modal keeps keyboard focus inside the menu and makes the page inert.
  function MenuDialog(props) {
    var ref = React.useRef(null);
    React.useEffect(function () {
      var dialog = ref.current;
      var trigger = document.activeElement;
      var overflow = document.body.style.overflow;
      dialog.showModal();
      document.body.style.overflow = "hidden";
      return function () {
        dialog.close();
        document.body.style.overflow = overflow;
        if (trigger && trigger.isConnected) trigger.focus({ preventScroll: true });
      };
    }, []);

    return h("dialog", {
      ref: ref, id: "site-menu", className: "drawer", "aria-label": "Меню",
      onCancel: function (event) { event.preventDefault(); props.onClose(); },
      onKeyDown: function (event) {
        if (event.key !== "Tab") return;
        var controls = Array.from(ref.current.querySelectorAll("a[href], button:not([disabled])"))
          .filter(function (element) { return element.getClientRects().length; });
        var first = controls[0], last = controls[controls.length - 1];
        if (event.shiftKey && document.activeElement === first) {
          event.preventDefault(); last.focus();
        } else if (!event.shiftKey && document.activeElement === last) {
          event.preventDefault(); first.focus();
        }
      },
      onClick: function (event) {
        if (event.target.closest("a[href]")) props.onClose();
      }
    },
      h("button", { type: "button", className: "menu-btn drawer-close", onClick: props.onClose }, "Закрыть"),
      props.children);
  }

  function TryRecipe(props) {
    var state = React.useState("idle"), copyState = state[0], setCopyState = state[1];
    var manualLink = React.useRef(null);
    var headingId = React.useId();
    var hintId = React.useId();

    React.useEffect(function () {
      if (copyState === "manual" && manualLink.current) {
        manualLink.current.focus();
        manualLink.current.select();
      }
    }, [copyState]);

    async function copyReel() {
      try {
        await navigator.clipboard.writeText(props.reelUrl);
        setCopyState("copied");
      } catch (error) {
        setCopyState("manual");
        if (manualLink.current) {
          manualLink.current.focus();
          manualLink.current.select();
        }
      }
    }

    return h("div", { className: "try-recipe", role: "region", "aria-labelledby": headingId },
      h("div", { className: "try-recipe-intro" },
        h("h2", { id: headingId }, "Попробуй сам"),
        h("p", null, "Отправь этот рилс боту в Telegram — получишь ингредиенты, шаги приготовления и корзину во ВкусВилле.")),
      h("div", { className: "try-recipe-demo" },
        h("a", { className: "try-recipe-reel", href: props.reelUrl, target: "_blank", rel: "noopener noreferrer", "aria-label": "Посмотреть тестовый рилс с пастой в Instagram (новая вкладка)" },
          h("span", { className: "try-recipe-play", "aria-hidden": true },
            h("svg", { width: 22, height: 24, viewBox: "0 0 22 24", fill: "none", stroke: "currentColor", strokeWidth: 1.5, strokeLinejoin: "round", focusable: "false" },
              h("path", { d: "m6 4 13 8-13 8Z" }))),
          h("span", null,
            h("strong", null, "Рилс с рецептом пасты"),
            h("span", { className: "try-recipe-source" }, "Смотреть в Instagram ", h("span", { "aria-hidden": true }, "↗")))),
        h("div", { className: "try-recipe-actions" },
          h("button", { type: "button", className: "try-recipe-copy", onClick: copyReel, "data-copied": copyState === "copied", "aria-describedby": hintId },
            h("span", { role: "status", "aria-live": "polite" }, copyState === "copied" ? "Ссылка скопирована" : "Скопировать ссылку"),
            h("svg", { width: 16, height: 16, viewBox: "0 0 16 16", fill: "none", stroke: "currentColor", strokeWidth: 1.3, "aria-hidden": true, focusable: "false" },
              copyState === "copied" ? h("path", { d: "m3 8 3 3 7-7", strokeLinecap: "round", strokeLinejoin: "round" })
                : h(React.Fragment, null, h("rect", { x: 5, y: 5, width: 8, height: 8, rx: 2 }), h("path", { d: "M10 5V4a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v4a2 2 0 0 0 2 2h1" })))),
          // Telegram supports a draft in username links. Copying is also available
          // for first-time bot visitors and clients that don't preserve the draft.
          h("a", { className: "try-recipe-open", href: props.botUrl + "?text=" + encodeURIComponent(props.reelUrl), target: "_blank", rel: "noopener noreferrer" },
            "Открыть бота", h("span", { "aria-hidden": true }, "↗"))),
        copyState === "manual" ? h("input", { ref: manualLink, className: "try-recipe-manual", type: "text", readOnly: true, value: props.reelUrl, "aria-label": "Ссылка на тестовый рилс — скопируй вручную", onFocus: function (event) { event.target.select(); } }) : null,
        h("p", { className: "try-recipe-hint", id: hintId, role: copyState === "manual" ? "alert" : undefined },
          copyState === "manual" ? "Скопируй выделенную ссылку вручную и отправь боту." : "Скопируй ссылку и отправь её в чат. Впервые у бота? Нажми «Старт».")));
  }

  window.WantaSite = { MenuDialog: MenuDialog, TryRecipe: TryRecipe };
})();
