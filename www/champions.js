/*
Units:
- distance: pixels
- angle: degrees, measured clockwise from the horizontal
- time: seconds

Properties:
- name: champion name
- image: details about the particle image
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
  - offset: offset perpendicular to the direction of movement
  - imageAngle: the angle at which the image is pointing
  - angleOffset: angular offset relative to the attack group's movement
                 direction
  - delay: delay until the attack is fired
  - duration: duration for still attacks
  - layer: the LayerType on which the particle should appear
  - rotation: the initial rotation of the particle
  - rotationSpeed: the speed at which the particle rotates
  - finished: the FinishedAction to do when the particle reaches the edge of
              the screen
  - targeted: should fire directly at the player initially (true/false)
  - focusOnTarget: should fire directly at the target regardless of the attack group's angle (true/false)
                   Useful if offset is <> 0.
*/

champions = {
    "266": {
        name: "Aatrox",
        image: { id: "aatrox" },
        attacks: [
            { type: AttackType.Bullet, speed: 175, rotationSpeed: -60 }
        ]
    },
    "103": {
        name: "Ahri",
        image: { id: "ahri" },
        attacks: [
            { type: AttackType.Bullet, finished: FinishedAction.Return, speed: 350, returnSpeed: 180 }
        ]
    },
    "84": {
        name: "Akali",
        image: { id: "akali" },
        attacks: [
            { type: AttackType.Still, layer: LayerType.AboveAll, duration: 5 }
        ]
    },
    "12": {
        name: "Alistar",
        image: { id: "alistar", flipIfBackward: true, pointAngle: 0 },
        attacks: [
            { type: AttackType.Bullet, speed: 300 }
        ]
    },
    "32": {
        name: "Amumu",
        image: { id: "amumu", regXRatio: 1, pointAngle: 0 },
        attacks: [
            { type: AttackType.Bullet, speed: 250 }
        ]
    },
    "34": {
        name: "Anivia",
        image: { id: "anivia" },
        attacks: [
            { type: AttackType.Bullet, speed: 100, rotationSpeed: 180 }
        ]
    },
    "1": {
        name: "Annie",
        image: { id: "annie" },
        attacks: [
            { type: AttackType.Bullet, speed: 200, rotationSpeed: -90 }
        ]
    },
    "22": {
        name: "Ashe",
        image: { id: "ashe", pointAngle: 45 },
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
        image: { id: "azir" },
        attacks: [
            { type: AttackType.Bullet, speed: 175, rotationSpeed: 60 }
        ]
    },
    "432": {
        name: "Bard",
        image: { id: "bard" },
        attacks: [
            { type: AttackType.Still, layer: LayerType.BelowAll, effect: Effect.Stasis, duration: 2.5, delay: 1.5 }
        ]
    },
    "53": {
        name: "Blitzcrank",
        image: { id: "blitzcrank", pointAngle: -30, flipIfBackward: true, regXRatio: 1, regYRatio: 0 },
        attacks: [
            { type: AttackType.Bullet, speed: 450, finished: FinishedAction.Disappear }
        ]
    },
    "63": {
        name: "Brand",
        image: { id: "brand", pointAngle: 150 },
        attacks: [
            { type: AttackType.Bullet, speed: 200 }
        ]
    },
    "201": {
        name: "Braum",
        image: { id: "braum", pointAngle: 40, flipIfBackward: true },
        attacks: [
            { type: AttackType.Bullet, speed: 200 }
        ]
    },
    "51": {
        name: "Caitlyn",
        image: { id: "caitlyn", pointAngle: 135, flipIfForward: true },
        attacks: [
            { type: AttackType.Bullet, speed: 300 }
        ]
    },
    "69": {
        name: "Cassiopeia",
        image: { id: "cassiopeia", pointAngle: 100, flipIfForward: true },
        attacks: [
            { type: AttackType.Bullet, speed: 250, offset: -9, rotationSpeed: -10 },
            { type: AttackType.Bullet, speed: 250, offset: 9, rotationSpeed: -10 },
        ]
    },
    "31": {
        name: "Cho'Gath",
        image: { id: "chogath" },
        attacks: [
            { type: AttackType.FromBottom, speed: 100 }
        ]
    },
    "42": {
        name: "Corki",
        image: { id: "corki", pointAngle: 150, flipIfForward: true },
        attacks: [
            { type: AttackType.Bullet, speed: 250 }
        ]
    },
    "122": {
        name: "Darius",
        image: { id: "darius", flipIfForward: true, regXRatio: 1, regYRatio: 0.9 },
        attacks: [
            { type: AttackType.FromSide, rotationSpeed: -250, rotation: 90 }
        ]
    },
    "131": {
        name: "Diana",
        image: { id: "diana", regXRatio: -1 },
        attacks: [
            { type: AttackType.Bullet, speed: 125, rotationSpeed: 120, rotation: 0 },
            { type: AttackType.Bullet, speed: 125, rotationSpeed: 120, rotation: 120 },
            { type: AttackType.Bullet, speed: 125, rotationSpeed: 120, rotation: 240 }
        ]
    },
    "119": {
        name: "Draven",
        image: { id: "draven" },
        attacks: [
            { type: AttackType.Bullet, speed: 250, rotationSpeed: 500 }
        ]
    },
    "36": {
        name: "Dr. Mundo",
        image: { id: "drmundo", flipIfBackward: true },
        attacks: [
            { type: AttackType.Bullet, speed: 175, rotationSpeed: 250, rotation: -60 }
        ]
    },
    "60": {
        name: "Elise",
        image: { id: "elise", pointAngle: -90 },
        attacks: [
            { type: AttackType.Bullet, speed: 175 }
        ]
    },
    "28": {
        name: "Evelynn",
        image: { id: "evelynn" },
        attacks: [
            // TODO
        ]
    },
    "81": {
        name: "Ezreal",
        image: { id: "ezreal", pointAngle: 45, flipIfBackward: true },
        attacks: [
            { type: AttackType.Bullet, speed: 225 }
        ]
    },
    "9": {
        name: "Fiddlesticks",
        image: { id: "fiddlesticks", pointAngle: -90 },
        attacks: [
            { type: AttackType.Bullet, speed: 250, rotationSpeed: 300 }
        ]
    },
    "114": {
        name: "Fiora",
        image: { id: "fiora", pointAngle: -30, flipIfBackward: true },
        attacks: [
            { type: AttackType.Bullet, speed: 250, rotationSpeed: 5, rotation: -5 }
        ]
    },
    "105": {
        name: "Fizz",
        image: { id: "fizz" },
        attacks: [
            { type: AttackType.Still, scale: 0.1, scaleSpeed: 3, maxScale: 3 }
        ]
    },
    "3": {
        name: "Galio",
        image: { id: "galio", pointAngle: -35 },
        attacks: [
            { type: AttackType.Bullet, speed: 250 }
        ]
    },
    "41": {
        name: "Gangplank",
        image: { id: "gangplank", flipIfBackward: true },
        attacks: [
            { type: AttackType.Bullet, speed: 150, rotationSpeed: 70 }
        ]
    },
    "86": {
        name: "Garen",
        image: { id: "garen", regXRatio: 0 },
        attacks: [
            { type: AttackType.Bullet, speed: 250, rotationSpeed: 360 }
        ]
    },
    "150": {
        name: "Gnar",
        image: { id: "gnar", pointAngle: -35 },
        attacks: [
            { type: AttackType.Bullet, speed: 225 }
        ]
    },
    "79": {
        name: "Gragas",
        image: { id: "gragas", flipIfBackward: true },
        attacks: [
            { type: AttackType.Bullet, speed: 175, rotationSpeed: 100 }
        ]
    },
    "104": {
        name: "Graves",
        image: { id: "graves", pointAngle: 45 },
        attacks: [
            { type: AttackType.Bullet, speed: 300, angleOffset: -30 },
            { type: AttackType.Bullet, speed: 300, angleOffset: 0 },
            { type: AttackType.Bullet, speed: 300, angleOffset: 30 }
        ]
    },
    "120": {
        name: "Hecarim",
        image: { id: "hecarim", regXRatio: 0, regYRatio: 1, flipIfBackward: true },
        attacks: [
            { type: AttackType.FromSide, rotationSpeed: 350, rotation: -60 }
        ]
    },
    "74": {
        name: "Heimerdinger",
        image: { id: "heimerdinger", pointAngle: 160 },
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
        image: { id: "irelia", pointAngle: 45 },
        attacks: [
            { type: AttackType.Bullet, speed: 400, rotationSpeed: 1080, angleOffset: -15 },
            { type: AttackType.Bullet, speed: 400, rotationSpeed: 1080, angleOffset: -5, delay: 0.5 },
            { type: AttackType.Bullet, speed: 400, rotationSpeed: 1080, angleOffset: 5, delay: 1.0 },
            { type: AttackType.Bullet, speed: 400, rotationSpeed: 1080, angleOffset: 15, delay: 1.5 },
        ]
    },
    "40": {
        name: "Janna",
        image: { id: "janna", flipIfBackward: true },
        attacks: [
            { type: AttackType.Bullet, speed: 175, rotationSpeed: -300 }
        ]
    },
    "59": {
        name: "Jarvan IV",
        image: { id: "jarvan" },
        attackAngle: 90,
        attacks: [
            { type: AttackType.Bullet, speed: 200, accel: 500 }
        ]
    },
    "24": {
        name: "Jax", image: "jax"
    },
    "126": {
        name: "Jayce", image: "jayce"
    },
    "222": {
        name: "Jinx", image: "jinx"
    },
    "429": {
        name: "Kalista", image: "kalista"
    },
    "43": {
        name: "Karma", image: "karma"
    },
    "30": {
        name: "Karthus", image: "karthus"
    },
    "38": {
        name: "Kassadin", image: "kassadin"
    },
    "55": {
        name: "Katarina", image: "katarina"
    },
    "10": {
        name: "Kayle", image: "kayle"
    },
    "85": {
        name: "Kennen", image: "kennen"
    },
    "121": {
        name: "Kha'Zix", image: "kha'zix"
    },
    "96": {
        name: "Kog'Maw", image: "kog'maw"
    },
    "7": {
        name: "LeBlanc", image: "leblanc"
    },
    "64": {
        name: "Lee Sin", image: "leesin"
    },
    "89": {
        name: "Leona", image: "leona"
    },
    "127": {
        name: "Lissandra", image: "lissandra"
    },
    "236": {
        name: "Lucian", image: "lucian"
    },
    "117": {
        name: "Lulu", image: "lulu"
    },
    "99": {
        name: "Lux", image: "lux"
    },
    "54": {
        name: "Malphite", image: "malphite"
    },
    "90": {
        name: "Malzahar", image: "malzahar"
    },
    "57": {
        name: "Maokai", image: "maokai"
    },
    "11": {
        name: "Master Yi", image: "masteryi"
    },
    "21": {
        name: "Miss Fortune", image: "missfortune"
    },
    "82": {
        name: "Mordekaiser", image: "mordekaiser"
    },
    "25": {
        name: "Morgana", image: "morgana"
    },
    "267": {
        name: "Nami", image: "nami"
    },
    "75": {
        name: "Nasus", image: "nasus"
    },
    "111": {
        name: "Nautilus", image: "nautilus"
    },
    "76": {
        name: "Nidalee", image: "nidalee"
    },
    "56": {
        name: "Nocturne", image: "nocturne"
    },
    "20": {
        name: "Nunu", image: "nunu"
    },
    "2": {
        name: "Olaf", image: "olaf"
    },
    "61": {
        name: "Orianna", image: "orianna"
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