window.onload = function () {
    const vencedorFinal = document.querySelector(".final-vencedor");
    const mensagemCampeao = document.getElementById("mensagemCampeao");
    const nomeCampeao = document.getElementById("nomeCampeao");

    if (vencedorFinal && vencedorFinal.textContent.trim() !== "") {
        nomeCampeao.textContent = vencedorFinal.textContent.trim();
        mensagemCampeao.style.display = "block";
    }
};

function abrirDiscord(userId) {
    // Link para abrir o perfil no Discord via protocolo (funciona no app Discord)
    const discordLink = `discord://-/users/${userId}`;

    // Tenta abrir o link
    window.location.href = discordLink;

    // Opcional: alerta para usuário caso não funcione
    setTimeout(() => {
        alert("Se o Discord não abriu, certifique-se de que ele está instalado no seu dispositivo.");
    }, 1500);
}