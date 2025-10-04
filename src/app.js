// src/app.js
import { startTimer, stopTimer, getTimeClassification } from './timer.js';
import { calculateScore } from './calc.js'; // Importa a lógica de cálculo

// ----------------------------------------------------------------------
// CATÁLOGO DE OBJETOS (Para busca rápida de Custo e Pontuação - Mantido para o loadScenario)
// ----------------------------------------------------------------------
const getObjetoDetalhes = (id) => {
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
// ESTADO GLOBAL DO JOGO
// ----------------------------------------------------------------------
// Exportado para ser usado em calc.js
export const gameState = { 
    saldo: 10000.00,
    satisfacao: 0,
    acessibilidade: 0,
    perguntasRespondidas: [],
    perguntasIncorretas: [],
    nextCenarioIndex: 0, // Índice da próxima pergunta SEQUENCIAL a ser carregada
    reappearanceCounter: 0 // Contador para o RF07
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
            throw new Error('Falha ao carregar gameData.json');
        }
        gameData = await response.json();
        
        updateHUD();
        loadScenario();

    } catch (error) {
        console.error("Erro Fatal na Inicialização:", error);
    }
}

function updateHUD() {
    document.getElementById('saldo').textContent = `R$ ${gameState.saldo.toFixed(2).replace('.', ',')}`;
    document.getElementById('satisfacao').textContent = `${gameState.satisfacao} PONTOS`;
    
    const prog = Math.min(gameState.acessibilidade, 100);
    document.getElementById('progress-fill').style.width = `${prog}%`;
    document.querySelector('#acessibilidade-progress-bar .label').textContent = `Índice de Acessibilidade: ${prog.toFixed(1)}%`;
}

function loadScenario() {
    // 1. Verifica Condição de Fim de Jogo (RF08)
    if (gameState.acessibilidade >= 99.9) {
        return endGame(true); 
    }

    // 2. Lógica de Reaparecimento (RF07)
    let currentScenario;
    if (gameState.reappearanceCounter >= 2 && gameState.perguntasIncorretas.length > 0) {
        // Carrega o ID do primeiro incorreto para repetição
        const incorrectId = gameState.perguntasIncorretas.shift(); 
        currentScenario = gameData.find(s => s.id === incorrectId);
        gameState.reappearanceCounter = 0; // Reseta o contador
    } else {
        // Carrega o próximo cenário sequencial
        if (gameState.nextCenarioIndex >= gameData.length) {
             // Caso o jogador tenha acertado tudo e o índice está em 90.9, por exemplo.
             return endGame(true); 
        }
        currentScenario = gameData[gameState.nextCenarioIndex];
        gameState.nextCenarioIndex++;
    }

    // Armazena o cenário atual no estado para uso em handleTimeUp
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

// ----------------------------------------------------------------------
// FUNÇÕES DE RESPOSTA E FLUXO DO JOGO
// ----------------------------------------------------------------------

function handleTimeUp() {
    if (isAnswering) return; 
    isAnswering = true;
    
    const currentScenario = gameState.currentScenario;

    stopTimer(); // Para o cronômetro
    
    // Tempo Esgotado é tratado como INCORRETO
    processAnswer(currentScenario, null, 'ESGOTADO', false); 
}

function handleAnswer(scenario, selectedId, buttonElement) {
    if (isAnswering) return; 
    isAnswering = true;
    
    const timeTaken = stopTimer(); // Para o cronômetro e pega o tempo gasto
    const classification = getTimeClassification(timeTaken); // Classifica o tempo
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
    // Chama a lógica de cálculo
    const results = calculateScore(scenario.respostaCorretaID, classification, isCorrect);
    
    // 2. LÓGICA DE REAPARECIMENTO (RF07)
    if (!results.isCorrect) {
        // Só adiciona para repetição se a pergunta não for uma repetição em si
        if (!gameState.perguntasIncorretas.includes(scenario.id)) { 
            gameState.perguntasIncorretas.push(scenario.id);
        }
        gameState.reappearanceCounter++;
    } else {
        // 3. AUMENTO DA ACESSIBILIDADE (RF06 - Opção A)
        gameState.acessibilidade += (100 / gameData.length); 
    }

    // 4. FEEDBACK E ATUALIZAÇÃO DO HUD (RUI03)
    document.getElementById('feedback-message').textContent = results.message;
    updateHUD();
    
    // 5. PRÓXIMO CENÁRIO
    setTimeout(() => {
        isAnswering = false;
        loadScenario();
    }, 2500); // 2.5 segundos para o jogador ler o feedback
}


// ----------------------------------------------------------------------
// FIM DE JOGO
// ----------------------------------------------------------------------
function endGame(isWin) {
    stopTimer(); 
    const screen = document.getElementById('game-over-screen');
    screen.querySelector('h2').textContent = isWin ? "VITÓRIA! 100% de Acessibilidade Atingida!" : "FIM DE JOGO";
    document.getElementById('final-saldo').textContent = `R$ ${gameState.saldo.toFixed(2).replace('.', ',')}`;
    document.getElementById('final-satisfacao').textContent = `${gameState.satisfacao} PONTOS`;
    
    document.getElementById('game-container').classList.add('hidden');
    screen.classList.remove('hidden');
}


// Inicia o carregamento dos dados ao carregar a página
window.onload = loadGameData;