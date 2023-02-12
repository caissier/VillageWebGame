BLOCK_DEFAULT_FLOOR = 0
MAP_FLOORS = ["rock","sand","sea","weed"]
MAP_BOT_ELEMENT = [
    {
        name : "bush",
        moveCost : 1.5
    },
    {
        name : "stones",
        moveCost : 2
    },
    {
        name : "tree_root",
        moveCost : 3
    }
]
MAP_TOP_ELEMENT = [
    {
        name : "big_tree_0",
        sizex : 3,
        sizey : 3,
        moveCost : false
    },
    {
        name : "big_tree_1",
        sizex : 3,
        sizey : 3,
        moveCost : false
    },
    {
        name : "roof_0",
        sizex : 1,
        sizey : 1,
    },
    {
        name : "wall",
        sizex : 1,
        sizey : 1,
        moveCost : false
    }
]

Block = function (x, y) {
    
    this.x = x
    this.y = y
    this.botElem = undefined
    this.topElem = undefined
    this.player = undefined

    this.getMoveCost = () => {
        var cost = 1
        if (this.botElem) {
            for (var z in MAP_BOT_ELEMENT)
            var elm = MAP_BOT_ELEMENT.find(a => a.name == this.botElem.name)
            if (elm.moveCost == false)
                return false
            if (elm.moveCost)
                cost *= elm.moveCost
        }
        if (this.topElem) {
            var elm = MAP_TOP_ELEMENT.find(a => a.name == this.topElem.name)
            if (elm.moveCost == false)
                return false
            if (elm.moveCost)
                cost *= elm.moveCost
        }
        return cost
    } 
}

