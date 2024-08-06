let socket;


function connectWebSocket() {
    socket = new WebSocket('ws://squid-app-ug7x6.ondigitalocean.app');

    socket.onopen = function(event) {
        console.log('Connected to the WebSocket server.');
    };

    socket.onmessage = function(event) {
        const messageData = JSON.parse(event.data);
        const isSelf = messageData.sender_id === 1; // 自分が送信したメッセージなら true
        console.log(isSelf)
        displayMessage(messageData.content, isSelf);
    };

    socket.onclose = function(event) {
        console.log('Disconnected from the WebSocket server.');
    };

    socket.onerror = function(error) {
        console.error('WebSocket error:', error);
    };
}

// 初回接続
connectWebSocket();

let currentFriend = 1

// メッセージ送信処理
function displayMessage(message, isSelf) {
    const chatBox = document.getElementById('chat');
    const messageElement = document.createElement('div');
    console.log(message)
    console.log(isSelf)
    messageElement.textContent = message;
    messageElement.classList.add(isSelf ? 'self' : 'other');
    chatBox.appendChild(messageElement);
    chatBox.scrollTop = chatBox.scrollHeight; // 最新のメッセージが見えるようにスクロール
}

function sendMessage() {
    const messageInput = document.getElementById('messageInput');
    const message = messageInput.value;

    if (message !== '' && currentFriend) {
        displayMessage(`${message}`, true);
        socket.send(JSON.stringify({sender_id: 1, receiver_id: 2, content: message})); // サーバーにメッセージを送信
        messageInput.value = '';
    } else if (!currentFriend) {
        alert('Please select a friend to chat with.');
    }
}

// チャット履歴を読み込む処理
function loadChatHistory() {
  fetch('https://squid-app-ug7x6.ondigitalocean.app/chat/history/1')
 // 自分のユーザーIDを指定
        .then(response => response.json())
        .then(messages => {
          console.log(messages)
          messages.sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));
            messages.forEach(message => {
                const senderType = message.sender_id === 1 ? true : false;
                displayMessage(`${message.content}`, senderType);
            });
        })
        .catch(error => {
          console.log('kok')
            console.error('Error fetching chat history:', error);
        });
}

// ページロード時にメッセージ履歴を読み込む
window.onload = loadChatHistory;
