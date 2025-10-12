# ProjetoSustentabilidade
Projeto da Disciplina de Métodos Formais que atende a ODS 11.7
-----------------------------------------------------------
Documentação de Software na Versão:1.2
-----------------------------------------------------------
# Definição do Projeto: Jogo Interativo de Acessibilidade
-----------------------------------------------------------
O projeto consiste no desenvolvimento de um jogo interativo que visa a conscientização sobre a importância da acessibilidade e do design inclusivo em ambientes públicos e privados. Utilizando a mecânica de um quiz dinâmico, similar ao Kahoot, o jogo será uma ferramenta educativa e engajadora. Seu principal objetivo é transcender a teoria, colocando o jogador em uma posição ativa de solução de problemas. Ao simular situações do cotidiano, ele desafia o público a identificar as necessidades de diferentes grupos de pessoas – como obesos, idosos, cadeirantes, gestantes e pessoas com deficiência sensorial ou mental – e a selecionar os objetos e recursos de acessibilidade adequados para garantir sua plena participação na sociedade.

A estrutura do jogo é baseada em três etapas bem definidas que promovem a aprendizagem pela prática. Na primeira etapa, o jogador é confrontado com a imagem de uma pessoa com uma necessidade específica (por exemplo, um cadeirante ou uma pessoa com deficiência visual). Em seguida, o jogo apresenta um cenário real e um desafio de acessibilidade, como a falta de uma rampa em um banco ou a ausência de um piso tátil em uma calçada. Por fim, o jogador deve escolher rapidamente as soluções corretas a partir de uma lista de opções (como Barra de apoio, Piso Tátil Direcional ou Assento Acessível). O sistema de pontuação e o feedback imediato – que faz o jogador tentar novamente em caso de erro – reforçam o aprendizado e a memorização das soluções.

Alinhado com a ODS (Objetivo de Desenvolvimento Sustentável) de Inclusão e Redução de Desigualdades, a ODS 11: Cidades e Comunidades Sustentáveis especificando o ponto  11.7 que busca "proporcionar o acesso universal a espaços públicos seguros, inclusivos, acessíveis e verdes, particularmente para as mulheres e crianças, pessoas idosas e pessoas com deficiência." este projeto tem como meta combater a invisibilidade das barreiras físicas e atitudinais. De forma indireta direciona par o conhecimento sobre normas de acessibilidade (como NBR 9050) em uma experiência divertida, o jogo atinge um público amplo – de estudantes a profissionais e tomadores de decisão – de forma eficiente. Mais do que apenas pontuar, a experiência busca gerar empatia ao fazer o jogador "calçar o sapato" do outro, compreendendo as frustrações diárias causadas pela falta de preparo dos espaços.
Em resumo, o projeto é uma solução de edutainment (educação + entretenimento) que utiliza a gamificação para promover a cidadania e o respeito. O foco não está apenas em listar objetos, ou gerar provocações, mas em criar a conexão prática entre a limitação da pessoa (física, mental ou comorbidade) e a intervenção necessária para que ela exerça sua autonomia. Ao fornecer aos jogadores o poder de "corrigir" o ambiente, o jogo busca formar indivíduos mais conscientes e capazes de exigir e implementar espaços verdadeiramente acessíveis, contribuindo ativamente para a construção de uma sociedade mais justa e igualitária.

--------------------------
##  Objetivo do Projeto
--------------------------
Este projeto é um jogo de simulação e gestão focado em conscientizar sobre a importância da acessibilidade em ambientes urbanos, alinhado ao **Objetivo de Desenvolvimento Sustentável (ODS) 11.7: Proporcionar acesso universal a espaços públicos seguros, inclusivos e acessíveis, em particular para mulheres, crianças, idosos e pessoas com deficiência.**

O jogador atua como um gestor que deve tomar decisões rápidas sobre quais recursos de acessibilidade instalar, equilibrando o **Orçamento (Saldo)**, a **Satisfação** dos usuários e o **Índice de Acessibilidade** geral.

---------------------------
## Como Executar o Jogo
---------------------------
O projeto é baseado em HTML, CSS e JavaScript Vanilla e pode ser executado localmente.

### Pré-requisitos

1.  Um editor de código **Visual Studio Code**.
2.  A extensão **Live Server** instalada no VS Code.

### Passos para Rodar

1.  Clone o repositório ou baixe o código-fonte.
2.  Abra a pasta do projeto no VS Code.
3.  Clique com o botão direito no arquivo `index.html` e selecione **"Open with Live Server"**.
4.  O jogo será aberto automaticamente no seu navegador configurado (Recomendado: Chrome).

## Mecânicas e Regras do Jogo

O jogo é composto por 11 cenários, nos quais diferentes perfis de usuários (gestantes, idosos, cadeirantes, etc.) apresentam uma necessidade de acessibilidade.

### Requisitos Funcionais (RFs) Implementados

