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

    console.log(userInfo)

    // ページ翻訳
    translatePages(userInfo);

    // 設定リストの各項目にクリックイベントを追加
    listItems.forEach(item => {
        item.addEventListener('click', function () {
            const rawSettingName = this.textContent.trim();
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

        console.log("フォームデータの比較を開始:");

        // パスワードフィールドの検証ロジック
        const currentPass = formData.get('current_password')?.trim();
        const newPass = formData.get('password')?.trim();
        const confirmPass = formData.get('confirm_password')?.trim();

        if (currentPass || newPass || confirmPass) {
            // すべてのパスワードフィールドが入力されているか確認
            if (!currentPass || !newPass || !confirmPass) {
                alert('パスワードフィールドはすべて必須です。');
                return;
            }
            // 新しいパスワードと確認用パスワードの一致を確認
            if (newPass !== confirmPass) {
                alert('新しいパスワードと確認用パスワードが一致しません。');
                return;
            }
            console.log("パスワード変更が検知されました。");
            data['current_password'] = currentPass;
            data['password'] = newPass;
        } else {
            console.log("パスワード変更は検知されませんでした。");
        }

        // パスワード以外のフォームデータを比較
        for (let [key, value] of formData.entries()) {
            const trimmedValue = value.trim();
            if (key !== 'current_password' && key !== 'password' && key !== 'confirm_password') {
                if (userInfo.hasOwnProperty(key)) {
                    const originalValue = userInfo[key] ? userInfo[key].trim() : '';
                    console.log(`Key: ${key}, Form Value: ${trimmedValue}, UserInfo Value: ${originalValue}`);
                    if (originalValue !== trimmedValue) {
                        console.log(`変更検知: ${key}`);
                        data[key] = trimmedValue;
                    }
                } else {
                    console.warn(`Key '${key}' は userInfo に存在しません。`);
                }
            }
        }

        // 変更がない場合の処理
        if (Object.keys(data).length === 0) {
            alert('変更はありません。');
            return;
        }

        // user_idを追加
        if (userInfo && userInfo.id) {
            data.id = userInfo.id;
        } else {
            alert('ユーザーIDが見つかりません。');
            return;
        }

        console.log("送信データ:", data);

        // データ送信処理
        const success = await updateInformations(data);

        console.log(success)

        if (success.status) {
            settingsModal.style.display = 'none';
            console.log(userInfo)
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
            console.log('送信開始:', dataObject);
            // 実際のAPIエンドポイントを使用してデータを送信
            const response = await fetch(`${window.global.urlApi}/keirikun/updateSettings`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(dataObject)
            });

            console.log(response)

            if (response.ok) {
                console.log('送信成功:', await response.json());
                return {status:true};
            } else {
                console.error('送信エラー:', response.status, await response.text());
                return {status:false,message:response.status};
            }
        } catch (error) {
            console.error('通信エラー:', error);
            return false;
        }
    }



    // ページ翻訳処理
    function translatePages(userInfo) {
        if (userInfo.language && translations && translations[userInfo.language]) {
            document.getElementById('history-btn').innerText = translations[userInfo.language]['history'];
            document.getElementById('register-input').innerText = translations[userInfo.language]['input'];
            document.getElementById('analist-btn').innerText = translations[userInfo.language]['analysis'];
            document.getElementById('date-confirm-btn').innerText = translations[userInfo.language]['finalizeData'];
            document.getElementById('setting-btn').innerText = translations[userInfo.language]['settings'];
            document.getElementById('configs').innerHTML = `<i class="fas fa-user-cog"></i> ${translations[userInfo.language]['settingconfig']}`;
            document.getElementById('title-form-h2').innerText = translations[userInfo.language]['mudeOCampoQueDeseja']
            document.getElementById('title-senhaatual').innerText= translations[userInfo.language]['currentPassword']
            document.getElementById('title-novasenha').innerText= translations[userInfo.language]['newPassword']
            document.getElementById('title-confirmasenha').innerText= translations[userInfo.language]['confirmPassword']
            document.getElementById('title-email').innerText= translations[userInfo.language]['email']
            document.getElementById('title-nomeDoRepresentante').innerText= translations[userInfo.language]['representativeName']
            document.getElementById('title-idioma').innerText= translations[userInfo.language]['language']


        } else {
            console.error("翻訳データが見つかりません。");
        }
    }
});
