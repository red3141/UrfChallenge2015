(function() {
    if (window.AttackManager)
        return;

    // Imports
    var Bitmap = createjs.Bitmap;
    var ColorFilter = createjs.ColorFilter;
    var Container = createjs.Container;
    var Event = createjs.Event;

    window.AttackManager = function(stage, pointGenerator, playerManager, collisionDetector) {

        var particles = [];

        var bottomLayer = new Container();
        var mainLayer = new Container();
        var topLayer = new Container();
        var darknessLayer = new Container();

        function fireAttackGroup(champion, team, currentTime) {
            if (!champion || !champion.attacks || !champion.attacks.length) return;

            if (team != Team.One && team != Team.Two) {
                console.warn("Invalid team ID: " + team + ". Champion: " + champion.name);
            }

            var minOffset = 0, maxOffset = 0, minAngleOffset = 0, maxAngleOffset = 0;
            var targeted = false;
            var isSpawnPointRequired = champion.attackAngle !== undefined;
            var spawnOnTarget = true;
            $.each(champion.attacks, function(i, attack) {

                if (attack.spawnAfter == SpawnAfter.Previous) return false;

                if (attack.targeted) {
                    targeted = true;
                }
                if (attack.offset) {
                    minOffset = Math.min(attack.offset, minOffset);
                    maxOffset = Math.max(attack.offset, maxOffset);
                }
                if (attack.angleOffset) {
                    minAngleOffset = Math.min(attack.angleOffset, minAngleOffset);
                    maxAngleOffset = Math.max(attack.angleOffset, maxAngleOffset);
                }
                if (attack.spawnFrom !== SpawnFrom.Target && attack.type !== AttackType.Still) {
                    spawnOnTarget = false;
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

            var targetPoint = pointGenerator.getRandomTargetPoint(team, isSpawnPointRequired, spawnOnTarget, minOffset, maxOffset, targeted);

            var spawnPoint = null;
            if (isSpawnPointRequired) {
                if (champion.attackAngle === undefined) {
                    spawnPoint = pointGenerator.getRandomSpawnPoint(targetPoint, minAngleOffset, maxAngleOffset, team);
                } else {
                    spawnPoint = pointGenerator.determineSpawnPoint(targetPoint, champion.attackAngle, team);
                }
                // If an attack has an offset, it may spawn in the middle of the screen, which is no good.
                // In that case, back up the spawn point so nothing spawns on the screen.
                var angle = getAngle(spawnPoint, targetPoint);
                if (minOffset) {
                    var minOffsetPoint = pointGenerator.offsetPoint(spawnPoint, minOffset, angle - Math.PI / 2);
                    if (minOffsetPoint.y > 0 && minOffsetPoint.x > 0 && minOffsetPoint.x < stage.width) {
                        var edgePoint = pointGenerator.getEdgePoint(minOffsetPoint, angle + Math.PI);
                        var backupDistance = getDistance(minOffsetPoint, edgePoint);
                        spawnPoint = pointGenerator.offsetPoint(spawnPoint, backupDistance, angle + Math.PI);
                    }
                }
                if (maxOffset) {
                    var maxOffsetPoint = pointGenerator.offsetPoint(spawnPoint, maxOffset, angle - Math.PI / 2);
                    if (maxOffsetPoint.y > 0 && maxOffsetPoint.x > 0 && maxOffsetPoint.x < stage.width) {
                        var edgePoint = pointGenerator.getEdgePoint(maxOffsetPoint, angle + Math.PI);
                        var backupDistance = getDistance(maxOffsetPoint, edgePoint);
                        spawnPoint = pointGenerator.offsetPoint(spawnPoint, backupDistance, angle + Math.PI);
                    }
                }
            }
            prepareToFireAttack(champion, 0, team, spawnPoint, targetPoint, null, currentTime);
        }

        function prepareToFireAttack(champion, attackIndex, team, spawnPoint, targetPoint, prevParticle, currentTime) {
            var attack = champion.attacks[attackIndex];

            var attackFunction = function() {
                // Fire the current attack now
                var particle = fireAttack(champion, attackIndex, team, spawnPoint, targetPoint, currentTime);
                // alhpaModifier should propagate to the next attack
                if (prevParticle && prevParticle.alphaModifier !== undefined) {
                    particle.alphaModifier = prevParticle.alphaModifier;
                    particle.alpha *= prevParticle.alphaModifier;
                    if (particle.alphaSpeed)
                        particle.alphaSpeed *= prevParticle.alphaModifier;
                }
                // Fire the next attack
                if (attackIndex + 1 < champion.attacks.length) {
                    var nextAttack = champion.attacks[attackIndex + 1];
                    if (nextAttack.spawnAfter == SpawnAfter.Previous) {
                        particle.addEventListener("finish", function(e) {
                            prepareToFireAttack(champion, attackIndex + 1, team, spawnPoint, targetPoint, particle, e.currentTime);
                        });
                    } else {
                        prepareToFireAttack(champion, attackIndex + 1, team, spawnPoint, targetPoint, particle, currentTime + (attack.delay || 0) * 1000);
                    }
                }
            };
            if (attack.delay)
                setTimeout(attackFunction, attack.delay * 1000);
            else
                attackFunction();
        }

        function fireAttack(champion, attackIndex, team, spawnPoint, targetPoint, currentTime) {

            var attack = champion.attacks[attackIndex];

            if (attack.type == AttackType.IncreaseTransparency) {
                $.each(particles, function(i, particle) {
                    if ((team == Team.One && particle.x > stage.width / 2) ||
                        (team == Team.Two && particle.x <= stage.width / 2) ||
                        particle.imageDef.id == "akali") {
                        return;
                    }
                    var alphaFactor = 0.3;
                    particle.alphaModifier = (particle.alphaModifier || 1) * alphaFactor;
                    particle.alpha *= alphaFactor;
                    if (particle.alphaSpeed)
                        particle.alphaSpeed *= alphaFactor;
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
                    var angle = getAngle(particle, playerManager.getPosition());
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
            if (spawnPoint)
                angle = getAngle(spawnPoint, targetPoint);
            else
                angle = team == Team.One ? 0 : -Math.PI;

            particle.flipDirection = 1;
            if ((imageDef.flipIfForward && (Math.abs(angle) + 1e-4 < Math.PI / 2 || (Math.abs(Math.abs(angle) - Math.PI / 2) < 1e-4 && team == Team.One)))
                || (imageDef.flipIfBackward && Math.abs(angle) - 1e-4 > Math.PI / 2 || (Math.abs(Math.abs(angle) - Math.PI / 2) < 1e-4 && team == Team.Two))) {
                particle.scaleX = -1;
                particle.flipDirection = -1;
            }

            if (attack.spawnFrom == SpawnFrom.Target || attack.type == AttackType.Still || !spawnPoint)
                spawnPoint = targetPoint;
            if (attack.offset)
                spawnPoint = pointGenerator.offsetPoint(spawnPoint, attack.offset * particle.flipDirection, angle - Math.PI / 2);
            particle.x = spawnPoint.x;
            particle.y = spawnPoint.y;
            particle.spawnPoint = spawnPoint;

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
                    particle.x = Math.max(particle.regX, Math.min(particle.x, stage.width - particle.image.width + particle.regX));
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
                case LayerType.Darkness:
                    darknessLayer.addChild(particle);
                    break;
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
                //var yellowFilter = new ColorFilter(1, 1, 0);
                for (var i = 0; i < particles.length; ++i) {
                    var otherParticle = particles[i];
                    if (otherParticle.imageDef.id == "bard") {
                        // Bard ult should not affect bard ult.
                        continue;
                    }
                    if (collisionDetector.checkPixelCollision(particle, otherParticle)) {
                        otherParticle.isInStasis = true;
                        //otherParticle.filters = [yellowFilter];
                        particle.affectedParticles.push(otherParticle);
                    }
                }

                if (!playerManager.isInStasis() && collisionDetector.checkPixelCollision(particle, playerManager.hitbox)) {
                    playerManager.putInStasis(2500);
                }
            }
            particles.push(particle);
            return particle;
        }

        function moveParticles(elapsedMilliseconds, currentTime) {

            var elapsedSeconds = elapsedMilliseconds / 1000;

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
                    var playerPosition = playerManager.getPosition();
                    particle.x = playerPosition.x;
                    particle.y = playerPosition.y;
                }

                // Check if Urf has taken tons of damage.
                // If Urf is in stasis, then he is not taking tons of damage.
                if (particle.isDamaging && !playerManager.isInStasis() && collisionDetector.checkPixelCollision(playerManager.hitbox, particle)) {
                    // Only allow a particle to deal damage once.
                    particle.isDamaging = false;
                    playerManager.applyDamage(500);
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
                    if (!isFinished && particle.attack.finishCondition && particle.attack.finishCondition.hitPlayer && particle.isDamaging === false) {
                        isFinished = true;
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
                                particle.destroyTime = currentTime + 500;
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
                        var finishEvent = new Event("finish");
                        finishEvent.currentTime = currentTime;
                        particle.dispatchEvent(finishEvent);
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

                if (particle.destroyTime && currentTime >= particle.destroyTime) {
                    destroyParticle(particle);
                    particles.splice(i, 1);
                    --i;
                }
            }
        }

        function getDistance(p1, p2) {
            var dx = p2.x - p1.x;
            var dy = p2.y - p1.y;
            return Math.sqrt(dx * dx + dy * dy);
        }

        function getAngle(p1, p2) {
            return Math.atan2(p2.y - p1.y, p2.x - p1.x);
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

        function destroyAllParticles() {
            $.each(particles, function(i, particle) {
                destroyParticle(particle);
            });
            particles = [];
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

        function attacksOnStage() {
            var attackFound = false;
            $.each(particles, function(i, particle) {
                if (particle.attack.type != AttackType.Still || (particle.attack.finishCondition && particle.attack.finishCondition.duration !== undefined)) {
                    // The particle is not a Teemo mushroom.
                    attackFound = true;
                    return false;
                }
            });
            return attackFound;
        }

        // Expose public members
        this.destroyAllParticles = destroyAllParticles;
        this.fireAttackGroup = fireAttackGroup;
        this.moveParticles = moveParticles;
        this.attacksOnStage = attacksOnStage;
        this.bottomLayer = bottomLayer;
        this.mainLayer = mainLayer;
        this.topLayer = topLayer;
        this.darknessLayer = darknessLayer;
    };
})();