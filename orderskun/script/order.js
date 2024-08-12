
let orderList = {
  tableNo:1,
  clienId:1,
  order:{

  }
}

let userLanguage = 'pt'
let categories = []; // カテゴリ情報を保存する配列

document.addEventListener("DOMContentLoaded", async () => {
  console.log(server)

  const MainData = await makerequest(`${server}/orders/getBasedata?user_id=1`)
  MainData.categories.sort((a, b) => a.display_order - b.display_order);
  console.log(MainData)
    const orderCategories = document.getElementById('order-categories');
    const menuItemsContainer = document.getElementById('menu-items');
    const selectedItemsContainer = document.getElementById('selected-items');
    displayMenuItems(MainData.categories[0].id)

    // カテゴリボタンを格納する変数
let currentSelectedButton = null;

MainData.categories.forEach((category, index) => {
    categories.push(category); // カテゴリ情報を配列に保存
    let button = document.createElement('button');
    button.textContent = category[`category_name_${userLanguage}`];

    // デフォルトで1つ目のボタンを選択状態にする
    if (index === 0) {
        button.classList.add('selected-category');
        currentSelectedButton = button;
        displayMenuItems(category.id);
    }

    button.addEventListener('click', () => {
        // 以前の選択を解除
        if (currentSelectedButton) {
            currentSelectedButton.classList.remove('selected-category');
        }

        // 現在の選択を適用
        button.classList.add('selected-category');
        console.log('Selected category:', button.textContent); // 追加されたクラスの確認
        currentSelectedButton = button;

        displayMenuItems(category.id);
    });

    orderCategories.appendChild(button);
});


function displayMenuItems(category) {
console.log(MainData.menus);
const sortedData = MainData.menus
    .filter(item => item.category_id === category)
    .sort((a, b) => a.display_order - b.display_order);
console.log(sortedData);
menuItemsContainer.innerHTML = '';
sortedData.forEach(item => {
    let div = document.createElement('div');
    div.classList.add('menu-item');

    // 在庫がない場合はsold-outクラスを追加し、表示を変更
    if (!item.stock_status) {
        div.classList.add('sold-out');
        div.innerHTML = `<img src="./imagen/${item.menu_name_pt}" alt="${item.menu_name_pt}">
                         <h3 data-id="${item.id}">${item[`menu_name_${userLanguage}`]}</h3>
                         <p>Sold Out</p>`;
    } else {
        div.innerHTML = `<img src="./imagen/${item.menu_name_pt}" alt="${item.menu_name_pt}">
                         <h3 data-id="${item.id}">${item[`menu_name_${userLanguage}`]}</h3>
                         <p>￥${Math.floor(item.price)}</p>`;
        div.addEventListener('click', () => {
          if (!selectedName) {
              showAlert(translations[userLanguage]["selecione uma comanda"]);
              return;
            }
            displayItemDetails(item); // 詳細画面を表示する関数を呼び出す
        });
    }

    menuItemsContainer.appendChild(div);
});
}


//メニュー詳細の表示------------------>
    function displayItemDetails(item) {
        console.log(item)
        const sortedOptions = MainData.options.filter(opt => opt.menu_id === item.id);
        const detailsContainer = document.createElement('div');
        detailsContainer.classList.add('item-details');
        detailsContainer.innerHTML = `
            <div class="details-content">
                <div class="left-side">
                    <img src="./imagen/${item.image}" alt="${item.name}" class="details-image">
                    <h3>${item[`menu_name_${userLanguage}`]}</h3>
                    <p>${item[`description_${userLanguage}`] || ""}</p>
                    <p id="item-price">￥${Math.floor(item.price)}</p>
                </div>
                <div class="right-side">
                    <p>${translations[userLanguage]["option"]}:</p>
                    <div id="options-list" class="options-list">
                        ${sortedOptions.map(opt => `
                            <div class="option-item" data-price="${opt.additional_price}">
                                <span class="option-name">${opt[`option_name_${userLanguage}`]}</span>
                                <span class="option-price">+￥${Math.floor(opt.additional_price)}</span>
                            </div>
                        `).join('')}
                    </div>
                    <div class="quantity-selector">
                        <button id="decrease-quantity">-</button>
                        <input type="number" id="item-quantity" value="1" min="1">
                        <button id="increase-quantity">+</button>
                    </div>
                    <button id="add-to-cart">${translations[userLanguage]["Adicionar no carrinho"]}</button>
                    <button id="back-button">${translations[userLanguage]["Voltar"]}</button>
                </div>
            </div>
        `;
        document.body.appendChild(detailsContainer);

        const itemPriceElement = document.getElementById('item-price');
        let basePrice = Math.floor(item.price);
        let selectedOptionsPrice = 0;
        let quantity = parseInt(document.getElementById('item-quantity').value);

        function updateTotalPrice() {
            const totalPrice = (basePrice + selectedOptionsPrice) * quantity;
            itemPriceElement.textContent = `￥${totalPrice}`;
        }

        document.querySelectorAll('.option-item').forEach(optionDiv => {
            optionDiv.addEventListener('click', () => {
                optionDiv.classList.toggle('selected');
                const price = parseFloat(optionDiv.getAttribute('data-price'));

                if (optionDiv.classList.contains('selected')) {
                    selectedOptionsPrice += price;
                } else {
                    selectedOptionsPrice -= price;
                }
                updateTotalPrice();
            });
        });

        document.getElementById('increase-quantity').addEventListener('click', () => {
            quantity = parseInt(document.getElementById('item-quantity').value) + 1;
            document.getElementById('item-quantity').value = quantity;
            updateTotalPrice();
        });

        document.getElementById('decrease-quantity').addEventListener('click', () => {
            if (quantity > 1) {
                quantity = parseInt(document.getElementById('item-quantity').value) - 1;
                document.getElementById('item-quantity').value = quantity;
                updateTotalPrice();
            }
        });

        document.getElementById('back-button').addEventListener('click', () => {
            document.body.removeChild(detailsContainer);
        });

        document.getElementById('add-to-cart').addEventListener('click', () => {//カートに追加の処理

            const selectedOptions = [];
            document.querySelectorAll('.option-item.selected').forEach(optionDiv => {
                const optionId = optionDiv.getAttribute('data-price');
                const additionalPrice = parseFloat(optionDiv.getAttribute('data-price'));
                selectedOptions.push({
                    id: optionId,
                    additional_price: additionalPrice
                });
            });

            addToSelectedItems(item, quantity, selectedOptions);
            document.body.removeChild(detailsContainer);
        });
    }











    function addToSelectedItems(item, quantity, selectedOptions) {
        // selectedName に対応する配列が存在しない場合、初期化
        if (!orderList.order[selectedName]) {
            orderList.order[selectedName] = [];
        }

        let totalPrice = (Math.floor(item.price) + selectedOptions.reduce((sum, opt) => sum + opt.additional_price, 0)) * quantity;

        // 既に同じ id と options を持つアイテムが存在するかチェック
        let existingItem = orderList.order[selectedName].find(orderItem => {
            return orderItem.id === item.id && JSON.stringify(orderItem.options) === JSON.stringify(selectedOptions);
        });

        if (existingItem) {
            // 存在する場合は数量を増やし、金額を再計算
            existingItem.quantity += quantity;
            existingItem.amount += totalPrice;
            displayOrderForName(selectedName)
        } else {
            // 存在しない場合は新しいアイテムを追加
            let newItem = {
                id: item.id,
                name: item[`menu_name_${userLanguage}`],
                amount: totalPrice,
                category: item.category_id,
                quantity: quantity,
                options: selectedOptions
            };
            orderList.order[selectedName].push(newItem);
            displayOrderForName(selectedName)
        }

        // コンソールに orderList を表示
        console.log(orderList);
        // displayOrderForName(selectedName);
    }








    // function addToSelectedItems(item) {
    //   console.log(item)
    //     let li = document.createElement('li');
    //     li.textContent = `${item.name} - ${item.price}円`;
    //     selectedItemsContainer.appendChild(li);
    //     console.log(orderList)
    //     console.log(orderList.order[selectedName])
    //     let newItem = {id:item.id,name:item.menu_name_pt,amount:item.price,category:item.category_id}
    //     orderList.order[selectedName].push(newItem)
    //     console.log(orderList)
    // }



    // 初期表示
    // displayMenuItems(categories[0]);
    document.getElementById('edit-order').addEventListener('click', () => {
           displayEditOrderModal();
       });

       // モーダルを閉じる処理（既存のモーダルに共通で使用）
       document.querySelectorAll('.modal .close').forEach(closeBtn => {
           closeBtn.addEventListener('click', () => {
               closeBtn.closest('.modal').style.display = 'none';
           });
       });

       // オーダー修正モーダルに現在のオーダーを表示
       function displayEditOrderModal() {
           const editOrderList = document.getElementById('edit-order-list');
           editOrderList.innerHTML = ''; // 既存のリストをクリア
           if (selectedName && orderList.order[selectedName]) {
               orderList.order[selectedName].forEach((item, index) => {
                   let li = document.createElement('li');
                   li.innerHTML = `
                       ${item.name} - ￥${item.amount} (${item.quantity}個)
                       <button class="decrease-quantity">-</button>
                       <input type="number" class="quantity-input" value="${item.quantity}" min="1" data-index="${index}">
                       <button class="increase-quantity">+</button>
                   `;
                   editOrderList.appendChild(li);
               });

               // イベントリスナーを追加
               editOrderList.querySelectorAll('.decrease-quantity').forEach(btn => {
                   btn.addEventListener('click', handleQuantityChange);
               });

               editOrderList.querySelectorAll('.increase-quantity').forEach(btn => {
                   btn.addEventListener('click', handleQuantityChange);
               });

               editOrderList.querySelectorAll('.quantity-input').forEach(input => {
                   input.addEventListener('change', handleQuantityInputChange);
               });
           }

           // モーダルを表示
           document.getElementById('edit-order-modal').style.display = 'block';
       }

       // 数量の変更処理
       function handleQuantityChange(event) {
           const input = event.target.parentElement.querySelector('.quantity-input');
           let quantity = parseInt(input.value);
           const index = input.dataset.index;

           if (event.target.classList.contains('increase-quantity')) {
               quantity++;
           } else if (event.target.classList.contains('decrease-quantity') && quantity > 0) {
               quantity--;
           }

           input.value = quantity;

           // 数量が0の場合はアイテムを削除、それ以外は数量を更新
           if (quantity === 0) {
               removeOrderItem(index);
           } else {
               updateOrderItemQuantity(index, quantity);
           }
       }

       // オーダーアイテムの削除
       function removeOrderItem(index) {
           orderList.order[selectedName].splice(index, 1);
           displayOrderForName(selectedName);
       }

       // 数量入力欄の変更処理
       function handleQuantityInputChange(event) {
           const quantity = parseInt(event.target.value);
           const index = event.target.dataset.index;

           // 数量が0の場合はアイテムを削除、それ以外は数量を更新
           if (quantity === 0) {
               removeOrderItem(index);
           } else {
               updateOrderItemQuantity(index, quantity);
           }
       }


       // オーダーアイテムの数量を更新
       function updateOrderItemQuantity(index, quantity) {
           const item = orderList.order[selectedName][index];
           const basePrice = Math.floor(item.amount / item.quantity);
           item.quantity = quantity;
           item.amount = basePrice * quantity;

           // リストの表示を更新
           displayOrderForName(selectedName);
       }

       // 変更を保存ボタンの処理
       document.getElementById('save-changes-btn').addEventListener('click', () => {
           // 変更を保存し、モーダルを閉じる
           document.getElementById('edit-order-modal').style.display = 'none';
       });


       function updateCategoryButtons() {
           const buttons = orderCategories.querySelectorAll('button');
           buttons.forEach((button, index) => {
               button.textContent = categories[index][`category_name_${userLanguage}`];
           });
       }

       const languageIcons = document.querySelectorAll('.language-icon');
       const translations = {
           pt: {
               "Histórico": "Histórico",
               "Lista de pedidos": "Lista de pedidos",
               "Confirmar pedido": "Confirmar pedido",
               "Alterar": "Alterar",
               "Abrir comanda": "Criar comanda",
               "Digite o nome para registro da comanda": "Digite o nome para registro da comanda",
               "Alterar o pedido": "Alterar o pedido",
               "Senha para alterar número da mesa": "Senha para alterar número da mesa",
               "Salvar": "Salvar",
               "Novo número da mesa": "Novo número da mesa",
               "Criar comanda":"Criar comanda",
               "Adicionar no carrinho":"Adicionar no carrinho",
               "Voltar":"Voltar",
               "option":"Opções",
               "Atencion":"Atenção",
               "selecione uma comanda":"Selecione ou abra uma comanda",
               "Nenhum item foi selecionado":"Nenhum item foi selecionado",
               "Pedido feito":"Pedido feito com sucesso",
               "Erro no registro":"Erro no registro",
               "Escolha a comanda":"Escolha a comanda",
               "Nome da comanda":"Nome da comanda",
               "Valor total":"Valor total",
               "Quantidade":"Quantidade",
               "Valor":"Valor",
               "Histórico não encontrado":"Histórico não encontrado"
           },
           ja: {
               "Histórico": "履歴",
               "Lista de pedidos": "注文リスト",
               "Confirmar pedido": "注文を確定",
               "Alterar": "修正",
               "Abrir comanda": "オーダー追加",
               "Digite o nome para registro da comanda": "オーダー名を入力してください",
               "Alterar o pedido": "注文を修正",
               "Senha para alterar número da mesa": "テーブル番号を変更するパスワード",
               "Salvar": "保存",
               "Novo número da mesa": "新しいテーブル番号",
               "Criar comanda":"オーダーを作成",
               "Adicionar no carrinho":"カートに追加",
               "Voltar":"戻る",
               "option":"オプション",
               "Atencion":"注意",
               "Selecione uma comanda":"オーダー名を選択するか、新しく作ってください",
               "Nenhum item foi selecionado":"商品が選択されていません。",
                "Pedido feito":"注文が確定しました",
                "Erro no registro":"登録エラー",
                "Escolha a comanda":"オーダー名を選択してください",
                "Nome da comanda":"オーダー名",
                "Valor total":"合計金額",
                "Quantidade":"数量",
                "Valor":"価格",
                "Histórico não encontrado":"履歴存在しません"
           },
           en: {
               "Histórico": "History",
               "Lista de pedidos": "Order List",
               "Confirmar pedido": "Confirm Order",
               "Alterar": "Edit",
               "Abrir comanda": "Open Order",
               "Digite o nome para registro da comanda": "Enter name to register order",
               "Alterar o pedido": "Edit Order",
               "Senha para alterar número da mesa": "Password to change table number",
               "Salvar": "Save",
               "Novo número da mesa": "New Table Number",
               "Criar comanda":"create a order",
               "Adicionar no carrinho":"Add to cart",
               "Voltar":"Back",
               "option":"option",
               "Atencion":"Atencion",
               "Selecione uma comanda":"Please select or open an order.",
               "Nenhum item foi selecionado":"No items were selected.",
                "Pedido feito":"Order placed successfully",
                "Erro no registro":"Error in registration",
                "Escolha a comanda":"Select the order",
                "Nome da comanda": "Order name",
                "Valor total":"Total ammount",
                "Quantidade":"Quantity",
                "Valor":"ammount",
                "Histórico não encontrado":"Not exist history"
           }
       };

       languageIcons.forEach(icon => {
           icon.addEventListener('click', (event) => {
               const selectedLang = event.target.getAttribute('data-lang');
               translatePage(selectedLang);
           });
       });

       function translatePage(lang) {
         userLanguage = lang
         console.log(lang)
           document.querySelectorAll('[data-translate-key]').forEach(element => {
               const key = element.getAttribute('data-translate-key');
               if (translations[lang] && translations[lang][key]) {
                   element.textContent = translations[lang][key];
               }
           });
           updateCategoryButtons()
           updateMenuItems()
             console.log(userLanguage)
       }

       function updateMenuItems() {
    const menuItems = document.querySelectorAll('.menu-item h3');
    menuItems.forEach(h3 => {
        const itemId = h3.getAttribute('data-id');
        const menuItem = MainData.menus.find(item => item.id == itemId);
        if (menuItem) {
            h3.textContent = menuItem[`menu_name_${userLanguage}`];
        }
    });
}




let currentOrder = {};
let selectedName = null;
const orderNamesContainer = document.getElementById('order-names-container');
// const selectedItemsContainer = document.getElementById('selected-items');
const nameInput = document.getElementById('name-input');
const addNameBtn = document.getElementById('add-name-btn');

// モーダル要素
const modal = document.getElementById('add-name-modal');
const showAddNameModalBtn = document.getElementById('show-add-name-modal');
const closeModalBtn = document.querySelector('.modal .close');

function addName(name) {
    if (!name || currentOrder[name]) {
        return; // 名前が空、または既に存在する場合は何もしない
    }

    orderList.order[name] = [];

    let nameDiv = document.createElement('div');
    nameDiv.textContent = name;
    nameDiv.addEventListener('click', () => {
        selectedName = name;
        displayOrderForName(name);
        updateActiveName(nameDiv);
    });
    orderNamesContainer.appendChild(nameDiv);

    // 最初の名前をデフォルトで選択
    if (!selectedName) {
        selectedName = name;
        displayOrderForName(name);
        updateActiveName(nameDiv);
    }
}

function displayOrderForName(name) {
    selectedItemsContainer.innerHTML = ''; // 既存のリストをクリア
    orderList.order[name].forEach(item => {
        let li = document.createElement('li');
        li.textContent = `${item.name} - ${item.quantity}個 - ￥${item.amount}`;
        selectedItemsContainer.appendChild(li);
    });
}

function updateActiveName(activeDiv) {
    document.querySelectorAll('.scrollable-names div').forEach(div => {
        div.classList.remove('active');
    });
    activeDiv.classList.add('active');
}

// オーダーにアイテムを追加
function addToOrder(item) {
    if (selectedName) {
      console.log(selectedName)
        orderList.order[selectedName].push(item);
        displayOrderForName(selectedName);
    }
}

// モーダルを表示する
showAddNameModalBtn.addEventListener('click', () => {
    modal.style.display = 'block';
});

// モーダルを閉じる
closeModalBtn.addEventListener('click', () => {
    modal.style.display = 'none';
});

// 名前を追加するボタンのイベントリスナー
addNameBtn.addEventListener('click', () => {
    const name = nameInput.value.trim();
    console.log(name)
    if (name) {
        addName(name);
        addOrderName(name)
        nameInput.value = ''; // インプットフィールドをクリア
        modal.style.display = 'none'; // モーダルを閉じる
    }
    console.log(orderList)
});

// モーダル外をクリックした場合にモーダルを閉じる
window.addEventListener('click', (event) => {
    if (event.target === modal) {
        modal.style.display = 'none';
    }
});

// // アイテム選択時に呼ばれる関数
// function displayItemDetails(item) {
//     // ここに詳細画面を表示するロジックを追加
//     addToOrder(item);
// }

// 確定ボタンのイベントリスナーを追加
document.getElementById('confirm-order').addEventListener('click', async () => {
    try {
      console.log(orderList.clienId)
      console.log(orderList.tableNo)
      console.log(selectedName)
      console.log(orderList.order[selectedName])
      if(orderList.clienId===""||orderList.tableNo===""||selectedName===""||orderList.order[selectedName].length === 0){
        showAlert(translations[userLanguage]["Nenhum item foi selecionado"]);
        return
      }
      // orderList.clienId = 1
      // orderList.tableNo = 11
        const response = await fetch(`${server}/orders/confirm`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ order_name:selectedName,user_id:orderList.clienId,table_no:orderList.tableNo,items: orderList.order[selectedName] })
        });
        if (response.ok) {
            console.log('Current Orders:', currentOrder);
            // オーダーが確定された場合に呼び出す
            showCustomAlert(translations[userLanguage]["Pedido feito"]);
          orderList.order[selectedName] = [];
          selectedItemsContainer.innerHTML = ''; // リストをクリア
        } else {
            const errorData = await response.json();
            console.error('Error:', errorData);
            showAlert(translations[userLanguage]["Erro no registro"]);
        }
    } catch (error) {
        console.error('Error:', error);
        alert(translations[userLanguage]["Erro no registro"]);
    }
});



