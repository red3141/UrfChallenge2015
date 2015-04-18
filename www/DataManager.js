(function() {
    if (window.DataManager)
        return;

    window.DataManager = function() {
        function getGameData(gameId) {
            var dfd = $.Deferred();
            $.ajax({
                url: "//urf.pororeplays.com/games/" + (gameId || "random"),
                dataType: 'json'
            }).done(/*function(data) {
                dfd.resolve(data);
            }).fail(*/function() {
                // Failed to get data from server :(
                // Grab a pre-stored JSON game so the user at least has something to look at.
                console.log("Failed to get game data. Attempting to get backup game...");
                getBackupGameData(gameId).done(function(data) {
                    dfd.resolve(data);
                }).fail(function(promise, text, error) {
                    dfd.reject(promise, text, error);
                });
            });
            return dfd;
        }

        function getBackupGameData(gameId) {
            var backupGameIds = ["1788237681", "1792447563", "1793039468", "1788238478"];
            var backupGameId;
            if (gameId) {
                $.each(backupGameIds, function(i, id) {
                    if (id == gameId) {
                        backupGameId = id;
                        return false;
                    }
                });
            }
            if (!backupGameId) {
                var i = Math.floor(Math.random() * 4);
                backupGameId = backupGameIds[i];
            }
            return $.ajax({
                url: "backupGames/" + backupGameId + ".json",
                dataType: 'json'
            });
        }

        // Expose public members
        this.getGameData = getGameData;
    }
})();