// history.js
let accessmainserver = 'http://localhost:3000'
let scrollPosition = 0;

getDatas = {
  income: [],
  expense: []
}

let userInfo = {
  proccessNumber:0
}

let selectedButton = null;

const incomeButton = document.getElementById('btn-income-select');
const expenseButton = document.getElementById('btn-expense-select');


incomeButton.addEventListener('click', () => {
    selectedButton = 'btn-income-select';
});

expenseButton.addEventListener('click', () => {
    selectedButton = 'btn-expense-select';
});


const token = window.localStorage.getItem('token');
document.getElementById('history-button').style="background-color:#333"

if (token) {
    const decodedToken = jwt_decode(token); // jwtDecodeではなくjwt_decodeを使用
     userInfo.language = decodedToken.language
     userInfo.id = decodedToken.userId
}

document.getElementById("input-button").addEventListener('click',()=>{
  window.location.href = '../pages/main.html'; // Redireciona para renda.html
});
document.getElementById("history-button").addEventListener('click',()=>{
  window.location.href = '../pages/history.html'; // Redireciona para renda.html
});
document.getElementById("analysis-button").addEventListener('click',()=>{
  window.location.href = '../pages/analysis.html'; // Redireciona para renda.html
});
document.getElementById("submit-button").addEventListener('click',()=>{
  window.location.href = '../pages/monthdataConfirm.html'; // Redireciona para renda.html
});
document.getElementById("settings-button").addEventListener('click',()=>{
  window.location.href = '../pages/settingpgs.html'; // Redireciona para renda.html
});

async function fetchHistoryData(token, tgtBtn) {
    try {
        // Show loading indicator
        loadingIndicator.style.display = 'flex';

        const filterDate = document.getElementById('filter-date').value;
        const response = await axios.get(`${accessmainserver}/keirikun/data/history`, {
            headers: { 'Authorization': `Bearer ${token}` },
            params: { date: filterDate }
        });

        if (response.data.success) {
            const records = response.data.records;
            // Clear existing data
            getDatas.income = [];
            getDatas.expense = [];

            // Iterate through each record
            records.forEach(record => {
                // Check if the record has an income value
                if (record.income !== null) {
                    // If income is not null, push the record to the income array in getDatas
                    getDatas.income.push(record);
                }
                // Check if the record has an expense value
                else if (record.expense !== null) {
                    // If expense is not null, push the record to the expense array in getDatas
                    getDatas.expense.push(record);
                }
            });

            // Translation of Pages According to User Registration Language
            translatePage(userInfo.language);
            // Function to toggle the selected button and update the displayed history cards
            toggleButton(tgtBtn);
        } else {
            alert(translation[userInfo.language].historyerror);
        }
    } catch (error) {
        alert(translation[userInfo.language].historyerror);
    } finally {
        // Hide loading indicator
        loadingIndicator.style.display = 'none';
    }
}




function populateHistoryCards(records) {
  const container = document.getElementById('history-container');
  container.innerHTML = '';
  if(records.length===0){
    alert(translations[userInfo.language].nodata)
    return
  }

    records.forEach(record => {
        const card = document.createElement('div');
        card.className = `history-card ${record.expense != null  ? 'expense-card' : 'income-card'}`;
        card.setAttribute('data-record-id', record.id);

        const date = document.createElement('div');
        date.className = 'record-date';
        date.textContent = `${translations[userInfo.language].date}: ${record.record_date}`;
        card.appendChild(date);

        const amount = document.createElement('div');
        amount.className = 'record-amount';
        amount.textContent = `${translations[userInfo.language].amount}: ${record.expense != null  ? formatCurrency(record.expense): formatCurrency(record.income)}`;
        card.appendChild(amount);

        const memo = document.createElement('div');
        memo.className = 'record-memo';
        memo.textContent = ` ${translateString(record.description,userInfo.language)}`;
        card.appendChild(memo);

        card.addEventListener('click', () => {
            openEditForm(record);
        });

        container.appendChild(card);
    });
}

function translateString(text, language) {
    Object.keys(translations[language]).forEach(key => {
        const regex = new RegExp(key, "g"); // Create a regular expression to find the key
        text = text.replace(regex, translations[language][key]); // Replace all occurrences
    });
    return text;
}

function formatCurrency(value) {
    return new Intl.NumberFormat('ja-JP', {
        style: 'currency',
        currency: 'JPY',
        minimumFractionDigits: 0
    }).format(value);
}

function openEditForm(record) {
  let amount = record.income===null?record.expense:record.income
  console.log(record)
  console.log('form open')
    document.getElementById('edit-id').value = record.id;
    document.getElementById('edit-date').value = record.record_date.replace(/\./g, '-');
    document.getElementById('edit-amount').value = formatCurrency(amount);
    document.getElementById('edit-memo').value = translateString(record.description,userInfo.language);
    document.getElementById('edit-form').style.display = 'block';
    document.getElementById('edit-form').scrollIntoView({ behavior: 'smooth', block: 'start' });
}

