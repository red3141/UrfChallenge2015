(function() {
    if (window.Utils)
        return;

    var Text = createjs.Text;

    window.Utils = function(stage) {
        function getCookies() {
            var cookieStrings = document.cookie.split(";");
            var cookies = {};
            $.each(cookieStrings, function(i, cookie) {
                var parts = cookie.split("=");
                if (parts.length < 2) return;
                cookies[parts[0].trim()] = parts[1].trim();
            });
            return cookies;
        }

        function setCookie(key, value) {
            document.cookie = key + "=" + value;
        }

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

        function centerRegistrationPoint(displayObject) {
            var bounds = displayObject.getBounds();
            displayObject.regX = bounds.width / 2;
            displayObject.regY = bounds.height / 2;
        }

        function createText(value, size) {
            if (!size)
                size = "24px";
            else if (typeof size === "number")
                size += "px";
            var text = new Text(value, size + " Arial", "#FFF");
            text.textAlign = "center";
            text.textBaseline = "middle";
            text.x = stage.width / 2;
            text.y = stage.height / 2;
            return text;
        }

        // Expose public members
        this.getCookies = getCookies;
        this.setCookie = setCookie;
        this.parseQuery = parseQuery;
        this.centerRegistrationPoint = centerRegistrationPoint;
        this.createText = createText;
    };
})();