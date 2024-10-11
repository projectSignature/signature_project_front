// const token = window.localStorage.getItem('token');
// const decodedToken = jwt_decode(token); // jwtDecodeではなくjwt_decodeを使用
const seletOrderType = document.getElementById('take-or-uber')
const menuItemsContainer = document.getElementById('center-div');
const selectedItemsContainer = document.getElementById('list-order')
let notaxAmount = document.getElementById('total-amount')
const confirmButton = document.getElementById('confirm')
const nameinput = document.getElementById('name-input')
let taxRate = 0.08; // デフォルトの税率8%
let totalPrice = 0; // 合計金額

// ページ読み込み時にデフォルトで8%を選択状態にする
document.getElementById('tax8').classList.add('selected');

// if (!decodedToken) {
//   // window.location.href = '../index.html';
// }

let clients ={
  id:17, //クライアントid
  language:'pt', //クライアント言語
  paytype:'',　//ユーザー支払い方法
  selectedOrder:"",　//選択オーダー
  printInfo:"",　//？？
  taxtType:""　//税金区分
}

let orderList = {
  tableNo:1,
  clienId:17,
  order:{
  },
  historyOrder:{

  }
}

let selectedCard = null;
let categories = []; // カテゴリ情報を保存する配列
userLanguage='pt'
let selectedName = 9999

window.onload = async function() {
  const orderCategories = document.getElementById('categories-div');
  console.log(clients.id)
  if (!orderCategories) {
        console.error('orderCategories is null. Please check if the element with id "order-categories" exists.');
        return;
    }
    let selectType = seletOrderType.value === '9999' ? true : (seletOrderType.value === '9998' ? true : false);

  //メニュー、カテゴリー、オープション表示
  const MainData = await makerequest(`${server}/orders/getBasedata?user_id=${clients.id}`)
  const Categorys = MainData.categories.filter(category => category.is_takeout === selectType);
  Categorys.sort((a, b) => a.display_order - b.display_order);
  Categorys.forEach((category, index) => {
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
      currentSelectedButton = button;
      displayMenuItems(category.id);
  });
  console.log(button)

  orderCategories.appendChild(button);
});

function displayMenuItems(category) {
  console.log(category)
const sortedData = MainData.menus
    .filter(item => item.category_id === category)
    .sort((a, b) => a.display_order - b.display_order);
menuItemsContainer.innerHTML = '';
console.log(sortedData)
sortedData.forEach(item => {
    let div = document.createElement('div');
    div.classList.add('menu-item');
        div.innerHTML = `
                         <h3 data-id="${item.id}">${item[`menu_name_${userLanguage}`]}</h3>
                         <p>￥${Math.floor(item.price).toLocaleString()}</p>`;
        div.addEventListener('click', () => {
          displayItemDetails(item)
        });
    menuItemsContainer.appendChild(div);
});
}

