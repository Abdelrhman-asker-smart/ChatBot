const chatInput = document.querySelector(".chat-input textarea");
const sendChatBtn = document.querySelector(".chat-input button");
const chatbox = document.querySelector(".chatbox");

let userMessage;
// const API_KEY = "fe3469bdc5mshc1376ef3df17411p1623cajsn6da2a938a410";

//OpenAI Free APIKey

const createChatLi = (message, className) => {
  const chatLi = document.createElement("li");
  chatLi.classList.add("chat", className);
  let chatContent =
    className === "chat-outgoing" ? `<p>${message}</p>` : `<p>${message}</p>`;
  chatLi.innerHTML = chatContent;
  return chatLi;
};

const generateResponse = (incomingChatLi, lastMessage) => {
  const messageElement = incomingChatLi.querySelector("p");
  const messageElementTwo = lastMessage.querySelector("p");

  const myHeaders = new Headers();
  myHeaders.append("Content-Type", "application/json");

  const raw = JSON.stringify({
    sender: "user_1",
    message: userMessage,
  });

  const requestOptions = {
    method: "POST",
    headers: myHeaders,
    body: raw,
    redirect: "follow",
  };

  fetch("http://localhost:5005/webhooks/rest/webhook", requestOptions)
    .then((response) => response.json())
    .then((result) => {
      console.log(result);
      if (result.length < 1)
        messageElement.textContent =
          "عفوا لدينا مشكله في النظام ..و نحن نقوم الان ببعض اعمال التحديث";

      result.forEach((response, index) => {
        const newChatLi = createChatLi(response.text, "chat-incoming");
        chatbox.appendChild(newChatLi);
      });
    })
    .catch((error) => console.error(error));
};

const handleChat = () => {
  userMessage = chatInput.value.trim();
  if (!userMessage) {
    return;
  }
  chatbox.appendChild(createChatLi(userMessage, "chat-outgoing"));
  chatbox.scrollTo(0, chatbox.scrollHeight);

  const incomingChatLi = createChatLi("Thinking...", "chat-incoming");
  const lastMessage = createChatLi("", "chat-incoming");
  chatbox.appendChild(incomingChatLi);
  chatbox.appendChild(lastMessage);
  chatbox.scrollTo(0, chatbox.scrollHeight);
  document.getElementById("TextArea").value = ""; // reset you input
  setTimeout(() => {
    generateResponse(incomingChatLi, lastMessage);
  }, 600);
};

sendChatBtn.addEventListener("click", handleChat);

function cancel() {
  let chatbotcomplete = document.querySelector(".chatBot");
  if (chatbotcomplete.style.display != "none") {
    chatbotcomplete.style.display = "none";
    let lastMsg = document.createElement("p");
    lastMsg.textContent = "Thanks for using our Chatbot!";
    lastMsg.classList.add("lastMessage");
    document.body.appendChild(lastMsg);
  }
}
function toggleChat() {
  const coreElement = document.getElementById("chatBot");
  coreElement.style.display =
    coreElement.style.display === "none" || coreElement.style.display === ""
      ? "block"
      : "none";
}
document.addEventListener("keydown", function (event) {
  if (event.key === "Enter") {
    event.preventDefault(); // Prevent the default Enter key behavior
    handleChat();
  }
});
