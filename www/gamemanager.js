(function() {
    if (window.GameManager)
        return;

    // Imports
    Bitmap = createjs.Bitmap;
    Container = createjs.Container;
    Ticker = createjs.Ticker;

    window.GameManager = function(stage, attackManager, playerManager, dataManager) {

        // Number of times faster this game is than the source game.
        var gameSpeed = 30;

        var gameState = GameState.Playing;
        var defeatBanner = new Bitmap(document.getElementById("defeat"));
        var victoryBanner = new Bitmap(document.getElementById("victory"));
        var endGameBanner;
        
        var game = {};
        var eventIndex = 0;

        function centerRegistrationPoint(bitmap) {
            bitmap.regX = bitmap.image.width / 2;
            bitmap.regY = bitmap.image.height / 2;
        }

        var menuTitle = new Bitmap(document.getElementById("menu_title"));
        var menuUrf = new Bitmap(document.getElementById("menu_urf"));
        var playButtonUnhover = new Bitmap(document.getElementById("menu_play"));
        var playButtonHover = new Bitmap(document.getElementById("menu_play_hover"));
        playButtonUnhover.addEventListener("mouseover",
            function() {
                stage.removeChild(playButtonUnhover);
                stage.addChild(playButtonHover);
                stage.update();
            });
        playButtonUnhover.addEventListener("click",
            function() {
                playButtonHover.removeEventListener("mouseout", playButtonMouseOut);
                newGame();
            });
        var playButtonMouseOut = function() {
            stage.removeChild(playButtonHover);
            stage.addChild(playButtonUnhover);
            stage.update();
        };
        playButtonHover.addEventListener("mouseout", playButtonMouseOut);
        playButtonHover.addEventListener("click",
            function() {
                playButtonHover.removeEventListener("mouseout", playButtonMouseOut);
                newGame();
            });
        
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
        newMatchButtonUnhover.addEventListener("click",
            function() {
                newGame();
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
        newMatchButtonHover.addEventListener("click",
            function() {
                newGame();
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
        retryMatchButtonUnhover.addEventListener("click",
            function() {
                retryGame();
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
        retryMatchButtonHover.addEventListener("click",
            function() {
               retryGame(); 
            });


        playerManager.addEventListener("dead", function(e) {
            endGame(false);
        });

        // Methods

        function showMenu() {
            centerRegistrationPoint(menuTitle);
            centerRegistrationPoint(menuUrf);
            centerRegistrationPoint(playButtonUnhover);
            centerRegistrationPoint(playButtonHover);

            menuTitle.x = stage.width / 2;
            menuTitle.y = 130;
            menuUrf.x = stage.width / 2;
            menuUrf.y = 400;
            playButtonUnhover.x = stage.width / 2;
            playButtonUnhover.y = 630;
            playButtonHover.x = playButtonUnhover.x;
            playButtonHover.y = playButtonUnhover.y;


            stage.addChild(menuTitle);
            stage.addChild(menuUrf);
            stage.addChild(playButtonUnhover);
            stage.enableMouseOver();
            stage.update();
        }

        function startGame(newGame) {
            if (newGame)
                game = newGame;

            stage.removeAllChildren();

            // The hitbox should appear above all bullets.
            // The player should appear below all bullets (except the bottom layer, e.g. Bard ult)
            stage.addChild(attackManager.bottomLayer);
            stage.addChild(playerManager.player);
            stage.addChild(attackManager.mainLayer);
            stage.addChild(attackManager.topLayer);
            stage.addChild(attackManager.darknessLayer);
            stage.addChild(playerManager.damageIndicator);
            stage.addChild(playerManager.hitbox);

            eventIndex = 0;

            // Reset a number of things.
            // Disable mouse over events.
            stage.enableMouseOver(0);
            playerManager.player.health = 2000;
            if (endGameBanner) {
                stage.removeChild(endGameBanner);
            }
            if (newGameButton) {
                stage.removeChild(newGameButton);
            }
            if (retryGameButton) {
                stage.removeChild(retryGameButton);
            }

            playerManager.resetPlayer();
            attackManager.destroyAllParticles();

            // Events
            Ticker.reset();
            Ticker.framerate = 60;
            Ticker.addEventListener("tick", onTick);

            gameState = GameState.Playing;
            $("#game-id").text(game.id);
            $("#game-time").text("0:00");
        }

        function newGame() {
            dataManager.getGameData()
                .done(function(data) {
                    startGame(data);
                }).fail(function(promise, text, error) {
                    console.log("Failed to get game data.");
                });
            stage.enableMouseOver(0);
            stage.removeAllChildren();
            stage.update();
        }

        function retryGame() {
            startGame(game);
        }

        function endGame(victory) {
            if (gameState != GameState.Playing) return;

            gameState = victory ? GameState.Victory : GameState.Defeat;
            endGameBanner = victory ? victoryBanner : defeatBanner;
            centerRegistrationPoint(endGameBanner);
            endGameBanner.x = stage.width / 2;
            endGameBanner.y = 250;
            endGameBanner.alpha = 0;
            stage.addChild(endGameBanner);

            centerRegistrationPoint(newMatchButtonHover);
            centerRegistrationPoint(newMatchButtonUnhover);
            centerRegistrationPoint(retryMatchButtonHover);
            centerRegistrationPoint(retryMatchButtonUnhover);
            
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
                        console.warn("Could not find assisting participant with ID " + id);
                        return;
                    }
                    var assistingChampion = champions[assistingParticipant.championId];
                    if (!assistingChampion) {
                        console.warn("Could not find assisting champion with ID " + assistingParticipant.championId);
                        return;
                    }
                    attackManager.fireAttackGroup(assistingChampion, assistingParticipant.teamId, currentTime);
                });
            }
        }

        function onTick(e) {

            playerManager.movePlayer(e.delta, gameState);
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
                if (eventIndex >= game.events.length && !attackManager.attacksOnStage() && !playerManager.isInStasis()) {
                    endGame(true);
                }

                var totalGameSeconds = Math.floor(e.runTime * gameSpeed / 1000);
                var minute = Math.floor(totalGameSeconds / 60);
                var second = totalGameSeconds % 60;
                second = ("0" + second).slice(-2);
                $("#game-time").text(minute + ":" + second);

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
        // Expose public members
        this.showMenu = showMenu;
        this.startGame = startGame;
        this.newGame = newGame;
        this.retryGame = retryGame;
    };
})();