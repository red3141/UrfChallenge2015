(function() {
    // Imports
    Bitmap = createjs.Bitmap;
    Container = createjs.Container;
    Stage = createjs.Stage;
    Ticker = createjs.Ticker;

    var teamSeparationWidth = 70;

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
    
    // The hitbox should appear above all bullets.
    var hitbox = new Bitmap(document.getElementById("hitbox"));
    hitbox.regX = hitbox.image.width / 2;
    hitbox.regY = hitbox.image.height / 2;
    hitbox.x = stage.width / 2;
    hitbox.y = stage.height - 100;
    // The player should appear below all bullets (except the bottom layer, e.g. Bard ult)
    var player = new Bitmap(document.getElementById("urf"));
    player.regX = player.image.width / 2;
    player.regY = player.image.height / 2;
    player.x = hitbox.x;
    player.y = hitbox.y;
	
    var minPlayerX = 0.5 * hitbox.image.width;
    var maxPlayerX = stage.width - minPlayerX;
    var minPlayerY = 0.5 * hitbox.image.height;
    var maxPlayerY = stage.height - minPlayerY;

    stage.addChild(bottomLayer);
    stage.addChild(player);
    stage.addChild(mainLayer);
    stage.addChild(topLayer);
    stage.addChild(hitbox);

    var particles = [];
    // Keep track of which arrow keys are pressed.
    var keyPressed = [false, false, false, false, false];

    // Methods

    function fireAttackGroup(champion, team) {
        if (!champion || !champion.attacks || !champion.attacks.length) return;

        var minOffset = 0, maxOffset = 0, minAngleOffset = 0, maxAngleOffset = 0;
        var targeted = false;
        var isSpawnPointRequired = false;
        $.each(champion.attacks, function(i, attack) {
            if (attack.targeted) {
                targeted = true;
            }
            if (attack.offset) {
                minOffset = Math.min(attack.offset, minOffset);
                maxOffset = Math.min(attack.offset, maxOffset);
            }
            if (attack.angleOffset) {
                minAngleOffset = Math.min(attack.angleOffset, minAngleOffset);
                maxAngleOffset = Math.max(attack.angleOffset, maxAngleOffset);
            }
            if (attack.type == AttackType.Bullet) {
                isSpawnPointRequired = true;
            }
        });
        if (!isSpawnPointRequired) {
            $.each(champion.images, function(i, image) {
                if (image.pointAngle !== undefined) {
                    isSpawnPointRequired = true;
                    return false;
                }
            });
        }
        
        // Determine target point. 
        var margin = 60;
        var targetPoint = { x: 0, y: 0 };
        var availableWidth = stage.width / 2 - margin;
        var availableHeight = stage.height - margin * 2;
        if (targeted) {
            targetPoint.x = hitbox.x;
            targetPoint.y = hitbox.y;
        } else {
            if (!isSpawnPointRequired)
                availableWidth -= maxOffset - minOffset + teamSeparationWidth / 2;
            targetPoint.x = Math.random() * availableWidth + margin;
            targetPoint.y = Math.random() * availableHeight + margin; // TODO: make random y position favour the bottom more?
            if (team == Team.One) {
                if (!isSpawnPointRequired)
                    targetPoint.x -= minOffset;
            } else { // Team 2
                targetPoint.x = stage.width - targetPoint.x;
                if (!isSpawnPointRequired)
                    targetPoint.x -= maxOffset;
            }
        }

        var spawnPoint = null;
        if (isSpawnPointRequired) {
            if (champion.attackAngle === undefined) {
                spawnPoint = getRandomSpawnPoint(targetPoint, minAngleOffset, maxAngleOffset, team);
            } else {
                spawnPoint = determineSpawnPoint(targetPoint, champion.attackAngle, team);
            }
            // If an attack has an offset, it may spawn in the middle of the screen, which is no good.
            // In that case, back up the spawn point so nothing spawns on the screen.
            var angle = getAngle(spawnPoint, targetPoint);
            if (minOffset) {
                var minOffsetPoint = offsetPoint(spawnPoint, minOffset, angle - Math.PI / 2);
                if (minOffsetPoint.y > 0 && minOffsetPoint.x > 0 && minOffsetPoint.x < stage.width) {
                    var edgePoint = getEdgePoint(minOffsetPoint, angle + Math.PI);
                    var backupDistance = getDistance(minOffsetPoint, edgePoint);
                    spawnPoint = offsetPoint(spawnPoint, backupDistance, angle + Math.PI);
                }
            }
            if (maxOffset) {
                var maxOffsetPoint = offsetPoint(spawnPoint, maxOffset, angle - Math.PI / 2);
                if (maxOffsetPoint.y > 0 && maxOffsetPoint.x > 0 && maxOffsetPoint.x < stage.width) {
                    var edgePoint = getEdgePoint(maxOffsetPoint, angle + Math.PI);
                    var backupDistance = getDistance(maxOffsetPoint, edgePoint);
                    spawnPoint = offsetPoint(spawnPoint, backupDistance, angle + Math.PI);
                }
            }
        }
        fireAttackWithDelay(champion, 0, team, spawnPoint, targetPoint, null);
    }

	function fireAttackWithDelay(champion, attackIndex, team, spawnPoint, targetPoint, prevParticle) {
	    var attack = champion.attacks[attackIndex];

        var attackFunction = function() {
            // Remove previous attack (if necessary)
            if (attack.removePrevious && prevParticle) {
                var index = particles.indexOf(prevParticle);
                if (index >= 0) {
                    destroyParticle(prevParticle);
                    particles.splice(index, 1);
                }
            }
            // Fire the current attack now
            var particle = fireAttack(champion, attackIndex, team, spawnPoint, targetPoint);
            // Fire the next attack
            if (attackIndex + 1 < champion.attacks.length)
                fireAttackWithDelay(champion, attackIndex + 1, team, spawnPoint, targetPoint, particle);
        };
        if (attack.delay)
            setTimeout(attackFunction, attack.delay * 1000);
        else
            attackFunction();
    }

    function fireAttack(champion, attackIndex, team, spawnPoint, targetPoint) {
        if (!champion.images || !champion.images.length) return;

        var attack = champion.attacks[attackIndex];
        var imageIndex = attack.imageIndex === undefined ? (attackIndex % champion.images.length) : attack.imageIndex;
        var imageDef = champion.images[imageIndex];
        var particle = new Bitmap(document.getElementById(imageDef.id));
        particle.imageDef = imageDef;
        particle.attack = attack;
        if (particle.image.width == 0) {
            console.warn("image width is 0: " + imageDef.id);
        }
        if (imageDef.regXRatio === undefined)
            imageDef.regXRatio = 0.5;
        if (imageDef.regYRatio === undefined)
            imageDef.regYRatio = 0.5;
        particle.regX = particle.image.width * imageDef.regXRatio;
        particle.regY = particle.image.height * imageDef.regYRatio;

        if (spawnPoint) {
            var angle = getAngle(spawnPoint, targetPoint);
            particle.flipDirection = 1;
            if ((imageDef.flipIfForward && (attack.speed ? Math.abs(angle) < Math.PI / 2 : team == Team.One))
                || (imageDef.flipIfBackward && (attack.speed ? Math.abs(angle) > Math.PI / 2 : team == Team.Two))) {
                particle.scaleX = -1;
                particle.flipDirection = -1;
            }
            if (attack.offset)
                spawnPoint = offsetPoint(spawnPoint, attack.offset, angle - Math.PI / 2);
            particle.x = spawnPoint.x;
            particle.y = spawnPoint.y;
        } else {
            particle.x = targetPoint.x;
            particle.y = targetPoint.y;
        }
        if (attack.rotation)
            particle.rotation = attack.rotation * particle.flipDirection;
        if (attack.scale) {
            particle.scaleX *= attack.scale;
            particle.scaleY *= attack.scale;
        }
        if (attack.scaleX)
            particle.scaleX *= attack.scale;
        if (attack.scaleX)
            particle.scaleY *= attack.scale;
        if (attack.scaleSpeed)
            particle.scaleSpeed = attack.scaleSpeed;
        if (attack.duration)
            particle.destroyTime = new Date().getTime() + attack.duration * 1000;
        if (attack.alpha !== undefined)
            particle.alpha = attack.alpha;

        particle.isDamaging = (attack.isDamaging !== false);

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
                break;
            case AttackType.Still:
                // Set the velocity even though the speed is 0.
                // This is relevant if the image has a point angle (e.g. Lux ult).
                setVelocity(particle, 0, angle);
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
            // TODO: put player in stasis
        }
        particles.push(particle);
        return particle;
    }
    
    function getDistance(p1, p2) {
        var dx = p2.x - p1.x;
        var dy = p2.y - p1.y;
        return Math.sqrt(dx * dx + dy * dy);
    }

    function offsetPoint(point, distance, angleInRadians) {
        return {
            x: point.x + distance * Math.cos(angleInRadians),
            y: point.y + distance * Math.sin(angleInRadians)
        };
    }
    
    function getAngle(p1, p2) {
        return Math.atan2(p2.y - p1.y, p2.x - p1.x);
    }

    function getRandomSpawnPoint(targetPoint, minAngleOffset, maxAngleOffset, team) {
        // Generate a random spawn point. The attack will leave from this point and go through the target point.
        // There are boundaries on the allowable spawn points. The spawn point must be:
        // - on the current team's half of the screen
        // - above the target point
        // - at such an angle that all attack particles (especially those with angleOffsets) will end up on the screen
        var minX = team == Team.One ? 0 : (stage.width + teamSeparationWidth) / 2;
        var maxX = team == Team.One ? (stage.width - teamSeparationWidth) / 2 : stage.width;
        var minY = 0;
        var maxY = targetPoint.y;
        if (minAngleOffset > -90 && maxAngleOffset < 90) {
            if (team == Team.One) {
                var wallPoint = getEdgePoint(targetPoint, (-90 - maxAngleOffset) * Math.PI / 180);
                if (wallPoint.x == 0)
                    minY = Math.max(wallPoint.y, minY);
            } else {
                var wallPoint = getEdgePoint(targetPoint, (-90 - minAngleOffset) * Math.PI / 180);
                if (wallPoint.x == stage.width)
                    minY = Math.max(wallPoint.y, minY);
            }
            var ceilingPoint1 = getEdgePoint(targetPoint, (maxAngleOffset - 180) * Math.PI / 180);
            if (ceilingPoint1.y == 0)
                minX = Math.max(ceilingPoint1.x, minX);
            var ceilingPoint2 = getEdgePoint(targetPoint, minAngleOffset * Math.PI / 180);
            if (ceilingPoint2.y == 0)
                maxX = Math.min(ceilingPoint2.x, maxX);
        } else {
            // This should never happen unless we have bad data.
            console.warn("Found extremely large angle offsets.");
        }

        var availableWidth = Math.max(maxX - minX, 0);
        var availableHeight = Math.max(maxY - minY, 0);
        var spawnPos = Math.random() * (availableWidth + availableHeight);
        if (spawnPos <= availableWidth) {
            return {
                x: spawnPos + minX,
                y: 0
            }
        } else {
            return {
                x: team == Team.One ? 0 : stage.width,
                y: spawnPos - availableWidth + minY
            };
        }
    }

    function determineSpawnPoint(targetPoint, attackAngle, team) {
        // Angle has been set already. Calculate the spawn point.
        if ((team == Team.Two && Math.abs(attackAngle) > 180) || (team == Team.One && Math.abs(attackAngle) < 180))
            attackAngle = 180 - attackAngle;
        attackAngle += 180;
        var spawnPoint = getEdgePoint(targetPoint, attackAngle * Math.PI / 180);
        // Ensure that it's clear which side the bullet is coming from.
        var availableWidth = (stage.width - teamSeparationWidth) / 2;
        if (team == Team.One && spawnPoint.x > availableWidth) {
            var diff = spawnPoint.x - availableWidth;
            spawnPoint.x -= diff;
            targetPoint.x -= diff;
        } else if (team == Team.Two && spawnPoint.x < stage.width - availableWidth) {
            var diff = stage.width - availableWidth - spawnPoint.x;
            spawnPoint.x += diff;
            targetPoint.x += diff;
        }
        return spawnPoint;
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
	
    function movePlayer(elapsedSeconds) {
		var dx = 0;
		var dy = 0;
		var speed = keyPressed[Key.Shift] ? 100 : 450;
		speed *= elapsedSeconds;
		
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
		hitbox.x = Math.max(minPlayerX, Math.min(maxPlayerX, hitbox.x));
		hitbox.y = Math.max(minPlayerY, Math.min(maxPlayerY, hitbox.y));
		player.x = hitbox.x;
		player.y = hitbox.y;
	}

    function onTick(e) {
        var currentTime = new Date().getTime();
        var elapsedMilliseconds = currentTime - prevTickTime;
        var elapsedSeconds = elapsedMilliseconds / 1000;
        prevTickTime = currentTime;
		
        movePlayer(elapsedSeconds);
		
        for (var i = 0; i < particles.length; ++i) {
            var particle = particles[i];
            if (particle.isInStasis) {
                // If the particle is in stasis, don't let it move or cause damage.
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
            if (particle.isDamaging && ndgmr.checkPixelCollision(hitbox, particle)) {
				// Only allow a particle to deal damage once.
				particle.isDamaging = false;
                console.log("YOU SUNK MY URFTLESHIP!");
            }
			
            if (particle.destroyTime && currentTime >= particle.destroyTime) {
                destroyParticle(particle);
                particles.splice(i, 1);
                --i;
            }
        }
		
        stage.update();
    }
    var prevTickTime = new Date().getTime();

	function keyDown(e) {
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
			    break;
            case 16:
                keyPressed[Key.Shift] = true;
                break;
		    default:
		        return;
		}
		e.preventDefault();
	}
	
	function keyUp(e) {
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
			    break;
            case 16:
                keyPressed[Key.Shift] = false;
                break;
            default:
                return;
		}
		e.preventDefault();
	}
	
    $(document).ready(function() {
		// Events
        Ticker.framerate = 60;
        Ticker.addEventListener("tick", onTick);

        $(document).keydown(keyDown);
        $(document).keyup(keyUp);

        // Test code (remove sometime)
        setTimeout(function() {
            function doSetTimeout(champion, team, delay) {
                setTimeout(function() {fireAttackGroup(champion, team)}, delay);
            }
            var delay = 0;
            var teamOne = true;
            /*for(championId in champions) {
                var champion = champions[championId];
                if(champion.attacks === undefined) {continue;}
                doSetTimeout(champion, teamOne ? Team.One : Team.Two, delay);
                teamOne = !teamOne;
                delay += 500;
            }*/
            fireAttackGroup(champions["82"], 100);
            //fireAttackGroup(champions["75"], 200);
            /*fireAttackGroup(champions["111"], 100);
            fireAttackGroup(champions["76"], 100);
            fireAttackGroup(champions["56"], 200);
            fireAttackGroup(champions["20"], 100);
            fireAttackGroup(champions["2"], 200);
            fireAttackGroup(champions["61"], 100);*/
        }, 1000);
    });
})();