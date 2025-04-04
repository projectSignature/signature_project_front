 const token = window.localStorage.getItem('token');

 if (!token) {
    window.location.href = '../index.html';
 }
 const decodedToken = jwt_decode(token); // jwtDecodeではなくjwt_decodeを使用

 console.log(decodedToken)

let selectOrders = ""
let registerFlug = false
const notRegisterInfo = document.getElementById('yet-regit-info')
// 日付を今日の日付に設定

// モーダルを表示/非表示にするロジック
const modal = document.getElementById("registerModal");
const openModalBtn = document.getElementById("openModalBtn");
const closeModal = document.getElementsByClassName("close")[0];
const addOrderBtn = document.getElementById('addOrderBtn');
const menuModal = document.getElementById('menuModal');
const menuList = document.getElementById('menu-list');
const optionList = document.getElementById('option-list');
const categoryFilters = document.getElementById('category-filters');
const orderList = document.getElementById('order-nbefore-list');
const loadingPopup = document.getElementById('loading-popup');
const salesStart = document.getElementById('salesStart');
const salesFinish = document.getElementById('salesFinish');
const serchSales = document.getElementById('serche-sales')
let selectedMenuItem = null;  // 現在選択されているメニューアイテム
let selectCategory = null;   //選択されているカテゴリー
let selectedOptions = [];  // 選択されたオプションを保存する配列
let selectedCard = null;　//選択カード
let selectFecharcaixa = false　//レジクローズのフラグ
const caixaDate = document.getElementById('registerDate')
caixaDate.valueAsDate = new Date();


let clients ={
  id:decodedToken.userId, //クライアントid
  language:decodedToken.language, //クライアント言語
  paytype:'',　//ユーザー支払い方法
  selectedOrder:"",　//選択オーダー
  printInfo:"",　//？？
  taxtType:"",　//税金区分
  registerInfo:"",
  salesInfo:"", //セールデータ
  kubun:decodedToken.role,　//admin or operator
  table_count:decodedToken.table_count,
  takeout_enabled:decodedToken.takeout_enabled,
  uber_enabled:decodedToken.uber_enabled,
  tax_use:true
}

if(clients.id===1){
  document.getElementById('print-invoice').style.display='none'
}

