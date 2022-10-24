
let accessmainserver = 'https://squid-app-ug7x6.ondigitalocean.app'　　//メインサーバーのチェックアクセス先
let machines = []
let user
let password
let errormessage
document.getElementById("login-bottom").addEventListener("click", login_check)


//ログイン情報の確認をする処理、IDが空白かどうか、その後PASSがくうはくかどうか、TRUEの場合Swal処理
function login_check(user, password) {
  //verificar campos vazios
  user = document.getElementById("user").value;
  password = document.getElementById("pass").value;
  if (user == "") {
    errormessage = "ユーザー名を入力してください"
    swallopen(errormessage)
  } else {
    if (password == "") {
      errormessage = "パスワードを入力してください"
      swallopen(errormessage)
    } else {
      login_request(user, password) //chamar função de login passando login e senha
    }
  }
  console.log('mondai nasji')
}
//validar dados
async function login_request(user, password) {
  await axios.post(accessmainserver + '/auth', {
    numbers: user,
    password: password
  })
    .then((response) => {

      if (response.data.token) {
        sessionStorage.setItem("token", response.data.token);
        sessionStorage.setItem("gym", response.data.gym);

        var loginName = response.data.number.NAME;
        var authority = response.data.number.AUTHORITY;
        let name = `${loginName}_${authority}`;

        //window.location = `./pages/dashboard.html?login=${name}`;
        window.location = `/signature-project-front/pages/dashboard.html?login=${name}`;

      } else if (response.data.message) {
        errormessage = "氏名コードまたはパスワード<br>の確認をしてください。";
        document.getElementById("pass").value = "";
        sessionStorage.clear();
        swallopen(errormessage);
      };
      console.log(response.data)
    })

    .catch((err) => {
      errormessage = "氏名コードまたはパスワード<br>の確認をしてください。";
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
    title: 'エラー',
    icon: 'warning',
    showCancelButton: true,
    showConfirmButton: false,
    cancelButtonText: '戻る',
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



    // manipula o sucesso da requisição
