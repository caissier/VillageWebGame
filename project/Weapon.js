PLAYER_WEAPON_IMG = [
    {
        name : "stone_spear",
        center : {x : 161, y : 13},
        sound : "spear_attack"
    },
    {
        name : "metal_sword",
        center : {x : 40, y : 17},
        sound : "attack_metal_slash"
    },
    {
        name : "metal_axe",
        center : {x : 60, y : 64},
        sound : "attack_bigaxe"
    },
    {
        name : "wood_stick",
        center : {x : 22, y : 17},
        sound : "smash"
    },
    {
        name : "stone_axe",
        center : {x : 50, y : 55},
        sound : "smash"
    },
    {
        name : "small_woodBow",
        center : {x : 57, y : 37},
        sound : "bow attack"
    },
]

WEAPON_TYPE = [  
    {   name : "Wood Stick",
        Img : "wood_stick",
        weaponAnim : "sword",
        actionCost : 25,
        blockTargetingFunction :  {
            callback : "getBlockAdjacent",
            input : {}
        },
        zoneTarget : [
            {
                callback : "ReturnBlockTargeted",
                damageBase : [  
                    {
                        stats : "Strength",
                        type : "crushing",
                        value : 1
                    },
                ],
            },
        ]
    },
    {   name : "Stone Spear",
        Img : "stone_spear",
        weaponAnim : "spear",
        actionCost : 40,
        blockTargetingFunction :  {
            callback : "getBlocksAtRangeFromPlayer",
            input : {
                rangeMin : 1,
                rangeMax : 2
            }
        },
        zoneTarget : [
            {
                callback : "ReturnBlockTargeted",
                damageBase : [  
                    {
                        stats : "Strength",
                        type : "piercing",
                        value : 1.5
                    },
                ],
            },
            {
                callback : "getBlockBehindTarget",
                damageBase : [  
                    {
                        stats : "Strength",
                        type : "piercing",
                        value : 0.5
                    },
                ],
            },
        ]
    },
    {   name : "Stone Axe",
        Img : "stone_axe",
        weaponAnim : "sword",
        actionCost : 33,
        blockTargetingFunction :  {
            callback : "getBlocksAtRangeFromPlayer",
            input : {
                rangeMin : 1,
                rangeMax : 1
            }
        },
        zoneTarget : [
            {
                callback : "ReturnBlockTargeted",
                damageBase : [  
                    {
                        stats : "Strength",
                        type : "crushing",
                        value : 1
                    },
                    {
                        stats : "Strength",
                        type : "slashing",
                        value : 1
                    }
                ],
            },
        ]
    },
    {   name : "Metal Sword",
        Img : "metal_sword",
        weaponAnim : "sword",
        actionCost : 40,
        blockTargetingFunction :  {
            callback : "getBlocksAtRangeFromPlayer",
            input : {
                rangeMin : 1,
                rangeMax : 1
            }
        },
        zoneTarget : [
            {
                callback : "ReturnBlockTargeted",
                damageBase : [  
                    {
                        stats : "Strength",
                        type : "piercing",
                        value : 1.5
                    },
                    {
                        stats : "Strength",
                        type : "slashing",
                        value : 1.5
                    }
                ],
            },
        ]
    },
    {   name : "Metal Axe",
        Img : "metal_axe",
        weaponAnim : "sword_2h",
        actionCost : 50,
        blockTargetingFunction :  {
            callback : "getBlocksAtRangeFromPlayer",
            input : {
                rangeMin : 2,
                rangeMax : 2
            }
        },
        zoneTarget : [
            {
                callback : "ReturnBlockTargeted",
                damageBase : [  
                    {
                        stats : "Strength",
                        type : "crushing",
                        value : 2
                    },
                    {
                        stats : "Strength",
                        type : "slashing",
                        value : 2
                    }
                ],
            },
            {
                callback : "getBlocksAtRange",
                callback_data : {
                    rangeMin : 1,
                    rangeMax : 1
                },
                damageBase : [  
                    {
                        stats : "Strength",
                        type : "crushing",
                        value : 0.2
                    },
                    {
                        stats : "Strength",
                        type : "slashing",
                        value : 0.2
                    }
                ],
            },
        ]
    },
    {   name : "Small Woodbow",
        Img : "small_woodBow",
        weaponAnim : "bow",
        projectil : {
            ammo : "wood_arrow",
            projectilSpeed : 100,     //time in ms for move a block distance, its actually 1/speed
            sound : "arrow_projectil"
        },
        actionCost : 50,
        blockTargetingFunction :  {
            callback : "getBlocksAtDistRangeFromPlayer",
            input : {
                rangeMin : 2,
                rangeMax : 4
            }
        },
        zoneTarget : [
            {
                callback : "ReturnBlockTargeted",
                damageBase : [  
                    {
                        stats : "Dexterity",
                        type : "piercing",
                        value : 1
                    },
                ],
            },
        ]
    },
]

