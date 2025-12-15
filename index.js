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


buttonNode.addEventListener('click', function() {
    const expense = getExpenseFromUser();
    
    if (!expense) {
        return
    } 
    
    //2. Сохраняем трату в список
    trackExpense(expense); 

    render(expenses);
})

deleteHistory.addEventListener('click', function() {
    expenses.length = 0;
    render(expenses);
})

init(expenses);

function init(expenses) {
    limitNode.innerText = LIMIT;
    statusNode.innerText = STATUS_IN_LIMIT;
    sumNode.innerText = calculateExprnses(expenses);
}

function trackExpense(expense) {
    expenses.push(expense);
}

function getExpenseFromUser() {
    if (inputNode.value === '') {
        return null;   
    }
    const expense = {
        sum: Number(inputNode.value),
        category: spendingCategory.value
    };
    clearInput();

    return expense;
}

function clearInput() {
    inputNode.value = '';
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
    LIMIT = Number(limitNodeModal.value);
    limitNode.innerText = LIMIT;
    render(expenses);
    modalNode.classList.remove('is-open');
})