(function () {
    function PointerLockControls(camera, domElement) {
        this.domElement = domElement || document.body;
        this.camera = camera;
        this.isLocked = false;

        const sensitivityX = 0.002;
        const sensitivityY = 0.002;

        const scope = this;
        const changeEvent = { type: 'change' };
        const lockEvent = { type: 'lock' };
        const unlockEvent = { type: 'unlock' };

        const euler = new THREE.Euler(0, 0, 0, 'YXZ');
        this.ignoreNextMouseMove = false;

        function onMouseMove(event) {
            if (scope.isLocked === false) return;

            if (scope.ignoreNextMouseMove) {
                scope.ignoreNextMouseMove = false;
                return;
            }

            const movementX = event.movementX || event.mozMovementX || event.webkitMovementX || 0;
            const movementY = event.movementY || event.mozMovementY || event.webkitMovementY || 0;

            euler.setFromQuaternion(camera.quaternion);

            euler.y -= movementX * sensitivityX;
            euler.x -= movementY * sensitivityY;

            euler.x = Math.max(-Math.PI / 2, Math.min(Math.PI / 2, euler.x));

            camera.quaternion.setFromEuler(euler);

            scope.dispatchEvent(changeEvent);
        }

        function onPointerlockChange() {
            if (document.pointerLockElement === scope.domElement) {
                scope.dispatchEvent(lockEvent);
                scope.isLocked = true;
                scope.ignoreNextMouseMove = true;
            } else {
                scope.dispatchEvent(unlockEvent);
                scope.isLocked = false;
            }
        }

        function onPointerlockError() {
            console.error('PointerLockControls: Unable to use Pointer Lock API');
        }

        this.connect = function () {
            document.addEventListener('mousemove', onMouseMove, false);
            document.addEventListener('pointerlockchange', onPointerlockChange, false);
            document.addEventListener('pointerlockerror', onPointerlockError, false);
        };

        this.disconnect = function () {
            document.removeEventListener('mousemove', onMouseMove, false);
            document.removeEventListener('pointerlockchange', onPointerlockChange, false);
            document.removeEventListener('pointerlockerror', onPointerlockError, false);
        };

        this.dispose = function () {
            this.disconnect();
        };

        this.getObject = function () {
            return camera;
        };

        this.lock = function () {
            this.domElement.requestPointerLock();
        };

        this.unlock = function () {
            document.exitPointerLock();
        };

        this.connect();
    }

    PointerLockControls.prototype = Object.create(THREE.EventDispatcher.prototype);
    PointerLockControls.prototype.constructor = PointerLockControls;

    window.PointerLockControls = PointerLockControls;
})();
