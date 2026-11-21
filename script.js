const links = document.querySelectorAll('.links a');
const menu = document.getElementById('menuLinks');
const botaoMenu = document.getElementById('menuToggle');
const cabecalho = document.querySelector('header');
const botaoTopo = document.getElementById('voltarTopo');

for (let i = 0; i < links.length; i++) {
    links[i].addEventListener('click', function (evento) {
        evento.preventDefault();
        const secao = document.querySelector(this.getAttribute('href'));
        secao.scrollIntoView({ behavior: 'smooth' });
        menu.classList.remove('ativo');
    });
}

botaoMenu.addEventListener('click', function () {
    menu.classList.toggle('ativo');
});

document.getElementById('btnSaibaMais').addEventListener('click', function () {
    document.getElementById('sobre').scrollIntoView({ behavior: 'smooth' });
});

let contadoresAnimados = false;

window.addEventListener('scroll', function () {
    if (window.scrollY > 100) {
        cabecalho.classList.add('rolado');
    } else {
        cabecalho.classList.remove('rolado');
    }

    if (window.scrollY > 600) {
        botaoTopo.style.display = 'block';
    } else {
        botaoTopo.style.display = 'none';
    }

    const estatisticas = document.querySelector('.estatisticas');
    const posicao = estatisticas.getBoundingClientRect().top;

    if (posicao < window.innerHeight && contadoresAnimados == false) {
        contadoresAnimados = true;
        animarContadores();
    }
});

botaoTopo.addEventListener('click', function () {
    window.scrollTo({ top: 0, behavior: 'smooth' });
});

function animarContadores() {
    const contadores = document.querySelectorAll('.contador');

    for (let i = 0; i < contadores.length; i++) {
        const contador = contadores[i];
        const valorFinal = Number(contador.getAttribute('data-valor'));
        const passo = Math.ceil(valorFinal / 100);
        let valorAtual = 0;

        const intervalo = setInterval(function () {
            valorAtual = valorAtual + passo;

            if (valorAtual >= valorFinal) {
                valorAtual = valorFinal;
                clearInterval(intervalo);
            }

            contador.textContent = valorAtual;
        }, 20);
    }
}

async function converterMoeda() {
    const valor = Number(document.getElementById('valorBRL').value);
    const resultado = document.getElementById('resultadoConversao');

    if (valor <= 0) {
        resultado.innerHTML = '<p class="texto-erro">Digite um valor válido.</p>';
        document.getElementById('impactoDoacao').innerHTML = '';
        return;
    }

    resultado.innerHTML = '<p>Carregando cotação...</p>';

    try {
        const resposta = await fetch('https://economia.awesomeapi.com.br/json/last/USD-BRL,EUR-BRL');
        const dados = await resposta.json();

        const dolar = Number(dados.USDBRL.bid);
        const euro = Number(dados.EURBRL.bid);

        const valorDolar = valor / dolar;
        const valorEuro = valor / euro;

        resultado.innerHTML = `
            <h4>Sua doação de R$ ${valor.toFixed(2)} vale:</h4>
            <div class="conversao-item">
                <p>Dólar (USD)</p>
                <p class="valor">US$ ${valorDolar.toFixed(2)}</p>
                <small>Cotação: 1 USD = R$ ${dolar.toFixed(2)}</small>
            </div>
            <div class="conversao-item">
                <p>Euro (EUR)</p>
                <p class="valor">€ ${valorEuro.toFixed(2)}</p>
                <small>Cotação: 1 EUR = R$ ${euro.toFixed(2)}</small>
            </div>
        `;
    } catch (erro) {
        resultado.innerHTML = '<p class="texto-erro">Erro ao buscar a cotação. Tente novamente.</p>';
    }

    calcularImpacto(valor);
}

function calcularImpacto(valor) {
    const impacto = document.getElementById('impactoDoacao');

    if (valor < 25) {
        impacto.innerHTML = '<h4>Impacto da sua doação:</h4><p>Toda ajuda faz diferença!</p>';
        return;
    }

    const cestas = Math.floor(valor / 50);
    const materiais = Math.floor(valor / 30);
    const consultas = Math.floor(valor / 40);
    const kits = Math.floor(valor / 25);

    impacto.innerHTML = `
        <h4>Com esse valor você pode garantir:</h4>
        <ul class="impacto-lista">
            <li>${cestas} cesta(s) básica(s)</li>
            <li>${materiais} kit(s) de material escolar</li>
            <li>${consultas} consulta(s) médica(s)</li>
            <li>${kits} kit(s) de higiene</li>
        </ul>
    `;
}

