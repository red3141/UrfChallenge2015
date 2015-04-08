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
    
	// The hitbox should appear above the player.
	var hitbox = new Bitmap(document.getElementById("hitbox"));
	hitbox.regX = hitbox.image.width / 2;
	hitbox.regY = hitbox.image.height / 2;
	hitbox.x = stage.width / 2;
	hitbox.y = stage.height - 100;
    // The player should appear over all bullet layers (so they appear over the Akali shroud).
    var player = new Bitmap(document.getElementById("urf"));
	player.regX = player.image.width / 2;
	player.regY = player.image.height / 2;
    player.x = hitbox.x;
    player.y = hitbox.y;
	
	stage.addChild(player);
	stage.addChild(hitbox);

    var particles = [];
	// Keep track of which arrow keys are pressed.
	var keyPressed = [false, false, false, false];

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

        $.each(champion.attacks, function(i, attack) {
            var attackFunction = function() { fireAttack(champion, team, attack, spawnPoint, targetPoint); };
            if (attack.delay)
                setTimeout(attackFunction, attack.delay * 1000);
            else
                attackFunction();
        });
    }

    function fireAttack(champion, team, attack, spawnPoint, targetPoint) {
        var imageDef = champion.image;
        var particle = new Bitmap(document.getElementById(imageDef.id));
        particle.imageDef = imageDef;
        particle.attack = attack;
        var angle = Math.atan2(targetPoint.y - spawnPoint.y, targetPoint.x - spawnPoint.x);
        particle.flipDirection = 1;
        if ((imageDef.flipIfForward && (attack.speed ? Math.abs(angle) < Math.PI / 2 : team == Team.One))
            || (imageDef.flipIfBackward && (attack.speed ? Math.abs(angle) > Math.PI / 2 : team == Team.Two))) {
            particle.scaleX = -1;
            particle.flipDirection = -1;
        }
        if (particle.image.width == 0) {
            console.warn("image width is 0: " + imageDef.id);
        }
        if (imageDef.regXRatio === undefined)
            imageDef.regXRatio = 0.5;
        if (imageDef.regYRatio === undefined)
            imageDef.regYRatio = 0.5;
        particle.regX = particle.image.width * imageDef.regXRatio;
        particle.regY = particle.image.height * imageDef.regYRatio;
        particle.x = spawnPoint.x;
        particle.y = spawnPoint.y;
        if (attack.offset) {
            particle.x += attack.offset * Math.sin(angle);
            particle.y += attack.offset * -Math.cos(angle);
        }
        if (attack.rotation)
            particle.rotation = attack.rotation * particle.flipDirection;
        if (attack.scale) {
            particle.scaleX *= attack.scale;
            particle.scaleY *= attack.scale;
        }
        if (attack.scaleSpeed)
            particle.scaleSpeed = attack.scaleSpeed;
        if (attack.duration)
            particle.destoryTime = new Date().getTime() + attack.duration * 1000;
        switch (attack.type) {
            case AttackType.Bullet:
                if (attack.focusOnTarget)
                    angle = Math.atan2(targetPoint.y - particle.y, targetPoint.x - particle.x);
                if (attack.angleOffset)
                    angle += attack.angleOffset * Math.PI / 180;
                setVelocity(particle, attack.speed, angle);
                break;
            case AttackType.FromBottom:
                particle.x = Math.max(particle.regX, Math.min(particle.x, stage.width -  particle.image.width + particle.regX));
                particle.y = stage.height + particle.regY;
                angle = -Math.PI / 2;
                setVelocity(particle, attack.speed, angle);
                break;
            case AttackType.FromSide:
                particle.x = team == Team.One ? 0 : stage.width;
                particle.y = targetPoint.y;
                break;
            case AttackType.Still:
                particle.x = targetPoint.x;
                particle.y = targetPoint.y;
                break;
        }
        switch (attack.layer) {
            case LayerType.AboveAll:
                topLayer.addChild(particle);
                break;
            case LayerType.BelowAll:
                bottomLayer.addChild(particle);
                break;
            default:
                mainLayer.addChild(particle);
                break;
        }
        if (attack.effect == Effect.Stasis) {
            particle.affectedParticles = [];
            for (var i = 0; i < particles.length; ++i) {
                var otherParticle = particles[i];
                if (ndgmr.checkPixelCollision(particle, otherParticle)) {
                    otherParticle.isInStasis = true;
                    particle.affectedParticles.push(otherParticle);
                }
            }
        }
        particles.push(particle);
    }

    function setVelocity(particle, speed, angleInRadians) {
        particle.vx = speed * Math.cos(angleInRadians);
        particle.vy = speed * Math.sin(angleInRadians);
        if (particle.imageDef.pointAngle !== undefined) {
            particle.rotation = angleInRadians * 180 / Math.PI - particle.imageDef.pointAngle;
            if (particle.flipDirection == -1)
                particle.rotation += 2 * particle.imageDef.pointAngle - 180;
        }
    }

    function destroyParticle(particle) {
        if (particle.attack.effect == Effect.Stasis && particle.affectedParticles) {
            for (var i = 0; i < particle.affectedParticles.length; ++i) {
                particle.affectedParticles[i].isInStasis = false;
            }
        }
        if (particle.parent)
            particle.parent.removeChild(particle);
    }

    function onTick(e) {
        var currentTime = new Date().getTime();
        var elapsedMilliseconds = currentTime - prevTickTime;
        var elapsedSeconds = elapsedMilliseconds / 1000;
        prevTickTime = currentTime;
        for (var i = 0; i < particles.length; ++i) {
            var particle = particles[i];
            if (particle.isInStasis) {
                // If the particle is in stasis, don't let it move.
                // Also delay the destroy time if there is one.
                if (particle.destoryTime)
                    particle.destoryTime += elapsedMilliseconds;
                continue;
            }
            if (particle.vx)
                particle.x += particle.vx * elapsedSeconds;
            if (particle.vy)
                particle.y += particle.vy * elapsedSeconds;
            if (particle.attack.rotationSpeed)
                particle.rotation += particle.attack.rotationSpeed * elapsedSeconds * particle.flipDirection;
            if (particle.scaleSpeed) {
                if (particle.scaleSpeed < 0 && particle.scaleY < -particle.scaleSpeed * elapsedSeconds) {
                    // Particle is too small now and should be destroyed
                    particle.destoryTime = currentTime;
                } else {
                    particle.scaleX += particle.scaleSpeed * elapsedSeconds * particle.flipDirection;
                    particle.scaleY += particle.scaleSpeed * elapsedSeconds;
                    if (particle.attack.maxScale && particle.scaleY >= particle.attack.maxScale) {
                        particle.scaleSpeed *= -1;
                    }
                }
            }

            // Handle destroying particles
            if (!particle.destoryTime) {
                switch (particle.attack.type) {
                    case AttackType.Bullet:
                        if (particle.x > stage.width || particle.x < 0 || particle.y > stage.height || particle.y < 0) {
                            switch (particle.attack.finished) {
                                case FinishedAction.None:
                                    // Wait for the particle to move fully off the screen, then destroy it.
                                    particle.destoryTime = currentTime + 1000;
                                    break;
                                case FinishedAction.Disappear:
                                    particle.destoryTime = currentTime;
                                    break;
                                case FinishedAction.Return:
                                    if (particle.isReturning) {
                                        // Particle has already returned to its origin. Desroy it.
                                        particle.destoryTime = currentTime + 1000;
                                    } else {
                                        particle.isReturning = true;
                                        // Back up the particle so it is not outside the boundaries on the next iteration
                                        // (otherwise it will get destroyed)
                                        particle.x -= particle.vx * elapsedSeconds;
                                        particle.y -= particle.vy * elapsedSeconds;

                                        var angle = Math.atan2(particle.vy, particle.vx) + Math.PI;
                                        var speed = particle.attack.returnSpeed || Math.sqrt(particle.vx * particle.vx + particle.vy * particle.vy);
                                        setVelocity(particle, speed, angle);
                                    }
                                    break;
                            }
                        }
                        break;

                    case AttackType.FromBottom:
                        if (particle.y - particle.regY + particle.image.height < stage.height) {
                            var angle = Math.PI / 2;
                            var speed = particle.attack.returnSpeed || Math.abs(particle.vy);
                            setVelocity(particle, speed, angle);
                        } else if (particle.y - particle.regY > stage.height) {
                            particle.destoryTime = currentTime;
                        }
                        break;

                    case AttackType.FromSide:
                        if (Math.abs(particle.rotation - (particle.attack.rotation || 0) * particle.flipDirection) > 180) {
                            particle.destoryTime = currentTime + 150000 / particle.attack.rotationSpeed;
                        }
                        break;
                }
            }
            if (particle.destoryTime && currentTime >= particle.destoryTime) {
                destroyParticle(particle);
                particles.splice(i, 1);
                --i;
            }

            // TODO: check if the particle has left the screen or its duration has completed.
        }

		var dx = 0;
		var dy = 0;
		var speed = 10;
		
		if(keyPressed[Key.Up]) {
			dy -= speed;
		}
		if(keyPressed[Key.Down]) {
			dy += speed;
		}
		if(keyPressed[Key.Left]) {
			dx -= speed;
		}
		if(keyPressed[Key.Right]) {
			dx += speed;
		}
		// Make diagonal movements the same speed as horizontal/verticl movements.
		if(dx != 0 && dy != 0) {
			dx /= 1.41421356;
			dy /= 1.41421356;
		}
		
		hitbox.x += dx;
		hitbox.y += dy;
		
		// Keep the player in bounds.
		hitbox.x = Math.max(0, Math.min(stage.width, hitbox.x));
		hitbox.y = Math.max(0, Math.min(stage.height, hitbox.y));
		player.x = hitbox.x;
		player.y = hitbox.y;
		
        // TODO: run hit tests
        stage.update();
    }
    var prevTickTime = new Date().getTime();

	function keyDown(e) {
		if(e.keyCode < 37 || e.keyCode > 40) return;
		e.preventDefault();
		switch (e.keyCode) {
			case 37:
				keyPressed[Key.Left] = true;
				break;
			case 38:
				keyPressed[Key.Up] = true;
				break;
			case 39:
				keyPressed[Key.Right] = true;
				break;
			case 40:
				keyPressed[Key.Down] = true;
		}
	}
	
	function keyUp(e) {
		if(e.keyCode < 37 || e.keyCode > 40) return;
		e.preventDefault();
		switch (e.keyCode) {
			case 37:
				keyPressed[Key.Left] = false;
				break;
			case 38:
				keyPressed[Key.Up] = false;
				break;
			case 39:
				keyPressed[Key.Right] = false;
				break;
			case 40:
				keyPressed[Key.Down] = false;
		}
	}
	
	$(document).keydown(keyDown);
	$(document).keyup(keyUp);
	
    $(document).ready(function() {
		// Events
        Ticker.framerate = 60;
        Ticker.addEventListener("tick", onTick);

        // Test code (remove sometime)
		function doSetTimeout(champion, team, delay) {
			setTimeout(function() {fireAttackGroup(champion, team)}, delay);
		}
		var delay = 0;
		var teamOne = true;
		for(championId in champions) {
			var champion = champions[74];
			if(champion.attacks === undefined) {continue;}
			doSetTimeout(champion, teamOne ? Team.One : Team.Two, delay);
			teamOne = !teamOne;
			delay += 500;
		}
        //fireAttackGroup(champions["104"], 100);
        //fireAttackGroup(champions["39"], 100);
        //fireAttackGroup(champions["74"], 200);
        //fireAttackGroup(champions["39"], 100);
        //fireAttackGroup(champions["40"], 200);
    });
})();