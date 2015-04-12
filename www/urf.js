(function() {

    // Imports
    Stage = createjs.Stage;

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
    var dataManager = new DataManager();

    // Download game data
    $(document).ready(function() {
        dataManager.getGameData()
            .done(function(data) {
                gameManager.startGame(data);
            }).fail(function(promise, text, error) {
                console.warn("Failed to get game data.");
            });
    });
})();