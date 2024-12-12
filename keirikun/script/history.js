
// let window.global.urlApi = 'https://squid-app-ug7x6.ondigitalocean.app'　　//メインサーバーのチェックアクセス先]
// let window.global.urlApi = 'http://localhost:3000'

let currentEditId = null; // 編集中のレコードIDを保持

const token = window.localStorage.getItem('token');
// const loadingIndicator = document.getElementById('loading-indicator');
document.getElementById('history-button').style="background-color:#333"
const filterButton = document.getElementById('filterButton')
const messageDiv = document.getElementById('data.records')

filterButton.addEventListener('click',fetchMasterData)
// let dataTypeSelect = document.getElementById('dataTypeSelect')

    // すべてのボタンを取得
    // const buttons = document.querySelectorAll('.header-buttons .header-button');
    // // クラスを変更する（ループで処理）
    // buttons.forEach((button, index) => {
    //   console.log(button)
    //   if(button.id==='history-button'){
    //     button.style="background-color:#333"
    //   }else{
    //
    //   }
    //     // 既存のクラスを削除し、新しいクラスを追加
    //     button.className = `header-button updated-class-${index + 1}`;
    // });


// // 関数を実行してクラスを変更
// updateButtonClasses();
// const usersInfo = sessionStorage.getItem('keirikunUser')
// console.log(usersInfo.Masterdespesas)
const userInfo = JSON.parse(sessionStorage.getItem('keirikunUser'));
pageload()
async function pageload(){
  if (token) {
      showLoadingPopup();
      // const decodedToken = jwt_decode(token); // jwtDecodeではなくjwt_decodeを使用
      // console.log(decodedToken)
      // userInfo.id=decodedToken.userId
      // userInfo.language=decodedToken.language
      //  userInfo.language = decodedToken.language
      //  userInfo.id = decodedToken.userId
       getMasterData()
       await translatePage(userInfo.language)
       await setDateInputs()
       await fetchMasterData(token)
     hideLoadingPopup();
  }
}

async function getMasterData(){
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
    userInfo.clients = data.data.clients
    userInfo.suppliers = data.data.suppliers
    userInfo.userCategories = data.data.userCategories

  }
}
// トークンをデコードしてペイロードを取得
const getStartOfMonth = () => {
    const today = new Date();
    const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
    // ローカルのYYYY-MM-DD形式に変換
    return startOfMonth.getFullYear() + '-' + String(startOfMonth.getMonth() + 1).padStart(2, '0') + '-' + String(startOfMonth.getDate()).padStart(2, '0');
};
// 当月の最終日を取得する関数
const getEndOfMonth = () => {
    const today = new Date();
    const endOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0);
    // ローカルのYYYY-MM-DD形式に変換
    return endOfMonth.getFullYear() + '-' + String(endOfMonth.getMonth() + 1).padStart(2, '0') + '-' + String(endOfMonth.getDate()).padStart(2, '0');
};
// 入力フィールドに日付を設定する関数
const setDateInputs = () => {
    const startDateInput = document.getElementById('startDate');
    const endDateInput = document.getElementById('endDate');
    // 初日と最終日をそれぞれ設定
    startDateInput.value = getStartOfMonth();  // 当月の初日
    endDateInput.value = getEndOfMonth();      // 当月の最終日
};

async function makerequest(url) {
    const response = await fetch(url);
    if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
    }
    return response.json();
}

