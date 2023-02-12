// dmg : "crushing", "slashing", "piercing"
//type (if factor) -> -%value 
//      else : brute data -value 


PLAYER_ARMOR = [{
    name : "Wood Armor",
    img : "wood_armor",
    dmgArmor : [
        {
            damage : "crushing",
            type : "factor",
            value : 20
        },
        {
            damage : "piercing",
            value : 2
        }
    ]
}]


Armor = function () {
    this.itemType = "armor"
    this.name
    this.img
    this.dmgArmor

    this.createNewArmor = (input) => {
        if (!input || !input.name)
            return undefined
        this.name = input.name
        var ar = PLAYER_ARMOR.find(a => a.name == input.name)
        if (!ar)
            return undefined
        this.img = ar.img ? ar.img : this.name
        this.dmgArmor = ar.dmgArmor

        return this
    }

    this.createRandomArmor = () => {
        return this.createNewArmor({name : PLAYER_ARMOR[Math.floor(Math.random() * PLAYER_ARMOR.length)].name})
    }
    
    this.calculatDamageFromAttack = (input) => {
        if (!input || !input.damages || input.damages.length < 1)
            return 0
        var val = 0
        for (var z in input.damages) {
            
            var dmg = input.damages[z]
            var nb = dmg.value
            console.log("check dmg : " + dmg + " " + nb)
            for (var i in this.dmgArmor) {
                var arm = this.dmgArmor[i]
                console.log("check protect " + [arm.damage, arm.type, dmg.type])
                if (arm.damage == dmg.type) { //"piercing" == "piercing"
                    console.log("reducing " + dmg.type + " by " + arm.value + " if %" + arm.type)
                    if (arm.type)
                        nb = nb * (1 - arm.value / 100)
                    else
                        nb = nb - arm.value
                }
            }
            if (nb > 0)
                val += nb
        }
        console.log("damage after armor reduction : " + val + " (" + Math.floor(val) + ")")
        if (val > 0)
            return Math.floor(val)
        return 0
    }

    this.getArmorDescription = () => {
        var txt = "'" + this.name + "'"
        for (var z in this.dmgArmor) {
            txt += "\n-reduce "
            if (this.dmgArmor[z].type)
                txt += this.dmgArmor[z].value + " % of "
            else
                txt += this.dmgArmor[z].value + " "
            txt += this.dmgArmor[z].damage + " incoming damage"
        }
        return txt
    }

}