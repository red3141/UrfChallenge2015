(function() {
    if (window.KeyboardManager)
        return;
    
    window.KeyboardManager = function() {

        // Keep track of which arrow keys are pressed.
        var keyPressed = [false, false, false, false, false, false];

        function keyDown(e) {
            switch (e.keyCode) {
                case 37:
                    keyPressed[Key.Left] = true;
                    break;
                case 38:
                    keyPressed[Key.Up] = true;
                    break;
                case 39:
                    keyPressed[Key.Right] = true;
                    break;
                case 40:
                    keyPressed[Key.Down] = true;
                    break;
                case 82:
                    keyPressed[Key.Focus] = true;
                    break;
                case 87:
                    keyPressed[Key.Zhonyas] = true;
                    break;
                default:
                    return;
            }
            e.preventDefault();
        }

        function keyUp(e) {
            switch (e.keyCode) {
                case 37:
                    keyPressed[Key.Left] = false;
                    break;
                case 38:
                    keyPressed[Key.Up] = false;
                    break;
                case 39:
                    keyPressed[Key.Right] = false;
                    break;
                case 40:
                    keyPressed[Key.Down] = false;
                    break;
                case 82:
                    keyPressed[Key.Focus] = false;
                    break;
                case 87:
                    keyPressed[Key.Zhonyas] = false;
                default:
                    return;
            }
            e.preventDefault();
        }

        $(document).keydown(keyDown);
        $(document).keyup(keyUp);

        // Expose public members
        this.keyPressed = keyPressed;
    };
})();