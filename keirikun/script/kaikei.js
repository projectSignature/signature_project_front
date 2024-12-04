
// let server = 'https://squid-app-ug7x6.ondigitalocean.app'　　//メインサーバーのチェックアクセス先]

let userInfo = {
  proccessNumber:0 //支出登録を選択してる状態
}
let userCategories = []
let dt = document.getElementById("calender-input")
const dataTypeSelect = document.getElementById('dataTypeSelect')
const categoryContainer = document.getElementById('categorysdiv');
// let despesaSelect = document.getElementById('dataTypeSelect')

// jwt-decodeをCDNから読み込む場合
// HTMLファイル内に <script src="https://cdn.jsdelivr.net/npm/jwt-decode/build/jwt-decode.min.js"></script> を追加します。

// トークンをlocalStorageから取得
const token = window.localStorage.getItem('token');
console.log()
// const loadingIndicator = document.getElementById('loading-indicator');
document.getElementById('input-button').style="background-color:#333"


// let dataTypeSelect = document.getElementById('dataTypeSelect')
dataTypeSelect.addEventListener('change',()=>{
  console.log(userInfo)
  if(userInfo.proccessNumber ===1){
    userInfo.proccessNumber =0
    populateCategoryCards(userInfo.Masterdespesas)
    populateSupplierOptions(userInfo.MsFornecedor)

    document.getElementById('div4').innerText = translations[userInfo.language].supplier
  }else{
    userInfo.proccessNumber =1
    populateCategoryCards(userInfo.Mastervendas)
    populateSupplierOptions(userInfo.MsClients)
    document.getElementById('div4').innerText = translations[userInfo.language].fonte
  }

})
function creatsSelectsDataType(){
  return `
            <option value="despesa" selected>${translations[userInfo.language].despesas}</option>
            <option value="renda">${translations[userInfo.language].income}</option>
            `
            // <option value="transferencia">${translations[userInfo.language].transfer}</option>
}
pageload()
async function pageload(){
  if (token) {
    showLoadingPopup();
      const decodedToken = jwt_decode(token); // jwtDecodeではなくjwt_decodeを使用
       userInfo.language = decodedToken.language
       userInfo.id = decodedToken.userId
       userInfo.name = decodedToken.clientNmae
       userInfo.email = decodedToken.email
       await translatePage(userInfo.language)
       await fetchMasterData(token)
      // 言語情報を使ってフロントエンドのロジックを実装
      // 例えば、言語情報に基づいてUIを変更するなど
      var today = new Date();
      let yyyy = today.getFullYear();
      let mm = ("0"+(today.getMonth()+1)).slice(-2);
      let dd = ("00" + today.getDate()).slice(-2);
      dt.value = `${yyyy}-${mm}-${dd}`
      dataTypeSelect.innerHTML = creatsSelectsDataType()
      hideLoadingPopup();
  }
}
// トークンをデコードしてペイロードを取得


async function makerequest(url) {
    const response = await fetch(url);
    if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
    }
    return response.json();
}

async function fetchMasterData(token) {
    try {
        const url = `${window.global.urlApi}/keirikun/masterdata/get`;
        const response = await fetch(url, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });
        if (response.ok) {
          const data = await response.json();
          console.log(data)
          userInfo.Masterdespesas = data.data.userCategories.filter(item => item.type_data === 0)
          userInfo.Mastervendas = data.data.userCategories.filter(item => item.type_data === 1)
          userInfo.MsClients = data.data.suppliers.filter(item => item.kubun === 1)
          userInfo.MsFornecedor = data.data.suppliers.filter(item => item.kubun === 0)
            // マスターデータを処理
            userInfo.suppliers = data.data.suppliers;
            sessionStorage.setItem('keirikunUser', JSON.stringify(userInfo));
            populateSupplierOptions(userInfo.MsFornecedor); //サプライヤーのセレクトを生成
            populateCategoryCards(userInfo.Masterdespesas);
            // loadingIndicator.style.display = 'none';
        } else {
            alert('マスターデータの取得に失敗しました');
        }
    } catch (error) {
        alert('マスターデータの取得中にエラーが発生しました');
        console.error(error);
    }
}


function populateSupplierOptions(suppliers) {
    const supplierSelect = document.getElementById('Suppliers-options');
    // 既存のオプションをクリア
    supplierSelect.innerHTML = '';
    // サプライヤーリストをループしてオプションを生成
    suppliers.forEach(supplier => {
        const option = document.createElement('option');
        option.value = supplier.supplier_id;
        option.textContent = supplier.supplier_name;
        supplierSelect.appendChild(option);
    });
}