function cancelEdit() {
    document.getElementById('edit-form').style.display = 'none';
}

async function updateRecord() {
    const id = document.getElementById('edit-id').value;
    const date = document.getElementById('edit-date').value;
    let amount = document.getElementById('edit-amount').value;
    let memo = document.getElementById('edit-memo').value;
    const token = window.localStorage.getItem('token');

    // 金額の形式変換
    amount = amount.replace(/[^\d.-]/g, ''); // ¥と,以外の文字を削除
    amount = parseFloat(amount).toFixed(2); // 数値に変換し、小数点以下2桁に整形

    // メモの逆翻訳
    memo = reverseTranslateString(memo);

    try {
        const response = await axios.put(`${accessmainserver}/keirikun/data/update`, {
            id,
            date,
            amount,
            memo
        }, {
            headers: { 'Authorization': `Bearer ${token}` }
        });

        if (response.data.success) {
            await swallSuccess();
            updateRecordInArray(id, date, amount, memo);
            updateRecordInDOM(id, date, amount, memo);
            cancelEdit();
        } else {
            swalFail('更新に失敗しました');
        }
    } catch (error) {
        console.error('更新中にエラーが発生しました', error);
        swalFail('更新中にエラーが発生しました');
    }
}

function reverseTranslateString(text) {
  console.log(text)
    const translations = [
        { en: "Client", jp: "請求先" },
        { en: "Cliente", jp: "請求先" },
        { en: "Business Partner", jp: "取引先" },
        { en: "Parceiro de Negócios", jp: "取引先" },
        {en:"Content",jp:"内容"},
        {en:"Conteúdo",jp:"内容"}
    ];

    translations.forEach(({ en, jp }) => {
        const regexEn = new RegExp(en, "g");
        const regexJp = new RegExp(jp, "g");
        text = text.replace(regexEn, jp);
        text = text.replace(regexJp, jp);
    });

    console.log(text)

    return text;
}

async function deleteRecord() {
    showEditForm();
    loadingIndicator.style.display = 'flex';
    const id = document.getElementById('edit-id').value;
    console.log(`Deleting record with id: ${id}`);  // デバッグ用のログ
    const token = window.localStorage.getItem('token');

    try {
        const response = await axios.delete(`${accessmainserver}/keirikun/data/delete`, {
            headers: { 'Authorization': `Bearer ${token}` },
            data: { id }
        });
        if (response.data.success) {
            await swallSuccess();
            removeRecordFromArray(id);
            removeRecordFromDOM(id);
            updateDisplay();  // Displayを更新する
            cancelEdit();
        } else {
            swalFail('削除に失敗しました');
        }
    } catch (error) {
        console.error('削除中にエラーが発生しました', error);
        swalFail('削除中にエラーが発生しました');
    } finally {
        loadingIndicator.style.display = 'none';
    }
}

function removeRecordFromArray(id) {
    const numericId = Number(id);  // idを数値に変換
    console.log('Before removing from array:', JSON.stringify(getDatas, null, 2)); // デバッグ用のログ
    getDatas.income = getDatas.income.filter(record => record.id !== numericId);
    getDatas.expense = getDatas.expense.filter(record => record.id !== numericId);
    console.log('After removing from array:', JSON.stringify(getDatas, null, 2)); // デバッグ用のログ
}


function removeRecordFromDOM(id) {
    const card = document.querySelector(`[data-record-id='${id}']`);
    if (card) {
        card.remove();
    }
}

function updateDisplay() {
    if (selectedButton === 'btn-income-select') {
        populateHistoryCards(getDatas.income);
    } else if (selectedButton === 'btn-expense-select') {
        populateHistoryCards(getDatas.expense);
    }
}

// その他の関数やイベントリスナーは既存のコードに準じます。



async function fetchFilteredData() {
    const filterType = document.getElementById('filter-type').value;
    const filterDate = document.getElementById('filter-date').value;
    const filterCategory = document.getElementById('filter-category').value;

    const url = `${accessmainserver}/keirikun/data/history?type=${filterType}&date=${filterDate}&category=${filterCategory}`;
    const response = await makerequest(url);

    if (response.success) {
        displayHistoryData(response.records);
    } else {
        alert('履歴データの取得に失敗しました');
    }
}

function displayHistoryData(records) {
  console.log(userInfo.language)
    const container = document.getElementById('history-container');
    console.log(records)
    container.innerHTML = '';
    records.forEach(record => {
        const card = document.createElement('div');
        card.className = 'record-card';
        card.style.backgroundColor = record.income ? '#FFDAB9' : '#ADD8E6';
        card.innerHTML = `
            <div>日付: ${record.record_date}</div>
            <div>科目: ${record.party_code}</div>
            <div>金額: ${record.income || record.expense}</div>
            <div>メモ: ${record.description}</div>
            <button onclick="editRecord(${record.id})">修正</button>
            <button onclick="deleteRecord(${record.id})">削除</button>
        `;
        container.appendChild(card);
    });
}