document.addEventListener('DOMContentLoaded', async  () => {
  showLoadingPopup()
  daysSet()
  //メニュー、カテゴリー、オープション表示
  const MainData = await makerequest(`${server}/orders/getBasedata?user_id=${clients.id}`)
  let pendingOrders = await fetchPendingOrders(clients.id);
  const registerData = await getRegisters(clients.id);
   await getOrdersbyPickupTime()
   openModalBtn.onclick = function() {
     openCaixaModal()
   }
  // if(clients.registe)
  console.log(pendingOrders)
  if(pendingOrders.length===0){
    loadingPopup.style="display:none"
    showCustomAlert('não tem pedido pendente')
    hideLoadingPopup();
    return
  }
  let ordersList = document.getElementById('orders-list');//未支払い枠エレメント
  let orderItems = document.getElementById('order-items');//詳細枠エレメント
  let totalAmountElement = document.getElementById('total-amount');//支払い総額エレメント
  let depositAmountElement = document.getElementById('deposit-amount');//預入金額エレメント
  let changeAmountElement = document.getElementById('change-amount');//お釣りエレメント
  let taxIncluidAmountElent = document.getElementById('tax-included-amount');//税金込み総額エレメント
　　//未支払いオーダーカードを作成
    pendingOrders.forEach(order => {
      let tableDisplay =order.table_no
      let status = "Pronto"
      let styleColer ="background-color:#90EE90"
      let icon=""
      let displayText = order.order_type==='local'? `${order.order_type} mesa:${order.table_no}`:order.order_type
      tableDisplay = `${displayText}<br>${order.order_name}`;
      if(order.order_status==='pending'){
        status="Em preparo"
        styleColer='background-color:#FFCCCB'
        icon='<img src="../imagen/pending.jpg">'
      }else if(order.order_status==='prepared'){
        icon='<img src="../imagen/prepared.jpg">'
      }
      if(order.payment_method!="yet"){
        icon+='<img src="../imagen/payed.jpg">'
      }
      let orderCard = document.createElement('div');
      orderCard.classList.add('order-card');
      orderCard.style=styleColer
      orderCard.setAttribute('data-id', order.id); // data-id 属性を設定
      orderCard.id = order.id
      orderCard.innerHTML = `<div class="order-card-main-div">
         <div class="order-leftdiv"><h3>${tableDisplay}<br>${status}</h3></div>
         <div class="order-rightdiv">
          ${icon}
         </div>
       </div>`;

      orderCard.addEventListener('click', () => {
          if (selectedCard) {
              selectedCard.classList.remove('selected-card');
          }
          orderCard.classList.add('selected-card');
          selectedCard = orderCard;
          selectOrders=order
          displayOrderDetails(order);
      });
      ordersList.appendChild(orderCard);
       hideLoadingPopup();
  });



  function displayOrderDetails(order) {
    const paymentButtons = [cashPaymentButton, creditPaymentButton, otherPaymentButton];
    paymentButtons.forEach(button => {
     button.classList.remove("selected")
    })
    clients.paytype=''
    if(order.payment_method==='cash'){
      document.getElementById('cash-payment').classList.add('selected')
      clients.paytype='cash'
    }
    if(order.payment_method==='credit'){
      document.getElementById('credit-payment').classList.add('selected')
      clients.paytype='credit'
    }
    if(order.payment_method==='other'){
      document.getElementById('other-payment').classList.add('selected')
      clients.paytype='other'
    }

      clients.printInfo = order;
      orderItems.innerHTML = ''; // Clear previous items
      clients.selectedOrder = order.id;

      // レシート用のデータを準備
      let receiptData = {
          items: [],
          totalAmount: 0,
          order_id:order.id,
          nomedaComanda:order.order_name
      };

      order.OrderItems.forEach(item => {
          // メニュー名を取得
          const menuGt = MainData.menus.find(menu => menu.id === item.menu_id);
          if (menuGt) {
              item.menu_name = menuGt.menu_name_pt; // ポルトガル語のメニュー名を追加
          } else {
              item.menu_name = "Menu não encontrado"; // メニューが見つからない場合のデフォルト値
          }
          // オプション名を取得
          let disOption = "";
          const options = JSON.parse(item.options);
          options.forEach(option => {
              const optionGt = MainData.options.find(opt => opt.id === parseInt(option.id));
              if (optionGt) {
                  disOption += `${optionGt.option_name_pt}, `; // ポルトガル語のオプション名を追加
              }
          });
          item.option_names = disOption ? disOption.slice(0, -2) : ""; // 最後のカンマを削除して追加
          // レシート用のアイテム情報を追加
          receiptData.items.push({
              menu_name: item.menu_name,
              quantity: item.quantity,
              item_price: parseInt(item.total_price),
              option_names: item.option_names
          });

          // 合計金額を計算
          receiptData.totalAmount += parseInt(item.total_price) ;//* item.quantity
      });
      // DOMにアイテムを表示
      order.OrderItems.forEach(item => {
          let li = document.createElement('li');
          li.innerHTML = `
              ${item.menu_name} x${item.quantity} - ¥${parseInt(item.total_price).toLocaleString()}
              <br>
              ${item.option_names}
          `;
          orderItems.appendChild(li);
      });
      // 合計金額を表示
      console.log(clients.tax_use)
      totalAmountElement.textContent = `￥${Math.floor(receiptData.totalAmount).toLocaleString()}`;
      if(!clients.tax_use){
        console.log('tax対象')
        document.getElementById('tax-included-amount').textContent =`￥${Math.floor(receiptData.totalAmount).toLocaleString()}`
      }
      updateChange(); // Initial calculation
      // レシート用のデータをclientsに保存
      clients.receiptData = receiptData;
  }
    depositAmountElement.addEventListener('input', updateChange);
    function updateChange() {

      // if(clients.taxtType!=""){
        let deposit = parseInt(depositAmountElement.value) || 0;
        let total = parseInt(document.getElementById("tax-included-amount").textContent.replace(/[^\d]/g, '')) || 0;;
        let change = deposit - total;
        changeAmountElement.textContent = change >= 0 ? `¥${change.toLocaleString()}` : 0;
      // }
    }
    // Confirm Payment Button Logic
    document.getElementById('confirm-payment').addEventListener('click', async () => {
    // Assuming you have a selectedOrder variable that stores the current order
    registeConfirm()
});
document.getElementById('confirm-ptakes').addEventListener('click',async ()=>{
  entregueConfirm()
})

function daysSet(){
    const now = new Date();
    // 開始日時: 今日の00:00:00
    const startOfDay = new Date(now.setHours(0, 0, 0, 0) + (9 * 60 * 60 * 1000)).toISOString().slice(0, 16);
    salesStart.value = startOfDay;
    // 終了日時: 今日の23:59:59
    const endOfDay = new Date(now.setHours(23, 59, 59, 999) + (9 * 60 * 60 * 1000)).toISOString().slice(0, 16);
    salesFinish.value = endOfDay;
}

function showCustomAlert(message) {
    const alertBox = document.getElementById('custom-alert');
    alertBox.querySelector('p').textContent = message;
    alertBox.style.display = 'block';
    setTimeout(() => {
        alertBox.style.display = 'none';
    }, 1000); // 1秒間表示
}

const cashPaymentButton = document.getElementById('cash-payment');
const creditPaymentButton = document.getElementById('credit-payment');
const otherPaymentButton = document.getElementById('other-payment');
const paymentButtons = [cashPaymentButton, creditPaymentButton, otherPaymentButton];

// Update the paytype in the clients object
function updatePayType(type) {
clients.paytype = type;
console.log(clients)
}

paymentButtons.forEach(button => {
button.addEventListener('click', () => {
    // Remove 'selected' class from all buttons
    paymentButtons.forEach(btn => btn.classList.remove('selected'));
    // Add 'selected' class to the clicked button
    button.classList.add('selected');
    // Update the paytype based on the selected button
    if (button === cashPaymentButton) {
        updatePayType('cash');
    } else if (button === creditPaymentButton) {
        updatePayType('credit');
    } else if (button === otherPaymentButton) {
        updatePayType('other');
    }
});
});

 let addBeforeOrder = null
 let selctedCard = null
 let selectedOrderBackup = null;
    // プラスボタンをクリックしたらモーダルを表示
    addOrderBtn.addEventListener('click', () => {
      orderList.innerHTML=""
        if (selectedCard!=null) {
            // data-id 属性を取得
            const orderId = selectedCard.getAttribute('data-id');
            selctedCard =orderId
            const selectedOrder = pendingOrders.find(order => order.id === orderId-0);
            selectedOrderBackup = JSON.parse(JSON.stringify(selectedOrder));  // バックアップを作成
            addBeforeOrder = selectedOrder;
            menuModal.style.display = 'block';
            displayCategoryFilters();  // カテゴリーフィルターを表示
            displayOrderItems(selectedOrder)
            // displayMenuItems('all');   // 初期表示ですべてのメニューを表示
        } else {
          alert('Selecione uma comanda')
            console.log('No card selected');
        }
    });

    // モーダルの閉じるボタンをクリックで非表示
    closeModal.addEventListener('click', () => {
        menuModal.style.display = 'none';
        optionList.innerHTML = '';  // オプションリストをクリア
    });

    // カテゴリーフィルターを表示する関数
    function displayCategoryFilters() {
        categoryFilters.innerHTML = '';  // フィルターリストをクリア
        const allButton = document.createElement('button');
        allButton.textContent = 'すべて';
        allButton.addEventListener('click', () => displayMenuItems('all'));
        categoryFilters.appendChild(allButton);
        MainData.categories.forEach(category => {
            const categoryButton = document.createElement('button');
            categoryButton.textContent = category.admin_item_name;  // 日本語で表示
            categoryButton.addEventListener('click', () => {
              if (selectCategory) {
                  selectCategory.classList.remove('selected');
              }
              categoryButton.classList.add('selected');
              selectCategory = categoryButton;
              displayMenuItems(category.id)
            });
            categoryFilters.appendChild(categoryButton);
        });
    }

    // let selectCategory = null;
    // let selectOption = null
let adicionarItem = null
    // メニューを表示する関数
    function displayMenuItems(categoryId) {
        menuList.innerHTML = '';  // メニューリストをクリア
        const filteredItems = MainData.menus.filter(menu => categoryId === 'all' || menu.category_id === categoryId);
        filteredItems.forEach(menu => {
          console.log(menu)
            const menuItemDiv = document.createElement('button');
            menuItemDiv.textContent = `${menu.admin_item_name}￥${menu.price.split('.00')[0]}`;  // 管理名で表示
            menuItemDiv.classList.add('menu-item');
            menuList.appendChild(menuItemDiv);
            // メニューアイテムをクリックしたらオプションを表示
            menuItemDiv.addEventListener('click', () => {
              adicionarItem= []
                  // 以前の選択をクリア
                  if (selectedMenuItem) {
                      selectedMenuItem.classList.remove('selected');
                  }
                  adicionarItem = {kubun:'add',id:null,order_id:selctedCard,menu_id:menu.id,menu_name:menu.admin_item_name,total_price:menu.price}
                  // 新しい選択を適用
                  menuItemDiv.classList.add('selected');
                  selectedMenuItem = menuItemDiv;  // 現在の選択を保存
                  displayMenuOptions(menu.id);  // オプションを表示

              });
        });
    }

    let addNewOption = [];  // 選択したオプションの情報を格納する配列
    // オプションを表示する関数
    function displayMenuOptions(menuId) {
        optionList.innerHTML = '';  // オプションリストをクリア
        const filteredOptions = MainData.options.filter(option => option.menu_id === menuId);
        if (filteredOptions.length === 0) {
            // optionList.innerHTML = 'オプションはありません';
        } else {
            filteredOptions.forEach(option => {
                const optionItemDiv = document.createElement('button');
                optionItemDiv.textContent = option.option_name_pt;  // ポルトガル語のオプション名で表示
                optionItemDiv.classList.add('option-item');
                optionList.appendChild(optionItemDiv);
                // オプションアイテムをクリックした時の処理
                optionItemDiv.addEventListener('click', () => {
                    // ボタンに 'selected' クラスが既に付いているか確認
                    if (optionItemDiv.classList.contains('selected')) {
                        // 'selected' クラスが付いていた場合はクラスを削除
                        optionItemDiv.classList.remove('selected');
                        // addNewOption 配列から該当するオプションを削除
                        addNewOption = addNewOption.filter(opt => opt.menu_id !== option.menu_id);
                    } else {
                        // 'selected' クラスを追加して選択状態にする
                        optionItemDiv.classList.add('selected');
                        // addNewOption 配列にオプション情報を追加
                        addNewOption.push({
                          option_id:option.id,
                            menu_id: option.menu_id,
                            option_name: option.option_name_pt,
                            additional_price: option.additional_price
                        });
                    }
                    console.log('Selected options:', addNewOption);  // 選択されたオプションを表示（デバッグ用）
                });
            });
        }
    }

    document.getElementById('add-for-new-list').addEventListener('click', () => {
        if (!adicionarItem) {
            alert('Selecione o item');
            return;
        }
        // 数量選択フィールドを表示
        const quantityInputDiv = document.getElementById('quantity-input');
        quantityInputDiv.style.display = 'block';
        const quantityButtons = document.querySelectorAll('.quantity-btn');
        const quantityInput = document.getElementById('item-quantity');
        // 数量ボタンをクリックした時の処理
        quantityButtons.forEach(button => {
            button.addEventListener('click', () => {
                quantityButtons.forEach(btn => btn.classList.remove('active'));
                button.classList.add('active');
                const value = button.getAttribute('data-value');
                quantityInput.value = value;
            });
        });
        // 確定ボタンのイベントハンドラ
        document.getElementById('confirm-quantity-btn').addEventListener('click', async() => {
            const quantity = parseInt(document.getElementById('item-quantity').value, 10);
            if (isNaN(quantity) || quantity <= 0) {
                alert('数量を正しく入力してください。');
                return;
            }

            // オプションの合計金額を計算
            const totalPrice = addNewOption.reduce((acc, option) => {
                return acc + parseFloat(option.additional_price);
            }, 0);

            // オプションを新しい形式に変換
            const formattedOptions = addNewOption.map(option => ({
                id: option.option_id.toString(),
                name: option.option_name,
                additional_price: parseFloat(option.additional_price)
            }));
            // JSON形式に変換
            const jsonOptions = JSON.stringify(formattedOptions);
            // アイテムの価格を数量に応じて更新
            let itemPrice = (parseFloat(adicionarItem.total_price) + totalPrice) * quantity;
            adicionarItem.total_price = itemPrice;
            adicionarItem.item_price = itemPrice;
            adicionarItem.quantity = quantity;
            adicionarItem.options = jsonOptions;
            // アイテムが既に存在しないか確認してから追加
            if (!addBeforeOrder.OrderItems.includes(adicionarItem)) {
                addBeforeOrder.OrderItems.push(adicionarItem);
            }
            // 合計金額を更新
            const allTotalPrice = parseFloat(addBeforeOrder.total_amount) + itemPrice;
            addBeforeOrder.total_amount = allTotalPrice;
            // オーダーアイテムを再描画
            displayOrderItems(addBeforeOrder);
            // 状態をリセット
            addNewOption = [];
            adicionarItem = null; // ここを `null` に設定して重複を防ぐ
            selectedMenuItem.classList.remove('selected');
            optionList.innerHTML = "";
            quantityInputDiv.style.display = 'none'; // 数量選択フィールドを非表示
        }, { once: true }); // ボタンのイベントリスナーが複数回登録されるのを防ぐために `once: true` を追加
    });

    function formatPrice(value) {
    const parsedValue = parseFloat(value);
    return parsedValue % 1 === 0 ? parsedValue.toFixed(0) : parsedValue.toFixed(2);
}

    // リストを表示する関数
    async function displayOrderItems(selectedOrder) {
      let total_amount = 0
      const totalQuantity = selectedOrder.OrderItems.reduce((acc, item) => {
        if(item.kubun!='delete'){
          total_amount += (item.total_price-0)
          return acc + item.quantity
        }else{
          return acc
        }
      }, 0);
      const totalsAmount = formatPrice(total_amount);
        document.getElementById('total-alter-order-count').innerText = `${totalQuantity} itens`;
        document.getElementById('total-alter-order-amount').innerText = `Valor total : ￥${parseFloat(totalsAmount).toLocaleString()}`;
        orderList.innerHTML = ''; // リストをクリア
        selectedOrder.OrderItems.forEach((item, index) => {
          let deleteMenu = false
          let addNewFlug = false
            // メニューアイテムの表示
            const menuItemDiv = document.createElement('div');
            menuItemDiv.style.display = 'flex';
            menuItemDiv.style.justifyContent = 'space-between'; // アイテムと削除ボタンを左右に分ける

            // アイテム名と金額
            const itemDetailsDiv = document.createElement('div');
            const removeItemBtn = document.createElement('button');
            removeItemBtn.dataset.itemIndex = index; // アイテムのインデックスを保持
            removeItemBtn.textContent = '🗑️';
            removeItemBtn.classList.add('remove-item')
            if(item.kubun==='add'){
              itemDetailsDiv.classList.add('adicionar-menu-novo')

              addNewFlug=true
            }else if(item.kubun==='delete'){
              deleteMenu = true
              itemDetailsDiv.classList.add('deletar-menu-da-lista')
              removeItemBtn.textContent = '🔙';
              removeItemBtn.classList.add('undo-remove-item');
            }
            itemDetailsDiv.innerHTML = `
                <strong>${item.menu_name}</strong>-✕${item.quantity} ￥${parseFloat(item.item_price).toLocaleString()}
            `;

            // アイテム削除ボタンのロジック


  // removeItemBtn.classList.add('remove-item');


  // アイテム削除の処理
  removeItemBtn.addEventListener('click', () => {
      if (selectedOrder.OrderItems[index].kubun === 'delete') {
          // 既に削除フラグが立っている場合は削除を取り消す
          if(selectedOrder.OrderItems[index].id!=null){
            selectedOrder.OrderItems[index].kubun = null;
          }else{
            selectedOrder.OrderItems[index].kubun = 'add';
          }
          // itemDetailsDiv.classList.remove('deletar-menu-da-lista');
          // // ボタンを元に戻す
          // removeItemBtn.textContent = '🗑️';
          // removeItemBtn.classList.remove('undo-remove-item');
      } else {
          // 削除フラグを立てる
          selectedOrder.OrderItems[index].kubun = 'delete';
          itemDetailsDiv.classList.add('deletar-menu-da-lista');

          // ボタンを「削除取り消し」に変更
          // removeItemBtn.textContent = '🔙';
          // removeItemBtn.classList.add('undo-remove-item');
      }
      displayOrderItems(selectedOrder)

  });
            // アイテムの詳細表示エリアに削除ボタンを追加
            itemDetailsDiv.appendChild(removeItemBtn);
            // メニューアイテムの行にアイテム名と削除ボタンを追加
            menuItemDiv.appendChild(itemDetailsDiv);
            menuItemDiv.appendChild(removeItemBtn);
            orderList.appendChild(menuItemDiv);
            // オプションの表示
            const options = JSON.parse(item.options);
            options.forEach((option, optionIndex) => {
                const optionDiv = document.createElement('div');
                if(deleteMenu){
                  console.log('adcionar claa nobo')
                  optionDiv.classList.add('deletar-menu-da-lista')
                }else if(addNewFlug){
                  optionDiv.classList.add('adicionar-menu-novo')
                }
                optionDiv.style.display = 'flex';
                optionDiv.style.justifyContent = 'space-between'; // オプションと削除ボタンを左右に分ける
                optionDiv.style.marginLeft = '20px'; // オプションを少し右にオフセット

                // オプションの詳細
                const optionDetailsDiv = document.createElement('div');
                optionDetailsDiv.innerHTML = `
                    (${option.name} - ￥${parseFloat(option.additional_price).toLocaleString()})
                `;
                // オプションの行にオプション名と削除ボタンを追加
                optionDiv.appendChild(optionDetailsDiv);
                // optionDiv.appendChild(removeOptionBtn);
                orderList.appendChild(optionDiv);
            });
        });
    }
// オプションを削除する関数
function removeOption(itemIndex, optionIndex) {
    const options = JSON.parse(order.OrderItems[itemIndex].options);
    options.splice(optionIndex, 1); // オプションを削除
    order.OrderItems[itemIndex].options = JSON.stringify(options); // 更新
    displayOrderItems(); // リストを再表示
}
// オプション削除ボタンのイベントリスナー
document.addEventListener('click', (event) => {
    if (event.target.classList.contains('remove-option')) {
        const itemIndex = event.target.getAttribute('data-item-index');
        const optionIndex = event.target.getAttribute('data-option-index');
        removeOption(itemIndex, optionIndex);
    }
});
// オーダーを追加するボタンのイベント
document.getElementById('save-add-menu').addEventListener('click', async () => {
  showLoadingPopup()
  try {
    console.log('Updated Order:', addBeforeOrder);
    // サーバーに更新を送信
    const response = await fetch(`${server}/orderskun/update/order/admin`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            newOrder: addBeforeOrder
        })
    });

    if (response.ok) {
      const responseData = await response.json();  // サーバーからのレスポンスデータを取得
      // レスポンスデータをpendingOrdersに反映
      const orderIndex = pendingOrders.findIndex(order => order.id === responseData.id);
      if (orderIndex !== -1) {
          pendingOrders[orderIndex] = responseData;  // pendingOrdersをサーバーの最新情報で更新
      } else {
          pendingOrders.push(responseData);  // もし新規オーダーなら追加
      }
      showCustomAlert('Alteração feita com sucesso');  // 成功メッセージを表示
      // モーダルを閉じる
      selctedCard = null;
      document.getElementById('menuModal').style.display = "none";
      // 最新のオーダー情報を画面に反映（必要に応じて更新されたオーダー詳細を表示）
      displayOrderDetails(responseData);  // 関数にデータを渡して画面に反映
    } else {
      alert('Tivemos erro no registro');
    }

    hideLoadingPopup()
  } catch (e) {
    console.log(e);
    hideLoadingPopup()
  }
});