function populateCategoryCards(userCategories) {
    console.log(userCategories)
    // 既存のカードをクリア
    categoryContainer.innerHTML = '';

    // 選択されたカードを保持する変数
    let selectedCard = null;
    // カテゴリーリストをループしてカードを生成
    userCategories.forEach(category => {
        const card = document.createElement('div');
        card.className = 'category-card';
        card.setAttribute('data-category-id', category.m_category.identification_id); // カテゴリIDをデータ属性に設定

        const icon = document.createElement('img');
        icon.src = `../image/${category.m_category.icon_number}.svg`;
        icon.alt = category.m_category[`category_name_${userInfo.language}`];
        card.appendChild(icon);

        const name = document.createElement('div');
        name.className = 'category-name';
        name.textContent = category.m_category[`category_name_${userInfo.language}`];
        card.appendChild(name);
        categoryContainer.appendChild(card);

        // カードクリックイベントを追加
        card.addEventListener('click', function () {
            // すでに選択されているカードの色を元に戻す
            if (selectedCard) {
                selectedCard.style.backgroundColor = '';
                selectedCard.classList.remove('selected'); // 既存のselectedクラスを削除
            }

            // 新しく選択したカードの色を変更する
            card.style.backgroundColor = '#FFDAB9';
            card.classList.add('selected'); // 新しくselectedクラスを追加
            selectedCard = card;

            // 選択したカテゴリのIDをuserInfo.selectCategoryに格納する
            const categoryId = card.getAttribute('data-category-id');
            userInfo.selectCategory = categoryId;
        });
    });
}

function populateClientCards(clients, language) {
    const clientContainer = document.getElementById('categorysdiv');
    // 既存のカードをクリア
    clientContainer.innerHTML = '';
    // 選択されたカードを保持する変数
    let selectedCard = null;
    // クライアントリストをループしてカードを生成
    console.log(userInfo.suppliers.clients)
    userInfo.suppliers.clients.forEach(client => {
        const card = document.createElement('div');
        card.className = 'client-card';
        card.setAttribute('data-client-id', client.id); // クライアントIDをデータ属性に設定
        card.setAttribute('data-category-id', 511); // 科目IDをデータ属性に設定（固定）

        const icon = document.createElement('img');
        icon.src = `../image/client-icon.svg`; // クライアント用のアイコン（適宜変更）
        icon.alt = client.client_name; // クライアント名をaltテキストに設定
        card.appendChild(icon);

        const name = document.createElement('div');
        name.className = 'client-name';
        name.textContent = client.client_name; // クライアント名を表示
        card.appendChild(name);
        clientContainer.appendChild(card);
        // カードクリックイベントを追加
        card.addEventListener('click', function () {
            // すでに選択されているカードの色を元に戻す
            if (selectedCard) {
                selectedCard.style.backgroundColor = '';
                selectedCard.classList.remove('selected'); // 既存のselectedクラスを削除
            }
            // 新しく選択したカードの色を変更する
            card.style.backgroundColor = '#FFDAB9';
            card.classList.add('selected'); // 新しくselectedクラスを追加
            selectedCard = card;
            // 選択したクライアントのIDと固定の科目IDをuserInfo.selectCategoryに格納する
            const clientId = card.getAttribute('data-client-id');
            const categoryId = card.getAttribute('data-category-id');
            userInfo.selectClient = clientId;
            userInfo.selectCategory = categoryId;

            console.log('Selected Client ID:', userInfo.selectClient);
            console.log('Selected Category ID:', userInfo.selectCategory);
            console.log(selectedCard)
        });
    });
}

