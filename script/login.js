
let accessmainserver = 'https://squid-app-ug7x6.ondigitalocean.app'　　//メインサーバーのチェックアクセス先
let user
let password
let errormessage
document.getElementById("login-bottom").addEventListener("click", login_check)//ログインボタンクリック時の操作
//ログイン情報の確認をする処理、IDが空白かどうか、その後PASSがくうはくかどうか、TRUEの場合Swal処理
function login_check(user, password) {
  user = document.getElementById("user").value;　　　　//ユーザー名
  password = document.getElementById("pass").value;　 //パスワード
  if (user == "") {
    errormessage = "Enter your username"
    swallopen(errormessage)
  } else {
    if (password == "") {
      errormessage = "Enter your password"
      swallopen(errormessage)
    } else {
      login_request(user, password) //chamar função de login passando login e senha
    }
  }
}
//validar dados
async function login_request(user, password) {
  await axios.post(accessmainserver + '/auth', {
    numbers: user,
    password: password
  })
    .then((response) => {
      console.log(response)
      if (response.data.token) {
        sessionStorage.setItem("token", response.data.token);
        sessionStorage.setItem("gym", response.data.gym);
        sessionStorage.setItem("GYM_ID", response.data.number.ID);
        sessionStorage.setItem("Language", response.data.language);
       // window.location = `./pages/dashboard.html?login=${response.data.gym}`;
        window.location = `/signature-project-front/pages/dashboard.html?login=${name}`;
      } else if (response.data.message) {
        errormessage = "Check username and password";
        document.getElementById("pass").value = "";
        sessionStorage.clear();
        swallopen(errormessage);
      };
      console.log(response.data)
    })
    .catch((err) => {
      errormessage = "Check username and password";
      document.getElementById("pass").value = "";
      swallopen(errormessage);
    });
};
function router2() {
  axios.get(accessmainserver + '/clientes', {
    headers: {
      token: localStorage.getItem('token')
    }
  }
  )
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
      }
      )
    }
  });
}
