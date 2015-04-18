Key = {
    Up: 38,
    Down: 40,
    Left: 37,
    Right: 39,
    Flash: 69, // E
    Focus: 82, // R
    Pause: 80, // P
    Zhonyas: 87, // W
    Randuins: 81, // Q
    Skip: 32,  // Space
    NewGame: 78,   // N
    RetryGame: 77, // M
    Enter: 13,
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
                case Key.Randuins:
                    self.dispatchEvent("randuins");
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
                case Key.NewGame:
                case Key.Enter:
                    self.dispatchEvent("newGame");
                    break;
                case Key.RetryGame:
                    self.dispatchEvent("retryGame");
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