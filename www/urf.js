(function() {
    // Imports
    Bitmap = createjs.Bitmap;
    Container = createjs.Container;
    Stage = createjs.Stage;
    Ticker = createjs.Ticker;

    // Stage setup
    var stage = new Stage("canvas");
    stage.width = stage.canvas.width;
    stage.height = stage.canvas.height;
    var bottomLayer = new Container();
    var mainLayer = new Container();
    var topLayer = new Container();
    stage.addChild(bottomLayer);
    stage.addChild(mainLayer);
    stage.addChild(topLayer);
    
    // The player should appear over all bullet layers (so they appear overtop of the Akali shoud)
    var player = new Bitmap();
    stage.addChild(player);

    var particles = [];

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
        var availableWidth = stage.width / 2;
        var availableHeight = stage.height;
        if (targeted) {
            targetPoint.x = player.x + player.regX;
            targetPoint.y = player.y + player.regY;
        } else {
            targetPoint.x = Math.random() * availableWidth;
            targetPoint.y = Math.random() * availableHeight; // TODO: make random y position favour the bottom more?
            if (team == Team.Two)
                targetPoint.x = stage.width - targetPoint.x;
        }
        targetPoint.x = Math.max(5, Math.min(targetPoint.x, stage.width - 5));
        targetPoint.y = Math.max(5, targetPoint.y);

        // Determine spawn point. The attack will leave from this point and go through the target point.
        availableWidth -= 20; // Make it clear which side the bullet is coming from.
        availableHeight = targetPoint.y; // Don't shoot from below the target location.
        var spawnPos = Math.random() * (availableWidth + availableHeight);
        var spawnPoint = { x: 0, y: 0 };
        if (spawnPos <= availableWidth) {
            spawnPoint.x = spawnPos;
        } else {
            spawnPoint.y = spawnPos - availableWidth;
        }
        if (team == Team.Two)
            spawnPoint.x = stage.width - spawnPoint.x;

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
        var image = champion.image;
        var particle = new Bitmap(document.getElementById(image.id));
        particle.imageDef = image;
        particle.attack = attack;
        var angle = Math.atan2(targetPoint.y - spawnPoint.y, targetPoint.x - spawnPoint.x);
        if ((image.flipIfForward && Math.abs(angle) < Math.PI / 2) || (image.flipIfBackward && Math.abs(angle) > Math.PI / 2))
            particle.scaleX = -1;

        particle.regX = particle.image.width * (image.regXRatio || 0.5);
        particle.regY = particle.image.height * (image.regYRatio || 0.5);
        particle.x = spawnPoint.x;
        particle.y = spawnPoint.y;
        switch (attack.type) {
            case AttackType.Bullet:
                if (attack.angleOffset)
                    angle += attack.angleOffset * Math.PI / 180;
                particle.vx = attack.speed * Math.cos(angle);
                particle.vy = attack.speed * Math.sin(angle);
                if (image.pointAngle !== undefined)
                    particle.rotation = angle * 180 / Math.PI - image.pointAngle;
                if (particle.scaleX == -1)
                    particle.rotation += 2 * image.pointAngle - 180;
                break;
        }
        particles.push(particle);
        mainLayer.addChild(particle);
    }

    var prevTickTime = new Date().getTime();

    // Events
    Ticker.framerate = 30;
    Ticker.addEventListener("tick", function(e) {
        var currentTime = new Date().getTime();
        var elapsedSeconds = (currentTime - prevTickTime) / 1000;
        prevTickTime = currentTime;
        for (var i = 0; i < particles.length; ++i) {
            var particle = particles[i];
            if (particle.vx)
                particle.x += particle.vx * elapsedSeconds;
            if (particle.vy)
                particle.y += particle.vy * elapsedSeconds;
            // TODO: apply rotationSpeed
            // TODO: check if the particle has left the screen or its duration has completed.
        }
        // TODO: move player
        // TODO: run hit tests
        stage.update();
    });

    // Test code (remove sometime)
    fireAttackGroup(champions["103"], 100);
    fireAttackGroup(champions["22"], 200);
    fireAttackGroup(champions["42"], 100);
    fireAttackGroup(champions["42"], 200);
    fireAttackGroup(champions["201"], 100);
    fireAttackGroup(champions["201"], 200);
})();