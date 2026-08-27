CREATE DATABASE IF NOT EXISTS biblioteca_escolar
CHARACTER SET utf8mb4
COLLATE utf8mb4_unicode_ci;

USE biblioteca_escolar;

-- ==========================================
-- TABELA DE ALUNOS
-- ==========================================

CREATE TABLE alunos (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(150) NOT NULL,
    turma VARCHAR(50) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ==========================================
-- TABELA DE LIVROS
-- ==========================================

CREATE TABLE livros (
    id INT AUTO_INCREMENT PRIMARY KEY,
    titulo VARCHAR(200) NOT NULL,
    autor VARCHAR(150) NOT NULL,
    categoria VARCHAR(100) NOT NULL,
    ano_publicacao YEAR,
    localizacao VARCHAR(150),
    sinopse TEXT,
    disponivel BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ==========================================
-- TABELA DE EMPRÉSTIMOS
-- ==========================================

CREATE TABLE emprestimos (
    id INT AUTO_INCREMENT PRIMARY KEY,

    livro_id INT NOT NULL,
    aluno_id INT NOT NULL,

    data_emprestimo DATE NOT NULL,
    data_devolucao DATE NOT NULL,
    data_devolucao_real DATE NULL,

    status ENUM(
        'emprestado',
        'devolvido'
    ) DEFAULT 'emprestado',

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY (livro_id)
        REFERENCES livros(id)
        ON DELETE RESTRICT
        ON UPDATE CASCADE,

    FOREIGN KEY (aluno_id)
        REFERENCES alunos(id)
        ON DELETE RESTRICT
        ON UPDATE CASCADE
);

-- ==========================================
-- LIVROS DE EXEMPLO
-- ==========================================

INSERT INTO livros
(titulo, autor, categoria, ano_publicacao, localizacao, sinopse)
VALUES

(
    'Dom Casmurro',
    'Machado de Assis',
    'Literatura',
    1899,
    'Estante A - Prateleira 1',
    'Um dos grandes clássicos da literatura brasileira.'
),

(
    'O Pequeno Príncipe',
    'Antoine de Saint-Exupéry',
    'Infantil',
    1943,
    'Estante B - Prateleira 2',
    'Uma história sobre amizade, amor e a importância de enxergar além das aparências.'
),

(
    'Viagem ao Centro da Terra',
    'Júlio Verne',
    'Literatura',
    1864,
    'Estante A - Prateleira 3',
    'Uma aventura fantástica pelas profundezas do planeta.'
),

(
    'Uma Breve História do Tempo',
    'Stephen Hawking',
    'Ciências',
    1988,
    'Estante C - Prateleira 1',
    'Uma introdução às principais ideias sobre o universo e a física.'
),

(
    'O Meu Pé de Laranja Lima',
    'José Mauro de Vasconcelos',
    'Literatura',
    1968,
    'Estante A - Prateleira 4',
    'A emocionante história de Zezé e seu amigo imaginário.'
),

(
    'Atlas de Geografia',
    'Editora Escolar',
    'Geografia',
    2024,
    'Estante D - Prateleira 1',
    'Material de apoio para estudos de geografia.'
);

SELECT *
FROM livros
ORDER BY titulo;

SELECT *
FROM livros
WHERE titulo LIKE '%Harry%'
   OR autor LIKE '%Harry%';
   
   SELECT *
FROM livros
WHERE disponivel = TRUE;

SELECT
    e.id,
    a.nome AS aluno,
    a.turma,
    l.titulo AS livro,
    e.data_emprestimo,
    e.data_devolucao,
    e.status
FROM emprestimos e
INNER JOIN alunos a
    ON e.aluno_id = a.id
INNER JOIN livros l
    ON e.livro_id = l.id
ORDER BY e.data_devolucao;

SELECT
    e.id,
    a.nome AS aluno,
    a.turma,
    l.titulo AS livro,
    e.data_devolucao
FROM emprestimos e
INNER JOIN alunos a
    ON e.aluno_id = a.id
INNER JOIN livros l
    ON e.livro_id = l.id
WHERE e.status = 'emprestado'
AND e.data_devolucao < CURDATE();

INSERT INTO alunos (nome, turma)
VALUES ('João da Silva', '8º A');

INSERT INTO emprestimos
(
    livro_id,
    aluno_id,
    data_emprestimo,
    data_devolucao
)
VALUES
(
    1,
    1,
    CURDATE(),
    '2026-09-10'
);

UPDATE livros
SET disponivel = FALSE
WHERE id = 1;

UPDATE emprestimos
SET
    status = 'devolvido',
    data_devolucao_real = CURDATE()
WHERE id = 1;

UPDATE livros
SET disponivel = TRUE
WHERE id = 1;








