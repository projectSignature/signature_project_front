document.getElementById('signupForm').addEventListener('submit', function(event) {
    event.preventDefault();
    document.getElementById('loader').style.display = 'block';

    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    const email = document.getElementById('email').value;
    const language = document.getElementById('language').value;
    const inboisu = document.getElementById('inboisu').valueç
    const confirmPass = document.getElementById('confirm-password').value

    if(confirmPass!=password){
      showModal(translations[language].confirmPassErrorMessage);
      return
    }

    const data = {
        username: username,
        password: password,
        email: email,
        isActive: true,
        language: language,
        invoiceNumber: inboisu
    };

    fetch('http://localhost:3000/noauth/signup', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'User-Agent': 'insomnia/9.3.1'
        },
        body: JSON.stringify(data)
    })
    .then(response => response.json())
    .then(data => {
        document.getElementById('loader').style.display = 'none';
        if (data.status===409) {
            showModal(translations[language].existeUser);
        } else if(data.status===201) {
            showModal(translations[language].successfully, true);
        }else{
          showModal(translations[language].errorMessage);
        }
    })
    .catch((error) => {
        document.getElementById('loader').style.display = 'none';
        showModal('Ocorreu um erro ao realizar o cadastro.');
        console.error('Error:', error);
    });
});

function showModal(text, success = false) {
    var modal = document.getElementById("myModal");
    var span = document.getElementsByClassName("close")[0];
    document.getElementById("modalText").innerText = text;
    modal.style.display = "block";
    span.onclick = function() {
        modal.style.display = "none";
        if (success) {
            window.location.href = '../pages/main.html';
        }
    }
    window.onclick = function(event) {
        if (event.target == modal) {
            modal.style.display = "none";
            if (success) {
                window.location.href = '../pages/main.html';
            }
        }
    }
}

// translate.js
const translations = {
  pt: {
    header: "Cadastro de Usuário",
    labelUsername: "Nome completo",
    labelPassword: "Senha",
    labelEmail: "Email",
    labelLanguage: "Idioma",
    submitButton: "Cadastrar",
    alreadyRegistered: 'Já tem cadastro? <a href="loginadminrst.html">Faça o login</a>',
    modalText: "Texto em Português",
    existeUser:"Usuário já cadastrado em nosso banco de dados.",
    successfully:"Cadastro realizado com sucesso!",
    errorMessage:"Tivemos erro no sistema!",
    confirmpass:"Confirmar senha",
    inboisu:"Número do inboisu",
    confirmPassErrorMessage:"Senha não corresponde com a senha de confirmsção"
  },
  jp: {
    header: "ユーザー登録",
    labelUsername: "ユーザー名",
    labelPassword: "パスワード",
    labelEmail: "メール",
    labelLanguage: "言語",
    submitButton: "登録",
    alreadyRegistered: 'すでに登録済みですか？ <a href="loginadminrst.html">ログインする</a>',
    modalText: "日本語のテキスト",
    existeUser:"登録の氏名では既に登録があります。",
    successfully:"登録が完了しました",
    errorMessage:"システムエラーありました!",
    confirmpass:"確認用パスワード",
    inboisu:"インボイス番号",
    confirmPassErrorMessage:"パスワードと確認パスワードが一致しません"
  }
};

document.getElementById('language-select').addEventListener('change', function(event) {
  const language = event.target.value;
  translatePage(language);
});

function translatePage(language) {
  document.getElementById('header').textContent = translations[language].header;
  document.getElementById('label-username').textContent = translations[language].labelUsername;
  document.getElementById('label-password').textContent = translations[language].labelPassword;
  document.getElementById('label-email').textContent = translations[language].labelEmail;
  document.getElementById('label-language').textContent = translations[language].labelLanguage;
  document.getElementById('submit-button').value = translations[language].submitButton;
  document.getElementById('already-registered').innerHTML = translations[language].alreadyRegistered;
  document.getElementById('modalText').textContent = translations[language].modalText;
  document.getElementById('label-inboisu').textContent = translations[language].inboisu;
  document.getElementById('label-confirmpass').textContent = translations[language].confirmpass
}
