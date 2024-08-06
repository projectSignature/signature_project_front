let socket;

function connectWebSocket() {
    socket = new WebSocket('ws://localhost:3000');

    socket.onopen = function(event) {
        console.log('Connected to the WebSocket server.');
    };

    socket.onmessage = function(event) {
        const reader = new FileReader();
        reader.onload = function() {
            displayMessage(reader.result, 'friend');
        };
        reader.readAsText(event.data);
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

let currentFriend = 2; // 自分のIDが2の場合

function displayMessage(message, isSelf) {
    const chatBox = document.getElementById('chat');
    const messageElement = document.createElement('div');
    messageElement.textContent = message;
    messageElement.classList.add(isSelf ? 'self' : 'other');
    chatBox.appendChild(messageElement);
    chatBox.scrollTop = chatBox.scrollHeight; // 最新のメッセージが見えるようにスクロール
}

function sendMessage() {
    const messageInput = document.getElementById('messageInput');
    const message = messageInput.value;

    if (message !== '') {
        displayMessage(`You: ${message}`, true);
        socket.send(JSON.stringify({sender_id: 2, receiver_id: 1, content: message})); // サーバーにメッセージを送信
        messageInput.value = '';
    }
}

// WebSocket接続処理などは既存のコードを使用

// サーバーからメッセージを受信した際に、相手からのメッセージを表示
socket.onmessage = function(event) {
    const messageData = JSON.parse(event.data);
    const isSelf = messageData.sender_id === 2; // 自分が送信したメッセージなら true
    displayMessage(messageData.content, isSelf);
};


// チャット履歴を読み込む処理
function loadChatHistory() {
    fetch('http://localhost:3000/chat/history/2')  // 自分のユーザーIDを指定
        .then(response => response.json())
        .then(messages => {
          console.log(messages)
          messages.sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));
            messages.forEach(message => {
                const senderType = message.sender_id === 2 ? true : false;
                displayMessage(`${message.content}`, senderType);
            });
        })
        .catch(error => {
            console.error('Error fetching chat history:', error);
        });
}

// ページロード時にメッセージ履歴を読み込む
window.onload = loadChatHistory;
