// DOMの読み込み完了時に初期化
const userInfo = JSON.parse(sessionStorage.getItem('keirikunUser'));
document.addEventListener('DOMContentLoaded', () => {
    // 初期設定: ボタンのスタイルを変更
    document.getElementById('settings-button').style.backgroundColor = "#333";
    // ユーザー情報を取得
    const modalTitle = document.getElementById('modalTitle');
    const settingsModal = document.getElementById('settingsModal');
    const closeModal = document.querySelector('.modal .close');
    const saveButton = document.getElementById('saveButton');
    const settingsList = document.getElementById('settingsList');
    const listItems = settingsList.querySelectorAll('li');
    const supplierListContainer = document.getElementById('supplierListContainer');
    const clientListContainer = document.getElementById('clientListContainer');
    // ページ翻訳
    translatePages(userInfo);
    // 設定リストの各項目にクリックイベントを追加
    listItems.forEach(item => {
        item.addEventListener('click', function () {
            const rawSettingName = this.textContent.trim();
            if(rawSettingName==='configurações pessoais'){
              modalTitle.textContent = rawSettingName;
              settingsModal.style.display = 'block';
              // モーダル内のフォームにユーザー情報を反映
              document.getElementById('form_email').value = userInfo.email || '';
              document.getElementById('representativeName').value = userInfo.name || '';
              const languageOptions = `
                  <option value="pt" ${userInfo.language === 'pt' ? "selected" : ''}>Português</option>
                  <option value="en" ${userInfo.language === 'en' ? "selected" : ''}>English</option>
                  <option value="ja" ${userInfo.language === 'ja' ? "selected" : ''}>日本語</option>`;
              document.getElementById('language').innerHTML = languageOptions;
            }
        });
    });
    // モーダルの閉じるボタンにイベントを登録
    closeModal.addEventListener('click', () => {
        settingsModal.style.display = 'none';
    });
    // Saveボタンにクリックイベントを登録
    document.getElementById('saveButton').addEventListener('click', async function (event) {
        event.preventDefault();
        // 現在のフォームを取得
        const currentForm = document.getElementById('personalSettingsForm');
        if (!currentForm) {
            alert('フォームが見つかりません。');
            return;
        }
        // フォームデータを取得
        const formData = new FormData(currentForm);
        const data = {};
        // パスワードフィールドの検証ロジック
        const currentPass = formData.get('current_password')?.trim();
        const newPass = formData.get('password')?.trim();
        const confirmPass = formData.get('confirm_password')?.trim();

        if (currentPass || newPass || confirmPass) {
            // すべてのパスワードフィールドが入力されているか確認
            if (!currentPass || !newPass || !confirmPass) {
                alert(translations[userInfo]['passNeed']);
                return;
            }
            // 新しいパスワードと確認用パスワードの一致を確認
            if (newPass !== confirmPass) {
                alert(translations[userInfo]['passCheck']);
                return;
            }
            data['current_password'] = currentPass;
            data['password'] = newPass;
        }
        // パスワード以外のフォームデータを比較
        for (let [key, value] of formData.entries()) {
            const trimmedValue = value.trim();
            if (key !== 'current_password' && key !== 'password' && key !== 'confirm_password') {
                if (userInfo.hasOwnProperty(key)) {
                    const originalValue = userInfo[key] ? userInfo[key].trim() : '';
                    if (originalValue !== trimmedValue) {
                        data[key] = trimmedValue;
                    }
                }
            }
        }
        // 変更がない場合の処理
        if (Object.keys(data).length === 0) {
            alert(translation[userInfo.language]['noChangeContents']);
            return;
        }
        // user_idを追加
        if (userInfo && userInfo.id) {
            data.id = userInfo.id;
        } else {
            alert(translations[userInfo.language]['notId']);
            return;
        }
        // データ送信処理
        const success = await updateInformations(data);
        if (success.status) {
            settingsModal.style.display = 'none';
            swallSuccess()
            if (data.hasOwnProperty('language')) {
             userInfo.language = data.language
             translatePages(userInfo);
           }
        }else if(success.message===401){
           alert(translations[userInfo.language]['errodeSenha'])
           document.getElementById('currentPassword').value=''
        }else {
            alert(translations[userInfo.language]['errorMessage']);
        }
    });
    // データ送信処理
    async function updateInformations(dataObject) {
        try {
            // 実際のAPIエンドポイントを使用してデータを送信
            const response = await fetch(`${window.global.urlApi}/keirikun/updateSettings`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(dataObject)
            });
            if(response.ok){
                return {status:true};
            }else{
                console.error('送信エラー:', response.status, await response.text());
                return {status:false,message:response.status};
            }
        }catch(error){
            console.error('通信エラー:', error);
            return false;
        }
    }
    // ページ翻訳処理
    function translatePages(userInfo) {
        if (userInfo.language && translations && translations[userInfo.language]) {
            // 既存の翻訳部分
            document.getElementById('history-btn').innerText = translations[userInfo.language]['history'];
            document.getElementById('register-input').innerText = translations[userInfo.language]['input'];
            document.getElementById('analist-btn').innerText = translations[userInfo.language]['analysis'];
            document.getElementById('date-confirm-btn').innerText = translations[userInfo.language]['finalizeData'];
            document.getElementById('setting-btn').innerText = translations[userInfo.language]['settings'];
            document.getElementById('configs').innerHTML = `<i class="fas fa-user-cog"></i> ${translations[userInfo.language]['settingconfig']}`;
            document.getElementById('title-form-h2').innerText = translations[userInfo.language]['mudeOCampoQueDeseja'];
            document.getElementById('title-senhaatual').innerText = translations[userInfo.language]['currentPassword'];
            document.getElementById('title-novasenha').innerText = translations[userInfo.language]['newPassword'];
            document.getElementById('title-confirmasenha').innerText = translations[userInfo.language]['confirmPassword'];
            document.getElementById('title-email').innerText = translations[userInfo.language]['email'];
            document.getElementById('title-nomeDoRepresentante').innerText = translations[userInfo.language]['representativeName'];
            document.getElementById('title-idioma').innerText = translations[userInfo.language]['language'];
            // 仕入れ先モーダルの翻訳
            // document.getElementById('closeSupplierModalBtn').innerText = translations[userInfo.language]['cancel'];
            document.querySelector('#supplierModalUnique h2').innerText = translations[userInfo.language]['supplier'];
            document.querySelector('label[for="supplier_name_unique"]').innerText = translations[userInfo.language]['supplierName'];
            document.querySelector('label[for="supplier_address_unique"]').innerText = translations[userInfo.language]['address'];
            document.querySelector('label[for="supplier_phone_unique"]').innerText = translations[userInfo.language]['phoneNumber'];
            document.querySelector('label[for="supplier_contact_person_unique"]').innerText = translations[userInfo.language]['representativeName'];
            document.querySelector('#supplierFormUnique button[type="submit"]').innerText = translations[userInfo.language]['register'];
            //収入先モーダルの翻訳
            // document.getElementById('closeClientModalBtn').innerText = translations[userInfo.language]['cancel'];
            document.querySelector('#clientModalUnique h2').innerText = translations[userInfo.language]['client'];
            document.querySelector('label[for="client_name_unique"]').innerText = translations[userInfo.language]['client'];
            document.querySelector('label[for="client_address_unique"]').innerText = translations[userInfo.language]['address'];
            document.querySelector('label[for="client_phone_unique"]').innerText = translations[userInfo.language]['phoneNumber'];
            document.querySelector('label[for="client_contact_person_unique"]').innerText = translations[userInfo.language]['representativeName'];
            document.querySelector('#clientFormUnique button[type="submit"]').innerText = translations[userInfo.language]['register'];
        }else{
            console.error("翻訳データが見つかりません。");
        }
    }
        // DOM要素の取得
        const addSupplierBtn = document.getElementById('addSupplierBtn');
        const addClientBtn = document.getElementById('addClientBtn');
        const supplierModal = document.getElementById('supplierModalUnique');
        const clientModal = document.getElementById('clientModalUnique');
        const closeSupplierModalBtn = document.getElementById('closeSupplierModalBtn');
        const closeClientModalBtn = document.getElementById('closeClientModalBtn');
        // 仕入れ先のモーダルを表示する
        addSupplierBtn.addEventListener('click', () => {
            supplierModal.style.display = 'block';
            document.getElementById('showSupplierListBtn').innerText = translations[userInfo.language]['listbuton']
            document.getElementById('supplier_name_unique').placeholder = translations[userInfo.language]['necesarryfild']
            document.getElementById('supplier_address_unique').placeholder = translations[userInfo.language]['notNecesarryFild']
            document.getElementById('supplier_phone_unique').placeholder = translations[userInfo.language]['notNecesarryFild']
            document.getElementById('supplier_contact_person_unique').placeholder = translations[userInfo.language]['notNecesarryFild']
        });
        // 収入先のモーダルを表示する
        addClientBtn.addEventListener('click', () => {
            clientModal.style.display = 'block';
            document.getElementById('showClientListBtn').innerText = translations[userInfo.language]['listbuton']
            document.getElementById('showSupplierListBtn').innerText = translations[userInfo.language]['listbuton']
            document.getElementById('client_name_unique').placeholder = translations[userInfo.language]['necesarryfild']
            document.getElementById('client_address_unique').placeholder = translations[userInfo.language]['notNecesarryFild']
            document.getElementById('client_phone_unique').placeholder = translations[userInfo.language]['notNecesarryFild']
            document.getElementById('client_contact_person_unique').placeholder = translations[userInfo.language]['notNecesarryFild']
        });
        // 仕入れ先のモーダルを閉じる
        closeSupplierModalBtn.addEventListener('click', () => {
            supplierModal.style.display = 'none';
        });
        // 収入先のモーダルを閉じる
        closeClientModalBtn.addEventListener('click', () => {
            clientModal.style.display = 'none';
        });
        // 外部クリックでモーダルを閉じる
        window.addEventListener('click', (event) => {
            if (event.target === supplierModal) {
                supplierModal.style.display = 'none';
            }
            if (event.target === clientModal) {
                clientModal.style.display = 'none';
            }
        });
        // 仕入れ先の登録
        document.getElementById('supplierFormUnique').addEventListener('submit', async (event) => {
            event.preventDefault();
            const formData = new FormData(event.target);
            const data = Object.fromEntries(formData.entries());
            data.user_id = userInfo.id
            data.kubun = 0
            console.log(data)
            try {
                const response = await fetch(`${window.global.urlApi}/keirikun/add/suppliers`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(data)
                });
                const result = await response.json();
                if (result.success) {
                    swallSuccess()
                    supplierModal.style.display = 'none';
                    event.target.reset();
                }
            } catch (error) {
                alert(translation[userInfo.language]['errorMessage']);
            }
        });
        // 収入先の登録
        document.getElementById('clientFormUnique').addEventListener('submit', async (event) => {
            event.preventDefault();
            const formData = new FormData(event.target);
            const data = Object.fromEntries(formData.entries());
            data.user_id = userInfo.id
            data.kubun = 1
            console.log(data)
            try {
                const response = await fetch(`${window.global.urlApi}/keirikun/add/suppliers`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(data)
                });
                const result = await response.json();
                if (result.success) {
                    swallSuccess()
                    clientModal.style.display = 'none';
                    event.target.reset();
                }
            } catch (error) {
                alert(translation[userInfo.language]['errorMessage']);
            }
        });


            //サプライヤー。、クライアントの情報を表示
            function displayList(container, konsaidata, type) {
              const data = konsaidata.filter(item => item.kubun === type);
              container.innerHTML = '';
              data.forEach(item => {
                  const listItem = document.createElement('div');
                  listItem.className = 'list-item';
                  listItem.innerHTML = `
                      <p>${translations[userInfo.language]['name']}: ${item.supplier_name}</p>
                      <p>${translations[userInfo.language]['address']}:  ${item.supplier_address}</p>
                      <p>${translations[userInfo.language]['phoneNumber']}:  ${item.supplier_phone}</p>
                      <p>${translations[userInfo.language]['contactPerson']}:  ${item.supplier_contact_person}</p>
                      <!-- <button class="delete-btn">${translations[userInfo.language]['delete']}</button> -->
                  `;
                  // delete-btnにイベントリスナーを追加
                  // const deleteButton = listItem.querySelector('.delete-btn');
                  // deleteButton.addEventListener('click', () => {
                  //     deleteItem(container,item.id, type);
                  // });
                  container.appendChild(listItem);
              });
            }

            document.getElementById('showSupplierListBtn').addEventListener('click', () => {
                displayList(supplierListContainer, userInfo.suppliers, 0);
            });

            document.getElementById('showClientListBtn').addEventListener('click', () => {
                displayList(clientListContainer, userInfo.suppliers, 1);
            });
            function editItem(id, type) {
                const data = type === 'supplier' ? userInfo.suppliers : userInfo.clients;
                const item = data.find(item => item.id === id);
                if (item) {
                    document.getElementById('editIdUnique').value = item.id;
                    document.getElementById('edit_name_unique').value = item.name;
                    document.getElementById('edit_address_unique').value = item.address;
                    document.getElementById('edit_phone_unique').value = item.phone;
                    document.getElementById('edit_contact_person_unique').value = item.contact_person;
                    document.getElementById('editModal').style.display = 'block';
                }
            }

            function deleteItem(container,id, type) {
                const confirmDelete = confirm(translations[userInfo.language]['deleteConfirm']);
                if (confirmDelete) {
                    const index = userInfo.suppliers.findIndex(item => item.id === id);
                    if (index > -1) {
                        userInfo.suppliers.splice(index, 1);
                        alert('削除が成功しました');
                        displayList(container,userInfo.suppliers,type);
                    }
                }
            }

            document.getElementById('closeEditModalBtn').addEventListener('click', () => {
                document.getElementById('editModal').style.display = 'none';
            });
});
