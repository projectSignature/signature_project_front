// ローディングポップアップの表示を制御
function showLoadingPopup() {
  console.log('表示させるよ')
    const loadingPopup = document.getElementById('loading-popup');
    loadingPopup.style.display = 'flex';  // 表示する
    document.body.style.pointerEvents = 'none'; // 画面操作を無効化
}

function hideLoadingPopup() {
    const loadingPopup = document.getElementById('loading-popup');
    loadingPopup.style.display = 'none';  // 非表示にする
    document.body.style.pointerEvents = 'auto'; // 画面操作を有効化
}