document.getElementById('close-menuModal').addEventListener('click', ()=>{
  document.getElementById('menuModal').style.display = "none";
  addBeforeOrder = null
  selctedCard = null
  if (selectedOrderBackup) {
        // 元に戻す
        const orderIndex = pendingOrders.findIndex(order => order.id === selectedOrderBackup.id);
        pendingOrders[orderIndex] = JSON.parse(JSON.stringify(selectedOrderBackup));  // 元に戻す
        console.log('Changes reverted for order:', selectedOrderBackup.id);
    }
})


})
// });


async function registeConfirm(){
  console.log(clients.printInfo)
  const loadingPopup = document.getElementById('loading-popup');
  if (!clients.selectedOrder) {
      alert('Seleciona uma comanda');
      return;
  }
  if(clients.paytype===""){
    alert("Selecione a forma de pagamento")
    return
  }
  if(document.getElementById('deposit-amount').value===""||document.getElementById('deposit-amount').value-0===0){
    alert("Insira o valor recebido")
    return
  }
  // Update the order in the database
  try {
showLoadingPopup()

      const response = await fetch(`${server}/orderskun/updatePayment`, {
          method: 'POST',
          headers: {
              'Content-Type': 'application/json'
          },
          body: JSON.stringify({
              order_id: clients.selectedOrder,
              payment_method: clients.paytype,  // The selected payment method from clients object
              order_status: 'pending'  // Update the status to 'confirmed'
          })
      });
      console.log(response.status)
      if (response.status===200) {
          showCustomAlert("Registrado")
          const orderCard = document.querySelector(`.selected-card[data-id="${clients.selectedOrder}"]`);
          clearOrderDetails();
          hideLoadingPopup()
      } else {
          alert('Erro no registro.');
          hideLoadingPopup()
      }
  } catch (error) {
      hideLoadingPopup()
      console.error('Error confirming payment:', error);
      alert('Erro no registro.');
  }

}

