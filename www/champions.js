/*
Units:
- distance: pixels
- angle: degrees, measured clockwise from the horizontal
- time: seconds

Properties:
- name: champion name
- images: array of image properties
  - id: DOM element ID
  - regXRatio: X-position of the "origin" of the image from 0-1 (default is .5).
          0 = left edge; 1 = right edge.
  - regYRatio: Y-position of the "origin" of the image from 0-1 (default is .5).
          0 = top edge; 1 = bottom edge.
  - pointAngle: the angle at which the image is pointing for arrow-like images.
                If specified, the image will automatically rotate to point in 
                the direction in which it is moving.
  - flipIfForward: flip the image horizontally if travelling from left to right (true/false)
  - flipIfBackward: flip the image horizontally if travelling from right to left (true/false)
    * If flipped, rotation and rotationSpeed are applied in the opposite
      direction
- attackAngle: direction of the attack
- attacks: attacks to fire when the champion gets a kill
  - type: attack type
  - speed: particle speed
  - accel: particle acceleration
  - returnSpeed: particle return speed
  - scale: particle image scale (default is 1)
  - scaleX: particle image horizontal scale (before rotation; default is 1)
  - scaleY: particle image vertical scale (before rotation; default is 1)
  - scaleSpeed: speed that the scale increases
  - offset: offset perpendicular to the direction of movement
  - angleOffset: angular offset relative to the attack group's movement
                 direction
  - distance: the distance between the target point and spawn point
  - delay: delay until the attack is fired (relative to when the previous
           attack in the attack group was fired)
  - layer: the LayerType on which the particle should appear
  - rotation: the initial rotation of the particle
  - rotationSpeed: the speed at which the particle rotates
  - alpha: alpha transparency of particle (0-1)
  - alphaSpeed: rate of change of alpha (useful for fade-in effect)
  - spawnAfter: when to spawn the attack
  - spawnFrom: where to spawn the attack from
  - finishCondition: how to determine that the attack is "finished"
    - duration: finished after the specified number of seconds
    - distance: finished after travelling the specified distance
    - reachTarget: finished after reaching the target point (true/false)
    - hitPlayer: finished after dealing damage to the player (true/false)
  - finished: the FinishedAction to do when the attack is "finished"
  - targeted: should fire directly at the player (true/false)
  - focusOnTarget: should fire directly at the target regardless of the attack
                   group's angle (true/false). Useful if offset is <> 0.
  - isDamaging: should the attack particle cause damage on contact
                (true/false; default is true)
  - imageIndex: index of the image to use. Default is (attackIndex % images.length)
*/

