const API = '/pessoas';
let usuariosCache = [];
const usuarioLogado = (() => { try { return JSON.parse(sessionStorage.getItem('sportzoneUsuario')); } catch { return null; } })();
if (!usuarioLogado || usuarioLogado.admin !== true) {
    alert('Acesso permitido somente para administrador.');
    window.location.href = 'index.html';
}
const tbody = document.getElementById('listaUsuarios');
const mensagem = document.getElementById('mensagem');
const painelEdicao = document.getElementById('painelEdicao');
const numeros = v => String(v || '').replace(/\\D/g, '');

async function carregarUsuarios(filtro = '') {
    try {
        const resposta = await fetch(API);
        if (!resposta.ok) throw new Error();
        usuariosCache = await resposta.json();
        const encontrados = usuariosCache.filter(u => numeros(u.cpf).includes(numeros(filtro)));
        renderizar(encontrados);
        document.getElementById('contador').textContent = `${encontrados.length} usuário(s) encontrado(s)`;
        mensagem.className = 'notice';
    } catch {
        mensagem.textContent = 'Não foi possível carregar os usuários. Confira o servidor.';
        mensagem.className = 'notice error';
    }
}
function renderizar(lista) {
    tbody.innerHTML = '';
    if (!lista.length) {
        const tr = document.createElement('tr'), td = document.createElement('td');
        td.colSpan = 6; td.textContent = 'Nenhum usuário encontrado.'; tr.appendChild(td); tbody.appendChild(tr); return;
    }
    lista.forEach(u => {
        const tr = document.createElement('tr');
        [u.nome + ' ' + (u.sobrenome || ''), u.cpf, u.email, u.telefone, u.admin ? 'Administrador' : 'Cliente'].forEach(valor => {
            const td = document.createElement('td'); td.textContent = valor || '—'; tr.appendChild(td);
        });
        const tdAcoes = document.createElement('td'); tdAcoes.className = 'actions';
        const editar = document.createElement('button'); editar.className = 'btn small secondary'; editar.textContent = 'Editar'; editar.addEventListener('click', () => abrirEdicao(u));
        const apagar = document.createElement('button'); apagar.className = 'btn small danger'; apagar.textContent = 'Apagar'; apagar.addEventListener('click', () => apagarUsuario(u));
        tdAcoes.append(editar, apagar); tr.appendChild(tdAcoes); tbody.appendChild(tr);
    });
}
function abrirEdicao(u) {
    document.getElementById('editId').value = u.id;
    const campos = {editNome:'nome',editSobrenome:'sobrenome',editCpf:'cpf',editEmail:'email',editSenha:'senha',editTelefone:'telefone',editRua:'rua',editCep:'cep',editCidade:'cidade',editEstado:'estado'};
    Object.entries(campos).forEach(([id,chave]) => document.getElementById(id).value = u[chave] || '');
    painelEdicao.classList.remove('hidden');
    painelEdicao.scrollIntoView({behavior:'smooth'});
}
async function apagarUsuario(u) {
    if (u.admin) { alert('O administrador principal não pode ser apagado por este painel.'); return; }
    if (!confirm(`Deseja realmente apagar o usuário ${u.nome} ${u.sobrenome || ''}?`)) return;
    const resposta = await fetch(`${API}/${u.id}`, {method:'DELETE'});
    if (resposta.ok) { mensagem.textContent = 'Usuário apagado com sucesso.'; mensagem.className = 'notice success'; carregarUsuarios(document.getElementById('buscaCpf').value); }
    else { mensagem.textContent = 'Não foi possível apagar o usuário.'; mensagem.className = 'notice error'; }
}
document.getElementById('formEdicao').addEventListener('submit', async e => {
    e.preventDefault();
    const id = document.getElementById('editId').value;
    const atual = usuariosCache.find(u => String(u.id) === String(id));
    const dados = {
        ...atual, nome:document.getElementById('editNome').value.trim(),
        sobrenome:document.getElementById('editSobrenome').value.trim(),
        cpf:document.getElementById('editCpf').value.trim(),
        email:document.getElementById('editEmail').value.trim(),
        senha:document.getElementById('editSenha').value,
        telefone:document.getElementById('editTelefone').value.trim(),
        rua:document.getElementById('editRua').value.trim(),
        cep:document.getElementById('editCep').value.trim(),
        cidade:document.getElementById('editCidade').value.trim(),
        estado:document.getElementById('editEstado').value.trim().toUpperCase()
    };
    const resposta = await fetch(`${API}/${id}`, {method:'PUT',headers:{'Content-Type':'application/json'},body:JSON.stringify(dados)});
    if (resposta.ok) {
        mensagem.textContent = 'Dados atualizados com sucesso.';
        mensagem.className = 'notice success'; painelEdicao.classList.add('hidden');
        carregarUsuarios(document.getElementById('buscaCpf').value);
    } else { mensagem.textContent = 'Erro ao atualizar os dados.'; mensagem.className = 'notice error'; }
});
document.getElementById('btnBuscar').addEventListener('click', () => carregarUsuarios(document.getElementById('buscaCpf').value));
document.getElementById('buscaCpf').addEventListener('keydown', e => { if (e.key === 'Enter') carregarUsuarios(e.target.value); });
document.getElementById('btnLimpar').addEventListener('click', () => { document.getElementById('buscaCpf').value=''; carregarUsuarios(); });
document.getElementById('btnCancelar').addEventListener('click', () => painelEdicao.classList.add('hidden'));
document.getElementById('btnSair').addEventListener('click', () => { sessionStorage.removeItem('sportzoneUsuario'); window.location.href='index.html'; });
carregarUsuarios();
