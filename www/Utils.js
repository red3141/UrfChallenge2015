(function() {
    if (window.Utils)
        return;

    var Text = createjs.Text;

    window.Utils = function() {
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
            return text;
        }

        // Expose public members
        this.centerRegistrationPoint = centerRegistrationPoint;
        this.createText = createText;
    };
})();