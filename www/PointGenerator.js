(function() {
    if (window.PointGenerator)
        return;

    window.PointGenerator = function(stage, playerManager) {
        
        var teamSeparationWidth = 70;

        function offsetPoint(point, distance, angleInRadians) {
            return {
                x: point.x + distance * Math.cos(angleInRadians),
                y: point.y + distance * Math.sin(angleInRadians)
            };
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

        function getRandomTargetPoint(team, isSpawnPointRequired, spawnOnTarget, minOffset, maxOffset, targeted) {
            if (targeted) {
                return playerManager.getPosition();
            } else {
                var margin = 60;
                var targetPoint = { x: 0, y: 0 };
                var availableWidth = stage.width / 2 - margin;
                var availableHeight = stage.height - margin * 2;
                if (!isSpawnPointRequired || spawnOnTarget)
                    availableWidth -= maxOffset - minOffset + teamSeparationWidth / 2;
                targetPoint.x = availableWidth > 0 ? Math.random() * availableWidth + margin : -minOffset;
                targetPoint.y = Math.random() * availableHeight + margin;
                if (team == Team.One) {
                    if (!isSpawnPointRequired)
                        targetPoint.x -= minOffset;
                } else { // Team 2
                    targetPoint.x = stage.width - targetPoint.x;
                    if (!isSpawnPointRequired)
                        targetPoint.x -= maxOffset;
                }
                return targetPoint;
            }
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

        // Expose public members
        this.offsetPoint = offsetPoint;
        this.getRandomSpawnPoint = getRandomSpawnPoint;
        this.determineSpawnPoint = determineSpawnPoint;
        this.getRandomTargetPoint = getRandomTargetPoint;
        this.getEdgePoint = getEdgePoint;
    };
})();