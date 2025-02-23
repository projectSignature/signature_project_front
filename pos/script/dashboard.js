const token = JSON.parse(window.localStorage.getItem('user'));
const element = document.querySelector('.selects-container-for-pc');
let nameSpan = document.getElementById('spn-representative')
let userInfo={}
let currentSaleId = ""
 const year = document.getElementById('selectYear')
 year.value='2025'

year.addEventListener('change', function () {
    fetchTotalSales()
});




// document.addEventListener("DOMContentLoaded", async () => {
  // const decodedToken = await jwt_decode(token); // jwtDecodeではなくjwt_decodeを使用
  // console.log(decodedToken)
   userInfo.language = token.language;
   userInfo.id = token.user_id;
   userInfo.representativeName = token.representative_name;
   userInfo.expense_id = token.expenses_get_id;
   nameSpan.innerText = token.representative_name;
   userInfo.current_password = '';
   userInfo.password = '';
   userInfo.confirm_password = '';
   userInfo.email = token.username

   if(!token){
     window.location.href = './pages/dashboard.html';
   }



  // fetchMonthlyExpenses()
  // レジ履歴ボタンを取得とデータの取得
   const analistButton = document.querySelector('.button-container button:nth-child(1)')
   const salesButton = document.querySelector('.button-container button:nth-child(2)')
   const registerButton = document.querySelector('.button-container button:nth-child(3)')
   const settingsButton = document.querySelector('.button-container button:nth-child(4)');
   const settingsList = document.getElementById('settingsList');
   const salesChartContainer = document.getElementById('salesChartContainer');
   const expensesChartContainer = document.getElementById('expensesChartContainer');
   const registerFilter = document.getElementById('registerFilter');
   const registerHistory = document.getElementById('registerHistory');
   const totalincome = document.getElementById('card_income')
   const firstUnder = document.getElementById('under-container')
   const secondUnder = document.getElementById('under-container2')
   const thirdUnder = document.getElementById('under-container3')
   const fourthUnder =document.getElementById('under-container4')
   let dataPdefMobile = ""
   let historyBUton = false
   // const totalexpense = document.getElementById('card_expense')
   const salesContainer = document.getElementById('registerSalesHistory')
   const settingsModal = document.getElementById('settingsModal');
    const modalTitle = document.getElementById('modalTitle');
    const modalBody = document.getElementById('modalBody');
    const closeModal = document.querySelector('.modal .close');
    const saveButton = document.getElementById('saveButton');
    const personalSettings = document.getElementById('personalSettingsForm');
    const overlays = document.getElementById('menuOverlay');
    const selectsHidden = document.getElementById('selects-byday-or-month')
   // 今日の日付を取得
    const today = new Date();
    const yyyy = today.getFullYear();
    const mm = String(today.getMonth() + 1).padStart(2, '0'); // 月は0から始まるので+1する
    const dd = String(today.getDate()).padStart(2, '0');
    const isVisible = window.getComputedStyle(element).display !== 'none';
    const firstDayOfMonth = `${yyyy}-${mm}-01`;
    const todayFormatted = `${yyyy}-${mm}-${dd}`;
    document.getElementById('startDate').value=firstDayOfMonth
    document.getElementById('endDate').value=todayFormatted
    if(isVisible){
      // 30日前の日付を計算
      const pastDate = new Date();
      pastDate.setDate(today.getDate() - 30);
      const pastYyyy = pastDate.getFullYear();
      const pastMm = String(pastDate.getMonth() + 1).padStart(2, '0');
      const pastDd = String(pastDate.getDate()).padStart(2, '0');

      // inputタグに初期値を設定
      document.getElementById('start-day').value = `${pastYyyy}-${pastMm}-${pastDd}`;
      document.getElementById('finish-day').value = `${yyyy}-${mm}-${dd}`;
      fetchTotalSalesPcDisplay()
    }else{
      // 今月の初日を設定

      fetchTotalSales()
    }


    // 分析ボタンのイベントリスナー
    analistButton.addEventListener('click', async() =>{
      const startDayElement = document.getElementById("start-day");
      const finishDayElement = document.getElementById("finish-day");
      document.getElementById('mobile-pdf').style.display = 'none'

      if (startDayElement && startDayElement.offsetParent !== null) {
        secondUnder.style.display='none'
        thirdUnder.style.display='none'
        firstUnder.style.display='flex'
        fourthUnder.style.display='none'
      }else{
        selectsHidden.style.display = 'block'

        toggleDisplay(
            [salesChartContainer, expensesChartContainer, totalincome], // 表示する要素
            [salesContainer, registerFilter, registerHistory, settingsList] // 非表示にする要素
        );
      }

    });

    // 売上ボタンのイベントリスナー
    salesButton.addEventListener('click', async()=>{
      historyBUton = true
        loadingIndicator.style.display = 'block';
        selectsHidden.style.display = 'none'
        document.getElementById('mobile-pdf').style.display = 'block'
          toggleDisplay(
              [registerFilter, registerHistory], // 表示する要素
              [salesChartContainer, expensesChartContainer, totalincome, settingsList] // 非表示にする要素
          );
          // デフォルト日付でレジ履歴を自動的に表示
          await fetchAndDisplaySalesHistory(firstDayOfMonth, todayFormatted);
        // overlays.style.display = 'none'
    });

    // レジ履歴ボタンのイベントリスナー
    registerButton.addEventListener('click', async() => {
      const startDayElement = document.getElementById("start-day");
      const finishDayElement = document.getElementById("finish-day");
      document.getElementById('mobile-pdf').style.display = 'none'
      selectsHidden.style.display = 'none'
        if (startDayElement && startDayElement.offsetParent !== null) {
         await fetchAndDisplayRegisterHistory(startDayElement.value, finishDayElement.value);
        firstUnder.style.display='none'
        secondUnder.style.display='block'
        thirdUnder.style.display='none'
        firstUnder.style.display='none'
        fourthUnder.style.display='none'
        }else{
          toggleDisplay(
              [registerFilter, registerHistory], // 表示する要素
              [salesChartContainer, expensesChartContainer, totalincome, salesContainer, settingsList] // 非表示にする要素
          );
          await fetchAndDisplayRegisterHistory(firstDayOfMonth, todayFormatted);
        }
          loadingIndicator.style.display = 'none';
    });

    // 設定ボタンのイベントリスナー
    settingsButton.addEventListener('click', function () {
      document.getElementById('mobile-pdf').style.display = 'none'
      selectsHidden.style.display = 'none'
        // 設定リストの表示/非表示を切り替える
        if (settingsList.style.display === 'none') {
            toggleDisplay([settingsList], [salesChartContainer, expensesChartContainer, totalincome, salesContainer, registerFilter, registerHistory]);
        } else {
            settingsList.style.display = 'none';
        }
    });

    settingsList.querySelector('li:first-child').addEventListener('click', function () {
        settingsList.style.display = 'none';
        // personalSettings.style.display = 'block';
    });


    function toggleDisplay(showElements, hideElements) {
    showElements.forEach(element => {
        element.style.display = 'block';
        if(element.id==='card_income'){
          document.getElementById('card_income').style.display = 'flex';
          document.getElementById('card_income').style.alignItems = 'center'; // 中央揃え
          document.getElementById('card_income').style.gap = '10px'; // h2とpの間隔を調整
        }
    });
    hideElements.forEach(element => {
        element.style.display = 'none';
    });
}
     // フィルターボタンをクリックしたときの動作
     document.getElementById('filterButton').addEventListener('click', async () => {
         const startDate = document.getElementById('startDate').value;
         const endDate = document.getElementById('endDate').value;

         if (!startDate || !endDate) {
             alert('開始日と終了日を選択してください。');
             return;
         }
        console.log(historyBUton)
        if(historyBUton){
          console.log('sales')
          await fetchAndDisplaySalesHistory(startDate, endDate);
        }else{
          await fetchAndDisplayRegisterHistory(startDate, endDate);
        }


     });

     // レジ履歴データを取得し、表示する関数
     async function fetchAndDisplayRegisterHistory(startDate, endDate) {
         try {
           loadingIndicator.style.display = 'block';
             const response = await fetch(`${server}/pos/register-history?start_date=${startDate}&end_date=${endDate}`, {
                 method: 'GET',
                 headers: {
                     'Authorization': `Bearer ${token}`,  // トークンをヘッダーに含める
                     'Content-Type': 'application/json'
                 }
             });

             if (!response.ok) {
               loadingIndicator.style.display = 'none';
                 throw new Error('データ取得に失敗しました');
             }
             const data = await response.json();

             console.log(data)
             // レジ履歴を表示
             let historyHtml = '';
             data.forEach(record => {
                historyHtml += `
                <div class="register-card">
                    <div class="register-card-header">
                        <h3><i class="fas fa-cash-register"></i>caixa: ${record.register_id}</h3>
                        <p class="time-info"><i class="fas fa-clock"></i> ${new Date(record.open_time).toLocaleString()} 〜 ${record.close_time ? new Date(record.close_time).toLocaleString() : '未閉店'}</p>
                    </div>
                    <div class="register-card-body">
                        <div class="balance-info">
                            <div>
                                <span><i class="fas fa-hand-holding-usd"></i>Saldo inicial(dinheiro):</span>
                                <span class="amount">¥${parseFloat(record.cash_opening_balance).toLocaleString()}</span>
                            </div>
                            <div>
                                <span><i class="fas fa-wallet"></i>Saldo inicial(outros):</span>
                                <span class="amount">¥${parseFloat(record.other_opening_balance).toLocaleString()}</span>
                            </div>
                            <div>
                                <span><i class="fas fa-hand-holding-usd"></i>Saldo final(dinheiro):</span>
                                <span class="amount">¥${parseFloat(record.cash_closing_balance).toLocaleString()}</span>
                            </div>
                            <div>
                                <span><i class="fas fa-wallet"></i>Saldo final(outros):</span>
                                <span class="amount">¥${parseFloat(record.other_closing_balance).toLocaleString()}</span>
                            </div>
                        </div>
                    </div>
                </div>`;
            });
              const startDayElement = document.getElementById("start-day");
            if (startDayElement && startDayElement.offsetParent !== null) {
              document.getElementById('under-container2').innerHTML = historyHtml;
            }else{
              registerHistory.innerHTML = historyHtml;
            }

         } catch (error) {
           loadingIndicator.style.display = 'none';
             // console.error('Error fetching register history:', error);
             alert('レジ履歴の取得中にエラーが発生しました');
         }

   };

   const listItems = settingsList.querySelectorAll('li');
   listItems.forEach(item => {
       item.addEventListener('click', async function () {
         loadingIndicator.style.display = 'none';
           const rawSettingName = this.textContent.trim();
           const settingKey = settingMap[rawSettingName];

           if (settingKey === 'menu') {
               try {
                   const response = await fetch(`${server}/pos/getmenu`, {
                       method: 'GET',
                       headers: {
                           'Authorization': `Bearer ${token}`,
                           'Content-Type': 'application/json'
                       }
                   });
                   if (!response.ok) {
                     loadingIndicator.style.display = 'none';
                       throw new Error('Erro no sistema');
                   }
                   const menuItems = await response.json();
                   console.log(menuItems)
                   displayMenuItems(menuItems);
               } catch (error) {
                   console.error('メニュー取得エラー: ', error);
               }
               return; // 以降の処理をスキップ
           }

           if (settingKey) {
               modalTitle.textContent = rawSettingName;
               modalBody.innerHTML = generateModalContent(settingKey);
               settingsModal.style.display = 'block';

           } else {
               console.error('未対応の設定名: ' + rawSettingName);
           }
       });
   });

   // メニュー一覧を表示する関数
   // メニュー一覧を表示する関数
   function displayMenuItems(menuItems) {
       modalTitle.textContent = 'Lista de menu';
       modalBody.innerHTML = ''; // モーダルの内容をクリア

       // 新規作成ボタンを追加
       const createButton = document.createElement('button');
       createButton.textContent = 'Adicionar';
       createButton.classList.add('create-button');
       createButton.addEventListener('click', () => {
           openCreateMenuModal();
       });
       modalBody.appendChild(createButton);

       // メニューアイテムをカード形式で表示
       menuItems.forEach(item => {
           const price = parseFloat(item.price); // 価格を数値に変換

           const card = document.createElement('div');
           card.classList.add('menu-card');
           card.innerHTML = `
               <h3>${item.item_name} (${item.item_name_jp || 'N/A'})</h3>
               <p>Categoria: ${item.category || 'N/A'} (${item.category_jp || 'N/A'})</p>
               <p>Valor: ¥${price.toFixed(2)}</p> <!-- 数値に変換された価格を表示 -->
               <p>Tipo: ${item.unit}</p>
               <p>Discrição${item.description || ''}</p>
               <button class="edit-button">Alterar</button>
               <button class="delete-button">Deletar</button>
           `;

           // 変更ボタンのクリックイベント
           card.querySelector('.edit-button').addEventListener('click', () => {
               openEditMenuModal(item);
           });

           // 削除ボタンのクリックイベント
           card.querySelector('.delete-button').addEventListener('click', () => {
               deleteMenuItem(item.id);
           });

           modalBody.appendChild(card);
       });

       settingsModal.style.display = 'block';
   }

   // 新規メニュー作成フォームを生成する関数
   function generateCreateMenuForm() {
       return `
           <form id="createMenuForm">
               <label for="menuId">Código na balança:</label>
               <input type="text" id="menuId" name="menuId" pattern="\\d{5}" required title="5 dígitos"><br>

               <label for="itemName">Nome(pt):</label>
               <input type="text" id="itemName" name="itemName" required><br>

               <label for="itemNameJp">Nome(jp):</label>
               <input type="text" id="itemNameJp" name="itemNameJp"><br>

               <label for="category">Categoria(pt):</label>
               <input type="text" id="category" name="category" required><br>

               <label for="categoryJp">Categoria(jp):</label>
               <input type="text" id="categoryJp" name="categoryJp"><br>

               <label for="price">Preço:</label>
               <input type="number" id="price" name="price" step="0.01" required><br>

               <label for="unit">kg ou peça?:</label>
               <select id="unit" name="unit" required>
                   <option value="kg">kg</option>
                   <option value="peça">peça</option>
               </select><br>

               <label for="description">descrição:</label>
               <textarea id="description" name="description"></textarea><br>

               <label for="available">Estoque:</label>
               <input type="checkbox" id="available" name="available" checked><br>

               <label for="isVisible">Mostrar na tela:</label>
               <input type="checkbox" id="isVisible" name="isVisible" checked><br>

               <button type="submit">Registrar</button>
           </form>
       `;
   }