function resetForm() {
    document.getElementById('memo-pay').value = '';
    document.getElementById('value-input').value = '';
    const categoryContainer = document.getElementById('categorysdiv');
    const selectedCard = categoryContainer.querySelector('.client-card.selected');
    if (selectedCard) {
        selectedCard.style.backgroundColor = '';
        selectedCard.classList.remove('selected');
    }
    const selectedCardClient = categoryContainer.querySelector('.client-card selected');
    if (selectedCardClient) {
        selectedCardClient.style.backgroundColor = '';
        selectedCardClient.classList.remove('selected');
    }
    userInfo.selectClient = null;
    userInfo.selectCategory = null;
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
        "typedt": document.getElementById('type-mother'),
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

async function soubetsuProcess(){
  console.log('soubetus')

  userInfo.proccessNumber===0?sendData():sendSyunyu()


}

async function sendSyunyu() {
    const date = document.getElementById('calender-input').value;
    const supplierSelect = document.getElementById('Suppliers-options');
    const method = document.getElementById('pay-select').value;
    const amount = document.getElementById('value-input').value;
    const memo = document.getElementById('memo-pay').value || ''; // メモは必須ではない
    const categoryId = userInfo.selectCategory;
    // 必須フィールドのチェック
    if (!date || !amount || !categoryId) {
        alert('必要なフィールドが入力されていません');
        return;
    }

    const geTclients = userInfo.MsClients.find(supplier => supplier.supplier_id-0 === supplierSelect.value-0);
    const clients = geTclients.supplier_name + `${geTclients.supplier_name}(${supplierSelect.value})`
    const data = {
        userId:userInfo.id,
        date: date,
        supplier: clients,
        method: method,
        amount: amount,
        memo: memo,
        category: categoryId,
        kubun:1

    };

    // データの送信
    try {
      showLoadingPopup()
        const response = await fetch(`${server}/keirikun/data/regist/expenses`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${window.localStorage.getItem('token')}`
            },
            body: JSON.stringify(data)
        });

        const result = await response.json();

        if (result.success) {
            await swallSuccess()
            await resetForm()
            hideLoadingPopup()
        } else {
            alert('マスターデータの取得に失敗しました');
        }
    } catch (error) {
      hideLoadingPopup()
        console.error('Error sending income data:', error);
        // await swalError(); // エラーメッセージの表示
    }
}


async function sendData() {
    // const token = window.localStorage.getItem('token'); // トークンを取得
    const date = document.getElementById('calender-input').value;
    // const supplier = document.getElementById('Suppliers-options').value;
    const method = document.getElementById('pay-select').value;
    const amount = document.getElementById('value-input').value;
    const memo = document.getElementById('memo-pay').value;
    const categoryId = userInfo.selectCategory;

    // 必須項目のチェック
    if (!amount) {
        alert(translations[userInfo.language].enterAmount);
        return;
    }
    if (!categoryId) {
        alert(translations[userInfo.language]['selectCategory']);
        return;
    }
    if (!memo) {
        alert(translations[userInfo.language]['senterMemo']);
        return;
    }

    const supplier = userInfo.suppliers.find(supplier => supplier.supplier_id === document.getElementById('Suppliers-options').value-0);
    const data = {
        userId:userInfo.id,
        date: date,
        supplier: `${supplier.supplier_name}(${document.getElementById('Suppliers-options').value-0})`,
        method: method,
        amount: amount,
        memo: memo,
        category: categoryId,
        kubun:0
    };
    try {
      showLoadingPopup()
        const response = await fetch(`${server}/keirikun/data/regist/expenses`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}` // トークンをヘッダーに含める
            },
            body: JSON.stringify(data)
        });

        const result = await response.json();
        if (response.ok) {
            await swallSuccess()
            resetForm()
            hideLoadingPopup()
        } else {
            alert(translations[userInfo.language]['dataSendFail']);
        }
    } catch (error) {
        console.error('Error:', error);
        alert(translations[userInfo.language]['dataSendError']);
    }
}

async function kanmaReplase(){
  let data = document.getElementById('value-input')
  if(data.value.length==1&&data.value!="￥"){
    data.value = ("￥" + data.value)
  }else{
   let numberAns = (data.value.slice( 1 )).replace(/[^0-9]/g, "");
   kanmaAns = numberAns.replace(/(\d)(?=(\d\d\d)+(?!\d))/g, '$1,');
   data.value = `￥${kanmaAns}`
 }
   //return `￥${kanmaAns}`
};


// Add custom CSS for the toast
const style = document.createElement('style');
style.innerHTML = `
  .colored-toast {
    background-color: #f4f6f9;
    border: 1px solid #dcdcdc;
    color: #333;
    font-family: 'Arial', sans-serif;
    font-size: 14px;
    box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
    animation: slideIn 0.5s ease-out, slideOut 0.5s ease-in 2.5s;
  }

  @keyframes slideIn {
    from {
      transform: translateY(-100%);
      opacity: 0;
    }
    to {
      transform: translateY(0);
      opacity: 1;
    }
  }

  @keyframes slideOut {
    from {
      transform: translateY(0);
      opacity: 1;
    }
    to {
      transform: translateY(-100%);
      opacity: 0;
    }
  }

  .swal2-title {
    font-weight: bold;
  }

  .swal2-html-container {
    margin-top: 10px;
  }

  .swal2-icon {
    font-size: 20px;
  }

  .swal2-icon.swal2-success {
    border-color: #28a745;
  }
`;
document.head.appendChild(style);

function switchToIncomeMode() {
    document.getElementById('div4').textContent = translations[userInfo.language].client; // クライアントに切り替え
    populateClientCards(); // 収入のカテゴリーカードを生成
    document.getElementById('supplieres-top-div').style = 'display:none'
    userInfo.proccessNumber = 1
}

function switchToExpensesMode() {
    document.getElementById('div4').textContent = translations[userInfo.language].supplier; // クライアントに切り替え
    populateCategoryCards(userInfo.suppliers.userCategories,userInfo.language)
    document.getElementById('supplieres-top-div').style = 'display:flex'
    userInfo.proccessNumber = 0
}

// // 切り替えボタンのイベントリスナー
// document.getElementById('syunyu-select').addEventListener('click', switchToIncomeMode);
// document.getElementById('keihi-select').addEventListener('click', switchToExpensesMode);


// JavaScript部分をkaikei.jsに追加

function highlightButton(buttonId) {
    const buttons = document.querySelectorAll('.top-button');
    buttons.forEach(button => {
        if (button.id === buttonId) {
            button.style.backgroundColor = 'orange'; // 選択されたボタンの色を変更
        } else {
            button.style.backgroundColor = ''; // 他のボタンの色を元に戻す
        }
    });
}
