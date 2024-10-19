// const token = window.localStorage.getItem('token');
// const decodedToken = jwt_decode(token); // jwtDecodeではなくjwt_decodeを使用
let selectOrders = ""
let registerFlug = false
const notRegisterInfo = document.getElementById('yet-regit-info')
// if (!decodedToken) {
//   // window.location.href = '../index.html';
// }
let clients ={
  id:17, //クライアントid
  language:'pt', //クライアント言語
  paytype:'',　//ユーザー支払い方法
  selectedOrder:"",　//選択オーダー
  printInfo:"",　//？？
  taxtType:"",　//税金区分
  registerInfo:"",
  salesInfo:""
}
let selectedCard = null;
let selectFecharcaixa = false

document.addEventListener('DOMContentLoaded', async  () => {
  console.log(clients.id)
  const loadingPopup = document.getElementById('loading-popup');
  //メニュー、カテゴリー、オープション表示
  const MainData = await makerequest(`${server}/orders/getBasedata?user_id=${clients.id}`)
  let pendingOrders = await fetchPendingOrders(clients.id);
  const registerData = await getRegisters(clients.id);
   await getOrdersbyPickupTime()


  // if(clients.registe)
  console.log(pendingOrders)
  if(pendingOrders.length===0){
    loadingPopup.style="display:none"
    showCustomAlert('não tem pedido pendente')
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
      if (tableDisplay == "9999") {
          tableDisplay = `Take out<br>${order.order_name}`;
      } else if (tableDisplay == "9998") {
          tableDisplay = `Uber<br>${order.order_name}`;
      }else{
        tableDisplay =`Mesa:${tableDisplay}<br> *${order.order_name}`
      }
      if(order.order_status==='pending'){
        status="Em preparo"
        styleColer='background-color:#FFCCCB'
        icon='<img src="../imagen/pending.jpg">'
      }else if(order.order_status==='prepared'){
        icon='<img src="../imagen/prepared.jpg">'
      }
      console.log(order.payment_method)
      if(order.payment_method!="yet"){
        console.log('paystatusin')
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
          console.log(selectOrders)
      });
      ordersList.appendChild(orderCard);
       loadingPopup.style="display:none"
  });

  function displayOrderDetails(order) {
      console.log(order.OrderItems);
      clients.printInfo = order;
      orderItems.innerHTML = ''; // Clear previous items
      clients.selectedOrder = order.id;
      console.log(order);

      // レシート用のデータを準備
      let receiptData = {
          items: [],
          totalAmount: 0,
          order_id:order.id,
          nomedaComanda:order.order_name
      };

      selectOrders.OrderItems.forEach(item => {
          // メニュー名を取得
          const menuGt = MainData.menus.find(menu => menu.id === item.menu_id);
          if (menuGt) {
              item.menu_name = menuGt.menu_name_pt; // ポルトガル語のメニュー名を追加
          } else {
              item.menu_name = "不明なメニュー"; // メニューが見つからない場合のデフォルト値
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
      selectOrders.OrderItems.forEach(item => {
          let li = document.createElement('li');
          li.innerHTML = `
              ${item.menu_name} x${item.quantity} - ¥${parseInt(item.total_price).toLocaleString()}
              <br>
              ${item.option_names}
          `;
          orderItems.appendChild(li);
      });

      // 合計金額を表示
      totalAmountElement.textContent = `￥${Math.floor(receiptData.totalAmount).toLocaleString()}`;
        document.getElementById('tax-included-amount').textContent =`￥${Math.floor(receiptData.totalAmount).toLocaleString()}`
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

});


async function registeConfirm(){
  const loadingPopup = document.getElementById('loading-popup');

  if (!clients.selectedOrder) {
      alert('Seleciona uma comanda');
      return;
  }
  // if(clients.taxtType===""){
  //   alert("Selecione o imposto")
  //   return
  // }
  if(clients.depositAmount===""){
    alert("Insira o vlor recebido")
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
  console.log(clients.selectedOrder)
  // Update the order in the database
  try {

    loadingPopup.style="display:block"
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
           console.log(clients.selectedOrder)
          // Remove the order card from the UI
          const orderCard = document.querySelector(`.selected-card[data-id="${clients.selectedOrder}"]`);
         console.log('Found Order Card:', orderCard);
          if (orderCard) {
              // orderCard.remove();
          }
          // Optionally, you can clear the order details or reset the UI
          clearOrderDetails();
      } else {
          alert('Erro no registro.');
      }
  } catch (error) {
      console.error('Error confirming payment:', error);
      alert('Erro no registro.');
  }
  loadingPopup.style="display:none"
}

async function entregueConfirm(){

  const loadingPopup = document.getElementById('loading-popup');
  // Update the order in the database
  try {

    loadingPopup.style="display:block"
      const response = await fetch(`${server}/orderskun/updateConfirmd`, {
          method: 'POST',
          headers: {
              'Content-Type': 'application/json'
          },
          body: JSON.stringify({
              order_id: clients.selectedOrder,
              order_status: 'confirmed'  // Update the status to 'confirmed'
          })
      });
      console.log(response.status)

      if (response.status===200) {
          showCustomAlert("Registrado")
           console.log(clients.selectedOrder)
          // Remove the order card from the UI
          const orderCard = document.querySelector(`.selected-card[data-id="${clients.selectedOrder}"]`);
         console.log('Found Order Card:', orderCard);
          if (orderCard) {
              orderCard.remove();
          }
          // Optionally, you can clear the order details or reset the UI
          clearOrderDetails();
      } else {
          alert('Erro no registro.');
      }
  } catch (error) {
      console.error('Error confirming payment:', error);
      alert('Erro no registro.');
  }
  loadingPopup.style="display:none"
}

// Function to clear the order details from the UI
function clearOrderDetails() {
    document.getElementById('order-items').innerHTML = '';
    document.getElementById('total-amount').textContent = '0';
    document.getElementById('deposit-amount').value = '0';
    document.getElementById('change-amount').textContent = '0';
    document.getElementById('tax-included-amount').textContent = '0'
    clients.paytype = '';  // Reset the payment method
    clients.depositAmount=""
    selectedOrder = null;  // Reset the selected order
    clients.selectedOrder =""
    clients.taxtType=""
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
        applyTax(8);
        selectTaxButton('tax-8');
        clients.taxtType = 8;
        // updateChangeAmount();
    });

    document.getElementById('tax-10').addEventListener('click', function() {
        applyTax(10);
        selectTaxButton('tax-10');
        clients.taxtType = 10;
        // updateChangeAmount();
    });
});

