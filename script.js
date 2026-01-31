// ===============================
// VARIÁVEIS DO FORMULÁRIO
// ===============================
const form = document.getElementById("rsvp-form");
const formScreen = document.getElementById("form-screen");
const loadingScreen = document.getElementById("loading-screen");
const resultScreen = document.getElementById("result-screen");

// 🔁 ALTERADO: agora são radios
const willGoRadios = document.querySelectorAll('input[name="willGo"]');

const brincadeiraBox = document.getElementById('brincadeira-box');
const resultMessage = document.getElementById("result-message");

// NOVOS ELEMENTOS PARA LOCALIZAÇÃO E MAPA
const confirmationMessage = document.getElementById("confirmation-message");
const mapContainer = document.getElementById("map-container");

// ===============================
// MOSTRAR/ESCONDER CAMPOS COM BASE NO "VOU / NÃO VOU"
// ===============================
willGoRadios.forEach(radio => {
    radio.addEventListener('change', () => {
        if (radio.value === 'Vou') {
            brincadeiraBox.classList.remove('hidden');
        } else {
            brincadeiraBox.classList.add('hidden');
        }
    });
});

// ===============================
// FUNÇÃO DE DELAY (LOADING)
// ===============================
function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

// ===============================
// SUBMIT DO FORMULÁRIO
// ===============================
form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const name = document.getElementById("name").value.trim();

    // 🔁 ALTERADO: pega o radio selecionado
    const selectedWillGo = document.querySelector('input[name="willGo"]:checked');
    const willGo = selectedWillGo ? selectedWillGo.value : "";

    if (!name || !willGo) {
        alert("Preencha os campos obrigatórios.");
        return;
    }

    showScreen("loading");

    try {
        await sendToGoogleForms({
            name,
            willGo,
        });

        // 5 segundos de loading
        await delay(5000);

        showResultMessage(willGo);
    } catch (error) {
        await delay(3000);

        resultMessage.textContent = "❌ Erro ao enviar. Tente novamente.";
        showScreen("result");
    }
});

// ===============================
// CONTROLE DE TELAS
// ===============================
function showScreen(screen) {
    formScreen.classList.remove("active");
    loadingScreen.classList.remove("active");
    resultScreen.classList.remove("active");

    if (screen === "form") formScreen.classList.add("active");
    if (screen === "loading") loadingScreen.classList.add("active");
    if (screen === "result") resultScreen.classList.add("active");
}

// ===============================
// MENSAGEM FINAL (COM LOCALIZAÇÃO E MAPA)
// ===============================
function showResultMessage(willGo) {
    if (willGo === "Vou") {
        resultMessage.textContent =
            "Obrigado por perder seu tempo respondendo isso. Essas informações são desnecessárias e não servirá para nada!";

        confirmationMessage.innerHTML =
            "Mas aguardo você na <strong>Área de Lazer do Condomínio Alto da Bela Vista</strong>, na rua <strong>Joaquim Afonso, 08</strong>, Planalto 13 de Maio.<br><br>Ahhh, e para a festa do ano, use trajes de gala nas cores do nosso <strong>Brasilzão</strong>";

        mapContainer.classList.remove("hidden");

    } else {
        resultMessage.textContent =
            "Vai perder a festa do ano… mas tá certo, então. Menos um! 😉";

        confirmationMessage.textContent = "";
        mapContainer.classList.add("hidden");
    }

    showScreen("result");
}

// ===============================
// ENVIO PARA GOOGLE FORMS
// ===============================
async function sendToGoogleForms(data) {
    const formUrl =
        "https://docs.google.com/forms/d/e/1FAIpQLSfIv_dZB75IE8yVdilbMmJ2qj-E6PgKjUF38nbYvWoY9Nuc6A/formResponse";

    const formData = new FormData();
    formData.append("entry.1649202243", data.name);
    formData.append("entry.1978093448", data.willGo);

    await fetch(formUrl, {
        method: "POST",
        mode: "no-cors",
        body: formData
    });
}