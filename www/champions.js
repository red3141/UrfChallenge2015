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
  - delay: delay until the attack is fired (relative to when the previous
           attack in the attack group was fired)
  - duration: duration for still attacks
  - layer: the LayerType on which the particle should appear
  - rotation: the initial rotation of the particle
  - rotationSpeed: the speed at which the particle rotates
  - alpha: alpha transparency of particle (0-1)
  - finished: the FinishedAction to do when the particle reaches the edge of
              the screen
  - targeted: should fire directly at the player initially (true/false)
  - focusOnTarget: should fire directly at the target regardless of the attack group's angle (true/false)
                   Useful if offset is <> 0.
  - isDamaging: should the attack particle cause damage on contact
                (true/false; default is true)
  - imageIndex: index of the image to use. Default is (attackIndex % images.length)
  - removePrevious: remove the previous attack in the same attack group then
                    this attack spawns (true/false)
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
        attacks: [{ type: AttackType.Still, layer: LayerType.AboveAll, duration: 5, isDamaging: false }]
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
            { type: AttackType.Still, layer: LayerType.BelowAll, isDamaging: false, alpha: 0.2 },
            { type: AttackType.Still, layer: LayerType.BelowAll, effect: Effect.Stasis, delay: 1, duration: 2.5, isDamaging: false, removePrevious: true },
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
        attacks: [{ type: AttackType.FromBottom, speed: 100 }]
    },
    "42": {
        name: "Corki",
        images: [{ id: "corki", pointAngle: 150, flipIfForward: true }],
        attacks: [{ type: AttackType.Bullet, speed: 250 }]
    },
    "122": {
        name: "Darius",
        images: [{ id: "darius", flipIfForward: true, regXRatio: 1, regYRatio: 0.9 }],
        attacks: [{ type: AttackType.FromSide, rotationSpeed: -250, rotation: 90 }]
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
        images: [{ id: "evelynn" }],
        attacks: [
            // TODO
        ]
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
            { type: AttackType.Still, scale: 0.5, alpha: 0.5, isDamaging: false },
            { type: AttackType.Still, scale: 0.5, delay: 0.5, scaleSpeed: 3, maxScale: 3, removePrevious: true }
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
        attacks: [
            { type: AttackType.FromSide, rotationSpeed: 350, rotation: -60 }
        ]
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
            { type: AttackType.Still, alpha: 0.1, isDamaging: false },
            { type: AttackType.Still, removePrevious: true, delay: 2, duration: 2 },
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
        attacks: [{ type: AttackType.Bullet, speed: 250 }]
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
        images: [{ id: "lucian", pointAngle: -15 }],
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
            { type: AttackType.Bullet, speed: 225 },
            { type: AttackType.Bullet, speed: 225, offset: 10, delay: 0.05 },
        ]
    },
    "99": {
        name: "Lux",
        images: [
            { id: "lux_preattack", pointAngle: 0 },
            { id: "lux", pointAngle: 0, flipIfBackward: true }
        ],
        attacks: [
            { type: AttackType.Still, isDamaging: false },
            { type: AttackType.Still, delay: 0.7, removePrevious: true, imageIndex: 1, duration: 0.5 }
        ]
    },
    "54": {
        name: "Malphite",
        images: [{ id: "malphite", pointAngle: -90 }],
        attacks: [{ type: AttackType.Bullet, speed: 300 }]
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
        attacks: [{ type: AttackType.FromBottom, speed: 200 }]
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
        attacks: [{ type: AttackType.FromSide, speed: 175, rotationSpeed: 350, rotation: -90 }]
    },
    "111": {
        name: "Nautilus",
        images: [{ id: "nautilus", pointAngle: 0, regXRatio: 1 }],
        attacks: [{ type: AttackType.Bullet, speed: 450, finished: FinishedAction.Disappear }]
    },
    "76": {
        name: "Nidalee",
        images: "nidalee"
    },
    "56": {
        name: "Nocturne",
        images: "nocturne"
    },
    "20": {
        name: "Nunu",
        images: "nunu"
    },
    "2": {
        name: "Olaf",
        images: "olaf"
    },
    "61": {
        name: "Orianna",
        images: "orianna"
    },
    "80": {
        name: "Pantheon", image: "pantheon"
    },
    "78": {
        name: "Poppy", image: "poppy"
    },
    "133": {
        name: "Quinn", image: "quinn"
    },
    "33": {
        name: "Rammus", image: "rammus"
    },
    "421": {
        name: "Rek'Sai", image: "rek'sai"
    },
    "58": {
        name: "Renekton", image: "renekton"
    },
    "107": {
        name: "Rengar", image: "rengar"
    },
    "92": {
        name: "Riven", image: "riven"
    },
    "68": {
        name: "Rumble", image: "rumble"
    },
    "13": {
        name: "Ryze", image: "ryze"
    },
    "113": {
        name: "Sejuani", image: "sejuani"
    },
    "35": {
        name: "Shaco", image: "shaco"
    },
    "98": {
        name: "Shen", image: "shen"
    },
    "102": {
        name: "Shyvana", image: "shyvana"
    },
    "27": {
        name: "Singed", image: "singed"
    },
    "14": {
        name: "Sion", image: "sion"
    },
    "15": {
        name: "Sivir", image: "sivir"
    },
    "72": {
        name: "Skarner", image: "skarner"
    },
    "37": {
        name: "Sona", image: "sona"
    },
    "16": {
        name: "Soraka", image: "soraka"
    },
    "50": {
        name: "Swain", image: "swain"
    },
    "134": {
        name: "Syndra", image: "syndra"
    },
    "91": {
        name: "Talon", image: "talon"
    },
    "44": {
        name: "Taric", image: "taric"
    },
    "17": {
        name: "Teemo", image: "teemo"
    },
    "412": {
        name: "Thresh", image: "thresh"
    },
    "18": {
        name: "Tristana", image: "tristana"
    },
    "48": {
        name: "Trundle", image: "trundle"
    },
    "23": {
        name: "Tryndamere", image: "tryndamere"
    },
    "4": {
        name: "Twisted Fate", image: "twistedfate"
    },
    "29": {
        name: "Twitch", image: "twitch"
    },
    "77": {
        name: "Udyr", image: "udyr"
    },
    "6": {
        name: "Urgot", image: "urgot"
    },
    "110": {
        name: "Varus", image: "varus"
    },
    "67": {
        name: "Vayne", image: "vayne"
    },
    "45": {
        name: "Veigar", image: "veigar"
    },
    "161": {
        name: "Vel'Koz", image: "vel'koz"
    },
    "254": {
        name: "Vi", image: "vi"
    },
    "112": {
        name: "Viktor", image: "viktor"
    },
    "8": {
        name: "Vladimir", image: "vladimir"
    },
    "106": {
        name: "Volibear", image: "volibear"
    },
    "19": {
        name: "Warwick", image: "warwick"
    },
    "62": {
        name: "Wukong", image: "wukong"
    },
    "101": {
        name: "Xerath", image: "xerath"
    },
    "5": {
        name: "Xin Zhao", image: "xinzhao"
    },
    "157": {
        name: "Yasuo", image: "yasuo"
    },
    "83": {
        name: "Yorick", image: "yorick"
    },
    "154": {
        name: "Zac", image: "zac"
    },
    "238": {
        name: "Zed", image: "zed"
    },
    "115": {
        name: "Ziggs",
        image: { id: "ziggs", regXRatio: 0.1, regYRatio: 0.1 },
        attacks: [
            { type: AttackType.Bullet, speed: 250, rotationSpeed: 250 }
        ]
    },
    "26": {
        name: "Zilean", image: "zilean"
    },
    "143": {
        name: "Zyra", image: "zyra"
    },
}