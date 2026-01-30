// ===============================
// VARIÁVEIS DO FORMULÁRIO
// ===============================
const form = document.getElementById("rsvp-form");
const formScreen = document.getElementById("form-screen");
const loadingScreen = document.getElementById("loading-screen");
const resultScreen = document.getElementById("result-screen");
const willGoSelect = document.getElementById("willGo");
const brincadeiraBox = document.getElementById('brincadeira-box');
const resultMessage = document.getElementById("result-message");

// ===============================
// MOSTRAR/ESCONDER CAMPOS COM BASE NO "VOU / NÃO VOU"
// ===============================
willGoSelect.addEventListener('change', () => {
    if (willGoSelect.value === 'Vou') {
        brincadeiraBox.classList.remove('hidden');
    } else {
        brincadeiraBox.classList.add('hidden');
    }
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
    const willGo = willGoSelect.value;

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
// MENSAGEM FINAL
// ===============================
function showResultMessage(willGo) {
    if (willGo === "Vou") {
        resultMessage.textContent =
            "Obrigado por perder seu tempo respondendo isso, essas informações são desnecessárias e não servirá para nada! Mas aguardo você na Área de Lazer do Condomínio Alto da Bela Vista, na rua Joaquim Afonso, 08, Planalto 13 de Maio.";
    } else {
        resultMessage.textContent =
            "Obrigado por preencher mesmo assim. Mas como você não vai comparecer, fica para a próxima então.";
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