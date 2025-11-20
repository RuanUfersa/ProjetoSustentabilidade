import { startTimer, stopTimer, getTimeClassification, pauseTimer, continueTimer } from './timer.js'; 
import { calculateScore } from './calc.js'; 

// ----------------------------------------------------------------------
// CATÁLOGO DE OBJETOS (RF04/RF05 PREP: FUNÇÃO EXPORTADA para calc.js)
// ----------------------------------------------------------------------
export const getObjetoDetalhes = (id) => {
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
    return catalogo.find(item => item.id === id);
};


// ----------------------------------------------------------------------
// ESTADO GLOBAL DO JOGO VALORES USADO PARA INICIALISAR O HUD
// ----------------------------------------------------------------------
export const gameState = { 
    saldo: 1000.00,
    satisfacao: 0,
    acessibilidade: 0,
    perguntasRespondidas: [],
    perguntasIncorretas: [], 
    nextCenarioIndex: 0, 
    reappearanceCounter: 0, 
    isPaused: false // RF09: ESTADO DE PAUSA
};

let gameData = [];
let isAnswering = false;


// ----------------------------------------------------------------------
// FUNÇÕES PRINCIPAIS DE FLUXO
// ----------------------------------------------------------------------
async function loadGameData() {
    try {
        const response = await fetch('data/gameData.json'); 
        if (!response.ok) {
            throw new Error(`Falha ao carregar gameData.json. Status: ${response.status}`);
        }
        gameData = await response.json();
        
        updateHUD();
        loadScenario(); // Inicia o jogo após o carregamento dos dados

    } catch (error) {
        console.error("Erro Fatal na Inicialização:", error);
        document.getElementById('question-text').textContent = "ERRO: Falha ao carregar dados. Verifique o console.";
    }
}

function updateHUD() {
    document.getElementById('saldo').textContent = `R$ ${gameState.saldo.toFixed(2).replace('.', ',')}`;
    document.getElementById('satisfacao').textContent = `${gameState.satisfacao} PONTOS`;
    
    const prog = Math.min(gameState.acessibilidade, 100);
    document.getElementById('progress-fill').style.width = `${prog}%`;
    document.querySelector('#acessibilidade-progress-bar .label').textContent = `Índice de Acessibilidade: ${prog.toFixed(1)}%`;
}

/**
 * LÓGICA CORRIGIDA PARA RF07/RF08
 * Garante que a Vitória só é acionada aos 100% de Acessibilidade.
 * Garante que o Fim de Cenários só aciona Fim de Jogo se não atingiu 100%.
 */
function loadScenario() {
    // 1. CHECAGEM DE VITÓRIA (RF08 - Acessibilidade 100%)
    if (gameState.acessibilidade >= 99.9) {
        return endGame(true, "VITÓRIA! 100% de Acessibilidade Atingida!");
    }

    // 2. CHECAGEM DE FIM DE CENÁRIOS (Derrota por falta de conteúdo)
    // Se acabou a lista de cenários E a lista de erros está vazia, o jogo termina
    if (gameState.nextCenarioIndex >= gameData.length && gameState.perguntasIncorretas.length === 0) {
        // Se a acessibilidade não chegou a 100%, termina como Derrota/Fim dos Cenários
        return endGame(false, "FIM DOS CENÁRIOS! Não atingiu 100% de Acessibilidade.");
    }
    
    // 3. Lógica de Reaparecimento (RF07)
    let currentScenario;
    if (gameState.reappearanceCounter >= 2 && gameState.perguntasIncorretas.length > 0) {
        // Puxa cenário do pool de erros
        const incorrectId = gameState.perguntasIncorretas.shift(); 
        currentScenario = gameData.find(s => s.id === incorrectId);
        gameState.reappearanceCounter = 0; 
    } else {
        // Puxa o próximo cenário normal, SE AINDA HOUVER
        if (gameState.nextCenarioIndex < gameData.length) {
            currentScenario = gameData[gameState.nextCenarioIndex];
            gameState.nextCenarioIndex++;
        } else {
            // Se chegamos aqui, os cenários normais acabaram, mas a checagem de erros acima (ponto 2)
            // garante que não cairemos em um loop infinito. Se não é hora de reaparecer, apenas retorna.
            return; 
        }
    }

    gameState.currentScenario = currentScenario; 
    
    // RF01: Exibe Pergunta e Ícone
    document.getElementById('question-text').textContent = currentScenario.pergunta;
    document.getElementById('profile-icon').src = `assets/images/perfil/${currentScenario.icone}`;
    document.getElementById('feedback-message').textContent = '';
    
    // RF03: Exibe Opções de Resposta
    const optionsArea = document.getElementById('options-area');
    optionsArea.innerHTML = '';
    
    currentScenario.opcoes.forEach(opcao => {
        const detalhes = getObjetoDetalhes(opcao.objetoID);
        
        const button = document.createElement('button');
        button.classList.add('option-button');
        button.dataset.id = opcao.objetoID;
        button.innerHTML = `
            ${opcao.nome}
            <span class="option-cost">Custo: R$ ${detalhes.custo.toFixed(2).replace('.', ',')}</span>
        `;
        
        button.addEventListener('click', () => handleAnswer(currentScenario, opcao.objetoID, button));
        optionsArea.appendChild(button);
    });

    // RF02: Inicia o Cronômetro
    startTimer(handleTimeUp); 
}

