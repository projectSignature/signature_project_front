
let clients ={
  id:1, //クライアントid
  language:'pt', //クライアント言語
  paytype:'',　//ユーザー支払い方法
  selectedOrder:"",　//選択オーダー
  printInfo:"",　//？？
  taxtType:""　//税金区分
}

let selectedCard = null;

document.addEventListener('DOMContentLoaded', async  () => {
  //メニュー、カテゴリー、オープション表示
  const MainData = await makerequest(`${server}/orders/getBasedata?user_id=${clients.id}`)
  let pendingOrders = await fetchPendingOrders(clients.id);
  let ordersList = document.getElementById('orders-list');//未支払い枠エレメント
  let orderItems = document.getElementById('order-items');//詳細枠エレメント
  let totalAmountElement = document.getElementById('total-amount');//支払い総額エレメント
  let depositAmountElement = document.getElementById('deposit-amount');//預入金額エレメント
  let changeAmountElement = document.getElementById('change-amount');//お釣りエレメント
  let taxIncluidAmountElent = document.getElementById('tax-included-amount');//税金込み総額エレメント
　　//未支払いオーダーカードを作成
    pendingOrders.forEach(order => {
      let orderCard = document.createElement('div');
      orderCard.classList.add('order-card');
      orderCard.setAttribute('data-id', order.id); // data-id 属性を設定
      orderCard.id = order.id
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
  console.log(order.OrderItems);
  clients.printInfo = order;
  orderItems.innerHTML = ''; // Clear previous items
  clients.selectedOrder = order.id;

  order.OrderItems.forEach(item => {
      const menuGt = MainData.menus
          .filter(items => items.id === item.menu_id);

      let disOption = ""; // オプションを格納する変数
      const options = JSON.parse(item.options);

      options.forEach(option => {
          const optionGt = MainData.options
              .filter(itm => itm.id === parseInt(option.id));
          if (optionGt.length > 0) {
              disOption += `<p>${optionGt[0].option_name_pt}</p>`;
          }
      });

      let li = document.createElement('li');
      li.innerHTML = `
          ${menuGt[0].menu_name_pt} x${item.quantity} - ¥${parseInt(item.item_price).toLocaleString()}
          ${disOption}
      `;
      orderItems.appendChild(li);
  });

  totalAmountElement.textContent = `￥${Math.floor(order.total_amount).toLocaleString()}`;
  updateChange(); // Initial calculation
}




    depositAmountElement.addEventListener('input', updateChange);

    function updateChange() {
      if(clients.taxtType!=""){
        let deposit = parseInt(depositAmountElement.value) || 0;
        let total = parseInt(document.getElementById("tax-included-amount").textContent.replace(/[^\d]/g, '')) || 0;;
        let change = deposit - total;
        changeAmountElement.textContent = change >= 0 ? `¥${change.toLocaleString()}` : 0;
      }
    }
    // Confirm Payment Button Logic
    document.getElementById('confirm-payment').addEventListener('click', async () => {
    // Assuming you have a selectedOrder variable that stores the current order
    if (!clients.selectedOrder) {
        alert('Seleciona uma comanda');
        return;
    }
    if(clients.taxtType===""){
      alert("Selecione o imposto")
      return
    }
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
    clients.depositAmount=""
    selectedOrder = null;  // Reset the selected order
    clients.selectedOrder =""
    clients.taxtType=""
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
        clients.taxtType=8
        let deposit = document.getElementById('deposit-amount').value;
        let total = parseInt(document.getElementById("tax-included-amount").textContent.replace(/[^\d]/g, '')) || 0;;
        let change = deposit - total;

        document.getElementById('change-amount').textContent = change >= 0 ? `¥${change.toLocaleString()}` : 0;
    });

    document.getElementById('tax-10').addEventListener('click', function() {
        applyTax(10);
        selectTaxButton('tax-10');
        clients.taxtType=10
        let deposit = document.getElementById('deposit-amount').value;
        let total = parseInt(document.getElementById("tax-included-amount").textContent.replace(/[^\d]/g, '')) || 0;;
        let change = deposit - total;
        console.log(change)
        document.getElementById('change-amount').textContent = change >= 0 ? `¥${change.toLocaleString()}` : 0;
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

    // 整数値を表示
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
  console.log('kokokni')
  recite();
});

async function recite() {
  try{
    const order = clients.printInfo
    // const order = clients.printInfo || {};
     console.log(order);
   // お預かり金額とお釣りの設定
   order.depositAmount = document.getElementById('deposit-amount').value;
   order.changeAmount = document.getElementById('change-amount').textContent;


   // 税込み価格の設定
   order.taxIncludedAmount = document.getElementById('tax-included-amount').textContent;
   order.taxtTypes = clients.taxtType
   // order オブジェクトをコンソールに表示
   console.log(order);
   if(clients.taxtTypes===""){
     alert("Selecione o imposto")
     return
   }
   if(order.depositAmount===""||order.depositAmount-0===0){
     alert("Insira o vlor recebido")
     return
   }
    const response = await fetch(`http://localhost:3000/orders/PrintRecite`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            order
        })
    });
  }catch(e){
    console.log(e)
  }
}

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
    fetch(`${server}/orders/delete/${selectedOrderId}`, {
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
  console.log(orderId)
    const orderElement = document.getElementById(`${orderId}`);
    if (orderElement) {
        orderElement.remove(); // 画面から削除
    }
}
