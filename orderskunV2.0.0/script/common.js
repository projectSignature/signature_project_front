async function makerequest(url){
  const request = await fetch(url)  //esperar aqui
  return request.json()
}

const pageToButtonMap = {
    'pos.html': 'pos-btn',
    'menuUpdate.html': 'menu-btn',
    'history.html': 'history-btn',
    'logout.html': 'logout-btn',
    'orders.html':'pedido-client-btn',
    'comandas.html':'comanda-btn',
    'ordersTakeOut.html':'pedido-takeout-btn',
    'order-admin.html':'pedido-admin-btn',
    'reservation.html':'reserva-btn'
};

document.addEventListener('DOMContentLoaded', function() {
    const navButtons = document.querySelectorAll('.header-btn');

    // ページ読み込み時に現在のページに対応するボタンをハイライトする
    const currentPage = window.location.pathname.split('/').pop();
    const correspondingButtonId = pageToButtonMap[currentPage];

    if (correspondingButtonId) {
        document.getElementById(correspondingButtonId).classList.add('active');
    }

    // ボタンのクリックイベントを設定
    navButtons.forEach(button => {
        button.addEventListener('click', function() {
            // すべてのボタンからactiveクラスを削除
            navButtons.forEach(btn => btn.classList.remove('active'));

            // クリックされたボタンにactiveクラスを追加
            this.classList.add('active');

            // 対応するページに遷移
            const buttonId = this.id;
            const targetPage = Object.keys(pageToButtonMap).find(page => pageToButtonMap[page] === buttonId);
            if (targetPage) {
                window.location.href = targetPage;
            }
        });
    });
});
