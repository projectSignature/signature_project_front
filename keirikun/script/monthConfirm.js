document.addEventListener('DOMContentLoaded', (event) => {
  const token = window.localStorage.getItem('token');
    const today = new Date();
    const year = today.getFullYear();
    const month = (today.getMonth() + 1).toString().padStart(2, '0'); // 0-based index for months
    const formattedDate = `${year}-${month}`;
    document.getElementById('filter-date').value = formattedDate;
    const decodedToken = jwt_decode(token); // jwtDecodeではなくjwt_decodeを使用
     userInfo.language = decodedToken.language
     userInfo.id = decodedToken.userId
     console.log(userInfo)
     translatePage(userInfo.language)
});

let accessmainserver = 'http://localhost:3000'
let userInfo = {
  proccessNumber:0
}


document.getElementById('submit-button').style="background-color:#333"

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
document.getElementById("analysis-button").addEventListener('click',()=>{
  window.location.href = '../pages/monthdataConfirm.html'; // Redireciona para renda.html
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
