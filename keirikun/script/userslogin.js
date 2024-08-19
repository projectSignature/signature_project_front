let accessmainserver = global.urlApi;

let user;
let password;
let errormessage;
let isLoading = false; // Variável para controlar o estado de carregamento

document.getElementById("login-bottom").addEventListener("click", login_check);
//ログイン情報の確認をする処理、IDが空白かどうか、その後PASSがくうはくかどうか、TRUEの場合Swal処理
async function login_check(user, password) {
  console.log('in');
  user = document.getElementById("user").value; //ユーザー名
  password = document.getElementById("pass").value; //パスワード

  if (user == "") {
    errormessage = "Enter your username";
    swallopen(errormessage);
  } else {
    if (password == "") {
      errormessage = "Enter your password";
      swallopen(errormessage);
    } else {
      if (!isLoading) { // Verifica se não está carregando
        showLoading(); // Exibe o carregamento
        signin({email: user, password})
      }
    }
  }
}

async function signin(payload) {
  // let urlBase = accessmainserver;
  let urlBase = 'http://localhost:3000'

  if (window.location.href.includes('/localhost') || window.location.href.includes('http://127.0.0.1:5500')) {
    urlBase = 'http://localhost:3000';
  }

  console.log(urlBase)

  axios.post(`${urlBase}/noauth/signin`, payload, {
    headers: {
      'Content-Type': 'application/json'
    }
  })
  .then((response) =>{
    console.log(response)
    if (response.data.success) {
      const { token } = response.data.info;
      window.localStorage.setItem('token', token);
      hideLoading(); // Oculta o carregamento
      alert('Conectado com sucesso'); // Mensagem de sucesso
      window.location.href = './pages/main.html'; // Redireciona para renda.html
    } else {
      errormessage = "Check username and password";
      document.getElementById("pass").value = "";
      swallopen(errormessage);
      hideLoading(); // Oculta o carregamento
    }
  })
  .catch(error => {
    alert('Usuário não encontrado ou Senha Incorreta');
    console.error(error);
    hideLoading(); // Oculta o carregamento
  });
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
