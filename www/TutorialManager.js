(function() {
    if (window.TutorialManager)
        return;

    // Imports
    var Container = createjs.Container;

    window.TutorialManager = function(stage, attackManager, keyboardManager, utils) {

        var skipText = utils.createText("Press spacebar to skip tutorial.", 16);
        skipText.textAlign = "right";
        skipText.textBaseline = "bottom";
        skipText.x = stage.width - 15;
        skipText.y = stage.height - 15;

        var eventIndex = -1;

        var timeline = [
            [{ text: "Urf is trying to cross Summoner's Rift,\nbut the summoners are playing\nUltra Rapid Fire!", duration: 5, alpha: 0, alphaSpeed: 2, finished: FinishedAction.Fade }],
            [{ text: "Move Urf using the arrow keys!", advanceKeys: [Key.Up, Key.Down, Key.Left, Key.Right], alpha: 0, alphaSpeed: 2, finished: FinishedAction.Fade }],
            [{ text: "Although Urf is a large manatee, he will only take damage if he is hit in the red dot on his back.", duration: 5, alpha: 0, alphaSpeed: 2, finished: FinishedAction.Fade }],
            [{ text: "Holding the R key causes Urf to Focus. While Focused, the red dot on Urf's back shrinks dramatically, and Urf moves slower. Try it out!", advanceKeys: [Key.Focus], alpha: 0, alphaSpeed: 2, finished: FinishedAction.Fade }],
            [{ text: "Urf's health bar is at the bottom of the screen. Every time Urf is hit, he takes damage. If his health reaches 0, you will lose!"}, duration: 5: alpha: 0, alphaSpeed: 2, finished: FinishedAction.Fade }],
            [{ text: "Try to avoid the incoming attacks!"}, duration: 5, alpha: 0, alphaSpeed: 2, finished: FinishedAction.Fade }],
            [
                { championId: 22, spawnPoint: { x: 0, y: 0 }, targetPoint: { x: stage.width / 2, y: stage.height * 3 / 4 } },
                { championId: 22, spawnPoint: { x: stage.width / 2, y: 0 }, targetPoint: { x: stage.width / 2, y: stage.height * 3 / 4 } },
                { championId: 22, spawnPoint: { x: stage.width, y: 0 }, targetPoint: { x: stage.width / 2, y: stage.height * 3 / 4 } },
            ],
            [{ text: "Great job!", duration: 3, alpha: 0, alphaSpeed: 2, finished: FinishedAction.Fade }],
            [{ text: "Urf has a few other advanced abilities. Don't worry about them yet, but when you're ready, hover over their icons to the left to learn more about them.", duration: 5: alpha: 0, alphaSpeed: 2, finished: FinishedAction.Fade }],
            [{ text: "Now get out there and get Urf across the Rift!"}, duration: 5, alpha: 0, alphaSpeed: 2, finished: FinishedAction.Fade }],
        ];

        function startTutorial() {
            prevEventTime = null;
            eventIndex = -1;
            attackManager.darknessLayer.addChild(skipText);
            stage.update();
        }

        function onTick(elapsedMilliseconds, currentTime) {
            if (eventIndex > timeline.length)  return;

            if (eventIndex < 0) {
                eventIndex = 0;
                fireEvents(timeline[eventIndex], currentTime);
            }
            var group = timeline[eventIndex];
            $.each(group, function(i, e) {
                if (e.obj && e.obj.alphaSpeed) {
                    e.obj.alpha += e.obj.alphaSpeed * elapsedMilliseconds / 1000;
                    if (e.obj.alpha >= 1) {
                        e.obj.alpha = 1;
                        e.obj.alphaSpeed = 0;
                    } else if (e.obj.alpha <= 0) {
                        e.obj.alpha = 0;
                        e.obj.alphaSpeed = 0;
                    }
                }
            });
            while (isGroupCompleted(group, currentTime)) {
                var proceed = true;
                $.each(group, function(i, e) {
                    if (e.finished == FinishedAction.Fade && e.obj) {
                        e.obj.alpha -= elapsedMilliseconds / 500;
                        // Don't proceed to the next event until this one fades out.
                        if (e.obj.alpha > 0) {
                            proceed = false;
                            return;
                        }
                    }
                    if (e.obj) {
                        e.obj.parent.removeChild(e.obj);
                    }
                });
                if (!proceed) break;

                ++eventIndex;
                if (eventIndex >= timeline.length) {
                    // ended
                    if (skipText.parent)
                        skipText.parent.removeChild(skipText);
                    break;
                }
                group = timeline[eventIndex];
                fireEvents(group, currentTime);
            }
        }

        function fireEvents(group, currentTime) {
            $.each(group, function(i, e) {
                if (e.text && !e.obj) {
                    e.obj = utils.createText(e.text);
                    e.obj.x = stage.width / 2;
                    e.obj.y = stage.height / 2;
                }
                if (e.obj) {
                    attackManager.darknessLayer.addChild(e.obj);
                    if (e.alpha !== undefined)
                        e.obj.alpha = e.alpha;
                    if (e.alphaSpeed !== undefined)
                        e.obj.alphaSpeed = e.alphaSpeed;
                }
                if (e.championId) {
                    var champion = champions[e.championId];
                    attackManager.fireAttackGroup(champion, e.team || 100, currentTime, e.spawnPoint, e.targetPoint);
                }
                e.startTime = currentTime;
                e.isCompleted = false;
            });
        }

        function isGroupCompleted(group, currentTime) {
            var isCompleted = true;
            $.each(group, function(i, e) {
                if (!isEventCompleted(e, currentTime)) {
                    isCompleted = false;
                    return false;
                }
            });
            return isCompleted;
        }

        function isEventCompleted(e, currentTime) {
            if (e.isCompleted) return true;
            if (e.obj && e.obj.alphaSpeed) return false;
            if (e.duration && currentTime >= e.startTime + e.duration * 1000) {
                e.isCompleted = true;
            }
            if (e.advanceKeys) {
                $.each(e.advanceKeys, function(i, key) {
                    if (keyboardManager.keyPressed[key]) {
                        e.isCompleted = true;
                        return false;
                    }
                });
            }
            if (e.championId && !attackManager.attacksOnStage()) {
                e.isCompleted = true;
            }
            return e.isCompleted;
        }

        function hasEnded() {
            return eventIndex >= timeline.length;
        }

        // Expose public members
        this.startTutorial = startTutorial;
        this.onTick = onTick;
        this.hasEnded = hasEnded;
    }
})();