document.getElementById('btnConverter').addEventListener('click', converterMoeda);

const campoNome = document.getElementById('nomeVoluntario');
const campoEmail = document.getElementById('emailVoluntario');
const campoTelefone = document.getElementById('telefoneVoluntario');
const campoSenha = document.getElementById('senhaVoluntario');
const campoCep = document.getElementById('cepVoluntario');

function mostrarMensagem(campo, idFeedback, texto, valido) {
    const feedback = document.getElementById(idFeedback);
    feedback.textContent = texto;

    if (valido) {
        feedback.style.color = '#27ae60';
        campo.style.borderColor = '#27ae60';
    } else {
        feedback.style.color = '#e74c3c';
        campo.style.borderColor = '#e74c3c';
    }
}

function nomeValido() {
    return campoNome.value.trim().length >= 3;
}

function emailValido() {
    const padrao = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return padrao.test(campoEmail.value);
}

function telefoneValido() {
    const numeros = campoTelefone.value.replace(/\D/g, '');
    return numeros.length == 10 || numeros.length == 11;
}

function senhaValida() {
    return campoSenha.value.length >= 8;
}

campoNome.addEventListener('input', function () {
    if (nomeValido()) {
        mostrarMensagem(campoNome, 'feedbackNome', 'Nome válido', true);
    } else {
        mostrarMensagem(campoNome, 'feedbackNome', 'O nome precisa ter pelo menos 3 letras', false);
    }
});

campoEmail.addEventListener('input', function () {
    if (emailValido()) {
        mostrarMensagem(campoEmail, 'feedbackEmail', 'Email válido', true);
    } else {
        mostrarMensagem(campoEmail, 'feedbackEmail', 'Email inválido', false);
    }
});

campoTelefone.addEventListener('input', function () {
    if (telefoneValido()) {
        mostrarMensagem(campoTelefone, 'feedbackTelefone', 'Telefone válido', true);
    } else {
        mostrarMensagem(campoTelefone, 'feedbackTelefone', 'Digite o DDD e o número', false);
    }
});

campoSenha.addEventListener('input', function () {
    if (senhaValida()) {
        mostrarMensagem(campoSenha, 'feedbackSenha', 'Senha válida', true);
    } else {
        const faltam = 8 - campoSenha.value.length;
        mostrarMensagem(campoSenha, 'feedbackSenha', 'Faltam ' + faltam + ' caractere(s)', false);
    }
});

async function buscarCEP() {
    const cep = campoCep.value.replace(/\D/g, '');

    if (cep.length != 8) {
        mostrarMensagem(campoCep, 'feedbackCEP', 'O CEP precisa ter 8 números', false);
        return;
    }

    document.getElementById('feedbackCEP').textContent = 'Buscando...';

    try {
        const resposta = await fetch('https://viacep.com.br/ws/' + cep + '/json/');
        const dados = await resposta.json();

        if (dados.erro) {
            mostrarMensagem(campoCep, 'feedbackCEP', 'CEP não encontrado', false);
            return;
        }

        document.getElementById('ruaVoluntario').value = dados.logradouro;
        document.getElementById('bairroVoluntario').value = dados.bairro;
        document.getElementById('cidadeVoluntario').value = dados.localidade;
        document.getElementById('estadoVoluntario').value = dados.uf;

        mostrarMensagem(campoCep, 'feedbackCEP', 'Endereço encontrado', true);
        document.getElementById('numeroVoluntario').focus();
    } catch (erro) {
        mostrarMensagem(campoCep, 'feedbackCEP', 'Erro ao buscar o CEP', false);
    }
}

campoCep.addEventListener('blur', buscarCEP);
document.getElementById('btnBuscarCEP').addEventListener('click', buscarCEP);

