HUMAN_NAME_LIST = ["Lilianna Doyle","Kashton McCarty","Halo Knapp","Boden Archer","Kadence Castaneda","Collin Snow","Alexia Anderson","Jacob Knapp","Linda Castillo","Kai Benjamin","Jianna Wood","Carson Hunter","Khloe Horn","Wilson Gill","Jordan Barker","Kade House","Sariah Cabrera","Cade Patton","Lorelei Alexander","Kingston Howell","Mckenna Leblanc","Braden Lucero","Ila Ellis","Cole Clayton","Saige McBride","Denver Leal","Murphy Nava","Stefan Christian","Anahi Strickland","Keegan Doyle","Annalise Carson","Ares Long","Jade Butler","Ryder Sandoval","Elsie Reynolds","Vincent Dougherty","Alisson Roberson","Shepherd Park","Lia Diaz","Nathan Beltran","Kaydence Xiong","Azrael Ali","Zelda Stevens","Zachary Holloway","Mae Gentry","Magnus Yoder","Emerie Hickman","Jakobe Hardin","Vada Conley","Marvin Herrera","Ximena Zimmerman","Sergio Welch","Amira Escobar","Zachariah Berg","Emmalyn Spence","Cillian Ray","Ruth Stout","Callahan Schmitt","Queen Watson","Greyson Walker","Hazel Crawford","Kevin Wiggins","Capri Glenn","Zaid Terry","Wren Costa","Kenji McLaughlin","Stephanie Bradley","Richard Lee","Scarlett Mays","Jadiel McDonald","Daisy Robinson","Matthew Beil","Itzel Allison","Dennis Parrish","Tiana Daniel","Grady O’Neal","Treasure Quintana","Kelvin Fischer","Maci Alvarado","Andres Sampson","Meilani Olson","Malachi Garza","River Hunter","Archer Baxter","Lara Barnett","Stephen Bartlett","Aubrielle Farmer","Jamison Pace","Giana Hudson","Peter Tate","Skye Ramirez","David Grant","Alaina Bradford","Ander Wise","Mira Acevedo","Dakari Poole","Bonnie Bishop","Paxton Pollard","Marisol Humphrey","Krew Pruitt"]

MessageSystem = function () {
    world.MessageSystem = this
    this.msg = [];

    COLOR_SYSTEM_DEFAULT = "#000000"
    MAX_MESSAGE = 200

    this.addMessage = (input) => {
        if (!input || !input.txt)
            return
        this.msg.unshift({
            type : input.type,
            txt : input.txt
        })
        while (this.msg.length > MAX_MESSAGE)
            this.msg.pop()
    }
    
    this.addMessage({txt : "start message system"})

    this.getMessageSystem = (input) => {
        if (!input || !this.msg || this.msg.length < 1)
            return []
        var page = input.page && input.page < this.msg.length ? input.page : 0  //the id of the message you start
        var lineMax = input.lineMax ? input.lineMax : 10        //number of message displayed
        while (page + lineMax > this.msg.length && lineMax > 0)
            lineMax--
        var res = []
        var i = 0
        while (i < lineMax && this.msg[page + i]) {
            res.push(this.msg[page + i])
            i++
        }
        return res
    }
}