async function entregueConfirm(){
  console.log(clients)

if(clients.printInfo.order_type==='local'||clients.printInfo.order_type==='order'||clients.printInfo.order_type==='takeout'){
  if(clients.printInfo.payment_method==='yet'&&clients.paytype===""){
    alert('Este pedido não foi registrado a forma de pagamento ainda, selecione por favor')
    return
  }
}
if(clients.printInfo.order_type==='uber'||clients.printInfo.order_type==='demaekan'||clients.printInfo.order_type==='other'){
  clients.paytype='other'
}else{
  clients.paytype = clients.printInfo.payment_method
}
  // Update the order in the database
  try {
    showLoadingPopup()
      const response = await fetch(`${server}/orderskun/updateConfirmd`, {
          method: 'POST',
          headers: {
              'Content-Type': 'application/json'
          },
          body: JSON.stringify({
              order_id: clients.selectedOrder,
              order_status: 'confirmed',  // Update the status to 'confirmed'
              paymentType: clients.paytype
          })
      });
      if (response.status===200) {
           hideLoadingPopup()
          showCustomAlert("Registrado")
          const cashPaymentButton = document.getElementById('cash-payment');
          const creditPaymentButton = document.getElementById('credit-payment');
          const otherPaymentButton = document.getElementById('other-payment');
          const paymentButtons = [cashPaymentButton, creditPaymentButton, otherPaymentButton];
          paymentButtons.forEach(button => {
           button.classList.remove("selected")
          })

          // Remove the order card from the UI
          const orderCard = document.querySelector(`.selected-card[data-id="${clients.selectedOrder}"]`);
          if (orderCard) {
              orderCard.remove();
          }
          // Optionally, you can clear the order details or reset the UI
          clearOrderDetails();
      } else {
          alert('Erro no registro.');
      }
  } catch (error) {
    hideLoadingPopup()
    console.error('Error confirming payment:', error);
    alert('Erro no registro.');
  }
  loadingPopup.style="display:none"
}

// Function to clear the order details from the UI
function clearOrderDetails() {
    // 注文詳細のリセット
    document.getElementById('order-items').innerHTML = '';
    document.getElementById('total-amount').textContent = '0';
    document.getElementById('deposit-amount').value = '0';
    document.getElementById('change-amount').textContent = '0';
    document.getElementById('tax-included-amount').textContent = '0';

    // クライアントオブジェクトのリセット
    clients.paytype = '';
    clients.depositAmount = '';
    clients.selectedOrder = '';
    clients.taxtType = '';
    clients.receiptData = '';

    selectedOrder = null;

    // 指定されたコンテナ内の特定のクラスをすべて削除
    function removeClassFromElements(containerId, className) {
        const container = document.getElementById(containerId);
        const buttons = container.getElementsByClassName(className);
        Array.from(buttons).forEach(button => {
            button.classList.remove(className);
        });
    }

    // payment-methods の selected クラスと tax-buttons の active-tax クラスを削除
    removeClassFromElements('payment-methods', 'selected');
    removeClassFromElements('tax-buttons', 'active-tax');
}



function showCustomAlert(message) {
    const alertBox = document.getElementById('custom-alert');
    alertBox.querySelector('p').textContent = message;
    alertBox.style.display = 'block';
    setTimeout(() => {
        alertBox.style.display = 'none';
    }, 1000); // 1秒間表示
}


async function fetchPendingOrders() {
    try {
        const response = await fetch(`${server}/orderskun/get-by-status`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ client_id: clients.id,status:'confirmed' })
        });
        if (!response.ok) {
            throw new Error('Failed to fetch pending orders');
        }
        const pendingOrders = await response.json();
        console.log('NotPending Orders:', pendingOrders);
        return pendingOrders;
    } catch (error) {
        console.error('Error fetching pending orders:', error);
        return null;
    }

}
document.addEventListener('DOMContentLoaded', function() {
    // 初期設定: ボタンのクリックイベントを追加
    document.getElementById('tax-8').addEventListener('click', function() {
      if(!selectedCard){
        alert('selecione o pedido')
        return
      }
      if(!clients.tax_use){
        selectTaxButton('tax-8');
        return
      }
        applyTax(8);
        selectTaxButton('tax-8');
        clients.taxtType = 8;
        updateChange()
        // updateChangeAmount();
    });

    document.getElementById('tax-10').addEventListener('click', function() {
      if(!selectedCard){
        alert('selecione o pedido')
        return
      }
      if(!clients.tax_use){
        selectTaxButton('tax-10');
        return
      }
        applyTax(10);
        selectTaxButton('tax-10');
        clients.taxtType = 10;
        updateChange()
        // updateChangeAmount();
    });
    function updateChange() {
      let depositAmountElement = document.getElementById('deposit-amount');//預入金額エレメント
      let changeAmountElement = document.getElementById('change-amount');//お釣りエレメント
      let taxIncluidAmountElent = document.getElementById('tax-included-amount');//税金込み総額エレメント
      // if(clients.taxtType!=""){
        let deposit = parseInt(depositAmountElement.value) || 0;
        let total = parseInt(document.getElementById("tax-included-amount").textContent.replace(/[^\d]/g, '')) || 0;;
        let change = deposit - total;
        changeAmountElement.textContent = change >= 0 ? `¥${change.toLocaleString()}` : 0;
      // }
    }
});

// selectTaxButton関数を修正
function selectTaxButton(selectedButtonId) {
    // すべての税ボタンから active-tax クラスを削除
    const taxButtons = document.querySelectorAll('.tax-button');
    taxButtons.forEach(button => {
        button.classList.remove('active-tax');
    });

    // クリックされたボタンに active-tax クラスを追加
    const selectedButton = document.getElementById(selectedButtonId);
    if (selectedButton) {
        selectedButton.classList.add('active-tax');
    }
}
let originalAmount = null; // 元の金額を保存する変数

// 既存の applyTax 関数
function applyTax(taxRate) {
    const totalAmountElement = document.getElementById('total-amount');
    // if (!originalAmount) {
        // ￥記号とカンマ、ピリオドを削除して数値に変換
        const totalAmountText = selectOrders.total_amount
        originalAmount = parseFloat(totalAmountText);
        // console.log("Original Amount (after removing symbols):", originalAmount); // デバッグ用
    // }

    // 税額を計算
    const taxAmount = originalAmount * (taxRate / 100);
    const totalWithTax = Math.floor(originalAmount + taxAmount);
    // 手動でカンマ区切りを適用
    const finalFormattedTotalWithTax = totalWithTax.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    // // 整数値を表示
    document.getElementById('tax-included-amount').textContent = `¥${totalWithTax.toLocaleString()}`;
    clients.receiptData.taxInclued = totalWithTax
    // 整数値を表示
    // document.getElementById('tax-included-amount').textContent = `${totalAmountElement.textContent}`;
}

// 税率が適用される前の状態に戻すためのリセット関数
function resetOriginalAmount() {
    const totalAmountElement = document.getElementById('total-amount');
    totalAmountElement.textContent = originalAmount.toLocaleString('ja-JP', { style: 'currency', currency: 'JPY' });
    originalAmount = null; // 初期化
}

document.getElementById('menu-btn').addEventListener('click', () => {
    console.log('Menu button clicked');
});

document.getElementById('history-btn').addEventListener('click', () => {
    // Handle history button click
    console.log('History button clicked');
});

document.getElementById('logout-btn').addEventListener('click', () => {
    // Handle logout button click
    console.log('Logout button clicked');
    // Perform logout actions
});

