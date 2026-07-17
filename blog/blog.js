// Sem subir nível, pois posts/ está na mesma pasta que o blog.html e blog.js
const PASTA_POSTS = 'posts/';

function construirUrl(relativa) {
    return new URL(relativa, window.location.href).href;
}

const container = document.getElementById('conteudo-principal');
const linkVoltar = document.getElementById('link-voltar');

window.carregarListaDePosts = carregarListaDePosts;
window.carregarArtigo = carregarArtigo;

// Verifica se há um post específico na URL ao abrir a página
document.addEventListener('DOMContentLoaded', () => {
    const parametros = new URLSearchParams(window.location.search);
    const postParaCarregar = parametros.get('post');

    if (postParaCarregar) {
        carregarArtigo(postParaCarregar);
    } else {
        carregarListaDePosts();
    }
});

async function carregarListaDePosts() {
    // CORREÇÃO GITHUB PAGES: Limpa apenas os parâmetros de busca preservando todo o caminho do repositório
    const urlLimpa = window.location.href.split('?')[0];
    window.history.pushState({}, '', urlLimpa);

    linkVoltar.href = construirUrl('../index.html');
    linkVoltar.textContent = '← Home';
    linkVoltar.onclick = null; 

    container.innerHTML = '<p class="loader">Carregando lista de documentos...</p>';

    try {
        const resposta = await fetch(construirUrl(`${PASTA_POSTS}posts.json`));
        if (!resposta.ok) throw new Error('Não foi possível ler o arquivo posts.json');
        const nomesArquivos = await resposta.json();

        if (nomesArquivos.length === 0) {
            container.innerHTML = '<h1>Posts</h1><p>Nenhum post registrado no JSON ainda.</p>';
            return;
        }

        let tabelaHTML = `
            <h1>LIBREMILQ COMMUNITY POSTS</h1>
            <p class="post-intro">Selecione um post abaixo para iniciar a leitura:</p>
            <table>
                <thead>
                    <tr>
                        <th>TITULO</th>
                        <th>AUTOR</th>
                    </tr>
                </thead>
                <tbody>
        `;

        for (const nomeArquivo of nomesArquivos) {
            const caminhoCompleto = construirUrl(`${PASTA_POSTS}${nomeArquivo}`);
            try {
                const resPost = await fetch(caminhoCompleto);
                if (!resPost.ok) continue;

                const texto = await resPost.text();
                const metadados = extrairMetadados(texto, nomeArquivo);

                tabelaHTML += `
                    <tr>
                        <td>
                            <button class="link-titulo" onclick="carregarArtigo('${nomeArquivo}')">
                                ${metadados.titulo.toUpperCase()}
                            </button>
                        </td>
                        <td class="post-author">${metadados.autor}</td>
                    </tr>
                `;
            } catch (err) {
                console.error('Erro ao processar post:', nomeArquivo, err);
            }
        }

        tabelaHTML += `</tbody></table>`;
        container.innerHTML = tabelaHTML;

    } catch (erro) {
        container.innerHTML = `
            <h1 style="color: #ff5555;">[ ERROR ]</h1>
            <p>Falha ao carregar o arquivo de índice: <b>${erro.message}</b></p>
        `;
    }
}

async function carregarArtigo(nomeArquivo) {
    container.innerHTML = '<p class="loader">Carregando conteúdo do documento...</p>';
    
    // CORREÇÃO GITHUB PAGES: Atualiza os parâmetros sem perder o subdiretório do repositório
    const urlBase = window.location.href.split('?')[0];
    const novaURL = `${urlBase}?post=${encodeURIComponent(nomeArquivo)}`;
    window.history.pushState({}, '', novaURL);

    linkVoltar.href = '#';
    linkVoltar.textContent = '← Posts';
    linkVoltar.onclick = (e) => {
        e.preventDefault();
        carregarListaDePosts();
    };

    const caminhoCompleto = construirUrl(`${PASTA_POSTS}${nomeArquivo}`);

    try {
        const resposta = await fetch(caminhoCompleto);
        if (!resposta.ok) throw new Error('Documento físico não encontrado no servidor.');
        const texto = await resposta.text();

        let corpoMarkdown = texto;
        const metadados = extrairMetadados(texto, nomeArquivo);

        if (texto.startsWith('---')) {
            const partes = texto.split('---');
            if (partes.length >= 3) {
                corpoMarkdown = partes.slice(2).join('---').trim();
            }
        }

        const htmlConvertido = marked.parse(corpoMarkdown);

        container.innerHTML = `
            <div class="post-content">
                <p class="post-meta">// Author: ${metadados.autor}</p>
                <h1>${metadados.titulo.toUpperCase()}</h1>
                <div>${htmlConvertido}</div>
            </div>
        `;

    } catch (erro) {
        container.innerHTML = `
            <h1 style="color: #ff5555;">[ ERROR ]</h1>
            <p>Não foi possível carregar o arquivo: <b>${nomeArquivo}</b></p>
            <p style="color: #ffb86c;">Motivo: ${erro.message}</p>
        `;
    }
}

function extrairMetadados(texto, nomeArquivo) {
    let titulo = nomeArquivo.replace('.md', '').replace(/-/g, ' ');
    let autor = "Anonymous";

    if (texto.startsWith('---')) {
        const partes = texto.split('---');
        if (partes.length >= 3) {
            const cabecalho = partes[1];
            const linhas = cabecalho.split('\n');
            linhas.forEach(linha => {
                const [chave, ...valorPartes] = linha.split(':');
                if (chave && valorPartes.length > 0) {
                    const valor = valorPartes.join(':').trim();
                    if (chave.trim().toLowerCase() === 'title') titulo = valor;
                    if (chave.trim().toLowerCase() === 'author') autor = valor;
                }
            });
        }
    }
    return { titulo, autor };
}