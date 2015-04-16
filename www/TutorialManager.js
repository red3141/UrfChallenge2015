(function() {
    if (window.TutorialManager)
        return;

    // Imports
    var Text = createjs.Text;

    window.TutorialManager = function(stage) {

        var storyText1 = new Text()

        function startTutorial() {
            stage.enableMouseOver(0);
            stage.removeAllChildren();
            stage.update();
        }

        function onTick(elapsedMilliseconds, currentTime) {

        }

        function hasEnded() {

        }

        // Expose public members
        this.startTutorial = startTutorial;
        this.onTick = onTick;
        this.hasEnded = hasEnded;
    }
})();