function addOrderName(orderName) {
  // オーダー名が存在しない場合、オーダー名の初期化を行う
  if (!orderList.order[orderName]) {
    orderList.order[orderName] = []; // 空の配列を初期化
  } else {
    console.log(`Order name "${orderName}" already exists.`);
  }
}


document.getElementById('div-table-btn').addEventListener('click', () => {
    document.getElementById('password-modal').style.display = 'block';
});

document.querySelectorAll('.close').forEach(closeBtn => {
    closeBtn.addEventListener('click', () => {
        document.getElementById('password-modal').style.display = 'none';
        document.getElementById('table-number-modal').style.display = 'none';
    });
});

document.getElementById('confirm-password-btn').addEventListener('click', () => {
    const enteredPassword = document.getElementById('password-input').value;
    const correctPassword = '9876'; // ここで正しいパスワードを設定

    if (enteredPassword === correctPassword) {
      document.getElementById('password-input').value=""
        document.getElementById('password-modal').style.display = 'none';
        document.getElementById('table-number-modal').style.display = 'block';

    } else {
        alert('Senha incorreta!');
    }
});

document.getElementById('save-table-number-btn').addEventListener('click', () => {
    const newTableNumber = document.getElementById('new-table-number').value;
    orderList.tableNo = newTableNumber
    if (newTableNumber) {
        document.getElementById('table-number').textContent = newTableNumber;
        document.getElementById('table-number-modal').style.display = 'none';
    } else {
        alert('Por favor, insira um número de mesa válido.');
    }
});