document.getElementById('print-receipt').addEventListener('click', () => {
  recite();
});

document.getElementById('delete-order').addEventListener('click', () => {
  showLoadingPopup()
    if (!clients.selectedOrder) {
        alert('Escolha uma comanda que gostaria de deletar');
        return;
    }
    // 選択されたオーダーのIDと、オーダー内のアイテムIDを取得
    const selectedOrderId = clients.selectedOrder;
    const orderItems = clients.printInfo.OrderItems.map(item => item.id); // アイテムIDの配列を取得

    // 削除確認のダイアログを表示
    const confirmDelete = confirm('Deseja deletar a comanda? Não tera mais como recuperar.');
    if (!confirmDelete) return;

    // 削除リクエストを送信（オーダーIDとアイテムIDを一緒に送信）
    fetch(`${server}/orderskun/delete/${selectedOrderId}`, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ itemIds: orderItems }) // アイテムIDもリクエストに含める
    })
    .then(response => {
        if (response.ok) {
            alert('Comanda deletada com sucesso.');
            // 必要に応じて注文リストを更新
            removeOrderFromList(selectedOrderId);
            clients.selectedOrder=""
            document.getElementById('total-amount').innerText=0
            document.getElementById('order-items').innerHTML = ''
            hideLoadingPopup()
        } else {
            return response.json().then(data => {
              hideLoadingPopup()
                throw new Error(data.message || 'Tivemos um erro');
            });
        }
    })
    .catch(error => {
        console.error('Error:', error);
        alert('Tivemos um erros ');
    });
});

// 削除後に画面から該当オーダーを消す処理（必要に応じてカスタマイズ）
function removeOrderFromList(orderId) {
    const orderElement = document.getElementById(`${orderId}`);
    if (orderElement) {
        orderElement.remove(); // 画面から削除
    }
}
async function recite(nb, reciteAmount) {
  if (!clients.receiptData) {
      console.log("レシートデータがありません。");
      return;
  }

  if (!clients.selectedOrder) {
      alert('Seleciona uma comanda');
      return;
  }
  if(clients.tax_use&&clients.taxtType===""){
    alert("Selecione o imposto")
    return
  }
  // if(clients.depositAmount===""){
  //   alert("Insira o vlor recebido")
  //   return
  // }
  if(clients.paytype===""){
    alert("Selecione a forma de pagamento")
    return
  }
  console.log(document.getElementById('deposit-amount').value)
  if(document.getElementById('deposit-amount').value===""||document.getElementById('deposit-amount').value-0===0){
    alert("Insira o valor recebido")
    return
  }
  if((document.getElementById('deposit-amount').value-0)<clients.receiptData.taxInclued){
    alert('O valor recebido está menor do que o valor com imposto')
    return
  }

  const troco = document.getElementById('change-amount').innerText
  const recebido = document.getElementById('deposit-amount').value
  const valorcomTax = document.getElementById('tax-included-amount').innerText
  let valorINclusoTax = ''
  if(clients.tax_use){
    valorINclusoTax =clients.receiptData.taxInclued
  }else{
    valorINclusoTax =valorcomTax.split('￥')[1]
  }
  let valorSemTax = selectOrders.total_amount
  if (valorSemTax.endsWith(".00")) {
    valorSemTax = valorSemTax.slice(0, -3);
}

if(clients.id===1){
  clients.receiptData.taxtTypes=clients.taxtType
  clients.receiptData.depositAmount = recebido
  clients.receiptData.changeAmount=troco
reciteBuonissimoOnly()
}else{
  let row = `<div id="contentToPrint" class="print-content">
    <div class="img-dicvs">
      ${decodedToken.receipt_logo_url ? `<img src="${decodedToken.receipt_logo_url}" width="100" class="setting-right-button" />` : ''}
  </div>
    <div class="adress-div">
      <p>${decodedToken.receipt_display_name} <br>${decodedToken.receipt_postal_code} <br>${decodedToken.receipt_address}<br>${decodedToken.receipt_tel}</p>
    </div>
    <div class='display-center-div'>
      <p>${await getCurrentDateTime()} #${clients.receiptData.order_id}</p>
    </div>
    <div class="contents-div">
    ${await generateReceiptItemsHTML()}
    </div>
    <div class="dotted-line"></div>
    <div class="total-qt">
      <div class="azukari-amount-div">
        <div>御買上げ点数　　</div>
        <div>${clients.receiptData.items.length}点</div>
      </div>
      <div class="azukari-amount-div">
        <div>小計</div>
        <div>￥${clients.receiptData.totalAmount.toLocaleString()}</div>
      </div>
      ${decodedToken.tax_enabled ? `
      <div class="azukari-amount-div">
        <div>(${clients.taxtType}%対象：${valorSemTax}</div>
        <div>消費税：${valorINclusoTax-valorSemTax})</div>
      </div>`
      :''}

    </div>
    <div class="dotted-line"></div>
    <div class="total-amount-div">
      <div>合計</div>
      <div>￥${valorINclusoTax.toLocaleString()}</div>
    </div>
    <div class="total-amount-div">
      <div>お預り</div>
    <div>￥${Number(recebido).toLocaleString()}</div>
    </div>
    <div class="total-amount-div">
      <div>お釣り</div>
      <div>${troco.toLocaleString()}</div>
    </div>
    <div class="dotted-line"></div>
  </div>`;

  var printWindow = window.open('', '_blank');

  // ウィンドウが正常に開けているか確認
  if (!printWindow) {
    alert('A página foi bloqueata, verifique a configuração do google');
    return; // 処理を終了します
  }

  // 新しいウィンドウにコンテンツを書き込む
  printWindow.document.write(`
    <html>
    <head>
      <title id="title-print"></title>
      <style>
        @media print {
          #body-testes {
            width: 80mm;
            height: 100mm !important;
            margin: 0;
            padding: 0;
            overflow: hidden;
            background-color: red !important;
          }
          .adress-div {
            width: 100%;
            height: 7rem;
            background-color: black;
            -webkit-print-color-adjust: exact;
            color: white;
            padding-left:10px
          }
          .img-dicvs {
            display: flex;
            justify-content: center;
          }
          .display-center-div {
            display: flex;
            justify-content: center;
          }
          .contents-div {
            width: 100%;
          }
          .items-name {
            text-align: left;
          }
          .details-iten {
            width: 80%;
            text-align: right;
            margin-right: 1rem;
          }
          .dotted-line::before {
            content: '';
            display: block;
            width: 100%;
            height: 1px;
            background-color: black;
            background-image: repeating-linear-gradient(90deg, black, black 2px, transparent 2px, transparent 4px);
            -webkit-print-color-adjust: exact;
          }
          .total-amount-div {
            width: 100%;
            display: flex;
            justify-content: space-between;
            font-size: 3vh;
          }
          .azukari-amount-div {
            width: 100%;
            display: flex;
            justify-content: space-between;
          }
          .total-qt {
            margin-top: 1rem;
          }
        }
      </style>
    </head>
    <body id="body-testes">
      ${row}
    </body>
    </html>
  `);

  // 画像が正しく読み込まれるまで待機
  if (decodedToken.receipt_logo_url) {
    await new Promise(resolve => {
      const img = new Image();
      img.onload = resolve;
      img.src = decodedToken.receipt_logo_url;
    });
  } else {
    console.log("No image URL provided, skipping image load.");
  }
  printWindow.print();
  printWindow.close();
}


}

async function reciteBuonissimoOnly() {
    // 例: clients が適切に定義されていると仮定

    const receiptData = clients.receiptData; // 必要に応じて正しいスコープで定義

    // フェッチ処理
    const response = await fetch(`http://localhost:3100/orders/PrintRecite`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ receiptData }) // 正しい構造に修正
    });

    // レスポンス確認
    if (!response.ok) {
        console.error('Error in request:', response.statusText);
    } else {
        const data = await response.json();
        console.log('Response:', data);
    }
}

async function ryousyushoBuonissimoOnly() {
    // 例: clients が適切に定義されていると仮定

    const receiptData = clients.receiptData; // 必要に応じて正しいスコープで定義

    // フェッチ処理
    const response = await fetch(`http://localhost:3100/orders/printRyousyusho`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ receiptData }) // 正しい構造に修正
    });

    // レスポンス確認
    if (!response.ok) {
        console.error('Error in request:', response.statusText);
    } else {
        const data = await response.json();
        console.log('Response:', data);
    }
}






