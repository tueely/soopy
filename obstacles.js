function createGameObstacle(game) {
    const geometry = new THREE.SphereGeometry(5, 12, 12);
    const color = new THREE.Color(Math.random(), Math.random(), Math.random());
    const material = new THREE.MeshStandardMaterial({
        color: color,
        transparent: true,
        opacity: 0.8,
        emissive: color,
        emissiveIntensity: 0.4
    });
    const obstacle = new THREE.Mesh(geometry, material);

    obstacle.scale.set(game.currentObstacleScale, game.currentObstacleScale, game.currentObstacleScale);
    placeGameObstacleRandomly(game, obstacle, game.spawnRadius);
    game.scene.add(obstacle);
    game.gameObstacles.push(obstacle);
}

function placeGameObstacleRandomly(game, object, radius) {
    let position;
    let attempts = 0;
    const maxAttempts = 20;
    let tooClose = false;

    do {
        const phi = Math.acos(2 * Math.random() - 1);
        const theta = 2 * Math.PI * Math.random();
        const distance = Math.random() * radius * 0.7 + radius * 0.3;

        position = new THREE.Vector3();
        position.x = distance * Math.sin(phi) * Math.cos(theta) + game.camera.position.x;
        position.y = distance * Math.sin(phi) * Math.sin(theta) + game.camera.position.y;
        position.z = distance * Math.cos(phi) + game.camera.position.z;

        tooClose = game.gameObstacles.some(obstacle => obstacle.position.distanceTo(position) < game.minObjectDistance);
        attempts++;
    } while (tooClose && attempts < maxAttempts);

    object.position.copy(position);
}

function recycleObstacles(game) {
    const playerPos = game.camera.position;
    game.gameObstacles.forEach(obstacle => {
        if (obstacle.position.distanceTo(playerPos) > game.objectRemovalDistance) {
            placeGameObstacleRandomly(game, obstacle, game.spawnRadius);
            obstacle.scale.set(game.currentObstacleScale, game.currentObstacleScale, game.currentObstacleScale);
        }
    });
}

function checkCollisions(game) {
    const playerPos = game.camera.position;
    for (let obstacle of game.gameObstacles) {
        const obstacleSize = obstacle.scale.x * 5;
        const distance = playerPos.distanceTo(obstacle.position);
        if (distance < obstacleSize) {
            game.endGame();
            break;
        }
    }
}
