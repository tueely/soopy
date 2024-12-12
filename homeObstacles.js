function generateHomeScreenObstacles(game) {
    for (let i = 0; i < game.maxHomeObstacles; i++) {
        createHomeObstacle(game);
    }
}

function createHomeObstacle(game) {
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

    const scale = 20;
    obstacle.scale.set(scale, scale, scale);
    placeHomeObstacleRandomly(game, obstacle, 1000);
    game.scene.add(obstacle);
    game.homeObstacles.push(obstacle);
}

function placeHomeObstacleRandomly(game, object, radius) {
    const phi = Math.acos(2 * Math.random() - 1);
    const theta = 2 * Math.PI * Math.random();
    const distance = Math.random() * radius * 0.7 + radius * 0.3;

    const position = new THREE.Vector3();
    position.x = distance * Math.sin(phi) * Math.cos(theta) + game.camera.position.x;
    position.y = distance * Math.sin(phi) * Math.sin(theta) + game.camera.position.y;
    position.z = distance * Math.cos(phi) + game.camera.position.z;

    object.position.copy(position);
}

function recycleHomeObstacles(game) {
    const playerPos = game.camera.position;
    game.homeObstacles.forEach(obstacle => {
        if (obstacle.position.distanceTo(playerPos) > 1500) {
            placeHomeObstacleRandomly(game, obstacle, 1000);
        }
    });
}