PlayerVillage = function (input) {
    this.name = input.name ? input.name : HUMAN_NAME_LIST[Math.floor(Math.random() * HUMAN_NAME_LIST.length)]
    this.color = input.color ? input.color : {
        r : Math.floor(Math.random() * 256),
        g : Math.floor(Math.random() * 256),
        b : Math.floor(Math.random() * 256),
    }
    this.bodyPartImg = undefined
    this.bodyPartImgReady = false;
    this.face_type = input.face_type ? input.face_type : PLAYER_FACE_IMG[Math.floor(Math.random() * PLAYER_FACE_IMG.length)]
    this.body_type = input.body_type ? input.body_type : PLAYER_BODY_IMG[Math.floor(Math.random() * PLAYER_BODY_IMG.length)]
    this.armor = input.armor ? input.armor : undefined
    this.weapon = input.weapon ? input.weapon : undefined
    this.speed = input.speed ? input.speed : 100
    this.ActionPointMax = input.ActionPointMax ? input.ActionPointMax : 100
    this.lifeMax = input.lifeMax ? input.lifeMax : 100
    this.stats = input.stats
    this.movePCost = input.movePCost ? input.movePCost : PLAYER_DEFAUTL_MOVECOST
    this.size = input.size ? input.size : 1
    this.id = PLAYER_ID++
    this.villageActionPointMax = input.villageActionPointMax ? input.villageActionPointMax : 10
    this.villageActionPoint = this.villageActionPointMax
    this.age = input.age ? input.ago : 0
    this.lvl = input.lvl ? input.lvl : 1
    this.lvlup = input.lvlup ? input.lvlup : 0
    this.lvlupList = []

    this.getLvlUpPerkList = () => {
        var list = []
        var randtype = Math.floor(Math.random() * 100) //select type of buff
        var type = "stats"

        var ListP = [
            {type : "stats", stat : "Strength", value : 1},
            {type : "stats", stat : "Dexterity", value : 1},
            {type : "playerstats", stat : "lifeMax", value : 5},
            {type : "playerstats", stat : "speed", value : 2},
            {type : "playerstats", stat : "movePCost", value : -1},
            {type : "playerstats", stat : "ActionPointMax", value : 4},
            {type : "playerstats", stat : "villageActionPointMax", value : 5},
        ]
        for (var z in ListP) {
            if (Math.floor(Math.random() * 100) < 50)
                list.push(ListP[z])
            if (list.length > 2)
                break
        }
        this.lvlupList = list
        return list
    }

    this.ApplyListPerkUp = (input) => {
        if (!input || !input.type || !this.lvlup)
            return
        if (input.type == "playerstats") {
            this[input.stat] += input.value
        }
        else if (input.type == "stats") {
            this.stats[input.stat] += input.value
        }
        world.village.MessageSystem.addMessage({txt : this.name + "'s " + input.stat + " " + input.value})
        this.lvlupList = []
        this.lvlup--
        this.lvl++
    }

    this.tryLvLup = () => {
        var chanceLvLup = 50 * (1 - this.lvl / 100)
        var rand = Math.floor(Math.random() * 100)
        if (rand < chanceLvLup) {
            this.lvlup++
            world.village.MessageSystem.addMessage({txt : this.name + " can lvl up ++"})
            return true
        }
        return false
    }

    this.getVillageUItext = () => {
        var txt = "" + this.name
        txt += "\n" + "Life Max : " + this.lifeMax
        txt += "\n" + "Action Point : " + this.ActionPointMax
        txt += "\n" + "Speed : " + this.speed
        for (var z in this.stats)
            txt += "\n" + z + " : " + this.stats[z]
        if (this.weapon) {
            txt += "\n" + "Equiped with '" + this.weapon.name + "'"
            txt += "\n" + "weapon : " + [this.weapon.blockTargetingFunction.callback]
        }
        return txt
    }

    this.unequipWeapon = () => {
        if (this.weapon) {
            world.village.addWeaponToVillageInventory({weapon : this.weapon})
            this.weapon = undefined
        }
    }

    this.unequipArmor = () => {
        if (this.armor)
            world.village.addArmorToVillageInventory({armor : this.armor})
        this.armor = undefined
        this.bodyPartImgReady = false
    }

    this.unequipItem = (input) => {
        if (!input || !input.item)
            return
        if (input.item.itemType == "armor")
            this.unequipArmor()
        else if (input.item.itemType == "weapon")
            this.unequipWeapon()
    }

    this.equipWeapon = (input) => {
        if (!input || !input.weapon)
            return
        var wid = -1
        for (var z in world.village.Items)
            if (world.village.Items[z] == input.weapon)
                wid = z
        if (wid == -1)
            return 
        if (this.weapon)
            this.unequipWeapon()
        this.weapon = input.weapon
        world.village.Items.splice(wid, 1)
        if (world.villageUI && world.villageUI.itemSelected == input.weapon)
            world.villageUI.itemSelected = undefined
    }

    this.equipArmor = (input) => {
        if (!input || !input.armor)
            return
        var wid = -1
        for (var z in world.village.Items)
            if (world.village.Items[z] == input.armor)
                wid = z
        if (wid == -1)
            return 
        if (this.armor)
            this.unequipArmor()
        this.armor = input.armor
        world.village.Items.splice(wid, 1)
        if (world.villageUI && world.villageUI.itemSelected == input.armor)
            world.villageUI.itemSelected = undefined
            this.bodyPartImgReady = false
    }

    this.equipItem = (input) => {
        if (!input || !input.item)
            return
        if (input.item.itemType == "armor")
            this.equipArmor()
        else if (input.item.itemType == "weapon")
            this.equipWeapon()
    }

    this.LoadPlayerVillageImage = () => {
        var defaultImg = world.playerDefaultImgs
        if (!this.face_type)
            this.face_type = PLAYER_FACE_IMG[Math.floor(Math.random() * PLAYER_FACE_IMG.length)]
        if (!this.body_type)
            this.body_type = PLAYER_BODY_IMG[Math.floor(Math.random() * PLAYER_BODY_IMG.length)]
        var imgs = []
        imgs.push({name : this.body_type, needColor : true})
        imgs.push({name : this.face_type, needColor : false})
        if (this.armor)
            imgs.push({name : this.armor.name, needColor : false})
        for (var z in imgs)
            if (!defaultImg[imgs[z].name] || !defaultImg[imgs[z].name].ready)
                return console.log("can't with " + imgs[z].name)
        var canvas = document.createElement("canvas")// new OffscreenCanvas(this.img.width, this.img.height)
        canvas.width = PLAYER_DEFAULT_SIZEX
        canvas.height = PLAYER_DEFAULT_SIZEY
        var ctx = canvas.getContext("2d")
        for (var z in imgs) {
            var name = imgs[z].name
            if (!defaultImg[name])
                return console.log("i dont have this image  : " + name)
            var img = undefined
            if (imgs[z].needColor)
                img = defaultImg[name].GetColorImage(0, 255, 0, this.color.r, this.color.g, this.color.b)
            else
                img = defaultImg[name].img
            if (!img || !img.complete)
                return console.log("image incomplet")
            ctx.drawImage(img, 0, 0)
        }
        var img = new Image()
        img.src = canvas.toDataURL()

        this.bodyPartImg = img
        console.log("player " + this.name + " img loaded")
        this.bodyPartImgReady = true;
        return true
    }
    this.LoadPlayerVillageImage()
}

