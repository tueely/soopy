function bindUIActions(game) {
    game.startButton.addEventListener('click', () => {
        game.homeScreen.style.display = 'none';
        game.resetGame();
        game.startGame();
    });

    game.resumeButton.addEventListener('click', () => {
        game.resumeGame();
    });

    game.restartButton.addEventListener('click', () => {
        game.gameOverScreen.style.display = 'none';
        game.resetGame();
        game.startGame();
    });
}

function showGameOverScreen(game, finalScore) {
    game.finalScoreElement.innerText = finalScore.toFixed(2);
    game.gameOverScreen.style.display = 'flex';
}

function showPauseScreen(game) {
    game.pauseScreen.style.display = 'flex';
}

function hidePauseScreen(game) {
    game.pauseScreen.style.display = 'none';
}
