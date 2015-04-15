(function() {
    if (window.PlayerManager)
        return;

    // Imports
    Bitmap = createjs.Bitmap;
    EventDispatcher = createjs.EventDispatcher;

    window.PlayerManager = function(stage, keyboardManager) {

        var fastSpeed = 450;
        var slowSpeed = 100;
        const maxZhonyasCharges = 3;

        var hitboxLarge = new Bitmap(document.getElementById("hitbox"));
        hitboxLarge.regX = hitboxLarge.image.width / 2;
        hitboxLarge.regY = hitboxLarge.image.height / 2;
        var hitboxSmall = new Bitmap(document.getElementById("hitbox_focus"));
        hitboxSmall.regX = hitboxSmall.image.width / 2;
        hitboxSmall.regY = hitboxSmall.image.height / 2;
        
        var isFocused = keyboardManager.keyPressed[Key.Focus];
        var hitbox = isFocused ? hitboxSmall : hitboxLarge;
        
        var damageIndicator = new Bitmap(document.getElementById("damage"));

        var minPlayerX = 0.5 * hitbox.image.width;
        var maxPlayerX = stage.width - minPlayerX;
        var minPlayerY = 0.5 * hitbox.image.height;
        var maxPlayerY = stage.height - minPlayerY;

        var player = new Bitmap(document.getElementById("urf"));
        player.regX = player.image.width / 2;
        player.regY = player.image.height / 2;
        
        var playerZhonyas = new Bitmap(document.getElementById("urf_zhonyas"));
        playerZhonyas.regX = playerZhonyas.image.width / 2;
        playerZhonyas.regY = playerZhonyas.image.height / 2;
        var stasisMilliseconds = 0;
        var zhonyasCharges = 3;

        var maxHealth = 2000;
        var health = maxHealth;
        
        resetPlayer();

        function resetPlayer() {
            health = maxHealth;
            updateHealthBar();
            hitbox.x = player.x = stage.width / 2;
            hitbox.y = player.y = stage.height - 100;
            player.alpha = 1;
            hitboxLarge.alpha = 1;
            hitboxSmall.alpha = 1;
            damageIndicator.alpha = 0;
            stasisMilliseconds = 0;
            zhonyasCharges = 3;
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
                    return;
                }
            } else if (keyboardManager.keyPressed[Key.Zhonyas] && zhonyasCharges > 0 && gameState == GameState.Playing) {
                putInStasis(1500);
                zhonyasCharges -= 1;
                updateZhonyasCharges();
                return;
            }
            
            var dx = 0;
            var dy = 0;
            var speed = keyboardManager.keyPressed[Key.Focus] ? slowSpeed : fastSpeed;
            
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
            
            var distance = speed * elapsedMilliseconds / 1000;

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
            player.x = hitbox.x;
            player.y = hitbox.y;
        }

        function getPosition() {
            return {
                x: hitbox.x,
                y: hitbox.y
            };
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
            console.log(health);
            if (health <= 0) {
                this.dispatchEvent("dead");
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
        this.isInStasis = isInStasis;
        this.putInStasis = putInStasis;
        this.applyDamage = applyDamage;
        this.damageIndicator = damageIndicator;
    };

    PlayerManager.prototype = new EventDispatcher();
})();