async function fetchMasterData(token) {
  try {
          const token = localStorage.getItem('token'); // ログイン時のトークンを取得
          const startDate = document.getElementById('startDate').value
          const endDate = document.getElementById('endDate').value
          console.log(startDate)
          console.log(endDate)
          if (!token) {
              console.error('Authentication token is missing');
              return;
          }
          showLoadingPopup();
          const response = await fetch(`${window.global.urlApi}/keirikun/data/history?startDate=${startDate}&endDate=${endDate}`, {
              method: 'GET',
              headers: {
                  'Content-Type': 'application/json',
                  'Authorization': `Bearer ${token}` // トークンをヘッダーに含める
              }
          });
          const data = await response.json();
          if (response.ok) {
              if (data.success) {
                  console.log('History data:', data.records); // 成功時のデータ
                  if(data.records.length!=0){
                    console.log(data)
                    displayRecords(data.records); // データを表示するための関数を呼び出し
                    userInfo.history = data.records

                  }else{
                    messageDiv.style.display='block'
                    messageDiv.innerText='n:ao ha datas'
                  }

              } else {
                  console.error('Error fetching data:', data.message);
              }
          } else {

              console.error('Failed to fetch financial history:', data.message);
          }
          hideLoadingPopup();
      } catch (error) {
        hideLoadingPopup();
          console.error('Fetch error:', error);
      }
}
// カードを作成して表示する関数
   function displayRecords(records) {
     console.log(userInfo)
       const container = document.getElementById('cardContainer');
       container.innerHTML = '';  // コンテナをクリア
       records.forEach(record => {
         console.log(records)
         console.log(userInfo)
         let category
         if(record.income===null){
           category = userInfo.Masterdespesas.find(category => category.category_id === record.party_code-0);
         }else{
           category = userInfo.Mastervendas.find(category => category.category_id === record.party_code-0);
         }


           const card = document.createElement('div');
           card.classList.add('card');
           // カードの背景色を収入・支出で分ける
           if (record.income) {
               card.classList.add('income');
           } else if (record.expense) {
               card.classList.add('expense');
           }

           // カードの内容
           const description = record.description.split(' 内容:')[0].replace('取引先:', '').split('(')[0];  // 取引先名
           const amount = record.income ? `${translations[userInfo.language]['income']}: ¥${Number(record.income).toLocaleString()}`
           : `${translations[userInfo.language]['despesas']}: ¥${Number(record.expense).toLocaleString()}`;
           card.innerHTML = `
              <div class="card-icon">
                  <img src="https://orders-image.sgp1.digitaloceanspaces.com/keirikun/${record.party_code}.svg" alt="Category Icon">
                  <span class="icon-label">${category.m_category[`category_name_${userInfo.language}`]}</span> <!-- カテゴリ名を表示 -->
              </div>
              <h3>${description}</h3>
              <p>${record.description.split(' 内容:')[1]}</p>
              <p>${amount}</p>
              <div class="actions">
                  <button class="btn edit ${record.confirmed ? "no-visible" : ''}" onclick="editRecord(${record.id})">${translations[userInfo.language]["update"]}</button>
                  <button class="btn delete ${record.confirmed ? "no-visible" : ''}" onclick="deleteRecord(${record.id})">${translations[userInfo.language]["delete"]}</button>
                  <span class="confirmed-span ${record.confirmed ? "" : 'no-visible'}" style="color:red">※${translations[userInfo.language]["registrado"]}</span>
              </div>
          `;

           container.appendChild(card);
       });
   }

   function editRecord(id) {
       const record = userInfo.history.find(record => record.id === id);
       if (!record) {
           alert("レコードが見つかりません");
           return;
       }
       // 編集モーダルにデータを設定
       let names = record.description.split(' 内容:')[0].replace('取引先:', '');
       if(record.income===null){
         populateSupplierOptions(names)
         document.getElementById('modal-kubun').innerText = translations[userInfo.language]['supplier']
       }else{

       }
       const income = record.income ? Number(record.income) : null;
       const expense = record.expense ? Number(record.expense) : null;
       const editAmountElement = document.getElementById('editAmount-modal');
       if (income) {
       editAmountElement.value = `￥${income.toLocaleString()}`;
         } else if (expense) {

             editAmountElement.value = `￥${expense.toLocaleString()}`;
         } else {
             editAmountElement.value = '￥0';
         }

       document.getElementById('editMemo').value = record.description.split(' 内容:')[1];
       document.getElementById('pay-select').value = record.payment_method;
       // 編集中のIDを保持
       currentEditId = id;

       createMaster(record.party_code)
       // モーダルを表示
       document.getElementById('editModal-history').style.display = 'flex';
   }

   async function createMaster(selectKamoku) {
       const selectSupp = document.getElementById("category-modal"); // select要素を取得
       const masterDespesas = userInfo.Masterdespesas; // Masterdespesasを取得

       // 既存のオプションをクリア
       selectSupp.innerHTML = '';

       // Masterdespesasをループ
       masterDespesas.forEach(despesa => {
         console.log(despesa)
           // <option>要素を作成
           const option = document.createElement('option');
           option.value = despesa.m_category.identification_id; // 値をcategory_idに設定
           option.textContent = despesa.m_category.category_name_pt; // 表示名をカテゴリ名に設定
           if((despesa.category_id-0)===(selectKamoku-0)){
             option.selected = true
           }
           // <select>に追加
           selectSupp.appendChild(option);
       });

       console.log('Options added to modal-kamoku');
   }


   async function deleteRecord(recordId) {
    // 確認ダイアログ
    const confirmed = confirm(translations[userInfo.language]['deleteCOnfirmedData']);
    if (!confirmed) return;

    try {
        // サーバーに DELETE リクエストを送信
        showLoadingPopup();
        const response = await fetch(`${window.global.urlApi}/keirikun/financial-records-delete/${recordId}`, {
            method: 'DELETE'
        });

        if (response.ok) {
            // ローカルデータを更新
            userInfo.history = userInfo.history.filter(record => record.id !== recordId);

            // レコードを再描画
            displayRecords(userInfo.history);
            alert(translations[userInfo]['dataDeleted']);
        } else {
            const errorData = await response.json();
            alert(translations[userInfo]['errorMessage']);
        }
        hideLoadingPopup();
    } catch (error) {
        hideLoadingPopup();
        console.error("Error deleting record:", error);
        alert(translations[userInfo]['errorMessage']);
    }
}




   function closeEditModal() {
       document.getElementById('editModal-history').style.display = 'none';
   }

