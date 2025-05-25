import "./style.scss";
const header = document.querySelector("header");
const body = document.querySelector("body");
const footer = document.querySelector("footer");
const buttons = document.getElementById("buttons");
const itemTitle = document.querySelector(".item__title");
const itemBody = document.querySelector(".item__body");

const bodyHeight = body.getBoundingClientRect().height;
const headerHeight = header.getBoundingClientRect().height;
const footerHeight = footer.getBoundingClientRect().height;
const itemTitleHeight = itemTitle.getBoundingClientRect().height;
const buttonsHeight = buttons.getBoundingClientRect().height;
let itemBodyHeight =
  bodyHeight -
  (headerHeight + footerHeight + itemTitleHeight + buttonsHeight) -
  100;
itemBody.style.maxHeight = itemBodyHeight + "px";
// ------------------------------------------------------
const itemBodyes = document.querySelectorAll(".itemBody");
function hideItems() {
  itemBodyes.forEach((i) => i.classList.remove("active"));
}
buttons.addEventListener("click", (e) => {
  if (e.target.classList.contains("button")) {
    const dataAttr = e.target.getAttribute("data-item");
    const itemBody = document.getElementById(dataAttr);
    if (itemBody) {
      if (itemBody.classList.contains("active")) return;
      hideItems();
      itemBody.classList.add("active");
    } else {
    }
  }
});
