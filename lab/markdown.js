(function () {
  var STATUS = { running: "Идёт", confirmed: "Подтвердилась", queued: "В очереди", pending: "Ждёт решения", closed: "Закрыто", rejected: "Не подтвердилась" };
  var MONTHS = ["января", "февраля", "марта", "апреля", "мая", "июня", "июля", "августа", "сентября", "октября", "ноября", "декабря"];

  function date(value) {
    var parts = value.split("-");
    return +parts[2] + " " + MONTHS[+parts[1] - 1] + " " + parts[0];
  }

  function experiment(item) {
    var number = (item.n < 10 ? "0" : "") + item.n;
    return [
      "### №" + number + " " + item.title, "",
      item.type + " · " + date(item.date) + " · " + STATUS[item.status], "",
      "**Вопрос.** " + item.question, "",
      "**Как проверяли.** " + item.method, "",
      "**Что получилось.** " + item.result, "",
      "**Во что выросло.** " + item.grew, ""
    ].join("\n");
  }

  function essay(item) {
    var lines = ["## Эссе: " + item.title, "", date(item.date) + " · " + item.read + " мин", "", "> " + item.lead, ""];
    item.body.forEach(function (block) {
      lines.push((block[0] === "h" ? "### " : block[0] === "q" ? "> " : "") + block[1], "");
    });
    return lines.join("\n");
  }

  // Both the interactive view and the static export use this formatter.
  function render(data, view) {
    if (view && view.kind === "exp") return "# Лаборатория Wanta\n\n" + experiment(view.item);
    if (view && view.kind === "essay") return "# Лаборатория Wanta\n\n" + essay(view.item);
    var lines = ["# Лаборатория Wanta", "", "> Что мы проверяем, пока строим слой намерений. Каждый эксперимент: вопрос, как проверяли, что получилось и во что выросло.", "", "## Как мы ставим эксперименты", ""];
    data.principles.forEach(function (item) { lines.push("- **" + item.big + "** — " + item.text); });
    lines.push("");
    data.essays.forEach(function (item) { lines.push(essay(item)); });
    lines.push("## Эксперименты", "");
    data.experiments.slice().sort(function (a, b) {
      return a.date < b.date ? 1 : a.date > b.date ? -1 : b.n - a.n;
    }).forEach(function (item) { lines.push(experiment(item)); });
    return lines.join("\n").trim();
  }

  if (typeof module !== "undefined" && module.exports) module.exports = render;
  else window.WantaLabMarkdown = render;
})();