/**
 * Pausa ou despausa o jogo, controlando o cronômetro e a interface. (RF09)
 */
function togglePause() {
    const pauseScreen = document.getElementById('pause-screen');

    if (gameState.isPaused) {
        // Despausar o jogo
        gameState.isPaused = false;
        pauseScreen.classList.add('hidden');
        continueTimer(); // Chama a função do timer.js
    } else {
        // Pausar o jogo
        gameState.isPaused = true;
        pauseTimer(); // Chama a função do timer.js
        pauseScreen.classList.remove('hidden');
    }
}


// ----------------------------------------------------------------------
// FUNÇÕES DE RESPOSTA E FLUXO DO JOGO
// ----------------------------------------------------------------------

function handleTimeUp() {
    if (isAnswering || gameState.isPaused) return; 
    isAnswering = true;
    
    const currentScenario = gameState.currentScenario;

    stopTimer(); 
    
    // Tempo Esgotado é tratado como INCORRETO
    processAnswer(currentScenario, null, 'ESGOTADO', false); 
}

function handleAnswer(scenario, selectedId, buttonElement) {
    if (isAnswering || gameState.isPaused) return; // RF09: Bloqueia se Pausado
    isAnswering = true;
    
    const timeTaken = stopTimer(); 
    const classification = getTimeClassification(timeTaken); 
    const isCorrect = selectedId === scenario.respostaCorretaID;
    
    // Feedback Visual (RUI02)
    buttonElement.classList.add(isCorrect ? 'correct' : 'incorrect');

    if (!isCorrect) {
        // Se incorreto, mostra qual era o correto
        const correctButton = document.querySelector(`.option-button[data-id='${scenario.respostaCorretaID}']`);
        if (correctButton) {
             correctButton.classList.add('correct');
        }
    }
    
    processAnswer(scenario, selectedId, classification, isCorrect);
}

function processAnswer(scenario, selectedId, classification, isCorrect) {
    
    // 1. CÁLCULO DE SALDO E SATISFAÇÃO (RF04, RF05)
    const results = calculateScore(scenario.respostaCorretaID, classification, isCorrect);
    
    // Se o cálculo resultar em fim de jogo por falência (RF04), para aqui.
    if (results.gameOver) {
        return endGame(false, results.message);
    }
    
    // 2. LÓGICA DE REAPARECIMENTO (RF07)
    if (!results.isCorrect) {
        if (!gameState.perguntasIncorretas.includes(scenario.id)) { 
            gameState.perguntasIncorretas.push(scenario.id);
        }
        gameState.reappearanceCounter++;
    } else {
        // 3. AUMENTO DA ACESSIBILIDADE (RF06)
        gameState.acessibilidade += (100 / gameData.length); 
    }

    // 4. FEEDBACK E ATUALIZAÇÃO DO HUD (RUI03)
    document.getElementById('feedback-message').textContent = results.message;
    updateHUD();
    
    // 5. PRÓXIMO CENÁRIO
    setTimeout(() => {
        isAnswering = false;
        loadScenario();
    }, 2500); 
}


// ----------------------------------------------------------------------
// FIM DE JOGO
// ----------------------------------------------------------------------
function endGame(isWin, message = null) {
    stopTimer(); 
    const screen = document.getElementById('game-over-screen');
    
    if (isWin) {
        screen.querySelector('h2').textContent = message;
    } else {
        screen.querySelector('h2').textContent = message || "FIM DE JOGO"; 
    }
    
    document.getElementById('final-saldo').textContent = `R$ ${gameState.saldo.toFixed(2).replace('.', ',')}`;
    document.getElementById('final-satisfacao').textContent = `${gameState.satisfacao} PONTOS`;
    
    document.getElementById('game-container').classList.add('hidden');
    screen.classList.remove('hidden');
}


// ----------------------------------------------------------------------
// INICIALIZAÇÃO E RF09 (Ligação dos Eventos de Pausa)
// ----------------------------------------------------------------------
document.addEventListener('DOMContentLoaded', () => {
    // RF09: Liga o evento do botão de Pause no HUD
    const pauseButton = document.getElementById('pause-button');
    if (pauseButton) {
        pauseButton.addEventListener('click', togglePause);
    }
    
    // RF09: NOVO - Liga o evento de clique na TELA DE PAUSA (para despausar)
    const pauseScreen = document.getElementById('pause-screen');
    if (pauseScreen) {
        pauseScreen.addEventListener('click', togglePause);
    }
    
    // Inicia o carregamento dos dados do jogo
    loadGameData();
});