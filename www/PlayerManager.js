﻿(function() {
    if (window.PlayerManager)
        return;

    // Imports
    Bitmap = createjs.Bitmap;
    EventDispatcher = createjs.EventDispatcher;

    window.PlayerManager = function(stage, keyboardManager) {

        var fastSpeed = 450;
        var slowSpeed = 100;

        var hitbox = new Bitmap(document.getElementById("hitbox"));
        hitbox.regX = hitbox.image.width / 2;
        hitbox.regY = hitbox.image.height / 2;
        hitbox.x = stage.width / 2;
        hitbox.y = stage.height - 100;

        var minPlayerX = 0.5 * hitbox.image.width;
        var maxPlayerX = stage.width - minPlayerX;
        var minPlayerY = 0.5 * hitbox.image.height;
        var maxPlayerY = stage.height - minPlayerY;

        var player = new Bitmap(document.getElementById("urf"));
        player.regX = player.image.width / 2;
        player.regY = player.image.height / 2;
        player.x = hitbox.x;
        player.y = hitbox.y;

        var health = 2000;

        function movePlayer(elapsedMilliseconds) {
            var dx = 0;
            var dy = 0;
            var speed = keyboardManager.keyPressed[Key.Focus] ? slowSpeed : fastSpeed;
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

        function applyDamage(damage) {
            health -= damage;
            console.log(health);
            if (health <= 0) {
                //this.dispatchEvent("dead");
            }
        }

        // Expose public members
        this.hitbox = hitbox;
        this.player = player;
        this.health = health;
        this.movePlayer = movePlayer;
        this.applyDamage = applyDamage;
    };

    PlayerManager.prototype = new EventDispatcher();
})();