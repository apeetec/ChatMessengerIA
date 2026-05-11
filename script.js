var entry_form = document.getElementById("entry-form");
var input = entry_form.querySelector("input[type='text']");
var submitButton = entry_form.querySelector("button[type='submit']");
var messagesContainer = document.getElementById("messages");
var isWaitingResponse = false;

// Função para definir o estado de espera (enviando mensagem e aguardando resposta)
function SetWaitingState(isWaiting) {
  isWaitingResponse = isWaiting;
  input.disabled = isWaiting;

  if (submitButton) {
    submitButton.disabled = isWaiting;
  }
}

// Função para chamar a API do OpenRouter de forma segura via Proxy local
function API(conteudo) {
  const BASE_URL = "./proxy.php";
  const requestStartedAt =
    typeof performance !== "undefined" && typeof performance.now === "function"
      ? performance.now()
      : Date.now();

  // Exemplo de chamada à API usando fetch
  const fetchData = fetch(BASE_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: "openrouter/free",
      messages: [{ role: "user", content: conteudo }],
    }),
  });


  // Processa a resposta da API
  return fetchData
    .then(async (response) => {
      const data = await response.json().catch(() => ({}));
      const requestEndedAt =
        typeof performance !== "undefined" &&
        typeof performance.now === "function"
          ? performance.now()
          : Date.now();
      const elapsedMs = Math.round(requestEndedAt - requestStartedAt);

      if (!response.ok) {
        const apiMessage =
          (data && data.error && data.error.message) ||
          data.message ||
          "Falha na autenticação com a API.";
        const authHint =
          response.status === 401
            ? " Verifique se a API key está válida/ativa no OpenRouter."
            : "";
        throw new Error(
          `HTTP ${response.status} (${elapsedMs} ms): ${apiMessage}${authHint}`,
        );
      }

      return { data, elapsedMs };
    })
    .then(({ data, elapsedMs }) => {
      console.log(`Resposta da API (${elapsedMs} ms):`, data);

      // Aqui você pode processar a resposta da API e exibi-la na interface do usuário
      if (data.choices && data.choices.length > 0) {
        const message = data.choices[0].message.content;
        const messageElement = document.createElement("div");
        messageElement.className = "message message--received message--enter";

        const bubbleElement = document.createElement("div");
        bubbleElement.className = "message__bubble";
        bubbleElement.textContent = message;

        const timeElement = document.createElement("div");
        timeElement.className = "message__time";
        timeElement.textContent = `Agora • ${elapsedMs} ms`;

        messageElement.appendChild(bubbleElement);
        messageElement.appendChild(timeElement);
        if (messagesContainer) {
          messagesContainer.appendChild(messageElement);
          messagesContainer.scrollTop = messagesContainer.scrollHeight;
        }
      }
    })
    .catch((error) => {
      const messageElement = document.createElement("div");
      messageElement.className = "message message--received";
      messageElement.innerHTML = `
                <div class="message__bubble">${error.message}</div>
                <div class="message__time">Agora</div>
            `;
      if (messagesContainer) {
        messagesContainer.appendChild(messageElement);
      }
      console.error("Erro ao chamar a API:", error);
    });
}

// Função para limpar o campo de entrada
function ClearInput() {
  input.value = "";
}

// Função para enviar a mensagem
function SendMessage() {
  if (isWaitingResponse) {
    return;
  }

  var message = input.value.trim();
  message = message.replace(/\s+/g, " ");
  message = message.replace(/</g, "&lt;").replace(/>/g, "&gt;");
  if (message !== "") {
    console.log("Mensagem enviada: " + message);

    const messageElement = document.createElement("div");
    messageElement.className = "message message--sent";
    messageElement.innerHTML = `
                <div class="message__bubble">${message}</div>
                <div class="message__time">Agora</div>
            `;
    if (messagesContainer) {
      messagesContainer.appendChild(messageElement);
      messagesContainer.scrollTop = messagesContainer.scrollHeight;
    }
    ClearInput();
    SetWaitingState(true);

    API(message).finally(() => {
      SetWaitingState(false);
      input.focus();
    });
  }
}

// Adiciona um ouvinte de evento para o envio do formulário
input.onkeypress = function (event) {
  if (event.key === "Enter") {
    event.preventDefault(); // Impede o envio do formulário
    SendMessage();
  }
};

// Adiciona um ouvinte de evento para o envio do formulário
entry_form.onsubmit = function (event) {
  event.preventDefault(); // Impede o envio do formulário
  SendMessage();
};