BattleMap = function (size_x, size_y) {
    MAP_BLOCK_PIXELSIZE_DEFAULT = 200

    this.width = size_x
    this.height = size_y
    this.posBlockx = size_x / 2
    this.posBlocky = size_y / 2
    this.scale = 1
    this.mapImgsFloor = []

    this.mapBlock = []
    this.mapImgsBot = []
    this.mapImgsTop = []
    this.needRedraw = true
    

    this.centerOnBlock = (block) => {
        var size = 1
        if (block.size)
            size = block.size
        this.posBlockx = block.x + size / 2
        this.posBlocky = block.y + size / 2
        this.needRedraw = true
    }

    this.getZoneAtAbsRangeToPlayer = (data) => {
        if (!data || !data.rangeMin || !data.rangeMax || !data.player)
            return []
        var zone = []
        var p = data.player
        var rmin = data.rangeMin
        var rmax = data.rangeMax
        for (var i = p.x - rmax; i < p.x + p.size + rmax; i++)
            for (var j = p.y - rmax; j < p.y + p.size + rmax; j++)
                if (i <= p.x - rmin || i >= p.x + p.size + rmin - 1 || j <= p.y - rmin || j >= p.y + p.size + rmin - 1)
                    if (this.mapBlock[i] && this.mapBlock[i][j])
                        zone.push(this.mapBlock[i][j])
        return zone
    }

    this.getZoneAdjacentToPlayerByDir = (data) => {
        if (!data || !data.dir || !data.player)
            return []
        var zone = []
        var p = data.player
        if (data.dir == "left" || (data.dir.x == -1 && data.dir.y == 0)) {
            var x = p.x - 1
            for (var y = p.y; y < p.y + p.size; y++)
                if (this.mapBlock[x] && this.mapBlock[x][y])
                    zone.push(this.mapBlock[x][y])
        }
        else if (data.dir == "top" || (data.dir.y == -1 && data.dir.x == 0)) {
            var y = p.y - 1
            for (var x = p.x; x < p.x + p.size; x++)
                if (this.mapBlock[x] && this.mapBlock[x][y])
                    zone.push(this.mapBlock[x][y])
        }
        else if (data.dir == "right" || (data.dir.x == 1 && data.dir.y == 0)) {
            var x = p.x + p.size
            for (var y = p.y; y < p.y + p.size; y++)
                if (this.mapBlock[x] && this.mapBlock[x][y])
                    zone.push(this.mapBlock[x][y])
        }
        else if (data.dir == "bot" || (data.dir.y == 1 && data.dir.x == 0)) {
            var y = p.y + p.size
            for (var x = p.x; x < p.x + p.size; x++)
                if (this.mapBlock[x] && this.mapBlock[x][y])
                    zone.push(this.mapBlock[x][y])
        }
        return (zone)
    }

    this.getZoneAdjacentToPlayer = (data) => {
        if (!data || !data.player)
            return undefined
        var zone = []
        data.dir = "left"
        zone = zone.concat(this.getZoneAdjacentToPlayerByDir(data))
        data.dir = "top"
        zone = zone.concat(this.getZoneAdjacentToPlayerByDir(data))
        data.dir = "right"
        zone = zone.concat(this.getZoneAdjacentToPlayerByDir(data))
        data.dir = "bot"
        zone = zone.concat(this.getZoneAdjacentToPlayerByDir(data))
        return (zone)
    }

    this.CostMovingPlayer = (data) => {
        if (!data || !data.player || !data.dir)
            return false
        var zone = this.getZoneAdjacentToPlayerByDir({dir : data.dir, player : data.player})
        if (!zone || zone.length == 0)
            return false
        var cost = 0;
        
        for (var z in zone) {
            var bc = zone[z].getMoveCost()
            if (bc === false || bc === 0)   
                return false
            cost += bc
        }
        return cost / zone.length
    }

    this.generateMap = () => {
        this.mapBlock = []
        for (var x = 0; x < this.width; x++) {
            this.mapBlock[x] = []
            for (var y = 0; y < this.height; y++) {
                var b = new Block(x, y)
                this.mapBlock[x][y] = b

                //place wall on border
                if (x == 0 || y == 0 || x == this.width - 1 || y == this.height - 1) {
                    b.topElem = {
                        name : "wall",
                        angle : Math.random() * Math.PI * 2
                    }
                    continue
                }
                /*
                var rand = Math.floor(Math.random() * 100)
                if (rand < 5) {
                    var randb = Math.floor(Math.random() * MAP_BOT_ELEMENT.length)
                    b.botElem = {
                        name : MAP_BOT_ELEMENT[randb].name,
                        angle : Math.random() * Math.PI * 2
                    }
                }
                var rand = Math.floor(Math.random() * 100)
                if (rand < 5) {
                    var randb = Math.floor(Math.random() * MAP_TOP_ELEMENT.length)
                    b.topElem = {
                        name : MAP_TOP_ELEMENT[randb].name,
                        angle : Math.random() * Math.PI * 2
                    }
                }
                */
            }
        }
    }

    this.generateRandomElement = () => {
        for (var x = 0; x < this.width; x++) {
            for (var y = 0; y < this.height; y++) {
                var b = this.mapBlock[x][y]
                if (b.player)
                    continue
                var rand = Math.floor(Math.random() * 100)
                if (rand < 10) {
                    var randb = Math.floor(Math.random() * MAP_BOT_ELEMENT.length)
                    b.botElem = {
                        name : MAP_BOT_ELEMENT[randb].name,
                        angle : Math.random() * Math.PI * 2
                    }
                }
                var rand = Math.floor(Math.random() * 100)
                if (rand < 10) {
                    var randb = Math.floor(Math.random() * MAP_TOP_ELEMENT.length)
                    b.topElem = {
                        name : MAP_TOP_ELEMENT[randb].name,
                        angle : Math.random() * Math.PI * 2
                    }
                }
            }
        }
    }

    this.initMapFloorImage = () => {
        var src = "./img/mapFloor/"
        var imgs = MAP_FLOORS
        for (var z in imgs)
            this.mapImgsFloor[imgs[z]] = new myImage(imgs[z], src + imgs[z] + ".png")
    }
    this.initMapBotElement = () => {
        var src = "./img/mapBotElement/"
        var elm = MAP_BOT_ELEMENT
        for (var z in elm) 
            this.mapImgsBot[elm[z].name] = new myImage(elm[z].name, src + elm[z].name + ".png")
    }
    this.initMapTopElement = () => {
        var src = "./img/mapTopElement/"
        var imgs = MAP_TOP_ELEMENT
        for (var z in imgs) 
            this.mapImgsTop[imgs[z].name] = new myImage(imgs[z].name, src + imgs[z].name + ".png")
    }
    this.initImgs = () => {
        this.initMapTopElement()
        this.initMapFloorImage()
        this.initMapBotElement()
    }

    this.changeMapView = (dx, dy, scaleFactor) => {
        this.posBlockx += dx
        this.posBlocky += dy
        this.scale *= scaleFactor
        if (this.scale < 0.1)
            this.scale = 0.1
        if (this.scale > 1)
            this.scale = 1
        this.needRedraw = true
    }
    
    this.set_drawing_map = (canvas) => {     //top left postion, where the map starts (can be outisde the canvas)
        this.pixel_width =  Math.floor(MAP_BLOCK_PIXELSIZE_DEFAULT * this.scale * this.width) // the size in pixel of the map
        this.pixel_height =  Math.floor(MAP_BLOCK_PIXELSIZE_DEFAULT * this.scale * this.height)
        this.blocksize_x = Math.floor(this.pixel_width / this.width)    //the size of a block of the map
        this.blocksize_y = Math.floor(this.pixel_height / this.height)
        this.pos_x = this.posBlockx * this.blocksize_x
        this.pos_y = this.posBlocky * this.blocksize_y
        //this.pos_startx = this.pixel_width / this.pos_x - canvas.width / 2 - pos_x   //where the drawing start on the canavs
        //this.pos_starty = this.pixel_height / this.pos_y - canvas.height / 2 - pos_y
        this.pos_startx = canvas.width / 2 - this.pos_x
        this.pos_starty = canvas.height / 2 - this.pos_y

        this.pixel_startx = this.pos_startx < 0 ? 0 : this.pos_startx   //where the drawing start on the canavs
        this.pixel_starty = this.pos_starty < 0 ? 0 : this.pos_starty
        this.pixel_endx = this.pos_startx + this.pixel_width >= canvas.width ? canvas.width - 1 : this.pos_startx + this.pixel_width  //where the drawing end in the canvas
        this.pixel_endy = this.pos_starty + this.pixel_height >= canvas.height ? canvas.height - 1 : this.pos_starty + this.pixel_height

        this.topleft_block = this.get_block_by_pixel({x : this.pixel_startx, y : this.pixel_starty})   //the first block displayed on the map
        this.botright_block = this.get_block_by_pixel({x : this.pixel_endx, y : this.pixel_endy})      //the last, can be undefined if map outscreen
        if (this.botright_block) {
            if (this.botright_block.x >= this.width)
                this.botright_block.x = this.width - 1
            if (this.botright_block.y >= this.height)
                this.botright_block.y = this.height - 1
        }
        
    }

    this.highlightBlock = (canvas, block, posx, posy, type) => {
        if (type == "move") {
            var startx = Math.floor(posx + 0.05 * this.blocksize_x)
            var starty = Math.floor(posy + 0.05 * this.blocksize_y)
            var endx = Math.floor(posx + 0.95 * this.blocksize_x)
            var endy = Math.floor(posy + 0.95 * this.blocksize_y)
            if (block.getMoveCost() > 1)
                canvas.ctx.fillStyle = '#ff880022'
            else if (!block.getMoveCost() || block.player)
                canvas.ctx.fillStyle = '#ff000055'
            else
                canvas.ctx.fillStyle = '#00af0022'
            canvas.drawFillRect(startx, starty, endx, endy)
            //canvas.ctx.strokeStyle = "#00af00"
            //canvas.drawRect(startx, starty, endx, endy)
            var UI = new MyUI(canvas, startx, starty, 100, this.scale, undefined, undefined, 1)
            UI.addTextZone ("movement factor x" + block.getMoveCost(), 20 * this.scale, 100, "#005500")
            UI.drawUI();
        }
        if (type == "rotate") {
            var startx = Math.floor(posx + 0.05 * this.blocksize_x)
            var starty = Math.floor(posy + 0.05 * this.blocksize_y)
            var endx = Math.floor(posx + 0.95 * this.blocksize_x)
            var endy = Math.floor(posy + 0.95 * this.blocksize_y)
            canvas.ctx.fillStyle = '#ef0bc322'
            canvas.drawFillRect(startx, starty, endx, endy)
        }
    }

    this.draw_map = (canvasFloor, canvasTop) => {    //pos_start is the pixel where you start to draw the map (can be outside the screen) 
        this.needRedraw = false
        world.players.pUI_need_redraw = true
        if (this.topleft_block && this.botright_block) {
            for (var x = this.topleft_block.x; x <= this.botright_block.x; x++) {
                for (var y = this.topleft_block.y; y <= this.botright_block.y; y++) {
                    var pos = this.get_pixel_by_block(x, y)
                    var block = this.mapBlock[x][y]
                    //floor drawing
                    var img = undefined
                    if (!block.floor)
                        img = this.mapImgsFloor["weed"]
                    else
                        img = this.mapImgsFloor[block.floor]
                    if (img && img.ready && pos) {
                        canvasFloor.draw_Image(img.img, pos.x, pos.y, this.blocksize_x + 1, this.blocksize_y + 1)
                    }
                    else
                        this.needRedraw = true
                    //botom element drawing
                    if (block.botElem) {
                        img = this.mapImgsBot[block.botElem.name]
                        var sx = pos.x + this.blocksize_x / 2
                        var sy = pos.y + this.blocksize_y / 2
                        if (img)
                            canvasFloor.drawImageRotate(img.img, sx, sy, this.scale * 2, block.botElem.angle)
                    }
                    //top element drawing
                    if (block.topElem) {
                        img = this.mapImgsTop[block.topElem.name]
                        var sx = pos.x + this.blocksize_x / 2
                        var sy = pos.y + this.blocksize_y / 2
                        if (img)
                            canvasTop.drawImageRotate(img.img, sx, sy, this.scale * 2, block.topElem.angle)
                    }
                    if (world.GameUI.highlightZone && world.GameUI.highlightZone.zone && world.GameUI.highlightZone.zone.find(b => b == block))
                        this.highlightBlock(canvasFloor, block, pos.x, pos.y, world.GameUI.highlightZone.type)
                }
            }
        }

    }
    
    this.get_block_by_pixel = (clic) => {
        if (clic.x < this.pixel_startx || clic.y < this.pixel_starty || clic.x > this.pixel_endx || clic.y > this.pixel_endy
                || this.blocksize_x == 0 || this.blocksize_y == 0)
            return undefined
        var block = {
            x : Math.floor((clic.x - this.pos_startx ) / this.blocksize_x),
            y : Math.floor((clic.y - this.pos_starty ) / this.blocksize_y)
        }
        if (block.x >= this.width && block.x > 0)
            block.x = this.width - 1
        if (block.y >= this.height && block.y > 0)
            block.y = this.height - 1
        return this.mapBlock[block.x][block.y]
    }

    this.get_pixel_by_block = (bx, by) => {
        if (bx < 0 || by < 0 || bx >= this.width || by >= this.height)
            return undefined
        return {
            x : Math.floor(this.pos_startx + this.blocksize_x * bx),
            y : Math.floor(this.pos_starty + this.blocksize_y * by)
        }
    }

    this.get_pixel_by_pos = (x, y) => {
        return {
            x : this.pos_startx + this.blocksize_x * x,
            y : this.pos_starty + this.blocksize_y * y
        }
    }

    this.get_block_at_BlockRange = (x, y, rmin, rmax) => {
        var blist = []
        for (var i = x - rmax; i <= x + rmax; r++) {
            for (var j = y - rmax; j <= y + rmax; r++) {
                var b = this.mapBlock[i][j]
                if (b && distBlock(x, y, b.x, b.y) >= rmin && distBlock(x, y, b.x, b.y) <= rmax)
                    blist.push(b)
            }
        }
        return blist
    }

    this.get_block_at_DistRange = (x, y, rmin, rmax) => {
        var blist = []
        for (var i = Math.floor(x - rmax); i <= Math.round(x + rmax); r++) {
            for (var j = Math.floor(y - rmax); j <= Math.round(y + rmax); r++) {
                var b = this.mapBlock[i][j]
                if (b && dist(x, y, b.x, b.y) >= rmin && Block(x, y, b.x, b.y) <= rmax)
                    blist.push(b)
            }
        }
        return blist
    }
}



