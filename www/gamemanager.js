(function() {
    if (window.GameManager)
        return;

    // Imports
    var Bitmap = createjs.Bitmap;
    var EventDispatcher = createjs.EventDispatcher;
    var Ticker = createjs.Ticker;
    var Text = createjs.Text;

    window.GameManager = function(stage, attackManager, playerManager, keyboardManager, dataManager) {

        var self = this;

        // Number of times faster this game is than the source game.
        var gameSpeed = 30;

        var gameState = GameState.Ended;
        
        var game = {};
        var isGamePreloading = false;
        var preloadMatchId = null;
        var isGamePreloaded = false;
        var startGameOnLoad = false;
        var eventIndex = 0;

        var defeatBanner, victoryBanner, endGameBanner, menuTitle, menuUrf,
            playButtonUnhover, playButtonHover, newGameButton, retryGameButton,
            newMatchButtonUnhover, newMatchButtonHover,
            retryMatchButtonUnhover, retryMatchButtonHover;

        var loadingMessage = new Text("Loading...", "24px Arial", "#FFF");
        loadingMessage.textBaseline = "alphabetic";
        loadingMessage.x = (stage.width - 80) / 2;
        loadingMessage.y = stage.height / 2;
        stage.addChild(loadingMessage);
        stage.update();

        $("#game-link").val(location.href);
        $(".fb-share-button").attr("data-href", location.href);

        $("#resources").imagesLoaded().always(function() {

            defeatBanner = new Bitmap(document.getElementById("defeat"));
            victoryBanner = new Bitmap(document.getElementById("victory"));

            menuTitle = new Bitmap(document.getElementById("menu_title"));
            menuUrf = new Bitmap(document.getElementById("menu_urf"));
            playButtonUnhover = new Bitmap(document.getElementById("menu_play"));
            playButtonHover = new Bitmap(document.getElementById("menu_play_hover"));
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
            function playButtonMouseOut() {
                stage.removeChild(playButtonHover);
                stage.addChild(playButtonUnhover);
                stage.update();
            }
            playButtonHover.addEventListener("mouseout", playButtonMouseOut);
            playButtonHover.addEventListener("click",
                function() {
                    playButtonHover.removeEventListener("mouseout", playButtonMouseOut);
                    newGame();
                });

            newMatchButtonUnhover = new Bitmap(document.getElementById("button_new"));
            newMatchButtonHover = new Bitmap(document.getElementById("button_new_hover"));
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
            retryMatchButtonUnhover = new Bitmap(document.getElementById("button_retry"));
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
            retryMatchButtonHover = new Bitmap(document.getElementById("button_retry_hover"));
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

            self.dispatchEvent("ready");
        });
        
        function centerRegistrationPoint(bitmap) {
            bitmap.regX = bitmap.image.width / 2;
            bitmap.regY = bitmap.image.height / 2;
        }

        playerManager.addEventListener("dead", function(e) {
            endGame(false);
        });

        keyboardManager.addEventListener("pause", function(e) {
            Ticker.paused = !Ticker.paused;
        });

        // Methods

        function parseQuery() {
            var obj = {};
            if (!location.search || !location.search.length)
                return obj;
            var query = location.search.substring(1);
            var vars = query.split('&');
            for (var i = 0; i < vars.length; i++) {
                var pair = vars[i].split('=');
                var name = decodeURIComponent(pair[0]);
                var value = decodeURIComponent(pair[1]);
                obj[name] = value;
            }
            return obj;
        }

        function getParticipantById(id) {
            if (id < 1 || id > game.participants.length) {
                console.warn("Participant ID out of range: " + id);
                return null;
            }
            var guess = game.participants[id - 1];
            if (guess && guess.id == id)
                return guess;
            for (var i = 0; i < game.participants.length; ++i) {
                var participant = game.participants[i];
                if (participant && participant.id == id)
                    return participant;
            }
            console.warn("Could not find participant with ID: " + id);
            return null;
        }

        function showMenu() {
            stage.removeChild(loadingMessage);

            centerRegistrationPoint(menuTitle);
            centerRegistrationPoint(menuUrf);
            centerRegistrationPoint(playButtonUnhover);
            centerRegistrationPoint(playButtonHover);

            menuTitle.x = stage.width / 2;
            menuTitle.y = 130;
            menuUrf.x = stage.width / 2;
            menuUrf.y = 400;
            playButtonUnhover.x = stage.width / 2;
            playButtonUnhover.y = 635;
            playButtonHover.x = playButtonUnhover.x;
            playButtonHover.y = playButtonUnhover.y;

            var queryObj = parseQuery();
            isGamePreloading = true;
            preloadMatchId = queryObj.matchId;
            dataManager.getGameData(preloadMatchId)
                .done(function(data) {
                    game = data;
                    isGamePreloaded = true;
                    isGamePreloading = false;
                    if (startGameOnLoad) {
                        startGame(data);
                    } else if (preloadMatchId) {
                        $("#game-id").text(queryObj.matchId);
                        var matchIdText = new Text("Match ID: " + queryObj.matchId, "24px Arial", "#FFF");
                        matchIdText.textBaseline = "alphabetic";
                        matchIdText.x = (stage.width - 240) / 2;
                        matchIdText.y = 595;
                        stage.addChild(matchIdText);
                        stage.update();
                    }
                    preloadMatchId = null;
                }).fail(function(promise, text, error) {
                    isGamePreloaded = false;
                    isGamePreloading = false;
                    console.log("Failed to get game data.");
                    if (startGameOnLoad)
                        showErrorScreen();
                });

            stage.addChild(menuTitle);
            stage.addChild(menuUrf);
            stage.addChild(playButtonUnhover);
            stage.enableMouseOver();
            stage.update();
        }
        
        function showErrorScreen() {
            var errorText = new Text("Failed to load match.", "24px Arial", "#FFF");
            errorText.textBaseline = "alphabetic";
            errorText.x = (stage.width - 160) / 2;
            errorText.y = stage.height / 2;
            stage.addChild(errorText);
            stage.update();
        }

        function startGame(newGame) {
            stage.enableMouseOver(0);
            stage.removeAllChildren();
            stage.update();
            isGamePreloaded = false;
            preloadMatchId = null;
            if (newGame && (newGame != game || !location.search)) {
                game = newGame;
                var query = "?matchId=" + game.id;
                var absoluteUrl = [location.protocol, '//', location.host, location.pathname].join('');
                $("#game-link").val(absoluteUrl + query);
                $(".fb-share-button").attr("data-href", absoluteUrl + query);
            }

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
            // Clear the stage here to give feedback that the button was clicked.
            stage.enableMouseOver(0);
            stage.removeAllChildren();
            stage.update();
            if (isGamePreloaded) {
                startGame(game);
            } else if (isGamePreloading) {
                startGameOnLoad = true;
                // TODO: loading message
            } else {
                // TODO: loading message
                dataManager.getGameData()
                    .done(function(data) {
                        startGame(data);
                    }).fail(function(promise, text, error) {
                        console.log("Failed to get game data.");
                        showErrorScreen();
                    });
            }
        }

        function retryGame() {
            startGame(game);
        }

        function endGame(victory) {
            if (gameState != GameState.Playing) return;

            gameState = GameState.Ended;
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
            var participant = getParticipantById(event.killerId);
            if (!participant) {
                console.log("Failed to get participant (event ID: " + event.id + ")");
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
                    var assistingParticipant = getParticipantById(id);
                    if (!assistingParticipant) {
                        console.log("Failed to get assisting participant (event ID: " + event.id + ")");
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
            if (e.paused) return;

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

    GameManager.prototype = new EventDispatcher();
})();