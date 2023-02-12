PLAYER_DEFAULT_SIZEX = 200
PLAYER_DEFAULT_SIZEY = 200
PLAYER_DEFAULT_HAND_SIZE_X = 40
PLAYER_DEFAULT_HAND_SIZE_Y = 40

PLAYER_ANIMATION_DEFAULT = 0
PLAYER_ANIMATION_MOVING = 1
PLAYER_ANIMATION_ATTACK_DEFAULT = 2

PLAYER_DEFAUTL_MOVECOST = 20

TEAM_HUMAN = 0
TEAM_AI = 1

AP_COST_NOWEAPON = 33

PLAYER_NAME_FONT = "Algerian"

Player = function (x, y, size, color, team) {
    this.x = x
    this.y = y
    this.size = size
    this.team = team
    this.AI = team == TEAM_HUMAN ? undefined : {}

    this.color = color
    this.dir = [1, 0]
    this.bodyPartImg = undefined
    this.bodyPartImgReady = false
    this.handImg = undefined
    this.animation = []
    this.movePCost = PLAYER_DEFAUTL_MOVECOST

    this.name = "No Name"
    //Player Stats
    this.speed = 100
    this.gaugeSpeed = 0
    this.ActionPoint = 0
    this.ActionPointMax = 100

    this.lifeMax = 100
    this.life = this.lifeMax
    this.isDead = false

    this.stats = {
        Strength : 10,
        Dexterity : 10
    },


    this.take_damage = (dmg) => {
        if (dmg == undefined || dmg < 0)
            return false
        this.life -= dmg
        world.players.MessageSystem.addMessage({type : this.team, txt : this.name + " lost " + dmg + " life point"})
        if (this.life <= 0) {
            world.players.MessageSystem.addMessage({type : this.team, txt : this.name + " is dead"})
            world.players.delete_player(this)

            if (this == world.GameUI.playersSelected)
                world.GameUI.playersSelected = undefined
            if (this == world.players.Playerturn)
                world.players.Playerturn = undefined
        }
        return true
    }

    this.receive_attack = (attack) => {
        if (!attack || attack.length < 1)
            return false
        
        var dmg = 0;
        for (var z in attack) {
            world.players.MessageSystem.addMessage({type : this.team, txt : this.name + " received damage : " + attack[z].value + " of type " + attack[z].type})
            dmg += attack[z].value
        }
        var damageAfterArmor = this.armor ? this.armor.calculatDamageFromAttack({damages : attack}) : dmg
        
        return this.take_damage(damageAfterArmor)   
    }

    this.generateCapacity = () => {
        this.capacityList = [
            {
                name : "Move To",
                type : "move",
                description : "Move your player up/right/down/left",
                callback : this.TryMoveTo,
                zone_target_area : world.map.getZoneAdjacentToPlayer,
                zone_selecting_input : {
                    player : this,
                    type : "move"
                },
                windowInfo : [
                    {
                        txt : "Movement cost : ",
                        callback : this.GetMovePrice,
                    },
                    {
                        txt : "Direction : ",
                        callback : this.GetMoveDir,
                    }
                ]
            },
            {
                name : "Rotate",
                type : "move",
                description : "rotate your player in the desired direction",
                callback : this.rotate,
                zone_target_area : world.map.getZoneAtAbsRangeToPlayer,
                zone_selecting_input : {
                    player : this,
                    rangeMin : 1,
                    rangeMax : 1,
                    type : "rotate"
                },
                windowInfo : [
                    {
                        txt : "direction : ",
                        callback : this.get_direction_from_pos,
                    }
                ]
            },  
        ]
        if (this.weapon) {
            var c = {
                name : "Attack",
                type : "attack",
                description : "attack animation on the selected block",
                callback : this.attack,
                zone_target_area : this[this.weapon.blockTargetingFunction.callback], 
                zone_selecting_input : this.weapon.blockTargetingFunction.input,
                windowInfo : [
                    {
                        txt : "chance to hit : %",
                        callback : this.getChanceOfHit//getEquipedWeaponDescription,
                    },
                    {
                        txt : "attack with : ",
                        callback : this.getEquipedWeaponDescription,
                    },
                ]
            }
            c.zone_selecting_input.player = this,
            c.zone_selecting_input.type = "rotate" //the color the GUI highlight when selecting a target
            this.capacityList.push(c)
        }
        else {
            var c = {
                name : "Attack",
                type : "attack",
                description : "attack animation on the selected block",
                callback : this.attack,
                zone_target_area : this.getBlockAdjacent, 
                zone_selecting_input : {},
                windowInfo : [
                    {
                        txt : "chance to hit : %",
                        callback : this.getChanceOfHit//getEquipedWeaponDescription,
                    },
                    {
                        txt : "attack with your hands, 33 AP, x1 Strench crushing damage",
                        callback : () => {},
                    }
                ]
            }
            c.zone_selecting_input.player = this,
            c.zone_selecting_input.type = "rotate" //the color the GUI highlight when selecting a target
            this.capacityList.push(c)
        }
    }

    this.getEquipedWeaponDescription = () => {
        if (this.weapon)
            return this.weapon.getWeaponAttackDescription()
    }

    this.ReturnBlockTargeted = (info) => {
        if (!info || !info.block)
            return undefined
        return [info.block]
    }

    this.getBlockAdjacent = () => {
        console.log("get block adjacent")
        var zone = []
        for (var x = this.x - 1; x <= this.x + this.size; x++)
            for (var y = this.y - 1; y <= this.y + this.size; y++)
                if (!((x == this.x - 1 || x == this.x + this.size) && (y == this.y - 1 || y == this.y + this.size))
                    && !(x <= this.x + this.size - 1 && x >= this.x && y <= this.y + this.size - 1 && y >= this.y))
                    if (world.map.mapBlock[x] && world.map.mapBlock[x][y])
                        zone.push(world.map.mapBlock[x][y])
        console.log("returned " + zone.length + " blocks")
        return (zone)
    }

    this.getBlockUnderPlayer = () => {
        var zone = []
        for (var x = this.x; x < this.x + this.size; x++)
            for (var y = this.y; y < this.y + this.size; y++)
                zone.push(world.map.mapBlock[x][y])
    }

    this.getBlockBehindTarget = (input) => {
        if (!input || !input.block)
            return undefined
        var min = 1
        var max = 1
        if (input.data) {
            min = input.data.rangeMin ? input.data.rangeMin : 1
            max = input.data.rangeMax ? input.data.rangeMax : 1
        }
        if (min > max) {
            var tmp = min
            min = max
            max = tmp
        }
        var zone = []
        var b = input.block
        var dir = this.get_direction_from_pos(b)
        var rangeId = -1;
        var x = b.x
        var y = b.y
        var block = world.map.mapBlock
        while (++rangeId <= max) {
            if (rangeId >= min)
                if (block[x] && block[x][y])
                    zone.push(block[x][y])
            x += dir[0]
            y += dir[1]
        }
        return zone
    }

    this.getBlocksAtRange = (input) => {
        if (!input || !input.block)
            return undefined
        var min = 1
        var max = 1
        if (input.data) {
            min = input.data.rangeMin ? input.data.rangeMin : 1
            max = input.data.rangeMax ? input.data.rangeMax : 1
        }
        if (min > max) {
            var tmp = min
            min = max
            max = tmp
        }
        var zone = []
        var b = input.block
        var blocks = world.map.mapBlock
        for (var x = b.x - max; x <= b.x + max; x++) {
            for (var y = b.y - max; y <= b.y + max; y++) {
                var d = dist(b.x, b.y, x, y)
                if (d < min || d > max)
                    continue
                if (blocks[x] && blocks[x][y])
                    zone.push(blocks[x][y])
            }
        }
        return zone
    }

    this.getBlocksAtRangeFromPlayer = (data) => {
        if (!data || !data.rangeMin || !data.rangeMax)
            return []
        var zone = []
        var p = this
        var rmin = data.rangeMin
        var rmax = data.rangeMax
        for (var i = p.x - rmax; i < p.x + p.size + rmax; i++)
            for (var j = p.y - rmax; j < p.y + p.size + rmax; j++)
                if (i <= p.x - rmin || i >= p.x + p.size + rmin - 1 || j <= p.y - rmin || j >= p.y + p.size + rmin - 1)
                    if (world.map.mapBlock[i] && world.map.mapBlock[i][j])
                        zone.push(world.map.mapBlock[i][j])
        return zone
    }

    this.getDistToABlock = (data) => {
        if (!data || !data.block)
            return undefined
        var b = data.block
        if (b.player == this)
            return 0 
        var distx
        if (this.x >= b.x && this.x + this.size <= b.x)
            distx = 0
        else if (this.x < b.x)
            distx = this.x - b.x
        else
            distx = this.x + this.size - b.x - 1
        var disty
        if (this.y >= b.y && this.y + this.size <= b.y)
            disty = 0
        else if (this.x < b.x)
            disty = this.y - b.y
        else
            disty = this.y + this.size - b.y - 1
        console.log("block " + [b.x, b.y] + " dist " + Math.sqrt(distx * distx + disty * disty))
        return Math.sqrt(distx * distx + disty * disty)
    }

    this.getBlocksAtDistRangeFromPlayer = (data) => {
        if (!data || !data.rangeMin || !data.rangeMax)
            return []
        var zone = []
        var p = this
        var px = p.x + p.size / 2 - 0.5
        var py = p.y + p.size / 2 - 0.5
        var rmin = data.rangeMin + p.size / 2 - 0.5
        var rmax = data.rangeMax + p.size / 2 - 0.5
        
        for (var i = Math.round(p.x - rmax); i < Math.round(p.x + p.size + rmax); i++)
            for (var j = Math.round(p.y - rmax); j < Math.round(p.y + p.size + rmax); j++)
                if (world.map.mapBlock[i] && world.map.mapBlock[i][j] && this.getDistToABlock({block : world.map.mapBlock[i][j]}) <= Math.round(rmax) && this.getDistToABlock({block : world.map.mapBlock[i][j]}) >= Math.floor(rmin))
                    zone.push(world.map.mapBlock[i][j])
        return zone
    }

    this.LoadPlayerImage = (defaultImg) => {
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
                return
            var img = undefined
            if (imgs[z].needColor)
                img = defaultImg[name].GetColorImage(0, 255, 0, this.color.r, this.color.g, this.color.b)
            else
                img = defaultImg[name].img
            if (!img || !img.complete)
                return false
            ctx.drawImage(img, 0, 0)
        }
        var img = new Image()
        img.src = canvas.toDataURL()
        img.decode()
        .then(() => {
            console.log("player body img loaded and ready")
            this.bodyPartImgReady = true;
            if (world.villageUI)
                world.villageUI.needRedraw = true
            if (world.GameUI)
                world.GameUI.needRedraw = true

        })
        this.bodyPartImg = img

        if (!defaultImg["hand"] || !defaultImg["hand"].img.complete)
            return false
        var img = defaultImg["hand"].GetColorImage(0, 255, 0, this.color.r, this.color.g, this.color.b)
        if (!img)
            return false
        

        this.handImg = img
        
        return true
    }

    this.get_direction_from_pos = (pos) => {
        if (pos.block)
            pos = pos.block
        var angle = Math.atan2(-(pos.y - this.y - this.size / 2 + 0.5), pos.x - this.x - this.size / 2 + 0.5)
        if (angle > Math.PI * 7 / 8)
            return ([-1, 0])
        if (angle > Math.PI * 5 / 8)
            return ([-1, -1]) 
        if (angle > Math.PI * 3 / 8)
            return ([0, -1])
        if (angle > Math.PI * 1 / 8)
            return ([1, -1])
        if (angle > -Math.PI * 1 / 8)
            return ([1, 0])
        if (angle > -Math.PI * 3 / 8)
            return ([1, 1])
        if (angle > -Math.PI * 5 / 8)
            return ([0, 1])
        if (angle > -Math.PI * 7 / 8)
            return ([-1, 1])
        else if (angle >= -Math.PI)
            return ([-1, 0])
        return [-1, 0]
    }

    this.rotate = (input) => {
        var block = input.block
        if (!block || block.x == undefined || block.y == undefined)
            return false
        var dir = this.get_direction_from_pos(block)
        if (dir)
            this.dir = dir
        else
            return false
        return true
    }

    this.ChangePosition = (dst, map) => {
        //does not check validy, need secure it before use
        for (var i = this.x; i < this.x + this.size; i++)
            for (var j = this.y; j < this.y + this.size; j++)
                map.mapBlock[i][j].player = undefined

        for (var i = dst.x; i < dst.x + this.size; i++) {
            for (var j = dst.y; j < dst.y + this.size; j++) {
                map.mapBlock[i][j].player = this
            }}
        this.x = dst.x
        this.y = dst.y
    }

    this.CheckMoveTo = (info) => {
        if (!info || !info.block || info.block.x == undefined || info.block.y == undefined) {
            console.log("CheckMoveTo : invalid Input")
            return false
        }
        var dst = {
            x : info.block.x,
            y : info.block.y
        }
        var map = world.map
        if (dst.x + this.size - 1 >= map.width || dst.x < 0 || dst.y < 0 || dst.y + this.size - 1 >= map.height){
            console.log("CheckMoveTo : invalid block")
            return false
        }

        //will check block postion relative to the player (in function of his size), and if it's adacent block, change dst to macth with the desired direction

        var dir
        if (dst.x == this.x - 1 && dst.y >= this.y && this.y + this.size > dst.y) { //to the west 
            dst.y = this.y
            dir = "left"
        }
        else if (dst.y == this.y - 1 && dst.x >= this.x && this.x + this.size > dst.x) {   //to the north
            dst.x = this.x
            dir = "top"
        }
        else if (dst.x == this.x + this.size && dst.y >= this.y && this.y + this.size > dst.y) { //o the east 
            dst.y = this.y
            dst.x = this.x + 1
            dir = "right"
        }
        else if (dst.y == this.y + this.size && dst.x >= this.x && this.x + this.size > dst.x) { // to south
            dst.x = this.x
            dst.y = this.y + 1
            dir = "bot"  
        }
        else {
            console.log("wrong direction")
            return false
        }
        for (var i = dst.x; i < dst.x + this.size; i++) {
            for (var j = dst.y; j < dst.y + this.size; j++) {
                if (map.mapBlock[i][j].player && map.mapBlock[i][j].player != this) {
                    console.log("CheckMoveTo : player here")
                    return false
                }
            }
        }
        //normally, the input will have only valid block, the code above is not necessary. map.CostMovingPlayer still need a string with the direction "right/left/top/bot"
        var cost = world.map.CostMovingPlayer({player : this, dir : dir})
        if (cost === false){
            console.log("CheckMoveTo : invalid cost")
            return false
        }
        return ({
            dir : dir,
            cost : Math.floor(cost * this.movePCost)
        })
    }

    this.GetMovePrice = (info) => {
        var check = this.CheckMoveTo(info)
        if (check)
            return check.cost
        return false
    }

    this.GetMoveDir = (info) => {
        var check = this.CheckMoveTo(info)
        if (check)
            return check.dir
        return false
    }

    this.TryMoveTo = (info) => {
        if (!info || !info.block || info.block.x == undefined || info.block.y == undefined)
            return false
 
        var check = this.CheckMoveTo(info)
        if (check === false || check.cost > this.ActionPoint)
            return false

        var dir = undefined
        switch (check.dir) {
            case "right":
                dir = [1, 0]
                break
            case "left" :
                dir = [-1, 0]
                break
            case "top" :
                dir = [0, -1]
                break
            case "bot":
                dir = [0, 1]
                break
            default:
                console.log("wrong direction")
                return false    
        }
        this.ActionPoint -= check.cost
        var anim = {
            type : "moving",
            mode : PLAYER_ANIMATION_MOVING,
            dir : dir,
            from : [this.x, this.y],
            duration : 500,
        }
        this.animation.push(anim)
        this.dir = dir
        var dst = {
            x : this.x + dir[0],
            y : this.y + dir[1]
        }
        this.ChangePosition(dst, world.map)
        
        return true
    }

    this.getChanceOfHit = (info) => {
        if (!info || !info.block)
            return "no block"
        var b = info.block
        if (!b.player|| b.player == this)
            return "no players"
        var targ = b.player
        var enemyAngle = Math.atan2(targ.dir[1], targ.dir[0])
        //enemyAngle = enemyAngle > Math.PI ? enemyAngle - Math.PI : (enemyAngle < - Math.PI ? enemyAngle + MAth.PI : enemyAngle)
        var enemyDirect = Math.atan2(this.y - targ.y, this.x - targ.x)
        //enemyDirect = enemyDirect > Math.PI ? enemyDirect - Math.PI : (enemyDirect < - Math.PI ? enemyDirect + MAth.PI : enemyDirect)
        var angle = (enemyAngle - enemyDirect)
        
        while (angle > Math.PI)
            angle -= 2 * Math.PI
        while (angle < -Math.PI)
            angle += 2 * Math.PI
        angle = Math.abs(angle)

        var res = 40 + (80 - 40) * (angle / Math.PI)
        /*
        if (angle <= Math.PI / 4)
            return 40
        if (angle < 3 * Math.PI / 4)
            return 60
            
        return 80
        */
       return Math.floor(res * 100) / 100
    }

    this.attack = (info) => {
        if (!info || !info.block)
            return false
        var blocktargetAnimation = undefined
        var zonesDamage = []
        if (this.weapon) {
            if (this.ActionPoint < this.weapon.actionCost)
                return false
            //each weapon can hit differents zones with differents damages
            world.players.MessageSystem.addMessage({type : this.team, txt : this.name + " is attacking with " + this.weapon.name})
            for (var z in this.weapon.zoneTarget) {         //for each zone
                var zoneSelector = this.weapon.zoneTarget[z]
                var zoneInfo = {...info}
                zoneInfo.data = zoneSelector.callback_data  
                var zoneSelected = this[zoneSelector.callback](zoneInfo)        //call the function linked to the weapon, return the zone (list of blocks) attacked
                console.log("test zone " + z)
                console.log("selector : " + zoneSelector.callback)
                if (!zoneSelected || zoneSelected.length < 1)
                    continue
                console.log("add some blocks " + zoneSelected.length)
                zonesDamage.push({
                    blocks : zoneSelected,
                    damage : zoneSelector.damageBase
                })
            }
        }
        else {      //if not equiped with a weapon
            if (this.ActionPoint < AP_COST_NOWEAPON)
                return false
            world.players.MessageSystem.addMessage({type : this.team, txt : this.name + " is attacking (no weapon)"})
            zonesDamage = [{
                blocks : [info.block],
                damage : [{
                    stats : "Strength",
                    type : "crushing",
                    value : 1
                }]
            }]
        }

        for (var z in zonesDamage) {  //for each zone of damage
            var zone = zonesDamage[z]
            var dmg = CalculeDamageWeaponFromPlayerStats({player : this, damage : zone.damage})
            var missedAllShot = true
            if (!dmg || dmg.length < 1)
                continue
            for (var i in zone.blocks) {//will apply the damage on each block of the zone
                var b = zone.blocks[i]
                if (!b || !b.player)
                    continue
                
                var chanceHit = this.getChanceOfHit({block : b})
                var testHit = true
                if (Math.floor(Math.random() * 100) > chanceHit)
                    testHit = false
                if (testHit) {
                    missedAllShot = false
                    b.player.receive_attack(dmg)
                }
                else
                    world.players.MessageSystem.addMessage({txt : this.name + " missed attack (" + chanceHit + "%)"})
            }
        }
        var anim = {
            type : "attack",
            mode : PLAYER_ANIMATION_ATTACK_DEFAULT,
            dir : [info.block.x, info.block.y],
            from : [this.x, this.y],
            duration : 500,
        }
        if (this.weapon && this.weapon.projectil) {
            anim.projectil = {
                posA :  {x : this.x + 0.5, y : this.y + 0.5},
                posB : {x : info.block.x + 0.5, y : info.block.y + 0.5},
                projectilName : this.weapon.projectil.ammo ? this.weapon.projectil.ammo : undefined,
                projectilSpeed : this.weapon.projectil.projectilSpeed ? this.weapon.projectil.projectilSpeed : 50,
                sound : this.weapon.projectil.sound && !missedAllShot ? this.weapon.projectil.sound : undefined
            }
        }
        this.animation.push(anim)
        if (this.weapon) {
            var wpSong = PLAYER_WEAPON_IMG.find(a => a.name == this.weapon.img)
            world.Music.playSound(wpSong.sound)
            this.ActionPoint -= this.weapon.actionCost
        }
        else {
            world.Music.playSound("hand hit")
            this.ActionPoint -= AP_COST_NOWEAPON
        }
        
        this.dir = this.get_direction_from_pos(info.block)
        return true
    }

    this.drawPlayer = (canvas, pos_x, pos_y, map) => {
        var now = new Date().getTime()
        while (this.animation && this.animation[0]) {
            if (!this.animation[0].startTime) {
                this.animation[0].startTime = new Date().getTime()
            }
            if (now > this.animation[0].startTime + this.animation[0].duration) {
                if (this.animation[0].projectil)
                    world.players.createProjectilAnimation(this.animation[0].projectil)
                this.animation.shift()
                this.needUIRedraw = true
            }
            else
                break
        }
        if (!this.bodyPartImgReady || !this.bodyPartImg)
            return false


        if (this.weapon) {
            var weaponImg = world.playerDefaultImgs[this.weapon.name]
            var weaponImgcenter = PLAYER_WEAPON_IMG.find(a => a.name == this.weapon.img)
            if (!weaponImg || !weaponImgcenter)
                return console.log("can't display weapon : " + this.weapon.name)
            weaponImgcenter = weaponImgcenter.center
        }

        if (!this.animation || !this.animation[0]) {              //default animation
            var x = Math.floor(pos_x + this.size * map.blocksize_x / 2)
            var y = Math.floor(pos_y + this.size * map.blocksize_y / 2)
            var dirAngle = Math.atan2(this.dir[0], -this.dir[1]) - Math.PI / 2 + getAngleFromTime(-Math.PI / 64, Math.PI / 64, Math.cos(now / 500))
            canvas.drawImageRotate(this.bodyPartImg, x, y, map.scale * this.size, dirAngle)
            var varAngle = getAngleFromTime(-Math.PI / 64, Math.PI / 16, Math.cos(now / 300))
            var handx = Math.floor(100 * map.scale * this.size * Math.cos(varAngle + dirAngle - Math.PI / 2))
            var handy = Math.floor(100 * map.scale * this.size * Math.sin(varAngle + dirAngle - Math.PI / 2))
            var hand2x = Math.floor(100 * map.scale * this.size * Math.cos(-varAngle + dirAngle + Math.PI / 2))
            var hand2y = Math.floor(100 * map.scale * this.size * Math.sin(-varAngle + dirAngle + Math.PI / 2))
            
            canvas.drawImageRotate(this.handImg, x + handx, y + handy, map.scale, varAngle + dirAngle)
            if (this.weapon)
                canvas.drawImageRotateCenter(weaponImg.img, x + hand2x, y + hand2y, weaponImgcenter.x, weaponImgcenter.y, map.scale, -varAngle + dirAngle)
            canvas.drawImageMirrorRotateCenter(this.handImg, x + hand2x, y + hand2y, 20, 20, -map.scale, +varAngle - dirAngle)
        }
        else if (this.animation && this.animation[0] && this.animation[0].mode == PLAYER_ANIMATION_MOVING) {
            var anim = this.animation[0]
            pos = map.get_pixel_by_block(anim.from[0] + anim.dir[0], anim.from[1] + anim.dir[1])
            var x = Math.floor(pos.x + this.size * map.blocksize_x / 2)
            var y = Math.floor(pos.y + this.size * map.blocksize_y / 2)
            world.Music.playSound("move")
            var dir = [this.animation[0].dir[0], this.animation[0].dir[1]]
            var progess = 1 - (now - this.animation[0].startTime) / this.animation[0].duration
            x -= dir[0] * map.blocksize_x * progess
            y -= dir[1] * map.blocksize_y * progess
            var dirAngle = Math.atan2(dir[0], -dir[1]) - Math.PI / 2 + getAngleFromTime(-Math.PI / 32, Math.PI / 32, Math.cos(now / 100))
            canvas.drawImageRotate(this.bodyPartImg, x, y, map.scale * this.size, dirAngle)
            var angle = getAngleFromTime(- Math.PI / 8, Math.PI / 8, Math.cos(now / 100)) + dirAngle
            var angle2 = getAngleFromTime(- Math.PI / 8, Math.PI / 8, Math.sin((now) / 100)) - dirAngle
            var handx = Math.floor(100 * map.scale * this.size * Math.cos(angle - Math.PI / 2))
            var handy = Math.floor(100 * map.scale * this.size * Math.sin(angle - Math.PI / 2))
            var handx2 = Math.floor(100 * map.scale * this.size * Math.cos(angle2 - Math.PI / 2))
            var handy2 = Math.floor(100 * map.scale * this.size * Math.sin(angle2 - Math.PI / 2))
            
            canvas.drawImageRotate(this.handImg, x + handx, y + handy, map.scale, angle)
            //canvas.drawImageRotate(weaponImg.img, x + handx2, y - handy2, map.scale, -angle2)
            if (this.weapon)
                canvas.drawImageRotateCenter(weaponImg.img, x + handx2, y - handy2, weaponImgcenter.x, weaponImgcenter.y, map.scale, -angle2)
            canvas.drawImageMirrorRotateCenter(this.handImg, x + handx2, y - handy2, 20, 20, map.scale, angle2 + Math.PI)
            
        }
        else if (this.animation && this.animation[0] && this.animation[0].mode == PLAYER_ANIMATION_ATTACK_DEFAULT) {
            if (!this.weapon) {
                pos = map.get_pixel_by_block(this.animation[0].from[0], this.animation[0].from[1])
                var x = Math.floor(pos.x + this.size * map.blocksize_x / 2)
                var y = Math.floor(pos.y + this.size * map.blocksize_y / 2)
                var dir = [this.animation[0].dir[0] - (this.x + this.size / 2) + 0.5, this.animation[0].dir[1] - (this.y + this.size / 2) + 0.5]
                var progess = 1 - (now - this.animation[0].startTime) / this.animation[0].duration
                if (progess > 0.5)
                    progess = 1 - progess
                x += dir[0] * map.blocksize_x * progess
                y += dir[1] * map.blocksize_y * progess
                var dirAngle = Math.atan2(dir[0], -dir[1]) - Math.PI / 2 + getAngleFromTime(-Math.PI / 6, Math.PI / 6, Math.cos(now / 100))
                canvas.drawImageRotate(this.bodyPartImg, x, y, map.scale * this.size, dirAngle)
                var angle = getAngleFromTime(Math.PI / 4, Math.PI / 2, Math.cos(now / 100)) + dirAngle
                var angle2 = getAngleFromTime(- Math.PI / 4, Math.PI / 2, Math.sin((now) / 100)) - dirAngle
                var handx = Math.floor(100 * map.scale * this.size * Math.cos(angle - Math.PI / 2))
                var handy = Math.floor(100 * map.scale * this.size * Math.sin(angle - Math.PI / 2))
                var handx2 = Math.floor(100 * map.scale * this.size * Math.cos(angle2 - Math.PI / 2))
                var handy2 = Math.floor(100 * map.scale * this.size * Math.sin(angle2 - Math.PI / 2))
                canvas.drawImageRotate(this.handImg, x + handx, y + handy, map.scale, angle)
                //canvas.drawImageRotate(weaponImg.img, x + handx2, y - handy2, map.scale, -angle2)
                canvas.drawImageMirrorRotateCenter(this.handImg, x + handx2, y - handy2, 20, 20, map.scale, angle2 + Math.PI)
            }            else if (this.weapon.anim == "sword") {
                pos = map.get_pixel_by_block(this.animation[0].from[0], this.animation[0].from[1])
                var x = Math.floor(pos.x + this.size * map.blocksize_x / 2)
                var y = Math.floor(pos.y + this.size * map.blocksize_y / 2)
                var dir = [this.animation[0].dir[0] - (this.x + this.size / 2) + 0.5, this.animation[0].dir[1] - (this.y + this.size / 2) + 0.5]
                var progess = 1 - (now - this.animation[0].startTime) / this.animation[0].duration
                if (progess > 0.5)
                    progess = 1 - progess

                x += dir[0] * map.blocksize_x * progess
                y += dir[1] * map.blocksize_y * progess
                var dirAngle = Math.atan2(dir[0], -dir[1]) - Math.PI / 2 + getAngleFromTime(-Math.PI / 6, Math.PI / 6, Math.cos(now / 100))
                canvas.drawImageRotate(this.bodyPartImg, x, y, map.scale * this.size, dirAngle)
                var angle = getAngleFromTime(Math.PI / 4, Math.PI / 2, Math.cos(now / 100)) + dirAngle
                var angle2 = getAngleFromTime(- Math.PI / 4, Math.PI / 2, Math.sin((now) / 100)) - dirAngle
                var handx = Math.floor(100 * map.scale * this.size * Math.cos(angle - Math.PI / 2))
                var handy = Math.floor(100 * map.scale * this.size * Math.sin(angle - Math.PI / 2))
                var handx2 = Math.floor(100 * map.scale * this.size * Math.cos(angle2 - Math.PI / 2))
                var handy2 = Math.floor(100 * map.scale * this.size * Math.sin(angle2 - Math.PI / 2))
                
                canvas.drawImageRotate(this.handImg, x + handx, y + handy, map.scale, angle)
                //canvas.drawImageRotate(weaponImg.img, x + handx2, y - handy2, map.scale, -angle2)
                if (this.weapon)
                    canvas.drawImageRotateCenter(weaponImg.img, x + handx2, y - handy2, weaponImgcenter.x, weaponImgcenter.y, map.scale, -angle2)
                canvas.drawImageMirrorRotateCenter(this.handImg, x + handx2, y - handy2, 20, 20, map.scale, angle2 + Math.PI)
            }
            else if (this.weapon.anim == "bow") {
                pos = map.get_pixel_by_block(this.animation[0].from[0], this.animation[0].from[1])
                var x = Math.floor(pos.x + this.size * map.blocksize_x / 2)
                var y = Math.floor(pos.y + this.size * map.blocksize_y / 2)
                var dir = [this.animation[0].dir[0] - (this.x + this.size / 2) + 0.5, this.animation[0].dir[1] - (this.y + this.size / 2) + 0.5]
                
                var progess = 1 - (now - this.animation[0].startTime) / this.animation[0].duration
                if (progess > 0.5)
                    progess = 1 - progess

                var dirAngle = Math.atan2(dir[0], -dir[1]) - Math.PI / 2
                canvas.drawImageRotate(this.bodyPartImg, x, y, map.scale * this.size, dirAngle)
                var angle = Math.PI * 7 / 16 + dirAngle
                var angle2 = Math.PI * 7 / 16 - dirAngle
                var handx = Math.floor(100 * (1 - progess) * map.scale * this.size * Math.cos(angle - Math.PI / 2))
                var handy = Math.floor(100 * map.scale * this.size * Math.sin(angle - Math.PI / 2))
                var handx2 = Math.floor(100 * map.scale * this.size * Math.cos(angle2 - Math.PI / 2))
                var handy2 = Math.floor(100 * map.scale * this.size * Math.sin(angle2 - Math.PI / 2))
                
                canvas.drawImageRotate(this.handImg, x + handx, y + handy, map.scale, angle)
                //canvas.drawImageRotate(weaponImg.img, x + handx2, y - handy2, map.scale, -angle2)
                if (this.weapon)
                    canvas.drawImageRotateCenter(weaponImg.img, x + handx2, y - handy2, weaponImgcenter.x, weaponImgcenter.y, map.scale, -angle2)
                canvas.drawImageMirrorRotateCenter(this.handImg, x + handx2, y - handy2, 20, 20, map.scale, angle2 + Math.PI)
            }
            else if (this.weapon.anim == "spear") {
                pos = map.get_pixel_by_block(this.animation[0].from[0], this.animation[0].from[1])
                var x = Math.floor(pos.x + this.size * map.blocksize_x / 2)
                var y = Math.floor(pos.y + this.size * map.blocksize_y / 2)
                var dir = [this.animation[0].dir[0] - (this.x + this.size / 2) + 0.5, this.animation[0].dir[1] - (this.y + this.size / 2) + 0.5]
                var progess = 1 - (now - this.animation[0].startTime) / this.animation[0].duration
                if (progess > 0.5)
                    progess = 1 - progess
                progess = progess / 3
                x += dir[0] * map.blocksize_x * progess
                y += dir[1] * map.blocksize_y * progess
                var dirAngle = Math.atan2(dir[0], -dir[1]) - Math.PI / 2 + getAngleFromTime(-Math.PI / 64, Math.PI / 64, Math.cos(now / 100))
                canvas.drawImageRotate(this.bodyPartImg, x, y, map.scale * this.size, dirAngle)
                var angle = getAngleFromTime(0, Math.PI / 64, Math.cos(now / 100)) + dirAngle
                var angle2 = getAngleFromTime(0, 3 * Math.PI / 8, Math.sin((now - this.animation[0].startTime) / this.animation[0].duration * 1.1 * Math.PI)) - dirAngle
                var handx = Math.floor(100 * map.scale * this.size * Math.cos(angle - Math.PI / 2))
                var handy = Math.floor(100 * map.scale * this.size * Math.sin(angle - Math.PI / 2))
                var handx2 = Math.floor(100 * map.scale * this.size * Math.cos(angle2 - Math.PI / 2))
                var handy2 = Math.floor(100 * map.scale * this.size * Math.sin(angle2 - Math.PI / 2))
                
                canvas.drawImageRotate(this.handImg, x + handx, y + handy, map.scale, angle)
                //canvas.drawImageRotate(weaponImg.img, x + handx2, y - handy2, map.scale, -angle2)
                if (this.weapon)
                    canvas.drawImageRotateCenter(weaponImg.img, x + handx2, y - handy2, weaponImgcenter.x, weaponImgcenter.y, map.scale, dirAngle - Math.PI / 6)
                canvas.drawImageMirrorRotateCenter(this.handImg, x + handx2, y - handy2, 20, 20, map.scale, angle2 + Math.PI)
            }
            else if (this.weapon.anim == "sword_2h") {
                pos = map.get_pixel_by_block(this.animation[0].from[0], this.animation[0].from[1])
                var x = Math.floor(pos.x + this.size * map.blocksize_x / 2)
                var y = Math.floor(pos.y + this.size * map.blocksize_y / 2)
                var dir = [this.animation[0].dir[0] - (this.x + this.size / 2) + 0.5, this.animation[0].dir[1] - (this.y + this.size / 2) + 0.5]
                var progess = 1 - (now - this.animation[0].startTime) / this.animation[0].duration
                if (progess > 0.5)
                    progess = 1 - progess
                progess = progess / 3
                x += dir[0] * map.blocksize_x * progess
                y += dir[1] * map.blocksize_y * progess
                var dirAngle = Math.atan2(dir[0], -dir[1]) - Math.PI / 2 + getAngleFromTime(-Math.PI / 4, Math.PI / 4, Math.cos((now - this.animation[0].startTime) / this.animation[0].duration * 1 * Math.PI))
                canvas.drawImageRotate(this.bodyPartImg, x, y, map.scale * this.size, dirAngle)
                //var angle = getAngleFromTime(Math.PI / 4, Math.PI / 2, Math.cos(now / 100)) + dirAngle
                var angle2 = getAngleFromTime(-Math.PI / 4, Math.PI / 2, -Math.cos((now - this.animation[0].startTime) / this.animation[0].duration * 1 * Math.PI)) - dirAngle
                var angle = angle2 - Math.PI / 32
                var handx = Math.floor(100 * map.scale * this.size * Math.cos(angle - Math.PI / 2))
                var handy = Math.floor(100 * map.scale * this.size * Math.sin(angle - Math.PI / 2))
                var handx2 = Math.floor(100 * map.scale * this.size * Math.cos(angle2 - Math.PI / 2))
                var handy2 = Math.floor(100 * map.scale * this.size * Math.sin(angle2 - Math.PI / 2))
                
                canvas.drawImageMirrorRotateCenter(this.handImg, x + handx, y - handy, 20, 20, map.scale, angle + Math.PI)
                //canvas.drawImageRotate(weaponImg.img, x + handx2, y - handy2, map.scale, -angle2)
                if (this.weapon)
                    canvas.drawImageRotateCenter(weaponImg.img, x + handx2, y - handy2, weaponImgcenter.x, weaponImgcenter.y, map.scale, -angle2)
                canvas.drawImageMirrorRotateCenter(this.handImg, x + handx2, y - handy2, 20, 20, map.scale, angle2 + Math.PI)
            }
        }
    }

    this.get_next_path = (path, dst) => {   //pm the mouvement point 0
        if (!path || !dst || path.length > 200)
            return undefined
        var pos = path[path.length - 1]
        console.log("i am in " + [pos.x, pos.y])
        if (pos.x == dst.x && pos.y == dst.y)
            return path
        var steps = [
            {x : pos.x + 1, y: pos.y},  //right
            {x : pos.x - 1, y : pos.y}, //left
            {x : pos.x, y : pos.y - 1}, //bot
            {x : pos.x, y : pos.y + 1}, //top
        ]
        steps = steps.sort((a, b) => {return dist(a.x, a.y, dst.x, dst.y) - dist(b.x, b.y, dst.x, dst.y) })
        for (var z in steps) {
            var x = steps[z].x
            var y = steps[z].y

            console.log("check next block" + [x, y] + "?")
            var check_old_step = false
            for (var i in path)
                if (path[i].x == x && path[i].y == y)
                    check_old_step = true
            if (check_old_step)
                continue               
            if (!world.map.mapBlock[x] || !world.map.mapBlock[x][y])
                continue
            var b = world.map.mapBlock[x][y]
            if ((b.player && !(dst.x == b.x && dst.y == b.y)) || !b.getMoveCost())
                continue
            console.log("let do it")
            var test = this.get_next_path(path.concat([steps[z]]), dst)
            if (test)
                return test
        }
        console.log("nope, not this way")
        return undefined
    }

    this.playAIturn = () => {
        console.log(this.name + " AI is playing")
        var attack = this.capacityList.find(a => a.name == "Attack")

        var blockTarget = attack.zone_target_area(attack.zone_selecting_input)
        blockTarget = blockTarget.find(a => a.player && a.player.team != this.team)
        if (this.attack({block : blockTarget}))
            return false

        var enemyteam = world.players.playerList.filter(a => a.team != this.team)
        if (!enemyteam || enemyteam.length < 1)
            return true
        var closest_enemy = enemyteam.sort((a, b) => {return dist(this.x, this.y, a.x, a.y) - dist(this.x, this.y, b.x, b.y)})[0]

        if (!this.AI.path || this.AI.path.length < 10 || dist(this.x, this.y, closest_enemy.x, closest_enemy.y) < 5)
            this.AI.path = this.get_next_path([{x : this.x, y : this.y}], closest_enemy)
        var dir = this.AI.path
        if (dir && dir.length > 1)
            dir = dir[1]
        if(this.TryMoveTo({block : world.map.mapBlock[dir.x][dir.y]})) {
            this.AI.path.shift()
            return false
        }

       return true
    }

}









