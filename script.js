document.getElementById('calcular').addEventListener('click', function() {
    const textoVaga = document.getElementById('vaga').value.toLowerCase();
    const textoCurriculo = document.getElementById('curriculo').value.toLowerCase();
    
    // Tratando as palavras a ignorar para considerar vírgulas
    const palavrasIgnorarRaw = document.getElementById('ignore').value.toLowerCase();
    const palavrasIgnorar = palavrasIgnorarRaw.split(/[,\s]+/).filter(word => word.trim() !== "");

    const stopWords = [
        "a", "à", "ao", "aos", "as", "às", "de", "da", "das", "do", "dos", "acoes", "apoiar", "quanto", "relacionadas", "nestas", "tecnologias",
        "e", "em", "na", "nas", "no", "nos", "o", "os", "um", "uma", "umas", "uns", "voce","qualificacoes", "companhia", "sua", "dentro",
        "com", "por", "para", "se", "não", "sim", "como", "mas", "ou", "nem", "geral", "estrutura", "entre", "outras", "nosso", "junto", "atuacao",
        "também", "mais", "então", "são", "foi", "era", "é", "ser", "tem", "identificacao", "visao", "or", "on", "tudo", "auxiliar", "fabricante",
        "há", "já", "está", "sendo", "pelo", "pelos", "pela", "pelas", "sobre", "etc", "time","times", "atribuicoes", "ser", "promotora", "impactam",
        "qual", "quem", "que", "papel", "nossos", "sera", "requisitos", "qualificações", "esperamos", "você", "atribuições", "dar", "necessario","possua",
        "será", "seu", "momentos", "operar", "rapida", "usando", "maneira", "padrões", "cenarios", "ter", "atuar","menos", "preferencialmente", "bons", "entendimento", 
        "uso", "tiver", "baseados", "participativa", "interação", "outros", "pessoa", "conquista", "projetar", "enfase", "orientar", "demais", "bom",
        "atendendo", "solicitações", "ações", "modo", "tempo", "diminuir", "ênfase", "solucoes", "possibilitar", "abstraindo", "camada", "manter", "areas",
        "trata", "las", "completo", "final", "pontos", "boas", "auto", "enviar", "criar", "basico", "desejavel", "superior", "ocorra", "incluindo", "todas",
        "fazer", "realizar", "atividades", "montar", "atraves", "providenciando", "cuidar", "fim", "especifico", "sistema", "suas", "minas", "vaga", "vagas", "elaborar", "monitorar",
        "conforme", "necessidade", "todo", "todos", "toda", "todas", "grupos", "grupo", "itens", "setor", "lancando", "medio", "desejaveis", "minimo", "utilizandose", "prover",
        "partir", "parte", "precisa", "eou", "minimamente", "exercer", "atual"
    ];

    // Adicionando as palavras a serem ignoradas às stopWords
    const allStopWords = [...new Set([...stopWords, ...palavrasIgnorar])];

    function normalize(text) {
        return text.normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^\w\s]/gi, '');
    }

    function tokenizeAndFilter(text) {
        return text.split(/\s+/)
            .map(word => normalize(word.toLowerCase()))
            .filter(word => !allStopWords.includes(word));
    }

    const filteredTokensVaga = tokenizeAndFilter(textoVaga);
    const filteredTokensCurriculo = tokenizeAndFilter(textoCurriculo);

    let commonTerms = [];
    filteredTokensVaga.forEach(term => {
        if (filteredTokensCurriculo.includes(term)) {
            commonTerms.push(term);
        }
    });

    const porcentagem = (commonTerms.length / filteredTokensVaga.length) * 100;

    let resultado = `Aderência: ${porcentagem.toFixed(2)}%<br><br>`;
    resultado += `Palavras em comum:<br> ${[...new Set(commonTerms)].join(', ')}`;

    document.getElementById('resultado').innerHTML = resultado;

    // Removendo palavras ignoradas das sugestões
    const termosSugeridos = filteredTokensVaga.filter(term => !filteredTokensCurriculo.includes(term) && !allStopWords.includes(term));
    let sugestao = `Sugestões de termos a serem incluídos no currículo:<br> ${[...new Set(termosSugeridos)].join(', ')}`;

    document.getElementById('sugestao').innerHTML = sugestao;
});
