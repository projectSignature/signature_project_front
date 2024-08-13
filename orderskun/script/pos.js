
let clients ={
  id:1,
  language:'pt',
  paytype:'',
  selectedOrder:"",
  printInfo:""
}

let selectedCard = null;

document.addEventListener('DOMContentLoaded', async  () => {
    // Simulated data fetch
    const MainData = await makerequest(`${server}/orders/getBasedata?user_id=${clients.id}`)
    let pendingOrders = await fetchPendingOrders(clients.id);
    console.log(pendingOrders)


    let ordersList = document.getElementById('orders-list');
    let orderItems = document.getElementById('order-items');
    let totalAmountElement = document.getElementById('total-amount');
    let depositAmountElement = document.getElementById('deposit-amount');
    let changeAmountElement = document.getElementById('change-amount');



    pendingOrders.forEach(order => {
      console.log(order.id)
      let orderCard = document.createElement('div');
      orderCard.classList.add('order-card');
      orderCard.setAttribute('data-id', order.id); // data-id 属性を設定
      orderCard.innerHTML = `<h3>Table ${order.table_no}</h3><p>${order.order_name}</p>`;

      orderCard.addEventListener('click', () => {
          if (selectedCard) {
              selectedCard.classList.remove('selected-card');
          }

          orderCard.classList.add('selected-card');
          selectedCard = orderCard;

          displayOrderDetails(order);
      });

      ordersList.appendChild(orderCard);
  });

    function displayOrderDetails(order) {
      console.log(order)
      clients.printInfo = order
        orderItems.innerHTML = ''; // Clear previous items
        clients.selectedOrder = order.id


        order.OrderItems.forEach(item => {
          const menuGt = MainData.menus
              .filter(items => items.id === item.menu_id)
              console.log(item)
              console.log(menuGt)
            let li = document.createElement('li');
            li.textContent = `${menuGt[0].menu_name_pt} x${item.quantity} - ¥${item.item_price * item.quantity}`;
            orderItems.appendChild(li);
        });

        totalAmountElement.textContent = `￥${Math.floor(order.total_amount).toLocaleString()}`;
        updateChange(); // Initial calculation
    }

    depositAmountElement.addEventListener('input', updateChange);

    function updateChange() {
        let deposit = parseInt(depositAmountElement.value) || 0;
        let total = parseInt(document.getElementById("tax-included-amount").textContent.replace(/[^\d]/g, '')) || 0;;
        let change = deposit - total;
        changeAmountElement.textContent = change >= 0 ? change : 0;
    }

    // Confirm Payment Button Logic
    document.getElementById('confirm-payment').addEventListener('click', async () => {
    // Assuming you have a selectedOrder variable that stores the current order
    if (!clients.selectedOrder) {
        alert('Seleciona uma comanda');
        return;
    }
     console.log('clients:')
     console.log(clients)
    // Update the order in the database
    try {
        const response = await fetch(`${server}/orders/updatePayment`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                order_id: clients.selectedOrder,
                payment_method: clients.paytype,  // The selected payment method from clients object
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
});

function showCustomAlert(message) {
    const alertBox = document.getElementById('custom-alert');
    alertBox.querySelector('p').textContent = message;
    alertBox.style.display = 'block';

    setTimeout(() => {
        alertBox.style.display = 'none';
    }, 1000); // 1秒間表示
}

// Function to clear the order details from the UI
function clearOrderDetails() {
    document.getElementById('order-items').innerHTML = '';
    document.getElementById('total-amount').textContent = '0';
    document.getElementById('deposit-amount').value = '0';
    document.getElementById('change-amount').textContent = '0';
    document.getElementById('tax-included-amount').textContent = '0'
    clients.paytype = '';  // Reset the payment method
    selectedOrder = null;  // Reset the selected order
    clients.selectedOrder =""
}


    const cashPaymentButton = document.getElementById('cash-payment');
        const creditPaymentButton = document.getElementById('credit-payment');
        const otherPaymentButton = document.getElementById('other-payment');

        const paymentButtons = [cashPaymentButton, creditPaymentButton, otherPaymentButton];

        // Update the paytype in the clients object
        function updatePayType(type) {
            clients.paytype = type;
            console.log(`Payment type selected: ${clients.paytype}`);
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


async function fetchPendingOrders() {
    try {
        const response = await fetch(`${server}/orders/pending`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ client_id: clients.id })
        });
        if (!response.ok) {
            throw new Error('Failed to fetch pending orders');
        }
        const pendingOrders = await response.json();
        console.log('Pending Orders:', pendingOrders);
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
    });

    document.getElementById('tax-10').addEventListener('click', function() {
        applyTax(10);
        selectTaxButton('tax-10');
    });
});

