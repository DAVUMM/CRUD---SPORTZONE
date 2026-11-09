function obterUsuario() {
    try { return JSON.parse(sessionStorage.getItem('sportzoneUsuario')); } catch { return null; }
}
const usuario = obterUsuario();
if (!usuario) window.location.href = 'index.html';
else {
    document.getElementById('nomeNav').textContent = usuario.nome;
    document.getElementById('mensagemBoasVindas').textContent =
        `Olá, ${usuario.nome}! Seja muito bem-vindo(a) à SportZone. Aqui você encontra inspiração e equipamentos para ir mais longe.`;
}
function sair() { sessionStorage.removeItem('sportzoneUsuario'); }