// 新規作成モーダルを開く関数
function openCreateMenuModal() {
    modalTitle.textContent = 'Adicionar menu';
    modalBody.innerHTML = generateCreateMenuForm(); // 新規作成フォームを生成
    settingsModal.style.display = 'block';
    const btnSaveModal = document.getElementById('savebtn-form')
    btnSaveModal.style="display:none"

    // フォーム送信イベントの設定
    const createMenuForm = document.getElementById('createMenuForm');
    createMenuForm.addEventListener('submit', async function (e) {
        e.preventDefault();
        await createNewMenu();
    });
}

// 新規メニューを作成する関数
async function createNewMenu() {
loadingIndicator.style.display = 'block';
    const itemName = document.getElementById('itemName').value;
    const itemNameJp = document.getElementById('itemNameJp').value;
    const category = document.getElementById('category').value;
    const categoryJp = document.getElementById('categoryJp').value;
    const price = parseFloat(document.getElementById('price').value);
    const unit = document.getElementById('unit').value;
    const description = document.getElementById('description').value;
    const available = document.getElementById('available').checked;
    const isVisible = document.getElementById('isVisible').checked;
    const menu_id  = document.getElementById('menuId').value

    const newMenuItem = {
      menu_id:menu_id,
        item_name: itemName,
        item_name_jp: itemNameJp,
        category: category,
        category_jp: categoryJp,
        price: price,
        unit: unit,
        description: description,
        available: available,
        isVisible: isVisible
    };

    console.log(newMenuItem)

    try {
        const response = await fetch(`${server}/pos/createmenuaddcolomun`, {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${token}`,
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(newMenuItem)
        });

        if (!response.ok) {
          loadingIndicator.style.display = 'none';
           const errorData = await response.json();
           if (response.status === 400 && errorData.message.includes('Menu ID is already in use')) {
               alert('O código da balança já existe, verifique por favor。');
           } else {
               throw new Error(errorData.message || 'Tivemos erros');
           }
           return;
       }
        alert('Adicionado');
        settingsModal.style.display = 'none';
    } catch (error) {
      loadingIndicator.style.display = 'none';
        console.error('erro: ', error);
        alert('Tivemos erro, tente novamente');
    }
}



// // 新規作成モーダルを開く関数
// function openCreateMenuModal() {
//     modalTitle.textContent = 'Adicionar　menu';
//     modalBody.innerHTML = generateCreateMenuForm(); // 新規作成フォームを生成
//     settingsModal.style.display = 'block';
//     const btnSaveModal = document.getElementById('savebtn-form')
//     btnSaveModal.style="display:none"
// }

// メニュー編集モーダルを開く関数
// function openEditMenuModal(item) {
//     modalTitle.textContent = 'メニュー編集';
//     modalBody.innerHTML = generateEditMenuForm(item); // 編集フォームを生成
//     settingsModal.style.display = 'block';
// }

function editMenuByPC() {
    // const container = document.getElementById("under-container4");
    secondUnder.style.display='none'
    thirdUnder.style.display='flex'
    firstUnder.style.display='none'
    fourthUnder.style.display='none'
    thirdUnder.innerHTML = ""; // 既存のメニューをクリア

    userInfo.Menus.forEach(menu => {

        // 言語に応じたメニュー名を取得
        const menuName = userInfo.language === "jp" ? menu.item_name_jp : menu.item_name;

        const card = document.createElement("div");
        card.className = "menu-card";
        card.innerHTML = `
            <h3>${menuName}</h3>
            <p>¥${parseFloat(menu.price).toLocaleString()}</p>
            <button class="menu-edit-btn" onclick="creatCOntainerEditMenu('${menu.menu_id}')">Alterar</button>
            <button class="menu-delete-btn" onclick="deleteMenu('${menu.menu_id}')">Deletar</button>
        `;
        thirdUnder.appendChild(card);
    });
}

async function editConfig() {
    secondUnder.style.display = 'none';
    thirdUnder.style.display = 'none';
    firstUnder.style.display = 'none';
    fourthUnder.style.display = 'flex';
      overlays.style.display = 'block';

    const myform = await generateModalContent('personal_settings');


    fourthUnder.innerHTML = myform;

    // ボタン要素を作成
    const saveConfigBtn = document.createElement('button');
    const closeConfigBtn = document.createElement('button');
    saveConfigBtn.id = 'saveConfigBtn'; // ユニークなID
    saveConfigBtn.textContent = 'Salvar Configuração';
    closeConfigBtn.style.backgroundColor = 'orange'
    closeConfigBtn.textContent = 'Voltar';

    // fourthUnder にボタンを追加
    fourthUnder.appendChild(saveConfigBtn);
    fourthUnder.appendChild(closeConfigBtn);

    // クリックイベント追加
    saveConfigBtn.addEventListener('click', () => {
        savedConfigByPC();
    });

    closeConfigBtn.addEventListener('click', () => {
        hideensavedConfigByPC();
    });
}

async function savedConfigByPC(){
  console.log(7)
  const currentForm = document.getElementById('personalSettingsForm');
  if (!currentForm) {
      alert('Erro no sistema');
      return;
  }
// フォームのデータを取得
  const formData = new FormData(currentForm);
// データをJSON形式に変換し、変更があったフィールドのみ追加
const data = {};
for (let [key, value] of formData.entries()) {
// 変更があったかどうかをチェック (userInfo[key] が存在するか確認)
    if (userInfo[key] !== undefined && userInfo[key] !== value) {
// パスワード関連のフィールドかどうかをチェック
        if (['current_password', 'password', 'confirm_password'].includes(key)) {
            const currentPass = document.getElementById('currentPassword').value.trim();
            const newPass = document.getElementById('password').value.trim();
            const confirmPass = document.getElementById('confirmPassword').value.trim();
// パスワード関連のフィールドのチェック
            if (currentPass === "" || newPass === "" || confirmPass === "") {
                alert('Todos os campos de senha devem estar preenchidos.');
                break;  // ループを抜ける
            } else if (newPass !== confirmPass) {
                alert('A senha nova deve ser igual à confirmação.');
                break;  // ループを抜ける
            }
        }
        data[key] = value;
    }
}
//配列に変化が合ったか確認する
if (Object.keys(data).length === 0) {
    alert('Nenhuma alteração foi feita.');
    return;  // 処理を終了
}
  // user_id を userInfo.id から追加
  if (userInfo && userInfo.id) {
      data.user_id = userInfo.id;
  } else {
      alert('User ID não encontrado');
      return;
  }
  updateInformations(data)
  settingsModal.style.display = 'none';
}

function hideensavedConfigByPC(){
  secondUnder.style.display = 'none';
  thirdUnder.style.display = 'none';
  firstUnder.style.display = 'flex';
  fourthUnder.style.display = 'none';
    overlays.style.display = 'none';
}


// **メニュー変更モーダルを開く**
function openMenuEditModal(menuId) {
    const menu = userInfo.Menus.find(m => m.menu_id === menuId);
    if (!menu) return;

    document.getElementById("menuEditName").value = userInfo.language === "jp" ? menu.item_name_jp : menu.item_name;
    document.getElementById("menuEditPrice").value = parseFloat(menu.price);
    document.getElementById("menuEditModal").style.display = "block";

    // 保存ボタンにメニューIDを保持
    document.getElementById("menuEditModal").setAttribute("data-id", menuId);
}

// **メニュー変更を保存**
function saveMenuChanges() {
    const menuId = document.getElementById("menuEditModal").getAttribute("data-id");
    const newName = document.getElementById("menuEditName").value;
    const newPrice = document.getElementById("menuEditPrice").value;

    const menu = userInfo.Menus.find(m => m.menu_id === menuId);
    if (menu) {
        if (userInfo.language === "jp") {
            menu.item_name_jp = newName;
        } else {
            menu.item_name = newName;
        }
        menu.price = parseFloat(newPrice);
        editMenuByPC(); // UIを更新
        closeMenuModal();
    }
}

// **メニュー削除**
function deleteMenu(menuId) {
    const index = userInfo.Menus.findIndex(m => m.menu_id === menuId);
    if (index !== -1) {
        userInfo.Menus.splice(index, 1);
        editMenuByPC(); // UIを更新
    }
    deleteMenuItem(menuId)
}

// **モーダルを閉じる**
function closeMenuModal() {
    document.getElementById("menuEditModal").style.display = "none";
}

// **モーダルの閉じるボタン**
// document.querySelector(".menu-close").addEventListener("click", closeMenuModal);


// メニューを削除する関数
async function deleteMenuItem(id) {
    if (!confirm('Deseja deletar？')) return;

    try {
      loadingIndicator.style.display = 'block';
        const response = await fetch(`${server}/pos/deletemenu/${id}`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });
        if (!response.ok) {

            throw new Error('Tivemos erro no sistema');
        }
        alert('TIvemos erro no sistema');
        // 削除後にメニューを再取得して更新
        const updatedMenuResponse = await fetch(`${server}/pos/getmenu`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });
        const updatedMenuItems = await updatedMenuResponse.json();
        displayMenuItems(updatedMenuItems);
        loadingIndicator.style.display = 'none';
    } catch (error) {
      loadingIndicator.style.display = 'none';
        console.error('削除エラー: ', error);
    }
}


       closeModal.addEventListener('click', function () {
           settingsModal.style.display = 'none';
       });

       window.addEventListener('click', function (event) {
           if (event.target == settingsModal) {
               settingsModal.style.display = 'none';
           }
       });

       function generateModalContent(settingKey) {
           switch (settingKey) {
               case 'personal_settings':
                   return `
                       <form id="personalSettingsForm">
                           <h2>mude o campo que deseja</h2>
                           <div class="form-group">
                               <label for="currentPassword">Senha atual:</label>
                               <input type="password" id="currentPassword" name="current_password" value="">
                           </div>
                           <div class="form-group">
                               <label for="password">Nova senha:</label>
                               <input type="password" id="password" name="password" value="">
                           </div>
                           <div class="form-group">
                               <label for="confirmPassword">Confirmar senha:</label>
                               <input type="password" id="confirmPassword" name="confirm_password" value="">
                           <div class="form-group">
                               <label for="email_form">email:</label>
                               <input type="text" id="form_email" name="email" value="${userInfo.email}">
                           </div>
                           <div class="form-group">
                               <label for="representativeName">Nome do representante:</label>
                               <input type="text" id="representativeName" name="representativeName" value="${nameSpan.innerText}">
                           </div>
                           <div class="form-group">
                               <label for="language">Idioma:</label>
                               <select id="language" name="language">
                                   <option value="pt" ${userInfo.language==='pt'?'selected':''}>Português</option>
                                   <option value="ja" ${userInfo.language==='ja'?'selected':''}>Japonês</option>
                               </select>
                           </div>

                       </form>
                   `;
               case 'register_number':
                   return '<p>Formulário para Número do Caixa</p>';
               case 'cashier':
                   return '<p>Formulário para Responsável pelo Caixa</p>';
               default:
                   return '<p>Por favor, selecione uma opção de configuração.</p>';
           }
       }
//個人情報の変更エレメント
       const saveButtonForm = document.getElementById('saveButton');
       saveButtonForm.addEventListener('click', async function() {
           event.preventDefault();
// 現在表示されているフォームを動的に取得
    const currentForm = document.querySelector('form');
    if (!currentForm) {
        alert('Erro no sistema');
        return;
    }
 // フォームのデータを取得
    const formData = new FormData(currentForm);
  // データをJSON形式に変換し、変更があったフィールドのみ追加
  const data = {};
  for (let [key, value] of formData.entries()) {
// 変更があったかどうかをチェック (userInfo[key] が存在するか確認)
      if (userInfo[key] !== undefined && userInfo[key] !== value) {
// パスワード関連のフィールドかどうかをチェック
          if (['current_password', 'password', 'confirm_password'].includes(key)) {
              const currentPass = document.getElementById('currentPassword').value.trim();
              const newPass = document.getElementById('password').value.trim();
              const confirmPass = document.getElementById('confirmPassword').value.trim();
// パスワード関連のフィールドのチェック
              if (currentPass === "" || newPass === "" || confirmPass === "") {
                  alert('Todos os campos de senha devem estar preenchidos.');
                  break;  // ループを抜ける
              } else if (newPass !== confirmPass) {
                  alert('A senha nova deve ser igual à confirmação.');
                  break;  // ループを抜ける
              }
          }
          data[key] = value;
      }
  }
//配列に変化が合ったか確認する
  if (Object.keys(data).length === 0) {
      alert('Nenhuma alteração foi feita.');
      return;  // 処理を終了
  }
    // user_id を userInfo.id から追加
    if (userInfo && userInfo.id) {
        data.user_id = userInfo.id;
    } else {
        alert('User ID não encontrado');
        return;
    }
    updateInformations(data)
    settingsModal.style.display = 'none';
});

async function updateInformations(dataobject){
  loadingIndicator.style.display = 'block';
  try {
      // APIエンドポイントにPOSTリクエストを送信
      const response = await fetch(`${server}/pos/updateSettings`, {
          method: 'POST',
          headers: {
              'Content-Type': 'application/json'
          },
          body: JSON.stringify(dataobject)
      });

      if (response.status===200) {
        nameSpan.innerText = document.getElementById('representativeName').value
        userInfo.representativeName = document.getElementById('representativeName').value
        userInfo.email = document.getElementById('form_email').value
        userInfo.current_password = document.getElementById('currentPassword').value
        userInfo.password = document.getElementById('password').value
        userInfo.confirm_password = document.getElementById('confirmPassword').value
        userInfo.language = document.getElementById('language').value

          const result = await response.json();

          alert('Feito com sucesso');
          secondUnder.style.display = 'none';
          thirdUnder.style.display = 'none';
          firstUnder.style.display = 'flex';
          fourthUnder.style.display = 'none';
            overlays.style.display = 'none';
      }else if(response.status===401){
        alert('Senha atual incorreta');
      } else {
          console.error('保存失敗:', response.status);
          alert('Tivemos erro no registro');
      }
  } catch (error) {
      console.error('エラー発生:', error);
      alert('Tivemos erro no registro');
  }
loadingIndicator.style.display = 'none';
}

   async function fetchAndDisplaySalesHistory(startDate, endDate) {
     loadingIndicator.style.display = 'block';
     overlays.style.display = 'block';
       try {

           const response = await fetch(`${server}/pos/sales-history?start_date=${startDate}&end_date=${endDate}`, {
               method: 'GET',
               headers: {
                   'Authorization': `Bearer ${token}`,  // トークンをヘッダーに含める
                   'Content-Type': 'application/json'
               }
           });
           if (!response.ok) {
               throw new Error('Tivemos erro no sistema');
           }
           const data = await response.json();
           data.sort((a,b)=>{
             return a.sale_id - b.sale_id
           })

           dataPdefMobile = data
            registerHistory.innerHTML = ""; // 一度クリア
            const fragment = document.createDocumentFragment(); // フラグメントを作成して、一括で追加
            data.forEach(sale => {
                fragment.appendChild(createSaleCard(sale));
            });

            registerHistory.appendChild(fragment); // 一括で追加（パフォーマンス改善）
        } catch (error) {
           console.error('Error fetching register history:', error);
           alert('Tivemos erro no sistema');
       }
 loadingIndicator.style.display = 'none';
 overlays.style.display = 'none';
 };

 function createSaleCard(sale) {
     const card = document.createElement("div");
     card.className = "custom-sale-card";
     card.style.marginBottom = "20px";
     card.dataset.saleId = sale.sale_id;

     card.innerHTML = `
         <div class="custom-sale-card-body">
             <h5 class="custom-sale-card-title">Número de registro: ${sale.sale_id}</h5>
             <p class="custom-sale-card-text">
                 <strong>Valor:</strong> ¥${parseFloat(sale.total_price).toLocaleString()}<br>
                 <strong>Data:</strong> ${new Date(sale.transaction_time).toLocaleString()}<br>
                 <strong>Pagamento:</strong> ${sale.pay_type}
             </p>
             <div class="moda-btn-update-modal">
                 <button class="custom-sale-btn custom-sale-btn-info show-details-btn">
                     <i class="fas fa-eye"></i>
                 </button>
                 <button class="custom-sale-btn custom-sale-btn-primary show-update-btn">
                     <i class="fas fa-edit"></i>
                 </button>
                 <button class="custom-sale-btn custom-sale-btn-danger delete-btn">
                     <i class="fas fa-trash-alt"></i>
                 </button>
             </div>
         </div>
     `;

     // **イベントリスナーを設定（onClickではなく）**
     card.querySelector(".show-details-btn").addEventListener("click", () => showItemDetails(sale.item_details));
     card.querySelector(".show-update-btn").addEventListener("click", () => showUpdateModal(sale));
     card.querySelector(".delete-btn").addEventListener("click", () => deleteSale(sale.sale_id));

     return card;
 }

   // // フィルターボタンをクリックしたときの動作
   // document.getElementById('filterButton').addEventListener('click', async () => {
   //   console.log('koko')
   //     const startDate = document.getElementById('startDate').value;
   //     const endDate = document.getElementById('endDate').value;
   //     if (!startDate || !endDate) {
   //         alert('Selecione os dias');
   //         return;
   //     }
   //
   //     fetchAndDisplayRegisterHistory(startDate,endDate)
   //     loadingIndicator.style.display = 'none';
   //
   // });



function showItemDetails(itemDetails) {
    const detailsHTML = itemDetails.map(item => `
        <li>
            <strong>Nome:</strong> ${item.item_name}<br>
            <strong>Quantidade:</strong> ${item.quantity}<br>
            <strong>Valor:</strong> ¥${parseFloat(item.total_price).toLocaleString()}
        </li>
    `).join('');

    const popupContent = `
        <div class="popup-overlay">
            <div class="popup-content">
                <h3>Lista da venda</h3>
                <ul>${detailsHTML}</ul>
                <button class="custom-sale-btn custom-sale-btn-close" onclick="closePopup()">Voltar</button>
            </div>
        </div>
    `;

    document.body.insertAdjacentHTML('beforeend', popupContent);
}

function closePopup() {
    const popupOverlay = document.querySelector('.popup-overlay');
    if (popupOverlay) {
        popupOverlay.remove();
    }
}

function deleteSale(sale_id) {
    if (confirm('Deseja deletar o registro？')) {
        fetch(`${server}/pos/delete/sale`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ sale_id: sale_id })
        })
        .then(response => {
            if (response.ok) {
                showToast('Deletado');  // スタイリッシュなトーストメッセージを表示
                // 削除されたカードを画面から削除
                removeSaleCard(sale_id);
            } else {
                response.json().then(data => {
                    alert(`Erro: ${data.message}`);
                });
            }
        })
        .catch(error => {
            console.error('削除リクエスト中にエラーが発生しました:', error);
            alert('Tivemos um erro no sistema');
        });
    }
}

function updateSale(totalPrice, menu, saleId) {

  // 配列をオブジェクト形式に変換し、キーを1から始める
  const itemDetails = {};
  menu.forEach((item, index) => {
    itemDetails[(index + 1).toString()] = {
      register_id: item.register_id.toString(),
      cashier_id: item.cashier_id.toString(),
      menu_id: item.menu_id.toString(),
      quantity: parseInt(item.quantity, 10),    // 数値に変換
      total_price: parseFloat(item.total_price),  // 数値に変換
      pay_type: item.pay_type,
      tax_rate: parseFloat(item.tax_rate).toFixed(2)  // 小数点2桁に固定
    };
  });

  // そのままのJSON文字列を生成
  const itemDetailsString = JSON.stringify(itemDetails);
  // console.log('正しい形式の item_details:', itemDetailsString);

  // 更新リクエストを送信する
  fetch(`${server}/pos/update/sale`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      sale_id: saleId,           // sale_id を送信
      item_details: itemDetailsString  // 正しいJSON文字列を送信
    })
  })
  .then(response => response.json())
  .then(data => {
    if (data.success) {
      console.log(data)
      updateSaleCard(data,saleId)
      showToast('Feito');  // スタイリッシュなトーストメッセージを表示
      // console.log('販売データが正常に更新されました:', data.message);
    } else {
      alert(`Erro: ${data.message}`);
      // console.error('販売データの更新中にエラーが発生しました:', data.message);
    }
  })
  .catch(error => {
    alert('Tivemos um erro no sistema');
    console.error('通信エラーが発生しました:', error);
  });
}

// 削除されたカードを画面から削除する関数
function removeSaleCard(sale_id) {
    const cardElement = document.querySelector(`[data-sale-id="${sale_id}"]`);
    if (cardElement) {
        cardElement.remove();
    }
}

async function updateSaleCard(datas,sale_id){
  try{
  const cardElement = document.querySelector(`[data-sale-id="${datas.data.sale_id}"]`);
  cardElement.remove();
  registerHistory.innerHTML += await createNewSaleCard(datas.data);
  // 親要素を取得
  const parentElement = document.querySelector('#registerHistory'); // 親要素のセレクタを指定
  // 親要素内の data-sale-id 属性を持つすべての子要素を取得
  const cardElements = Array.from(parentElement.querySelectorAll('[data-sale-id]'));
  // data-sale-id を基準に要素を昇順で並び替え
  cardElements.sort((a, b) => {
    // data-sale-id の値を数値に変換して比較
    return parseInt(a.getAttribute('data-sale-id')) - parseInt(b.getAttribute('data-sale-id'));
  });
  // 並び替えた順番で親要素に再挿入
  cardElements.forEach(card => {
    parentElement.appendChild(card);
  });

  }catch(e){
   alert('Tivemos um erro no sistema');
  }

}

function createNewSaleCard(sale) {

    const card = `
        <div class="custom-sale-card" style="margin-bottom: 20px;" data-sale-id="${sale.sale_id}">
            <div class="custom-sale-card-body">
                <h5 class="custom-sale-card-title">Número de registro: ${sale.sale_id}</h5>
                <p class="custom-sale-card-text">
                    <strong>Valor:</strong> ¥${parseFloat(sale.total_price).toLocaleString()}<br>
                    <strong>Data:</strong> ${new Date(sale.transaction_time).toLocaleString()}<br>
                    <strong>Pagamento:</strong> ${sale.pay_type}
                </p>
                <div class="moda-btn-update-modal">
                  <button class="custom-sale-btn custom-sale-btn-info" onclick='showItemDetails(${JSON.stringify(sale.item_details)})'>
               <i class="fas fa-eye"></i>
             </button>
             <button class="custom-sale-btn custom-sale-btn-primary" onclick='showUpdateModal(${JSON.stringify(sale)})'>
               <i class="fas fa-edit"></i>
             </button>

             <button class="custom-sale-btn custom-sale-btn-danger" onclick="deleteSale(${sale.sale_id})">
               <i class="fas fa-trash-alt"></i>
             </button>
             </div>
            </div>
        </div>
    `;
    return card;
}

async function creatCOntainerEditMenu(itemId){
  const menu = userInfo.Menus.find(m => m.menu_id === itemId);
  const getHtmlMenu = await generateEditMenuForm(menu)
  document.getElementById('menuEditModal').style.display='block'
  overlays.style.display='block'
  document.getElementById('edit-menu-container').innerHTML = getHtmlMenu
  const editMenuForm = document.getElementById('editMenuForm');
  document.getElementById('savebtn-form').style.display="none"
  editMenuForm.addEventListener('submit', async function (e) {
      e.preventDefault();
      await updateMenuItem(menu.id);
  });
}

// メニュー編集フォームを生成する関数
function generateEditMenuForm(item) {
  console.log(item)
    return `
        <form id="editMenuForm">
            <label for="menuId">Menu ID (5桁):</label>
            <input type="text" id="menuId" name="menuId" value="${item.menu_id}" pattern="\\d{5}" required title="5桁の数字を入力してください" disabled><br>

            <label for="itemName">Nome(pt):</label>
            <input type="text" id="itemName" name="itemName" value="${item.item_name}" required><br>

            <label for="itemNameJp">Nome(jp):</label>
            <input type="text" id="itemNameJp" name="itemNameJp" value="${item.item_name_jp || ''}"><br>

            <label for="category">Categoria(pt):</label>
            <input type="text" id="category" name="category" value="${item.category}" required><br>

            <label for="categoryJp">Categoria(jp):</label>
            <input type="text" id="categoryJp" name="categoryJp" value="${item.category_jp || ''}"><br>

            <label for="price">Preço:</label>
            <input type="number" id="price" name="price" step="0.01" value="${item.price}" required><br>

            <label for="unit">kg ou peça?:</label>
            <select id="unit" name="unit" required>
                <option value="kg" ${item.unit === 'kg' ? 'selected' : ''}>kg</option>
                <option value="peça" ${item.unit === 'peça' ? 'selected' : ''}>peça</option>
            </select><br>

            <label for="description">descrição:</label>
            <textarea id="description" name="description">${item.description || ''}</textarea><br>

            <label for="available" class="switch-label">Estoque:</label>
            <label class="switch-container">
                <input type="checkbox" id="available" name="available" ${item.available ? 'checked' : ''} onchange="toggleSwitch('available')">
                <span class="slider"></span>
            </label>

            <label for="isVisible" class="switch-label">Mostrar na tela:</label>
            <label class="switch-container">
                <input type="checkbox" id="isVisible" name="isVisible" ${item.isVisible ? 'checked' : ''} onchange="toggleSwitch('isVisible')">
                <span class="slider"></span>
            </label>



            <button type="submit">Alterar</button>
        </form>
    `;
}

function toggleSwitch(id) {
    const checkbox = document.getElementById(id);
    console.log(`${id} is now: ${checkbox.checked ? "ON" : "OFF"}`);

    // ここで値を保存する処理を追加できる
}


// メニュー編集モーダルを開く関数
function openEditMenuModal(item) {

    modalTitle.textContent = 'Alterar menu';
    modalBody.innerHTML = generateEditMenuForm(item); // 編集フォームを生成
    settingsModal.style.display = 'block';

    // フォーム送信イベントの設定
    const editMenuForm = document.getElementById('editMenuForm');
    document.getElementById('savebtn-form').style.display="none"
    editMenuForm.addEventListener('submit', async function (e) {
        e.preventDefault();
        await updateMenuItem(item.id);
    });
}

// メニューアイテムを更新する関数
async function updateMenuItem(id) {

    const itemName = document.getElementById('itemName').value;
    const itemNameJp = document.getElementById('itemNameJp').value;
    const category = document.getElementById('category').value;
    const categoryJp = document.getElementById('categoryJp').value;
    const price = parseFloat(document.getElementById('price').value);
    const unit = document.getElementById('unit').value;
    const description = document.getElementById('description').value;
    const available = document.getElementById('available').checked;
    const isVisible = document.getElementById('isVisible').checked;
    const updatedMenuItem = {
        item_name: itemName,
        item_name_jp: itemNameJp,
        category: category,
        category_jp: categoryJp,
        price: price,
        unit: unit,
        description: description,
        available: available,
        isVisible: isVisible
    };


    try {
      loadingIndicator.style.display = 'block';
        const response = await fetch(`${server}/pos/updatemenucolumnAdd/${id}`, {
            method: 'PUT',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(updatedMenuItem)
        });

        if (!response.ok) {
            throw new Error('Falha no sistema');
        }
        const data = await response.json()

        const index = userInfo.Menus.findIndex(menu => menu.id-0 ===data.data.id-0);
        userInfo.Menus[index] = data.data;
        alert('Feito com sucesso');
        loadingIndicator.style.display = 'none';
        overlays.style.display='none'
        document.getElementById('menuEditModal').style.display = 'none';
    } catch (error) {
        console.error('更新エラー: ', error);
        alert('Falha no sistema');
        overlays.style.display='none'
    }
}


function showToast(message) {
    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.innerText = message;
    document.body.appendChild(toast);

    // トーストメッセージを表示
    setTimeout(() => {
        toast.className = 'toast show';
    }, 100);

    // 1秒後に自動で消す
    setTimeout(() => {
        toast.className = 'toast';
        // 完全に消えた後でDOMから削除
        setTimeout(() => {
            toast.remove();
        }, 500);
    }, 1500);
}


let currentSale = null;

function showUpdateModal(sale) {
  currentSale = sale;
  currentSaleId = currentSale.sale_id
  const itemDetailsContainer = document.getElementById('itemDetailsContainer');
  itemDetailsContainer.innerHTML = ''; // コンテナをクリア
  sale.item_details.forEach((item, index) => {
    console.log(index)
    const priceWithoutDecimals = parseFloat(item.total_price).toFixed(0); // .00 を省く処理

    const itemHtml = `
      <div class="item-detail" data-index="${index}">
        <h3>${item.item_name}</h3>

        <div class="input-group">
          <label>Qua.</label>
          <div class="quantity-control">
            <button class="quantity-btn" onclick="decreaseQuantity(${index})">-</button>
            <input type="number" id="quantity_${index}" name="quantity" value="${item.quantity}" readonly>
            <button class="quantity-btn" onclick="increaseQuantity(${index})">+</button>
          </div>
        </div>

        <div class="input-group">
          <label for="price_${index}">Valor:</label>
          <input type="number" id="price_${index}" name="price" value="${priceWithoutDecimals}">
        </div>

        <button class="custom-sale-btn custom-sale-btn-danger" onclick="deleteItem(${index})">Deletar</button>
      </div>
      <hr>
    `;
    itemDetailsContainer.innerHTML += itemHtml;
  });

  document.getElementById('updateModal').style.display = "block";
}

function increaseQuantity(index) {
  const quantityInput = document.getElementById(`quantity_${index}`);
  quantityInput.value = parseInt(quantityInput.value) + 1;
}

function decreaseQuantity(index) {
  const quantityInput = document.getElementById(`quantity_${index}`);
  if (parseInt(quantityInput.value) > 0) {
    quantityInput.value = parseInt(quantityInput.value) - 1;
  }
}


// function closeModal() {
//   document.getElementById('updateModal').style.display = "none";
// }

function saveChanges() {
  loadingIndicator.style.display = 'block';
  // updatedItemsのリストを作成
  const updatedItems = currentSale.item_details.map((item, index) => {
    const updatedQuantity = document.getElementById(`quantity_${index}`).value;
    const updatedPrice = document.getElementById(`price_${index}`).value;
    return {
      ...item,
      quantity: updatedQuantity,
      total_price: parseFloat(updatedPrice)
    };
  });

  // アイテムがすべて空白であれば、削除確認メッセージを表示
  if (updatedItems.length === 0 || updatedItems.every(item => item.quantity === '' || item.total_price === '')) {
    deleteSale(currentSaleId)
    closeModal()
    return
  }else{
    const totalAmount = updatedItems.reduce((sum, item) => {
      return sum + (isNaN(item.total_price) ? 0 : item.total_price); // total_priceがNaNでない場合に合計
    }, 0);
    updateSale(totalAmount,updatedItems,currentSaleId)
    // console.log('合計金額:', totalAmount);
  }
  closeModal();
loadingIndicator.style.display = "none"
}

function deleteItem(index) {
  // アイテムを削除する
  currentSale.item_details.splice(index, 1);

  // 再度モーダルを表示して、変更を反映
  showUpdateModal(currentSale);
  loadingIndicator.style.display = 'none';
}

let salesChart = null;

let tgtData = ""

async function fetchTotalSales() {
    loadingIndicator.style.display = 'block';
    overlays.style.display = 'block'
    try {
        const response = await fetch(`${server}/pos/total-sales/Byyear?user_id=${userInfo.id}&year=${year.value}`, {
        // const response = await fetch(`${server}/pos/total-sales?user_id=${userInfo.id}`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,  // トークンをヘッダーに含める
                'Content-Type': 'application/json'
            }
        });
        if (!response.ok) {
            throw new Error('データ取得に失敗しました');
        }
        const data = await response.json();  // レスポンスデータをJSONとしてパース
        // 総売上の表示

        tgtData = data
 createData()


    } catch (error) {
        console.error('Error fetching sales data:', error);
        alert('売上データの取得中にエラーが発生しました');
    }
}

function sertchNewFilter(){
  fetchTotalSalesPcDisplay()
}

async function fetchTotalSalesPcDisplay() {
  console.log('kokode matigainai')
  loadingIndicator.style.display = 'block';
  overlays.style.display = 'block';
  const userId = userInfo.id;  // 必要に応じて動的に取得
  const startDate = document.getElementById('start-day').value;
  const finishDate = document.getElementById('finish-day').value;
  const finishDateObj = new Date(finishDate);
finishDateObj.setDate(finishDateObj.getDate() + 1);

// 年・月・日を取得してフォーマット
const year = finishDateObj.getFullYear();
const month = String(finishDateObj.getMonth() + 1).padStart(2, '0'); // 月は0始まりなので+1
const day = String(finishDateObj.getDate()).padStart(2, '0'); // 1桁の日付を0埋め

const newFinishDate = `${year}-${month}-${day}`;
  console.log(finishDate)
  const url = `${server}/pos/total-sales/Start/finish?user_id=${userId}&start=${startDate}&finish=${newFinishDate}`;
  try {
    const response = await fetch(url);
    if (!response.ok) throw new Error('データ取得に失敗しました');
    const data = await response.json();
    console.log(data);
    tgtData = data.salesData
    displaySalesCards()
    createDataForPc()
    creatRank()
    createTypePayment()
    createHorizontalBarChart()
    // データの表示処理をここに追加
 // creatCOntainerEditMenu('0001')
    loadingIndicator.style.display = 'none';
    overlays.style.display = 'none';
  } catch (error) {
    console.error('売上データ取得エラー:', error);
  }
}

async function createTypePayment() {
    // 支払い方法ごとの売上集計
    const paymentSummary = {};

    tgtData.forEach(sale => {
        const itemDetails = JSON.parse(sale.item_details);
        Object.values(itemDetails).forEach(item => {
            const payType = item.pay_type;
            const amount = parseFloat(item.total_price);

            if (!paymentSummary[payType]) {
                paymentSummary[payType] = 0;
            }
            paymentSummary[payType] += amount;
        });
    });

    // グラフ用のデータ作成
    const labels = Object.keys(paymentSummary);
    const data = Object.values(paymentSummary);
    const totalAmount = data.reduce((sum, value) => sum + value, 0);

    // <div id="sales-type-container"></div> にCanvasを追加
    const container = document.getElementById("sales-type-container");
    container.innerHTML = ""; // 既存のグラフをクリア
    const canvas = document.createElement("canvas");
    canvas.id = "salesTypeChart";
    container.appendChild(canvas);

    // Chart.js でパイチャートを描画
    const ctx = document.getElementById("salesTypeChart").getContext("2d");
    new Chart(ctx, {
        type: "pie",
        data: {
            labels: labels, // Cash, Credit などのラベル
            datasets: [{
                data: data,
                backgroundColor: ["#FF6384", "#36A2EB", "#FFCE56", "#4BC0C0"],
            }]
        },
        options: {
            responsive: true,
            plugins: {
                title: {
                    display: true,  // タイトルを表示
                    text: translations[userInfo.language]["chatByTypa"],  // タイトルのテキスト
                    font: {
                        size: 18,  // タイトルのフォントサイズ
                        weight: "bold"
                    },
                    padding: {
                        top: 10,
                        bottom: 20
                    }
                },
                legend: {
                    display: false, // 凡例を表示（必要ならtrueに）
                    position: "bottom"
                },
                datalabels: {
                    color: "#333",
                    font: {
                        weight: "bold",
                        size: 10
                    },
                    formatter: (value, context) => {
                        const percentage = ((value / totalAmount) * 100).toFixed(1);
                        const amountFormatted = `¥${value.toLocaleString()}`;
                        return `${context.chart.data.labels[context.dataIndex]}: ${amountFormatted} (${percentage}%)`;
                    }
                }
            }
        },
        plugins: [ChartDataLabels] // ラベル表示プラグイン適用
    });
}

async function createHorizontalBarChart() {
    const hourlySales = {}; // 売上がある時間のみ記録
    tgtData.forEach(sale => {
        // **UTCの時間を取得**
        const utcHour = new Date(sale.transaction_time).getUTCHours();
        // **日本時間（UTC+9）に変換**
        const localHour = new Date(sale.transaction_time).getUTCHours();
        if (!isNaN(localHour)) {
            const itemDetails = JSON.parse(sale.item_details);
            Object.values(itemDetails).forEach(item => {
                const amount = parseFloat(item.total_price);

                if (!hourlySales[localHour]) {
                    hourlySales[localHour] = 0;
                }
                hourlySales[localHour] += amount;
            });
        }
    });

    // **売上がある時間のみをリスト化**
    const labels = Object.keys(hourlySales)
        .map(hour => `${hour}:00`)  // "13:00" のように変換
        .sort((a, b) => parseInt(a) - parseInt(b)); // 昇順ソート

    const data = labels.map(label => hourlySales[parseInt(label)]);

    // **データがない場合は処理を中止**
    if (labels.length === 0) {
        alert("データがありません");
        return;
    }

    // **売上が多い順にソート**
    const sortedIndices = data.map((value, index) => ({ value, index }))
        .sort((a, b) => b.value - a.value);

    const sortedLabels = sortedIndices.map(item => labels[item.index]);
    const sortedData = sortedIndices.map(item => item.value);

    // **親要素をクリア**
    const container = document.getElementById("torendo-container");
    container.innerHTML = "";
    const canvas = document.createElement("canvas");
    canvas.id = "hourlySalesChart";
    container.appendChild(canvas);

    // **Chart.jsで横棒グラフを描画**
    const ctx = document.getElementById("hourlySalesChart").getContext("2d");

    const maxValue = Math.max(...sortedData);
    const minValue = Math.min(...sortedData);

    // **最大値に応じて右の余白を増やす**
    const rightPadding = maxValue > 100000 ?  30: 10;

    // **最小値が0に近い場合は左の余白を増やす**
    const leftPadding = minValue < 1000 ? 30 : 10;

    new Chart(ctx, {
        type: "bar",
        data: {
            labels: sortedLabels,
            datasets: [{
                label: "売上金額（¥）",
                data: sortedData,
                backgroundColor: "rgba(75, 192, 192, 0.7)",
                borderColor: "rgba(75, 192, 192, 1)",
                borderWidth: 1
            }]
        },
        options: {
            indexAxis: "y", // **横棒グラフに変更**
            responsive: true,
            maintainAspectRatio: false,
            layout: {
                padding: {
                    left: leftPadding,   // **最小値が小さいとき左の余白を増やす**
                    right: rightPadding  // **最大値が大きいとき右の余白を増やす**
                }
            },
            plugins: {
                title: {
                    display: true,
                    text: translations[userInfo.language]["chatByHour"],
                    font: { size: 18, weight: "bold" }
                },
                tooltip: {
                    callbacks: {
                        label: (tooltipItem) => `¥${tooltipItem.raw.toLocaleString()}`
                    }
                },
                legend: {
                    display: false
                },
                datalabels: {
                    anchor: "end",
                    align: sortedData.map(value => value === maxValue ? "start" : "right"), // **最大値はstart, それ以外はright**
                    color: "#333",
                    font: {
                        size: 9,
                        weight: "bold"
                    },
                    formatter: (value) => `¥${value.toLocaleString()}`,
                    clip: false // **切れないようにする**
                }
            },
            scales: {
                x: {
                    beginAtZero: true,
                    suggestedMax: maxValue * 1.1, // **最大値を少し増やす**
                    ticks: {
                        callback: (value) => `¥${value.toLocaleString()}`
                    }
                },
                y: {
                    ticks: { autoSkip: false } // **すべての時間帯ラベルを表示**
                }
            }
        },
        plugins: [ChartDataLabels] // データラベル表示プラグインを適用
    });


}

// async function editMenuByPC(){
//   secondUnder.style.display='none'
//   thirdUnder.style.display='flex'
//   firstUnder.style.display='none'
//   fourthUnder.style.display='none'
//   displayMenuItems(userInfo.Menus)
// }


async function outputPDF() {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();

    // **タイトル装飾**
    doc.setFontSize(22);
    doc.setTextColor(255, 255, 255); // 白
    doc.setFillColor(30, 144, 255); // 青系
    doc.rect(0, 10, 210, 15, "F"); // 背景色
    doc.text("Relatório de Vendas", 105, 20, { align: "center" });

    // **日付範囲**
    const startDate = document.getElementById('start-day').value || "未指定";
    const endDate = document.getElementById('finish-day').value || "未指定";

    doc.setFontSize(14);
    doc.setTextColor(0, 0, 0);
    doc.text("Período:", 14, 35);
    doc.setFont("helvetica", "bold");
    doc.text(`${startDate} ~ ${endDate}`, 50, 35);

    // **日別の売上集計**
    const salesByDay = {};
    let totalAmount = 0;

    tgtData.forEach((sale) => {
        const date = sale.transaction_time.split("T")[0]; // YYYY-MM-DD
        const amount = parseFloat(sale.total_price);
        if (!salesByDay[date]) {
            salesByDay[date] = 0;
        }
        salesByDay[date] += amount;
        totalAmount += amount;
    });

    // **日別売上の表**
    let y = 45;
    doc.setFontSize(12);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(30, 144, 255);
    doc.text("Vendas Diárias", 14, y);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(0, 0, 0);
    y += 7;

    Object.entries(salesByDay).forEach(([date, total]) => {
        doc.text(`${date}: ¥${total.toLocaleString()}`, 14, y);
        doc.line(14, y + 2, 100, y + 2); // 下線
        y += 7;
    });

    // **総合計のデザイン**
    y += 10;
    doc.setFillColor(255, 223, 186); // 薄オレンジ
    doc.rect(10, y, 190, 10, "F"); // 背景色
    doc.setFontSize(14);
    doc.setTextColor(0, 0, 0);
    doc.text(`Total Geral: ¥${totalAmount.toLocaleString()}`, 14, y + 7);

    // **2ページ目に移動して明細を表示**
    doc.addPage();
    doc.setFontSize(16);
    doc.setTextColor(0, 0, 0);
    doc.text("Detalhes de Vendas", 14, 20);

    // **テーブルデータを作成**
    const tableData = [];

    tgtData.forEach((sale) => {
        const itemDetails = JSON.parse(sale.item_details);

        Object.values(itemDetails).forEach((item) => {
            const menuName = userInfo.Menus.find(menu => menu.menu_id - 0 === item.menu_id - 0)?.item_name || "Desconhecido";
            const quantity = item.quantity;
            const price = parseFloat(item.total_price);

            tableData.push([
                sale.sale_id,
                menuName,
                quantity,
                `¥${price.toLocaleString()}`,
                translations[userInfo.language][sale.pay_type]
            ]);
        });
    });

    // **テーブル出力**
    doc.autoTable({
        head: [["ID", "Produto", "Qtd", "Valor", "Pagamento"]],
        body: tableData,
        startY: 30,
        styles: { fontSize: 10, cellPadding: 3 },
        headStyles: { fillColor: [100, 100, 255] }, // ヘッダーの背景色
    });

    // **PDF を保存**
    const currentDate = new Date().toISOString().split("T")[0];
    doc.save(`sales_report_${currentDate}.pdf`);
}


async function outputPDFMobile() {
    loadingIndicator.style.display = 'block';
    overlays.style.display = 'block';

    try {
        const response = await fetch(`${server}/pos/getmenu`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });
        const menuItems = await response.json();
        userInfo.Menus = menuItems;
    } catch (e) {
        alert('Tivemos um erro');
        return;
    }

    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();

    // **タイトル装飾**
    doc.setFontSize(22);
    doc.setTextColor(255, 255, 255); // 白
    doc.setFillColor(30, 144, 255); // 青系
    doc.rect(0, 10, 210, 15, "F"); // 背景色
    doc.text("Relatório de Vendas", 105, 20, { align: "center" });

    // **日付範囲**
    const startDate = document.getElementById('startDate').value || "未指定";
    const endDate = document.getElementById('endDate').value || "未指定";

    doc.setFontSize(14);
    doc.setTextColor(0, 0, 0);
    doc.text("Período:", 14, 35);
    doc.setFont("helvetica", "bold");
    doc.text(`${startDate} ~ ${endDate}`, 50, 35);

    // **日別の売上集計**
    const salesByDay = {};
    let totalAmount = 0;

    dataPdefMobile.forEach((sale) => {
        const date = sale.transaction_time.split("T")[0]; // YYYY-MM-DD
        const amount = parseFloat(sale.total_price);
        if (!salesByDay[date]) {
            salesByDay[date] = 0;
        }
        salesByDay[date] += amount;
        totalAmount += amount;
    });

    // **日別売上の表**
    let y = 45;
    doc.setFontSize(12);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(30, 144, 255);
    doc.text("Vendas Diárias", 14, y);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(0, 0, 0);
    y += 7;

    Object.entries(salesByDay).forEach(([date, total]) => {
        if (y > 270) {  // ページ下限を超えたら新しいページに移動
            doc.addPage();
            y = 20;
        }
        doc.text(`${date}: ¥${total.toLocaleString()}`, 14, y);
        doc.line(14, y + 2, 100, y + 2); // 下線
        y += 7;
    });

    // **総合計のデザイン**
    y += 10;
    if (y > 270) {
        doc.addPage();
        y = 20;
    }
    doc.setFillColor(255, 223, 186); // 薄オレンジ
    doc.rect(10, y, 190, 10, "F"); // 背景色
    doc.setFontSize(14);
    doc.setTextColor(0, 0, 0);
    doc.text(`Total Geral: ¥${totalAmount.toLocaleString()}`, 14, y + 7);

    // **2ページ目に移動して明細を表示**
    doc.addPage();
    doc.setFontSize(16);
    doc.setTextColor(0, 0, 0);
    doc.text("Detalhes de Vendas", 14, 20);

    // **テーブルデータを作成**
    const tableData = [];

    dataPdefMobile.forEach((sale) => {
        let itemDetails = typeof sale.item_details === "string"
            ? JSON.parse(sale.item_details)
            : sale.item_details;

        Object.values(itemDetails).forEach((item) => {
            const menuName = userInfo.Menus.find(menu => menu.menu_id - 0 === item.menu_id - 0)?.item_name || "Desconhecido";
            const quantity = item.quantity;
            const price = parseFloat(item.total_price);

            tableData.push([
                sale.sale_id,
                menuName,
                quantity,
                `¥${price.toLocaleString()}`,
                translations[userInfo.language][sale.pay_type]
            ]);
        });
    });

    // **テーブル出力（自動改ページ対応）**
    doc.autoTable({
        head: [["ID", "Produto", "Qtd", "Valor", "Pagamento"]],
        body: tableData,
        startY: 30,
        styles: { fontSize: 10, cellPadding: 3 },
        headStyles: { fillColor: [100, 100, 255] }, // ヘッダーの背景色
        margin: { top: 20, bottom: 20 }, // 余白を調整
        pageBreak: "auto" // 自動でページ分割
    });

    // **PDF を保存**
    const currentDate = new Date().toISOString().split("T")[0];
    doc.save(`sales_report_${currentDate}.pdf`);
    loadingIndicator.style.display = 'none';
    overlays.style.display = 'none';
}









// フロントエンドで取得した売上データをループし、カードを作成するJavaScript
async function displaySalesCards() {
  const container = document.getElementById('hitorico-container');
  container.innerHTML = ''; // 既存の内容をクリア

  // タイトルラベルを追加
  const labelTag = document.createElement('label');
  labelTag.textContent = 'Histórico de vendas';
  container.appendChild(labelTag);

  // **各セール情報のカードを作成**
  tgtData.forEach(sale => {
    const card = document.createElement('div');
    card.className = 'sale-card';
    card.innerHTML = `
      <div class="sale-card-body">
        <h5>ID: ${sale.sale_id}</h5>
        <p>Venda por: ${translations[userInfo.language][sale.pay_type]}</p>
        <p>Valor: ¥${parseFloat(sale.total_price).toLocaleString()}</p>
      </div>
    `;

    // **クリックイベントを追加（モーダル表示）**
    card.addEventListener('click', () => showSaleModal(sale));

    container.appendChild(card);
  });
}

// 🔹 **モーダルを表示する関数**
function showSaleModal(sale) {
  const modal = document.getElementById('modal-container');
  const modalBody = document.getElementById('modal-body');

  // **明細データを取得**
  const itemDetails = JSON.parse(sale.item_details);

  let detailsHTML = `
    <p><strong>ID:</strong> ${sale.sale_id}</p>
    <p><strong>Pagamento:</strong> ${translations[userInfo.language][sale.pay_type]}</p>
    <p><strong>Data:</strong> ${new Date(sale.transaction_time).toLocaleString()}</p>
    <h3>Itens da Venda:</h3>
    <table style="width: 100%; border-collapse: collapse;">
      <thead>
        <tr style="background: #f4f4f4;">
          <th style="border: 1px solid #ddd; padding: 8px;">Nome</th>
          <th style="border: 1px solid #ddd; padding: 8px;">Qtd</th>
          <th style="border: 1px solid #ddd; padding: 8px;">Valor</th>
        </tr>
      </thead>
      <tbody>
  `;

  // **メニューIDと数量・価格を表示**
  Object.values(itemDetails).forEach(item => {
    console.log(userInfo.Menus)

    const menuName = userInfo.Menus.find(menu => menu.menu_id-0 === item.menu_id-0)?.item_name || "Desconhecido"; // メニュー名取得
    detailsHTML += `
      <tr>
        <td style="border: 1px solid #ddd; padding: 8px;">${menuName}</td>
        <td style="border: 1px solid #ddd; padding: 8px; text-align: center;">${item.quantity}</td>
        <td style="border: 1px solid #ddd; padding: 8px; text-align: right;">¥${parseFloat(item.total_price).toLocaleString()}</td>
      </tr>
    `;
  });

  detailsHTML += `
      </tbody>
    </table>
    <p style="margin-top: 10px; font-weight: bold;">Total: ¥${parseFloat(sale.total_price).toLocaleString()}</p>
  `;

  // **モーダルに表示**
  modalBody.innerHTML = detailsHTML;
  modal.style.display = 'flex';
}

// 🔹 **モーダルを閉じる処理**
document.querySelector('.close-modal').addEventListener('click', () => {
  document.getElementById('modal-container').style.display = 'none';
});

// 🔹 **モーダル外をクリックしたら閉じる**
document.getElementById('modal-container').addEventListener('click', (event) => {
  if (event.target === document.getElementById('modal-container')) {
    document.getElementById('modal-container').style.display = 'none';
  }
});

// 🔹 **モーダル用のCSS**
const modalStyle = document.createElement('style');
modalStyle.innerHTML = `
  .modal-overlay {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.5);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 1000;
  }

  .modal-content {
    background: white;
    padding: 20px;
    border-radius: 8px;
    width: 400px;
    text-align: center;
    position: relative;
  }

  .close-modal {
    position: absolute;
    top: 10px;
    right: 20px;
    font-size: 24px;
    cursor: pointer;
  }

  table th, table td {
    border: 1px solid #ddd;
    padding: 8px;
  }

  table th {
    background: #f4f4f4;
  }
`;
document.head.appendChild(modalStyle);


async function creatRank(){
  const response = await fetch(`${server}/pos/getmenu`, {
      method: 'GET',
      headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
      }
  });
  const menuItems = await response.json();
  userInfo.Menus = menuItems
  console.log(menuItems)
  const sales = tgtData
  let menuSales = {};

  sales.forEach(sale => {
    const items = JSON.parse(sale.item_details);  // item_detailsをパース

    Object.values(items).forEach(item => {
      const menuId = ( '00000' + item.menu_id ).slice(-6);
      const total = parseFloat(item.total_price);
      if (menuSales[menuId]) {
        menuSales[menuId] += total;
      } else {
        menuSales[menuId] = total;
      }
    });
  });

  console.log(menuSales);

  // メニュー情報を結合
  const result = Object.keys(menuSales).map(menuId => {
      const menu = menuItems.find(item => ('0000' + item.menu_id).slice(-6) === menuId);  // 6桁に統一
      return {
        menu_id: menuId,
        item_name: menu ? menu.item_name : userInfo.language === 'pt' ? 'Sem registro': '不明',
        item_name_jp: menu ? menu.item_name_jp :  userInfo.language === 'pt' ? 'Sem registro': '不明',
        total_sales: menuSales[menuId]
      };
  });

  console.log(result);
  createRanks(result)
}

// APIからデータ取得後にこの関数を呼び出す
// displaySalesCards(data.salesData);

function createRanks(result){

  const totalSales = result.reduce((sum, item) => sum + item.total_sales, 0);
  const sortedResult = result.sort((a, b) => b.total_sales - a.total_sales);
  const container = document.getElementById('rank-divs');
  container.innerHTML = '';

  sortedResult.forEach((item, index) => {
    const displayName = userInfo.language === 'pt' ? item.item_name : item.item_name_jp;
    const roundedSales = Math.round(item.total_sales / 1000) * 1000;
    const percentage = ((item.total_sales / totalSales) * 100).toFixed(2); // 割合を1桁に丸める

    const card = document.createElement('div');
    card.className = 'sales-card';

    card.innerHTML = `
      <div class="card-rank">Rank${index + 1}</div>
      <div class="card-content">
        <h3 class="item-name">${displayName}</h3>
        <p class="sales-amount">¥${roundedSales.toLocaleString()}</p>
        <p class="sales-percentage">${percentage}%</p>
      </div>
    `;

    container.appendChild(card);
  });

  const style = document.createElement('style');
  style.innerHTML = `
    .sales-card {
      background: linear-gradient(135deg, #ffffff, #f0f0f0);
      color: #333;
      border-radius: 20px;
      padding: 10px;
      margin: 14px;
      box-shadow: 0 8px 16px rgba(0, 0, 0, 0.12);
      transition: transform 0.3s, box-shadow 0.3s;
    }
    .sales-card:hover {
      transform: scale(1.05);
      box-shadow: 0 10px 20px rgba(0, 0, 0, 0.2);
    }
    .card-rank {
      font-size: 15px;
      font-weight: bold;
      color: #ff6b6b;
      margin-bottom: 1px;
    }
    .card-content h3 {
      font-size: 15px;
      margin: 1px 0;
      font-weight: 600;
    }
    .sales-amount {
      font-size: 14px;
      color: #38a169;
      font-weight: bold;
    }
    .sales-percentage {
    font-size: 15px;
    color: #4a90e2;
    font-weight: 500;
    margin-top: 1px;
    text-align: right;
    font-style: italic;
  }

  `;
  document.head.appendChild(style);


}


function createData(){
  const data = tgtData
  document.getElementById('totalSales').textContent = `¥${parseFloat(data.totalSales).toLocaleString()}`;
  // ポルトガル語で省略した曜日を取得するための配列
  const weekdays = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];
  // カードを`expensesChartContainer`に追加
  const expensesChartContainer = document.getElementById('expensesChartContainer');
  expensesChartContainer.innerHTML = '';  // 既存のカードをクリア
  // タイトル要素を作成

 const cardContainer = document.createElement('div');
 cardContainer.className = 'card-container';  // 新しいdivにクラスを追加

 expensesChartContainer.appendChild(cardContainer);


 const selectType = document.getElementById('select-type-sales')
 let labels
 let salesData
 if(selectType.value-0===0){
   data.dailySales.forEach(sale => {
       const date = new Date(sale.date);
       const month = date.getMonth() + 1;
       const day = date.getDate();
       const weekday = weekdays[date.getDay()];  // 曜日を取得
       const formattedDate = `${month}/${day} (${weekday})`;

       // 日別売上の推移グラフを描画
        labels = data.dailySales.map(sale => {
           const date = new Date(sale.date);  // 日付をパース
           const month = date.getMonth() + 1;  // 月を取得 (0ベースなので+1)
           const day = date.getDate();  // 日を取得
           const weekday = weekdays[date.getDay()];  // 曜日を取得
           return `${month}/${day} (${weekday})`;  // "MM/DD (曜日)"形式で返す
       });


        salesData = data.dailySales.map(sale => parseFloat(sale.total_sales));

       // カード要素を作成
       const card = document.createElement('div');
       card.className = 'expense-card';

       // カードの内容を設定
       card.innerHTML = `
           <div class="expense-card-body">
               <h5 class="expense-card-title">${formattedDate}</h5>
               <p class="expense-card-text">¥${parseFloat(sale.total_sales).toLocaleString()}</p>
           </div>
       `;

       // カードを`expensesChartContainer`に追加
       cardContainer.appendChild(card);
   });
 }else{
   // 月ごとの売上合計を集計
   const monthlySales = data.dailySales.reduce((acc, item) => {
       const month = item.date.substring(0, 7); // YYYY-MMを取得
       acc[month] = (acc[month] || 0) + item.total_sales;
       return acc;
   }, {});



   // const salesContainer = document.getElementById('sales-container');

Object.entries(monthlySales).forEach(([month, total]) => {
    // console.log(month)
    // labelss.push(month)
    const card = document.createElement('div');
    card.className = 'expense-card';

    // カードの内容を設定
    card.innerHTML = `
        <div class="expense-card-body">
            <h5 class="expense-card-title">${month}</h5>
            <p class="expense-card-text">¥${total.toLocaleString()}</p>
        </div>
    `;

   cardContainer.appendChild(card);
});

labels = Object.keys(monthlySales); // YYYY-MM のラベル
salesData = Object.values(monthlySales); // 売上合計

 }



if (salesChart) {
     salesChart.destroy();
 }




 const ctx = document.getElementById('salesChart').getContext('2d');
salesChart =  new Chart(ctx, {
     type: 'line',
     data: {
         labels: labels,
         datasets: [{
             label: '',  // タイトルを空にして非表示にする
             data: salesData,
             backgroundColor: 'rgba(75, 192, 192, 0.2)',
             borderColor: 'rgba(75, 192, 192, 1)',
             borderWidth: 2,
             fill: true,  // 塗りつぶしを有効にする
             tension: 0.4,  // 曲線を滑らかにする
         }]
     },
     options: {
         plugins: {
             legend: {
                 display: false  // 凡例を非表示にする
             }
         },
         scales: {
             x: {
                 grid: {
                     display: false  // X軸のグリッド線を非表示にする
                 },
                 ticks: {
                     display: true  // X軸のラベルは表示
                 }
             },
             y: {
                 beginAtZero: true,
                 grid: {
                     display: false  // Y軸のグリッド線を非表示にする
                 },
                 ticks: {
                     display: true  // Y軸のラベルは表示
                 }
             }
         },
         elements: {
             line: {
                 borderWidth: 3  // 線の太さを変更
             },
             point: {
                 radius: 4,  // データポイントのサイズを設定
                 backgroundColor: 'rgba(75, 192, 192, 1)',  // データポイントの色を設定
             }
         },
         layout: {
             padding: 10  // グラフ周囲に余白を追加
         }
     }
 });

 loadingIndicator.style.display = 'none';
 overlays.style.display = 'none'
}

function createDataForPc(){
  const data = tgtData

  const dailyTotals = data.reduce((acc, sale) => {
  const date = sale.transaction_time.split('T')[0];  // 日付部分だけを取得
  const price = parseFloat(sale.total_price);
  acc[date] = (acc[date] || 0) + price;
  return acc;
}, {});


const language = userInfo.language; // 'ja', 'pt', 'en'

 const weekdays = {
   ja: ['日', '月', '火', '水', '木', '金', '土'],
   pt: ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'],
   en: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
 };

 const labels = [];
 const salesData = [];

 let totalSales = 0;  // 総合計用の変数を追加

 Object.keys(dailyTotals).forEach(date => {
    const day = new Date(date);
    const weekday = weekdays[language][day.getDay()];
    const formattedDate = `${day.getMonth() + 1}/${day.getDate()} (${weekday})`;
    labels.push(formattedDate);

    const dailyTotal = dailyTotals[date];  // その日の売上
    totalSales += dailyTotal;              // 総合計に追加
    salesData.push(dailyTotal);            // グラフ用データに追加
 });

 document.getElementById('totalSales-bypc').innerText =  `￥${totalSales.toLocaleString()}`

 console.log('総合計:', totalSales);  // 最後に総合計を表示


 if (salesChart) {
   salesChart.destroy();
 }

 console.log(salesData)
 const maxValue = Math.max(...salesData) * 1.1;
 console.log(maxValue)
 labels.push('');  // 最後に空ラベルを追加

 const ctx = document.getElementById('salesChart-bypc').getContext('2d');
 salesChart = new Chart(ctx, {
     type: 'line',
     data: {
         labels: labels,
         datasets: [{
             label: 'Daily Sales',
             data: salesData,
             borderColor: 'rgba(75, 192, 192, 1)',
             backgroundColor: 'rgba(75, 192, 192, 0.2)',
             borderWidth: 2,
             fill: true,
             tension: 0.4,
             pointRadius: 4,
         }]
     },
     options: {
         plugins: {
             title: {
                 display: true,  // タイトルを表示
                 text: translations[userInfo.language]['chatSui'],  // タイトルのテキスト
                 font: {
                     size: 16,  // タイトルのフォントサイズ
                     weight: 'bold'
                 },
                 padding: {
                     top: 10,
                     bottom: 20
                 }
             },
             legend: { display: false },
             datalabels: {
                 color: '#333',
                 font: {
                     size: 10,
                     weight: 'bold'
                 },
                 display: 'auto',
                 align: 'end',
                 offset: 8,
                 formatter: function(value) {
                     return `¥${value.toLocaleString()}`;
                 },
                 clip: false,
             }
         },
         layout: {
             padding: {
                 right: 60  // グラフ右側に余白を追加
             }
         },
         scales: {
             x: { grid: { display: false }, stacked: true },
             y: {
                 ticks: {
                     padding: 20  // Y軸ラベルとグラフの距離
                 },
                 beginAtZero: true,
                 grid: { display: false },
                 stacked: true
             }
         },
         minPadding: 20,
         suggestedMax: maxValue,
         layout: { padding: 10 }
     },
     plugins: [ChartDataLabels]
 });


}

function changeSalesView(){

  fetchTotalSales()
}

// 設定項目を言語ごとにマッピング
const settingMap = {
    'Configurações pessoais': 'personal_settings', // ポルトガル語
    'Número do caixa': 'register_number',          // ポルトガル語
    'Responsável pelo caixa': 'cashier',           // ポルトガル語
    'Menu':'menu',
    '個人設定': 'personal_settings',               // 日本語
    'レジ番号': 'register_number',                // 日本語
    'レジ担当者': 'cashier',               // 日本語
    'メニュー':'menu'
};


// })