function getCurrentDateTime() {
            const now = new Date();
            const year = now.getFullYear();
            const month = now.getMonth() + 1;
            const day = now.getDate();
            const hours = now.getHours();
            const minutes = now.getMinutes();
            const seconds = now.getSeconds();

            // ゼロ埋めして二桁にする
            const formattedMonth = month < 10 ? '0' + month : month;
            const formattedDay = day < 10 ? '0' + day : day;
            const formattedHours = hours < 10 ? '0' + hours : hours;
            const formattedMinutes = minutes < 10 ? '0' + minutes : minutes;
            const formattedSeconds = seconds < 10 ? '0' + seconds : seconds;

            return year + '-' + formattedMonth + '-' + formattedDay + ' ' +
                                                formattedHours + ':' + formattedMinutes + ':' + formattedSeconds;
        }

        // レシート用データをHTML形式に変換する関数
        function generateReceiptItemsHTML() {
            if (!clients.receiptData || !clients.receiptData.items) {
                return ''; // レシートデータが存在しない場合は空文字を返す
            }

            let receiptHTML = '';
            clients.receiptData.items.forEach(item => {
                receiptHTML += `
                    <div class="item-entry">
                        <div class="items-name">${item.menu_name} x${item.quantity} - ¥${item.item_price.toLocaleString()}</div>
                        ${item.option_names ? `<div class="details-iten">${item.option_names}</div>` : ''}
                    </div>
                `;
            });

            return receiptHTML;
        }

        // レシート用データをHTML形式に変換する関数
        function generateCupomItemsHTML() {
            if (!clients.receiptData || !clients.receiptData.items) {
                return ''; // レシートデータが存在しない場合は空文字を返す
            }

            let receiptHTML = '';
            clients.receiptData.items.forEach(item => {
                receiptHTML += `
                    <div class="item-entry">
                        <div class="items-name">${item.menu_name} x ${item.quantity} }</div>
                        ${item.option_names ? `<div class="details-iten">${item.option_names}</div>` : ''}
                    </div>
                `;
            });

            return receiptHTML;
        }

       document.getElementById('print-cupom').addEventListener('click',cupom)

        async function cupom() {

        let row = `<div id="contentToPrint" class="print-content">

          <div class="ubernumber">
            <p>${clients.receiptData.nomedaComanda}</p>
          </div>
          <div class='display-center-div'>
            <p>${await getCurrentDateTime()}  #${clients.receiptData.order_id}</p>
          </div>
          <div class="contents-div">
           <p>ご注文内容(Pedido)</p>
          </div>
          <div class="contents-div">
              ${await generateCupomItemsHTML()}
          </div>

          <div class="azukari-amount-div">
            <div>御買上げ点数　　</div>
            <div>${clients.receiptData.items.length}点</div>
          </div>
          <div class="dotted-line"></div>
          <div class="contents-div">
           <p>Thanks for order</p>
          </div>
          <div class="img-dicvs">
            ${decodedToken.receipt_logo_url ? `<img src="${decodedToken.receipt_logo_url}" width="100" class="setting-right-button" />` : ''}
        </div>
          <div class="adress-div">
          <p>${decodedToken.receipt_display_name} <br>${decodedToken.receipt_postal_code} <br>${decodedToken.receipt_address}<br>${decodedToken.receipt_tel}</p>
          </div>
        </div>`;


        var printWindow = window.open('', '_blank');

        // ウィンドウが正常に開けているか確認
        if (!printWindow) {
          alert('A página foi bloqueata, verifique a configuração do google');
          return; // 処理を終了します
        }

        // 新しいウィンドウにコンテンツを書き込む
        printWindow.document.write(`
          <html>
          <head>
            <title id="title-print"></title>
            <style>
              @media print {
                #body-testes {
                  width: 80mm;
                  height: 100mm !important;
                  margin: 0;
                  padding: 0;
                  overflow: hidden;
                  background-color: red !important;
                }
                .adress-div {
                  width: 100%;
                  height: 7rem;
                  background-color: black;
                  -webkit-print-color-adjust: exact;
                  color: white;
                }
                .img-dicvs {
                  display: flex;
                  justify-content: center;
                }
                .display-center-div {
                  display: flex;
                  justify-content: center;
                }
                .contents-div {
                  width: 100%;
                }
                .items-name {
                  text-align: left;
                }
                .details-iten {
                  width: 80%;
                  text-align: right;
                  margin-right: 1rem;
                }
                .dotted-line::before {
                  content: '';
                  display: block;
                  width: 100%;
                  height: 1px;
                  background-color: black;
                  background-image: repeating-linear-gradient(90deg, black, black 2px, transparent 2px, transparent 4px);
                  -webkit-print-color-adjust: exact;
                }
                .total-amount-div {
                  width: 100%;
                  display: flex;
                  justify-content: space-between;
                  font-size: 3vh;
                }
                .azukari-amount-div {
                  width: 100%;
                  display: flex;
                  justify-content: space-between;
                }
                .ubernumber {
                  width: 100%;
                  height: 8rem;
                  margin-top:1rem;
                  background-color: black;
                  -webkit-print-color-adjust: exact;
                  color: white;
                  font-size:6vh;
                  font-weight:bold;
                  display: flex;
                  justify-content: center;
                  align-items: center;"
                }

                .total-qt {
                  margin-top: 1rem;
                }
              }
            </style>
          </head>
          <body id="body-testes">
            ${row}
          </body>
          </html>
        `);

        // 画像が正しく読み込まれるまで待機
        // 画像が正しく読み込まれるまで待機
        if (decodedToken.receipt_logo_url) {
          await new Promise(resolve => {
            const img = new Image();
            img.onload = resolve;
            img.src = decodedToken.receipt_logo_url;
          });
        } else {
          console.log("No image URL provided, skipping image load.");
        }

        // 印刷を実行
        printWindow.print();

        // 印刷が完了したらウィンドウを閉じる
        printWindow.close();

        }

     document.getElementById('print-invoice').addEventListener('click',ryousyuso)
        async function ryousyuso() {
          if (!clients.receiptData) {
              return;
          }

          if (!clients.selectedOrder) {
              alert('Seleciona uma comanda');
              return;
          }
          if(clients.tax_use&&clients.taxtType===""){
            alert("Selecione o imposto")
            return
          }
          if(clients.paytype===""){
            alert("Selecione a forma de pagamento")
            return
          }

          if(document.getElementById('deposit-amount').value===""||document.getElementById('deposit-amount').value-0===0){
            alert("Insira o valor recebido")
            return
          }
          if((document.getElementById('deposit-amount').value-0)<clients.receiptData.taxInclued){
            alert('O valor recebido está menor do que o valor com imposto')
            return
          }
          const troco = document.getElementById('change-amount').innerText
          const recebido = document.getElementById('deposit-amount').value
          const valorcomTax = document.getElementById('tax-included-amount').innerText
          let valorINclusoTax = ''
          if(clients.tax_use){
            valorINclusoTax =clients.receiptData.taxInclued
          }else{
            valorINclusoTax =valorcomTax.split('￥')[1]
          }
          let valorSemTax = selectOrders.total_amount
          if (valorSemTax.endsWith(".00")) {
            valorSemTax = valorSemTax.slice(0, -3);
        }

        if(clients.id===1){
          clients.receiptData.taxtTypes=clients.taxtType
          clients.receiptData.depositAmount = recebido
          clients.receiptData.changeAmount=troco
        ryousyushoBuonissimoOnly()
      }else{
        let row = `

          <div class="adress-div">
            <div class="titles-ryousyu">領 収 証</div>
            <div class="dotted-line">　　　　　　　　　　様</div>
            <div class="dotted-line">￥${valorINclusoTax.toLocaleString()}-</div>
            <div class="coments-div">上記正に領収しました</div>

            <div class="coments-div">
            ${decodedToken.receipt_display_name} ${decodedToken.receipt_postal_code} ${decodedToken.receipt_address}${decodedToken.receipt_tel}
            </div>
          </div>
          <div class='display-center-div'>
            <p>${await getCurrentDateTime()} #${clients.receiptData.order_id}</p>
          </div>

          <div class="dotted-lines"></div>
          <div>＊領収証明細＊</div>
          <div class="contents-div">
            ${await generateReceiptItemsHTML()}
          </div>
          <div class="total-qt">
            <p>御買上げ点数　　:${clients.receiptData.items.length}</p>
          </div>
          <div class="dotted-lines"></div>
          ${decodedToken.tax_enabled ? `
          <div class="azukari-amount-div">
            <div>(${clients.taxtType}%対象：${valorSemTax}</div>
            <div>消費税：${valorINclusoTax-valorSemTax})</div>
          </div>`
          :''}
          <div class="total-amount-div">
            <div>合計</div>
            <div>￥${valorINclusoTax.toLocaleString()}</div>
          </div>
          <div class="azukari-amount-div">
            <div>お預り</div>
            <div>￥${Number(recebido).toLocaleString()}</div>
          </div>
          <div class="azukari-amount-div">
            <div>お釣り</div>
            <div>${troco.toLocaleString()}</div>
          </div>
          <div class="dotted-line"></div>
        `;


        var printWindow = window.open('', '_blank');

        // ウィンドウが正常に開けているか確認
        if (!printWindow) {
          alert('A página foi bloqueata, verifique a configuração do google');
          return; // 処理を終了します
        }

        // 新しいウィンドウにコンテンツを書き込む
        printWindow.document.write(
         `
          <html>
          <head>
            <title id="title-print"></title>
            <style>
            @media print {
               #body-testes {
                 width: 80mm !important;
                 height: 100mm !important;
                 margin: 0 !important;
                 padding: 0 !important;
               }

               .adress-div {

                 overflow: hidden;
                 writing-mode: vertical-rl; /* テキストを縦書きにする */
                 white-space: nowrap;
                 width:100%;
                 height:35rem
               }

               .adress-div div {
                 margin-bottom: 2rem; /* 適宜調整 */
                 text-orientation: sideways; /* 横向きにする */
               }
               .titles-ryousyu{
                 font-size:3vh;
                 text-align:center;

               }
               .dotted-line{
                 font-size:3vh;
                 text-align:right;
                 border-left:1px solid black;
                 margin-top:5rem;
               }
               .coments-div{
                 text-align:right;
                 margin-bottom:5rem
               }
               .contents-div {
                 width: 100%;
               }
               .items-name {
                 text-align: left;
               }
               .details-iten {
                 width: 80%;
                 text-align: right;
                 margin-right: 1rem;
               }
               .dotted-lines::before {
                 content: '';
                 display: block;
                 width: 100%;
                 height: 1px;
                 background-color: black;
                 background-image: repeating-linear-gradient(90deg, black, black 2px, transparent 2px, transparent 4px);
                 -webkit-print-color-adjust: exact;
               }
               .total-amount-div {
                 width: 100%;
                 display: flex;
                 justify-content: space-between;
                 font-size: 3vh;
               }
               .azukari-amount-div {
                 width: 100%;
                 display: flex;
                 justify-content: space-between;
               }
               .total-qt{
                 margin-top:1rem
               }
        .display-center-div{
          text-align:center;
          margin-top:8rem;
        }


             }
            </style>
          </head>
          <body id="body-testes">
            ${row}
          </body>
          </html>
        `
        );
        // 画像が正しく読み込まれるまで待機
        await new Promise(resolve => {
          var img = new Image();
          img.onload = resolve;
          img.src = "../imagen/logo.png";
        });

        // 印刷を実行
        printWindow.print();

        // 印刷が完了したらウィンドウを閉じる
        printWindow.close();

        // await registeConfirm();
      }






        }

 async function openCaixaModal(){
   console.log(clients)
   modal.style.display = "block";
   if(clients.registerInfo.length!=0){
     console.log('haitteru')
     document.getElementById('bill5000').value = clients.registerInfo[0].bill_5000
     document.getElementById('bill1000').value = clients.registerInfo[0].bill_1000
     document.getElementById('coin500').value = clients.registerInfo[0].coin_500
     document.getElementById('coin100').value = clients.registerInfo[0].coin_100
     document.getElementById('coin50').value = clients.registerInfo[0].coin_50
     document.getElementById('coin10').value = clients.registerInfo[0].coin_10
     document.getElementById('coin5').value = clients.registerInfo[0].coin_5
     document.getElementById('coin1').value = clients.registerInfo[0].coin_1
     calculateTotal()
     document.getElementById('registerBtn').style.display='none'
     const inputs = document.querySelectorAll('#coins-mother-div input, #bill-mother-div input, #total-caixa-input input');
      // すべての input 要素に readonly を設定
      inputs.forEach(input => {
          input.setAttribute('readonly', true);
      });
   }else{
     document.getElementById('bill5000').value = ''
     document.getElementById('bill1000').value = ''
     document.getElementById('coin500').value = ''
     document.getElementById('coin100').value = ''
     document.getElementById('coin50').value = ''
     document.getElementById('coin10').value = ''
     document.getElementById('coin5').value = ''
     document.getElementById('coin1').value = ''
     document.getElementById('totalAmount').value = ''
             inputs.forEach(input => {
            input.removeAttribute('readonly');
        });
     document.getElementById('registerBtn').style.display='block'
   }
   if(clients.salesInfo){
    calculationSales()
   }

 }

 closeModal.onclick = function() {
   modal.style.display = "none";
 }

 window.onclick = function(event) {
   if (event.target == modal) {
     modal.style.display = "none";
   }
 }

 document.getElementById('calculation-again').addEventListener('click',()=>{
   calculationSales()
 })

 function calculationSales(){

   console.log('sales calculation')
   const otherSale = document.getElementById('notregister-by-money').value
   const otherSaleCard = document.getElementById('noregister-by-card').value

   document.getElementById('cashSales').innerText = `￥${clients.salesInfo.cash.total_amount.toLocaleString()}`
   document.getElementById('creditSales').innerText = `￥${clients.salesInfo.credit.total_amount.toLocaleString()}`
   document.getElementById('otherSales').innerText = `￥${clients.salesInfo.other.total_amount.toLocaleString()}`
   document.getElementById('sale-yet-register').innerText = `￥${clients.salesInfo.yet.total_amount.toLocaleString()}`

   let saldo = 0
   if(clients.registerInfo[0]){
     saldo = (clients.registerInfo[0].open_amount-0) + (clients.salesInfo.cash.total_amount-0) + (otherSale-0)
   }else{
     saldo = (clients.salesInfo.cash.total_amount-0) + (otherSale-0)
   }
   document.getElementById('totalBalance').innerText = `￥${saldo.toLocaleString()}`
   const totalSalesAmount = clients.salesInfo.cash.total_amount +
                         clients.salesInfo.credit.total_amount +
                         clients.salesInfo.other.total_amount +
                         clients.salesInfo.yet.total_amount;
   document.getElementById('total-vendas').value = `￥${((totalSalesAmount-0)+(otherSale-0)+(otherSaleCard-0)).toLocaleString()}`
 }

 // 合計金額を算出する関数
 function calculateTotal() {
   const bill5000 = parseInt(document.getElementById('bill5000').value) || 0;
   const bill1000 = parseInt(document.getElementById('bill1000').value) || 0;
   const coin500 = parseInt(document.getElementById('coin500').value) || 0;
   const coin100 = parseInt(document.getElementById('coin100').value) || 0;
   const coin50 = parseInt(document.getElementById('coin50').value) || 0;
   const coin10 = parseInt(document.getElementById('coin10').value) || 0;
   const coin5 = parseInt(document.getElementById('coin5').value) || 0;
   const coin1 = parseInt(document.getElementById('coin1').value) || 0;

   // 各金額を計算
   const total = (bill5000 * 5000) + (bill1000 * 1000) +
                 (coin500 * 500) + (coin100 * 100) + (coin50 * 50) +
                 (coin10 * 10) + (coin5 * 5) + (coin1 * 1);

   document.getElementById('totalAmount').value = '￥' + total.toLocaleString() ;
 }

 // 入力フィールドが変更されたら合計を再計算
 const inputs = document.querySelectorAll('#bill10000, #bill5000, #bill1000, #coin500, #coin100, #coin50, #coin10, #coin5, #coin1');
 inputs.forEach(input => {
   input.addEventListener('input', calculateTotal);
 });

 setInterval(() => {
    const closeButton = document.querySelector('.close');
    if (closeButton && getComputedStyle(closeButton).opacity === '0') {
        closeButton.style.opacity = '1';  // 強制的に再表示
    }
}, 500);  // 500ミリ秒ごとに確認