let originalAmount = null; // 元の金額を保存する変数

function selectTaxButton(selectedButtonId) {
    // すべての税ボタンから active-tax クラスを削除
    const taxButtons = document.querySelectorAll('.tax-button');
    taxButtons.forEach(button => {
        button.classList.remove('active-tax');
        console.log('Removed active-tax from', button.id); // クラス削除の確認用
    });

    // クリックされたボタンに active-tax クラスを追加
    const selectedButton = document.getElementById(selectedButtonId);
    selectedButton.classList.add('active-tax');
    console.log('Added active-tax to', selectedButtonId); // クラス追加の確認用
}

// 既存の applyTax 関数
function applyTax(taxRate) {
    const totalAmountElement = document.getElementById('total-amount');

    if (!originalAmount) {
        const totalAmountText = totalAmountElement.textContent.replace(/[^\d.-]/g, '');
        originalAmount = parseFloat(totalAmountText);
    }

    // 税込み金額を計算（四捨五入しないように処理）
    const taxAmount = originalAmount * (taxRate / 100);
    const totalWithTax = (Math.round((originalAmount + taxAmount) * 100) / 100).toFixed(2);

    // カンマ区切りを適用
    const finalFormattedTotalWithTax = totalWithTax.replace(/\B(?=(\d{3})+(?!\d))/g, ',');

    // 手動で通貨記号を追加して表示
    document.getElementById('tax-included-amount').textContent = `¥${finalFormattedTotalWithTax}`;
}




// 税率が適用される前の状態に戻すためのリセット関数
function resetOriginalAmount() {
    const totalAmountElement = document.getElementById('total-amount');
    totalAmountElement.textContent = originalAmount.toLocaleString('ja-JP', { style: 'currency', currency: 'JPY' });
    originalAmount = null; // 初期化
}





