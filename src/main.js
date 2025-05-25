import "./style.scss";
const header = document.querySelector("header");
const body = document.querySelector("body");
const footer = document.querySelector("footer");
const buttons = document.getElementById("buttons");
const itemTitle = document.querySelector(".item__title");
const itemBody = document.querySelectorAll(".item__body");

const bodyHeight = body.getBoundingClientRect().height;
const headerHeight = header.getBoundingClientRect().height;
const footerHeight = footer.getBoundingClientRect().height;
const itemTitleHeight = itemTitle.getBoundingClientRect().height;
const buttonsHeight = buttons.getBoundingClientRect().height;
let itemBodyHeight =
  bodyHeight -
  (headerHeight + footerHeight + itemTitleHeight + buttonsHeight) -
  100;
itemBody.forEach((item) => (item.style.maxHeight = itemBodyHeight + "px"));
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

// ----------------------------------
const addExpense = document.getElementById("addExpense");
const expenseBody = document.getElementById("expenseBody");
addExpense.addEventListener("click", () => {
  const item = `
  <div class="item__body-row">
                <div class="summ">

                  <input type="number">
                  <select name="" id="">
                    <option value="food">Продукты</option>
                    <option value="cofe">Кофе/Чай</option>
                    <option value="fastfood">Перекус</option>
                    <option value="tasty">Вкусняшки</option>
                    <option value="gasStaion">Заправка</option>
                    <option value="subscription">Абонплаты</option>
                    <option value="communal">Коммуналка</option>
                  </select>

                </div>
                <div class="notes">
                  <input type="text">
                </div>

              </div>`;
  expenseBody.insertAdjacentHTML("afterbegin", item);
});
