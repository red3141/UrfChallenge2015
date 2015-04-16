(function() {

    // Imports
    var Stage = createjs.Stage;

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
    var dataManager = new DataManager();
    var tutorialManager = new TutorialManager(stage);
    var gameManager = new GameManager(stage, attackManager, playerManager, keyboardManager, dataManager, tutorialManager);

    var requiredCount = 0;
    var readyCount = 0;

    function onLoadComplete() {
        gameManager.showMenu();
    }
    
    function onComponentLoad() {
        ++readyCount;
        if (readyCount >= requiredCount)
            onLoadComplete();
    }

    function waitFor(eventDispatcher) {
        ++requiredCount;
        eventDispatcher.addEventListener("ready", onComponentLoad);
    }

    waitFor(gameManager);
    waitFor(playerManager);
})();