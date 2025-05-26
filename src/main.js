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
// Сохранение в локалсторейдж, вывод из локал сторейдж начало
document.addEventListener("DOMContentLoaded", () => {
  const data = getDataFromStorage();
  const tenDaysAgo = getDateDaysAgo(10);

  // Фильтрация данных за последние 10 дней
  const filteredExpenses = data.expenses.filter(e => isDateInRange(e.date[0], tenDaysAgo, null));
  const filteredIncomes = data.incomes.filter(i => isDateInRange(i.date[0], tenDaysAgo, null));

  // Рендерим элементы за последние 10 дней
  filteredExpenses.forEach((item) => renderItem(item, expenseBody, false));
  filteredIncomes.forEach((item) => renderItem(item, incomeBody, false));

  // Генерируем отчет за последние 10 дней
  generateReport(tenDaysAgo);
});

// Получение даты N дней назад
function getDateDaysAgo(days) {
  const date = new Date();
  date.setDate(date.getDate() - days);
  return date.toISOString().split("T")[0]; // формат YYYY-MM-DD
}

// Преобразование строки даты "dd.mm.yyyy" в Date
function parseDate(str) {
  const [day, month, year] = str.split(".");
  return new Date(`${year}-${month}-${day}`);
}

// Проверка, входит ли дата в диапазон
function isDateInRange(itemDateStr, fromDateStr, toDateStr) {
  const date = parseDate(itemDateStr);
  const from = fromDateStr ? new Date(fromDateStr) : null;
  const to = toDateStr ? new Date(toDateStr) : null;

  if (from && date < from) return false;
  if (to && date > to) return false;
  return true;
}

function getDataFromStorage() {
  const data = localStorage.getItem("financeData");
  console.log('JSON.parse(data) ',JSON.parse(data) );
  
  return data ? JSON.parse(data) : { expenses: [], incomes: [] };
}

function saveDataToStorage(data) {
  localStorage.setItem("financeData", JSON.stringify(data));
}

function generateId(prefix) {
  return prefix + "_" + Date.now();
}

function getCurrentDateTime() {
  const now = new Date();
  const date = now.toLocaleDateString("uk-UA");
  const time = now.toLocaleTimeString("uk-UA", {
    hour: "2-digit",
    minute: "2-digit",
  });
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
            : `<option value="main">Основная работа</option>
              <option value="additional">Подработка</option>
              <option value="others">Другое</option>`
        }
      </select>
    </div>
    <div class="notes">
      <input type="text" value="${item.note || ""}">
    </div>
    <button class="delete-btn">   <svg xmlns="http://www.w3.org/2000/svg" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
    <path d="M3 6h18M8 6v12M16 6v12M5 6l1 14a2 2 0 002 2h8a2 2 0 002-2l1-14" />
  </svg> Удалить</button>

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

  if (prepend) {
    container.insertBefore(row, container.firstChild);
  } else {
    container.appendChild(row);
  }
  requestAnimationFrame(() => {
    row.classList.add("show");
  });


}
//  удалить елемент начало
document.addEventListener('click', (e) => {
  if (e.target.classList.contains('delete-btn')) {
    const row = e.target.closest('.item__body-row');
    const id = row.getAttribute('data-id');

    // Добавляем класс с анимацией
    row.classList.add('remove-anim');

    // Ждём окончания анимации, затем удаляем
    row.addEventListener('animationend', () => {
      row.remove();

      // Получить данные из localStorage
      const data = JSON.parse(localStorage.getItem('financeData')) || {
        expenses: [],
        incomes: []
      };

      // Определить, это доход или расход
      const isExpense = id.startsWith('exp_');
      const isIncome = id.startsWith('inc_');

      if (isExpense) {
        data.expenses = data.expenses.filter(item => item.id !== id);
      } else if (isIncome) {
        data.incomes = data.incomes.filter(item => item.id !== id);
      }

      // Сохранить обновлённые данные
      localStorage.setItem('financeData', JSON.stringify(data));

      // (опционально) пересчитать баланс и обновить отчёт
    }, { once: true }); // { once: true } — слушатель сработает один раз
  }
});


