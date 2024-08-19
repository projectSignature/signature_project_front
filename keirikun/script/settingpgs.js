const token = window.localStorage.getItem('token');
var registerButton = document.getElementById("register-partner-button");
var registerForm = document.getElementById("register-partner-form");
var closeModal = document.querySelector("#register-partner-form .close");
var partnerForm = document.getElementById("partner-form");
var partnerList = document.getElementById("partner-list");
var editForm = document.getElementById("edit-form");
var formTitle = document.getElementById("form-title");
var partnerEditForm = document.getElementById("partner-edit-form");
var nameInput = document.getElementById("name");
var addressInput = document.getElementById("address");
var phoneInput = document.getElementById("phone");
var contactPersonInput = document.getElementById("contact_person");
var deleteButton = document.getElementById("delete-button");
var passwordModal = document.getElementById("password-modal");
var closePasswordModal = document.querySelector("#password-modal .close");

var currentPartnerId = null;
var currentPartnerType = null;
// const token = window.localStorage.getItem('token');

let userInfo = {
  processNumber: 0
};

document.getElementById('settings-button').style="background-color:#333"
document.getElementById("input-button").addEventListener('click',()=>{
  window.location.href = '../pages/main.html'; // Redireciona para renda.html
});
document.getElementById("history-button").addEventListener('click',()=>{
  window.location.href = '../pages/history.html'; // Redireciona para renda.html
});
document.getElementById("analysis-button").addEventListener('click',()=>{
  window.location.href = '../pages/analysis.html'; // Redireciona para renda.html
});
document.getElementById("submit-button").addEventListener('click',()=>{
  window.location.href = '../pages/monthdataConfirm.html'; // Redireciona para renda.html
});
document.getElementById("settings-button").addEventListener('click',()=>{
  window.location.href = '../pages/settingpgs.html'; // Redireciona para renda.html
});


    partnerForm.addEventListener("submit", function(event) {
        event.preventDefault();
        addPartner();
    });

    var registerForm = document.getElementById("register-partner-form");
  var closeModal = document.querySelector("#register-partner-form .close");

  // 閉じるボタンのイベントリスナー
  closeModal.addEventListener("click", function() {
      registerForm.style.display = "none";
  });

  editForm.addEventListener("click", function() {
      registerForm.style.display = "none";
  });

  // 外部クリックでフォームを閉じる
  window.addEventListener("click", function(event) {
      if (event.target == registerForm) {
          registerForm.style.display = "none";
      }
  });

 //ユーザー情報を入手
