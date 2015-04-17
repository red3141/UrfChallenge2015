(function() {
    if (window.GameManager)
        return;

    // Imports
    var Bitmap = createjs.Bitmap;
    var EventDispatcher = createjs.EventDispatcher;
    var Graphics = createjs.Graphics;
    var Shape = createjs.Shape;
    var Ticker = createjs.Ticker;

    window.GameManager = function(stage, attackManager, playerManager, keyboardManager, dataManager, tutorialManager, utils) {

        var self = this;

        Ticker.timingMode = Ticker.RAF;

        // Number of times faster this game is than the source game.
        var gameSpeed = 30;

        var gameState = GameState.Ended;
        
        var game = null;
        var isGamePreloading = false;
        var isGamePreloaded = false;
        var startGameOnLoad = false;
        var preloadMatchId = null;
        var preloadedGame = null;
        var eventIndex = 0;
        var firstFrame = true;
        var gameStartTime = 0;

        //utils.setCookie("doneTutorial", "false");
        var cookies = utils.getCookies();
        var doneTutorial = cookies.doneTutorial == "true";

        var defeatBanner, victoryBanner, endGameBanner, menuTitle, menuUrf,
            playButtonUnhover, playButtonHover, newGameButton, retryGameButton,
            newMatchButtonUnhover, newMatchButtonHover,
            retryMatchButtonUnhover, retryMatchButtonHover;

        var loadingMessage = utils.createText("Loading...");
        stage.addChild(loadingMessage);

        $("#game-link").val(location.href);
        $.each($("#game-link"), function(i, elem) { elem.scrollLeft = elem.scrollWidth; });
        $("#game-link").click(function() {
            this.select();
        });
        $(".fb-share-button").attr("data-href", location.href);

        var progressBar = new Shape();
        progressBar.x = stage.width / 2;
        progressBar.y = stage.height / 2 + 30;
        progressBar.graphics.beginFill("#555555");
        progressBar.graphics.drawRoundRect(-100, 0, 200, 20, 5);
        progressBar.graphics.endFill();
        stage.addChild(progressBar);
        stage.update();

        var imageLoadedCount = 0;

        $("#resources").imagesLoaded()
            .progress(function(instance, image) {
                ++imageLoadedCount;
                var progressFraction = imageLoadedCount / instance.images.length;
                var w = Math.max(10, progressFraction * 200);
                progressBar.graphics.beginFill("#4f9b27");
                progressBar.graphics.drawRoundRect(-100, 0, w, 20, 5);
                progressBar.graphics.endFill();
                stage.update();
            })
            .always(function() {
                stage.update();

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
                        if (doneTutorial) {
                            newGame();
                        } else {
                            startTutorial();
                        }
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
                        if (doneTutorial) {
                            newGame();
                        } else {
                            startTutorial();
                        }
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

        playerManager.addEventListener("dead", function(e) {
            endGame(false);
        });

        keyboardManager.addEventListener("pause", function(e) {
            if (gameState != GameState.Ended)
                Ticker.paused = !Ticker.paused;
        });

        // Methods

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

        function startPreloadingMatch(matchId) {
            preloadMatchId = matchId;
            isGamePreloading = true;
            isGamePreloaded = false;
            startGameOnLoad = false;
            dataManager.getGameData(matchId)
                .done(function(data) {
                    preloadedGame = data;
                    isGamePreloaded = true;
                    isGamePreloading = false;
                    if (startGameOnLoad) {
                        startGame(preloadedGame);
                    } else if (matchId) {
                        $("#game-id").text(matchId);
                        var matchIdText = utils.createText("Match ID: " + matchId);
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
        }

        function showMenu() {
            stage.removeChild(loadingMessage);
            stage.removeChild(progressBar);

            utils.centerRegistrationPoint(menuTitle);
            utils.centerRegistrationPoint(menuUrf);
            utils.centerRegistrationPoint(playButtonUnhover);
            utils.centerRegistrationPoint(playButtonHover);

            menuTitle.x = stage.width / 2;
            menuTitle.y = 130;
            menuUrf.x = stage.width / 2;
            menuUrf.y = 400;
            playButtonUnhover.x = stage.width / 2;
            playButtonUnhover.y = 635;
            playButtonHover.x = playButtonUnhover.x;
            playButtonHover.y = playButtonUnhover.y;

            var queryObj = utils.parseQuery();
            startPreloadingMatch(queryObj.matchId);

            stage.addChild(menuTitle);
            stage.addChild(menuUrf);
            stage.addChild(playButtonUnhover);
            stage.enableMouseOver();
            stage.update();
        }
        
        function showErrorScreen() {
            stage.removeAllChildren();
            var errorText = utils.createText("Failed to load match :(");
            stage.addChild(errorText);
            stage.update();
        }

        function setupGameArea() {
            attackManager.destroyAllParticles();
            playerManager.resetPlayer();

            // Setup for a real game or tutorial
            stage.enableMouseOver(0);
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

            stage.update();

            Ticker.reset();
            firstFrame = true;
            Ticker.addEventListener("tick", onTick);
        }

        function startTutorial() {
            setupGameArea();
            gameState = GameState.Tutorial;
            tutorialManager.startTutorial();
            keyboardManager.addEventListener("skip", skipTutorial);
        }

        function skipTutorial() {
            keyboardManager.removeEventListener("skip", skipTutorial);
            doneTutorial = true;
            utils.setCookie("doneTutorial", "true");
            newGame();
        }

        function startGame(newGame) {
            setupGameArea();
            isGamePreloaded = false;
            preloadMatchId = null;
            if (newGame && (newGame != game || !location.search)) {
                game = newGame;
                var query = "?matchId=" + game.id;
                var absoluteUrl = [location.protocol, '//', location.host, location.pathname].join('');
                $("#game-link").val(absoluteUrl + query);
                $.each($("#game-link"), function(i, elem) { elem.scrollLeft = elem.scrollWidth; });
                $(".fb-share-button").attr("data-href", absoluteUrl + query);
            }

            eventIndex = 0;

            gameState = GameState.Playing;
            $("#game-id").text(game.id);
            $("#game-time").text("0:00");
        }

        function newGame() {
            // Clear the stage here to give feedback that the button was clicked.
            stage.enableMouseOver(0);
            stage.removeAllChildren();
            if (isGamePreloaded) {
                startGame(preloadedGame);
            } else if (isGamePreloading) {
                startGameOnLoad = true;
                stage.addChild(loadingMessage);
            } else {
                dataManager.getGameData()
                    .done(function(data) {
                        startGame(data);
                    }).fail(function(promise, text, error) {
                        console.log("Failed to get game data.");
                        showErrorScreen();
                    });
                stage.addChild(loadingMessage);
            }
            stage.update();
        }

        function retryGame() {
            if (game)
                startGame(game);
            else
                startTutorial();
        }

        function endGame(victory) {
            if (gameState == GameState.Ended) return;

            if (!isGamePreloaded && !isGamePreloading)
                startPreloadingMatch();

            gameState = GameState.Ended;
            endGameBanner = victory ? victoryBanner : defeatBanner;
            utils.centerRegistrationPoint(endGameBanner);
            endGameBanner.x = stage.width / 2;
            endGameBanner.y = 250;
            endGameBanner.alpha = 0;
            stage.addChild(endGameBanner);

            utils.centerRegistrationPoint(newMatchButtonHover);
            utils.centerRegistrationPoint(newMatchButtonUnhover);
            utils.centerRegistrationPoint(retryMatchButtonHover);
            utils.centerRegistrationPoint(retryMatchButtonUnhover);
            
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

            // There appears to be a bug in EaselJS where the runTime may be negative after you pause a game, then reset it.
            // This is a workaround. And also just good for robustness.
            if (firstFrame) {
                gameStartTime = e.runTime;
                firstFrame = false;
            }

            var currentTime = e.runTime - gameStartTime;

            playerManager.movePlayer(e.delta, gameState);
            attackManager.moveParticles(e.delta, currentTime);

            if (gameState == GameState.Playing) {
                while (eventIndex < game.events.length) {
                    var event = game.events[eventIndex];
                    if (!event) {
                        ++eventIndex;
                        continue;
                    }
                    if (event.timestamp / gameSpeed <= currentTime) {
                        fireAttacks(event, currentTime);
                        ++eventIndex;
                    } else {
                        break;
                    }
                }
                if (eventIndex >= game.events.length && !attackManager.attacksOnStage() && !playerManager.isInStasis()) {
                    endGame(true);
                }

                var totalGameSeconds = Math.floor(currentTime * gameSpeed / 1000);
                var minute = Math.floor(totalGameSeconds / 60);
                var second = totalGameSeconds % 60;
                second = ("0" + second).slice(-2);
                $("#game-time").text(minute + ":" + second);

            } else if (gameState == GameState.Tutorial) {
                tutorialManager.onTick(e.delta, currentTime);
                if (tutorialManager.hasEnded() && !playerManager.isInStasis()) {
                    doneTutorial = true;
                    utils.setCookie("doneTutorial", "true");
                    keyboardManager.removeEventListener("skip", skipTutorial);
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
                    setTimeout(function() { Ticker.reset() }, 1);
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