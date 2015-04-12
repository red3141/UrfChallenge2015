(function() {
    if (window.DataManager)
        return;

    window.DataManager = function() {
        function getGameData(gameId) {
            return $.ajax({
                url: "games/" + (gameId || "random"),
                dataType: 'json'
            });
        }

        //Expose public members
        this.getGameData = getGameData;
    }
})();