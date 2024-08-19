
document.getElementById('analysis-button').style="background-color:#333"

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
  window.location.href = '../pages/monthsubmit.html'; // Redireciona para renda.html
});
document.getElementById("settings-button").addEventListener('click',()=>{
  window.location.href = '../pages/settingpgs.html'; // Redireciona para renda.html
});
document.getElementById("submit-button").addEventListener('click',()=>{
  window.location.href = '../pages/monthdataConfirm.html'; // Redireciona para renda.html
});




let incomeChart = null;
let expenseChart = null;
let summaryPieChart = null;

document.addEventListener('DOMContentLoaded', function () {
    const token = window.localStorage.getItem('token');
    if (token) {
        const decodedToken = jwt_decode(token);
        // translatePage(decodedToken.language);

        const filterMonthInput = document.getElementById('filter-month');
        filterMonthInput.value = new Date().toISOString().slice(0, 7); // 現在の月を設定

       document.getElementById('apply-filter').addEventListener('click', async function () {
           const selectedDate = filterMonthInput.value;
           await updateCharts(token, selectedDate);
       });

       // 初回ロード時にグラフを表示
       updateCharts(token, filterMonthInput.value);
   }
});

async function updateCharts(token, date) {
   const incomeData = await fetchData(token, 'income', date);
   const expenseData = await fetchData(token, 'expense', date);

   console.log(incomeData);
   console.log(expenseData);

   const aggregatedIncomeData = aggregateDataByDate(incomeData);
   const aggregatedExpenseData = aggregateDataByDate(expenseData);
   const totalIncome = aggregatedIncomeData.reduce((sum, item) => sum + item.amount, 0);
   const totalExpense = aggregatedExpenseData.reduce((sum, item) => sum + item.amount, 0);

   if (incomeChart) {
       incomeChart.destroy();
   }
   if (expenseChart) {
       expenseChart.destroy();
   }
   if (summaryPieChart) {
       summaryPieChart.destroy();
   }

   incomeChart = drawBarChart('incomeChart', 'Income Analysis', aggregatedIncomeData);
   expenseChart = drawBarChart('expenseChart', 'Expense Analysis', aggregatedExpenseData);
   summaryPieChart = drawPieChart('summaryPieChart', 'Summary', totalIncome, totalExpense);
}

async function fetchData(token, type, date) {
   try {
       const response = await fetch(`http://localhost:3000/keirikun/data/${type}?date=${date}`, {
           method: 'GET',
           headers: {
               'Authorization': `Bearer ${token}`
           }
       });

       const result = await response.json();
       if (result.success) {
           return result.data;
       } else {
           alert('Failed to fetch data');
           return [];
       }
   } catch (error) {
       console.error('Error fetching data:', error);
       alert('An error occurred while fetching data.');
       return [];
   }
}

function aggregateDataByDate(data) {
   const aggregatedData = {};

   data.forEach(item => {
       const date = new Date(item.date);
       const monthDay = `${String(date.getMonth() + 1).padStart(2, '0')}.${String(date.getDate()).padStart(2, '0')}`;
       const amount = parseFloat(item.amount);

       if (aggregatedData[monthDay]) {
           aggregatedData[monthDay] += amount;
       } else {
           aggregatedData[monthDay] = amount;
       }
   });

   return Object.keys(aggregatedData).map(date => ({
       date,
       amount: aggregatedData[date]
   }));
}

function drawBarChart(canvasId, title, data) {
   const ctx = document.getElementById(canvasId).getContext('2d');
   return new Chart(ctx, {
       type: 'bar',
       data: {
           labels: data.map(item => item.date),
           datasets: [{
               label: title,
               data: data.map(item => item.amount),
               backgroundColor: 'rgba(54, 162, 235, 0.2)',
               borderColor: 'rgba(54, 162, 235, 1)',
               borderWidth: 1
           }]
       },
       options: {
           scales: {
               x: {
                   title: {
                       display: false,
                       text: 'Date'
                   }
               },
               y: {
                   beginAtZero: true,
                   title: {
                       display: false,
                       text: 'Amount'
                   }
               }
           }
       }
   });
}

function drawPieChart(canvasId, title, totalIncome, totalExpense) {
   const ctx = document.getElementById(canvasId).getContext('2d');
   return new Chart(ctx, {
       type: 'pie',
       data: {
           labels: ['Income', 'Expense'],
           datasets: [{
               data: [totalIncome, totalExpense],
               backgroundColor: [
                   'rgba(75, 192, 192, 0.2)',
                   'rgba(255, 99, 132, 0.2)'
               ],
               borderColor: [
                   'rgba(75, 192, 192, 1)',
                   'rgba(255, 99, 132, 1)'
               ],
               borderWidth: 1
           }]
       },
       options: {
           plugins: {
               title: {
                   display: true,
                   text: title
               }
           }
       }
   });
}

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
    translatePages(language)
}


function translatePages(language) {
    const elementsToTranslate = {
        // "title": document.querySelector('header h1'),
        "history": document.getElementById("historybutton"),
        "expense": document.getElementById("keihi-select"),
        "income": document.getElementById("syunyu-select"),
        "transfer": document.getElementById("transfer-select"),
        "date": document.getElementById("div0"),
        "supplier": document.getElementById("div4"),
        "method": document.getElementById("div2"),
        "amount": document.getElementById("div3"),
        "memo": document.getElementById("div1"),
        "register": document.getElementById("input1"),
        "balance": document.getElementById("wallet-balance"),
        "bank_balance": document.getElementById("bank-balance"),
        "from": document.querySelector("#from-account option[value='']"),
        "to": document.querySelector("#to-account option[value='']"),
        "register_transfer": document.querySelector(".regist-button input[value='Registrar']")
    };
    for (const key in elementsToTranslate) {
        if (elementsToTranslate[key]) {
            if (elementsToTranslate[key].tagName === 'INPUT' && elementsToTranslate[key].type === 'button') {
                elementsToTranslate[key].value = translations[language][key];
            } else {
                elementsToTranslate[key].textContent = translations[language][key];
            }
        }
    }
    // pay-selectのオプションを生成
    const paySelect = document.getElementById("pay-select");
    if (paySelect) {
        paySelect.innerHTML = `
            <option value="cash">${translations[language].cash}</option>
            <option value="bank">${translations[language].bank}</option>
            <option value="credit">${translations[language].credit}</option>
        `;
    }
}