Weapon = function () {
    this.itemType = "weapon"
    this.name
    this.weaponAnim
    this.zoneTarget
    this.img
    this.anim
    this.zoneTarget
    this.actionCost
    this.blockTargetingFunction

    this.createNewWeapon = (input) => {
        if (!input || !input.name)
            return console.log("can't create this weapon")
        var wp = WEAPON_TYPE.find(a => a.name == input.name)
        if (!wp)
            return console.log("can't create this weapon")
        var img = PLAYER_WEAPON_IMG.find(a => a.name == wp.Img)
        if (!img)
            return console.log("can't create this weapon")
        this.img = img.name
        this.name = input.name
        this.anim = wp.weaponAnim
        this.zoneTarget = wp.zoneTarget
        this.actionCost = wp.actionCost
        this.blockTargetingFunction = wp.blockTargetingFunction
        this.projectil = wp.projectil

        return this
    }

    this.createRandomWeapon = () => {
        var type = WEAPON_TYPE[Math.floor(Math.random() * WEAPON_TYPE.length)]
        return this.createNewWeapon({name : type.name})
    }

    this.getWeaponAttackDescription = () => {
        var txt = "Attack with " + this.name + " for " + this.actionCost + " action points"
        switch (this.blockTargetingFunction.callback) {
            case "getBlockAdjacent" :
                txt += "\nTarget adjacents blocks"
                break
            case "getBlocksAtRangeFromPlayer" :
                txt += "\nTarget between [" + this.blockTargetingFunction.input.rangeMin + "," + this.blockTargetingFunction.input.rangeMax + "]"
                break
        }
        for (var z in this.zoneTarget) {
            var t = this.zoneTarget[z]
            switch (t.callback) {
                case "ReturnBlockTargeted":
                    txt += "\n-hit the selected block"
                    break
                case "getBlockBehindTarget":
                    var min = t.callback_data ? t.callback_data.rangeMin : 1
                    var max = t.callback_data ? t.callback_data.rangeMax : 1
                    txt += "\n-hit between [" + [min, max] + "] blocks behind the target"
                    break
                case "getBlocksAtRange":
                    var min = t.callback_data ? t.callback_data.rangeMin : 1
                    var max = t.callback_data ? t.callback_data.rangeMax : 1
                    txt += "\n-hit [" + [min, max] + "] distance around the target"
                    break
            }
            for (var i in t.damageBase) {
                var dmg = t.damageBase[i]
                txt += "\n-- x" + dmg.value + " " + dmg.stats + " " + dmg.type + " damage"
            }
        }
        return txt
    }

}

function CalculeDamageWeaponFromPlayerStats (input) {
    if (!input || !input.player || !input.damage)
        return undefined
    var d = input.damage
    var p = input.player
    var dmgList = []
    for (var z in d) 
        dmgList.push({type : d[z].type, value : p.stats[d[z].stats] * d[z].value})


    return dmgList
}