// async 関数で定義
async function getRegisters(id) {
    showLoadingPopup();
    const selectDay = caixaDate.value; // 選択された日付を取得
    const url = `${server}/orderskun/registers?date=${selectDay}&clientsId=${id}`;

    try {
        // await を fetch に追加し、fetch の完了を待つ
        const response = await fetch(url, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        });

        const data = await response.json();
        clients.registerInfo = data;
        registerFlug = true;

        if (clients.registerInfo.length === 0) {
          clients.registerInfo =''
            notRegisterInfo.style.display = "block";
        }

        hideLoadingPopup(); // ローディングを隠す
        return;
    } catch (error) {
        hideLoadingPopup();
        console.error('Error:', error);
    }
}

// イベントリスナー内のコード
caixaDate.addEventListener('change', async () => {
    await getRegisters(clients.id); // getRegisters の完了を待機
    await openCaixaModal(); // getRegisters 完了後に openCaixaModal を実行
});


document.getElementById('registerBtn').addEventListener('click', function() {
  const nowUTC = new Date();
  // 日本時間に変換 (UTC+9)
  const nowJST = new Date(nowUTC.getTime() + (9 * 60 * 60 * 1000));
  const registerDT = document.getElementById('registerDate').value
  const data = {
    user_id: clients.id,  // ユーザーIDを指定
    bill_5000: parseInt(document.getElementById('bill5000').value) || 0,
    bill_1000: parseInt(document.getElementById('bill1000').value) || 0,
    coin_500: parseInt(document.getElementById('coin500').value) || 0,
    coin_100: parseInt(document.getElementById('coin100').value) || 0,
    coin_50: parseInt(document.getElementById('coin50').value) || 0,
    coin_10: parseInt(document.getElementById('coin10').value) || 0,
    coin_1: parseInt(document.getElementById('coin1').value) || 0,
    open_time: nowJST.toISOString(),
    registerDT:registerDT
};
// 合計金額の計算
const totalAmount = (data.bill_5000 * 5000) +
                    (data.bill_1000 * 1000) +
                    (data.coin_500 * 500) +
                    (data.coin_100 * 100) +
                    (data.coin_50 * 50) +
                    (data.coin_10 * 10) +
                    (data.coin_1 * 1);

// 合計金額が0ならアラートを表示して処理を中断
if (totalAmount === 0) {
    alert('合計金額が0円です。正しい金額を入力してください。');
    return;
}
// 合計金額をオープン金額として追加
data.totalAmount = totalAmount;
// サーバーにデータを送信
showLoadingPopup()
fetch(`${server}/orderskun/registers/open`, {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json'
    },
    body: JSON.stringify(data)
})
.then(response => response.json())
.then(data => {
  hideLoadingPopup()
    console.log('レジオープン登録完了:', data);
})
.catch(error => {
  hideLoadingPopup()
    console.error('エラー:', error);
});
});

