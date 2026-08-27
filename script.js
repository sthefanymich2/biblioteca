// ==========================================
// DADOS INICIAIS
// ==========================================

let livros = JSON.parse(localStorage.getItem("livros")) || [

    {
        id: 1,
        titulo: "Dom Casmurro",
        autor: "Machado de Assis",
        categoria: "Literatura",
        ano: 1899,
        localizacao: "Estante A - Prateleira 1",
        sinopse: "Um dos grandes clássicos da literatura brasileira."
    },

    {
        id: 2,
        titulo: "O Pequeno Príncipe",
        autor: "Antoine de Saint-Exupéry",
        categoria: "Infantil",
        ano: 1943,
        localizacao: "Estante B - Prateleira 2",
        sinopse: "Uma história sobre amizade, amor e a importância de enxergar além das aparências."
    },

    {
        id: 3,
        titulo: "Viagem ao Centro da Terra",
        autor: "Júlio Verne",
        categoria: "Literatura",
        ano: 1864,
        localizacao: "Estante A - Prateleira 3",
        sinopse: "Uma aventura fantástica pelas profundezas do planeta."
    },

    {
        id: 4,
        titulo: "Uma Breve História do Tempo",
        autor: "Stephen Hawking",
        categoria: "Ciências",
        ano: 1988,
        localizacao: "Estante C - Prateleira 1",
        sinopse: "Uma introdução às principais ideias sobre o universo e a física."
    },

    {
        id: 5,
        titulo: "O Meu Pé de Laranja Lima",
        autor: "José Mauro de Vasconcelos",
        categoria: "Literatura",
        ano: 1968,
        localizacao: "Estante A - Prateleira 4",
        sinopse: "A emocionante história de Zezé e seu amigo imaginário."
    },

    {
        id: 6,
        titulo: "Atlas de Geografia",
        autor: "Editora Escolar",
        categoria: "Geografia",
        ano: 2024,
        localizacao: "Estante D - Prateleira 1",
        sinopse: "Material de apoio para estudos de geografia."
    }

];

let emprestimos =
    JSON.parse(localStorage.getItem("emprestimos")) || [];


// ==========================================
// SALVAR DADOS
// ==========================================

function salvarDados() {

    localStorage.setItem(
        "livros",
        JSON.stringify(livros)
    );

    localStorage.setItem(
        "emprestimos",
        JSON.stringify(emprestimos)
    );
}


// ==========================================
// VERIFICAR SE LIVRO ESTÁ EMPRESTADO
// ==========================================

function livroEmprestado(id) {

    return emprestimos.some(
        emprestimo => emprestimo.livroId === id
    );
}


// ==========================================
// MOSTRAR LIVROS
// ==========================================

function mostrarLivros() {

    const lista = document.getElementById("listaLivros");

    const pesquisa =
        document
            .getElementById("pesquisa")
            .value
            .toLowerCase();

    const categoria =
        document.getElementById("filtroCategoria").value;

    const filtrados = livros.filter(livro => {

        const correspondePesquisa =
            livro.titulo.toLowerCase().includes(pesquisa) ||
            livro.autor.toLowerCase().includes(pesquisa);

        const correspondeCategoria =
            categoria === "" ||
            livro.categoria === categoria;

        return correspondePesquisa && correspondeCategoria;

    });

    lista.innerHTML = "";

    if (filtrados.length === 0) {

        lista.innerHTML = `
            <p>Nenhum livro encontrado.</p>
        `;

        return;
    }

    filtrados.forEach(livro => {

        const emprestado =
            livroEmprestado(livro.id);

        const div = document.createElement("div");

        div.className = "livro";

        div.innerHTML = `

            <div class="capa">
                📖
            </div>

            <div class="livro-info">

                <span class="categoria">
                    ${livro.categoria}
                </span>

                <h3>
                    ${livro.titulo}
                </h3>

                <p class="autor">
                    ${livro.autor}
                </p>

                <p>
                    ${livro.sinopse}
                </p>

                <div class="detalhes">

                    <p>
                        📅 Ano: ${livro.ano}
                    </p>

                    <p>
                        📍 ${livro.localizacao}
                    </p>

                    <p class="${emprestado ? "emprestado" : "disponivel"}">

                        ${
                            emprestado
                            ? "🔴 Emprestado"
                            : "🟢 Disponível"
                        }

                    </p>

                </div>

                ${
                    !emprestado

                    ? `
                        <button
                            class="btn btn-emprestar"
                            onclick="abrirModal(${livro.id})"
                        >
                            Emprestar
                        </button>
                    `

                    : ""
                }

            </div>
        `;

        lista.appendChild(div);

    });

}


// ==========================================
// MODAL
// ==========================================

function abrirModal(id) {

    const livro =
        livros.find(livro => livro.id === id);

    if (!livro) return;

    document.getElementById("idLivro").value = id;

    document.getElementById(
        "livroSelecionado"
    ).innerHTML = `
        Livro selecionado:
        <strong>${livro.titulo}</strong>
    `;

    document.getElementById(
        "modalEmprestimo"
    ).style.display = "flex";

}


function fecharModal() {

    document.getElementById(
        "modalEmprestimo"
    ).style.display = "none";

}


// ==========================================
// REGISTRAR EMPRÉSTIMO
// ==========================================

