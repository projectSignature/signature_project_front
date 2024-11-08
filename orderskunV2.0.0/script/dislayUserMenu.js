document.addEventListener('DOMContentLoaded', async () => {
  const users = [,"Buonissimo",,,,,,,,,,,,,,,,"Roots Grill"]
    const urlParams = new URLSearchParams(window.location.search);
    const clientId = urlParams.get('clientId') || 1; // URLからclientIdを取得、無ければ1をデフォルトに
    let userLanguage = 'pt'; // 初期言語設定（日本語）
    const categories = [];
    let selectedName = null;
    document.getElementById('userTitle').innerText = users[clientId]

    // データ取得と初期表示設定
    const MainData = await makerequest(`${server}/orders/getBasedata?user_id=${clientId}`);
    const Categorys = MainData.categories.filter(category => category.is_takeout === false);
    Categorys.sort((a, b) => a.display_order - b.display_order);

    const orderCategories = document.getElementById('order-categories');
    const menuItemsContainer = document.getElementById('menu-items');
    let currentSelectedButton = null;

    // 言語切り替えボタンのイベントリスナーを設定
    document.querySelectorAll('.language-icon').forEach(icon => {
        icon.addEventListener('click', () => {
            userLanguage = icon.dataset.lang; // データ属性から選択された言語を取得
            renderCategories(); // カテゴリーとメニューを再レンダリング
        });
    });

    // カテゴリーボタンとメニュー項目をレンダリング
    function renderCategories() {
        orderCategories.innerHTML = ''; // カテゴリーボタンをクリア
        Categorys.forEach((category, index) => {
            let button = document.createElement('button');
            button.textContent = category[`category_name_${userLanguage}`];

            if (index === 0) {
                button.classList.add('selected-category');
                currentSelectedButton = button;
                displayMenuItems(category.id);
            }

            button.addEventListener('click', () => {
                if (currentSelectedButton) {
                    currentSelectedButton.classList.remove('selected-category');
                }
                button.classList.add('selected-category');
                currentSelectedButton = button;
                displayMenuItems(category.id);
            });

            orderCategories.appendChild(button);
        });
    }

    function displayMenuItems(categoryId) {
        const sortedData = MainData.menus
            .filter(item => item.category_id === categoryId)
            .sort((a, b) => a.stock_status !== b.stock_status ? (a.stock_status ? -1 : 1) : a.display_order - b.display_order);

        menuItemsContainer.innerHTML = '';
        sortedData.forEach(item => {
            let div = document.createElement('div');
            div.classList.add('menu-item');

            if (!item.stock_status) {
                div.classList.add('sold-out');
                div.innerHTML = `<img src="${item.imagem_string}" alt="${item.menu_name_pt}">
                                 <h3>${item[`menu_name_${userLanguage}`]}</h3>
                                 <p>Sold Out</p>`;
            } else {
                div.innerHTML = `<img src="${item.imagem_string}" alt="${item.menu_name_pt}">
                                 <h3>${item[`menu_name_${userLanguage}`]}</h3>
                                 <p>￥${Math.floor(item.price).toLocaleString()}</p>`;
            }

            menuItemsContainer.appendChild(div);
        });
    }

    // 初期表示のカテゴリーレンダリング
    renderCategories();
});
