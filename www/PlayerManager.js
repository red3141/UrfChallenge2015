﻿(function() {
    if (window.PlayerManager)
        return;

    // Imports
    var Bitmap = createjs.Bitmap;
    var EventDispatcher = createjs.EventDispatcher;

    window.PlayerManager = function(stage, keyboardManager) {

        var self = this;

        var fastSpeed = 450;
        var slowSpeed = 100;
        var maxRanduinsCharges = 3;
        var maxZhonyasCharges = 3;
        var maxFlashCharges = 3;
        
        var isFocused = keyboardManager.keyPressed[Key.Focus];
        
        var hitboxLarge, hitboxSmall, hitbox, player, playerZhonyas, damageIndicator;
        var minPlayerX, maxPlayerX, minPlayerY, maxPlayerY;
        
        var randuinsCharges = maxRanduinsCharges;
        
        var stasisMilliseconds = 0;
        var zhonyasCharges = maxZhonyasCharges;
        
        var flashOnNextMove = false;
        var flashCharges = maxFlashCharges;
        
        var maxHealth = 2000;
        var health = maxHealth;

        $("#resources").imagesLoaded().always(function() {
            hitboxLarge = new Bitmap(document.getElementById("hitbox"));
            hitboxLarge.regX = hitboxLarge.image.width / 2;
            hitboxLarge.regY = hitboxLarge.image.height / 2;
            hitboxSmall = new Bitmap(document.getElementById("hitbox_focus"));
            hitboxSmall.regX = hitboxSmall.image.width / 2;
            hitboxSmall.regY = hitboxSmall.image.height / 2;

            hitbox = hitboxLarge;
            self.hitbox = hitbox;

            damageIndicator = new Bitmap(document.getElementById("damage"));
            self.damageIndicator = damageIndicator;

            minPlayerX = 0.5 * hitbox.image.width;
            maxPlayerX = stage.width - minPlayerX;
            minPlayerY = 0.5 * hitbox.image.height;
            maxPlayerY = stage.height - minPlayerY;

            player = new Bitmap(document.getElementById("urf"));
            player.regX = player.image.width / 2;
            player.regY = player.image.height / 2;
            self.player = player;

            playerZhonyas = new Bitmap(document.getElementById("urf_zhonyas"));
            playerZhonyas.regX = playerZhonyas.image.width / 2;
            playerZhonyas.regY = playerZhonyas.image.height / 2;
            self.playerZhonyas = playerZhonyas;
            
            self.dispatchEvent("ready");
        });

        keyboardManager.addEventListener("flash", function (e) {
            if (!isInStasis() && flashCharges > 0) {
                flashOnNextMove = true;
            }
        });
        
        function resetPlayer() {
            health = maxHealth;
            updateHealthBar();
            hitbox.x = player.x = stage.width / 2;
            hitbox.y = player.y = stage.height - 100;
            player.alpha = 1;
            hitboxLarge.alpha = 1;
            hitboxSmall.alpha = 1;
            damageIndicator.alpha = 0;
            randuinsCharges = maxRanduinsCharges;
            updateRanduinsCharges();
            flashCharges = maxFlashCharges;
            updateFlashCharges();
            stasisMilliseconds = 0;
            zhonyasCharges = maxZhonyasCharges;
            updateZhonyasCharges();
        }
        
        function movePlayer(elapsedMilliseconds, gameState) {
            // Update the damage indicator if necessary.
            if (damageIndicator.alpha > 0) {
                damageIndicator.alpha = Math.max(0, damageIndicator.alpha - elapsedMilliseconds / 200);
            }
            
            if (stasisMilliseconds > 0) {
                stasisMilliseconds -= elapsedMilliseconds;
                if (stasisMilliseconds <= 0) {
                    stage.removeChild(playerZhonyas);
                } else {
                    flashOnNextMove = false;
                    return;
                }
            } else if (keyboardManager.keyPressed[Key.Zhonyas] && zhonyasCharges > 0 && gameState != GameState.Ended) {
                putInStasis(1500);
                --zhonyasCharges;
                updateZhonyasCharges();
                flashOnNextMove = false;
                return;
            }
            
            var dx = 0;
            var dy = 0;
            var speed = keyboardManager.keyPressed[Key.Focus] ? slowSpeed : fastSpeed;
            var flashDistance = (flashOnNextMove ? 100 : 0);
            
            // Change the hitbox if the player has pressed/unpressed the Focus key.
            if (isFocused != keyboardManager.keyPressed[Key.Focus]) {
                isFocused = keyboardManager.keyPressed[Key.Focus];
                stage.removeChild(hitbox);
                var hitboxAlpha = hitbox.alpha;
                hitbox = isFocused ? hitboxSmall : hitboxLarge;
                this.hitbox = hitbox;
                hitbox.x = player.x;
                hitbox.y = player.y;
                hitbox.alpha = hitboxAlpha;
                stage.addChild(hitbox);
            }
            
            var distance = speed * elapsedMilliseconds / 1000 + flashDistance;

            if (keyboardManager.keyPressed[Key.Up]) {
                dy -= distance;
            }
            if (keyboardManager.keyPressed[Key.Down]) {
                dy += distance;
            }
            if (keyboardManager.keyPressed[Key.Left]) {
                dx -= distance;
            }
            if (keyboardManager.keyPressed[Key.Right]) {
                dx += distance;
            }
            // Make diagonal movements the same speed as horizontal/vertical movements.
            if (dx != 0 && dy != 0) {
                dx *= Math.SQRT1_2;
                dy *= Math.SQRT1_2;
            }

            hitbox.x += dx;
            hitbox.y += dy;

            // Keep the player in bounds.
            hitbox.x = Math.max(minPlayerX, Math.min(maxPlayerX, hitbox.x));
            hitbox.y = Math.max(minPlayerY, Math.min(maxPlayerY, hitbox.y));
            
            // If the player attempted a flash, check if they moved. If they did not, they fail flashed, so don't charge them a flash.
            if (flashOnNextMove && (player.x != hitbox.x || player.y != hitbox.y)) {
                --flashCharges;
                updateFlashCharges();
            }
            flashOnNextMove = false;
            
            player.x = hitbox.x;
            player.y = hitbox.y;
        }

        function getPosition() {
            return {
                x: hitbox.x,
                y: hitbox.y
            };
        }
        
        // Returns true if a Randuin's charge could be used, and false if there were none to use.
        function useRanduinsCharge() {
            if (randuinsCharges > 0) {
                --randuinsCharges;
                updateRanduinsCharges();
                return true;
            } else {
                return false;
            }
        }
        
        function isInStasis() {
            return stasisMilliseconds > 0;
        }
        
        function putInStasis(durationMilliseconds) {
            playerZhonyas.x = player.x;
            playerZhonyas.y = player.y;
            stage.addChild(playerZhonyas);
            stasisMilliseconds = durationMilliseconds;
        }
        
        function applyDamage(damage) {
            health = Math.max(0, health - damage);
            updateHealthBar();
            damageIndicator.alpha = 1;
            if (health <= 0) {
                this.dispatchEvent("dead");
            }
        }
        
        function updateRanduinsCharges() {
            if (randuinsCharges == maxRanduinsCharges) {
                for (var i = 0; i < maxRanduinsCharges; ++i) {
                    $("#randuins" + i).css("visibility", "visible");
                }
            } else {
                $("#randuins" + randuinsCharges).css("visibility", "hidden");
            }
        }
        
        function updateZhonyasCharges() {
            if (zhonyasCharges == maxZhonyasCharges) {
                for (var i = 0; i < maxZhonyasCharges; ++i) {
                    $("#zhonyas" + i).css("visibility", "visible");
                }
            } else {
                $("#zhonyas" + zhonyasCharges).css("visibility", "hidden");
            }
        }
        
        function updateFlashCharges() {
            if (flashCharges == maxFlashCharges) {
                for (var i = 0; i < maxFlashCharges; ++i) {
                    $("#flash" + i).css("visibility", "visible");
                }
            } else {
                $("#flash" + flashCharges).css("visibility", "hidden");
            }
        }
        
        function updateHealthBar() {
            var percentHealth = health / maxHealth * 100;
            $("#health-bar").width(percentHealth + "%");
            $("#health-bar-text").text(health + "k / " + maxHealth + "k");
        }

        // Expose public members
        this.hitbox = hitbox;
        this.player = player;
        this.health = health;
        this.resetPlayer = resetPlayer;
        this.movePlayer = movePlayer;
        this.getPosition = getPosition;
        this.useRanduinsCharge = useRanduinsCharge;
        this.isInStasis = isInStasis;
        this.putInStasis = putInStasis;
        this.applyDamage = applyDamage;
        this.damageIndicator = damageIndicator;
    };

    PlayerManager.prototype = new EventDispatcher();
})();