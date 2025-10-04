// src/timer.js

// Variáveis de escopo global para o módulo Timer
const MAX_TIME = 15; // 15 segundos (RF02)
const BONUS_TIME_LIMIT = 7; // Limite para bônus (Resposta Rápida)
let intervalId = null;
let timeLeft = MAX_TIME;
let startTime = 0;
let endTime = 0;

// Elemento do HUD para exibir o tempo
const timerDisplay = document.getElementById('timer');

// Funções de retorno (callbacks) que serão executadas no app.js
let onTimeUpCallback = () => {};
let onTickCallback = () => {};

/**
 * Inicializa e reinicia o cronômetro para um novo cenário.
 * @param {function} timeUpCallback - Função a ser chamada quando o tempo esgotar.
 */
export function startTimer(timeUpCallback) {
    // 1. Limpa qualquer cronômetro anterior
    clearInterval(intervalId);
    
    // 2. Define o estado inicial
    onTimeUpCallback = timeUpCallback;
    timeLeft = MAX_TIME;
    startTime = Date.now();
    timerDisplay.textContent = `${MAX_TIME}s`;

    // 3. Inicia o Intervalo (Executado a cada 100ms para maior precisão)
    intervalId = setInterval(tick, 100);
}

/**
 * Função interna que atualiza o tempo e verifica o esgotamento.
 */
function tick() {
    const elapsed = (Date.now() - startTime) / 1000; // Tempo decorrido em segundos
    timeLeft = MAX_TIME - elapsed;
    
    // RNF03: Estabilidade: Garante que o display não mostre valores negativos flutuantes
    if (timeLeft <= 0.0) {
        // Tempo Esgotado!
        stopTimer();
        timerDisplay.textContent = '0s';
        onTimeUpCallback(); // Chama a função de Tempo Esgotado no app.js
    } else {
        // Atualiza o HUD (RUI01)
        timerDisplay.textContent = `${timeLeft.toFixed(1)}s`;
    }
}

/**
 * Para o cronômetro ao responder ou ao esgotar o tempo.
 * @returns {number} O tempo total levado pelo jogador (em segundos).
 */
export function stopTimer() {
    clearInterval(intervalId);
    endTime = Date.now();
    
    // Calcula o tempo total gasto pelo jogador
    const totalTime = (endTime - startTime) / 1000;
    
    // O tempo só é válido se a resposta foi dada antes de esgotar
    return totalTime > MAX_TIME ? MAX_TIME : totalTime;
}

/**
 * Analisa o tempo levado e classifica a resposta (Rápida, Lenta, Esgotado).
 * @param {number} timeTaken - O tempo levado para responder em segundos.
 * @returns {string} Classificação: 'RÁPIDA', 'LENTA', ou 'ESGOTADO'.
 */
export function getTimeClassification(timeTaken) {
    if (timeTaken > MAX_TIME) {
        return 'ESGOTADO';
    } else if (timeTaken <= BONUS_TIME_LIMIT) { // <= 7 segundos
        return 'RÁPIDA';
    } else { // > 7 segundos e <= 15 segundos
        return 'LENTA';
    }
}