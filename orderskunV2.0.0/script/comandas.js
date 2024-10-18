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
        pendingOrders.sort((a, b) => {
            return new Date(a.pickup_time) - new Date(b.pickup_time);
        });
        const orderContainer = document.getElementById('order-list');
        orderContainer.innerHTML = ''; // 前の注文カードをクリア
        pendingOrders.forEach(async order => {
          const {color,message} = await timeGet(order.pickup_time)
          const pickupTime = new Date(order.pickup_time);
          const hours = pickupTime.getUTCHours(); // UTC時間で時間を取得
          const minutes = pickupTime.getUTCMinutes(); // UTC時間で分を取得
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
                <div class="order-time-div" style="background-color: ${color} !important;"><span>Pickup time: ${hours}:${minutes}</span></div>
                <div class="order-time-div" style="background-color: ${color} !important;"><span>${message}</span></div>
                <p>Valor: ${formatPrice(order.total_amount)}</p>
                <div class="order-items"></div>
            `;

            const orderItemsContainer = orderCard.querySelector('.order-items');
            order.OrderItems.forEach(item => {
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

        // イベントデリゲーションを使って、親要素にイベントリスナーを追加
        orderContainer.addEventListener('click', function (event) {
            if (event.target.classList.contains('serve-status')) {
                const statusDiv = event.target;
                const itemId = statusDiv.getAttribute('data-item-id');
                const currentStatus = statusDiv.textContent.trim();
                const newStatus = currentStatus === '✕' ? '〇' : '✕';
                statusDiv.textContent = newStatus;
                const newClass = newStatus === '✕' ? 'pending' : 'served';
                statusDiv.classList.remove('pending', 'served');
                statusDiv.classList.add(newClass);
                updateStatus(itemId, newStatus);
            }
        });
    };

    // 最初のデータ更新を実行
    await updateData();
    // 30秒ごとにデータ更新を実行
    // setInterval(updateData, 30000);

    function formatPrice(amount) {
        return `¥${parseFloat(amount).toLocaleString()}`;
    }

    function timeGet(time) {
        // ISOフォーマットの時間をそのまま日本時間として解釈するため、'Z'を除去
        const pickupTime = new Date(time.replace('Z', ''));  // 'Z'を削除してそのまま日本時間として扱う
        // 現在の日本時間を取得
        const now = new Date();
        // 時間差を計算
        const timeDifferenceMs = pickupTime.getTime() - now.getTime();
        // ミリ秒を時間、分、秒に変換
        const hoursDiff = Math.floor(Math.abs(timeDifferenceMs) / (1000 * 60 * 60)).toString().padStart(2, '0');
        const minutesDiff = Math.floor((Math.abs(timeDifferenceMs) % (1000 * 60 * 60)) / (1000 * 60)).toString().padStart(2, '0');
        const secondsDiff = Math.floor((Math.abs(timeDifferenceMs) % (1000 * 60)) / 1000).toString().padStart(2, '0');
        // 未来の場合と過去の場合で出力を分ける
        if (timeDifferenceMs > 0) {
            return {color:'#ADD8E6',
                    message:`faltam: ${hoursDiff}:${minutesDiff}:${secondsDiff}`};
        } else {
            return {color:'#FF7F7F',message:`Passou se: ${hoursDiff}:${minutesDiff}:${secondsDiff}`};
        }
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
