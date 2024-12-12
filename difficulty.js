function updateDifficulty(game, delta) {
    // Update Speed and Difficulty
    game.speed += delta * game.speedIncreaseRate;
    game.currentObstacleScale += game.ballGrowthRate * delta;
    game.currentObstacleScale = Math.min(game.currentObstacleScale, game.maxBallScale);

    // Adjust FOV based on speed
    const baseFOV = 75;
    const maxFOV = 85;
    const fov = baseFOV + (game.speed - 80) * 0.005;
    game.camera.fov = THREE.MathUtils.clamp(fov, baseFOV, maxFOV);
    game.camera.updateProjectionMatrix();
}