// モーダル外をクリックしたら閉じる
window.onclick = function(event) {
    if (event.target === document.getElementById('password-modal') || event.target === document.getElementById('table-number-modal')) {
        event.target.style.display = 'none';
    }
}

function showAlert(message) {
    const alertModal = document.getElementById('alert-modal');
    const alertMessage = document.getElementById('alert-message');
    alertMessage.textContent = message;
    alertModal.style.display = 'block';

    // モーダルを閉じるボタンのイベントリスナー
    document.getElementById('close-alert-btn').addEventListener('click', () => {
        alertModal.style.display = 'none';
    });

    // モーダルの×ボタンを押した時のイベントリスナー
    document.querySelector('.modal .close').addEventListener('click', () => {
        alertModal.style.display = 'none';
    });

    // モーダル外をクリックした場合にモーダルを閉じる
    window.addEventListener('click', (event) => {
        if (event.target === alertModal) {
            alertModal.style.display = 'none';
        }
    });
}

function showCustomAlert(message) {
    const alertBox = document.getElementById('custom-alert');
    alertBox.querySelector('p').textContent = message;
    alertBox.style.display = 'block';

    setTimeout(() => {
        alertBox.style.display = 'none';
    }, 1000); // 1秒間表示
}


//履歴を表示するロジック