document
    .getElementById("formEmprestimo")
    .addEventListener("submit", function(event) {

        event.preventDefault();

        const livroId =
            Number(
                document.getElementById("idLivro").value
            );

        const nome =
            document.getElementById("nomeAluno").value;

        const turma =
            document.getElementById("turmaAluno").value;

        const devolucao =
            document.getElementById("dataDevolucao").value;

        const hoje =
            new Date()
                .toISOString()
                .split("T")[0];

        emprestimos.push({

            id: Date.now(),

            livroId: livroId,

            aluno: nome,

            turma: turma,

            dataEmprestimo: hoje,

            dataDevolucao: devolucao

        });

        salvarDados();

        document
            .getElementById("formEmprestimo")
            .reset();

        fecharModal();

        atualizarTudo();

        alert("Empréstimo registrado com sucesso!");

    });


// ==========================================
// MOSTRAR EMPRÉSTIMOS
// ==========================================

function mostrarEmprestimos() {

    const tabela =
        document.getElementById(
            "tabelaEmprestimos"
        );

    tabela.innerHTML = "";

    if (emprestimos.length === 0) {

        tabela.innerHTML = `
            <tr>
                <td colspan="7">
                    Nenhum empréstimo registrado.
                </td>
            </tr>
        `;

        return;
    }

    emprestimos.forEach(emprestimo => {

        const livro =
            livros.find(
                livro =>
                    livro.id === emprestimo.livroId
            );

        if (!livro) return;

        const hoje = new Date();

        const dataDevolucao =
            new Date(
                emprestimo.dataDevolucao
            );

        const atrasado =
            hoje > dataDevolucao;

        const linha =
            document.createElement("tr");

        linha.innerHTML = `

            <td>
                ${emprestimo.aluno}
            </td>

            <td>
                ${emprestimo.turma}
            </td>

            <td>
                ${livro.titulo}
            </td>

            <td>
                ${formatarData(
                    emprestimo.dataEmprestimo
                )}
            </td>

            <td>
                ${formatarData(
                    emprestimo.dataDevolucao
                )}
            </td>

            <td class="
                status
                ${atrasado ? "atrasado" : "normal"}
            ">

                ${
                    atrasado
                    ? "⚠️ Atrasado"
                    : "🟢 Normal"
                }

            </td>

            <td>

                <button
                    class="btn-devolver"
                    onclick="
                        devolverLivro(${emprestimo.id})
                    "
                >
                    Devolver
                </button>

            </td>

        `;

        tabela.appendChild(linha);

    });

}


// ==========================================
// DEVOLVER LIVRO
// ==========================================

function devolverLivro(id) {

    const confirmar =
        confirm(
            "Confirmar devolução deste livro?"
        );

    if (!confirmar) return;

    emprestimos =
        emprestimos.filter(
            emprestimo =>
                emprestimo.id !== id
        );

    salvarDados();

    atualizarTudo();

}


// ==========================================
// CADASTRAR LIVRO
// ==========================================

document
    .getElementById("formLivro")
    .addEventListener("submit", function(event) {

        event.preventDefault();

        const novoLivro = {

            id: Date.now(),

            titulo:
                document.getElementById(
                    "titulo"
                ).value,

            autor:
                document.getElementById(
                    "autor"
                ).value,

            categoria:
                document.getElementById(
                    "categoria"
                ).value,

            ano:
                Number(
                    document.getElementById(
                        "ano"
                    ).value
                ),

            localizacao:
                document.getElementById(
                    "localizacao"
                ).value,

            sinopse:
                document.getElementById(
                    "sinopse"
                ).value

        };

        livros.push(novoLivro);

        salvarDados();

        document
            .getElementById("formLivro")
            .reset();

        atualizarTudo();

        alert(
            "Livro cadastrado com sucesso!"
        );

        document
            .getElementById("catalogo")
            .scrollIntoView();

    });


// ==========================================
// ESTATÍSTICAS
// ==========================================

function atualizarEstatisticas() {

    const total =
        livros.length;

    const emprestados =
        emprestimos.length;

    const disponiveis =
        total - emprestados;

    const hoje =
        new Date();

    const atrasados =
        emprestimos.filter(
            emprestimo =>
                new Date(
                    emprestimo.dataDevolucao
                ) < hoje
        ).length;

    document.getElementById(
        "totalLivros"
    ).textContent = total;

    document.getElementById(
        "livrosDisponiveis"
    ).textContent = disponiveis;

    document.getElementById(
        "livrosEmprestados"
    ).textContent = emprestados;

    document.getElementById(
        "livrosAtrasados"
    ).textContent = atrasados;

}


// ==========================================
// FORMATAR DATA
// ==========================================

function formatarData(data) {

    if (!data) return "-";

    const partes =
        data.split("-");

    return `${partes[2]}/${partes[1]}/${partes[0]}`;

}


// ==========================================
// ATUALIZAR SITE
// ==========================================

function atualizarTudo() {

    mostrarLivros();

    mostrarEmprestimos();

    atualizarEstatisticas();

}


// ==========================================
// PESQUISA
// ==========================================

document
    .getElementById("pesquisa")
    .addEventListener(
        "input",
        mostrarLivros
    );


document
    .getElementById("filtroCategoria")
    .addEventListener(
        "change",
        mostrarLivros
    );


// ==========================================
// INICIAR
// ==========================================

atualizarTudo();
