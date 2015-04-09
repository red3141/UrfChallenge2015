(function() {
    // Imports
    Bitmap = createjs.Bitmap;
    Container = createjs.Container;
    Stage = createjs.Stage;
    Ticker = createjs.Ticker;

    // Download game data
    var game = {};
    $.ajax({
        url: "http://localhost:57644/games/random",
        dataType: 'json'
    }).done(function(data) {
        game = data;
        // TODO: use game.events in the onTick event.
    }).fail(function(promise, text, error) {
        console.warn("Failed to get game data.");
    });

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
        var margin = 25;
        var targetPoint = { x: 0, y: 0 };
        var availableWidth = stage.width / 2 - margin;
        var availableHeight = stage.height - margin * 2;
        if (targeted) {
            targetPoint.x = player.x + player.regX;
            targetPoint.y = player.y + player.regY;
        } else {
            targetPoint.x = Math.random() * availableWidth + margin;
            targetPoint.y = Math.random() * availableHeight + margin; // TODO: make random y position favour the bottom more?
            if (team == Team.Two)
                targetPoint.x = stage.width - targetPoint.x;
        }

        var spawnPoint = { x: 0, y: 0 };
        if (champion.attackAngle === undefined) {
            // Determine a random spawn point. The attack will leave from this point and go through the target point.
            availableWidth -= 20; // Make it clear which side the bullet is coming from.
            availableHeight = targetPoint.y; // Don't shoot from below the target location.
            var spawnPos = Math.random() * (availableWidth + availableHeight);
            if (spawnPos <= availableWidth) {
                spawnPoint.x = spawnPos;
            } else {
                spawnPoint.y = spawnPos - availableWidth;
            }
            if (team == Team.Two)
                spawnPoint.x = stage.width - spawnPoint.x;
        } else {
            // Angle has been set already. Calculate the spawn point.
            var angle = champion.attackAngle;
            if ((team == Team.Two && Math.abs(angle) > 180) || (team == Team.One && Math.abs(angle) < 180))
                angle = 180 - angle;
            angle += 180;
            spawnPoint = getEdgePoint(targetPoint, angle * Math.PI / 180);
        }
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
            particle.destroyTime = new Date().getTime() + attack.duration * 1000;
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
                particle.x = team == Team.One ? -30 : stage.width + 30;
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

    function getEdgePoint(point, angleInRadians) {
        angleInRadians = angleInRadians % (2 * Math.PI);
        if (angleInRadians > Math.PI)
            angleInRadians -= 2 * Math.PI;
        else if (angleInRadians < -Math.PI)
            angleInRadians += 2 * Math.PI;
        var unitX = Math.cos(angleInRadians);
        var unitY = Math.sin(angleInRadians);
        var targetX = Math.abs(angleInRadians) > Math.PI / 2 ? 0 : stage.width;
        var targetY = angleInRadians < 0 ? 0 : stage.height;
        var destinationX = point.x + unitX * (targetY - point.y) / unitY;
        if (destinationX >= 0 && destinationX <= stage.width)
            return { x: destinationX, y: targetY };
        var destinationY = point.y + unitY * (targetX - point.x) / unitX;
        return { x: targetX, y: destinationY };
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
                if (particle.destroyTime)
                    particle.destroyTime += elapsedMilliseconds;
                continue;
            }
            if (particle.vx)
                particle.x += particle.vx * elapsedSeconds;
            if (particle.vy)
                particle.y += particle.vy * elapsedSeconds;
            if (particle.attack.accel) {
                var speed = Math.sqrt(particle.vx * particle.vx + particle.vy * particle.vy);
                if (speed > 0) {
                    particle.vx += particle.attack.accel * elapsedSeconds * particle.vx / speed;
                    particle.vy += particle.attack.accel * elapsedSeconds * particle.vy / speed;
                }
            }
            if (particle.attack.rotationSpeed)
                particle.rotation += particle.attack.rotationSpeed * elapsedSeconds * particle.flipDirection;
            if (particle.scaleSpeed) {
                if (particle.scaleSpeed < 0 && particle.scaleY < -particle.scaleSpeed * elapsedSeconds) {
                    // Particle is too small now and should be destroyed
                    particle.destroyTime = currentTime;
                } else {
                    particle.scaleX += particle.scaleSpeed * elapsedSeconds * particle.flipDirection;
                    particle.scaleY += particle.scaleSpeed * elapsedSeconds;
                    if (particle.attack.maxScale && particle.scaleY >= particle.attack.maxScale) {
                        particle.scaleSpeed *= -1;
                    }
                }
            }

            // Handle destroying particles
            if (!particle.destroyTime) {
                switch (particle.attack.type) {
                    case AttackType.Bullet:
                        if (particle.x > stage.width || particle.x < 0 || particle.y > stage.height || particle.y < 0) {
                            switch (particle.attack.finished) {
                                case FinishedAction.None:
                                    // Wait for the particle to move fully off the screen, then destroy it.
                                    particle.destroyTime = currentTime + 1000;
                                    break;
                                case FinishedAction.Disappear:
                                    particle.destroyTime = currentTime;
                                    break;
                                case FinishedAction.Return:
                                    if (particle.isReturning) {
                                        // Particle has already returned to its origin. Destroy it.
                                        particle.destroyTime = currentTime + 1000;
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
                            particle.destroyTime = currentTime;
                        }
                        break;

                    case AttackType.FromSide:
                        if (Math.abs(particle.rotation - (particle.attack.rotation || 0) * particle.flipDirection) > 180) {
                            particle.destroyTime = currentTime + 150000 / Math.abs(particle.attack.rotationSpeed);
                        }
                        break;
                }
            }
			
			// Check if Urf has taken tons of damage.
			if (ndgmr.checkPixelCollision(hitbox, particle)) {
				console.log("YOU SUNK MY URFTLESHIP!");
			}
			
            if (particle.destroyTime && currentTime >= particle.destroyTime) {
                destroyParticle(particle);
                particles.splice(i, 1);
                --i;
            }
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
		// Make diagonal movements the same speed as horizontal/vertical movements.
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
			var champion = champions[championId];
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