var IMG_TO_LOAD = [
    ["player_test3/village/resource", "food_icon"],
    ["player_test3/village/resource", "wood_icon"],
    ["player_test3/village/resource", "stone_icon"],
    ["player_test3/village/building", "forest_icon"],
    ["player_test3/village/building", "defend_village_icon"],
    ["player_test3/village/building", "workshop_icon"],
    ["player_test3/village/building", "bow_workshop_icon"],
    ["player_test3/village/resource", "villageAP_icon"],
    ["player_test3/village/resource", "under_construction_icon"],
    ["player_test3/village/building", "Houses"],
]

World = function (Screen) {
    this.Screen = Screen
    this.Music = new SoundManager()
    this.Imgs = []
    
    this.initVillage = () => {
        this.village = new Village({})
        this.village.generateBasicVillage()
        this.villageUI = new VillageUI(this.Screen.canList["GameUI"])
    }

    this.loadImg = () => {
        for (var z in IMG_TO_LOAD) {
            var name = IMG_TO_LOAD[z][1]
            var src = IMG_TO_LOAD[z][0]
            this.Imgs[name] = new myImage(name, "./img/" + src + "/" + name + ".png")
        }
    }

    this.init = () => {
        this.Controler = new ControlManager()

        new PlayersManager().loadPlayerDefaultImgs()    // -> world.playerDefaultImgs = players.playerDefaultImgs
        this.Imgs = {...world.playerDefaultImgs}
        this.loadImg()
        //this.GameUI = new GameUI(this.Screen.canList["GameUI"])
        this.initVillage()
    }


    /*
    this.CreateBattleMap = (input) => {
        var x = input.x ? input.x : 10
        this.map = new BattleMap(x, 20)
        this.map.initImgs()
        this.map.generateMap()

        this.players = new PlayersManager()
        this.players.loadPlayerDefaultImgs()
        this.players.canvasPUI = this.Screen.canList["mapUI"]
        this.players.canvasPlayer = this.Screen.canList["players"]

        TEAM_HUMAN_COLOR = {
            r : Math.floor(Math.random() * 256),
            g : Math.floor(Math.random() * 256),
            b : Math.floor(Math.random() * 256),
        }
        TEAM_AI_COLOR = {
            r : 255 - TEAM_HUMAN_COLOR.r,
            g : 255 - TEAM_HUMAN_COLOR.g,
            b : 255 - TEAM_HUMAN_COLOR.b,
        }

        for (var y = 6; y < 15; y += 2) {
            this.players.createPlayer({x : 4, y : y, size : 1, team : TEAM_HUMAN, color : TEAM_HUMAN_COLOR})
        }
        for (var y = 6; y < 15; y += 2) {
            this.players.createPlayer({x : this.map.width - 5, y : y, size : 1, team : TEAM_AI, color : TEAM_AI_COLOR})
        }
        this.map.generateRandomElement()

    }
    */
    this.create_random_enemy_on_map = (t_factor) => {
        if (!this.map)
            return undefined
        var check = 100
        while (check-- > 1) {
            var x = 1 + Math.floor(this.map.width * (0.5 + 0.5 * Math.random()))
            var y = 1 + Math.floor(this.map.height * Math.random())
            var enemy = this.players.createPlayer({
                x : x,
                y : y,
                size : 1,
                team : TEAM_AI,
                color : TEAM_AI_COLOR
            })
            if (enemy) {
                console.log("creating an enemy in " + [x, y])
                check = 0
            }
        }
        if (!enemy)
            return undefined
        enemy.lifeMax = 20 + t_factor * 4
        enemy.life = enemy.lifeMax
        enemy.stats.Strength = 5 + t_factor
        enemy.stats.Dexterity = 5 + t_factor
        enemy.speed = 80 + t_factor * 1 + Math.floor(Math.random() * 80)
        enemy.ActionPointMax = 50 + Math.floor(Math.random() * 100) + t_factor
        enemy.ActionPoint = enemy.ActionPointMax
        enemy.movePCost = 20 - 15 + Math.floor(Math.random() * 31) - t_factor
        if (enemy.movePCost < 5)
            enemy.movePCost = 5


        //Weapon
        var getWP = undefined
        var rand = Math.floor(Math.random() * 100)
        if (t_factor < 5)
            getWP = undefined
        else if (rand + t_factor * 2 > 80)
            getWP = new Weapon().createRandomWeapon()
        enemy.weapon = getWP

        //Armor
        var getArm = undefined
        var rand = Math.floor(Math.random() * 100)
        if (t_factor < 5)
            getArm = undefined
        else if (rand + t_factor * 2 > 80)
            getArm = new Armor().createRandomArmor()
        enemy.armor = getArm

        enemy.generateCapacity()
        console.log("enemy created succesfully")
        return enemy
    }

    this.CreateBattleMapFromVillagePlayer_test = (players, turn, boss) => {
        
        this.map = new BattleMap(25, 6 + 2 * players.length)
        this.map.initImgs()
        this.map.generateMap()

        this.players = new PlayersManager()
        this.players.loadPlayerDefaultImgs()
        this.players = this.players
        this.players.canvasPUI = this.Screen.canList["mapUI"]
        this.players.canvasPlayer = this.Screen.canList["players"]

        TEAM_AI_COLOR = {
            r : 120,
            g : 120,
            b : 120,
        }

        var y = 3
        for (var z in players) {
            var p = players[z]
            this.players.createPlayerFromVillage({x : 3, y : y, player : p})
            y += 2
        }
        for (var i = 0; i < 100; i++) {
            if (boss) {
                this.create_random_enemy_on_map(turn * 3)
                break
            }
            if (i == 0 || i == 1) {
                this.create_random_enemy_on_map(turn)
                continue
            }
            else if (turn > 5 && i > 90 && Math.floor(Math.random() * (100 + turn)) < turn)
                this.create_random_enemy_on_map(turn)
            else if (turn > 20 && i > 80 && Math.floor(Math.random() * (200 + turn)) < turn)
                this.create_random_enemy_on_map(turn)
            else if (turn > 50 && i > 70 && Math.floor(Math.random() * (400 + turn)) < turn)
                this.create_random_enemy_on_map(turn)
            else if (turn > 100 && i > 50 && Math.floor(Math.random() * (800 + turn)) < turn)
                this.create_random_enemy_on_map(turn)
        }
        this.map.generateRandomElement()
    }

    this.needRedraw = () => {
        if (this.map)
            this.map.needRedraw = true
        if (this.GameUI)    
            this.GameUI.needRedraw = true
        if (this.villageUI)
            this.villageUI.needRedraw = true
    }
}