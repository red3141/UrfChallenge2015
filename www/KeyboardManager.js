Key = {
    Up: 38,
    Down: 40,
    Left: 37,
    Right: 39,
    Flash: 69, // E
    Focus: 82, // R
    Pause: 80, // P
    Zhonyas: 87, // W
    Skip: 32,  // Space
};

(function() {
    if (window.KeyboardManager)
        return;

    var EventDispatcher = createjs.EventDispatcher;
    var Event = createjs.Event;

    window.KeyboardManager = function() {

        var self = this;

        // Keep track of which arrow keys are pressed.
        var keyPressed = {};

        function keyDown(e) {
            switch (e.keyCode) {
                case Key.Left:
                case Key.Right:
                case Key.Up:
                case Key.Down:
                case Key.Focus:
                case Key.Zhonyas:
                    keyPressed[e.keyCode] = true;
                    break;
                case Key.Flash:
                    self.dispatchEvent("flash");
                    break;
                case Key.Pause:
                    self.dispatchEvent("pause");
                    break;
                case Key.Skip:
                    self.dispatchEvent("skip");
                    break;
                default:
                    return;
            }
            // Prevent the arrow keys from scrolling the page
            e.preventDefault();
        }

        function keyUp(e) {
            switch (e.keyCode) {
                case Key.Left:
                case Key.Right:
                case Key.Up:
                case Key.Down:
                case Key.Focus:
                case Key.Zhonyas:
                    keyPressed[e.keyCode] = false;
                    break;
                default:
                    return;
            }
            // Prevent the arrow keys from scrolling the page
            e.preventDefault();
        }

        $(document).keydown(keyDown);
        $(document).keyup(keyUp);

        // Expose public members
        this.keyPressed = keyPressed;
    };

    KeyboardManager.prototype = new EventDispatcher();
})();