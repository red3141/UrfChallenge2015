(function() {
    var stage = new createjs.Stage("canvas");
    var ahri = new createjs.Bitmap(document.getElementById("ahri"));
    ahri.x = 100;
    ahri.y = 100;
    stage.addChild(ahri);
    stage.update();
})();