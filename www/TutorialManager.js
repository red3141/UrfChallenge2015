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
            { text: "Urf is trying to cross Summoner's Rift,\nbut the summoners are playing\nUltra Rapid Fire!", duration: 5, alpha: 0, alphaSpeed: 2, finished: FinishedAction.Fade },
            { text: "Move Urf using the arrow keys!", advanceKeys: [Key.Up, Key.Down, Key.Left, Key.Right], alpha: 0, alphaSpeed: 2, finished: FinishedAction.Fade },
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
                fireEvent(timeline[eventIndex], currentTime);
            }
            var e = timeline[eventIndex];
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
            while (isCompleted(e, currentTime)) {
                if (e.finished == FinishedAction.Fade && e.obj) {
                    e.obj.alpha -= elapsedMilliseconds / 500;
                    // Don't proceed to the next event until this one fades out.
                    if (e.obj.alpha > 0) break;
                }
                if (e.obj) {
                    e.obj.parent.removeChild(e.obj);
                }
                ++eventIndex;
                if (eventIndex >= timeline.length) {
                    // ended
                    if (skipText.parent)
                        skipText.parent.removeChild(skipText);
                    break;
                }
                e = timeline[eventIndex];
                fireEvent(e, currentTime);
            }
        }

        function fireEvent(e, currentTime) {
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
            e.startTime = currentTime;
            e.isCompleted = false;
        }

        function isCompleted(e, currentTime) {
            if (e.isCompleted) return true;
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