function displayItemDetails(item) {
    const sortedOptions = MainData.options.filter(opt => opt.menu_id === item.id);
    const detailsContainer = document.createElement('div');
    detailsContainer.classList.add('item-details');
    detailsContainer.innerHTML = `
        <div class="details-content">
            <div class="left-side">

                <h3>${item[`menu_name_${userLanguage}`]}</h3>
                <p>${item[`description_${userLanguage}`] || ""}</p>
                <p id="item-price">￥${Math.floor(item.price)}</p>
            </div>
            <div class="right-side">
                <p>${translations[userLanguage]["option"]}:</p>
                <div id="options-list" class="options-list">
                    ${sortedOptions.map(opt => `
                        <div class="option-item" data-id="${opt.id}" data-price="${opt.additional_price}">
                            <span class="option-name">${opt[`option_name_${userLanguage}`]}</span>
                            <span class="option-price">+￥${Math.floor(opt.additional_price)}</span>
                        </div>
                    `).join('')}
                </div>
                <div>
                    <div>
                    <p >${translations[userLanguage]["Quantidade"]}:</p>
                    </div>
                    <div class="quantity-selector">
                    <button id="decrease-quantity">-</button>
                    <input type="number" id="item-quantity" value="1" min="1">
                    <button id="increase-quantity">+</button>
                    </div>
                </div>
                <button id="add-to-cart" class="add-cancle-btn">${translations[userLanguage]["Adicionar no carrinho"]}</button>
                <button id="back-button" class="add-cancle-btn">${translations[userLanguage]["Voltar"]}</button>
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
    const optionId = optionDiv.getAttribute('data-id');
    const additionalPrice = parseFloat(optionDiv.getAttribute('data-price'));
    const optionName = optionDiv.querySelector('.option-name').textContent;

    selectedOptions.push({
        id: optionId,
        name: optionName, // オプション名を追加
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
        const getIP = MainData.categories
            .filter(items => items.id === item.category_id)
        let newItem = {
            id: item.id,
            name: item[`menu_name_${userLanguage}`],
            amount: totalPrice,
            category: item.category_id,
            quantity: quantity,
            options: selectedOptions,
            printer:getIP[0].printer_ip
        };
        orderList.order[selectedName].push(newItem);
        displayOrderForName(selectedName)
    }
    // コンソールに orderList を表示
}

function displayOrderForName(name) {
  totalPrice = 0; // 合計金額をリセット
  selectedItemsContainer.innerHTML = ''; // 既存のリストをクリア
  console.log(orderList.order[name]);
  orderList.order[name].forEach((item, index) => {
    let li = document.createElement('li');
    let itemAmountFormatted = item.amount.toLocaleString();

    // 金額用のspan要素を作成
    let itemAmount = document.createElement('span');
    itemAmount.textContent = `￥${itemAmountFormatted}`;
    itemAmount.classList.add('item-amount'); // 必要に応じてクラスを追加

    // 親要素としてのspanを作成
    let itemInfo = document.createElement('span');
    itemInfo.textContent = item.name;
    itemInfo.classList.add('detail_names-div'); // 既存のクラスを追加

    let quantityDisplay = document.createElement('span');
    quantityDisplay.textContent = ` ${item.quantity}個 `;
    quantityDisplay.classList.add('quantity-display');

    let minusButton = document.createElement('button');
    minusButton.textContent = '-';
    minusButton.style = "width:50px";
    minusButton.addEventListener('click', () => {
      if (item.quantity > 1) {
        item.quantity--;
        quantityDisplay.textContent = ` ${item.quantity}個 `;
        totalPrice -= item.amount;
        updateTotals(); // 合計金額を更新
      }
    });

    let plusButton = document.createElement('button');
    plusButton.textContent = '+';
    plusButton.style = "width:50px";
    plusButton.addEventListener('click', () => {
      item.quantity++;
      quantityDisplay.textContent = ` ${item.quantity}個 `;
      totalPrice += item.amount;
      updateTotals(); // 合計金額を更新
    });

    // ゴミ箱ボタン（アイテム削除）
    let trashButton = document.createElement('button');
    trashButton.textContent = '🗑️';  // ゴミ箱アイコン
    trashButton.style = "width:50px;margin-left:15px;background-color:#FFF";
    trashButton.addEventListener('click', () => {
      orderList.order[name].splice(index, 1); // 配列から該当アイテムを削除
      displayOrderForName(name);  // 再表示
    });

    li.appendChild(itemInfo);
    li.appendChild(itemAmount);
    li.appendChild(minusButton);
    li.appendChild(quantityDisplay);
    li.appendChild(plusButton);
    li.appendChild(trashButton);

    // オプションを表示
    if (item.options && item.options.length > 0) {
      item.options.forEach(option => {
        let optionElement = document.createElement('div');
        optionElement.textContent = `・opção ：${option.name}, valor ￥${option.additional_price}`;
        optionElement.classList.add('item-option'); // 必要に応じてクラスを追加
        li.appendChild(optionElement);
      });
    }

    totalPrice += item.amount ; // 合計金額を計算* item.quantity

    selectedItemsContainer.appendChild(li);
  });

  updateTotals(); // 初期表示時に合計金額を更新
}


// 税金と合計金額を更新する関数
function updateTotals() {
  console.log(totalPrice)
  const taxAmount = totalPrice * taxRate; // 税金計算
  const totalWithTax = totalPrice + taxAmount; // 税込合計計算

  document.getElementById('total-amount').textContent = `Sem imposto: ￥${totalPrice.toLocaleString()}`;
  // document.getElementById('tax').textContent = `Imposto: ￥${Math.floor(taxAmount).toLocaleString()}`;
  document.getElementById('tax').textContent = `Imposto: ￥0`;
  document.getElementById('total').textContent = `Total: ￥${totalPrice.toLocaleString()}`;
}


// 税率ボタンをクリックした時の処理
document.getElementById('tax8').addEventListener('click', () => {
  taxRate = 0.08;
  updateTaxButtons('tax8');
  updateTotals(); // 合計金額を再計算
});

document.getElementById('tax10').addEventListener('click', () => {
  taxRate = 0.10;
  updateTaxButtons('tax10');
  updateTotals(); // 合計金額を再計算
});

// 選択された税率ボタンを強調表示する関数
function updateTaxButtons(selectedId) {
  document.getElementById('tax8').classList.remove('selected');
  document.getElementById('tax10').classList.remove('selected');
  document.getElementById(selectedId).classList.add('selected');
}

// 確定ボタンのイベントリスナーを追加
document.getElementById('confirm-order').addEventListener('click', async () => {
    const confirmButton = document.getElementById('confirm-order');
    const loadingPopup = document.getElementById('loading-popup');
    const orderClient = nameinput.value
    confirmButton.disabled = true; // ボタンを無効化
    loadingPopup.style.display = 'block'; // ポップアップを表示
    try {
      console.log(orderList.order[9999])

  if(!orderClient||orderClient===""){
    showAlert("Insira o nome do cliente");
    return
  }

        if (orderList.clienId === "" || selectedName === "" ) {
            showAlert(translations[userLanguage]["Nenhum item foi selecionado"]);
            confirmButton.disabled = false;
            loadingPopup.style.display = 'none'; // エラーの場合はポップアップを非表示
            return;
        }


        const response = await fetch(`${server}/orderskun/confirm`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                order_name: orderClient,
                user_id: orderList.clienId,
                table_no: seletOrderType.value,
                items: orderList.order[9999],
                orderId:''
            })
        });
        console.log(response)

        if (response.ok) {
            showCustomAlert(translations[userLanguage]["Pedido feito"]);
            orderList.order[selectedName] = [];
            selectedItemsContainer.innerHTML = ''; // リストをクリア
            nameinput.value=""
        } else {
            const errorData = await response.json();
            console.error('Error:', errorData);
            showAlert(translations[userLanguage]["Erro no registro"]);
        }
    } catch (error) {
        console.error('Error:', error);
        showAlert(translations[userLanguage]["Erro no registro"]);
    } finally {
        confirmButton.disabled = false;
        loadingPopup.style.display = 'none'; // リクエスト完了後にポップアップを非表示
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

function showAlert(message) {
    const alertModal = document.getElementById('alert-modal');
    const alertMessage = document.getElementById('alert-message');
    alertMessage.textContent = message;
    alertModal.style.display = 'block';
    document.getElementById('Atanction-title').textContent = translations[userLanguage]["Atencion"]
    document.getElementById('close-alert-btn').textContent = translations[userLanguage]["Voltar"]

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
        "Histórico não encontrado":"Histórico não encontrado",
        "Selecione ou abra uma comanda":"Selecione ou abra uma comanda",
        "Sabor":"Selecione 2 sabores",
        "Borda":"Selecione a borda",
        "Só pode escolher 2 sabores.":"Só pode escolher 2 sabores.",
        "Categoria":'Categoria',
        "preparando":'preparando',
        "entregue":'entregue',
        "status":'status'
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
         "Histórico não encontrado":"履歴存在しません",
         "Selecione ou abra uma comanda":"オーダーを作成または選択してください",
         "Sabor":"2つの味を選択してください",
         "Borda":"Select the crust",
         "Só pode escolher 2 sabores.":"2つの味しか選択できません",
         "Categoria":'カテゴリー',
         "preparando":'準備中',
         "entregue":'提供済み',
         "status":'ステータス'
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
         "Histórico não encontrado":"Not exist history",
         "Selecione ou abra uma comanda":"Select or open an order",
         "Sabor":"Select 2 flavors",
         "Borda":"エッジを選択してください",
         "Só pode escolher 2 sabores.":"You can only choose 2 flavors",
         "Categoria":"Category",
         "preparando": "preparing",
         "entregue": "delivered",
         "status":'status'
    }
};

}