// Function to toggle the selected button and update the displayed history cards
function toggleButton(selectedId) {
    // Get the income and expense buttons by their IDs
    const incomeButton = document.getElementById('btn-income-select');
    const expenseButton = document.getElementById('btn-expense-select');

    // Check if the selected button is the income button
    if (selectedId === 'btn-income-select') {
        // Add the 'selected' class to the income button
        incomeButton.classList.add('selected');
        // Remove the 'selected' class from the expense button
        expenseButton.classList.remove('selected');
        // Populate the history cards with income data
        populateHistoryCards(getDatas.income);
    } else {
        // Populate the history cards with expense data
        populateHistoryCards(getDatas.expense);
        // Add the 'selected' class to the expense button
        expenseButton.classList.add('selected');
        // Remove the 'selected' class from the income button
        incomeButton.classList.remove('selected');
    }
}


document.addEventListener('DOMContentLoaded', function () {
    const filterDateInput = document.getElementById('filter-date');
    const userLanguage = 'pt'; // Assume userInfo.language is available here

    // Set the initial value to the current date in the format YYYY-MM
    filterDateInput.value = new Date().toISOString().slice(0, 7);

    // Fallback solution: set the value to the current date in the user's language format
    const date = new Date();
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are zero-based in JavaScript

    if (userLanguage === 'ja') {
        // Japanese format: YYYY年MM月
        filterDateInput.value = `${year}-${month}`;
        filterDateInput.placeholder = 'YYYY年MM月';
    } else if (userLanguage === 'en') {
        // English format: MM/YYYY
        filterDateInput.value = `${year}-${month}`;
        filterDateInput.placeholder = 'MM/YYYY';
    } else if (userLanguage === 'pt') {
        // Portuguese format: MM/YYYY
        filterDateInput.value = `${year}-${month}`;
        filterDateInput.placeholder = 'MM/YYYY';
    } else {
        // Default to English format
        filterDateInput.value = `${year}-${month}`;
        filterDateInput.placeholder = 'MM/YYYY';
    }

    const token = window.localStorage.getItem('token');
    fetchHistoryData(token, 'btn-income-select');
});


function translatePage(language) {
    const elements = document.querySelectorAll('[data-translate]');
    elements.forEach(el => {
        const key = el.getAttribute('data-translate');
        if (translations[language] && translations[language][key]) {
            if (el.tagName.toLowerCase() === 'input' || el.tagName.toLowerCase() === 'textarea') {
                el.value = translations[language][key];
            } else {
                el.textContent = translations[language][key];
            }
        }
    });
}

document.addEventListener('DOMContentLoaded', function () {
    const filterDateInput = document.getElementById('filter-date');
    filterDateInput.value = new Date().toISOString().slice(0, 7);
    if (filterDateInput) {
        filterDateInput.addEventListener('change', function () {
            getDatas.income=[]
            getDatas.expense=[]
            tgtBtn = 'btn-expense-select'
            const incomeButton = document.getElementById('btn-income-select');
            const expenseButton = document.getElementById('btn-expense-select');

            if (selectedId === 'btn-income-select') {
            }
            fetchHistoryData(window.localStorage.getItem('token'),selectedButton);
        });
    } else {
        console.log('Element not found');
    }

});

function showEditForm() {
    // 現在のスクロール位置を記録
    scrollPosition = window.pageYOffset || document.documentElement.scrollTop;
    const editForm = document.getElementById('edit-form');
    editForm.style.display = 'block';
    editForm.scrollIntoView({ behavior: 'smooth', block: 'center' });
}

function hideEditForm() {
    const editForm = document.getElementById('edit-form');
    editForm.style.display = 'none';
    // スクロール位置を元に戻す
    window.scrollTo({ top: scrollPosition, behavior: 'smooth' });
}

function updateRecordInArray(id, date, amount, memo) {
    id = Number(id);
    const updateRecord = (record) => {
        if (record.id === id) {
            record.record_date = date;
            if (record.income !== null) {
                record.income = amount;
            } else {
                record.expense = amount;
            }
            record.description = memo;
        }
    };

    getDatas.income.forEach(updateRecord);
    getDatas.expense.forEach(updateRecord);
}

function updateRecordInDOM(id, date, amount, memo) {
    const card = document.querySelector(`[data-record-id='${id}']`);
    if (card) {
        card.querySelector('.record-date').textContent = `日付: ${date}`;
        card.querySelector('.record-amount').textContent = `金額: ${formatCurrency(amount)}`;
        card.querySelector('.record-memo').textContent = memo;
    }
}


function cancelEdit() {
    hideEditForm();
}
