const chatMessages = document.getElementById('chat-messages');
const chatInput = document.getElementById('chat-input');
const sendBtn = document.getElementById('send-btn');

// Example responses mimicking an AI
const botResponses = [
    "這是一個十分有趣的觀點！",
    "您的意思是？可以再多說明一點嗎？",
    "我了解了。身為 AI 助理，我隨時為您服務。",
    "太棒了！還有什麼我可以協助您的嗎？",
    "這是個好問題，讓我想想...",
    "我目前還在學習中，不過我會盡力回答您的問題！",
    "Initial chatbot version 已經成功上線啦！"
];

// Send message event listeners
sendBtn.addEventListener('click', handleSend);
chatInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        handleSend();
    }
});

function handleSend() {
    const text = chatInput.value.trim();
    if (!text) return;

    // 1. Add User Message
    addMessage(text, 'user');
    chatInput.value = '';

    // 2. Show Typing Indicator
    showTypingIndicator();

    // 3. Mock Bot Response after a delay
    setTimeout(() => {
        removeTypingIndicator();
        const randomIndex = Math.floor(Math.random() * botResponses.length);
        const replyText = text.toLowerCase().includes('commit') 
            ? "太好了，現在您可以成功執行 git commit 了！" 
            : botResponses[randomIndex];
        addMessage(replyText, 'bot');
    }, 1200 + Math.random() * 1000); // random delay between 1.2s and 2.2s
}

function addMessage(text, sender) {
    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${sender}-message`;
    
    const bubbleDiv = document.createElement('div');
    bubbleDiv.className = 'bubble';
    bubbleDiv.textContent = text;
    
    messageDiv.appendChild(bubbleDiv);
    chatMessages.appendChild(messageDiv);
    
    scrollToBottom();
}

function showTypingIndicator() {
    const indicatorDiv = document.createElement('div');
    indicatorDiv.className = 'message bot-message typing-indicator-container';
    indicatorDiv.id = 'typing-indicator';
    
    const bubbleDiv = document.createElement('div');
    bubbleDiv.className = 'bubble typing-indicator';
    
    // Add 3 bouncing dots
    for (let i = 0; i < 3; i++) {
        const dot = document.createElement('div');
        dot.className = 'typing-dot';
        bubbleDiv.appendChild(dot);
    }
    
    indicatorDiv.appendChild(bubbleDiv);
    chatMessages.appendChild(indicatorDiv);
    scrollToBottom();
}

function removeTypingIndicator() {
    const indicator = document.getElementById('typing-indicator');
    if (indicator) {
        indicator.remove();
    }
}

function scrollToBottom() {
    chatMessages.scrollTop = chatMessages.scrollHeight;
}