champions = {
    "266": {
        name: "Aatrox",
        images: [{ id: "aatrox" }],
        attacks: [{ type: AttackType.Bullet, speed: 175, rotationSpeed: -60 }]
    },
    "103": {
        name: "Ahri",
        images: [{ id: "ahri" }],
        attacks: [{ type: AttackType.Bullet, finished: FinishedAction.Return, speed: 350, returnSpeed: 180 }]
    },
    "84": {
        name: "Akali",
        images: [{ id: "akali" }],
        attacks: [{ type: AttackType.Still, layer: LayerType.AboveAll, finishCondition: { duration: 5 }, finished: FinishedAction.Disappear, isDamaging: false }]
    },
    "12": {
        name: "Alistar",
        images: [{ id: "alistar", flipIfBackward: true, pointAngle: 0 }],
        attacks: [{ type: AttackType.Bullet, speed: 300 }]
    },
    "32": {
        name: "Amumu",
        images: [{ id: "amumu", regXRatio: 1, pointAngle: 0 }],
        attacks: [{ type: AttackType.Bullet, speed: 250, finished: FinishedAction.Disappear }]
    },
    "34": {
        name: "Anivia",
        images: [{ id: "anivia" }],
        attacks: [ { type: AttackType.Bullet, speed: 100, rotationSpeed: 180 }]
    },
    "1": {
        name: "Annie",
        images: [{ id: "annie" }],
        attacks: [{ type: AttackType.Bullet, speed: 200, rotationSpeed: -90 }]
    },
    "22": {
        name: "Ashe",
        images: [{ id: "ashe", pointAngle: 45 }],
        attacks: [
            { type: AttackType.Bullet, speed: 175, angleOffset: -20 },
            { type: AttackType.Bullet, speed: 175, angleOffset: -10 },
            { type: AttackType.Bullet, speed: 175, angleOffset: 0 },
            { type: AttackType.Bullet, speed: 175, angleOffset: 10 },
            { type: AttackType.Bullet, speed: 175, angleOffset: 20 },
        ]
    },
    "268": {
        name: "Azir",
        images: [{ id: "azir" }],
        attacks: [{ type: AttackType.Bullet, speed: 175, rotationSpeed: 60 }]
    },
    "432": {
        name: "Bard",
        images: [{ id: "bard" }],
        attacks: [
            { type: AttackType.Still, layer: LayerType.BelowAll, isDamaging: false, alpha: 0.2, finishCondition: { duration: 1 } },
            {
                type: AttackType.Still,
                layer: LayerType.BelowAll,
                effect: Effect.Stasis,
                isDamaging: false,
                spawnAfter: SpawnAfter.Previous,
                finishCondition: { duration: 2.5 },
                finished: FinishedAction.Disappear
            },
        ]
    },
    "53": {
        name: "Blitzcrank",
        images: [{ id: "blitzcrank", pointAngle: 0, flipIfBackward: true, regXRatio: 1 }],
        attacks: [{ type: AttackType.Bullet, speed: 450, finished: FinishedAction.Disappear }]
    },
    "63": {
        name: "Brand",
        images: [{ id: "brand", pointAngle: 150 }],
        attacks: [{ type: AttackType.Bullet, speed: 200 }]
    },
    "201": {
        name: "Braum",
        images: [{ id: "braum", pointAngle: 40, flipIfBackward: true }],
        attacks: [{ type: AttackType.Bullet, speed: 200 }]
    },
    "51": {
        name: "Caitlyn",
        images: [{ id: "caitlyn", pointAngle: 135, flipIfForward: true }],
        attacks: [{ type: AttackType.Bullet, speed: 300 }]
    },
    "69": {
        name: "Cassiopeia",
        images: [{ id: "cassiopeia", pointAngle: 100, flipIfForward: true }],
        attacks: [
            { type: AttackType.Bullet, speed: 250, offset: -9, rotationSpeed: -10 },
            { type: AttackType.Bullet, speed: 250, offset: 9, rotationSpeed: -10 },
        ]
    },
    "31": {
        name: "Cho'Gath",
        images: [{ id: "chogath" }],
        attacks: [{ type: AttackType.FromBottom, speed: 250 }]
    },
    "42": {
        name: "Corki",
        images: [{ id: "corki", pointAngle: 150, flipIfForward: true }],
        attacks: [{ type: AttackType.Bullet, speed: 250 }]
    },
    "122": {
        name: "Darius",
        images: [{ id: "darius", flipIfForward: true, regXRatio: 1, regYRatio: 0.9 }],
        attacks: [{ type: AttackType.Swing, rotationSpeed: -250, rotation: 90 }]
    },
    "131": {
        name: "Diana",
        images: [{ id: "diana", regXRatio: -1 }],
        attacks: [
            { type: AttackType.Bullet, speed: 125, rotationSpeed: 120, rotation: 0 },
            { type: AttackType.Bullet, speed: 125, rotationSpeed: 120, rotation: 120 },
            { type: AttackType.Bullet, speed: 125, rotationSpeed: 120, rotation: 240 }
        ]
    },
    "119": {
        name: "Draven",
        images: [{ id: "draven" }],
        attacks: [{ type: AttackType.Bullet, speed: 250, rotationSpeed: 500 }]
    },
    "36": {
        name: "Dr. Mundo",
        images: [{ id: "drmundo", flipIfBackward: true }],
        attacks: [{ type: AttackType.Bullet, speed: 175, rotationSpeed: 250, rotation: -60 }]
    },
    "60": {
        name: "Elise",
        images: [{ id: "elise", pointAngle: -90 }],
        attacks: [{ type: AttackType.Bullet, speed: 175 }]
    },
    "28": {
        name: "Evelynn",
        attacks: [{ type: AttackType.IncreaseTransparency }]
    },
    "81": {
        name: "Ezreal",
        images: [{ id: "ezreal", pointAngle: 45, flipIfBackward: true }],
        attacks: [{ type: AttackType.Bullet, speed: 225 }]
    },
    "9": {
        name: "Fiddlesticks",
        images: [{ id: "fiddlesticks", pointAngle: -90 }],
        attacks: [{ type: AttackType.Bullet, speed: 250, rotationSpeed: 300 }]
    },
    "114": {
        name: "Fiora",
        images: [{ id: "fiora", pointAngle: -30, flipIfBackward: true }],
        attacks: [{ type: AttackType.Bullet, speed: 250, rotationSpeed: 5, rotation: -5 }]
    },
    "105": {
        name: "Fizz",
        images: [{ id: "fizz" }],
        attacks: [
            { type: AttackType.Still, scale: 0.5, alpha: 0.5, isDamaging: false, finishCondition: { duration: 0.5 } },
            { type: AttackType.Still, scale: 0.5, scaleSpeed: 3, maxScale: 3, spawnAfter: SpawnAfter.Previous }
        ]
    },
    "3": {
        name: "Galio",
        images: [{ id: "galio", pointAngle: -35 }],
        attacks: [{ type: AttackType.Bullet, speed: 250 }]
    },
    "41": {
        name: "Gangplank",
        images: [{ id: "gangplank", flipIfBackward: true }],
        attacks: [{ type: AttackType.Bullet, speed: 150, rotationSpeed: 70 }]
    },
    "86": {
        name: "Garen",
        images: [{ id: "garen", regXRatio: 0 }],
        attacks: [{ type: AttackType.Bullet, speed: 250, rotationSpeed: 360 }]
    },
    "150": {
        name: "Gnar",
        images: [{ id: "gnar", pointAngle: -35 }],
        attacks: [{ type: AttackType.Bullet, speed: 225 }]
    },
    "79": {
        name: "Gragas",
        images: [{ id: "gragas", flipIfBackward: true }],
        attacks: [{ type: AttackType.Bullet, speed: 175, rotationSpeed: 100 }]
    },
    "104": {
        name: "Graves",
        images: [{ id: "graves", pointAngle: 45 }],
        attacks: [
            { type: AttackType.Bullet, speed: 300, angleOffset: -30 },
            { type: AttackType.Bullet, speed: 300, angleOffset: 0 },
            { type: AttackType.Bullet, speed: 300, angleOffset: 30 }
        ]
    },
    "120": {
        name: "Hecarim",
        images: [{ id: "hecarim", regXRatio: 0, regYRatio: 1, flipIfBackward: true }],
        attacks: [{ type: AttackType.Swing, rotationSpeed: 350, rotation: -60 }]
    },
    "74": {
        name: "Heimerdinger",
        images: [{ id: "heimerdinger", pointAngle: 160 }],
        attacks: [
            { type: AttackType.Bullet, speed: 400, offset: -120, targeted: true, focusOnTarget: true },
            { type: AttackType.Bullet, speed: 400, offset: -60, targeted: true, focusOnTarget: true },
            { type: AttackType.Bullet, speed: 400, offset: 0, targeted: true, focusOnTarget: true },
            { type: AttackType.Bullet, speed: 400, offset: 60, targeted: true, focusOnTarget: true },
            { type: AttackType.Bullet, speed: 400, offset: 120, targeted: true, focusOnTarget: true },
        ]
    },
    "39": {
        name: "Irelia",
        images: [{ id: "irelia", pointAngle: 45 }],
        attacks: [
            { type: AttackType.Bullet, speed: 400, rotationSpeed: 1080, angleOffset: -15 },
            { type: AttackType.Bullet, speed: 400, rotationSpeed: 1080, angleOffset: -5, delay: 0.5 },
            { type: AttackType.Bullet, speed: 400, rotationSpeed: 1080, angleOffset: 5, delay: 0.5 },
            { type: AttackType.Bullet, speed: 400, rotationSpeed: 1080, angleOffset: 15, delay: 0.5 },
        ]
    },
    "40": {
        name: "Janna",
        images: [{ id: "janna", flipIfBackward: true }],
        attacks: [{ type: AttackType.Bullet, speed: 175, rotationSpeed: -300 }]
    },
    "59": {
        name: "Jarvan IV",
        images: [{ id: "jarvan" }],
        attackAngle: 90,
        attacks: [{ type: AttackType.Bullet, speed: 200, accel: 500 }]
    },
    "24": {
        name: "Jax",
        images: [{ id: "jax" }],
        attacks: [{ type: AttackType.Bullet, speed: 300 }]
    },
    "126": {
        name: "Jayce",
        images: [{ id: "jayce" }],
        attacks: [{ type: AttackType.Bullet, speed: 300, rotationSpeed: 720 }]
    },
    "222": {
        name: "Jinx",
        images: [{ id: "jinx", pointAngle: 40, flipIfBackward: true }],
        attacks: [{ type: AttackType.Bullet, speed: 250 }]
    },
    "429": {
        name: "Kalista",
        images: [{ id: "kalista", pointAngle: 135 }],
        attacks: [{ type: AttackType.Bullet, speed: 250 }]
    },
    "43": {
        name: "Karma",
        images: [{ id: "karma", pointAngle: 135 }],
        attacks: [{ type: AttackType.Bullet, speed: 250 }]
    },
    "30": {
        name: "Karthus",
        images: [{ id: "karthus" }],
        attacks: [
            { type: AttackType.Still, alpha: 0.1, isDamaging: false, finishCondition: { duration: 1 } },
            { type: AttackType.Still, spawnAfter: SpawnAfter.Previous, finishCondition: { duration: 1 }, finished: FinishedAction.Disappear },
        ]
    },
    "38": {
        name: "Kassadin",
        images: [{ id: "kassadin", pointAngle: -45 }],
        attacks: [{ type: AttackType.Bullet, speed: 200 }]
    },
    "55": {
        name: "Katarina",
        images: [{ id: "katarina", regYRatio: 0.8 }],
        attacks: [{ type: AttackType.Bullet, speed: 250, rotationSpeed: -1080 }]
    },
    "10": {
        name: "Kayle",
        images: [{ id: "kayle", pointAngle: 40 }],
        attacks: [{ type: AttackType.Bullet, speed: 175 }]
    },
    "85": {
        name: "Kennen",
        images: [{ id: "kennen", pointAngle: 40 }],
        attacks: [{ type: AttackType.Bullet, speed: 250, rotationSpeed: 400 }]
    },
    "121": {
        name: "Kha'Zix",
        images: [{ id: "khazix", pointAngle: 130 }],
        attacks: [
            { type: AttackType.Bullet, speed: 200, angleOffset: -30 },
            { type: AttackType.Bullet, speed: 200, angleOffset: 0 },
            { type: AttackType.Bullet, speed: 200, angleOffset: 30 },
        ]
    },
    "96": {
        name: "Kog'Maw",
        images: [{ id: "kogmaw" }],
        attackAngle: 90,
        attacks: [{ type: AttackType.Bullet, speed: 250, accel: 500 }]
    },
    "7": {
        name: "LeBlanc",
        images: [{ id: "leblanc" }],
        attacks: [{ type: AttackType.Bullet, speed: 450 }]
    },
    "64": {
        name: "Lee Sin",
        images: [{ id: "leesin", pointAngle: -45 }],
        attacks: [{ type: AttackType.Bullet, speed: 300, targeted: true }]
    },
    "89": {
        name: "Leona",
        images: [{ id: "leona" }],
        attacks: [{ type: AttackType.Bullet, speed: 175, rotationSpeed: 360 }]
    },
    "127": {
        name: "Lissandra",
        images: [{ id: "lissandra", pointAngle: 0, flipIfBackward: true }],
        attacks: [{ type: AttackType.Bullet, speed: 175, rotationSpeed: 20 }]
    },
    "236": {
        name: "Lucian",
        images: [{ id: "lucian", pointAngle: -20, regXRatio: 0.9, regYRatio: 0.1 }],
        attacks: [
            { type: AttackType.Bullet, speed: 300, offset: -25 },
            { type: AttackType.Bullet, speed: 300, offset: 25, delay: 0.2 },
            { type: AttackType.Bullet, speed: 300, offset: -25, delay: 0.2 },
            { type: AttackType.Bullet, speed: 300, offset: 25, delay: 0.2 },
            { type: AttackType.Bullet, speed: 300, offset: -25, delay: 0.2 },
            { type: AttackType.Bullet, speed: 300, offset: 25, delay: 0.2 },
            { type: AttackType.Bullet, speed: 300, offset: -25, delay: 0.2 },
            { type: AttackType.Bullet, speed: 300, offset: 25, delay: 0.2 },
        ]
    },
    "117": {
        name: "Lulu",
        images: [{ id: "lulu", pointAngle: -35 }],
        attacks: [
            { type: AttackType.Bullet, speed: 225, offset: -75, focusOnTarget: true },
            { type: AttackType.Bullet, speed: 225, offset: 75, focusOnTarget: true }
        ]
    },
    "99": {
        name: "Lux",
        images: [
            { id: "lux_preattack", pointAngle: 0 },
            { id: "lux", pointAngle: 0, flipIfBackward: true }
        ],
        attacks: [
            { type: AttackType.Still, isDamaging: false, targeted: true, finishCondition: { duration: 0.7 }, finished: FinishedAction.Disappear },
            { type: AttackType.Still, spawnAfter: SpawnAfter.Previous, imageIndex: 1, finishCondition: { duration: 0.5 }, finished: FinishedAction.Disappear }
        ]
    },
    "54": {
        name: "Malphite",
        images: [{ id: "malphite" }],
        attacks: [{ type: AttackType.Bullet, speed: 300, scale: 1, scaleSpeed: 0.3, maxScale: 2.5 }]
    },
    "90": {
        name: "Malzahar",
        images: [{ id: "malzahar", pointAngle: 135, flipIfForward: true }],
        attacks: [{ type: AttackType.Bullet, speed: 175 }]
    },
    "57": {
        name: "Maokai",
        images: [{ id: "maokai", pointAngle: 45, flipIfBackward: true }],
        attacks: [{ type: AttackType.Bullet, speed: 225 }]
    },
    "11": {
        name: "Master Yi",
        images: [{ id: "masteryi", pointAngle: 110, regXRatio: 0, regYRatio: 1, flipIfBackward: true }],
        attacks: [{ type: AttackType.Bullet, speed: 200, rotationSpeed: 25 }]
    },
    "21": {
        name: "Miss Fortune",
        images: [{ id: "missfortune" }],
        attacks: [{ type: AttackType.Bullet, speed: 250 }]
    },
    "82": {
        name: "Mordekaiser",
        images: [{ id: "mordekaiser" }],
        attacks: [{ type: AttackType.FromBottom, speed: 400 }]
    },
    "25": {
        name: "Morgana",
        images: [{ id: "morgana", pointAngle: 45, regXRatio: 0.75, regYRatio: 0.75 }],
        attacks: [{ type: AttackType.Bullet, speed: 200 }]
    },
    "267": {
        name: "Nami",
        images: [{ id: "nami" }],
        attacks: [{ type: AttackType.Bullet, speed: 175, rotationSpeed: -70 }]
    },
    "75": {
        name: "Nasus",
        images: [{ id: "nasus", flipIfBackward: true, regXRatio: 0, regYRatio: 0.9 }],
        attacks: [{ type: AttackType.Swing, speed: 175, rotationSpeed: 350, rotation: -90 }]
    },
    "111": {
        name: "Nautilus",
        images: [{ id: "nautilus", pointAngle: 0, regXRatio: 1 }],
        attacks: [{ type: AttackType.Bullet, speed: 450, finished: FinishedAction.Disappear }]
    },
    "76": {
        name: "Nidalee",
        images: [{ id: "nidalee", pointAngle: 45, regXRatio: 0.8, regYRatio: 0.8 }],
        attacks: [{ type: AttackType.Bullet, speed: 225 }]
    },
    "56": {
        name: "Nocturne",
        images: [
            { id: "nocturne", pointAngle: 0, flipIfBackward: true },
            { id: "nocturne_darkness" },
        ],
        attacks: [
            { type: AttackType.Bullet, speed: 300, targeted: true },
            { type: AttackType.Follow, alpha: 0, alphaSpeed: 3, finishCondition: { duration: 2 }, finished: FinishedAction.Fade, layer: LayerType.Darkness },
        ]
    },
    "20": {
        name: "Nunu",
        images: [{ id: "nunu" }],
        attacks: [{ type: AttackType.Bullet, speed: 150, rotationSpeed: 30 }]
    },
    "2": {
        name: "Olaf",
        images: [{ id: "olaf", flipIfBackward: true, regYRatio: 0.6 }],
        attacks: [{ type: AttackType.Bullet, speed: 250, rotationSpeed: 540 }]
    },
    "61": {
        name: "Orianna",
        images: [{ id: "orianna", pointAngle: 100, flipIfForward: true }],
        attacks: [{ type: AttackType.Bullet, speed: 335 }]
    },
    "80": {
        name: "Pantheon",
        images: [{ id: "pantheon", pointAngle: -155 }],
        attacks: [{ type: AttackType.Bullet, speed: 250 }]
    },
    "78": {
        name: "Poppy",
        images: [{ id: "poppy", flipIfForward: true, regXRatio: 0.85, regYRatio: 1 }],
        attacks: [{ type: AttackType.Bullet, speed: 250, rotationSpeed: -360 }]
    },
    "133": {
        name: "Quinn",
        images: [{ id: "quinn", flipIfForward: true }],
        attacks: [{ type: AttackType.FromSide, speed: 250 }]
    },
    "33": {
        name: "Rammus",
        images: [{ id: "rammus", pointAngle: 30, flipIfBackward: true }],
        attacks: [{ type: AttackType.Bullet, speed: 50, accel: 450 }]
    },
    "421": {
        name: "Rek'Sai",
        images: [{ id: "reksai", pointAngle: 45, flipIfForward: true }],
        attacks: [{ type: AttackType.Bullet, speed: 300 }]
    },
    "58": {
        name: "Renekton",
        images: [{ id: "renekton", flipIfForward: true, regXRatio: 1, regYRatio: 0.1 }],
        attacks: [{ type: AttackType.Swing, rotationSpeed: -350, rotation: 130 }]
    },
    "107": {
        name: "Rengar",
        images: [{ id: "rengar", regXRatio: 0.55, regYRatio: 0.45, flipIfBackward: true }],
        attacks: [{ type: AttackType.Bullet, speed: 250, rotationSpeed: 360 }]
    },
    "92": {
        name: "Riven",
        images: [{ id: "riven", flipIfForward: true, regXRatio: 1, regYRatio: 1 }],
        attacks: [{ type: AttackType.Swing, rotationSpeed: -350, rotation: 45 }]
    },
    "68": {
        name: "Rumble",
        images: [{ id: "rumble" }],
        attackAngle: 90,
        attacks: [
            { type: AttackType.Bullet, speed: 300, offset: -75 },
            { type: AttackType.Bullet, speed: 300, offset: -25, delay: 0.15 },
            { type: AttackType.Bullet, speed: 300, offset: 25, delay: 0.15 },
            { type: AttackType.Bullet, speed: 300, offset: 75, delay: 0.15 },
        ]
    },
    "13": {
        name: "Ryze",
        images: [{ id: "ryze" }],
        attacks: [{ type: AttackType.Bullet, speed: 250 }]
    },
    "113": {
        name: "Sejuani",
        images: [{ id: "sejuani" }],
        attacks: [{ type: AttackType.Bullet, speed: 200, rotationSpeed: -360 }]
    },
    "35": {
        name: "Shaco",
        images: [{ id: "shaco", flipIfBackward: true }],
        attacks: [{ type: AttackType.Bullet, speed: 250 }]
    },
    "98": {
        name: "Shen",
        images: [{ id: "shen", pointAngle: 45 }],
        attacks: [{ type: AttackType.Bullet, speed: 350 }]
    },
    "102": {
        name: "Shyvana",
        images: [{ id: "shyvana", pointAngle: 135, regXRatio: 0.15, regYRatio: 0.85, flipIfForward: true }],
        attacks: [{ type: AttackType.Bullet, speed: 275 }]
    },
    "27": {
        name: "Singed",
        images: [{ id: "singed", flipIfBackward: true }],
        attackAngle: 90,
        attacks: [
            { type: AttackType.Still, alpha: 0, alphaSpeed: 2.5, offset: -260, isDamaging: false, finishCondition: { duration: 0.4 }, finished: FinishedAction.Disappear },
            { type: AttackType.Still, alpha: 1, alphaSpeed: -0.5, offset: -260, spawnAfter: SpawnAfter.Previous, finishCondition: { duration: 2 }, finished: FinishedAction.Disappear },
            { type: AttackType.Still, alpha: 0, alphaSpeed: 2.5, offset: -220, isDamaging: false, finishCondition: { duration: 0.4 }, finished: FinishedAction.Disappear },
            { type: AttackType.Still, alpha: 1, alphaSpeed: -0.5, offset: -220, spawnAfter: SpawnAfter.Previous, finishCondition: { duration: 2 }, finished: FinishedAction.Disappear },
            { type: AttackType.Still, alpha: 0, alphaSpeed: 2.5, offset: -180, isDamaging: false, finishCondition: { duration: 0.4 }, finished: FinishedAction.Disappear },
            { type: AttackType.Still, alpha: 1, alphaSpeed: -0.5, offset: -180, spawnAfter: SpawnAfter.Previous, finishCondition: { duration: 2 }, finished: FinishedAction.Disappear },
            { type: AttackType.Still, alpha: 0, alphaSpeed: 2.5, offset: -140, isDamaging: false, finishCondition: { duration: 0.4 }, finished: FinishedAction.Disappear },
            { type: AttackType.Still, alpha: 1, alphaSpeed: -0.5, offset: -140, spawnAfter: SpawnAfter.Previous, finishCondition: { duration: 2 }, finished: FinishedAction.Disappear },
            { type: AttackType.Still, alpha: 0, alphaSpeed: 2.5, offset: -100, isDamaging: false, finishCondition: { duration: 0.4 }, finished: FinishedAction.Disappear },
            { type: AttackType.Still, alpha: 1, alphaSpeed: -0.5, offset: -100, spawnAfter: SpawnAfter.Previous, finishCondition: { duration: 2 }, finished: FinishedAction.Disappear },
            { type: AttackType.Still, alpha: 0, alphaSpeed: 2.5, offset: -60, isDamaging: false, finishCondition: { duration: 0.4 }, finished: FinishedAction.Disappear },
            { type: AttackType.Still, alpha: 1, alphaSpeed: -0.5, offset: -60, spawnAfter: SpawnAfter.Previous, finishCondition: { duration: 2 }, finished: FinishedAction.Disappear },
            { type: AttackType.Still, alpha: 0, alphaSpeed: 2.5, offset: -20, isDamaging: false, finishCondition: { duration: 0.4 }, finished: FinishedAction.Disappear },
            { type: AttackType.Still, alpha: 1, alphaSpeed: -0.5, offset: -20, spawnAfter: SpawnAfter.Previous, finishCondition: { duration: 2 }, finished: FinishedAction.Disappear },
            { type: AttackType.Still, alpha: 0, alphaSpeed: 2.5, offset: 20, isDamaging: false, finishCondition: { duration: 0.4 }, finished: FinishedAction.Disappear },
            { type: AttackType.Still, alpha: 1, alphaSpeed: -0.5, offset: 20, spawnAfter: SpawnAfter.Previous, finishCondition: { duration: 2 }, finished: FinishedAction.Disappear },
            { type: AttackType.Still, alpha: 0, alphaSpeed: 2.5, offset: 60, isDamaging: false, finishCondition: { duration: 0.4 }, finished: FinishedAction.Disappear },
            { type: AttackType.Still, alpha: 1, alphaSpeed: -0.5, offset: 60, spawnAfter: SpawnAfter.Previous, finishCondition: { duration: 2 }, finished: FinishedAction.Disappear },
            { type: AttackType.Still, alpha: 0, alphaSpeed: 2.5, offset: 100, isDamaging: false, finishCondition: { duration: 0.4 }, finished: FinishedAction.Disappear },
            { type: AttackType.Still, alpha: 1, alphaSpeed: -0.5, offset: 100, spawnAfter: SpawnAfter.Previous, finishCondition: { duration: 2 }, finished: FinishedAction.Disappear },
            { type: AttackType.Still, alpha: 0, alphaSpeed: 2.5, offset: 140, isDamaging: false, finishCondition: { duration: 0.4 }, finished: FinishedAction.Disappear },
            { type: AttackType.Still, alpha: 1, alphaSpeed: -0.5, offset: 140, spawnAfter: SpawnAfter.Previous, finishCondition: { duration: 2 }, finished: FinishedAction.Disappear },
            { type: AttackType.Still, alpha: 0, alphaSpeed: 2.5, offset: 180, isDamaging: false, finishCondition: { duration: 0.4 }, finished: FinishedAction.Disappear },
            { type: AttackType.Still, alpha: 1, alphaSpeed: -0.5, offset: 180, spawnAfter: SpawnAfter.Previous, finishCondition: { duration: 2 }, finished: FinishedAction.Disappear },
            { type: AttackType.Still, alpha: 0, alphaSpeed: 2.5, offset: 220, isDamaging: false, finishCondition: { duration: 0.4 }, finished: FinishedAction.Disappear },
            { type: AttackType.Still, alpha: 1, alphaSpeed: -0.5, offset: 220, spawnAfter: SpawnAfter.Previous, finishCondition: { duration: 2 }, finished: FinishedAction.Disappear },
            { type: AttackType.Still, alpha: 0, alphaSpeed: 2.5, offset: 260, isDamaging: false, finishCondition: { duration: 0.4 }, finished: FinishedAction.Disappear },
            { type: AttackType.Still, alpha: 1, alphaSpeed: -0.5, offset: 260, spawnAfter: SpawnAfter.Previous, finishCondition: { duration: 2 }, finished: FinishedAction.Disappear },
            { type: AttackType.Still, alpha: 0, alphaSpeed: 2.5, offset: 300, isDamaging: false, finishCondition: { duration: 0.4 }, finished: FinishedAction.Disappear },
            { type: AttackType.Still, alpha: 1, alphaSpeed: -0.5, offset: 300, spawnAfter: SpawnAfter.Previous, finishCondition: { duration: 2 }, finished: FinishedAction.Disappear },
        ]
    },
    "14": {
        name: "Sion",
        images: [{ id: "sion", pointAngle: 30, flipIfBackward: true }],
        attacks: [{ type: AttackType.Bullet, speed: 200, accel: 400 }]
    },
    "15": {
        name: "Sivir",
        images: [{ id: "sivir" }],
        attacks: [{ type: AttackType.Bullet, speed: 350, rotationSpeed: 400, finished: FinishedAction.Return }]
    },
    "72": {
        name: "Skarner",
        images: [{ id: "skarner", pointAngle: 50 }],
        attacks: [{ type: AttackType.Bullet, speed: 200 }]
    },
    "37": {
        name: "Sona",
        images: [{ id: "sona", pointAngle: 45 }],
        attacks: [{ type: AttackType.Bullet, speed: 300 }]
    },
    "16": {
        name: "Soraka",
        images: [{ id: "soraka", regXRatio: 0.3, regYRatio: 0.7 }],
        attacks: [{ type: AttackType.Bullet, speed: 175, rotationSpeed: 110 }]
    },
    "50": {
        name: "Swain",
        images: [{ id: "swain", pointAngle: 55, flipIfBackward: true }],
        attacks: [{ type: AttackType.Bullet, speed: 250 }]
    },
    "134": {
        name: "Syndra",
        images: [{ id: "syndra" }],
        attacks: [{ type: AttackType.Bullet, speed: 250 }]
    },
    "91": {
        name: "Talon",
        images: [{ id: "talon" }],
        attacks: [
            { type: AttackType.Bullet, speed: 400, rotationSpeed: -400, angleOffset: -30, finishCondition: { distance: 350 }, finished: FinishedAction.Return },
            { type: AttackType.Bullet, speed: 400, rotationSpeed: -400, angleOffset: 0, finishCondition: { distance: 350 }, finished: FinishedAction.Return },
            { type: AttackType.Bullet, speed: 400, rotationSpeed: -400, angleOffset: 30, finishCondition: { distance: 350 }, finished: FinishedAction.Return },
        ]
    },
    "44": {
        name: "Taric",
        images: [{ id: "taric" }],
        attacks: [{ type: AttackType.Bullet, speed: 200, rotationSpeed: -20 }]
    },
    "17": {
        name: "Teemo",
        images: [{ id: "teemo" }],
        attacks: [
            { type: AttackType.Still, alpha: 1, alphaSpeed: -1, isDamaging: false, finishCondition: { duration: 1 }, finished: FinishedAction.Disappear },
            { type: AttackType.Still, spawnAfter: SpawnAfter.Previous, alpha: 0, finishCondition: { hitPlayer: true }, finished: FinishedAction.Disappear },
            { type: AttackType.Still, alpha: 1, alphaSpeed: -2, scaleSpeed: 1, isDamaging: false, spawnAfter: SpawnAfter.Previous, finishCondition: { duration: 0.5 }, finished: FinishedAction.Disappear },
        ]
    },
    "412": {
        name: "Thresh",
        images: [{ id: "thresh", pointAngle: 0, regXRatio: 1 }],
        attacks: [{ type: AttackType.Bullet, speed: 400, finished: FinishedAction.Return, returnSpeed: 700 }]
    },
    "18": {
        name: "Tristana",
        images: [{ id: "tristana" }],
        attacks: [{ type: AttackType.Bullet, speed: 250, rotationSpeed: 40 }]
    },
    "48": {
        name: "Trundle",
        images: [{ id: "trundle" }],
        attacks: [{ type: AttackType.FromBottom, speed: 150 }]
    },
    "23": {
        name: "Tryndamere",
        images: [{ id: "tryndamere" }],
        attacks: [{ type: AttackType.Bullet, speed: 175, rotationSpeed: 45 }]
    },
    "4": {
        name: "Twisted Fate",
        images: [{ id: "twistedfate", pointAngle: 5 }],
        attacks: [
            { type: AttackType.Bullet, speed: 250, angleOffset: -30 },
            { type: AttackType.Bullet, speed: 250, angleOffset: 0 },
            { type: AttackType.Bullet, speed: 250, angleOffset: 30 },
        ]
    },
    "29": {
        name: "Twitch",
        images: [{ id: "twitch" }],
        attacks: [{ type: AttackType.Bullet, speed: 200, rotationSpeed: 25 }]
    },
    "77": {
        name: "Udyr",
        images: [{ id: "udyr", pointAngle: 180, flipIfForward: true, regXRatio: 0, regYRatio: 1 }],
        attacks: [{ type: AttackType.AcrossEdge, speed: 400 }]
    },
    "6": {
        name: "Urgot",
        images: [{ id: "urgot", pointAngle: 45 }],
        attacks: [{ type: AttackType.Bullet, speed: 300 }]
    },
    "110": {
        name: "Varus",
        images: [{ id: "varus", pointAngle: -45 }],
        attacks: [{ type: AttackType.Bullet, speed: 300 }]
    },
    "67": {
        name: "Vayne",
        images: [{ id: "vayne", pointAngle: -135 }],
        attacks: [{ type: AttackType.Bullet, speed: 350 }]
    },
    "45": {
        name: "Veigar",
        images: [{ id: "veigar" }],
        attacks: [{ type: AttackType.Bullet, speed: 250, rotationSpeed: 30 }]
    },
    "161": {
        name: "Vel'Koz",
        images: [{ id: "velkoz", pointAngle: 45 }],
        attacks: [
            { type: AttackType.Bullet, speed: 250, finishCondition: { reachTarget: true }, finished: FinishedAction.Disappear },
            { type: AttackType.Bullet, speed: 250, angleOffset: -90, spawnFrom: SpawnFrom.Target, spawnAfter: SpawnAfter.Previous },
            { type: AttackType.Bullet, speed: 250, angleOffset: 90, spawnFrom: SpawnFrom.Target }
        ]
    },
    "254": {
        name: "Vi",
        images: [{ id: "vi", flipIfBackward: true }],
        attacks: [{ type: AttackType.FromSide, speed: 300 }]
    },
    "112": {
        name: "Viktor",
        images: [{ id: "viktor", pointAngle: 180, flipIfForward: true, regXRatio: 0, regYRatio: 1 }],
        attacks: [{ type: AttackType.AcrossEdge, speed: 300 }]
    },
    "8": {
        name: "Vladimir",
        images: [{ id: "vladimir" }],
        attacks: [
            { type: AttackType.Bullet, speed: 350, angleOffset: -20 },
            { type: AttackType.Bullet, speed: 350 },
            { type: AttackType.Bullet, speed: 350, angleOffset: 20 },
        ]
    },
    "106": {
        name: "Volibear",
        images: [{ id: "volibear", pointAngle: -90 }],
        attacks: [{ type: AttackType.Bullet, speed: 200 }]
    },
    "19": {
        name: "Warwick",
        attacks: [{ type: AttackType.GlobalFocus }]
    },
    "62": {
        name: "Wukong",
        images: [{ id: "wukong", regXRatio: 0, regYRatio: 0.9 }],
        attacks: [{ type: AttackType.Bullet, speed: 200, accel: 100, rotationSpeed: 360 }]
    },
    "101": {
        name: "Xerath",
        images: [{ id: "xerath", pointAngle: 80 }],
        attacks: [{ type: AttackType.Bullet, speed: 250 }]
    },
    "5": {
        name: "Xin Zhao",
        images: [{ id: "xinzhao", flipIfBackward: true }],
        attacks: [{ type: AttackType.FromSide, speed: 350 }]
    },
    "157": {
        name: "Yasuo",
        images: [{ id: "yasuo", flipIfBackward: true, regXRatio: 1 }],
        attackAngle: 0,
        attacks: [{ type: AttackType.Bullet, speed: 350, accel: -90 }]
    },
    "83": {
        name: "Yorick",
        images: [{ id: "yorick", flipIfForward: true }],
        attacks: [{ type: AttackType.Bullet, speed: 200 }]
    },
    "154": {
        name: "Zac",
        images: [{ id: "zac", flipIfBackward: true }],
        attacks: [{ type: AttackType.Bullet, speed: 200, rotationSpeed: 30 }]
    },
    "238": {
        name: "Zed",
        images: [
            // Make sure that the coloured Zed particle is drawn above the shadow particle.
            { id: "zed_shadow", flipIfBackward: true },
            { id: "zed", flipIfBackward: true },
        ],
        attacks: [
            { type: AttackType.Bullet, speed: 350, offset: -100, focusOnTarget: true },
            { type: AttackType.Bullet, speed: 350, offset: 100, focusOnTarget: true }
        ]
    },
    "115": {
        name: "Ziggs",
        image: { id: "ziggs", regXRatio: 0.1, regYRatio: 0.1 },
        attacks: [
            { type: AttackType.Bullet, speed: 250, rotationSpeed: 250 }
        ]
    },
    "26": {
        name: "Zilean",
        images: [{ id: "zilean" }],
        attacks: [{ type: AttackType.Bullet, speed: 250, rotationSpeed: -15 }]
    },
    "143": {
        name: "Zyra",
        images: [{ id: "zyra" }],
        attacks: [{ type: AttackType.Bullet, speed: 225, rotationSpeed: 25 }]
    },
}