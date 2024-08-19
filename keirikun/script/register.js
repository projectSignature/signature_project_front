document.getElementById('signupForm').addEventListener('submit', function(event) {
    event.preventDefault();
    document.getElementById('loader').style.display = 'block';

    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    const email = document.getElementById('email').value;
    const language = document.getElementById('language').value;

    const data = {
        username: username,
        password: password,
        email: email,
        isActive: true,
        language: language
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
        if (data.error && data.error === 'User already exists') {
            showModal('Usuário já cadastrado em nosso banco de dados.');
        } else {
            showModal('Cadastro realizado com sucesso!', true);
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
            window.location.href = '../views/loginadminrst.html';
        }
    }
    window.onclick = function(event) {
        if (event.target == modal) {
            modal.style.display = "none";
            if (success) {
                window.location.href = '../views/loginadminrst.html';
            }
        }
    }
}

// translate.js
const translations = {
  pt: {
    header: "Cadastro de Usuário",
    labelUsername: "Username",
    labelPassword: "Password",
    labelEmail: "Email",
    labelLanguage: "Language",
    submitButton: "Cadastrar",
    alreadyRegistered: 'Já tem cadastro? <a href="loginadminrst.html">Faça o login</a>',
    modalText: "Texto em Português"
  },
  jp: {
    header: "ユーザー登録",
    labelUsername: "ユーザー名",
    labelPassword: "パスワード",
    labelEmail: "メール",
    labelLanguage: "言語",
    submitButton: "登録",
    alreadyRegistered: 'すでに登録済みですか？ <a href="loginadminrst.html">ログインする</a>',
    modalText: "日本語のテキスト"
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
}
