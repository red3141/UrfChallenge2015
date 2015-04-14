(function() {
    if (window.DataManager)
        return;

    window.DataManager = function() {
        function getGameData(gameId) {
            return $.ajax({
                url: "http://urf.pororeplays.com/games/" + (gameId || "random"),
                dataType: 'json'
            });
        }

        //Expose public members
        this.getGameData = getGameData;
    }
})();