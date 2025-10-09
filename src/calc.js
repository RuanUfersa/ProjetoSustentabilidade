// Importa o estado do jogo e o catálogo de objetos do app.js
import { gameState, getObjetoDetalhes } from './app.js'; // AGORA IMPORTA getObjetoDetalhes!

/**
 * Calcula e atualiza o Saldo e a Satisfação do jogador com base na resposta.
 * @param {number} respostaCorretaID - ID do objeto que deveria ter sido escolhido.
 * @param {string} classification - Classificação do tempo ('RÁPIDA', 'LENTA', 'ESGOTADO').
 * @param {boolean} isCorrect - Se a resposta selecionada é a correta.
 * @returns {object} Um objeto contendo a mensagem de feedback, o resultado e o status de Fim de Jogo.
 */
export function calculateScore(respostaCorretaID, classification, isCorrect) {
    
    // Obtém os detalhes do objeto correto usando a função importada
    const objetoCorreto = getObjetoDetalhes(respostaCorretaID);
    const custoCorreto = objetoCorreto.custo;
    const pontuacaoCorreta = objetoCorreto.pontuacao;
    
    let message = '';
    let saldoChange = 0;
    let satisfacaoChange = 0;
    let gameOver = false;

    // --- CÁLCULO PARA RESPOSTA CORRETA ---
    if (isCorrect) {
        
        // 1. DÉBITO DO CUSTO (RF04)
        saldoChange = -custoCorreto; 
        
        // 2. AUMENTO DA SATISFAÇÃO (RF05)
        satisfacaoChange = pontuacaoCorreta;
        
        if (classification === 'RÁPIDA') {
            // RF04: BÔNUS DE SALDO (Regra: Pontuação_Satisfação × 0.5 × Custo_Objeto)
            const bonusValue = pontuacaoCorreta * 0.5 * custoCorreto;
            saldoChange += bonusValue;
            message = `CORRETO e RÁPIDO! + BÔNUS de R$ ${bonusValue.toFixed(2).replace('.', ',')}.`;

        } else if (classification === 'LENTA') {
            // Sem bônus ou penalidade adicional
            message = `CORRETO, mas LENTO. Pontos de acessibilidade ganhos.`;
        }
    
    // --- CÁLCULO PARA RESPOSTA INCORRETA OU TEMPO ESGOTADO ---
    } else {
        
        // 1. PENALIDADE DE SALDO (RF04)
        // Regra: Saldo - Custo do Objeto CORRETO
        saldoChange = -custoCorreto; 
        
        // 2. PENALIDADE DE SATISFAÇÃO (RF05)
        // Regra: Diminui em - Pontuação do Objeto CORRETO
        satisfacaoChange = -pontuacaoCorreta; 

        if (classification === 'ESGOTADO') {
            message = `TEMPO ESGOTADO! Penalidade de R$ ${custoCorreto.toFixed(2).replace('.', ',')} no saldo e perda de satisfação.`;
        } else {
            message = `INCORRETO! Penalidade de R$ ${custoCorreto.toFixed(2).replace('.', ',')} no saldo e perda de satisfação.`;
        }
    }
    
    // 3. ATUALIZAÇÃO DO ESTADO GLOBAL
    gameState.saldo += saldoChange;
    gameState.satisfacao += satisfacaoChange;

    // 4. VERIFICAÇÃO DE FALÊNCIA (RF04 - Condição de Fim de Jogo)
    if (gameState.saldo < 0) {
        gameOver = true;
        message = "FALÊNCIA! Seu saldo ficou negativo. FIM DE JOGO.";
    }

    // Garante que a Satisfação não fique negativa (boa prática)
    if (gameState.satisfacao < 0) {
        gameState.satisfacao = 0;
    }

    return {
        message: message,
        isCorrect: isCorrect,
        gameOver: gameOver // Retorna o status de Fim de Jogo
    };
}