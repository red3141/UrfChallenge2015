(function() {
    if (window.TutorialManager)
        return;

    // Imports
    var Container = createjs.Container;
    var Text = createjs.Text;

    window.TutorialManager = function(stage, attackManager) {

        var skpiText = new Text("Press space to skip.");

        var storyText1 = new Text();

        var eventStartTime = null;
        var eventIndex = 0;

        var timeline = [
            { duration: 500, obj: storyText1, alpha: 0, alphaSpeed: 2 },
            { duration: 5000, obj: storyText1,  },
        ];

        function startTutorial() {
            prevEventTime = null;
            eventIndex = 0;
            stage.enableMouseOver(0);
            stage.removeAllChildren();
            stage.update();
        }

        function onTick(elapsedMilliseconds, currentTime) {
            if (eventIndex > timeline.length)  return;

            var e = timeline[eventIndex];
            if (eventStartTime === null) {
                eventStartTime = currentTime;
                fireEvent(e);
            }
            while (currentTime >= eventStartTime + e.duration * 1000) {
                ++eventIndex;
                if (eventIndex > timeline.length) break;
                e = timeline[eventIndex];
                fireEvent(e);
            }
        }

        function fireEvent(e) {
            eventStartTime = currentTime;
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