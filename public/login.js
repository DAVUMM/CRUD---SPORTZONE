const API = '/pessoas';
const formLogin = document.getElementById('formLogin');
const mensagem = document.getElementById('mensagem');

formLogin.addEventListener('submit', async (event) => {
    event.preventDefault();
    mensagem.className = 'notice';
    try {
        const resposta = await fetch(API);
        if (!resposta.ok) throw new Error('Não foi possível acessar o servidor.');
        const usuarios = await resposta.json();
        const email = document.getElementById('email').value.trim().toLowerCase();
        const senha = document.getElementById('senha').value;
        const usuario = usuarios.find(item =>
            (item.email || '').toLowerCase() === email && item.senha === senha
        );
        if (!usuario) {
            mensagem.textContent = 'E-mail ou senha incorretos.';
            mensagem.className = 'notice error';
            return;
        }
        sessionStorage.setItem('sportzoneUsuario', JSON.stringify({
            id: usuario.id, nome: usuario.nome, sobrenome: usuario.sobrenome,
            email: usuario.email, admin: usuario.admin === true
        }));
        window.location.href = usuario.admin === true ? 'admin.html' : 'boas-vindas.html';
    } catch (erro) {
        mensagem.textContent = 'Erro ao conectar. Confira se o servidor está iniciado.';
        mensagem.className = 'notice error';
    }
});