document.getElementById('formVoluntario').addEventListener('submit', function (evento) {
    evento.preventDefault();

    const rua = document.getElementById('ruaVoluntario').value;
    const numero = document.getElementById('numeroVoluntario').value;
    const cidade = document.getElementById('cidadeVoluntario').value;
    const disponibilidade = document.getElementById('disponibilidade').value;
    const area = document.getElementById('areaInteresse').value;
    const mensagem = document.getElementById('mensagemSucesso');

    if (!nomeValido() || !emailValido() || !telefoneValido() || !senhaValida()) {
        mensagem.style.display = 'block';
        mensagem.className = 'mensagem-sucesso erro';
        mensagem.textContent = 'Corrija os campos marcados em vermelho.';
        return;
    }

    if (rua == '' || numero == '' || cidade == '' || disponibilidade == '' || area == '') {
        mensagem.style.display = 'block';
        mensagem.className = 'mensagem-sucesso erro';
        mensagem.textContent = 'Preencha todos os campos do endereço e escolha as opções.';
        return;
    }

    mensagem.style.display = 'block';
    mensagem.className = 'mensagem-sucesso';
    mensagem.textContent = 'Obrigado, ' + campoNome.value + '! Seu cadastro foi feito. Vamos te mandar um email em ' + campoEmail.value + '.';

    this.reset();

    const feedbacks = document.querySelectorAll('.feedback');
    for (let i = 0; i < feedbacks.length; i++) {
        feedbacks[i].textContent = '';
    }

    const campos = [campoNome, campoEmail, campoTelefone, campoSenha, campoCep];
    for (let i = 0; i < campos.length; i++) {
        campos[i].style.borderColor = '';
    }
});

const botoesDoar = document.querySelectorAll('.btn-doar');

for (let i = 0; i < botoesDoar.length; i++) {
    botoesDoar[i].addEventListener('click', function () {
        document.querySelector('.formulario-doacao').scrollIntoView({ behavior: 'smooth' });
    });
}

document.getElementById('formDoacao').addEventListener('submit', function (evento) {
    evento.preventDefault();

    const nome = document.getElementById('doacaoNome').value;
    const valor = Number(document.getElementById('doacaoValor').value);
    const mensagem = document.getElementById('mensagemDoacao');

    if (nome == '' || valor <= 0) {
        mensagem.style.color = '#e74c3c';
        mensagem.textContent = 'Preencha seu nome e um valor maior que zero.';
        return;
    }

    mensagem.style.color = '#27ae60';
    mensagem.textContent = 'Obrigado, ' + nome + '! Sua doação de R$ ' + valor.toFixed(2) + ' foi registrada.';
    this.reset();
});

const campoMensagem = document.getElementById('contatoMensagem');
const contadorCaracteres = document.getElementById('contadorCaracteres');

campoMensagem.addEventListener('input', function () {
    contadorCaracteres.textContent = campoMensagem.value.length + '/500 caracteres';
});

document.getElementById('formContato').addEventListener('submit', function (evento) {
    evento.preventDefault();

    const nome = document.getElementById('contatoNome').value;
    const email = document.getElementById('contatoEmail').value;
    const mensagem = document.getElementById('mensagemContato');

    if (nome == '' || email == '' || campoMensagem.value == '') {
        mensagem.style.color = '#e74c3c';
        mensagem.textContent = 'Preencha todos os campos.';
        return;
    }

    mensagem.style.color = '#27ae60';
    mensagem.textContent = 'Mensagem enviada! Obrigado pelo contato.';
    this.reset();
    contadorCaracteres.textContent = '0/500 caracteres';
});

function criarMapa() {
    const mapa = L.map('mapa').setView([-23.5555, -46.6350], 13);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap'
    }).addTo(mapa);

    const pontos = [
        { nome: 'Sede - ONG Esperança', endereco: 'Rua da Solidariedade, 123', lat: -23.5505, lng: -46.6333 },
        { nome: 'Ponto de Coleta - Liberdade', endereco: 'Praça da Liberdade', lat: -23.5557, lng: -46.6353 },
        { nome: 'Ponto de Coleta - Paulista', endereco: 'Av. Paulista, 1000', lat: -23.5641, lng: -46.6524 },
        { nome: 'Ponto de Coleta - Mooca', endereco: 'Rua da Mooca, 500', lat: -23.5579, lng: -46.6058 }
    ];

    for (let i = 0; i < pontos.length; i++) {
        const ponto = pontos[i];
        const marcador = L.marker([ponto.lat, ponto.lng]).addTo(mapa);
        marcador.bindPopup('<b>' + ponto.nome + '</b><br>' + ponto.endereco);
    }

    L.circle([-23.5505, -46.6333], {
        color: '#3498db',
        fillOpacity: 0.1,
        radius: 1000
    }).addTo(mapa);
}

criarMapa();