PLAYER_FACE_IMG = ["face_0", "face_1", "face_2"]
PLAYER_BODY_IMG = ["body_0", "body_1", "body_2"]

PROJECTIL_IMG = ["wood_arrow"]

PlayersManager = function (canvasPUI) {
    this.playerList = []
    this.playerDefaultImgs = undefined
    this.DefaultImgsReady = false
    this.Playerturn = undefined
    this.canvasPUI = world.Screen.canList["players"] 
    this.canvasPlayer = world.Screen.canList["players"] 
    this.pUI_need_redraw = true

    this.MessageSystem = new MessageSystem()

    this.projectilAnimation = []

    this.createProjectilAnimation = (input) => {
        if (!input || !input.posA || !input.posB || !input.projectilName || !input.projectilSpeed)
            return;
        var posA = input.posA
        var posB = input.posB
        this.projectilAnimation.push({
            posA : posA,
            posB : posB,
            angle : Math.atan2((posB.y - posA.y), posB.x - posA.x),
            name : input.projectilName,
            duration : input.projectilSpeed ? input.projectilSpeed * dist(posA.x, posA.y, posB.x, posB.y) : 100,
        })
        if (input.sound)
            world.Music.playSound(input.sound)
    }

    this.drawProjectiles = () => {
        var now = new Date().getTime()
        for (var z in this.projectilAnimation) {
            if (this.projectilAnimation[z].startTime && now - this.projectilAnimation[z].startTime > this.projectilAnimation[z].duration)
                this.projectilAnimation.splice(z, 1)
            else if (!this.projectilAnimation[z].startTime)
                this.projectilAnimation[z].startTime = now
        }
        var map = world.map
        var canvas = this.canvasPlayer
        for (var z in this.projectilAnimation) {
            var p = this.projectilAnimation[z]
            var progress = (now - p.startTime) / p.duration
            var progressSizeProjectil = progress > 0.5 ? 1 - progress : progress
            var x = p.posA.x + progress * (p.posB.x - p.posA.x)
            var y = p.posA.y + progress * (p.posB.y - p.posA.y)
            var posPixel = map.get_pixel_by_pos(x, y)
            if (posPixel.x < 0 || posPixel.y < 0 || posPixel.x > canvas.width || posPixel.y > canvas.height)
                continue
            canvas.drawImageRotate(world.playerDefaultImgs[p.name].img, posPixel.x, posPixel.y, map.scale * (0.5 + progressSizeProjectil * 3), p.angle)
            
        }
    }

    this.delete_player = (p) => {
        if (!p)
            return console.log("can't delete this player")
        p.isDead = true
        world.village.kill_player(p)
        if (p && p.x != undefined && p.y != undefined)
            for (var x = p.x; x < p.x + p.size; x++)
                for (var y = p.y; y <  p.y + p.size; y++) 
                    if (world.map.mapBlock[x] && world.map.mapBlock[x][y] && world.map.mapBlock[x][y].player == p)
                        world.map.mapBlock[x][y].player = undefined
        var i = 0;
        while (this.playerList[i]) {
            if (this.playerList[i] == p) {
                this.playerList.splice(i, 1)
                break
            }
            i++
        }
    
    }

    this.loadPlayerDefaultImgs = () => {
        var src = "./img/player_test3/"
        this.playerDefaultImgs = []
        var imgs = [
            ["hand", src + "hand/hand_0.png"],
        ]
        for (var z in WEAPON_TYPE) {
            var name = WEAPON_TYPE[z].name
            var img = WEAPON_TYPE[z].Img
            imgs.push([name, src + "weapon/" + img + ".png"])
            imgs.push([name + "_icon", src + "weapon/" + img + "_icon" + ".png"])
        }
        for (var z in PLAYER_BODY_IMG) {
            var name = PLAYER_BODY_IMG[z]
            imgs.push([name, src + "body/" + name + ".png"])
        }
        for (var z in PLAYER_FACE_IMG) {
            var name = PLAYER_FACE_IMG[z]
            imgs.push([name, src + "face/" + name + ".png"])
        }
        for (var z in PLAYER_ARMOR) {
            var name = PLAYER_ARMOR[z].name
            var img = PLAYER_ARMOR[z].img
            imgs.push([name, src + "armor/" + img + ".png"])
            imgs.push([name + "_icon", src + "armor/" + img + "_icon" + ".png"])
        }
        for (var z in PROJECTIL_IMG) {
            var name = PROJECTIL_IMG[z]
            imgs.push([name, src + "weapon/projectil/" + name + ".png"])
        }
        for (var z in imgs) {
            console.log("imgs : " + imgs[z])
            this.playerDefaultImgs[imgs[z][0]] = new myImage(imgs[z][0], imgs[z][1])
        }
        world.playerDefaultImgs = this.playerDefaultImgs
    }

    this.createNewPlayer = (x, y, size, color, team) => {
        var p = new Player(x, y, size, color, team)
        //p.weapon = new Weapon().createRandomWeapon()
        //p.armor = new Armor().createNewArmor({name : PLAYER_ARMOR_IMG[Math.floor(Math.random() * PLAYER_ARMOR_IMG.length)].name})
        p.ChangePosition(p, world.map)
        p.generateCapacity();
        p.gaugeSpeed = 0
        return p
    }

    this.createPlayerFromVillage = (data) => {
        if (!data || !data.player || data.x == undefined || data.y == undefined)
            return console.log("error input create player")
        console.log("create player in " + [data.x, data.y, data.player.size])
        var p = data.player
        var x = data.x
        var y = data.y

        var team = data.team ? data.team : TEAM_HUMAN

        var map = world.map
        if (x < 0 || x + p.size - 1 >= map.width || y < 0 || y + p.size - 1 >= map.height)
            return false
        for (var i = x; i < x + p.size; i++) {
            for (var j = y; j < y + p.size; j++) {
                if (map.mapBlock[i][j].player)
                    return false
                if (!map.mapBlock[i][j].getMoveCost())
                    return false
            }
        }
        var vp = this.createNewPlayer(x, y, p.size, p.color, team)
        if (!vp)
            return false
        vp.name = p.name 
        vp.face_type = p.face_type
        vp.body_type = p.body_type 
        vp.armor = p.armor 
        vp.weapon = p.weapon 
        vp.speed = p.speed
        vp.ActionPointMax = p.ActionPointMax 
        vp.lifeMax = p.lifeMax
        vp.life = p.lifeMax
        vp.movePCost = p.movePCost
        vp.stats = p.stats
        vp.size = p.size
        vp.id = p.id
        if (team == TEAM_AI)
            vp.dir = [-1, 0]
        for (var i = x; i < x + p.size; i++) {
            for (var j = y; j < y + p.size; j++) {
                map.mapBlock[i][j].player = vp
            }
        }
        vp.generateCapacity();
        this.playerList.push(vp)
        return true
    }

    this.createPlayer = (data) => {
        if (!data || data.x === undefined || data.y === undefined)
            return false
        var x = data.x
        var y = data.y
        var color = data.color ? data.color : {
            r : Math.floor(Math.random() * 256),
            g : Math.floor(Math.random() * 256),
            b : Math.floor(Math.random() * 256),
        }
        var size = data.size || data.size < 1 ? data.size : 1
        var team = data.team ? data.team : TEAM_HUMAN

        var map = world.map
        if (x < 0 || x + size - 1 >= map.width || y < 0 || y + size - 1 >= map.height)
            return false
        for (var i = x; i < x + size; i++) {
            for (var j = y; j < y + size; j++) {
                if (map.mapBlock[i][j].player)
                    return false
                if (!map.mapBlock[i][j].getMoveCost())
                    return false
            }
        }
        var p = this.createNewPlayer(x, y, size, color, team)
        p.id = PLAYER_ID++
        nameList = ["Gruu", "Argoo", "Belek", "Setple", "Azyla", "Fepachie", "Osef", "Okalm", "Aufait", "Askip"]
        p.name = nameList[Math.floor(Math.random() * nameList.length)] + " #" + Math.floor(Math.random() * 100)
        p.weapon = new Weapon().createRandomWeapon()
        p.armor = new Armor().createRandomArmor()
        
        if (team == TEAM_AI)
            p.dir = [-1, 0]
        for (var i = x; i < x + size; i++) {
            for (var j = y; j < y + size; j++) {
                map.mapBlock[i][j].player = p
            }
        }
        p.speed = data.speed ? data.speed : Math.round(p.speed * (0.8 + Math.random() * 0.4))
        p.generateCapacity()
        this.playerList.push(p)
        return p
    }

    this.drawPlayers = () => {
        var map = world.map
        if (!map || !map.topleft_block || !map.botright_block)
            return
        var ax = map.topleft_block.x
        var ay = map.topleft_block.y
        var bx = map.botright_block.x
        var by = map.botright_block.y

        var pUIList = []

        var drawed_player = []
        for (var i = ax; i <= bx; i++) {
            for (var j = ay; j <= by; j++) {
                var p = map.mapBlock[i][j].player
                if (!p || drawed_player.find(z => z == p))
                    continue
                if (p == this.Playerturn)
                    drawed_player.push(p)
                else
                    drawed_player.unshift(p)
            }
        }
        for (var z in drawed_player) {
            var p = drawed_player[z]
            if (!p.bodyPartImg || !p.bodyPartImgReady)
                p.LoadPlayerImage(this.playerDefaultImgs)
            var pos = map.get_pixel_by_block(p.x, p.y)
            if (pos)
                p.drawPlayer(this.canvasPlayer, pos.x, pos.y, map)
            else
                continue
            if (p.needUIRedraw) {
                this.pUI_need_redraw = true
                p.needUIRedraw = false
            }
            var pUI = new MyUI(this.canvasPUI, pos.x - map.blocksize_x / 4, pos.y - map.blocksize_y / 4, 100 * world.map.scale, world.map.scale, undefined, undefined, 1)
            
            var color_name = p.team == TEAM_HUMAN ? "#1e90ff" : "#da1d81"
            pUI.addTextZone(p.name, Math.floor(40 * world.map.scale), 16, color_name, PLAYER_NAME_FONT)
            var letter_sizeUI = Math.floor(20 * world.map.scale)
            if (p == this.Playerturn)
                pUI.addGauge("action point : " + (Math.floor(100 * p.ActionPoint / p.ActionPointMax)), p.ActionPoint / p.ActionPointMax, Math.floor(100 * world.map.scale), letter_sizeUI + 1, letter_sizeUI, "#ffffff", "#00aaaa", "#000000")
            else    
                pUI.addGauge("speed " + Math.floor(100 * p.gaugeSpeed) + " %", p.gaugeSpeed, Math.floor(100 * world.map.scale), letter_sizeUI + 1, letter_sizeUI, "#ffffff", "#00aaaa", "#000000")
            pUI.addGauge("life " + Math.floor(p.life) + "/" + Math.floor(p.lifeMax), p.life / p.lifeMax, Math.floor(100 * world.map.scale), letter_sizeUI + 1, letter_sizeUI, "#ffffff", "#ff0000", "#000000")
            pUIList.push(pUI)
        }
        if (this.pUI_need_redraw) {
            this.canvasPUI.cleanCanvas()
            for (var z in pUIList) {
                pUIList[z].drawUI()
            }
            this.pUI_need_redraw = false
        }
        this.drawProjectiles();
    }

    this.getPlayerByBlock = (block) => {
        if (!block || block.x == undefined || block.y == undefined)
            return undefined
        return this.playerList.find(p => p.x == block.x && p.y == block.y)
    }

    this.get_next_turn = () => {
        var best = undefined
        var gauge_progress = 0
        var gauge_speed = 0
        for (var z in this.playerList) {
            var p = this.playerList[z]
            if ((1 - p.gaugeSpeed) / p.speed <= (1 - gauge_progress) / gauge_speed) {
                if (best && ((1 - p.gaugeSpeed) * p.speed == (1 - gauge_progress) * gauge_speed))
                    if (best.speed > p.speed)
                        continue
                best = p
                gauge_progress = p.gaugeSpeed
                gauge_speed = p.speed
            }
        }
        if (!best)
            return undefined
        for (var z in this.playerList) {
            var p = this.playerList[z]
                p.gaugeSpeed += (1 - gauge_progress) * (p.speed / gauge_speed)
        }
        return best
    }

    this.getNextTurnList = (len) => {
        var list = []
        var players = []
        for (var z in this.playerList) {
            var p = this.playerList[z]
            players[z] = {
                player : p,
                gaugeSpeed : p.gaugeSpeed,
                speed : p.speed
            }
        }
        if (len < 0 || players.length < 1)
            return []
        for (var i = 0; i < len; i++) {
            var best = undefined
            var gauge_progress = 0
            var gauge_speed = 0
            for (var z in players) {
                var p = players[z]
                if ((1 - p.gaugeSpeed) / p.speed <= (1 - gauge_progress) / gauge_speed) {
                    if (best && ((1 - p.gaugeSpeed) * p.speed == (1 - gauge_progress) * gauge_speed))
                        if (best.speed > p.speed)
                            continue
                    best = p
                    gauge_progress = p.gaugeSpeed
                    gauge_speed = p.speed
                }
            }
            if (!best)
                continue
            for (var z in players) {
                var p = players[z]
                    p.gaugeSpeed += (1 - gauge_progress) * (p.speed / gauge_speed)
            }
            best.gaugeSpeed = 0
            list.push(best.player)
        }
        return list
    }

    this.nextTurn = (data) => {

        var test_end = this.playerList.find(p => p.team == TEAM_AI)
        var test_end2 = this.playerList.find(p => p.team == TEAM_HUMAN)
        if (!test_end || !test_end2) {
            console.log("end of the combat")
            this.endFight()
            return
        } 
        if (world.GameUI) {
            world.GameUI.playersSelected = undefined
            world.GameUI.blockSelected = undefined
            world.GameUI.selecting_block = undefined
            world.GameUI.highlightZone = undefined
        }
        if (world.players.Playerturn &&  world.players.Playerturn.AI && !world.players.Playerturn.AI.turnFinished)
            return  //check if AI have finished his turn
        if (this.Playerturn)
            this.Playerturn.gaugeSpeed = 0
        this.Playerturn = this.get_next_turn()
        if (!this.Playerturn)
            return
        this.MessageSystem.addMessage({type : this.Playerturn.team , txt : this.Playerturn.name + " turn have started"})
        if (data.map)
            data.map.centerOnBlock(this.Playerturn)
        if (data.GameUI)
            data.GameUI.playersSelected = this.Playerturn
        this.Playerturn.ActionPoint = this.Playerturn.ActionPointMax
        if (this.Playerturn.AI)
            this.Playerturn.AI.turnFinished = false
    }
    

    this.endFight = () => {
        world.GameUI = undefined
        world.map = undefined
        world.villageUI = new VillageUI(world.Screen.canList["GameUI"])
        world.Screen.canList["mapFloor"].GetCanvasPos()
        world.Screen.canList["mapFloor"].cleanCanvas()
        world.Screen.canList["mapTopElem"].GetCanvasPos()
        world.Screen.canList["mapTopElem"].cleanCanvas()
        world.Screen.canList["players"].GetCanvasPos()
        world.Screen.canList["players"].cleanCanvas()
        world.Screen.canList["mapUI"].GetCanvasPos()
        world.Screen.canList["mapUI"].cleanCanvas()
        world.Music.stopSound("where-the-brave-may-live-forever")
        world.village.battle = false
        world.village.MessageSystem.addMessage({txt : "End of the battle"})
    }
}


