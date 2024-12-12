function bindVisibilityChange(game) {
    document.addEventListener('visibilitychange', () => {
        if (document.hidden && !game.gameOver && game.controls.isLocked && !game.isPaused) {
            game.pauseGame();
        }
    });
}

function bindKeyboardControls(game) {
    document.addEventListener('keydown', (event) => {
        if (event.code === 'Escape') {
            if (game.isPaused) {
                game.resumeGame();
            } else if (game.controls.isLocked) {
                game.pauseGame();
            }
        }
    });
}

function initControls(game) {
    game.controls.addEventListener('lock', () => {
        // No action needed on lock
    });

    game.controls.addEventListener('unlock', () => {
        if (!game.gameOver && !game.isPaused) {
            game.pauseGame();
        }
    });
}