// 履歴ボタンをクリックしたときの処理
document.getElementById('view-history').addEventListener('click', () => {
    const historyModal = document.getElementById('history-modal');
    const historyList = document.getElementById('history-list');

    // 既存の履歴リストをクリア
    historyList.innerHTML = '';

    // `orderNamesContainer` の中にあるオーダー名を取得
    const orderNamesContainer = document.getElementById('order-names-container');
    const orderNames = orderNamesContainer.querySelectorAll('div');

    orderNames.forEach(orderNameDiv => {
        const historyItem = document.createElement('div');
        historyItem.textContent = orderNameDiv.textContent;
        historyItem.classList.add('history-item');

        // オーダー名をクリックしたらそのオーダーを表示する処理
        // オーダー名をクリックした時にサーバーからオーダー情報を取得する処理
  historyItem.addEventListener('click', async () => {
    closeModal(historyModal)
      selectedName = orderNameDiv.textContent;
      const user_id = 1;  // ここは実際のユーザーIDに置き換えてください
      const table_no = parseInt(document.getElementById('table-number').textContent);

      try {
          const response = await fetch(`${server}/orders/getOrder`, {
              method: 'POST',
              headers: {
                  'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                  user_id: user_id,
                  table_no: table_no,
                  order_name: selectedName,
              }),
          });

          console.log(response)


          if (response.ok) {
              const orderData = await response.json();
              console.log(orderData)
              displayOrderDetails(orderData.order_name,orderData.OrderItems)
              // displayOrderForName(orderData);  // 取得したオーダー情報を表示
              // updateActiveName(orderNameDiv);
              // closeModal(historyModal);  // モーダルを閉じる
          } else {
              showAlert(translations[userLanguage]["Histórico não encontrado"]);
          }
      } catch (error) {
          showAlert(translations[userLanguage]["Histórico não encontrado"]);
      }
  });


        historyList.appendChild(historyItem);
    });

    // モーダルを表示
    historyModal.style.display = 'block';
});

