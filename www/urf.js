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
    
    var health = 2000;
    
    var gameState = GameState.Playing;
    var defeatBanner = new Bitmap(document.getElementById("defeat"));
    var victoryBanner = new Bitmap(document.getElementById("victory"));
    var endGameBanner;
	
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
        if (!champion || !champion.attacks || !champion.attacks.length || gameState != GameState.Playing) return;

        var minOffset = 0, maxOffset = 0, minAngleOffset = 0, maxAngleOffset = 0;
        var targeted = false;
        var isSpawnPointRequired = false;
        $.each(champion.attacks, function(i, attack) {

            if (attack.spawnAfter == SpawnAfter.Previous) return false;

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
        if (!isSpawnPointRequired && champion.images) {
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
        prepareToFireAttack(champion, 0, team, spawnPoint, targetPoint, null);
    }

	function prepareToFireAttack(champion, attackIndex, team, spawnPoint, targetPoint, prevParticle) {
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
            // alhpaModifier should propagate to the next attack
            if (prevParticle && prevParticle.alphaModifier !== undefined) {
                particle.alphaModifier = prevParticle.alphaModifier;
                particle.alpha *= prevParticle.alphaModifier;
            }
            // Fire the next attack
            if (attackIndex + 1 < champion.attacks.length) {
                var nextAttack = champion.attacks[attackIndex + 1];
                if (nextAttack.spawnAfter == SpawnAfter.Previous) {
                    particle.addEventListener("finish", function() {
                        prepareToFireAttack(champion, attackIndex + 1, team, spawnPoint, targetPoint, particle);
                    });
                } else {
                    prepareToFireAttack(champion, attackIndex + 1, team, spawnPoint, targetPoint, particle);
                }
            }
        };
        if (attack.delay)
            setTimeout(attackFunction, attack.delay * 1000);
        else
            attackFunction();
    }

    function fireAttack(champion, attackIndex, team, spawnPoint, targetPoint) {

        var currentTime = new Date().getTime();
        var attack = champion.attacks[attackIndex];

        if (attack.type == AttackType.IncreaseTransparency) {
            $.each(particles, function(i, particle) {
                if ((team == Team.One && particle.x > stage.width / 2) ||
                    (team == Team.Two && particle.x <= stage.width / 2)) {
                    return;
                }
                particle.alphaModifier = (particle.alphaModifier || 1) * 0.3;
                particle.alpha *= 0.3;
            });
            return;
        } else if (attack.type == AttackType.GlobalFocus) {
            $.each(particles, function(i, particle) {
                if (particle.attack.type != AttackType.Bullet ||
                    particle.image.width > stage.height ||
                    particle.image.height > stage.height ||
                    particle.destroyTime ||
                    particle.attackAngle !== undefined ||
                    (team == Team.One && particle.x > stage.width / 2) ||
                    (team == Team.Two && particle.x <= stage.width / 2)) {
                    return;
                }
                var angle = getAngle(particle, player);
                var speed = Math.sqrt(particle.vx * particle.vx + particle.vy * particle.vy);
                setVelocity(particle, speed, angle);
            });
            return;
        }

        if (!champion.images || !champion.images.length) return;

        var imageIndex = attack.imageIndex === undefined ? (attackIndex % champion.images.length) : attack.imageIndex;
        var imageDef = champion.images[imageIndex];
        var particle = new Bitmap(document.getElementById(imageDef.id));
        particle.imageDef = imageDef;
        particle.attack = attack;
        particle.attackAngle = champion.attackAngle;
        particle.team = team;
        particle.spawnTime = currentTime;
        particle.targetPoint = targetPoint;
        if (particle.image.width == 0) {
            console.warn("image width is 0: " + imageDef.id);
        }
        if (imageDef.regXRatio === undefined)
            imageDef.regXRatio = 0.5;
        if (imageDef.regYRatio === undefined)
            imageDef.regYRatio = 0.5;
        particle.regX = particle.image.width * imageDef.regXRatio;
        particle.regY = particle.image.height * imageDef.regYRatio;

        var angle;
        if (spawnPoint) {
            var angle = getAngle(spawnPoint, targetPoint);
            if (attack.spawnFrom == SpawnFrom.Target)
                spawnPoint = targetPoint;
            if (attack.offset)
                spawnPoint = offsetPoint(spawnPoint, attack.offset, angle - Math.PI / 2);
            particle.x = spawnPoint.x;
            particle.y = spawnPoint.y;
            particle.spawnPoint = spawnPoint;
        } else {
            particle.x = targetPoint.x;
            particle.y = targetPoint.y;
            angle = team == Team.One ? 0 : -Math.PI;
        }
        particle.flipDirection = 1;
        if ((imageDef.flipIfForward && Math.abs(angle) < Math.PI / 2)
            || (imageDef.flipIfBackward && Math.abs(angle) > Math.PI / 2)) {
            particle.scaleX = -1;
            particle.flipDirection = -1;
        }
        if (attack.rotation)
            particle.rotation = attack.rotation * particle.flipDirection;
        if (attack.scale) {
            particle.scaleX = attack.scale * particle.flipDirection;
            particle.scaleY = attack.scale;
        }
        if (attack.scaleX)
            particle.scaleX = attack.scaleX * particle.flipDirection;
        if (attack.scaleX)
            particle.scaleY = attack.scaleY;
        if (attack.scaleSpeed)
            particle.scaleSpeed = attack.scaleSpeed;
        if (attack.alpha !== undefined)
            particle.alpha = attack.alpha;
        if (attack.alphaSpeed)
            particle.alphaSpeed = attack.alphaSpeed;

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
                // Note: angle should already be set to 0 or -Math.PI from before.
                particle.x = team == Team.One ? particle.regX - particle.image.width : stage.width + particle.regX;
                particle.y = Math.max(particle.regY, Math.min(particle.y, stage.height - particle.image.height + particle.regY));
                setVelocity(particle, attack.speed, angle);
                break;
            case AttackType.Swing:
                particle.x = team == Team.One ? -30 : stage.width + 30;
                // Destroy the particle once it has swung around for ~330 degrees.
                particle.destroyTime = currentTime + 330000 / Math.abs(particle.attack.rotationSpeed);
                break;
            case AttackType.Still:
                // Set the velocity even though the speed is 0.
                // This is relevant if the image has a point angle (e.g. Lux ult).
                setVelocity(particle, 0, angle);
                break;
            case AttackType.AcrossEdge:
                // 0=top, 1=right, 2=bottom, 3=left
                var edgeId = Math.floor(Math.random() * 4);
                if (edgeId % 2 == 1) {
                    edgeId = team == Team.One ? 3 : 1;
                    angle = Math.random() > 0.5 ? (Math.PI / 2) : (-Math.PI / 2);
                } else {
                    angle = team == Team.One ? 0 : Math.PI;
                }
                var isForward = true;
                switch (edgeId) {
                    case 0:
                        isForward = Math.abs(angle - Math.PI) < 1e-5;
                        particle.x = isForward ? stage.width : 0;
                        particle.y = 0;
                        break;
                    case 1:
                        isForward = Math.abs(angle + Math.PI / 2) < 1e-5;
                        particle.x = stage.width;
                        particle.y = isForward ? stage.height : 0;
                        break;
                    case 2:
                        isForward = Math.abs(angle) < 1e-5;
                        particle.x = isForward ? 0 : stage.width;
                        particle.y = stage.height;
                        break;
                    case 3:
                        isForward = Math.abs(angle - Math.PI / 2) < 1e-5;
                        particle.x = 0;
                        particle.y = isForward ? 0 : stage.height;
                        break;
                }
                if ((isForward && imageDef.flipIfForward) || (!isForward && imageDef.flipIfBackward)) {
                    particle.scaleX = -1;
                    particle.flipDirection = -1;
                } else {
                    particle.scaleX = 1;
                    particle.flipDirection = 1;
                }
                setVelocity(particle, attack.speed, angle);
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
                if (otherParticle.imageDef.id == "bard") {
                    // Bard ult should not affect bard ult.
                    continue;
                }
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
        if ((team == Team.Two && Math.abs(attackAngle) < 90) || (team == Team.One && Math.abs(attackAngle) > 90))
            attackAngle = 180 - attackAngle;
        var sourceAngle = attackAngle + 180;
        var spawnPoint = getEdgePoint(targetPoint, sourceAngle * Math.PI / 180);
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

    function setVelocity(particle, speed, angleInRadians, rotateParticle) {
        particle.vx = speed * Math.cos(angleInRadians);
        particle.vy = speed * Math.sin(angleInRadians);
        if (particle.imageDef.pointAngle !== undefined && rotateParticle !== false) {
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

    function attacksOnStage() {
        $.each(particles, function(i, particle) {
            if (particle.attack.type != AttackType.Still || (particle.attack.finishCondition && particle.attack.finishCondition.duration !== undefined)) {
                // The particle is not a Teemo mushroom.
                return true;
            }
        });
        return false;
    }
    
    function endGame(victory) {
        if (gameState != GameState.Playing) return;
        
        gameState = victory? GameState.Victory : GameState.Defeat;
        endGameBanner = victory ? victoryBanner : defeatBanner;
        endGameBanner.regX = endGameBanner.image.width / 2;
        endGameBanner.regY = endGameBanner.image.height / 2;
        stage.addChild(endGameBanner);
        endGameBanner.x = stage.width / 2;
        endGameBanner.y = 250;
        endGameBanner.alpha = 0;
    }
    
    function onTick(e) {
        // TODO: use e.runTime and e.delta instead of new Date().getTime()
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
            if (particle.alphaSpeed) {
                particle.alpha += particle.alphaSpeed * elapsedSeconds;
                if (particle.alpha >= 1) {
                    particle.alpha = 1;
                    particle.alphaSpeed = 0;
                }
            }
            if (particle.attack.type == AttackType.Follow) {
                particle.x = player.x;
                particle.y = player.y;
            }

            // Handle destroying particles
            if (!particle.destroyTime) {
                var isFinished = false;
                if (particle.attack.finishCondition && particle.attack.finishCondition.reachTarget) {
                    var currentDirection = Math.atan2(particle.vy, particle.vx);
                    var currentAngle = getAngle(particle, particle.targetPoint);
                    if (Math.abs(currentAngle - currentDirection) > Math.PI / 2) {
                        isFinished = true;
                    }
                }
                if (!isFinished && particle.attack.finishCondition && particle.attack.finishCondition.duration !== undefined) {
                    if (currentTime > particle.spawnTime + particle.attack.finishCondition.duration * 1000) {
                        isFinished = true;
                    }
                }
                if (!isFinished && particle.attack.finishCondition && particle.attack.finishCondition.distance !== undefined) {
                    var travelDistance = getDistance(particle, particle.spawnPoint);
                    if (travelDistance > particle.attack.finishCondition.distance) {
                        isFinished = true;
                    }
                }
                if (!isFinished && currentTime > particle.spawnTime + 1000 && (particle.x > stage.width || particle.x < 0 || particle.y > stage.height || particle.y < 0)) {
                    isFinished = true;
                }
                if (isFinished) {
                    switch (particle.attack.finished) {
                        case FinishedAction.Disappear:
                            particle.destroyTime = currentTime;
                            break;
                        case FinishedAction.Fade:
                            particle.alphaSpeed = -2;
                            break;
                        case FinishedAction.Return:
                            if (particle.isReturning) {
                                // Particle has already returned to its origin. Destroy it.
                                particle.destroyTime = currentTime;
                            } else {
                                particle.isReturning = true;
                                // Back up the particle so it is not outside the boundaries on the next iteration
                                // (otherwise it will get destroyed)
                                particle.x -= particle.vx * elapsedSeconds;
                                particle.y -= particle.vy * elapsedSeconds;

                                var angle = Math.atan2(particle.vy, particle.vx) + Math.PI;
                                var speed = particle.attack.returnSpeed || Math.sqrt(particle.vx * particle.vx + particle.vy * particle.vy);
                                setVelocity(particle, speed, angle, false);
                            }
                            break;
                        default:
                            // Wait for the particle to move fully off the screen, then destroy it.
                            particle.destroyTime = currentTime + 1000;
                            break;
                    }
                    particle.dispatchEvent("finish");
                }
                switch (particle.attack.type) {
                    case AttackType.FromBottom:
                        if (particle.y - particle.regY + particle.image.height <= stage.height) {
                            var angle = Math.PI / 2;
                            var speed = particle.attack.returnSpeed || Math.abs(particle.vy);
                            setVelocity(particle, speed, angle, false);
                        } else if (particle.y - particle.regY > stage.height) {
                            particle.destroyTime = currentTime;
                        }
                        break;

                    case AttackType.FromSide:
                        if (particle.team == Team.One) {
                            if (particle.x - particle.regX >= 0) {
                                var angle = -Math.PI;
                                var speed = particle.attack.returnSpeed || Math.abs(particle.vx);
                                setVelocity(particle, speed, angle, false);
                            } else if (particle.x - particle.regX + particle.image.width < 0) {
                                particle.destroyTime = currentTime;
                            }
                        } else {
                            if (particle.x - particle.regX + particle.image.width <= stage.width) {
                                var angle = 0;
                                var speed = particle.attack.returnSpeed || Math.abs(particle.vx);
                                setVelocity(particle, speed, angle, false);
                            } else if (particle.x - particle.regX > stage.width) {
                                particle.destroyTime = currentTime;
                            }
                        }
                        break;
                }
            }
			
            // Check if Urf has taken tons of damage.
            if (particle.isDamaging && ndgmr.checkPixelCollision(hitbox, particle)) {
				// Only allow a particle to deal damage once.
                health -= 500;
                console.log(health);
				particle.isDamaging = false;
                if (health <= 0) {
                    endGame(false);
                }
            }
			
            if (particle.destroyTime && currentTime >= particle.destroyTime) {
                destroyParticle(particle);
                particles.splice(i, 1);
                --i;
            }
        }
		
        if (gameState != GameState.Playing) {
            if (endGameBanner.alpha < 1) {
                endGameBanner.alpha = Math.min(1, endGameBanner.alpha + e.delta / 1000);
                player.alpha = Math.max(0, player.alpha - e.delta / 1000);
                hitbox.alpha = Math.max(0, hitbox.alpha - e.delta / 1000);
            } else if (!attacksOnStage()) {
                // TODO: turn off onTick().
            }
        } else if (!attacksOnStage()) {
            // TODO: also check that there are no more attacks to be launched.
            //endGame(true);
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
            for(championId in champions) {
                var champion = champions[56];
                if(champion.attacks === undefined) {continue;}
                doSetTimeout(champion, Team.One, delay);
                doSetTimeout(champion, Team.Two, delay);
                teamOne = !teamOne;
                delay += 500;
            }
            /*fireAttackGroup(champions["77"], 100);
            fireAttackGroup(champions["77"], 200);
            fireAttackGroup(champions["112"], 100);
            fireAttackGroup(champions["112"], 200);*/
        }, 1000);
    });
})();