document.getElementById('closeRegisterBtn').addEventListener('click', function() {
  const nowUTC = new Date();
  // 日本時間に変換 (UTC+9)
  const nowJST = new Date(nowUTC.getTime() + (9 * 60 * 60 * 1000));

  const data = {
    user_id: 1,  // ユーザーIDを指定
    bill_5000: parseInt(document.getElementById('bill5000').value) || 0,
    bill_1000: parseInt(document.getElementById('bill1000').value) || 0,
    coin_500: parseInt(document.getElementById('coin500').value) || 0,
    coin_100: parseInt(document.getElementById('coin100').value) || 0,
    coin_50: parseInt(document.getElementById('coin50').value) || 0,
    coin_10: parseInt(document.getElementById('coin10').value) || 0,
    coin_1: parseInt(document.getElementById('coin1').value) || 0,
    open_time: nowJST.toISOString()
};
// 合計金額の計算
const totalAmount = (data.bill_5000 * 5000) +
                    (data.bill_1000 * 1000) +
                    (data.coin_500 * 500) +
                    (data.coin_100 * 100) +
                    (data.coin_50 * 50) +
                    (data.coin_10 * 10) +
                    (data.coin_1 * 1);

// 合計金額が0ならアラートを表示して処理を中断
if (totalAmount === 0) {
    alert('合計金額が0円です。正しい金額を入力してください。');
    return;
}
// 合計金額をオープン金額として追加
data.totalAmount = totalAmount;
// サーバーにデータを送信
showLoadingPopup()
fetch(`${server}/orderskun/registers/close`, {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json'
    },
    body: JSON.stringify(data)
})
.then(response => response.json())
.then(data => {
  alert('Registrado, bom descanço')
  modal.style.display = "none";
  hideLoadingPopup()
})
.catch(error => {
  hideLoadingPopup()
    console.error('エラー:', error);
});
});

async function nextDayfinshTimeGFet(){
  // 現在のUTC時間を取得
  const nowUTC = new Date();
  // 日本時間に変換 (UTC+9)
  const nowJST = new Date(nowUTC.getTime() + (9 * 60 * 60 * 1000));
  // 翌日の午前5時を設定
  const nextDay5AMJST = new Date(nowJST);
  nextDay5AMJST.setDate(nowJST.getDate() + 1);  // 翌日
  // 年・月・日・時刻をフォーマットして日本時間の文字列を作成
  const formattedDate = nextDay5AMJST.getFullYear() + '-' +
                        ('0' + (nextDay5AMJST.getMonth() + 1)).slice(-2) + '-' +
                        ('0' + nextDay5AMJST.getDate()).slice(-2) + 'T' +
                        ('0' + nextDay5AMJST.getHours()).slice(-2) + ':' +
                        ('0' + nextDay5AMJST.getMinutes()).slice(-2) + ':' +
                        ('0' + nextDay5AMJST.getSeconds()).slice(-2);
     console.log(formattedDate)
                        return formattedDate
}

async function getOrdersbyPickupTime() {
    showLoadingPopup();
    const startDate = `${salesStart.value}:00.000Z`;  // UTC指定のため'Z'を追加
    const endDate = `${salesFinish.value}:59.999Z`;   // 23:59:59を設定
    try {
        // `await` を `fetch` の前に追加
        const response = await fetch(`${server}/orderskun/pickup-time/range?startDate=${startDate}&endDate=${endDate}&user_id=${clients.id}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        });
        const data = await response.json();
        hideLoadingPopup();
        if (data.length > 0) {
            // 支払い方法ごとの合計金額を保存するオブジェクト
            const paymentSummary = {
                cash: { total_amount: 0, orders: [] },
                credit: { total_amount: 0, orders: [] },
                other: { total_amount: 0, orders: [] },
                yet: { total_amount: 0, orders: [] }
            };

            // データをループして、支払い方法ごとに合計金額を計算
            data.forEach(order => {
                const paymentMethod = order.payment_method;
                // 該当する支払い方法にオーダーを追加し、金額を加算
                if (paymentSummary[paymentMethod]) {
                    paymentSummary[paymentMethod].orders.push(order);
                    paymentSummary[paymentMethod].total_amount += parseFloat(order.total_amount);
                }
            });
            // 結果を `clients.salesInfo` に保存
            clients.salesInfo = paymentSummary;
            console.log(clients.salesInfo);
            // ここでデータをフロントエンドのUIに表示するロジックを実装
        } else {
            console.log('No orders found for the given pickup time');
        }
    } catch (error) {
        hideLoadingPopup();
        console.error('Error fetching orders by pickup time:', error);
    }
}


const inputField = document.getElementById('anotacoes');
// クリック時にサイズを拡張
inputField.addEventListener('focus', function() {
  inputField.classList.add('expanded');
});
// フォーカスが外れたら元のサイズに戻す
inputField.addEventListener('blur', function() {
  inputField.classList.remove('expanded');
});

document.getElementById('inserirMonys').addEventListener('click',()=>{
  if(selectFecharcaixa){
    selectFecharcaixa=false
  }else{
    selectFecharcaixa=true
  }
  if(selectFecharcaixa){
    document.getElementById('modal-left-input').style="background-color:#333;color:#fff"
    document.getElementById('inserirMonys').innerText = 'Voltar'
    // 2つのdiv内のすべての input 要素を取得
    const inputs = document.querySelectorAll('#coins-mother-div input, #bill-mother-div input, #total-caixa-input input');
    const title = document.getElementById('left-title-regist-casher')
    title.innerHTML = 'Insira as quantidades de notas e moedas do caixa'
    title.style="color:#FFF"
    // すべての input の value を 0 に設定
    inputs.forEach(input => {
        input.value = 0;
        input.removeAttribute('readonly'); // ここでreadonly属性を削除
    });
  }else{
    document.getElementById('modal-left-input').style="background-color:#fff"
    document.getElementById('inserirMonys').innerText = 'Inserir valores'
  }

})

caixaDate.addEventListener('change', async ()=>{
await getRegisters(clients.id)
await openCaixaModal()
})

serchSales.addEventListener('click', async()=>{
  await getOrdersbyPickupTime()
  calculationSales()
})
