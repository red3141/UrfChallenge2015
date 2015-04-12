(function() {
    if (window.GameManager)
        return;

    // Imports
    Bitmap = createjs.Bitmap;
    Container = createjs.Container;
    Ticker = createjs.Ticker;

    window.GameManager = function(stage, attackManager, playerManager) {

        // Number of times faster this game is than the source game.
        var gameSpeed = 30;

        var gameState = GameState.Playing;
        var defeatBanner = new Bitmap(document.getElementById("defeat"));
        var victoryBanner = new Bitmap(document.getElementById("victory"));
        var endGameBanner;
        
        var game = {};
        var eventIndex = 0;
        
        var newGameButton;
        var retryGameButton;
        var newMatchButtonUnhover = new Bitmap(document.getElementById("button_new"));
        var newMatchButtonHover = new Bitmap(document.getElementById("button_new_hover"));
        newMatchButtonUnhover.addEventListener("mouseover",
            function() {
                var alpha = newGameButton.alpha;
                stage.removeChild(newGameButton);
                newGameButton = newMatchButtonHover;
                newGameButton.alpha = alpha;
                stage.addChild(newGameButton);
                stage.update();
            });
        newMatchButtonHover.addEventListener("mouseout",
            function() {
                var alpha = newGameButton.alpha;
                stage.removeChild(newGameButton);
                newGameButton = newMatchButtonUnhover;
                newGameButton.alpha = alpha;
                stage.addChild(newGameButton);
                stage.update();
            });
        var retryMatchButtonUnhover = new Bitmap(document.getElementById("button_retry"));
        retryMatchButtonUnhover.addEventListener("mouseover",
            function() {
                var alpha = newGameButton.alpha;
                stage.removeChild(retryGameButton);
                retryGameButton = retryMatchButtonHover;
                retryGameButton.alpha = alpha;
                stage.addChild(retryGameButton);
                stage.update();
            });
        var retryMatchButtonHover = new Bitmap(document.getElementById("button_retry_hover"));
        retryMatchButtonHover.addEventListener("mouseout",
            function() {
                var alpha = retryGameButton.alpha;
                stage.removeChild(retryGameButton);
                retryGameButton = retryMatchButtonUnhover;
                retryGameButton.alpha = alpha;
                stage.addChild(retryGameButton);
                stage.update();
            });

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
        });

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
            
            newMatchButtonHover.regX = newMatchButtonHover.image.width / 2;
            newMatchButtonHover.regY = newMatchButtonHover.image.height / 2;
            newMatchButtonUnhover.regX = newMatchButtonUnhover.image.width / 2;
            newMatchButtonUnhover.regY = newMatchButtonUnhover.image.height / 2;
            retryMatchButtonHover.regX = retryMatchButtonHover.image.width / 2;
            retryMatchButtonHover.regY = retryMatchButtonHover.image.height / 2;
            retryMatchButtonUnhover.regX = retryMatchButtonUnhover.image.width / 2;
            retryMatchButtonUnhover.regY = retryMatchButtonUnhover.image.height / 2;
            
            newMatchButtonHover.x = newMatchButtonUnhover.x = stage.width / 2;
            newMatchButtonHover.y = newMatchButtonUnhover.y = 450;
            retryMatchButtonHover.x = retryMatchButtonUnhover.x = stage.width / 2;
            retryMatchButtonHover.y = retryMatchButtonUnhover.y = 500;
            
            newGameButton = newMatchButtonUnhover;
            newGameButton.alpha = 0;
            retryGameButton = retryMatchButtonUnhover;
            retryGameButton.alpha = 0;
            
            stage.addChild(newGameButton);
            stage.addChild(retryGameButton);
            
            stage.enableMouseOver();
        }

        function fireAttacks(event, currentTime) {
            if (event.killerId == null) return null;
            var participant = game.participants[event.killerId - 1];
            if (!participant) {
                console.warn("Could not find participant with ID " + event.killerId);
                return null;
            }
            var champion = champions[participant.championId];
            if (!champion) {
                console.warn("Could not find champion with ID " + participant.championId);
                return;
            }
            attackManager.fireAttackGroup(champion, participant.teamId, currentTime);
            if (event.assistingParticipantIds) {
                $.each(event.assistingParticipantIds, function(i, id) {
                    var assistingParticipant = game.participants[id - 1];
                    if (!assistingParticipant) {
                        console.warn("Could not find participant with ID " + id);
                        return;
                    }
                    var assistingChampion = champions[assistingParticipant.championId];
                    if (!assistingChampion) {
                        console.warn("Could not find champion with ID " + assistingParticipant.championId);
                        return;
                    }
                    attackManager.fireAttackGroup(assistingChampion, assistingParticipant.teamId, currentTime);
                });
            }
        }

        function onTick(e) {

            playerManager.movePlayer(e.delta);
            attackManager.moveParticles(e.delta, e.runTime);

            if (gameState == GameState.Playing) {
                while (eventIndex < game.events.length) {
                    var event = game.events[eventIndex];
                    if (!event) {
                        ++eventIndex;
                        continue;
                    }
                    if (event.timestamp / gameSpeed <= e.runTime) {
                        fireAttacks(event, e.runTime);
                        ++eventIndex;
                    } else {
                        break;
                    }
                }
                if (eventIndex >= game.events.length && !attackManager.attacksOnStage()) {
                    endGame(true);
                }
            } else {
                // Game over. Show victory/defeat screen.
                if (endGameBanner.alpha < 1) {
                    endGameBanner.alpha = Math.min(1, endGameBanner.alpha + e.delta / 1000);
                    newGameButton.alpha = Math.min(1, newGameButton.alpha + e.delta / 1000);
                    retryGameButton.alpha = Math.min(1, retryGameButton.alpha + e.delta / 1000);
                    playerManager.player.alpha = Math.max(0, playerManager.player.alpha - e.delta / 1000);
                    playerManager.hitbox.alpha = Math.max(0, playerManager.hitbox.alpha - e.delta / 1000);
                } else if (!attackManager.attacksOnStage()) {
                    Ticker.reset();
                }
            }

            stage.update();
        }
        
        function startGame(newGame) {
            if (newGame)
                game = newGame;
            eventIndex = 0;

            // Events
            Ticker.framerate = 60;
            Ticker.addEventListener("tick", onTick);

            // Test code (remove sometime)
            /*setTimeout(function() {
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
            }, 1000);*/
        }

        function restartGame() {
            startGame(game);
        }

        // Expose public members
        this.startGame = startGame;
        this.restartGame = restartGame;
    };
})();