//変更モーダル　金額要素の変更があった時にフォマットを指定(￥〇,〇〇〇)
   document.getElementById('editAmount-modal').addEventListener('input', function (event) {
    const inputElement = event.target;

    // 既存の値から "￥" を取り除き数値に変換
    let rawValue = inputElement.value.replace(/[^\d]/g, ''); // 数字以外を除去
    if (!rawValue) {
        inputElement.value = ''; // 空欄のまま
        return;
    }

    // 数値をロケール形式に変換
    const formattedValue = Number(rawValue).toLocaleString();

    // "￥" を付けて再設定
    inputElement.value = `￥${formattedValue}`;
});


   function populateSupplierOptions(names) {
       console.log(names);
       const selectElement = document.getElementById('editDescription'); // <select>要素を取得

       // <select>要素を一旦クリア（必要に応じて）
       selectElement.innerHTML = '';

       // suppliers配列をループ
       console.log(userInfo.suppliers);
       userInfo.suppliers.forEach(supplier => {
           const option = document.createElement('option'); // <option>要素を作成
           option.value = supplier.id; // 値を設定
           option.textContent = supplier.supplier_name; // 表示テキストを設定
           if (supplier.supplier_name === names.split('(')[0] ){
               option.selected = true;
           }
           selectElement.appendChild(option); // <select>に追加
       });
   }


   async function saveChanges() {
       const selectElement = document.getElementById('editDescription');
       const selectedValue = selectElement.value;
       const selectedText = selectElement.options[selectElement.selectedIndex].text;
       const newPaymentMethod = document.getElementById('pay-select').value
       const newCategorie = document.getElementById('category-modal').value
       const amount = parseFloat(
    document.getElementById('editAmount-modal').value.replace(/[￥,]/g, '')
);
       const memo = document.getElementById('editMemo').value;

       if (isNaN(amount) ){
           alert("すべての必須フィールドを正しく入力してください。");
           return;
       }

       // 編集対象のレコードを更新
       const record = userInfo.history.find(record => record.id === currentEditId);
       if (record) {
         console.log(record)
         try {
           showLoadingPopup()
                      const updatedRecord = {
                        description: `取引先:${selectedText}(${selectedValue}) 内容:${memo}`,
                        income: record.income ? amount : undefined,
                        expense: record.expense ? amount : undefined,
                        payment_method:newPaymentMethod,
                        party_code:newCategorie
                      };
                    const response = await fetch(`${window.global.urlApi}/keirikun/financial-records/${record.id}`, {
                        method: 'PUT',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify(updatedRecord)
                    });

                    if (response.ok) {
                        const result = await response.json();
                        console.log('Update successful:', result);

                        // ローカルデータを更新
                        record.description = updatedRecord.description;
                        record.income = updatedRecord.income || record.income;
                        record.expense = updatedRecord.expense || record.expense;
                        record.party_code = updatedRecord.party_code,
                        record.payment_method = updatedRecord.payment_method

                        // モーダルを閉じる
                        closeEditModal();

                        // レコードを再描画
                        displayRecords(userInfo.history);
                    } else {
                        const error = await response.json();
                        console.error('Server error:', error);
                        alert('更新に失敗しました: ' + error.error);
                    }
                    hideLoadingPopup()
                } catch (error) {
                    console.error('Error updating record:', error);
                    hideLoadingPopup()
                    alert('エラーが発生しました。もう一度お試しください。');
                }



           // record.description = `取引先:${selectedText}(${selectedValue}) 内容:${memo}`;
           // if (record.income) {
           //     record.income = amount;
           // } else if (record.expense) {
           //     record.expense = amount;
           // }
       }


       // モーダルを閉じる
       closeEditModal();

       // レコードを再描画
       displayRecords(userInfo.history);
   }


