(function() {
    // Imports
    Bitmap = createjs.Bitmap;
    Container = createjs.Container;
    Stage = createjs.Stage;

    var stage = new Stage("canvas");
    var bottomLayer = new Container();
    var mainLayer = new Container();
    var topLayer = new Container();
    stage.addChild(bottomLayer);
    stage.addChild(mainLayer);
    stage.addChild(topLayer);
    
    // The player should appear over all bullet layers (so they appear overtop of the Akali shoud)
    var player = new Bitmap();
    stage.addChild(player);

    // Methods

    function fireAttackGroup(champion, team) {
        var targeted = false;
        for (var i = 0; i < champion.attacks.length; ++i) {
            if (champion.attacks[i].targeted) {
                targeted = true;
                break;
            }
        }
        
        // Determine target point. 
        var targetPoint = { x: 0, y: 0 };
        var availableWidth = stage.canvas.width / 2;
        var availableHeight = stage.canvas.height;
        if (targeted) {
            targetPoint.x = player.x + player.regX;
            targetPoint.y = player.y + player.regY;
        } else {
            targetPoint.x = Math.random() * availableWidth;
            targetPoint.y = Math.random() * availableHeight;
            if (team == Team.Two)
                spawnPoint.x = stage.canvas.width - spawnPoint.x;
        }

        // Determine spawn point. The attack will leave from this point and go through the target point.
        availableWidth -= 20; // Make it clear which side the bullet is coming from.
        availableHeight = targetPoint.y; // Don't shoot from below the target location.
        var spawnPos = Math.random() * (availableWidth + availableHeight);
        var spawnPoint = { x: 0, y: 0 };
        if (spawnPos <= availableWidth)
            spawnPoint.x = spawnPos;
        else
            spawnPoint.y = spawnPos - availableWidth;

        if (team == Team.Two)
            spawnPoint.x = stage.canvas.width - spawnPoint.x;

        for (var i = 0; i < champion.attacks.length; ++i) {
            var attack = champion.attacks[i];
            var attackFunction = function() { fireAttack(champion, team, attack, spawnPoint, targetPoint); };
            if (attack.delay)
                setTimeout(attackFunction, attack.delay);
            else
                attackFunction();
        }
    }

    function fireAttack(champion, team, attack, spawnPoint, targetPoint) {
        var particle = new Bitmap(document.getElementById(champion.image));
        if ((team == Team.One && attack.flipTeam1) || (team == Team.Two && attack.flipTeam2))
            particle.scaleX = -1;

        particle.x = spawnPoint.x;
        particle.y = spawnPoint.y;
        switch (attack.type) {
            case AttackType.Bullet:
                var angle = Math.atan2(targetPoint.y - spawnPoint.y, targetPoint.x, spawnPoint.x);
                if (attack.angleOffset)
                    angle += attack.angleOffset * Math.PI / 180;
                particle.vx = attack.speed * Math.cos(angle);
                particle.vy = attack.speed * Math.sin(angle);
                if (attack.autoRotate)
                    particle.rotation = angle * 180 / Math.Pi - (attack.imageAngle || 0);
                break;
        }
        stage.addChild(particle);
        stage.update();
    }

    var ahri = champions["103"];
    fireAttackGroup(ahri, 100);
})();