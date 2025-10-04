// src/calc.js
import { gameState } from './app.js'; // Importa o estado do jogo para alteração

// ----------------------------------------------------------------------
// CATÁLOGO DE OBJETOS (Custo e Pontuação) - REF: Regras/valores/Requisitos - Regras/Valores.csv
// ----------------------------------------------------------------------
const catalogo = [
    { id: 1, nome: "Corrimão", pontuacao: 50, custo: 500.00 },
    { id: 2, nome: "Assento Comum", pontuacao: 20, custo: 200.00 },
    { id: 3, nome: "Assento Reservado", pontuacao: 40, custo: 400.00 },
    { id: 4, nome: "Porta Acessível", pontuacao: 50, custo: 500.00 },
    { id: 5, nome: "Barra de Apoio", pontuacao: 30, custo: 300.00 },
    { id: 6, nome: "Cadeira para Obesos", pontuacao: 50, custo: 500.00 },
    { id: 7, nome: "Rampa de Acesso", pontuacao: 80, custo: 1200.00 },
    { id: 8, nome: "Piso Tátil de Alerta", pontuacao: 60, custo: 600.00 },
    { id: 9, nome: "Sinalização em Braille/Relevo", pontuacao: 40, custo: 400.00 },
    { id: 10, nome: "Sala de Amamentação", pontuacao: 100, custo: 3000.00 },
    { id: 11, nome: "Semáforos Sonoros", pontuacao: 70, custo: 900.00 }
];

const getObjetoDetalhes = (id) => catalogo.find(item => item.id === id);


/**
 * Calcula e atualiza o Saldo e a Satisfação do jogador com base na resposta.
 * @param {number} respostaCorretaID - ID do objeto que deveria ter sido escolhido.
 * @param {string} classification - Classificação do tempo ('RÁPIDA', 'LENTA', 'ESGOTADO').
 * @param {boolean} isCorrect - Se a resposta selecionada é a correta.
 * @returns {object} Um objeto contendo a mensagem de feedback e o saldo/satisfação alterados.
 */
export function calculateScore(respostaCorretaID, classification, isCorrect) {
    
    const objetoCorreto = getObjetoDetalhes(respostaCorretaID);
    const custoCorreto = objetoCorreto.custo;
    const pontuacaoCorreta = objetoCorreto.pontuacao;
    
    let message = '';
    let saldoChange = 0;
    let satisfacaoChange = 0;

    // --- CÁLCULO PARA RESPOSTA CORRETA ---
    if (isCorrect) {
        
        // 1. DÉBITO DO CUSTO (RF04)
        saldoChange = -custoCorreto; // Sempre debita o custo
        
        // 2. AUMENTO DA SATISFAÇÃO (RF05)
        satisfacaoChange = pontuacaoCorreta;
        
        message = `CORRETO e ${classification}!`;

        if (classification === 'RÁPIDA') {
            // BÔNUS DE SALDO (Regra: Pontuação_Satisfação × 0.5 × Custo_Objeto)
            const bonus = pontuacaoCorreta * 0.5 * custoCorreto;
            saldoChange += bonus;
            message += ` + BÔNUS DE R$ ${bonus.toFixed(2).replace('.', ',')}!`;

        } else if (classification === 'LENTA') {
            // Sem bônus ou penalidade adicional
            message += ' (Sem bônus)';
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
            message = `TEMPO ESGOTADO! Penalidade de R$ ${custoCorreto.toFixed(2).replace('.', ',')} no saldo.`;
        } else {
            message = `INCORRETO! Penalidade de R$ ${custoCorreto.toFixed(2).replace('.', ',')} no saldo.`;
        }
    }
    
    // 3. ATUALIZAÇÃO DO ESTADO GLOBAL (RF04, RF05)
    gameState.saldo += saldoChange;
    gameState.satisfacao += satisfacaoChange;

    // O Saldo pode ser negativo (Dúvida 2: Opção A)
    // A Satisfação pode ser negativa.

    return {
        message: message,
        isCorrect: isCorrect,
        classification: classification,
        pontuacao: satisfacaoChange
    };
}