document.getElementById('menu-btn').addEventListener('click', () => {
    // Handle menu button click
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

document.getElementById('print-receipt').addEventListener('click', () => {
  recite();
});

async function recite() {
  const order = clients.printInfo

  let reciteOrders = "";
    order.OrderItems.forEach(item => {
      reciteOrders += `
        <div class="items-name">[id:${item.id}] ${item.menu_id}</div>
        <div class="details-iten">@${item.item_price} * ${item.quantity}ｺ ￥${(item.total_price - 0).toLocaleString('ja-JP')}</div>`;
    });

    const currentDate = new Date().toLocaleString('ja-JP');

    let htmlContent = `
      <div id="contentToPrint" class="print-content">
        <div class="img-dicvs"><img src="../imagen/logo.png" width="100" class="setting-right-button" /></div>
        <div class="adress-div">
          <p>Buonissimo<br>〒475-0801 <br>愛知県西尾市吉良町富好新田井戸東39<br>090-1749-2810</p>
        </div>
        <div class='display-center-div'>
          <p>${currentDate} テーブル番号: ${order.table_no}</p>
          <p>オーダー名: ${order.order_name}</p>
        </div>
        <div class="contents-div">
          ${reciteOrders}
        </div>
        <div class="total-qt">
          <p>御買上げ点数　　:${order.OrderItems.length}</p>
        </div>
        <div class="dotted-line"></div>
        <div class="total-amount-div">
          <div>合計</div>
          <div>￥${(order.total_amount - 0).toLocaleString('ja-JP')}</div>
        </div>
        <div class="azukari-amount-div">
          <div>お預り</div>
          <div>￥${(document.getElementById('deposit-amount').value - 0).toLocaleString('ja-JP')}</div>
        </div>
        <div class="azukari-amount-div">
          <div>お釣り</div>
          <div>￥${(document.getElementById('change-amount').innerText - 0).toLocaleString('ja-JP')}</div>
        </div>
        <div class="dotted-line"></div>
      </div>`;

    // サーバーにHTMLを送信
    const response = await fetch('http://localhost:3000/printRecite', {
      method: 'POST',
      headers: {
        'Content-Type': 'text/html'
      },
      body: htmlContent
    });

    const result = await response.text();
    console.log(result);
}




// let trcs = document.getElementById('troco').value;
// let pgs = document.getElementById('pagoss').value;
// aftTroco =parseFloat(trcs.replace(/[^\d.-]/g, ''))
//
// if (aftTroco >= 0) {
// let localInfo = JSON.parse(localStorage.getItem("productsDetails"));
// const totalQuantidade = localInfo.reduce((accumulator, currentItem) => {
// return accumulator + currentItem.Quantidade;
// }, 0);
//
// let reciteOrders = "";
// for (let i = 0; i < localInfo.length; i++) {
//   reciteOrders += `<div class="items-name">[id:${localInfo[i].id}]  ${localInfo[i].Item}</div>
//     <div class="details-iten">@${localInfo[i].Preco}  *  ${localInfo[i].Quantidade}ｺ　  ￥${(localInfo[i].Total-0).toLocaleString('ja-JP')}</div>`;
// }
//
// let row = `<div id="contentToPrint" class="print-content">
//   <div class="img-dicvs"><img src="../img/logo.png" width="100" class="setting-right-button" /></div>
//   <div class="adress-div">
//     <p>Roots Grill <br>〒475-0801 <br>愛知県碧南市相生町4-13 102号室<br>070-9166-0218</p>
//   </div>
//   <div class='display-center-div'>
//     <p>${await getCurrentDateTime()} ${nb.split('_')[0]}</p>
//   </div>
//   <div class="contents-div">
//     ${reciteOrders}
//   </div>
//   <div class="total-qt">
//     <p>御買上げ点数　　:${totalQuantidade}</p>
//   </div>
//   <div class="dotted-line"></div>
//   <div class="total-amount-div">
//     <div>合計</div>
//     <div>${reciteAmount}</div>
//   </div>
//   <div class="azukari-amount-div">
//     <div>お預り</div>
//     <div>￥${(pgs-0).toLocaleString('ja-JP')}</div>
//   </div>
//   <div class="azukari-amount-div">
//     <div>お釣り</div>
//     <div>${trcs}</div>
//   </div>
//   <div class="dotted-line"></div>
// </div>`;
//
//
// //var printWindow = window.open('', '_blank');
//
// // 新しいウィンドウにコンテンツを書き込む
// document.write(
//  `
//   <html>
//   <head>
//     <title id="title-print"></title>
//     <style>
//     @media print {
//       #body-testes {
//         width:80mm;
//         height:100mm !important;
//         margin: 0; /* マージンをゼロに設定 */
//         padding: 0; /* パディングをゼロに設定 */;
//
//         overflow:hiden;
//         background-color:red !important
//       }
//       .adress-div {
//         width: 100%;
//         height: 7rem;
//         background-color: black;
//         -webkit-print-color-adjust: exact;
//         color: white;
//       }
//       .img-dicvs {
//         display: flex;
//         justify-content: center;
//       }
//       .display-center-div {
//         display: flex;
//         justify-content: center;
//       }
//       .contents-div {
//         width: 100%;
//       }
//       .items-name {
//         text-align: left;
//       }
//       .details-iten {
//         width: 80%;
//         text-align: right;
//         margin-right: 1rem;
//       }
//       .dotted-line::before {
//         content: '';
//         display: block;
//         width: 100%;
//         height: 1px;
//         background-color: black;
//         background-image: repeating-linear-gradient(90deg, black, black 2px, transparent 2px, transparent 4px);
//         -webkit-print-color-adjust: exact;
//       }
//       .total-amount-div {
//         width: 100%;
//         display: flex;
//         justify-content: space-between;
//         font-size: 3vh;
//       }
//       .azukari-amount-div {
//         width: 100%;
//         display: flex;
//         justify-content: space-between;
//       }
//       .total-qt{
//         margin-top:1rem
//       }
//     }
//     </style>
//   </head>
//   <body id="body-testes">
//     ${row}
//   </body>
//   </html>
// `
// );
//
// //  画像が正しく読み込まれるまで待機
// await new Promise(resolve => {
//   var img = new Image();
//   img.onload = resolve;
//   img.src = "../img/logo.png"; // 画像のパスを正確に指定
// });
//
//
// window.print();
// payed(nb.split("_")[0])
// document.location.reload();
// // htmls= `<div>省略</div>`
//
// //   let url = `http://localhost:3089/printsdata`
// //   body = {
// //     dt:htmls,
// //     // status:1
// //   }
// // const reqInsert = await makerequestStatus(url,body)
// // //await console.log(reqInsert.status)
// // if(reqInsert.status==200){
// //   await   window.location.reload();
// // }
// }

// }