// selectTaxButton関数を修正
function selectTaxButton(selectedButtonId) {
    // すべての税ボタンから active-tax クラスを削除
    const taxButtons = document.querySelectorAll('.tax-button');
    taxButtons.forEach(button => {
        button.classList.remove('active-tax');
        console.log(`Removed active-tax from ${button.id}`); // 削除の確認用
    });

    // クリックされたボタンに active-tax クラスを追加
    const selectedButton = document.getElementById(selectedButtonId);
    if (selectedButton) {
        selectedButton.classList.add('active-tax');
        console.log(`Added active-tax to ${selectedButtonId}`); // 追加の確認用
    }
}


let originalAmount = null; // 元の金額を保存する変数






// 既存の applyTax 関数
function applyTax(taxRate) {
    const totalAmountElement = document.getElementById('total-amount');

    if (!originalAmount) {
        // ￥記号とカンマ、ピリオドを削除して数値に変換
        const totalAmountText = totalAmountElement.textContent.replace(/[￥,.\s]/g, '');
        originalAmount = parseFloat(totalAmountText);

        console.log("Original Amount (after removing symbols):", originalAmount); // デバッグ用
    }

    // 税額を計算
    const taxAmount = originalAmount * (taxRate / 100);
    const totalWithTax = Math.floor(originalAmount + taxAmount);

    // 手動でカンマ区切りを適用
    const finalFormattedTotalWithTax = totalWithTax.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');

    // // 整数値を表示
    // document.getElementById('tax-included-amount').textContent = `¥${finalFormattedTotalWithTax}`;
    // 整数値を表示
    document.getElementById('tax-included-amount').textContent = `${totalAmountElement.textContent}`;
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
  console.log('kokokni')
  recite();
});



