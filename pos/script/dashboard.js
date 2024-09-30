const token = window.localStorage.getItem('token');
let nameSpan = document.getElementById('spn-representative')
let userInfo={}
let currentSaleId = ""



document.addEventListener("DOMContentLoaded", async () => {
  const decodedToken = await jwt_decode(token); // jwtDecodeではなくjwt_decodeを使用
  console.log(decodedToken)
   userInfo.language = decodedToken.language;
   userInfo.id = decodedToken.userId;
   userInfo.representativeName = decodedToken.name;
   userInfo.expense_id = decodedToken.expense_id;
   nameSpan.innerText = userInfo.representativeName;
   userInfo.current_password = '';
   userInfo.password = '';
   userInfo.confirm_password = '';
   userInfo.email = decodedToken.email


  fetchTotalSales()
  // fetchMonthlyExpenses()
  async function fetchTotalSales() {
     console.log(userInfo)
      loadingIndicator.style.display = 'block';
      try {
          const response = await fetch(`${server}/pos/total-sales?user_id=${userInfo.id}`, {
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
          document.getElementById('totalSales').textContent = `¥${parseFloat(data.totalSales).toLocaleString()}`;

          // ポルトガル語で省略した曜日を取得するための配列
          const weekdays = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];

          // カードを`expensesChartContainer`に追加
          const expensesChartContainer = document.getElementById('expensesChartContainer');
          expensesChartContainer.innerHTML = '';  // 既存のカードをクリア

          // タイトル要素を作成
          const title = document.createElement('h3');
            title.textContent = 'Vendas por dia';
            title.style.textAlign = 'center';
            title.style.marginBottom = '20px';
            title.style.color = '#ffffff';  // タイトルのテキストカラーを白に設定
            title.style.fontWeight = 'bold';
            title.style.fontSize = '1.5em'; // フォントサイズを大きくする
            title.style.backgroundColor = '#333333';  // 背景色をダークグレーに設定
            title.style.padding = '10px';
            title.style.borderRadius = '8px';  // 角を丸くする

          // タイトルを`expensesChartContainer`に追加
          expensesChartContainer.appendChild(title);
          const cardContainer = document.createElement('div');
          cardContainer.className = 'card-container';  // 新しいdivにクラスを追加

          expensesChartContainer.appendChild(cardContainer);
          data.dailySales.forEach(sale => {
              const date = new Date(sale.date);
              const month = date.getMonth() + 1;
              const day = date.getDate();
              const weekday = weekdays[date.getDay()];  // 曜日を取得
              const formattedDate = `${month}/${day} (${weekday})`;

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


          // 日別売上の推移グラフを描画
          const labels = data.dailySales.map(sale => {
              const date = new Date(sale.date);  // 日付をパース
              const month = date.getMonth() + 1;  // 月を取得 (0ベースなので+1)
              const day = date.getDate();  // 日を取得
              const weekday = weekdays[date.getDay()];  // 曜日を取得
              return `${month}/${day} (${weekday})`;  // "MM/DD (曜日)"形式で返す
          });

          const salesData = data.dailySales.map(sale => parseFloat(sale.total_sales));
          const ctx = document.getElementById('salesChart').getContext('2d');
          new Chart(ctx, {
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

      } catch (error) {
          console.error('Error fetching sales data:', error);
          alert('売上データの取得中にエラーが発生しました');
      }
  }

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
   // const totalexpense = document.getElementById('card_expense')
   const salesContainer = document.getElementById('registerSalesHistory')
   const settingsModal = document.getElementById('settingsModal');
    const modalTitle = document.getElementById('modalTitle');
    const modalBody = document.getElementById('modalBody');
    const closeModal = document.querySelector('.modal .close');
    const saveButton = document.getElementById('saveButton');
    const personalSettings = document.getElementById('personalSettingsForm');
   // 今日の日付を取得
    const today = new Date();
    const yyyy = today.getFullYear();
    const mm = String(today.getMonth() + 1).padStart(2, '0'); // 月は0から始まるので+1する
    const dd = String(today.getDate()).padStart(2, '0');
    // 今月の初日を設定
    const firstDayOfMonth = `${yyyy}-${mm}-01`;
    const todayFormatted = `${yyyy}-${mm}-${dd}`;

    // デフォルト値として初日と今日の日付を設定
    document.getElementById('startDate').value = firstDayOfMonth;
    document.getElementById('endDate').value = todayFormatted;

    // 分析ボタンのイベントリスナー
    analistButton.addEventListener('click', async() =>{
        toggleDisplay(
            [salesChartContainer, expensesChartContainer, totalincome], // 表示する要素
            [salesContainer, registerFilter, registerHistory, settingsList] // 非表示にする要素
        );
    });

    // 売上ボタンのイベントリスナー
    salesButton.addEventListener('click', async()=>{
      loadingIndicator.style.display = 'block';
        toggleDisplay(
            [registerFilter, registerHistory], // 表示する要素
            [salesChartContainer, expensesChartContainer, totalincome, settingsList] // 非表示にする要素
        );

        // デフォルト日付でレジ履歴を自動的に表示
        await fetchAndDisplaySalesHistory(firstDayOfMonth, todayFormatted);
        loadingIndicator.style.display = 'none';
    });

    // レジ履歴ボタンのイベントリスナー
    registerButton.addEventListener('click', async() => {
      loadingIndicator.style.display = 'block';
        toggleDisplay(
            [registerFilter, registerHistory], // 表示する要素
            [salesChartContainer, expensesChartContainer, totalincome, salesContainer, settingsList] // 非表示にする要素
        );
        await fetchAndDisplayRegisterHistory(firstDayOfMonth, todayFormatted);
          loadingIndicator.style.display = 'none';
    });

    // 設定ボタンのイベントリスナー
    settingsButton.addEventListener('click', function () {
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

         await fetchAndDisplayRegisterHistory(startDate, endDate);
     });

     // レジ履歴データを取得し、表示する関数
     async function fetchAndDisplayRegisterHistory(startDate, endDate) {
         try {
             const response = await fetch(`${server}/pos/register-history?start_date=${startDate}&end_date=${endDate}`, {
                 method: 'GET',
                 headers: {
                     'Authorization': `Bearer ${token}`,  // トークンをヘッダーに含める
                     'Content-Type': 'application/json'
                 }
             });

             if (!response.ok) {
                 throw new Error('データ取得に失敗しました');
             }
             const data = await response.json();
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
             registerHistory.innerHTML = historyHtml;
         } catch (error) {
             console.error('Error fetching register history:', error);
             alert('レジ履歴の取得中にエラーが発生しました');
         }

   };

   const listItems = settingsList.querySelectorAll('li');
listItems.forEach(item => {
    item.addEventListener('click', function () {
        const rawSettingName = this.textContent.trim();
        const settingKey = settingMap[rawSettingName]; // 内部キーにマッピング
        if (settingKey) {
            modalTitle.textContent = rawSettingName; // 選択した設定名をモーダルに表示
            modalBody.innerHTML = generateModalContent(settingKey); // 内部キーを使用してモーダル生成
            settingsModal.style.display = 'block';
        } else {
            console.error('未対応の設定名: ' + rawSettingName);
        }
    });
});

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
                           </div>
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
                                   <option value="en" ${userInfo.language==='en'?'selected':''}>Inglês</option>
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
        console.log(key)
        console.log(userInfo[key])
        console.log(value)
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

          const result = await response.json();
          console.log('保存成功:', result);
          alert('Feito com sucesso');
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
       try {
           const response = await fetch(`${server}/pos/sales-history?start_date=${startDate}&end_date=${endDate}`, {
               method: 'GET',
               headers: {
                   'Authorization': `Bearer ${token}`,  // トークンをヘッダーに含める
                   'Content-Type': 'application/json'
               }
           });

           if (!response.ok) {
               throw new Error('データ取得に失敗しました');
           }
           const data = await response.json();
           data.sort((a,b)=>{
             return a.sale_id - b.sale_id
           })

           registerHistory.innerHTML = ''; // 既存の内容をクリア
           data.forEach(sale => {
               registerHistory.innerHTML += createSaleCard(sale);
           });
        } catch (error) {
           console.error('Error fetching register history:', error);
           alert('レジ履歴の取得中にエラーが発生しました');
       }
 loadingIndicator.style.display = 'none';
 };

 function createSaleCard(sale) {
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

   // フィルターボタンをクリックしたときの動作
   document.getElementById('filterButton').addEventListener('click', async () => {
       const startDate = document.getElementById('startDate').value;
       const endDate = document.getElementById('endDate').value;
       if (!startDate || !endDate) {
           alert('開始日と終了日を選択してください。');
           return;
       }
       // レジ履歴データを取得
       try {
           const response = await fetch(`/pos/register-history?start_date=${startDate}&end_date=${endDate}`, {
               method: 'GET',
               headers: {
                   'Authorization': `Bearer ${token}`,  // トークンをヘッダーに含める
                   'Content-Type': 'application/json'
               }
           });
           if (!response.ok) {
               throw new Error('データ取得に失敗しました');
           }
           const data = await response.json();
           // レジ履歴を表示
           let historyHtml = '';
           data.forEach(record => {
               historyHtml += `<div>
                   <p>レジID: ${record.register_id}</p>
                   <p>開店時間: ${new Date(record.open_time).toLocaleString()}</p>
                   <p>閉店時間: ${record.close_time ? new Date(record.close_time).toLocaleString() : '未閉店'}</p>
                   <p>現金開始残高: ¥${parseFloat(record.cash_opening_balance).toLocaleString()}</p>
                   <p>その他開始残高: ¥${parseFloat(record.other_opening_balance).toLocaleString()}</p>
                   <p>現金終了残高: ¥${parseFloat(record.cash_closing_balance).toLocaleString()}</p>
                   <p>その他終了残高: ¥${parseFloat(record.other_closing_balance).toLocaleString()}</p>
                   <hr>
               </div>`;
           });

           registerHistory.innerHTML = historyHtml;
       } catch (error) {
           console.error('Error fetching register history:', error);
           alert('レジ履歴の取得中にエラーが発生しました');
       }
   });

})

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


function closeModal() {
  document.getElementById('updateModal').style.display = "none";
}

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

// 設定項目を言語ごとにマッピング
const settingMap = {
    'Configurações pessoais': 'personal_settings', // ポルトガル語
    'Número do caixa': 'register_number',          // ポルトガル語
    'Responsável pelo caixa': 'cashier',           // ポルトガル語
    '個人設定': 'personal_settings',               // 日本語
    'レジ番号': 'register_number',                // 日本語
    'レジ担当者': 'cashier'                       // 日本語
};
