document.addEventListener('DOMContentLoaded', function() {
  const chatContainer = document.getElementById('chatContainer');
  const messageInput = document.getElementById('messageInput');
  const sendBtn = document.getElementById('sendBtn');
  const ageModal = document.getElementById('ageModal');
  const yesBtn = document.getElementById('yesBtn');
  const noBtn = document.getElementById('noBtn');
  const typingIndicator = document.getElementById('typingIndicator');
  const inputArea = document.getElementById('inputArea');
  const appContainer = document.querySelector('.app-container');
  
  // Greeting messages for the roast bot
  const greetings = [
    "Well look who decided to waste my time today. What do you want?",
    "Great, another human needing attention. What's your problem?",
    "Oh joy, I've been activated. This better be good.",
    "The disappointment starts now. What do you need?",
    "I'm already judging you. What's your question?"
  ];
  
  // Server endpoint (when running locally with ngrok)
  const API_ENDPOINT = '/api/chat'; 
  
  // Handle age verification
  yesBtn.addEventListener('click', function() {
    ageModal.style.display = 'none';
    // Add greeting message after age verification
    setTimeout(() => {
      addMessage(greetings[Math.floor(Math.random() * greetings.length)], 'receiver');
    }, 1000);
  });
  
  noBtn.addEventListener('click', function() {
    alert('Sorry, you must be 18+ to use this chatbot.');
    // Optionally, redirect or disable the chat
  });
  
  // Input field focus event - add glow effect
  messageInput.addEventListener('focus', function() {
    inputArea.classList.add('typing');
  });
  
  messageInput.addEventListener('blur', function() {
    inputArea.classList.remove('typing');
  });
  
  // Send message function
  function sendMessage() {
    const message = messageInput.value.trim();
    if (message) {
      addMessage(message, 'sender');
      messageInput.value = '';
      
      // Show typing indicator and add bot typing class for red glow
      typingIndicator.style.display = 'block';
      appContainer.classList.add('bot-typing');
      
      // Make API call to backend LLM service
      fetch(API_ENDPOINT, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message: message }),
      })
      .then(response => response.json())
      .then(data => {
        typingIndicator.style.display = 'none';
        appContainer.classList.remove('bot-typing');
        addMessage(data.response, 'receiver');
      })
      .catch(error => {
        typingIndicator.style.display = 'none';
        appContainer.classList.remove('bot-typing');
        console.error('Error:', error);
        addMessage("Even my server crashed to avoid talking to you. Try again, I guess.", 'receiver');
      });
    }
  }
  
  // Add message to chat
  function addMessage(text, type) {
    const messageDiv = document.createElement('div');
    messageDiv.classList.add('message', type);
    
    const messageText = document.createElement('div');
    messageText.textContent = text;
    
    const timeDiv = document.createElement('div');
    timeDiv.classList.add('time');
    const now = new Date();
    timeDiv.textContent = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;
    
    messageDiv.appendChild(messageText);
    messageDiv.appendChild(timeDiv);
    
    chatContainer.appendChild(messageDiv);
    chatContainer.scrollTop = chatContainer.scrollHeight;
  }
  
  // Event listeners
  sendBtn.addEventListener('click', sendMessage);
  
  messageInput.addEventListener('keypress', function(e) {
    if (e.key === 'Enter') {
      sendMessage();
    }
  });
});