document.getElementById('delete-order').addEventListener('click', () => {
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
        } else {
            return response.json().then(data => {
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
  // if(clients.taxtType===""){
  //   alert("Selecione o imposto")
  //   return
  // }
  if(clients.depositAmount===""){
    alert("Insira o vlor recebido")
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

  const troco = document.getElementById('change-amount').innerText
  const recebido = document.getElementById('deposit-amount').value
  const valorcomTax = document.getElementById('tax-included-amount').innerText

let row = `<div id="contentToPrint" class="print-content">
  <div class="img-dicvs"><img src="../imagen/logo.png" width="100" class="setting-right-button" /></div>
  <div class="adress-div">
    <p>Roots Grill <br>〒475-0801 <br>愛知県碧南市相生町4-13 102号室<br>070-9166-0218</p>
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

  </div>
  <div class="dotted-line"></div>
  <div class="total-amount-div">
    <div>合計</div>
    <div>￥${clients.receiptData.totalAmount.toLocaleString()}</div>
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


// <div class="azukari-amount-div">
//   <div>外税</div>
//   <div>15%</div>
//   <div>￥40</div>
// </div>
//var printWindow = window.open('', '_blank');

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
await new Promise(resolve => {
  var img = new Image();
  img.onload = resolve;
  img.src = "../imagen/logo.png";
});

// 印刷を実行
printWindow.print();

// 印刷が完了したらウィンドウを閉じる
printWindow.close();

// registeConfirm() を呼び出す
await registeConfirm();

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
          <div class="img-dicvs"><img src="../imagen/logo.png" width="100" class="setting-right-button" /></div>
          <div class="adress-div">
            <p>Roots Grill <br>〒475-0801 <br>愛知県碧南市相生町4-13 102号室</p>
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
        await new Promise(resolve => {
          var img = new Image();
          img.onload = resolve;
          img.src = "../imagen/logo.png";
        });

        // 印刷を実行
        printWindow.print();

        // 印刷が完了したらウィンドウを閉じる
        printWindow.close();

        }

     document.getElementById('print-invoice').addEventListener('click',ryousyuso)
        async function ryousyuso() {
          if (!clients.receiptData) {
              console.log("レシートデータがありません。");
              return;
          }

          if (!clients.selectedOrder) {
              alert('Seleciona uma comanda');
              return;
          }
          // if(clients.taxtType===""){
          //   alert("Selecione o imposto")
          //   return
          // }
          if(clients.depositAmount===""){
            alert("Insira o vlor recebido")
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

          const troco = document.getElementById('change-amount').innerText
          const recebido = document.getElementById('deposit-amount').value
          const valorcomTax = document.getElementById('tax-included-amount').innerText
        let row = `

          <div class="adress-div">
            <div class="titles-ryousyu">領 収 証</div>
            <div class="dotted-line">　　　　　　　　　　様</div>
            <div class="dotted-line">￥${clients.receiptData.totalAmount.toLocaleString()}-</div>
            <div class="coments-div">上記正に領収しました</div>

            <div class="coments-div">Roots Grill〒475-0801愛知県碧南市相生町4-13 102号室</div>
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
          <div class="total-amount-div">
            <div>合計</div>
            <div>￥${clients.receiptData.totalAmount.toLocaleString()}</div>
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

        // registeConfirm() を呼び出す
        await registeConfirm();

        }

        // 日付を今日の日付に設定
 document.getElementById("registerDate").valueAsDate = new Date();
 // モーダルを表示/非表示にするロジック
 const modal = document.getElementById("registerModal");
 const openModalBtn = document.getElementById("openModalBtn");
 const closeModal = document.getElementsByClassName("close")[0];

 openModalBtn.onclick = function() {
   modal.style.display = "block";
   console.log('open')
   console.log(clients.registerInfo)
   if(registerFlug){
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
     const inputs = document.querySelectorAll('#modal-left-input input');

      // すべての input 要素に readonly を設定
      inputs.forEach(input => {
          input.setAttribute('readonly', true);
      });
 console.log(clients)
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
   const otherSale = document.getElementById('notregister-by-money').value
   const otherSaleCard = document.getElementById('noregister-by-card').value

   document.getElementById('cashSales').innerText = `￥${clients.salesInfo.cash.total_amount.toLocaleString()}`
   document.getElementById('creditSales').innerText = `￥${clients.salesInfo.credit.total_amount.toLocaleString()}`
   document.getElementById('otherSales').innerText = `￥${clients.salesInfo.other.total_amount.toLocaleString()}`
   document.getElementById('sale-yet-register').innerText = `￥${clients.salesInfo.yet.total_amount.toLocaleString()}`
   const saldo = (clients.registerInfo[0].open_amount-0) + (clients.salesInfo.cash.total_amount-0) + (otherSale-0)
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

async function getRegisters(id){

  // クエリパラメータとして日付を日本時間で送信
  const url = `${server}/orderskun/registers?date=${encodeURIComponent(await nextDayfinshTimeGFet())}&clientsId=${id}`;
  fetch(url, {
      method: 'GET',
      headers: {
          'Content-Type': 'application/json'
      }
  })
  .then(response => response.json())
  .then(data => {
    console.log(data)
      clients.registerInfo = data
      registerFlug = true
      if(clients.registerInfo.length===0){
        notRegisterInfo.style.display="block"
      }
  })
  .catch(error => {
      console.error('Error:', error);
  });

}

document.getElementById('registerBtn').addEventListener('click', function() {
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
    open_time: nowJST.toISOString(),
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
fetch(`${server}/orderskun/registers/open`, {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json'
    },
    body: JSON.stringify(data)
})
.then(response => response.json())
.then(data => {
    console.log('レジオープン登録完了:', data);
})
.catch(error => {
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
    open_time: nowJST.toISOString(),
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
    console.log('レジオープン登録完了:', data);
})
.catch(error => {
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
  nextDay5AMJST.setHours(5, 0, 0, 0);  // 午前5時

  // 年・月・日・時刻をフォーマットして日本時間の文字列を作成
  const formattedDate = nextDay5AMJST.getFullYear() + '-' +
                        ('0' + (nextDay5AMJST.getMonth() + 1)).slice(-2) + '-' +
                        ('0' + nextDay5AMJST.getDate()).slice(-2) + 'T' +
                        ('0' + nextDay5AMJST.getHours()).slice(-2) + ':' +
                        ('0' + nextDay5AMJST.getMinutes()).slice(-2) + ':' +
                        ('0' + nextDay5AMJST.getSeconds()).slice(-2);

                        return formattedDate
}

async function getOrdersbyPickupTime(){
// サーバーへのリクエスト
fetch(`${server}/orderskun/pickup-time?pickupTime=${encodeURIComponent(await nextDayfinshTimeGFet())}&clientsId=${clients.id}`, {
    method: 'GET',
    headers: {
        'Content-Type': 'application/json'
    }
})
.then(response => response.json())
.then(data => {
    if (data.length > 0) {
        console.log('Orders found:', data);
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
                paymentSummary[paymentMethod].total_amount += parseFloat(order.total_amount);  // 合計金額を加算
            }
        });
        // console.log(paymentSummary)
        clients.salesInfo = paymentSummary
        // console.log(clients)
        // ここでデータをフロントエンドのUIに表示するロジックを実装
    } else {
        console.log('No orders found for the given pickup time');
    }
})
.catch(error => {
    console.error('Error fetching orders by pickup time:', error);
});

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