| RF | Funcionalidade | Descrição |
| :--: | :--- | :--- |
| **RF01** | Cenários | Exibe o perfil do usuário, o ícone correspondente e a pergunta. |
| **RF02** | Cronômetro | Contagem regressiva de 15 segundos para resposta. Classifica o tempo como "RÁPIDO" (≤ 7s) ou "LENTO" (> 7s). |
| **RF03** | Selecionar Resposta | O sistema deve exibir as opções de resposta disponíveis (objetos de acessibilidade) e permitir que o jogador selecione uma delas. |
| **RF04** | Gestão de Saldo | O Saldo inicial é de R$ 1.000,00. **Correta/Incorreta:** Débito do Custo do Objeto Correto. **Bônus RÁPIDO:** Saldo recebe bônus por acerto rápido. **Fim de Jogo:** O Saldo negativo encerra o jogo por Falência. |
| **RF05** | Satisfação | **Correta:** Aumenta pela Pontuação do Objeto Correto. **Incorreta/Esgotado:** Diminui pela Pontuação do Objeto Correto. |
| **RF06** | Acessibilidade | Aumenta em `(100 / Total de Cenários)` por acerto correto. **Vitória:** 100% encerra o jogo. |
| **RF07** | Reaparecimento | A cada 2 perguntas respondidas, se houver respostas incorretas, a primeira incorreta é repetida para fixação. |
| **RF09** | Pausa do Jogo | Implementação de uma tela de pausa que congela o cronômetro e o estado do jogo. O retorno é feito clicando na tela de sobreposição. |
| **RF10** | Recomeço da Partida | O sistema deve prover um botão na tela de Fim de Jogo  que, quando acionado, reinicia o jogo para o estado inicial, permitindo ao usuário jogar novamente. |

## Estrutura do Projeto

| Arquivo/Pasta | Descrição |
| :--- | :--- |
| `index.html` | Estrutura principal do jogo (UI - Interface do Usuário). |
| `style.css` | Estilização da interface e dos estados de resposta/pausa. |
| **`src/app.js`** | **Lógica principal:** Gerencia o estado (`gameState`), o fluxo de cenários, a inicialização e coordena a RF09 (Pausa). |
| **`src/timer.js`** | Lógica do cronômetro, contagem regressiva e classificação de tempo. |
| **`src/calc.js`** | **Lógica de Score:** Implementa as regras complexas de RF04 e RF05 (Débito, Bônus RÁPIDO, Penalidade e Verificação de Falência). |
| `data/gameData.json` | Contém os 11 cenários, as opções de resposta e os IDs corretos. |
| `assets/` | Pasta para todos os recursos (imagens, ícones de perfil, etc.). |


--------------------------
# Diagrama de Casos de Uso
--------------------------
```mermaid
graph TD
    %% Define os Atores
    actor_j[Jogador]
    actor_s[Sistema]

    %% Define o Contêiner e os Casos de Uso
    subgraph Sistema: Acessibilidade para Todos
        uc1(UC1: Iniciar Partida)
        uc2(UC2: Visualizar HUD)
        uc3(UC3: Responder Cenário)
        uc4(UC4: Gerenciar Estado)
        uc5(UC5: Pausar/Continuar)
        uc6(UC6: Encerrar Partida)
        uc7(UC7: Reiniciar Partida)
    end

    %% Relações do Jogador e Fluxo Principal (Associações e Includes)
    actor_j --> uc1
    actor_j --> uc3
    actor_j --> uc5
    actor_j --> uc7

    uc1 --> uc2
    uc3 --> uc4
    uc4 --> uc2

    %% Relações Conditionais (Extend) - Sintaxe Limpa
    uc4 --> uc6
    uc4 -.- uc6
    uc4 -.-> uc6(Encerrar Partida)

    uc4 -.-> uc6
    linkStyle 10 stroke-dasharray: 5 5
    
    uc4 -.-> uc6
    linkStyle 10 stroke-dasharray: 5 5

    %% Relações Conditionais (Extend) - Sintaxe Limpa
    uc4 -.-> uc6
    uc5 -.-> uc4
    
    %% Reinício e Atores Secundários
    uc6 --> uc7
    uc7 --> uc1
    actor_s --> uc4
 ```
 --------------------------
 # Diagrama de Classe
 --------------------------
 ```mermaid
classDiagram
    direction LR

    %% ----------------------------------
    %% CLASSES DE DADOS (Estruturas de Objeto)
    %% ----------------------------------
    class GameState {
        + float saldo
        + int satisfacao
        + float acessibilidade
        + list perguntasIncorretas
        + int nextCenarioIndex
        + int reappearanceCounter
        + boolean isPaused
    }
    
    class ObjetoAcessibilidade {
        + int id
        + string nome
        + int pontuacao
        + float custo
    }
    
    class Cenario {
        + int id
        + string pergunta
        + string icone
        + list opcoes
        + int respostaCorretaID
    }
    
    %% Relação: Catálogo de Objetos é usado pelos Cenários (Opções)
    ObjetoAcessibilidade "1" -- "N" Cenario : Opções Usam >

    %% ----------------------------------
    %% CLASSES DE CONTROLE (Módulos JS)
    %% ----------------------------------
    class GameController {
        + updateHUD()
        + loadScenario()
        + handleAnswer()
        + processAnswer()
        + togglePause()
        + endGame()
    }
    
    class ScoreCalculator {
        + calculateScore(ID, Class, isCorrect)
    }

    class TimerController {
        + startTimer(callback)
        + stopTimer()
        + pauseTimer()
        + continueTimer()
    }

    %% ----------------------------------
    %% RELAÇÕES DE DEPENDÊNCIA
    %% ----------------------------------

    %% O GameController gerencia o estado e depende dos dados
    GameController "1" --> "1" GameState : Gerencia o status do jogo >
    GameController "1" --> "N" Cenario : Usa/Carrega >
    GameController ..> ObjetoAcessibilidade : <<getObjetoDetalhes>>

    %% O Controlador de Jogo (app.js) aciona as outras classes/módulos
    GameController --> ScoreCalculator : Usa para cálculo >
    GameController --> TimerController : Controla o cronômetro >

    %% O ScoreCalculator precisa dos dados do Objeto e do Estado
    ScoreCalculator ..> ObjetoAcessibilidade : Usa catálogo >
    ScoreCalculator "1" --> "1" GameState : Altera o status do jogo >
```
