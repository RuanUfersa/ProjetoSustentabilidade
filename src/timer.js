// src/timer.js
const TIME_LIMIT = 15; // Limite de 15 segundos (RF02)
let timeRemaining = TIME_LIMIT;
let timerInterval = null;
let timeUpCallback = null;

const timerDisplay = document.getElementById('timer');

/**
 * Inicia ou reinicia o cronômetro para um novo cenário.
 * @param {function} callback - Função a ser chamada quando o tempo esgotar.
 */
export function startTimer(callback) {
    // 1. Limpa o intervalo anterior, se houver
    if (timerInterval) {
        clearInterval(timerInterval);
    }
    
    // 2. Reseta o tempo e o callback
    timeRemaining = TIME_LIMIT;
    timeUpCallback = callback;

    // 3. Atualiza o display imediatamente
    updateTimerDisplay();

    // 4. Inicia o novo intervalo (contagem regressiva)
    timerInterval = setInterval(() => {
        timeRemaining--;
        updateTimerDisplay();

        if (timeRemaining <= 0) {
            stopTimer();
            // Chama a função handleTimeUp do app.js
            if (timeUpCallback) {
                timeUpCallback();
            }
        }
    }, 1000); // 1000ms = 1 segundo
}

/**
 * Para o cronômetro e retorna o tempo gasto.
 * @returns {number} O tempo total gasto na pergunta.
 */
export function stopTimer() {
    if (timerInterval) {
        clearInterval(timerInterval);
        timerInterval = null;
    }
    // Retorna o tempo que o jogador levou para responder
    return TIME_LIMIT - timeRemaining; 
}

/**
 * Atualiza o elemento HTML com o tempo restante.
 */
function updateTimerDisplay() {
    timerDisplay.textContent = `${timeRemaining}s`;
}

// ----------------------------------------------------
// RF09: FUNÇÕES DE PAUSA E CONTINUAÇÃO (IMPLEMENTAÇÃO COMPLETA)
// ----------------------------------------------------

/**
 * Pausa o cronômetro. (RF09)
 */
export function pauseTimer() {
    if (timerInterval) {
        // Para a contagem, mas mantém o timeRemaining intacto
        clearInterval(timerInterval);
        timerInterval = null;
    }
}

/**
 * Continua o cronômetro a partir do ponto de pausa. (RF09)
 */
export function continueTimer() {
    // Apenas continua se não houver um intervalo rodando e ainda houver tempo
    if (!timerInterval && timeRemaining > 0) {
        // Recria o setInterval exatamente de onde parou
        timerInterval = setInterval(() => {
            timeRemaining--;
            updateTimerDisplay();

            if (timeRemaining <= 0) {
                stopTimer();
                if (timeUpCallback) {
                    timeUpCallback();
                }
            }
        }, 1000);
    }
}

// ----------------------------------------------------
// RF02: FUNÇÃO DE CLASSIFICAÇÃO DE TEMPO
// ----------------------------------------------------

/**
 * Classifica o tempo gasto para determinar bônus/penalidades.
 * @param {number} timeSpent - Tempo gasto para responder (em segundos).
 * @returns {string} Classificação ('RÁPIDA', 'LENTA', ou 'ESGOTADO').
 */
export function getTimeClassification(timeSpent) {
    // Regras (Baseado em "Regras/valores/Requisitos - Regras/Valores.csv")
    if (timeSpent <= 7) {
        return 'RÁPIDA';
    } else if (timeSpent > 7 && timeSpent <= TIME_LIMIT) {
        return 'LENTA';
    } else {
        return 'ESGOTADO';
    }
}