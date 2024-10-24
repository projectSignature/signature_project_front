const token = window.localStorage.getItem('token');
const decodedToken = jwt_decode(token); // jwtDecodeではなくjwt_decodeを使用

if (!decodedToken) {
   window.location.href = '../index.html';
}
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
  uber_enabled:decodedToken.uber_enabled
}

document.addEventListener('DOMContentLoaded', () => {
    let allOrdes = []; // Armazenar todas as reservas localmente
    const itemsPerPage = 10; // Limite de 10 itens por página
    const maxDateRange = 30; // Limitar o intervalo de dias para evitar sobrecarga

    const today = new Date().toISOString().split('T')[0];
    const sevenDaysLater = new Date();
    sevenDaysLater.setDate(sevenDaysLater.getDate() - 7);
    const startdate = sevenDaysLater.toISOString().split('T')[0];

    const dateInputs = document.querySelectorAll('.date-range input[type="date"]');
    if (dateInputs.length === 2) {
        const todayDateInput = dateInputs[1];
        const startDateInput = dateInputs[0];
        todayDateInput.value = today;
        startDateInput.value = startdate;
        fetchPedidos(startdate,today);
        document.querySelector('.search').addEventListener('click', () => {
            const startDate = startDateInput.value;
            const endDate = todayDateInput.value;
            const startDateObj = new Date(startDate);
            const endDateObj = new Date(endDate);
            const timeDiff = Math.abs(endDateObj - startDateObj);
            const daysDiff = Math.ceil(timeDiff / (1000 * 60 * 60 * 24));
            if (daysDiff > maxDateRange) {
                alert(`Por favor, selecione um intervalo de no máximo ${maxDateRange} dias.`);
                return;
            }

            fetchPedidos(startDate, endDate);
        });
    } else {
        console.error('Os inputs de data não foram encontrados ou são insuficientes.');
    }

    function fetchPedidos(startDate, endDate) {
        showLoadingPopup();
        const apiUrl = `${server}/orderkuns/historico/pedidos/daterange?startDate=${startDate}&endDate=${endDate}&user_id=${clients.id}`;

        fetch(apiUrl)
            .then(response => {
                // レスポンスが成功 (status 200) かどうか確認
                if (response.ok) {
                    // JSON 形式のデータを返す
                    return response.json();
                } else {
                    hideLoadingPopup(); // エラー時にポップアップを閉じる
                    console.error(`Error: ${response.status}`);
                    return Promise.reject(`HTTPエラー: ${response.status}`);
                }
            })
            .then(data => {
                hideLoadingPopup();
                data
                .sort((a, b) => new Date(b.pickup_time) - new Date(a.pickup_time))
                    allOrdes = data; // データをローカルに保存
                    renderPage(1); // Renderizar a primeira página
                    renderPagination(Math.ceil(allOrdes.length / itemsPerPage), 1);

            })
            .catch(error => {
                hideLoadingPopup(); // エラー時にポップアップを閉じる
                console.error('エラー:', error);
            });
    }


    function renderPage(page) {
        const start = (page - 1) * itemsPerPage;
        const end = start + itemsPerPage;
        const reservationsToShow = allOrdes.slice(start, end);

        renderReservations(reservationsToShow);
    }

    function renderReservations(orders) {
        const tbody = document.querySelector('.reservation-table tbody');
        tbody.innerHTML = ''; // テーブルをクリア
        orders.forEach(order => {
            const orderDate = new Date(order.pickup_time);
            const formattedDate = orderDate.toLocaleDateString('ja-JP');
            const tr = document.createElement('tr');
            const statusMapping = {
                pending: 'em preparo',
                prepared: 'servido',
              };
             const orderStatus = statusMapping[order.order_status] || 'entregue';

            tr.innerHTML = `
                <td>${order.id}</td>
                <td>${formattedDate}</td>
                <td>${order.order_type}</td>
                <td>${order.order_name}</td>
                <td>${order.order_type === 'local' ? order.table_no : '-'}</td>
                <td>${orderStatus}</td>
                <td>${order.payment_method==="yet"?'Não pago':order.payment_method}</td>
                <td>${order.total_amount}</td>
                <td><button class="check-btn">Check</button></td>
                <td><button class="alterar-btn">Alterar</button></td>
                <td><button class="delete-btn">削除</button></td>  <!-- 削除ボタンを追加 -->
            `;
            tbody.appendChild(tr);

            // Checkボタンの処理
            const checkBtn = tr.querySelector('.check-btn');
            checkBtn.addEventListener('click', () => {
              const orderItems = order.OrderItems.map(item => {
      // optionsが文字列で保存されているため、JSONとしてパース
      let optionsList = '';
      if (item.options) {
          try {
              const parsedOptions = JSON.parse(item.options);  // JSONに変換
              optionsList = parsedOptions.map(option => {
                  return `<li>Option: ${option.name}, valor: ¥${option.additional_price}</li>`;
              }).join('');  // 各オプションをリスト形式で結合
          } catch (error) {
              console.error('オプションのパースに失敗しました:', error);
          }
      }

      return `
          <li>Nome: ${item.Menu.admin_item_name}, quantidade: ${item.quantity}, valor: ¥${item.item_price}</li>
          ${optionsList ? `<ul>${optionsList}</ul>` : ''}  <!-- オプションがある場合はリストを表示 -->
      `;
  }).join('');
                const modalContent = `
                    <p>Nome: ${order.order_name}</p>
                    <p>Número da mesa: ${order.table_no}</p>
                    <p>Valor total: ¥${order.total_amount}</p>
                    <p>Status: ${order.order_status}</p>
                    <p>Forma de pagamento: ${order.payment_method}</p>
                    <h3>Itens</h3>
                    <ul>${orderItems}</ul>
                `;
                openModal('Detalhes do pedido', modalContent);
            });

            const alterarBtn = tr.querySelector('.alterar-btn');
alterarBtn.addEventListener('click', () => {
    const modalContent = `
        <form id="orderUpdateForm">
            <label for="orderStatus">Status do pedido:</label>
            <select id="orderStatus" name="orderStatus">
                <option value="confirmed" ${order.order_status === 'entregue' ? 'selected' : ''}>Entregue</option>
                <option value="prepared" ${order.order_status === 'prepared' ? 'selected' : ''}>Preparado</option>
                <option value="pending" ${order.order_status === 'pending' ? 'selected' : ''}>Em preparo</option>
            </select>
            <br/>
            <label for="paymentMethod">Forma de pagamento:</label>
            <select id="paymentMethod" name="paymentMethod">
                <option value="cash" ${order.payment_method === 'dinheiro' ? 'selected' : ''}>Dinheiro</option>
                <option value="credit" ${order.payment_method === 'credit' ? 'selected' : ''}>Cartãoptimize</option>
                <option value="other" ${order.payment_method === 'other' ? 'selected' : ''}>Outros</option>
                <option value="yet" ${order.payment_method === 'yet' ? 'selected' : ''}>Não pago</option>
            </select>
            <br/>
            <label for="orderType">Tipo do pedido:</label>
            <select id="orderType" name="orderType">
                <option value="local" ${order.order_type === 'local' ? 'selected' : ''}>Local</option>
                <option value="uber" ${order.order_type === 'uber' ? 'selected' : ''}>Uber</option>
                <option value="demaekan" ${order.order_type === 'demaekan' ? 'selected' : ''}>Demaekan</option>
                <option value="other" ${order.order_type === 'other' ? 'selected' : ''}>Other</option>
            </select>
        </form>
    `;

    openModal('注文の変更', modalContent);

    // 保存ボタンの処理
    const saveBtn = document.getElementById('modal-save-btn');
    saveBtn.onclick = function() {
      const updatedOrderStatus = document.getElementById('orderStatus').value;
      const updatedPaymentMethod = document.getElementById('paymentMethod').value;
      const updatedOrderType = document.getElementById('orderType').value;
      // APIに送信するデータ
      const updateData = {
          order_status: updatedOrderStatus,
          payment_method: updatedPaymentMethod,
          order_type: updatedOrderType
      };
      // APIにデータを送信
      fetch(`${server}/orderskun/update/${order.id}`, {
          method: 'PUT',
          headers: {
              'Content-Type': 'application/json',
          },
          body: JSON.stringify(updateData)
      })
      .then(response => response.json())
      .then(data => {
          if (data.success) {
              alert('注文が更新されました');
              location.reload(); // ページをリロードして更新
          } else {
              alert('注文の更新に失敗しました');
          }
      })
      .catch(error => {
          console.error('エラーが発生しました:', error);
          alert('エラーが発生しました');
      });

      modal.style.display = 'none'; // モーダルを閉じる
  };

});
const deleteBtn = tr.querySelector('.delete-btn');
deleteBtn.addEventListener('click', () => {
    // 確認ダイアログを表示
    const confirmDelete = confirm(`ID: ${order.id} の注文を削除しますか？`);
    if (confirmDelete) {
        // 削除処理を実行
        const itemIds = order.OrderItems.map(item => item.id); // OrderItems の itemIds を取得
        console.log(itemIds)
        deleteOrder(order.id, itemIds);
    }
});

})

}
    function deleteOrder(orderId,itemIds) {
      // 削除リクエストを送信（オーダーIDとアイテムIDを一緒に送信）
      fetch(`${server}/orderskun/delete/${orderId}`, {
          method: 'DELETE',
          headers: {
              'Content-Type': 'application/json',
          },
          body: JSON.stringify({ itemIds: itemIds }) // アイテムIDもリクエストに含める
      })
      .then(response => {
          if (response.ok) {
              alert('Comanda deletada com sucesso.');
              location.reload()
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
    }
    // モーダルを開く関数
    function openModal(title, bodyContent) {
        const modal = document.getElementById('modal');
        const modalTitle = document.getElementById('modal-title');
        const modalBody = document.getElementById('modal-body');
        modalTitle.textContent = title;
        modalBody.innerHTML = bodyContent;
        modal.style.display = 'block'; // モーダルを表示
        // モーダルを閉じるロジック
        const closeModalBtn = document.querySelector('.close');
        closeModalBtn.onclick = function() {
            modal.style.display = 'none'; // モーダルを閉じる
        }
        // モーダル外をクリックしたときに閉じる
        window.onclick = function(event) {
            if (event.target == modal) {
                modal.style.display = 'none';
            }
        }
        // 保存ボタンの処理 (必要であればここで処理)
        const saveBtn = document.getElementById('modal-save-btn');
        saveBtn.onclick = function() {
            console.log('保存が押されました');
            modal.style.display = 'none'; // モーダルを閉じる
        }
    }
    function renderPagination(totalPages, currentPage) {
        const paginationContainer = document.querySelector('.pagination');
        paginationContainer.innerHTML = '';
        if (totalPages <= 1) return;
        for (let i = 1; i <= totalPages; i++) {
            const pageButton = document.createElement('button');
            pageButton.textContent = i;
            if (i === currentPage) {
                pageButton.classList.add('active');
            }
            pageButton.addEventListener('click', () => {
                renderPage(i);
                renderPagination(totalPages, i);
            });

            paginationContainer.appendChild(pageButton);
        }
    }
});
