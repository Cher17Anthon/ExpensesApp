let LIMIT = 10000;
const CURRENCY = 'руб.';
const STATUS_IN_LIMIT = 'все хорошо';
const STATUS_OUT_OF_LIMIT = 'все плохо';
const STATUS_OUT_OF_LIMIT_CLASSNAME = 'limit_red';

const inputNode = document.querySelector('.js-input');
const buttonNode =  document.querySelector('.js-button');
const historyNode = document.querySelector('.js-history');
const sumNode = document.querySelector('.js-sum');
const limitNode = document.querySelector('.js-limit');
const statusNode = document.querySelector('.js-status');
const deleteHistory = document.querySelector('.js-reset');
const spendingCategory = document.querySelector('.js-category');

//модалка
const openLimitModalBtn = document.querySelector('.js-popup-changes');
const modalNode = document.querySelector('.js-modal');
const modalCloseNodes = document.querySelectorAll('.js-modal-close');

//модалка лимит
const limitNodeModal = document.querySelector('.js-limit-input');
const limitNodeModalBtn =document.querySelector('.js-limit-save');


const expenses = [];

//сохранение в localStorage
loadFromStorage();

function saveToStorage() {
    localStorage.setItem('expenses', JSON.stringify(expenses));
    localStorage.setItem('limit', String(LIMIT));
}

function loadFromStorage() {
    const savedExpenses = localStorage.getItem('expenses');
    const savedLimit = localStorage.getItem('limit');

    if (savedExpenses) {
        expenses.push(...JSON.parse(savedExpenses));
    }

    if (savedLimit) {
        LIMIT = Number(savedLimit);
    }
}



buttonNode.addEventListener('click', function() {
    const expense = getExpenseFromUser();
    
    if (!expense) {
        return
    } 
    
    //2. Сохраняем трату в список
    trackExpense(expense); 
    saveToStorage();
    render(expenses);
})

deleteHistory.addEventListener('click', function() {
    expenses.length = 0;
    localStorage.removeItem('expenses');
    render(expenses);
})

init();
render(expenses);

function init() {
    limitNode.innerText = LIMIT;
    statusNode.innerText = STATUS_IN_LIMIT;
}

function trackExpense(expense) {
    expenses.push(expense);
}

function getExpenseFromUser() {
    const value = Number(inputNode.value);
    const category = spendingCategory.value;

    if (value <= 0 || Number.isNaN(value)) {
        return null;
    }

    if (category === 'Категория') {
        return null;
    }

    const expense = {
        sum: value,
        category: category
    };

    clearInput();
    return expense;
}


function clearInput() {
    inputNode.value = '';
    spendingCategory.selectedIndex = 0;
}

function calculateExprnses(expenses) {
    let sum = 0

    expenses.forEach(element => {
        sum += element.sum;
    });
    
    return sum;
}

function render(expenses) {
    const sum = calculateExprnses(expenses);

    renderHistory(expenses);
    renderSum(sum);
    renderStatus(sum);
}

function renderHistory(expenses) {
    if (expenses.length === 0) {
        historyNode.innerHTML = '';
        return;
    }
    let expensesListHTML = '';

    expenses.forEach((element) => {
        expensesListHTML += `<li>${element.sum} ${CURRENCY} - ${element.category}</li>`;
    });
    historyNode.innerHTML = `<ol>${expensesListHTML}</ol>`;
}

function renderSum(sum) {
    sumNode.innerText = sum;
}

function renderStatus(sum) {
    if (sum <= LIMIT) {
        statusNode.innerText = STATUS_IN_LIMIT;
        statusNode.classList.remove(STATUS_OUT_OF_LIMIT_CLASSNAME);
    } else {
        const diff = LIMIT - sum
        statusNode.innerText = STATUS_OUT_OF_LIMIT;
        statusNode.classList.add(STATUS_OUT_OF_LIMIT_CLASSNAME);
        statusNode.innerText = `${STATUS_OUT_OF_LIMIT} (${diff} ${CURRENCY}) `
    }
}

//модалка
openLimitModalBtn.addEventListener('click', () => {
  modalNode.classList.add('is-open');
});

modalCloseNodes.forEach((node) => {
  node.addEventListener('click', () => {
    modalNode.classList.remove('is-open');
  });
});

// закрытие по Esc
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') {
    modalNode.classList.remove('is-open');
  }
});

//изменение лимита.
limitNodeModalBtn.addEventListener('click', () => {
    const newLimit = Number(limitNodeModal.value);
    if (newLimit <= 0 || Number.isNaN(newLimit)) return;
    LIMIT = newLimit;
    saveToStorage();
    limitNode.innerText = LIMIT;
    limitNodeModal.value = '';
    render(expenses);
    modalNode.classList.remove('is-open');
});