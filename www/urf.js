(function() {

    // Imports
    Stage = createjs.Stage;

    // Download game data
    var game = {};
    $.ajax({
        url: "http://localhost:57644/games/random",
        dataType: 'json'
    }).done(function(data) {
        game = data;
        // TODO: use game.events in the onTick event.
    }).fail(function(promise, text, error) {
        console.warn("Failed to get game data.");
    });

    // Stage setup
    var stage = new Stage("canvas");
    stage.width = stage.canvas.width;
    stage.height = stage.canvas.height;

    // Instantiate objects with dependencies
    var keyboardManager = new KeyboardManager();
    var playerManager = new PlayerManager(stage, keyboardManager);
    var pointGenerator = new PointGenerator(stage, playerManager);
    var collisionDetector = ndgmr;
    //var collisionDetector = { checkPixelCollision: function() { return false; } };
    var attackManager = new AttackManager(stage, pointGenerator, playerManager, collisionDetector);
    var gameManager = new GameManager(stage, attackManager, playerManager);
    
    $(document).ready(function() {
        gameManager.startGame();
    });
})();