async function loadUserInfo() {
    try {
        const response = await fetch('http://localhost:3000/keirikun/user-info', {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        const user = await response.json();
        console.log(user);
        document.getElementById('email').value = user.email;
        document.getElementById('language').value = user.language;
        document.getElementById('invoice_number').value = user.invoice_number === undefined ? "" : user.invoice_number;
        document.getElementById('company_name').value = user.company_name === undefined ? "" : user.company_name;
        document.getElementById('phone_number').value = user.phone_number === undefined ? "" : user.phone_number;
    } catch (error) {
        console.error('Error loading user info:', error);
    }
}

document.addEventListener('DOMContentLoaded', async function () {
    if (token) {
        loadingIndicator.style.display = 'flex';
        const decodedToken = jwt_decode(token);
        userInfo.language = decodedToken.language;
        // userInfo.language = 'ja'
        userInfo.id = decodedToken.userId;
        translatePage(userInfo.language);
        await loadUserInfo(); // 現在の情報をロード
        let paterners = await  loadPartners();
          console.log(paterners)
        loadingIndicator.style.display = 'none';
    } else {
        const userLanguage = window.localStorage.getItem('userLanguage') || 'en';
        translatePage(userLanguage);
    }

    // パスワード変更ボタンのイベントリスナー
    const passwordModal = document.getElementById('password-modal');
    const changePasswordBtn = document.getElementById('change-password-btn');
    const closeBtn = document.getElementsByClassName('close')[0];

    changePasswordBtn.onclick = function () {
        passwordModal.style.display = 'block';
    }

    closeBtn.onclick = function () {
        passwordModal.style.display = 'none';
    }

    window.onclick = function (event) {
        if (event.target == passwordModal) {
            passwordModal.style.display = 'none';
        }
    }

    // パスワード変更フォームの送信処理
    document.getElementById('password-form').addEventListener('submit', async function (event) {
        event.preventDefault();

        const currentPassword = document.getElementById('current_password').value;
        const newPassword = document.getElementById('new_password').value;
        const confirmPassword = document.getElementById('confirm_password').value;
        if (newPassword !== confirmPassword) {
            alert(translation[userInfo.language].passCheck);
            return;
        }
        const formData = {
            current_password: currentPassword,
            new_password: newPassword
        };
        try {
            const response = await fetch('http://localhost:3000/keirikun/settings/change-password', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(formData)
            });

            const result = await response.json();

            if (result.success) {
                await swallSuccess();
                passwordModal.style.display = 'none';
            } else {
                alert(translations[userInfo.language]['dataSendFail']);
            }
        } catch (error) {
            console.error('Error updating password:', error);
            alert(translations[userInfo.language]['dataSendFail']);
        }
    });

    // 設定変更フォームの送信処理
    document.getElementById('settings-form').addEventListener('submit', async function (event) {
        event.preventDefault();
        const email = document.getElementById('email').value;
        const language = document.getElementById('language').value;
        const invoiceNumber = document.getElementById('invoice_number').value;
        const companyName = document.getElementById('company_name').value;
        const phoneNumber = document.getElementById('phone_number').value;
        const formData = {
            email: email,
            language: language,
            invoice_number: invoiceNumber,
            company_name: companyName,
            phone_number: phoneNumber
        };
        try {
            const response = await fetch('http://localhost:3000/keirikun/settings/update', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(formData)
            });

            const result = await response.json();

            if (result.success) {
                await swallSuccess();
                // 新しいトークンを取得して保存
                if (formData.language !== userInfo.language) {
                    const newTokenResponse = await fetch('http://localhost:3000/keirikun/new-token', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': `Bearer ${token}`
                        },
                        body: JSON.stringify({ language: formData.language })
                    });
                    const newTokenResult = await newTokenResponse.json();
                    if (newTokenResult.success) {
                        window.localStorage.setItem('token', newTokenResult.token);
                        userInfo.language = formData.language;
                        translatePage(userInfo.language);
                    } else {
                        alert(translations[userInfo.language]['dataSendFail']);
                    }
                }
            } else {
                alert(translations[userInfo.language]['dataSendFail']);
            }
        } catch (error) {
            console.error('Error updating settings:', error);
            alert(translations[userInfo.language]['dataSendFail']);
        }
    });
});


    registerButton.addEventListener("click", function() {
        registerForm.style.display = "block";
        loadPartners();
    });


    function addPartner() {
        var name = document.getElementById("partner-name").value;
        var type = document.getElementById("partner-type").value;
        var address = document.getElementById("partner-address").value;
        var phone = document.getElementById("partner-phone").value;
        var contactPerson = document.getElementById("partner-contact-person").value;

        var newPartner = {
            name: name,
            type: type,
            address: address,
            phone: phone,
            contact_person: contactPerson
        };

        fetch('http://localhost:3000/partners', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(newPartner)
        })
        .then(response => response.json())
        .then(data => {
          console.log(data)
          if (data.success) {
          loadPartners(); // 新しいパートナーをリストに追加
          document.getElementById("partner-form").reset(); // フォームをリセット
          registerForm.style.display = "none"; // フォームを非表示にする
      } else {
          alert(translations[userInfo.language].supplier_exist); // エラーメッセージを表示
      }
        })
        .catch(error => console.error(translations[userInfo.language].dataSendError, error));
    }