// localStorage.clear()
//  удалить елемент конец
function updateItem(id, container, field, value) {
  const data = getDataFromStorage();
  const listName = container === expenseBody ? "expenses" : "incomes";

  const item = data[listName].find((item) => item.id === id);
  if (item) {
    item[field] = value;
    saveDataToStorage(data);
  }
}

// Обработка клика по кнопке отчета
document.getElementById("generateReportBtn").addEventListener("click", () => {
  const fromDate = document.getElementById("reportFromDate").value || null;
  const toDate = document.getElementById("reportToDate").value || null;

  // Очищаем контейнеры перед рендером новых данных
  expenseBody.innerHTML = "";
  incomeBody.innerHTML = "";

  const data = getDataFromStorage();

  const filteredExpenses = data.expenses.filter(e => isDateInRange(e.date[0], fromDate, toDate));
  const filteredIncomes = data.incomes.filter(i => isDateInRange(i.date[0], fromDate, toDate));

  filteredExpenses.forEach(item => renderItem(item, expenseBody, false));
  filteredIncomes.forEach(item => renderItem(item, incomeBody, false));

  generateReport(fromDate, toDate);
});

// Генерация отчета по диапазону дат
function generateReport(fromDate, toDate) {
  const { expenses, incomes } = getDataFromStorage();

  const filteredExpenses = expenses.filter(e => isDateInRange(e.date[0], fromDate, toDate));
  const filteredIncomes = incomes.filter(i => isDateInRange(i.date[0], fromDate, toDate));

  const totalExpenses = filteredExpenses.reduce((sum, e) => sum + (parseFloat(e.amount) || 0), 0);
  const totalIncomes = filteredIncomes.reduce((sum, i) => sum + (parseFloat(i.amount) || 0), 0);
  const balance = totalIncomes - totalExpenses;
  const profitPercent = totalIncomes === 0 ? 0 : ((balance / totalIncomes) * 100).toFixed(2);

  const categorySums = {};
  filteredExpenses.forEach(e => {
    const val = parseFloat(e.amount) || 0;
    if (!categorySums[e.category]) categorySums[e.category] = 0;
    categorySums[e.category] += val;
  });

  const categoryPercents = {};
  for (const [cat, sum] of Object.entries(categorySums)) {
    categoryPercents[cat] = ((sum / totalExpenses) * 100).toFixed(2);
  }

  const categoryReport = Object.entries(categorySums).map(([cat, sum]) => {
    return `<li>${cat}: ${sum.toFixed(2)} грн (${categoryPercents[cat]}%)</li>`;
  }).join("");
  const incomeCategorySums = {
    food: 0,         // Основной доход
    cofe: 0,         // Подработка
    others: 0        // Другое
  };

  filteredIncomes.forEach(i => {
    const val = parseFloat(i.amount) || 0;
    if (incomeCategorySums.hasOwnProperty(i.category)) {
      incomeCategorySums[i.category] += val;
    }
  });

  const getPercent = (value) =>
  totalIncomes > 0 ? ((value / totalIncomes) * 100).toFixed(1) : "0.0";

const incomeCategoryDetails = `
  <ul>
    <li>Основной — ${incomeCategorySums.food.toFixed(2)} грн (${getPercent(incomeCategorySums.food)}%)</li>
    <li>Дополнительный — ${incomeCategorySums.cofe.toFixed(2)} грн (${getPercent(incomeCategorySums.cofe)}%)</li>
    <li>Другой — ${incomeCategorySums.others.toFixed(2)} грн (${getPercent(incomeCategorySums.others)}%)</li>
  </ul>
`;

  const reportHTML = `
    <h3>📊 Отчёт</h3>
    <p><strong>Доходы:</strong> ${totalIncomes.toFixed(2)} грн</p>
    ${incomeCategoryDetails}
    <p><strong>Расходы:</strong> ${totalExpenses.toFixed(2)} грн</p>
    
    <ul>${categoryReport}</ul>
    <p><strong>Баланс:</strong> ${balance.toFixed(2)} грн</p>
    <p><strong>Процент прибыли/убытка:</strong> ${profitPercent}%</p>

  `;

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
