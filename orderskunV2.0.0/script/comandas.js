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
let MainData = null; // グローバルな変数として宣言

document.addEventListener('DOMContentLoaded', async () => {
    const updateData = async () => {
        // メニュー、カテゴリー、オープション表示
        const loadingPopup = document.getElementById('loading-popup');
        MainData = await makerequest(`${server}/orders/getBasedata?user_id=${clients.id}`); // MainDataにデータを格納
        let pendingOrders = await fetchPendingOrders(clients.id);
        const orderContainer = document.getElementById('order-list');
        orderContainer.innerHTML = ''; // 前の注文カードをクリア
        pendingOrders.forEach(order => {
          console.log(order)
            playAlarmIfEnabled(order.alarm_enabled, order.id);
            let tableDisplay = order.table_no;
            if (tableDisplay == "9999") {
                tableDisplay = "Takeout";
            } else if (tableDisplay == "9998") {
                tableDisplay = "Uber Eats";
            } else {
                tableDisplay = `Mesa:${tableDisplay} *${order.order_name}`;
            }
            const orderCard = document.createElement('div');
            orderCard.classList.add('order-card');
            orderCard.innerHTML = `
                <h3>${tableDisplay}</h3>
                <p>Valor: ${formatPrice(order.total_amount)}</p>
                <div class="order-items"></div>
            `;

            const orderItemsContainer = orderCard.querySelector('.order-items');
            order.OrderItems.forEach(item => {
              console.log(item)
                const menuItemName = MainData.menus.filter(items => items.id === item.menu_id);
                const options = JSON.parse(item.options).map(opt => {
                    const optionName = getOptionNameById(opt.id); // opt.idからオプション名を取得
                    return `${optionName}`;
                }).join(', ');
                const itemElement = document.createElement('div');
                itemElement.classList.add('order-item');
                const statusClass = item.serve_status === 'pending' ? 'pending' : 'served';
                const statusText = item.serve_status === 'pending' ? '✕' : '〇';
                itemElement.innerHTML = `
                    <div class="left-div">
                        <div class="item-name-div">${menuItemName[0].admin_item_name}✕${item.quantity}</div>
                        <div class="option-div">
                            <span>${options.length > 0 ? options : ''}</span>
                        </div>
                    </div>
                    <div class="right-div">
                        <div class="serve-status ${statusClass}" data-item-id="${item.id}">${statusText}</div>
                    </div>
                `;
                orderItemsContainer.appendChild(itemElement);
            });
            // カードをスライダー内に追加
            orderContainer.appendChild(orderCard);
            loadingPopup.style.display = 'none'; // リクエスト完了後にポップアップを非表示
        });
        // ステータスのクリックイベントを再度セット
        document.querySelectorAll('.serve-status').forEach(statusDiv => {
            statusDiv.addEventListener('click', function () {
                const itemId = this.getAttribute('data-item-id');
                const currentStatus = this.textContent.trim();
                const newStatus = currentStatus === '✕' ? '〇' : '✕';
                this.textContent = newStatus;
                const newClass = newStatus === '✕' ? 'pending' : 'served';
                this.classList.remove('pending', 'served');
                this.classList.add(newClass);
                updateStatus(itemId, newStatus);
            });
        });
    };
    // 最初のデータ更新を実行
    await updateData();
    // 30秒ごとにデータ更新を実行
    setInterval(updateData, 30000);
    function formatPrice(amount) {
        return `¥${parseFloat(amount).toLocaleString()}`;
    }
    function getOptionNameById(optionId) {
        const optionDetail = MainData.options.find(option => option.id - 0 === optionId - 0);
        return optionDetail ? optionDetail.option_name_pt : '不明なオプション';
    }
    function updateStatus(itemId, newStatus) {
        const statusToUpdate = newStatus === '〇' ? 'served' : 'pending';
        fetch(`${server}/orderskun/update-status`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                orderItemId: itemId,
                newStatus: statusToUpdate
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
    function playAlarmIfEnabled(alarmFlug, id) {
        updateAlarmStatus(id, false);
        if (alarmFlug) {
            const alarmSound = document.getElementById('alarmSound');
            alarmSound.play().catch(error => {
                console.error('Error playing sound:', error);
            });
        }
    }
});
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