Batiment = function (input) {
    this.name = input.name
    this.player_size = input.player_size ? input.player_size : 0
    this.callback_actionPlayer = input.callback_actionPlayer
    this.players_inside = [];
    this.description = input.description ? input.description : "no description"
    this.blocking_end_turn = input.blocking_end_turn ? input.blocking_end_turn : false
    this.imgIcon = input.imgIcon ? input.imgIcon : undefined
    this.build_progression = input.build_progression ? input.build_progression : undefined
    this.lvl = input.lvl ? input.lvl : undefined
    this.upgrades = input.upgrades ? input.upgrades : []
    this.upgrades_callback = input.upgrades_callback ? input.upgrades_callback : undefined

    this.build = (input) => {
        if (!input || !input.player || !input.player.villageActionPoint)
            return false
        var APspend = this.build_progression < input.player.villageActionPoint ? this.build_progression : input.player.villageActionPoint
        this.build_progression -= APspend
        input.player.villageActionPoint -= APspend
        world.village.MessageSystem.addMessage({type : "building", txt : input.player.name + " is building '" + this.name + "' (+" + APspend + ")"})
        if (this.build_progression < 1) {
            this.build_progression = undefined
            world.village.MessageSystem.addMessage({type : "building", txt : "the construction of '" + this.name + "' is finished"})
        }
        world.Music.playSound("hammer_nails")
        return true
    }

    this.getNextUpgrade = () => {
        if (!this.upgrades || !this.upgrades.length)
            return undefined
        return this.upgrades[0]
    }

    this.checkNextUpgrade = () => {
        if (!this.upgrades || !this.upgrades.length)
            return false
        var up = this.getNextUpgrade()
        if (up.resources) {
            if (!world.village.checkHaveResources(up))
                return console.log("dont have resources")
        }
        console.log("success check next uppgrade")
        return true
    }

    this.TryUpgrade = () => {
        var up = this.getNextUpgrade()
        if (this.checkNextUpgrade()) {
            world.village.MessageSystem.addMessage({txt : this.name + " uppgraded to LvL " + (this.lvl + 1)})
            world.village.removeResource(up)
            if (this.upgrades_callback)
                this.upgrades_callback({bat : this})
            this.upgrades.shift()
            this.lvl++
            
        }
    }
}

