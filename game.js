class Game {
    constructor() {
        // Bind UI Elements
        this.hud = document.getElementById('hud');
        this.highscoreElement = document.getElementById('highscore');
        this.homeScreen = document.getElementById('home-screen');
        this.pauseScreen = document.getElementById('pause-screen');
        this.gameOverScreen = document.getElementById('game-over');
        this.startButton = document.getElementById('start-button');
        this.resumeButton = document.getElementById('resume-button');
        this.restartButton = document.getElementById('restart-button');
        this.finalScoreElement = document.getElementById('final-score');

        // Initialize Highscore
        this.highscore = parseFloat(localStorage.getItem('soopyHighscore')) || 0;
        this.highscoreElement.innerText = `Highscore: ${this.highscore.toFixed(2)} seconds`;

        // Initialize Three.js Components
        this.initThreeJS();

        // Initialize Game Variables
        this.homeObstacles = [];
        this.gameObstacles = [];
        this.maxGameObstacles = 500;
        this.maxHomeObstacles = 100;
        this.spawnRadius = 2500;
        this.objectRemovalDistance = 2550;
        this.minObjectDistance = 150;
        this.gameOver = false;
        this.isPaused = false;
        this.startTime = 0;
        this.pauseStartTime = 0;
        this.totalPausedTime = 0;
        this.isHomeScreen = true;

        // Dynamic Difficulty Variables
        this.speedIncreaseRate = 20;
        this.ballGrowthRate = 0.2;
        this.maxBallScale = 50;
        this.currentObstacleScale = 20;
        this.speed = 1880;

        // Bind UI Actions
        bindUIActions(this);
        bindVisibilityChange(this);
        bindKeyboardControls(this);

        // Initialize Controls
        initControls(this);

        // Start Animation Loop
        this.animate = this.animate.bind(this);
        this.prevTime = performance.now();
        requestAnimationFrame(this.animate);
    }

    initThreeJS() {
        this.scene = new THREE.Scene();

        this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 1, 10000);
        this.camera.position.set(0, 0, 0);
        this.camera.rotation.order = 'YXZ';

        this.renderer = new THREE.WebGLRenderer({ antialias: true });
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        document.body.appendChild(this.renderer.domElement);

        const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
        this.scene.add(ambientLight);

        const pointLight = new THREE.PointLight(0xffffff, 1);
        this.camera.add(pointLight);
        this.scene.add(this.camera);

        this.controls = new PointerLockControls(this.camera, document.body);
        this.scene.add(this.controls.getObject());

        window.addEventListener('resize', () => this.onWindowResize(), false);
    }

    onWindowResize() {
        this.camera.aspect = window.innerWidth / window.innerHeight;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(window.innerWidth, window.innerHeight);
    }

    resetGame() {
        this.gameObstacles.forEach(obstacle => this.scene.remove(obstacle));
        this.gameObstacles = [];
        this.currentObstacleScale = 20;
        this.speed = 1880;
        this.gameOver = false;
        this.isPaused = false;
        this.totalPausedTime = 0;
        this.pauseStartTime = 0;
        this.camera.position.set(0, 0, 0);
        this.camera.rotation.set(0, 0, 0);
        if (this.controls.isLocked) {
            this.controls.unlock();
        }
        this.startTime = performance.now();
    }

    startGame() {
        this.isHomeScreen = false;
        this.homeObstacles.forEach(obstacle => this.scene.remove(obstacle));
        this.homeObstacles = [];
        for (let i = 0; i < this.maxGameObstacles; i++) {
            createGameObstacle(this);
        }
        this.controls.lock();
    }

    pauseGame() {
        this.isPaused = true;
        this.pauseStartTime = performance.now();
        showPauseScreen(this);
        this.controls.unlock();
    }

    resumeGame() {
        if (!this.isPaused) return;
        this.isPaused = false;
        hidePauseScreen(this);
        this.totalPausedTime += performance.now() - this.pauseStartTime;
        this.controls.lock();
    }

    endGame() {
        this.gameOver = true;
        this.controls.unlock();
        const finalScore = (performance.now() - this.startTime - this.totalPausedTime) / 1000;
        showGameOverScreen(this, finalScore);
    }

    animate(time = 0) {
        requestAnimationFrame(this.animate);
        const delta = (time - this.prevTime) / 1000 || 0;
        this.prevTime = time;

        if (this.isHomeScreen) {
            // Move the camera forward slowly on home screen
            const forwardSpeed = 50;
            const forward = new THREE.Vector3(0, 0, -1);
            this.camera.position.addScaledVector(forward, forwardSpeed * delta);
            recycleHomeObstacles(this);
            this.renderer.render(this.scene, this.camera);
            return;
        }

        if (!this.isPaused && !this.gameOver && this.controls.isLocked) {
            updateDifficulty(this, delta);
            const forward = new THREE.Vector3(0, 0, -1).applyQuaternion(this.camera.quaternion);
            this.camera.position.addScaledVector(forward, this.speed * delta);

            const currentTime = performance.now();
            const elapsedTime = (currentTime - this.startTime - this.totalPausedTime) / 1000;
            this.hud.innerText = `Time Survived: ${elapsedTime.toFixed(2)} seconds`;

            if (elapsedTime > this.highscore) {
                this.highscore = elapsedTime;
                this.highscoreElement.innerText = `Highscore: ${this.highscore.toFixed(2)} seconds`;
                localStorage.setItem('soopyHighscore', this.highscore.toFixed(2));
            }

            checkCollisions(this);
            recycleObstacles(this);

            this.gameObstacles.forEach(obstacle => {
                obstacle.scale.set(this.currentObstacleScale, this.currentObstacleScale, this.currentObstacleScale);
            });
        }

        this.renderer.render(this.scene, this.camera);
    }
}
