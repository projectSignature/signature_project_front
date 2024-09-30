// let accessmainserver = global.urlApi;

let user;
let password;
let errormessage;
let isLoading = false; // Variável para controlar o estado de carregament
console.log(server)

document.getElementById("login-button").addEventListener("click", login_check);
//ログイン情報の確認をする処理、IDが空白かどうか、その後PASSがくうはくかどうか、TRUEの場合Swal処理
async function login_check() {
  // ユーザー名とパスワードを取得
  const user = document.getElementById("user").value; // ユーザー名
  const password = document.getElementById("pass").value; // パスワード

  // フィールドのバリデーション
  if (user === "") {
    const errormessage = "ユーザー名を入力してください";
    swallopen(errormessage); // エラーメッセージ表示用の関数
  } else if (password === "") {
    const errormessage = "パスワードを入力してください";
    swallopen(errormessage); // エラーメッセージ表示用の関数
  } else {
    if (!isLoading) { // もしロード中でなければ
      showLoading(); // ローディングアニメーションを表示
      await signin({ username: user, password_hash: password }); // ログイン処理
    }
  }
}

async function signin(payload) {
  try {
    const response = await axios.post(`${server}/pos/login`, payload, {
      headers: {
        'Content-Type': 'application/json'
      }
    });

    // 成功時の処理
    if (response.data.success) {
      hideLoading(); // ローディングを非表示
      const { user } = response.data;
      // alert('Seja bem！'); // 成功メッセージを表示
      window.localStorage.setItem('user', JSON.stringify(user)); // ユーザー情報を保存
      window.location.href = './pages/dashboard.html'; // ダッシュボードにリダイレクト
    } else {
      // ログイン失敗時の処理
      const errormessage = response.data.message || "ユーザー名またはパスワードが間違っています";
      swallopen(errormessage); // エラーメッセージ表示用
      hideLoading(); // ローディングを非表示
    }
  } catch (error) {
    // サーバーエラーや通信エラー時の処理
    alert('サーバーエラーが発生しました。後でもう一度試してください。');
    console.error('エラー:', error);
    hideLoading(); // ローディングを非表示
  }
}


function swallopen() {
  Swal.fire({
    title: 'Error',
    icon: 'warning',
    showCancelButton: true,
    showConfirmButton: false,
    cancelButtonText: 'back',
    width: 500,
    html: `<span>${errormessage}</span>`,
    customClass: "sweet-alert",
  }).then((result) => {
    if (result.value) {
      Swal.fire({
        icon: "success",
        title: 'concluido',
      });
    }
  });
}

function showLoading() {
  isLoading = true;
  var modal = document.getElementById("loadingModal");
  var span = document.getElementsByClassName("close")[0];
  document.getElementById("modalText").innerText = "Carregando...";
  modal.style.display = "block";
  span.onclick = function() {
    modal.style.display = "none";
  }

  window.onclick = function(event) {
    if (event.target == modal) {
      modal.style.display = "none";
    }
  }
}

function hideLoading() {
  isLoading = false;
  var modal = document.getElementById("loadingModal");
  modal.style.display = "none";
}
