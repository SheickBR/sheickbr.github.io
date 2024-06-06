document.getElementById('calcular').addEventListener('click', function() {
    const textoVaga = document.getElementById('vaga').value.toLowerCase();
    const textoCurriculo = document.getElementById('curriculo').value.toLowerCase();

    // Lista de stopwords em português
    const stopWords = [
        "a", "à", "ao", "aos", "as", "às", "de", "da", "das", "do", "dos",
        "e", "em", "na", "nas", "no", "nos", "o", "os", "um", "uma", "umas", "uns",
        "com", "por", "para", "que", "se", "não", "sim", "como", "mas", "ou", "nem",
        "também", "mais", "então", "são", "foi", "era", "é", "são", "ser", "tem",
        "há", "já", "está", "sendo", "pelo", "pelos", "pela", "pelas", "sobre", "etc", "time", "atribuicoes",
        "qual", "quem", "que", "papel", "nossos", "sera", "requisitos", "qualificações", "esperamos", "você", "atribuições",
        "sera", "seu", "time", "momentos", "operar", "rapida", "usando", "maneira", "padroes", "cenarios", "ter", "atuar",
        "uso", "tiver"
    ];

    // Função para normalizar texto removendo acentos e pontuações
    function normalize(text) {
        return text.normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^\w\s]/gi, '');
    }

    // Função para tokenização e remoção de stopwords
    function tokenizeAndFilter(text) {
        const doc = nlp(text);
        const tokens = doc.terms().out('array');
        return tokens.filter(word => !stopWords.includes(word)).map(word => normalize(word.toLowerCase()));
    }

    const filteredTokensVaga = tokenizeAndFilter(textoVaga);
    const filteredTokensCurriculo = tokenizeAndFilter(textoCurriculo);

    // Função para calcular TF-IDF
    function calculateTFIDF(docs) {
        const tfidf = {};
        const docCount = docs.length;

        // Contagem de termos
        docs.forEach((doc, docIndex) => {
            const terms = doc.split(/\s+/);
            const termFreq = {};

            terms.forEach(term => {
                if (!termFreq[term]) {
                    termFreq[term] = 0;
                }
                termFreq[term]++;
            });

            Object.keys(termFreq).forEach(term => {
                const tf = termFreq[term] / terms.length;

                if (!tfidf[term]) {
                    tfidf[term] = { tf: [], idf: 0 };
                }
                tfidf[term].tf[docIndex] = tf;
            });
        });

        // Calculando IDF
        Object.keys(tfidf).forEach(term => {
            const df = tfidf[term].tf.filter(f => f > 0).length;
            tfidf[term].idf = Math.log(docCount / (df + 1)) + 1; // Suavização
        });

        return tfidf;
    }

    const docs = [filteredTokensVaga.join(' '), filteredTokensCurriculo.join(' ')];
    const tfidf = calculateTFIDF(docs);

    let commonTerms = [];
    Object.keys(tfidf).forEach(term => {
        if (filteredTokensCurriculo.includes(term) && filteredTokensVaga.includes(term)) {
            commonTerms.push(term);
        }
    });

    const porcentagem = (commonTerms.length / filteredTokensVaga.length) * 100;

    let resultado = `Aderência: ${porcentagem.toFixed(2)}%<br><br>`;
    resultado += `Palavras em comum:<br> ${[...new Set(commonTerms)].join(', ')}`;

    document.getElementById('resultado').innerHTML = resultado;

    // Sugestão de termos a serem incluídos no currículo
    const termosSugeridos = filteredTokensVaga.filter(term => !filteredTokensCurriculo.includes(term));
    let sugestao = `Sugestões de termos a serem incluídos no currículo:<br> ${[...new Set(termosSugeridos)].join(', ')}`;

    document.getElementById('sugestao').innerHTML = sugestao;
});
