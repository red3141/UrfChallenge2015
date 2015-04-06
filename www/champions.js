/*
Units:
- distance: pixels
- angle: degrees, measured clockwise from the horizontal
- time: seconds

Properties:
- name: champion name
- image: particle image ID
- attacks: attacks to fire when the champion gets a kill
  - type: attack type
  - speed: particle speed
  - returnSpeed: particle return speed
  - offset: offset perpendicular to the direction of movement
  - imageAngle: the angle at which the image is pointing
  - angleOffset: angular offset relative to the attack group's movement
                 direction
  - delay: delay until the attack is fired
  - duration: duration for still attacks
  - layer: the LayerType on which the particle should appear
  - regX: registration X-position relative to the left edge of the image.
          The registration point acts as the centre of rotation.
  - regY: registration Y-position relative to the top edge of the image.
          The registration point acts as the centre of rotation.
  - rotation: the initial rotation of the particle
  - rotationSpeed: the speed at which the particle rotates
  - autoRotate: indicates whether the particle should rotate based on its
                current movement direction (true/false)
  - flipTeam1: flip the image horizontally for team 1 (true/false)
  - flipTeam2: flip the image horizontally for team 2 (true/false)
    * If flipped, rotation and rotationSpeed are applied in the opposite
      direction
  - finished: the FinishedAction to do when the particle reaches the edge of
              the screen
  - targeted: should fire directly at the player initially (true/false)
*/

champions = {
    "266": {
        name: "Aatrox", image: "aatrox", attacks: []
    },
    "103": {
        name: "Ahri", image: "ahri", attacks: [
            { type: AttackType.FromCorner, finished: FinishedAction.Return, speed: 300, returnSpeed: 180 }
        ]
    },
    "84": {
        name: "Akali", image: "akali", attacks: [
            { type: AttackType.Still, layerType: LayerType.AboveAll, duration: 5 }
        ]
    },
    "12": {
        name: "Alistar", image: "alistar", attacks: [
            { type: AttackType.FromCorner, speed: 300, autoRotate: true, imageAngle: 0, flipTeam2: true }
        ]
    },
    "32": { name: "Amumu", image: "amumu", attacks: [] },
    "34": {
        name: "Anivia", image: "anivia", attacks: [
            { type: AttackType.FromCorner, speed: 100, rotationSpeed: 180 }
        ]
    },
    "1": {
        name: "Annie", image: "annie", attacks: [
            { type: AttackType.FromCorner, speed: 200 }
        ]
    },
    "22": {
        name: "Ashe", image: "ashe", attacks: [
            { type: AttackType.FromCorner, speed: 200, autoRotate: true, imageAngle: 45, angleOffset: -20 },
            { type: AttackType.FromCorner, speed: 200, autoRotate: true, imageAngle: 45, angleOffset: -10 },
            { type: AttackType.FromCorner, speed: 200, autoRotate: true, imageAngle: 45, angleOffset: 0 },
            { type: AttackType.FromCorner, speed: 200, autoRotate: true, imageAngle: 45, angleOffset: 10 },
            { type: AttackType.FromCorner, speed: 200, autoRotate: true, imageAngle: 45, angleOffset: 20 },
        ]
    },
    "268": { name: "Azir", image: "azir", attacks: [] },
    "432": {
        name: "Bard", image: "bard", attacks: [
            { type: AttackType.Still, layerType: LayerType.BelowAll, duration: 2.5 }
        ]
    },
    "53": {
        name: "Blitzcrank", image: "blitzcrank", attacks: [
            { type: AttackType.FromCorner, speed: 450, autoRotate: true, imageAngle: -30, flipTeam2: true }
        ]
    },
    "63": {
        name: "Brand", image: "brand", attacks: [
            { type: AttackType.FromCorner, speed: 200, autoRotate: true, imageAngle: 150 }
        ]
    },
    "201": {
        name: "Braum", image: "braum", attacks: [
            { type: AttackType.FromCorner, speed: 200, autoRotate: true, imageAngle: 30, flipTeam2: true }
        ]
    },
    "51": {
        name: "Caitlyn", image: "caitlyn", attacks: [
            { type: AttackType.FromCorner, speed: 300, autoRotate: true, imageAngle: 135, flipTeam1: true }
        ]
    },
    "69": {
        name: "Cassiopeia", image: "cassiopeia", attacks: [
            { type: AttackType.FromCorner, speed: 250, offset: -3, autoRotate: true, imageAngle: 100, flipTeam1: true },
            { type: AttackType.FromCorner, speed: 200, offset: 3, autoRotate: true, imageAngle: 100, flipTeam1: true },
        ]
    },
    "31": {
        name: "Cho'Gath", image: "cho'gath", attacks: [
            { type: AttackType.FromBottom, speed: 300 }
        ]
    },
    "42": {
        name: "Corki", image: "corki", attacks: [
            { type: AttackType.FromCorner, speed: 250, autoRotate: true, imageAngle: 150, flipTeam1: true }
        ]
    },
    "122": {
        name: "Darius", image: "darius", attacks: [
            { type: AttackType.FromSide, rotationSpeed: -250, flipTeam1: true }
        ]
    },
    "131": { name: "Diana", image: "diana" },
    "119": {
        name: "Draven", image: "draven", attacks: [
            { type: AttackType.FromCorner, speed: 250, rotationSpeed: 250 }
        ]
    },
    "36": {
        name: "Dr. Mundo", image: "drmundo", attacks: [
            { type: AttackType.FromCorner, speed: 250, rotationSpeed: 250, flipTeam2: true }
        ]
    },
    "60": {
        name: "Elise", image: "elise"
    },
    "28": {
        name: "Evelynn", image: "evelynn"
    },
    "81": {
        name: "Ezreal", image: "ezreal"
    },
    "9": {
        name: "Fiddlesticks", image: "fiddlesticks"
    },
    "114": {
        name: "Fiora", image: "fiora"
    },
    "105": {
        name: "Fizz", image: "fizz"
    },
    "3": {
        name: "Galio", image: "galio"
    },
    "41": {
        name: "Gangplank", image: "gangplank"
    },
    "86": {
        name: "Garen", image: "garen"
    },
    "150": {
        name: "Gnar", image: "gnar"
    },
    "79": {
        name: "Gragas", image: "gragas"
    },
    "104": {
        name: "Graves", image: "graves"
    },
    "120": {
        name: "Hecarim", image: "hecarim"
    },
    "74": {
        name: "Heimerdinger", image: "heimerdinger"
    },
    "39": {
        name: "Irelia", image: "irelia"
    },
    "40": {
        name: "Janna", image: "janna"
    },
    "59": {
        name: "Jarvan IV", image: "jarvaniv"
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
        name: "Ziggs", image: "ziggs"
    },
    "26": {
        name: "Zilean", image: "zilean"
    },
    "143": {
        name: "Zyra", image: "zyra"
    },
}