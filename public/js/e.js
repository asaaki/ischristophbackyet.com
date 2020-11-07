// custom NR stuff
document.querySelector("#answer").addEventListener("click", (_e) => {
  newrelic.addPageAction("ClickedAnswer");
});
document.querySelector("#note").addEventListener("click", (_e) => {
  newrelic.addPageAction("ClickedNote");
});
newrelic.setCustomAttribute("eventSource", "browser");