// 翻訳ロジック
function translatePage(language) {
    console.log(language);
    const translations = {
        en: {
            title: 'System Settings',
            current_password: 'Current Password',
            new_password: 'New Password',
            confirm_password: 'Confirm Password',
            email: 'E-mail',
            language: 'Language',
            invoice_number: 'Invoice Number',
            company_name: 'Company Name',
            phone_number: 'Phone Number',
            save_changes: 'Save Changes',
            change_password: 'Change Password',
            register_partner:"Update Partner"
        },
        ja: {
            title: 'システム設定',
            current_password: '現在のパスワード',
            new_password: '新しいパスワード',
            confirm_password: 'パスワードを認証する',
            email: 'メール',
            language: '言語',
            invoice_number: '請求書番号',
            company_name: '会社名',
            phone_number: '電話番号',
            save_changes: '変更を保存',
            change_password: 'パスワードを変更する',
            register_partner:"取引先・販売先の変更"
        },
        pt: {
            title: 'Configurações do Sistema',
            current_password: 'Senha Atual',
            new_password: 'Nova Senha',
            confirm_password: 'Confirmar Senha',
            email: 'E-mail',
            language: 'Idioma',
            invoice_number: 'Número da Fatura',
            company_name: 'Nome da Empresa',
            phone_number: 'Número de Telefone',
            save_changes: 'Salvar Alterações',
            change_password: 'Mudar Senha',
            register_partner:"Alterar Parceiros"
        }
    };

    const elements = document.querySelectorAll('[data-translate]');
    elements.forEach(el => {
        const key = el.getAttribute('data-translate');
        if (translations[language] && translations[language][key]) {
            if (el.tagName.toLowerCase() === 'input' || el.tagName.toLowerCase() === 'textarea') {
                el.placeholder = translations[language][key];
            } else {
                el.textContent = translations[language][key];
            }
        }
    });
}


  var partnerList = document.getElementById("partner-list");
  function loadPartners() {
                  fetch('http://localhost:3000/partners', {
                      headers: {
                          'Authorization': `Bearer ${token}`
                      }
                  })
                  .then(response => response.json())
                  .then(data => {
                      partnerList.innerHTML = '';
                      console.log(data);

                      data.clients.forEach(client => {
                          var listItem = document.createElement('li');
                          listItem.textContent = `${client.client_name} (client) - ${client.client_address ? client.client_address : 'N/A'}`;
                          var editButton = document.createElement('button');
                          editButton.textContent = '変更・削除';
                          editButton.onclick = function() {
                              showEditForm(client, 'client');
                          };
                          listItem.appendChild(editButton);
                          partnerList.appendChild(listItem);
                      });

                      data.suppliers.forEach(supplier => {
                          var listItem = document.createElement('li');
                          listItem.textContent = `${supplier.supplier_name} (supplier) - ${supplier.supplier_address ? supplier.supplier_address : 'N/A'}`;
                          var editButton = document.createElement('button');
                          editButton.textContent = '変更・削除';
                          editButton.onclick = function() {
                              showEditForm(supplier, 'supplier');
                          };
                          listItem.appendChild(editButton);
                          partnerList.appendChild(listItem);
                      });
                  })
                  .catch(error => console.error('Error fetching partners:', error));
              }

              function showEditForm(partner, type) {
                  registerForm.style.display = "none"
                  currentPartnerId = partner.id;
                  currentPartnerType = type;
                  formTitle.textContent = `Edit ${type.charAt(0).toUpperCase() + type.slice(1)}`;
                  nameInput.value = partner[`${type}_name`];
                  addressInput.value = partner[`${type}_address`];
                  phoneInput.value = partner[`${type}_phone`];
                  contactPersonInput.value = partner[`${type}_contact_person`];
                  editForm.style.display = 'block';
                  editForm.scrollIntoView({ behavior: 'smooth', block: 'start' });
              }

              partnerEditForm.addEventListener('submit', function(event) {
                  event.preventDefault();
                  var updatedPartner = {
                      [`${currentPartnerType}_name`]: nameInput.value,
                      [`${currentPartnerType}_address`]: addressInput.value,
                      [`${currentPartnerType}_phone`]: phoneInput.value,
                      [`${currentPartnerType}_contact_person`]: contactPersonInput.value
                  };
                  fetch(`http://localhost:3000/partners/${currentPartnerType}/${currentPartnerId}`, {
                      method: 'PUT',
                      headers: {
                          'Content-Type': 'application/json',
                          'Authorization': `Bearer ${token}`
                      },
                      body: JSON.stringify(updatedPartner)
                  })
                  .then(response => {
                      if (response.ok) {
                          loadPartners();
                          editForm.style.display = 'none';
                      } else {
                          console.error('Failed to update partner');
                      }
                  })
                  .catch(error => console.error('Error updating partner:', error));
              });

              deleteButton.addEventListener('click', function() {
                  fetch(`http://localhost:3000/partners/${currentPartnerType}/${currentPartnerId}`, {
                      method: 'DELETE',
                      headers: {
                          'Authorization': `Bearer ${token}`
                      }
                  })
                  .then(response => {
                      if (response.ok) {
                          loadPartners();
                          editForm.style.display = 'none';
                      } else {
                          console.error('Failed to delete partner');
                      }
                  })
                  .catch(error => console.error('Error deleting partner:', error));
              });

     function deletePartner(id, type) {
         fetch(`http://localhost:3000/partners/${type}/${id}`, {
             method: 'DELETE',
             headers: {
                 'Authorization': `Bearer ${token}`
             }
         })
         .then(response => {
             if (response.ok) {
                 loadPartners(); // 再読み込みしてリストを更新
             } else {
                 console.error('Failed to delete partner');
             }
         })
         .catch(error => console.error('Error deleting partner:', error));
     }

     closePasswordModal.addEventListener("click", function() {
    passwordModal.style.display = "none";
});
