import "./style.scss";
const header = document.querySelector("header");
const body = document.querySelector("body");
const footer = document.querySelector("footer");
const buttons = document.getElementById("buttons");
const itemTitle = document.querySelector(".item__title");
const itemBody = document.querySelectorAll(".item__body");
const addExpense = document.getElementById("addExpense");
const expenseBody = document.getElementById("expenseBody");
const addIncome = document.getElementById("addIncome");
const incomeBody = document.getElementById("incomeBody");
const period = document.getElementById("period");
const reportBody = document.getElementById("reportBody");

const periodHeight = period.getBoundingClientRect().height;
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
reportBody.style.maxHeight = itemBodyHeight - periodHeight + 30  + "px";
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
// Сохранение в локалсторейдж, вывод из локал сторейдж начало
document.addEventListener("DOMContentLoaded", () => {
  const data = getDataFromStorage();

  // Сначала старые, потом новые — но сверху будут новые
  data.expenses.forEach((item) => renderItem(item, expenseBody, false));
  data.incomes.forEach((item) => renderItem(item, incomeBody, false));
});

function getDataFromStorage() {
  const data = localStorage.getItem("financeData");
  console.log(JSON.parse(data));
  return data ? JSON.parse(data) : { expenses: [], incomes: [] };
}

function saveDataToStorage(data) {
  localStorage.setItem("financeData", JSON.stringify(data));
}

function generateId(prefix) {
  return prefix + "_" + Date.now();
}

function getCurrentDateTime() {
  // const now = new Date();
  // return (
  //   now.toLocaleDateString("uk-UA") +
  //   " " +
  //   now.toLocaleTimeString("uk-UA", { hour: "2-digit", minute: "2-digit" })
  // );
  const now = new Date();
  const date = now.toLocaleDateString("uk-UA"); // "25.05.2025"
  const time = now.toLocaleTimeString("uk-UA", {
    hour: "2-digit",
    minute: "2-digit",
  }); // "22:37"
  return [date, time];
}

addExpense.addEventListener("click", () => {
  const id = generateId("exp");
  const date = getCurrentDateTime();
  const item = { id, date, amount: "", category: "food", note: "" };

  const data = getDataFromStorage();
  data.expenses.unshift(item);
  saveDataToStorage(data);

  renderItem(item, expenseBody);
  expenseBody.scrollTo({ top: 0, behavior: "smooth" });
});

addIncome.addEventListener("click", () => {
  const id = generateId("inc");
  const date = getCurrentDateTime();
  const item = { id, date, amount: "", category: "food", note: "" };

  const data = getDataFromStorage();
  data.incomes.unshift(item);
  saveDataToStorage(data);

  renderItem(item, incomeBody);
  incomeBody.scrollTo({ top: 0, behavior: "smooth" });
});
function renderItem(item, container, prepend = true) {
  const row = document.createElement("div");
  row.className = "item__body-row";
  row.dataset.id = item.id;

  row.innerHTML = `

    <div class="time">
    <div class="time__date">${item.date[0]}</div>
    <div class="time__time">${item.date[1]}</div>
  </div>
  <div class="summ">
  <input type="number" value="${item.amount || ""}">
  <select>
        ${
          container === expenseBody
            ? `<option value="food">Продукты</option>
              <option value="cofe">Кофе/Чай</option>
              <option value="fastfood">Перекус</option>
              <option value="tasty">Вкусняшки</option>
              <option value="cafe">Кафе</option>
              <option value="gasStaion">Заправка</option>
              <option value="household">Быт. химия</option>
              <option value="mother">Маме</option>
              <option value="subscription">Абонплаты</option>
              <option value="communal">Коммуналка</option>
              <option value="others">Другое</option>`
            : `<option value="food">Основная работа</option>
              <option value="cofe">Подработка</option>
              <option value="others">Другое</option>`
        }
      </select>
      </div>
      <div class="notes">
      <input type="text" value="${item.note || ""}">
      </div>
      `;

  const amountInput = row.querySelector('input[type="number"]');
  const select = row.querySelector("select");
  const noteInput = row.querySelector('input[type="text"]');

  select.value = item.category || "";

  amountInput.addEventListener("input", () =>
    updateItem(item.id, container, "amount", amountInput.value)
  );
  select.addEventListener("change", () =>
    updateItem(item.id, container, "category", select.value)
  );
  noteInput.addEventListener("input", () =>
    updateItem(item.id, container, "note", noteInput.value)
  );

  // ❗ Выбор вставки — в начало (prepend) или в конец
  if (prepend) {
    container.insertBefore(row, container.firstChild);
  } else {
    container.appendChild(row);
  }
}