HUMAN_DEFAULT_COLOR = [
    {r : 236, g : 223, b : 162},
    {r : 198, g : 146, b : 117},
    {r : 255, g : 198, b : 217},
    {r : 183, g : 117, b : 81},
    {r : 177, g : 73, b : 81},
]

CRAFT_LIST = [
    {
        name : "wood Stick",
        type : "weapon",
        bat : "workshop",
        resources : {wood : 10},
        APcost : 10,
        description : "this weapon sucks, only noobs use it"
    }, 
    {
        name : "Wood Armor",
        type : "armor",
        bat : "workshop",
        resources : {wood : 25},
        APcost : 10,
        description : "better than nothing"
    },
    {
        name : "Stone Axe",
        type : "weapon",
        bat : "workshop",
        resources : {wood : 20, stone : 10},
        APcost : 10,
        description : "cut wood faster in forest"
    },
    {
        name : "Stone Spear",
        type : "weapon",
        bat : "workshop",
        resources : {wood : 50, stone : 5},
        APcost : 10,
        description : "hit the target behind"
    },
    {
        name : "Small Woodbow",
        type : "weapon",
        bat : "fletching station",
        resources : {wood : 100},
        APcost : 10,
        description : "hit them from behind"
    },
]


Village = function (input) {
    this.populationMax = input.nb_houses ? input.nb_houses : 1
    this.resources = input.resources ? input.resources : {
        food : 0,
        wood : 0,
    }
    this.players = input.players ? input.players : []

    this.bats = input.bats ? input.bats : []
    this.batsToBuild = []

    this.week = input.week ? input.week : 0

    this.MessageSystem = new MessageSystem()

    var phaseId = 0
    PHASE_NEWTURN = phaseId++
    PHASE_PLACEPLAYER = phaseId++       //place player to buidling
    PHASE_ACTIONPLAYER = phaseId++      //each building do action according to the player inside
    PHASE_COMBAT = phaseId++            //if combat, generate map and fight
    PHASE_END_TURN = phaseId++          
    this.phase = PHASE_NEWTURN

    this.Items = []
    

    //player will be genrated will a similar color
    this.playerColor = input.playerColor ? input.playerColor : HUMAN_DEFAULT_COLOR[Math.floor(Math.random() * HUMAN_DEFAULT_COLOR.length)]

    this.getDateText = () => {
        var year = Math.floor(this.week / (12 * 4))
        var month = Math.floor(this.week / 4) % 12
        var week = (this.week % 4) + 1
        var txt = "Turn " + this.week
        txt += " : "
        if (year)
            txt += "year " + year
        if (month)
            txt += " month " + month
        txt += " week " + week
        return txt
    }

    this.get_valid_craft_list = () => {
        var res = []
        for (var z in CRAFT_LIST) {
            var c = CRAFT_LIST[z]
            var bat = this.bats.find(a => a.name == c.bat)
            if (!bat || bat.build_progression)  //check if bat is build
                continue
            res.push(c)
        }
        return (res)
    }

    this.get_valid_player_for_craft = (input) => {
        if (!input || !input.craft)
            return []
        var ret = []
        var c = input.craft
        for (var z in this.players) {
            var p = this.players[z]
            var b = this.getBatFromPlayer(p)
            if (!b || b.name != c.bat)
                continue
            if (p.villageActionPoint < c.APcost)
                continue
            for (var i in c.resource) {
                var res = i
                var nb = c.resource[i]
                if (!this.resources.res || this.resources.res < nb)
                    continue
            }
            ret.push(p)
        }
        return ret
    }

    this.TryCraftItem = (input) => {
        console.log("craft item")
        if (!input || !input.craft || !input.player)
            return console.log("bad input")
        var craft = this.get_valid_craft_list()
        var p = input.player
        if (!craft || craft.length < 1)
            return console.log("no crafts list")
        craft = craft.find(a => a == input.craft)
        if (!craft)
            return console.log("invalid craft")
        if (!this.get_valid_player_for_craft({craft : craft}).find(a => a == p))
            return console.log("invalid player")
        for (var z in craft.resources) {
            var res = z
            var nb = craft.resources[z]
            if (this.resources[z] < nb) {
                this.MessageSystem.addMessage({txt : "you don't have enought resource"})
                return false
            }
        }
        if (p.villageActionPoint < craft.APcost) {
            this.MessageSystem.addMessage({txt : p.name + " don't have enought Action Point"})
            return false
        }
        p.villageActionPoint -= craft.APcost
        
        switch (craft.type) {
            case 'weapon':
                this.addWeaponToVillageInventory({weapon : new Weapon().createNewWeapon({name : craft.name})})
                break
            case 'armor':
                this.addArmorToVillageInventory({armor : new Armor().createNewArmor({name : craft.name})})
        }
        switch (craft.bat) {
            case 'workshop':
                world.Music.playSound("saw_workshop")
                break
            case 'Bow workshop':
                world.Music.playSound("saw_workshop")
                break
        }
        this.MessageSystem.addMessage({type : "job", txt : p.name + " crafted a " + craft.name})
        this.MessageSystem.addMessage({txt : "cost : "})
        this.removeResource(craft)
    }

    this.generateBasicPlayer = (input) => {
        if (this.players.length >= this.populationMax)
            return undefined
        var color = {
            r : this.playerColor.r - 5 + Math.floor(Math.random() * 11),
            g : this.playerColor.g - 5 + Math.floor(Math.random() * 11),
            b : this.playerColor.b - 5 + Math.floor(Math.random() * 11)
        }
        var player = new PlayerVillage({
            color : color,
            speed : 100 - 5 + Math.floor(Math.random() * 11),
            stats : {
                Strength : 10 - 5 + Math.floor(Math.random() * 11),
                Dexterity : 10 - 5 + Math.floor(Math.random() * 11)
            },
            movePCost : PLAYER_DEFAUTL_MOVECOST - 2 + Math.floor(Math.random() * 5),
            lifeMax : 100 - 20 + Math.floor(Math.random() * 41),
            weapon : input.weapon ? new Weapon().createNewWeapon({name : input.weapon}) : undefined,
            armor : input.armor ? new Armor().createNewArmor({name : input.armor}) : undefined,
            size : 1,
        })
        this.players.push(player)
    }

    this.getBatFromPlayer = (player) => {
        if (!player)
            return undefined
        for (var z in this.bats) {
            var test = this.bats[z].players_inside.find(p => p == player)
            if (test)
                return this.bats[z]
        }
        return undefined
    }

    this.generateBasicVillage = () => {
        this.populationMax = 5
        this.resources = {
            food : 200,
            wood : 200,
            stone : 200
        }
        for (var i = 0; i < 5; i++) {
            if (i == 0)
                this.generateBasicPlayer({weapon : "Small Woodbow", armor : "Wood Armor"})
            else
                this.generateBasicPlayer({})
        }
            
        this.addDefendVillage()
        this.addForest()
        this.addHouse()
        this.createBatToBuildList()
    }

    this.removePlayerFromBat = (input) => {
        if (!input || !input.player)
            return false
        var p = input.player
        for (var z in this.bats) {
            var b = this.bats[z]
            for (var i in b.players_inside)
                if (b.players_inside[i] == p)
                    b.players_inside.splice(i, 1)
        }
    } 

    this.affectPlayerToBat = (input) => {
        if (!input || !input.player || !input.bat)
            return false
        if (input.bat.players_inside.length >= input.bat.player_size)
            return false
        var p = input.player
        for (var z in this.bats) {
            var b = this.bats[z]
            for (var i in b.players_inside)
                if (b.players_inside[i] == p)
                    b.players_inside.splice(i, 1)
        }
        input.bat.players_inside.push(p)
    }

    this.removeResource = (input) => {
        if (!input || !input.resources)
            return console.log("bad input remove resource")
        var check_get_res = false
        var txt = "you lost :"
        for (var z in input.resources) {
            var res = z
            var nb = input.resources[z]
            if (!(nb > 0))
                continue
            check_get_res = true
            var vilres = this.resources
            if (!vilres[res] || vilres[res] < nb)
                return console.log("not enoguht resources")
            vilres[res] -= nb
            txt += " x" + nb + " " + res
        }
        if (check_get_res)
            this.MessageSystem.addMessage({type : "resource", txt : {...input.resources}})
    }

    this.addResource = (input) => {
        if (!input || !input.resources)
            return false
        var check_get_res = false
        for (var z in input.resources) {
            var res = z
            var nb = input.resources[z]
            if (!(nb > 0))
                continue
            check_get_res = true
            var vilres = this.resources
            if (!vilres[res])
                vilres[res] = 0
            vilres[res] += nb
        }
        if (check_get_res)
            this.MessageSystem.addMessage({type : "resource", txt : {...input.resources}})
    }

    this.addHouse = (input) => {
        function UpgradingHouses (input) {
            console.log("uppgrading houses")
            if (!input || !input.bat)
                return
            var b = input.bat
            var village = world.village
            if (b.lvl == 1) {
                village.populationMax += 5
                village.MessageSystem.addMessage({txt : "Population max + 5 (" + village.populationMax + ")"})
            }
            if (b.lvl == 2) {
                village.populationMax += 10
                village.MessageSystem.addMessage({txt : "Population max + 10 (" + village.populationMax + ")"})
            }
        }
        var b = new Batiment({
            name : "Houses",
            player_size : 0,
            callback_actionPlayer : [],
            description : "increase your max population",
            blocking_end_turn : true,
            imgIcon : "Houses",
            lvl : 1,
            upgrades_callback : UpgradingHouses,
            upgrades : [
                {resources : {
                    wood : 50,
                    stone : 5
                }},
                {resources : {
                    wood : 100,
                    stone : 20
                }},
            ],
            
        })
        this.bats.push(b)
    }

    this.addBowWorkshop = (input) => {
        var b = new Batiment({
            name : input.name,
            player_size : 2,
            callback_actionPlayer : [{
                callback : () => {if (world.villageUI) {world.villageUI.GoToTabName({tab : "craft"})}},
                buto_txt : "go to craft tab",
                description : "craft basic stuff",
                cost : 0
            }],
            description : "the place for craft bow and arrow",
            blocking_end_turn : true,
            imgIcon : "bow_workshop_icon",
            build_progression : input.costAP,
        })
        this.bats.push(b)  
    }

    this.addWorkShop = (input) => {
        var b = new Batiment({
            name : input.name,
            player_size : 2,
            callback_actionPlayer : [{
                callback : () => {if (world.villageUI) {world.villageUI.GoToTabName({tab : "craft"})}},
                buto_txt : "go to craft tab",
                description : "craft basic stuff",
                cost : 0
            }],
            description : "craft stuff here",
            blocking_end_turn : true,
            imgIcon : "workshop_icon",
            build_progression : input.costAP,
        })
        this.bats.push(b)   
    }

    this.addForest = () => {
        function recoltForestResouce(input) {
            if (!input || !input.player || input.cost == undefined || input.cost > input.player.villageActionPoint)
                return
            world.Music.playSound("shaken_bush")
            var food = 10 - 2 + Math.floor(Math.random() * 5)
            var wood = 5 - 4 + Math.floor(Math.random() * 9)
            var stone = 1 + Math.floor(Math.random() * 2)
            var txt = input.player.name + " is recolting resource in the forest for " + input.cost + " AP"
            world.village.MessageSystem.addMessage({type : "job", txt : txt})
            input.player.villageActionPoint -= input.cost
            world.village.addResource({resources : {
                food : food,
                wood : wood,
                stone : stone
            }})
        }

        var b = new Batiment({
            name : "Forest Exploitation",
            player_size : 2,
            callback_actionPlayer : [{
                callback : recoltForestResouce,
                buto_txt : "get resources",
                description : "recolte random amount of food, wood, and stone",
                cost : 5
            }],
            description : "Exploit resource from the forest",
            blocking_end_turn : true,
            imgIcon : "forest_icon"
        })
        this.bats.push(b)
    }

    this.addDefendVillage = () => {
        var b = new Batiment({
            name : "Defend Village",
            player_size : 5,
            callback_actionPlayer : [],
            description : "Place your player here for defend the village",
            blocking_end_turn : false,
            imgIcon : "defend_village_icon"
        })
        this.bats.push(b)
    }

    this.createBatToBuildList = () => {
        this.batsToBuild = [
            {
                name : "workshop",
                img : "workshop_icon",
                resources : {wood : 10, stone : 1},
                callback : this.addWorkShop,
                input : {name: "workshop", costAP : 30}
            },
            {
                name : "fletching station",
                img : "bow_workshop_icon",
                resources : {wood : 100, stone : 30},
                callback : this.addBowWorkshop,
                input : {name: "fletching station", costAP : 20}
            }
        ]
    }

    this.checkHaveResources = (input) => {
        if (!input || !input.resources)
            return false
        var r = input.resources
        for (var z in input.resources) {
            var res = z
            var nb = r[z]
            if (!this.resources[res] || this.resources[res] < nb)
                return false
        }
        return true
    }

    this.TryBuildBat = (input) => {
        if (!input || !input.bat)
            return false
        if (!this.checkHaveResources(input.bat))
            return this.MessageSystem.addMessage({txt : "you don't have enought resource"})
        var b = input.bat
        this.MessageSystem.addMessage({type : "building", txt : "the construction of '" + b.name + "' have started"})
        this.removeResource(input.bat)
        b.callback(b.input)
        for (var z in this.batsToBuild)
            if (this.batsToBuild[z] == b)
                this.batsToBuild.splice(z, 1)
    }

    this.addArmorToVillageInventory = (input) => {
        if (!input || !input.armor)
            return
        this.Items.push(input.armor)
    }

    this.addWeaponToVillageInventory = (input) => {
        if (!input || !input.weapon)
            return
        this.Items.push(input.weapon)
    } 

    this.End_Turn = (input) => {
        if (!input)
            return false
        world.villageUI.warningEndTurnMessage = []
        switch(this.phase) {
            case PHASE_NEWTURN : 
                this.phase = PHASE_PLACEPLAYER
                this.MessageSystem.addMessage({txt : "Phase 1 started"})
                for (var z in this.players)
                    this.players[z].villageActionPoint = this.players[z].villageActionPointMax
                if (this.week == 0)
                    world.Music.playSound("the-britons", true)
                break
            case PHASE_PLACEPLAYER :
                if (input.warning) {
                    var warningsMessage = []
                    for (var z in this.players) {
                        p = this.players[z]
                        if (!this.getBatFromPlayer(p))
                            warningsMessage.push({txt : "player " + p.name + " is not affected to a building", player : p, tab : "building"})
                    }
                    defBat = this.bats.find(a => a.name == "Defend Village")
                    if (defBat.players_inside.length < 1)
                        warningsMessage.push({txt : "DANGER : No player is affected to Defend the Village", bat : defBat, tab : "building"})
                    if (warningsMessage.length > 0) {
                        world.villageUI.warningEndTurnMessage = warningsMessage
                        return 
                    }
                }
                this.phase = PHASE_ACTIONPLAYER
                this.MessageSystem.addMessage({txt : "Phase 2 started"})
                break
            case PHASE_ACTIONPLAYER :
                var warningsMessage = []
                if (input.warning) {
                    for (var z in this.bats) {
                        var b = this.bats[z]
                        if (!b.blocking_end_turn)
                            continue
                        for (var i in b.players_inside) {
                            var p = b.players_inside[i]
                            if (p.villageActionPoint > 0)
                                warningsMessage.push({txt : "player " + p.name + " have " + p.villageActionPoint + " Action Points left", player : p, tab : "building"})
                        }
                    }
                }
                if (warningsMessage.length > 0) {
                    world.villageUI.warningEndTurnMessage = warningsMessage
                    return 
                }
                this.phase = PHASE_COMBAT
                if (this.week == 0 || Math.floor(Math.random() * 100) < 33) {
                    this.battle = true
                    this.MessageSystem.addMessage({txt : "Your village is attacked !"})
                }
                break
            case PHASE_COMBAT :
                if (this.battle) {
                    this.test_start_battle()
                }
                else {
                    this.phase = PHASE_NEWTURN 
                    this.week++;
                    var foodconsumed = this.players.length * 2
                    this.MessageSystem.addMessage({txt : "New Turn started : " + this.week})
                    this.MessageSystem.addMessage({txt : "Your population eat food, Miam"})
                    this.removeResource({resources : {food : foodconsumed}})
                    this.foodconsumedLastTurn = foodconsumed
                    for (var z in this.players)
                        this.players[z].tryLvLup();
                }
                break
        }


        
    }

    this.test_start_battle = () => {
        var playersToBattle = []
        for (var z in this.players) {
            var p = this.players[z]
            bat = this.getBatFromPlayer(p)
            if (bat.name == "Defend Village")
                playersToBattle.push(p)
        }
        world.villageUI = undefined
        console.log(playersToBattle.length + " players to the battle")
        world.CreateBattleMapFromVillagePlayer_test(playersToBattle, this.week)
        world.Music.stopSound("the-britons", true)
        world.Music.playSound("where-the-brave-may-live-forever", true)
        world.GameUI = new GameUI(world.Screen.canList["GameUI"])
    }

    this.kill_player = (p) => {
        for (var z in this.players) {
            if (this.players[z].id == p.id) {
                this.players.splice(z, 1)
                this.MessageSystem.addMessage({txt : p.name + "is dead R.I.P"})
            }
        }
        for (var z in this.bats) {
            var b = this.bats[z]
            for (var i in b.players_inside)
                if (b.players_inside[i].id == p.id)
                    b.players_inside.splice(i, 1)
        }
    }

}