// function populateSupplierOptions() {
//     const supplierSelect = document.getElementById('editDescription');
//     // 既存のオプションをクリア
//     supplierSelect.innerHTML = '';
//     // サプライヤーリストをループしてオプションを生成
//     userInfo.suppliers.forEach(supplier => {
//         const option = document.createElement('option');
//         option.value = supplier.supplier_id;
//         option.textContent = supplier.supplier_name;
//         supplierSelect.appendChild(option);
//     });
// }

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
        "register_transfer": document.querySelector(".regist-button input[value='Registrar']"),
        "update":document.getElementById('edit-title'),
        "amount":document.getElementById('modal-amount'),
        "memo":document.getElementById('modal-memo'),
        "save":document.getElementById('modal-save-butoom'),
        "category":document.getElementById('modal-kamoku'),
        "paymethod":document.getElementById('modal-how-pay')
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
    console.log(userInfo)
    console.log(supplierSelect.value)
    const geTclients = userInfo.MsClients.find(supplier => supplier.supplier_id-0 === supplierSelect.value-0);
    console.log(geTclients)
    const clients = geTclients.supplier_name + `${geTclients.supplier_name}(${supplierSelect.value})`
    // データの準備
    // const data = {
    //     date,
    //     method,
    //     amount,
    //     memo,
    //     category,
    //     userId: userInfo.id,
    //     clients,
    //     kubun:1
    // };

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
        const response = await fetch(`${window.global.urlApi}/keirikun/data/regist/expenses`, {
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
            resetForm()
        } else {
            alert('マスターデータの取得に失敗しました');
        }
    } catch (error) {
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
    console.log(categoryId)
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

    console.log('Data to be sent:', data); // 送信するデータをログ出力

    try {
        const response = await fetch(`${window.global.urlApi}/keirikun/data/regist/expenses`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}` // トークンをヘッダーに含める
            },
            body: JSON.stringify(data)
        });

        const result = await response.json();

        if (response.ok) {
            swallSuccess()
            resetForm()
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

//  function dayChange(data){
//   let date = new Date(dt.value.split("-")[0], dt.value.split("-")[1]-1, dt.value.split("-")[2]);
//   if(data==2){
//     date.setDate(date.getDate() + 1)
//   }else{
//     date.setDate(date.getDate() - 1)
//   }
//   let dM = (("0" + (date.getMonth()+1)).slice(-2))
//   let dd = (("0" + date.getDate()).slice(-2))
//   dt.value = `${date.getFullYear()}-${dM}-${dd}`
// }



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
