const chatInput = document.querySelector(".chat-input textarea");
const sendChatBtn = document.querySelector(".chat-input button");
const chatbox = document.querySelector(".chatbox");

let userMessage;
const API_KEY = "fe3469bdc5mshc1376ef3df17411p1623cajsn6da2a938a410";

//OpenAI Free APIKey

const createChatLi = (message, className) => {
  const chatLi = document.createElement("li");
  chatLi.classList.add("chat", className);
  let chatContent =
    className === "chat-outgoing" ? `<p>${message}</p>` : `<p>${message}</p>`;
  chatLi.innerHTML = chatContent;
  return chatLi;
};

const generateResponse = (incomingChatLi) => {
  const API_URL = "https://open-ai21.p.rapidapi.com/claude3";
  const messageElement = incomingChatLi.querySelector("p");

  const requestOptions = {
    method: "POST",
    headers: {
      "x-rapidapi-key": "fe3469bdc5mshc1376ef3df17411p1623cajsn6da2a938a410",
      "x-rapidapi-host": "open-ai21.p.rapidapi.com",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      //   model: "gpt-3.5-turbo",
      messages: [
        {
          role: "user",
          content: userMessage,
        },
      ],
    }),
  };
  fetch(API_URL, requestOptions)
    .then((res) => {
      if (!res.ok) {
        throw new Error("Network response was not ok");
      }
      return res.json();
    })
    .then((data) => {
      console.log("hello", data);
      messageElement.textContent = data.result; //your response
    })
    .catch((error) => {
      messageElement.classList.add("error");
      messageElement.textContent =
        "Oops! Something went wrong. Please try again!";
    })
    .finally(() => chatbox.scrollTo(0, chatbox.scrollHeight));
};

const handleChat = () => {
  userMessage = chatInput.value.trim();
  if (!userMessage) {
    return;
  }
  chatbox.appendChild(createChatLi(userMessage, "chat-outgoing"));
  chatbox.scrollTo(0, chatbox.scrollHeight);

  const incomingChatLi = createChatLi("Thinking...", "chat-incoming");
  chatbox.appendChild(incomingChatLi);
  chatbox.scrollTo(0, chatbox.scrollHeight);
  document.getElementById("TextArea").value = ""; // reset you input
  setTimeout(() => {
    generateResponse(incomingChatLi);
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
    // Check if Enter key is pressed
    handleChat(); // Call the function
  }
});
