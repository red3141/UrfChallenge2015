(function() {
    if (window.PlayerManager)
        return;

    // Imports
    var Bitmap = createjs.Bitmap;
    var EventDispatcher = createjs.EventDispatcher;

    window.PlayerManager = function(stage, keyboardManager) {

        var self = this;

        var fastSpeed = 450;
        var slowSpeed = 100;
        
        var isFocused = keyboardManager.keyPressed[Key.Focus];

        var hitboxLarge, hitboxSmall, hitbox, player;
        var minPlayerX, maxPlayerX, minPlayerY, maxPlayerY;

        $("#resources").imagesLoaded().always(function() {
            hitboxLarge = new Bitmap(document.getElementById("hitbox"));
            hitboxLarge.regX = hitboxLarge.image.width / 2;
            hitboxLarge.regY = hitboxLarge.image.height / 2;
            hitboxSmall = new Bitmap(document.getElementById("hitbox_focus"));
            hitboxSmall.regX = hitboxSmall.image.width / 2;
            hitboxSmall.regY = hitboxSmall.image.height / 2;

            hitbox = hitboxLarge;
            self.hitbox = hitbox;

            minPlayerX = 0.5 * hitbox.image.width;
            maxPlayerX = stage.width - minPlayerX;
            minPlayerY = 0.5 * hitbox.image.height;
            maxPlayerY = stage.height - minPlayerY;

            player = new Bitmap(document.getElementById("urf"));
            player.regX = player.image.width / 2;
            player.regY = player.image.height / 2;
            self.player = player;

            resetPlayer();

            self.dispatchEvent("ready");
        });


        var maxHealth = 2000;
        var health = maxHealth;
        
        function resetPlayer() {
            health = maxHealth;
            updateHealthBar();
            hitbox.x = player.x = stage.width / 2;
            hitbox.y = player.y = stage.height - 100;
            player.alpha = 1;
            hitboxLarge.alpha = 1;
            hitboxSmall.alpha = 1;
        }
        
        function movePlayer(elapsedMilliseconds) {
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

        function applyDamage(damage) {
            health = Math.max(0, health - damage);
            updateHealthBar();
            console.log(health);
            if (health <= 0) {
                this.dispatchEvent("dead");
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
        this.applyDamage = applyDamage;
    };

    PlayerManager.prototype = new EventDispatcher();
})();