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
        var endGameBanner = {};

        var game = {};
        var eventIndex = 0;

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