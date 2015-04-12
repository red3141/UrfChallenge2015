(function() {
    if (window.GameManager)
        return;

    // Imports
    Bitmap = createjs.Bitmap;
    Container = createjs.Container;
    Ticker = createjs.Ticker;

    window.GameManager = function(stage, attackManager, playerManager) {

        var gameState = GameState.Playing;
        var gameId;
        var defeatBanner = new Bitmap(document.getElementById("defeat"));
        var victoryBanner = new Bitmap(document.getElementById("victory"));
        var endGameBanner;

        // The hitbox should appear above all bullets.
        // The player should appear below all bullets (except the bottom layer, e.g. Bard ult)
        stage.addChild(attackManager.bottomLayer);
        stage.addChild(playerManager.player);
        stage.addChild(attackManager.mainLayer);
        stage.addChild(attackManager.topLayer);
        stage.addChild(attackManager.darknessLayer);
        stage.addChild(playerManager.hitbox);

        playerManager.addEventListener("dead", function(e) {
            endGame(false);
        })

        // Methods

        function endGame(victory) {
            if (gameState != GameState.Playing) return;

            gameState = victory ? GameState.Victory : GameState.Defeat;
            endGameBanner = victory ? victoryBanner : defeatBanner;
            endGameBanner.regX = endGameBanner.image.width / 2;
            endGameBanner.regY = endGameBanner.image.height / 2;
            stage.addChild(endGameBanner);
            endGameBanner.x = stage.width / 2;
            endGameBanner.y = 250;
            endGameBanner.alpha = 0;
        }

        function onTick(e) {

            playerManager.movePlayer(e.delta);
            attackManager.moveParticles(e.delta, e.runTime);

            if (gameState != GameState.Playing) {
                if (endGameBanner.alpha < 1) {
                    endGameBanner.alpha = Math.min(1, endGameBanner.alpha + e.delta / 1000);
                    playerManager.player.alpha = Math.max(0, playerManager.player.alpha - e.delta / 1000);
                    playerManager.hitbox.alpha = Math.max(0, playerManager.hitbox.alpha - e.delta / 1000);
                } else if (!attackManager.attacksOnStage()) {
                    Ticker.reset();
                }
            } else if (!attackManager.attacksOnStage()) {
                // TODO: also check that there are no more attacks to be launched.
                //endGame(true);
            }

            stage.update();
        }

        function startGame(newGameId) {
            if (!newGameId) {
                // TODO: get random game
            } else {
                // TODO: get existing game
                gameId = newGameId;
            }
            // Events
            Ticker.framerate = 60;
            Ticker.addEventListener("tick", onTick);

            // Test code (remove sometime)
            setTimeout(function() {
                function doSetTimeout(champion, team, delay) {
                    setTimeout(function() {
                        if (gameState != GameState.Playing) return;
                        attackManager.fireAttackGroup(champion, team, delay + 1000);
                    }, delay);
                }
                var delay = 0;
                for (championId in champions) {
                    var champion = champions[championId];
                    if (champion.attacks === undefined) { continue; }
                    doSetTimeout(champion, Team.One, delay);
                    doSetTimeout(champion, Team.Two, delay);
                    delay += 500;
                }
            }, 1000);
        }

        function restartGame() {
            startGame(gameId);
        }

        // Expose public members
        this.startGame = startGame;
        this.restartGame = restartGame;
    };
})();