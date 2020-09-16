const container = document.querySelector(".container");
var amountValue = document.querySelector("#amount");
var expensedate = document.querySelector("#expensedate");
var category = document.querySelector("#category");
var totalExpense = document.getElementById("totalexpense");
const add = document.querySelector(".add");
const downloadBtn = document.querySelector(".downloadBtn");
const resetBtn = document.querySelector(".resetBtn");
var currency = "$";
var sumValue = 0;
var counter = 0;

if (window.localStorage.getItem("expensetracker") == undefined) {
  var expenselist = [];
  window.localStorage.setItem("expensetracker", JSON.stringify(expenselist));
}

var expenseEx = window.localStorage.getItem("expensetracker");
var expenselist = JSON.parse(expenseEx);

class item {
  constructor(amount, date, category, isHeader) {
    this.createItem(amount, date, category, isHeader);
  }
  createItem(amount, date, category, isHeader) {
    var index = counter;
    var itemBox = document.createElement("div");
    itemBox.classList.add("item");

    var input = document.createElement("input");
    input.type = "text";
    input.disabled = true;
    input.value = date + " - " + amount + " " + currency + " - " + category;
    input.classList.add("item_input");
    if (isHeader) input.classList.add("headertext");

    var remove = document.createElement("button");
    remove.classList.add("remove");
    remove.innerHTML = "REMOVE";
    remove.addEventListener("click", () => this.remove(itemBox, index));

    container.appendChild(itemBox);
    itemBox.appendChild(input);
    if (!isHeader) {
      itemBox.appendChild(remove);
      sumValue += amount;
      counter += 1;
    }

    document.getElementById("totalexpense").innerHTML =
      sumValue + " " + currency;
  }

  remove(itemBox, count) {
    alert("counter : " + count);
    itemBox.parentNode.removeChild(itemBox);
    expenselist.splice(count, 1);
    window.localStorage.setItem("expensetracker", JSON.stringify(expenselist));
    clearTable();
    counter = 0;
    initialize();
  }
}

add.addEventListener("click", addExpense);
downloadBtn.addEventListener("click", performDownload);
resetBtn.addEventListener("click", performReset);

// window.addEventListener("keydown", (e) => {
//   if (e.which == 13) {
//     check();
//   }
// });

function addExpense() {
  if (
    amountValue.value != "" &&
    expensedate.value != "" &&
    category.value != ""
  ) {
    var amount = parseInt(amountValue.value);
    new item(amount, expensedate.value, category.value, false);
    var expense = {
      amount: amount,
      date: expensedate.value,
      category: category.value,
    };
    expenselist.push(expense);
    window.localStorage.setItem("expensetracker", JSON.stringify(expenselist));
    amountValue.value = "";
  } else {
    alert("Please enter all three fields");
  }
}

new item("Amount", "Date", "Category", true);
initialize();

function initialize() {
  for (var v = 0; v < expenselist.length; v++) {
    new item(
      parseInt(expenselist[v].amount),
      expenselist[v].date,
      expenselist[v].category,
      false
    );
  }
}

function performDownload() {
  var csv = "Date,Amount,Category\n";
  if (expenselist.length > 0) {
    for (var v = 0; v < expenselist.length; v++) {
      csv +=
        expenselist[v].date +
        "," +
        expenselist[v].amount +
        "," +
        expenselist[v].category;
      csv += "\n";
    }
    var hiddenElement = document.createElement("a");
    hiddenElement.href = "data:text/csv;charset=utf-8," + encodeURI(csv);
    hiddenElement.target = "_blank";
    hiddenElement.download = "expense.csv";
    hiddenElement.click();
  } else {
    alert("There is no data to export.");
  }
}

function performReset() {
  clearTable();
  expenselist.length = 0;
  window.localStorage.setItem("expensetracker", JSON.stringify(expenselist));
}

function clearTable() {
  var tables = document.querySelectorAll(".item");
  for (var i = 0; i < tables.length; i++) {
    tables[i].innerHTML = "";
    tables[i].classList.remove("item");
  }
  new item("Amount", "Date", "Category", true);
  sumValue = 0;
  totalExpense.innerHTML = "" + sumValue + "$";
}
