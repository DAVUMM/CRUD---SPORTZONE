const API = '/pessoas';
const form = document.getElementById('formCadastro');
const mensagem = document.getElementById('mensagem');
const valor = id => document.getElementById(id).value.trim();
const apenasNumeros = texto => texto.replace(/\\D/g, '');

document.getElementById('cpf').addEventListener('input', e => {
    let v = apenasNumeros(e.target.value).slice(0, 11);
    v = v.replace(/(\\d{3})(\\d)/, '$1.$2').replace(/(\\d{3})(\\d)/, '$1.$2').replace(/(\\d{3})(\\d{1,2})$/, '$1-$2');
    e.target.value = v;
});
document.getElementById('cep').addEventListener('input', e => {
    let v = apenasNumeros(e.target.value).slice(0, 8);
    if (v.length > 5) v = v.slice(0,5) + '-' + v.slice(5);
    e.target.value = v;
});

form.addEventListener('submit', async event => {
    event.preventDefault();
    mensagem.className = 'notice';
    try {
        const resposta = await fetch(API);
        const usuarios = await resposta.json();
        const cpf = valor('cpf');
        const email = valor('email').toLowerCase();
        if (usuarios.some(u => apenasNumeros(u.cpf || '') === apenasNumeros(cpf))) {
            mensagem.textContent = 'Já existe uma conta cadastrada com esse CPF.';
            mensagem.className = 'notice error'; return;
        }
        if (usuarios.some(u => (u.email || '').toLowerCase() === email)) {
            mensagem.textContent = 'Este e-mail já está cadastrado.';
            mensagem.className = 'notice error'; return;
        }
        const novoUsuario = {
            nome: valor('nome'), sobrenome: valor('sobrenome'), cpf, email,
            senha: valor('senha'), rua: valor('rua'), cep: valor('cep'),
            cidade: valor('cidade'), estado: valor('estado').toUpperCase(),
            telefone: valor('telefone'), admin: false
        };
        const criado = await fetch(API, {
            method: 'POST', headers: {'Content-Type':'application/json'},
            body: JSON.stringify(novoUsuario)
        });
        if (!criado.ok) throw new Error('Falha ao salvar cadastro.');
        mensagem.textContent = 'Cadastro realizado! Você será levado para a tela de login.';
        mensagem.className = 'notice success';
        form.reset();
        setTimeout(() => window.location.href = 'index.html', 1200);
    } catch (erro) {
        mensagem.textContent = 'Não foi possível concluir o cadastro. Confira se o servidor está iniciado.';
        mensagem.className = 'notice error';
    }
});