// モーダルを閉じる処理
function closeModal(modal) {
    modal.style.display = 'none';
}

// モーダルの閉じるボタンの処理
document.querySelector('#history-modal .close').addEventListener('click', () => {
    closeModal(document.getElementById('history-modal'));
});

// モーダル外をクリックした場合にモーダルを閉じる
window.addEventListener('click', (event) => {
    const historyModal = document.getElementById('history-modal');
    if (event.target === historyModal) {
        closeModal(historyModal);
    }
});

function displayOrderDetails(orderName, items) {
    const modal = document.getElementById('order-details-modal');
    const orderNameTitle = document.getElementById('order-name-title');
    const orderTotalAmount = document.getElementById('order-total-amount');
    const orderItemsList = document.getElementById('order-items-list');

    // モーダルのタイトルと合計金額を設定
    orderNameTitle.textContent = `${translations[userLanguage]["Nome da comanda"]}： ${orderName}`;
    const totalAmount = items.reduce((sum, item) => sum + parseFloat(item.total_price), 0);
    orderTotalAmount.textContent = `${translations[userLanguage]["Valor total"]}： ￥${totalAmount}`;

    // アイテムリストをクリア
    orderItemsList.innerHTML = '';

    // 各アイテムをリストに追加
    items.forEach(item => {
        const options = JSON.parse(item.options); // オプションをパースしてオブジェクトに変換

        const itemElement = document.createElement('li');
          const menuItem = MainData.menus.find(item => item.menu_id == item.menu_id);
          console.log(menuItem)
        itemElement.innerHTML = `
            <strong> ${menuItem[`menu_name_${userLanguage}`]}</strong> <!-- ここでmenu_idではなく実際のメニュー名を表示するなら他の情報も必要 -->
            <br>
            <strong>${translations[userLanguage]["Quantidade"]}:</strong> ${item.quantity}
            <br>
            <strong>${translations[userLanguage]["option"]}:</strong> ${options.length ? options.map(opt => opt.option_name).join(', ') : 'なし'}
            <br>
            <strong>${translations[userLanguage]["Valor"]}:</strong> ￥${item.item_price}
        `;
        orderItemsList.appendChild(itemElement);
    });

    // モーダルを表示
    modal.style.display = 'block';
}

// モーダルを閉じるためのリスナー
document.querySelector('#order-details-modal .close').addEventListener('click', () => {
    document.getElementById('order-details-modal').style.display = 'none';
});


// モーダルを閉じるためのリスナー
document.querySelector('#order-details-modal .close').addEventListener('click', () => {
    document.getElementById('order-details-modal').style.display = 'none';
});


// function displayOrderForName(orderData) {
//     selectedItemsContainer.innerHTML = ''; // 既存のアイテムをクリア
//
//     orderData.OrderItems.forEach(item => {
//         let li = document.createElement('li');
//         li.textContent = `${item.name} - ￥${item.item_price} (数量: ${item.quantity})`;
//         selectedItemsContainer.appendChild(li);
//     });
//
//     // 他にも必要な情報を表示したい場合、ここで追加できます
// }




});
