// const token = window.localStorage.getItem('token');
// // const decodedToken = jwt_decode(token); // jwtDecodeではなくjwt_decodeを使用
//
//
// // if (!decodedToken) {
// //   // window.location.href = '../index.html';
// }

let clients ={
  id:17, //クライアントid
  language:'pt', //クライアント言語
  paytype:'',　//ユーザー支払い方法
  selectedOrder:"",　//選択オーダー
  printInfo:"",　//？？
  taxtType:""　//税金区分
}

let selectedCard = null;

document.addEventListener('DOMContentLoaded', async  () => {
  console.log(clients.id)
  //メニュー、カテゴリー、オープション表示
  const loadingPopup = document.getElementById('loading-popup');
  loadingPopup.style.display = 'block'; // ポップアップを表示
  const MainData = await makerequest(`${server}/orders/getBasedata?user_id=${clients.id}`)
  let pendingOrders = await fetchPendingOrders(clients.id);
  const orderContainer = document.getElementById('order-list');
  console.log(pendingOrders)
  console.log(MainData)

pendingOrders.forEach(order => {
  console.log(pendingOrders)
  playAlarmIfEnabled(order.alarm_enabled,order.id)
  // let alarmFlug = pendingOrders.alarm_enabled

  let tableDisplay = order.table_no;
if (tableDisplay == "9999") {
    tableDisplay = "Takeout";
} else if (tableDisplay == "9998") {
    tableDisplay = "Uber Eats";
}else{
  tableDisplay =`Mesa:${tableDisplay} *${order.order_name}`
}

const orderCard = document.createElement('div');
orderCard.classList.add('order-card');

orderCard.innerHTML = `
    <h3>${tableDisplay}</h3>
    <p>Total Amount: ${formatPrice(order.total_amount)}</p>
    <div class="order-items"></div>
`;

const orderItemsContainer = orderCard.querySelector('.order-items');

order.OrderItems.forEach(item => {
        const menuItemName = MainData.menus.filter(items => items.id === item.menu_id);
        const options = JSON.parse(item.options).map(opt => {
                const optionName = getOptionNameById(opt.id);  // opt.idからオプション名を取得
                return `${optionName}`;
            }).join(', ');

                    const itemElement = document.createElement('div');
                    itemElement.classList.add('order-item');

                    const statusClass = item.serve_status === 'pending' ? 'pending' : 'served';
                    const statusText = item.serve_status === 'pending' ? '✕' : '〇';

                    itemElement.innerHTML = `
                    <div class="left-div">
                     <div class="item-name-div">${menuItemName[0].admin_item_name}</div>
                     <div class="option-div">
                      <span>${options.length > 0 ? options : ''}</span>
                     </div>
                     </div>
                    <div class="right-div">
                     <div class="serve-status ${statusClass}"  data-item-id="${item.id}">${statusText}</div>
                    </div>
                        <!-- <strong>${menuItemName[0].menu_name_pt} x ${item.quantity}</strong><br> -->


                    `;

                    orderItemsContainer.appendChild(itemElement);
                });

                // カードをスライダー内に追加
                orderContainer.appendChild(orderCard);
                loadingPopup.style.display = 'none'; // リクエスト完了後にポップアップを非表示
            });
            // 金額フォーマットの関数
            function formatPrice(amount) {
                return `¥${parseFloat(amount).toLocaleString()}`;
            }

            function getOptionNameById(optionId) {
              console.log(optionId)
              console.log(MainData.options)
                const optionDetail = MainData.options.find(option => option.id-0 === optionId-0);
                console.log(optionDetail)
                return optionDetail ? optionDetail.option_name_pt : '不明なオプション'; // オプション名が見つからない場合は '不明なオプション' を表示
            }

            // .serve-status がクリックされたときにイベントを発生させる
document.querySelectorAll('.serve-status').forEach(statusDiv => {
    statusDiv.addEventListener('click', function () {
        const itemId = this.getAttribute('data-item-id');  // アイテムIDを取得
        const currentStatus = this.textContent.trim();  // 現在の表示（✕ or 〇）を取得

        // 新しいステータスを決定する（✕なら〇に、〇なら✕に切り替える）
        const newStatus = currentStatus === '✕' ? '〇' : '✕';

        // UIを更新（✕ ⇔ 〇）
        this.textContent = newStatus;

        const newClass = newStatus === '✕' ? 'pending' : 'served';

       // 既存のクラスを削除して新しいクラスを追加
       this.classList.remove('pending', 'served');  // 両方のクラスを削除
       this.classList.add(newClass);  // 新しいクラスを追加

        // ステータス更新のためのデータをバックエンドに送信
        updateStatus(itemId, newStatus);
    });
});

// ステータスをバックエンドに送信する関数
function updateStatus(itemId, newStatus) {
  console.log(itemId, newStatus)
    // ステータスが "〇" の場合は "served"、"✕" の場合は "pending" としてバックエンドに送信
    const statusToUpdate = newStatus === '〇' ? 'served' : 'pending';

    fetch(`${server}/orderskun/update-status`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            orderItemId: itemId,  // 更新するアイテムID
            newStatus: statusToUpdate  // 新しいステータス（'served' or 'pending'）
        })
    })
    .then(response => response.json())
    .then(data => {
        console.log('Status updated:', data);
    })
    .catch(error => {
        console.error('Error updating status:', error);
    });
}

function playAlarmIfEnabled(alarmFlug,id) {
  console.log(alarmFlug)
  console.log(id)
  updateAlarmStatus(id,false)
    if (alarmFlug) {
        // <audio> 要素を取得
        const alarmSound = document.getElementById('alarmSound');

        // 音を再生
        alarmSound.play().catch(error => {
            console.error('Error playing sound:', error);
        });
    }
}


})


async function fetchPendingOrders() {
    try {
        const response = await fetch(`${server}/orderskun/pending`, {
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

function updateAlarmStatus(orderId, alarmStatus) {
    // サーバーにPOSTリクエストを送信して、alarm_enabled を true または false に更新
    fetch(`${server}/orderskun/update-alarm`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ orderId: orderId, alarmStatus: alarmStatus })
    })
    .then(response => response.json())
    .then(data => {
        if (data.message) {
            console.log('Alarm status updated:', data.message);
        } else {
            console.error('Error updating alarm status');
        }
    })
    .catch(error => {
        console.error('Error:', error);
    });
}