function updateItem(id, container, field, value) {
  const data = getDataFromStorage();
  const listName = container === expenseBody ? "expenses" : "incomes";

  const item = data[listName].find((item) => item.id === id);
  if (item) {
    item[field] = value;
    saveDataToStorage(data);
  }
}
// localStorage.clear();
// Сохранение в локалсторейдж, вывод из локал сторейдж нконец
document.getElementById("generateReportBtn").addEventListener("click", generateReport);

function generateReport() {
  const fromDate = document.getElementById("reportFromDate").value;
  const toDate = document.getElementById("reportToDate").value;
  const { expenses, incomes } = getDataFromStorage();

  const parseDate = (str) => {
    const [day, month, year] = str.split(".");
    return new Date(`${year}-${month}-${day}`);
  };

  const isInRange = (itemDateArr) => {
    const date = parseDate(itemDateArr[0]);
    if (!fromDate && !toDate) return true;
    if (fromDate && date < new Date(fromDate)) return false;
    if (toDate && date > new Date(toDate)) return false;
    return true;
  };

  const filteredExpenses = expenses.filter(e => isInRange(e.date));
  const filteredIncomes = incomes.filter(i => isInRange(i.date));

  const totalExpenses = filteredExpenses.reduce((sum, e) => sum + (parseFloat(e.amount) || 0), 0);
  const totalIncomes = filteredIncomes.reduce((sum, i) => sum + (parseFloat(i.amount) || 0), 0);
  const balance = totalIncomes - totalExpenses;
  const profitPercent = totalIncomes === 0 ? 0 : ((balance / totalIncomes) * 100).toFixed(2);

  // Расходы по категориям
  const categorySums = {};
  filteredExpenses.forEach(e => {
    const val = parseFloat(e.amount) || 0;
    if (!categorySums[e.category]) categorySums[e.category] = 0;
    categorySums[e.category] += val;
  });

  // Категории в %
  const categoryPercents = {};
  for (const [cat, sum] of Object.entries(categorySums)) {
    categoryPercents[cat] = ((sum / totalExpenses) * 100).toFixed(2);
  }

  const categoryReport = Object.entries(categorySums).map(([cat, sum]) => {
    return `<li>${cat}: ${sum.toFixed(2)} (${categoryPercents[cat]}%)</li>`;
  }).join("");

  const reportHTML = `
    <h3>📊 Отчёт</h3>
    <p><strong>Доходы:</strong> ${totalIncomes.toFixed(2)} грн</p>
    <p><strong>Расходы:</strong> ${totalExpenses.toFixed(2)} грн</p>
    <p><strong>Баланс:</strong> ${balance.toFixed(2)} грн</p>
    <p><strong>Процент прибыли/убытка:</strong> ${profitPercent}%</p>
    <h4>📌 Расходы по категориям:</h4>
    <ul>${categoryReport}</ul>
  `;

  document.getElementById("reportBodyBox").innerHTML = reportHTML;
  const recommendationHTML = `
  <h4>📢 Рекомендации:</h4>
  <p>${generateRecommendation(totalIncomes, totalExpenses, balance, categoryPercents)}</p>
`;

document.getElementById("reportBodyBox").innerHTML = reportHTML + recommendationHTML;

}
function generateRecommendation(totalIncomes, totalExpenses, balance, categoryPercents) {
  let recommendation = "";

  if (totalIncomes === 0) {
    recommendation += "💡 У вас нет доходов за выбранный период. Рекомендуем найти источник дохода или подработку.<br>";
  } else if (balance < 0) {
    recommendation += "⚠️ Ваши расходы превышают доходы. Постарайтесь оптимизировать траты.<br>";
  } else if (balance > 0 && (totalExpenses / totalIncomes) < 0.7) {
    recommendation += "✅ Отличный результат! Вы тратите меньше 70% от доходов. Рекомендуем часть средств инвестировать или отложить.<br>";
  }

  for (const [category, percent] of Object.entries(categoryPercents)) {
    if (percent > 50) {
      recommendation += `🔎 Расходы по категории <strong>${category}</strong> составляют ${percent}%. Подумайте, можно ли здесь сэкономить.<br>`;
    }
  }

  return recommendation || "🎯 Финансовая ситуация стабильна. Продолжайте в том же духе!";
}
// localStorage.clear()