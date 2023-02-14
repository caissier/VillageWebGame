
SoundManager = function () {

    this.sounds = []
    this.src = "./music/"

    this.LoadSound = (name) => {
        if (this.sounds[name] && this.sounds[name].readyState)
            return
        var sound = new Audio(this.src + name + ".mp3")
        this.sounds[name] = sound
    }

    this.playSound = (name, loop, Norestart) => {
        if (!this.sounds[name])
            this.LoadSound(name)
        if (!Norestart && !this.sounds[name].paused)
            this.sounds[name].currentTime = 0;
        if (loop)
            this.sounds[name].loop = true
        this.sounds[name].play()
    }

    this.stopSound = (name) => {
        if (this.sounds[name]) {
            this.sounds[name].pause()
            this.sounds[name].currentTime = 0;
        }
    }
}
function isInRect (x, y, rect) {
    if (x === undefined || y === undefined
            || rect.ax === undefined || rect.ay === undefined
            || rect.bx === undefined || rect.by === undefined)
        return (false)
    if (rect.ax > rect.bx) {
        var tmp = rect.ax
        rect.ax = rect.bx
        rect.bx = tmp
    }
    if (rect.ay > rect.by) {
        var tmp = rect.ay
        rect.ay = rect.by
        rect.by = tmp
    }
    if (x > rect.ax && x < rect.bx 
            && y > rect.ay && y < rect.by)
        return (true)
    return (false)
}

function testCB (block) {
    if (!block)
        console.log("error, no block")
    console.log("change block " + block.x + " " + block.y)
    map_test.mapBlock[block.x][block.y] = (map_test.mapBlock[block.x][block.y] + 1) % 4
    scale_changed = true
}

function getAngleFromTime (angleMin, angleMax, t) {
    var angleArc = angleMax - angleMin
    return (angleMin + angleArc / 2 + t * angleArc / 2)
}

function distBlock (ax, ay, bx, by) {
    var dist = Math.abs(ax - bx)
    var dist2 = Math.abs(ay - by)
    if (dist > dist2)
        return dist
    return dist2
}

function dist (ax, ay, bx, by) {
    var dist = Math.sqrt((ax - bx) * (ax - bx) + (ay - by) * (ay - by))
    return dist

}




/*

        var zone = []
        var p = world.players.Playerturn
        var px = p.x + p.size / 2
        var py = p.y + p.size / 2
        var rmin = 2 + p.size / 2
        var rmax = 5 + p.size / 2
        
        for (var i = p.x - Math.round(rmax); i < p.x + p.size + Math.round(rmax); i++)
            for (var j = p.y - Math.round(rmax); j < p.y + p.size + Math.round(rmax); j++)
                if (world.map.mapBlock[i] && world.map.mapBlock[i][j] && p.getDistToABlock({block : world.map.mapBlock[i][j]}) <= Math.round(rmax) && p.getDistToABlock({block : world.map.mapBlock[i][j]}) >= rmin)
                    console.log([i, j, p.getDistToABlock({block : world.map.mapBlock[i][j]})])

*/



var obj = {
    callback : "test"
}
    
World = function() {
    this.txt = "hello world"
    this.test = () => {
        console.log(this.txt)
    }
}
    var world = new World()
    world[obj.callback]()
    
myImage = function (name, src) {
    console.log("creating an image : " + src)
    this.img = new Image(); // Image constructor
    this.ready = false
    this.name = name
    this.img.crossOrigin = 'anonymous'
    this.img.src = src;
    this.img.alt = 'cant load image "' + src + '"';
    this.imgColored = undefined
    this.colorColored = undefined
    //this.img.crossOrigin = 'anonymous';
    this.img.decode()
    .then(() => {
        console.log("img " + name + " is loaded")
        this.ready = true
        this.AlphaTransparencyByPixel(255, 255, 255)


        if (world.villageUI)
            world.villageUI.needRedraw = true
        if (world.GameUI)
            world.GameUI.needRedraw = true

    })
    .catch((encodingError) => {
        console.log("can't load " + this.name)
        console.log(encodingError)
    })

    this.createDatafromImage = () => {
        if (!this.ready)
            return undefined
        const canvas = document.createElement("canvas")// new OffscreenCanvas(this.img.width, this.img.height)
        canvas.width = this.img.width
        canvas.height = this.img.height
        const ctx = canvas.getContext("2d")
        ctx.drawImage(this.img, 0, 0)
        return ctx.getImageData(0, 0, this.img.width, this.img.height)
    }

    this.createImgFromData = (data) => {
        const canvas = document.createElement("canvas")// new OffscreenCanvas(this.img.width, this.img.height)
        canvas.width = data.width
        canvas.height = data.height
        //const canvas = new OffscreenCanvas(data.width, data.height)
        const ctx = canvas.getContext("2d")
        ctx.putImageData(data, 0, 0)
        this.img = new Image()
        this.img.src = canvas.toDataURL()
        this.img.alt = 'failed createImgData image';
        this.img.decode().then(() => {
            if (world.villageUI)
                world.villageUI.needRedraw = true
            if (world.GameUI)
                world.GameUI.needRedraw = true
        })
    }

    this.GetColorImage = (src_r, src_g, src_b, dst_r, dst_g, dst_b) => {
        var imageData = this.createDatafromImage()
        if (!imageData)
            return console.log("can't create getColorImage")
        for(var x = 0; x < imageData.height; x++) {
            for(var y = 0; y < imageData.width; y++) {
                var r = imageData.data[((x*(imageData.width*4)) + (y*4))];
                var g = imageData.data[((x*(imageData.width*4)) + (y*4)) + 1];
                var b = imageData.data[((x*(imageData.width*4)) + (y*4)) + 2];
                var a = imageData.data[((x*(imageData.width*4)) + (y*4)) + 3];
                if (r == src_r && g == src_g && b == src_b) {
                    imageData.data[((x*(imageData.width*4)) + (y*4))] = dst_r
                    imageData.data[((x*(imageData.width*4)) + (y*4)) + 1] = dst_g;
                    imageData.data[((x*(imageData.width*4)) + (y*4)) + 2] = dst_b;
                }
            }
        }
        const canvas = document.createElement("canvas")// new OffscreenCanvas(this.img.width, this.img.height)
        canvas.width = imageData.width
        canvas.height = imageData.height
        //const canvas = new OffscreenCanvas(data.width, data.height)
        const ctx = canvas.getContext("2d")
        ctx.putImageData(imageData, 0, 0)
        var imgColored = new Image()
        imgColored.src = canvas.toDataURL()
        imgColored.alt = 'failed createImgData image Colored';
        
        return imgColored
    }

    this.AlphaTransparencyByPixel = (ra, ga, ba) => {
        var imageData = this.createDatafromImage()
        if (!imageData)
            return undefined
        for(var x = 0; x < imageData.height; x++) {
            for(var y = 0; y < imageData.width; y++) {
                var r = imageData.data[((x*(imageData.width*4)) + (y*4))];
                var g = imageData.data[((x*(imageData.width*4)) + (y*4)) + 1];
                var b = imageData.data[((x*(imageData.width*4)) + (y*4)) + 2];
                var a = imageData.data[((x*(imageData.width*4)) + (y*4)) + 3];
                if (r == ra && g == ga && b == ba) {
                    imageData.data[((x*(imageData.width*4)) + (y*4)) + 3] = 0
                }
            }
        }
        this.createImgFromData(imageData);
    }    
}



createImgFromData = (data) => {
    const canvas = document.createElement("canvas")// new OffscreenCanvas(this.img.width, this.img.height)
    canvas.width = data.width
    canvas.height = data.height
    //const canvas = new OffscreenCanvas(data.width, data.height)
    const ctx = canvas.getContext("2d")
    ctx.putImageData(data, 0, 0)
    var img = new Image()
    img.src = canvas.toDataURL()
    img.alt = 'failed createImgData image'
    return img
}


MyUI = function (canvas, x, y, lenx, scale, background, stroke, marge) {

    MYUI_WINDOWINFO_MOUSETIME = 400
    MYUI_LETTER_SIZE = 20
    MYUI_FONT = "'Footlight MT Light'"

    this.x = x
    this.y = y
    this.canvas = canvas
    this.marge = marge ? marge : 5
    this.lenx = lenx + 2 * this.marge
    this.leny = this.marge
    this.elmList = []
    this.scale = scale
    this.background = background ? background : undefined
    this.stroke = stroke ? stroke : undefined
    this.buttonList = []

    this.InfoWindowPos = false


    this.addTextZone = (txt, letter_size, letter_per_line, text_color, text_font) => {
        this.canvas.ctx.font = "" + letter_size + "px" + text_font
        var txts = []
        while (txt.length > 0) {
            var cutlen = 0
            while (txt[cutlen] == '\n')
                cutlen++
            while (txt[cutlen] != '\n' && cutlen < txt.length && cutlen < letter_per_line)
                cutlen++;
            if (cutlen == letter_per_line)
                while (txt[cutlen] != ' ' && cutlen > 0)
                    cutlen--
            cutlen = cutlen > 0 ? cutlen : letter_per_line
            var line = "" + txt.substring(0, cutlen)
            while (txt[cutlen + 1] == '\n')
                cutlen++
            txt = txt.substring(cutlen)
            txts.push(line)
            var txt_size = this.canvas.ctx.measureText(line)
            if (this.lenx < txt_size.width + 2 * this.marge)
                this.lenx = txt_size.width + 2 * this.marge
            this.leny += (letter_size + this.marge) 
        }
        this.elmList.push({
            type : "text",
            txts : txts,
            letter_size : Math.floor(letter_size),
            txt_color : text_color,
            text_font : text_font
        })
    }

    this.addGauge = (txt, fullness, lenx, leny, letter_size, colorFill, colorStroke, colorText, text_font) => {
        text_font = text_font ? text_font : "Arial"
        this.canvas.ctx.font = "" + letter_size + "px " + text_font
        var txt_size = this.canvas.ctx.measureText(txt)
        if (txt_size > lenx + 2 * this.marge)
            lenx = txt_size + 2 * this.marge
        if (this.lenx < lenx + 2 * this.marge)
            this.lenx = lenx + 2 * this.marge
        if (leny < letter_size + 2 * this.marge)
            leny = letter_size + 2 * this.marge
        this.elmList.push({
            type : "gauge",
            txt : txt,
            fullness : fullness,
            lenx : lenx,
            leny : leny,
            letter_size : letter_size,
            colorFill : colorFill,
            colorStroke : colorStroke,
            colorText : colorText,
            text_font : text_font,
        })
        this.leny += leny + this.marge
    }

    this.addButton = (txt, letter_size, text_color, fillColor, strokeColor, callback, callback_data, text_font, key_event, windowInfo, mouseLight) => {
        this.canvas.ctx.font = "" + letter_size + "px" + text_font
        txt = key_event ? key_event + " - " + txt : txt
        var txt_size = this.canvas.ctx.measureText(txt)
        if (txt_size.width + 4 * this.marge > this.lenx)
            this.lenx = txt_size.width + 4 * this.marge
        this.elmList.push({
            type : "button",
            txt_size : txt_size,
            letter_size : letter_size,
            text_color : text_color,
            fillColor : fillColor,
            strokeColor : strokeColor,
            callback : callback,
            callback_data : callback_data,
            text_font : text_font,
            key_event : key_event,
            txt : txt,
            windowInfo : windowInfo,
            mouseLight : mouseLight
        })
        this.leny += Math.floor(3 * this.marge + letter_size)
    }

    this.addHorizontalElem = (list) => {
        // list  all the elemnt on the verctial
        var elmUI = {
            type : "horizontal",
            list : []
        }
        var max_len_y = 0;
        var len_x = this.marge
        for (var z in list) {
            var e = list[z]
            var elmHoriz = undefined
            switch (e.type) {
                case undefined :
                    continue
                case "txt" :
                    if (!e.txt)
                        continue
                    var txt = e.txt
                    var txts = []
                    var txt_leny = 0
                    var txt_lenx = 0
                    var letter_per_line = e.letter_per_line ? e.letter_per_line : 9999
                    this.canvas.ctx.font = "" + e.letter_size + "px" + e.txt_font
                    while (txt.length > 0) {
                        var cutlen = 0
                        while (txt[cutlen] == '\n')
                            cutlen++
                        while (txt[cutlen] != '\n' && cutlen < txt.length && cutlen < letter_per_line)
                            cutlen++;
                        if (cutlen == letter_per_line)
                            while (txt[cutlen] != ' ' && cutlen > 0)
                                cutlen--
                        cutlen = cutlen > 0 ? cutlen : letter_per_line
                        var line = "" + txt.substring(0, cutlen)
                        while (txt[cutlen + 1] == '\n')
                            cutlen++
                        txt = txt.substring(cutlen)
                        txts.push(line)
                        var txt_size = this.canvas.ctx.measureText(line)
                        if (txt_lenx < txt_size.width + 2 * this.marge)
                            txt_lenx = txt_size.width + 2 * this.marge
                        txt_leny += (e.letter_size + this.marge) 
                    }
                    max_len_y = txt_leny > max_len_y ? txt_leny : max_len_y  
                    elmHoriz = {
                        type : "txt",
                        txts : txts,
                        txt_color : e.txt_color ? e.txt_color : "#000000",
                        max_letters : e.max_letter ? e.max_letter : 9999,
                        letter_size : e.letter_size ? e.letter_size : 20,
                        txt_font : e.txt_font ? e.txt_font : "Arial",
                        txt_size : txt_lenx,
                    }
                    
                    len_x += txt_lenx
                    //
                    //var txt_size = this.canvas.ctx.measureText(elmHoriz.txt).width
                    //elmHoriz.txt_size = txt_size
                    //max_len_y = elmHoriz.letter_size > max_len_y ? elmHoriz.letter_size : max_len_y
                    //len_x += elmHoriz.txt_size + this.marge
                    break
            
                case "img" :
                    if (!e.img)
                        continue
                    elmHoriz = {
                        type : "img",
                        img : e.img,
                        len_x : e.len_x ? e.len_x : 50,
                        len_y : e.len_y ? e.len_y : 50
                    }
                    max_len_y = elmHoriz.len_y > max_len_y ? elmHoriz.len_y : max_len_y
                    len_x += elmHoriz.len_x + this.marge
                    break
                case "button" :
                    if (!e.callback || !e.txt)
                        continue
                    var letter_size = e.letter_size ? e.letter_size : 20
                    var txt_font = e.txt_font? e.txt_font : "Arial"
                    this.canvas.ctx.font = "" + letter_size + "px" + txt_font
                    var txt = e.key_event ? e.key_event + " - " + e.txt : e.txt
                    var txt_size = this.canvas.ctx.measureText(txt)
                    elmHoriz = {
                        type : "button",
                        txt_size : txt_size.width,
                        letter_size : letter_size,
                        txt_color : e.txt_color ? e.txt_color : '#000000',
                        fillColor : e.fillColor ? e.fillColor : "#ffffff",
                        strokeColor : e.strokeColor ? e.strokeColor : '#000000',
                        callback : e.callback,
                        callback_data : e.callback_data,
                        txt_font : txt_font,
                        key_event : e.key_event,
                        txt : txt,
                        windowInfo: e.windowInfo,
                        mouseLight : e.mouseLight
                    }
                    max_len_y = elmHoriz.letter_size + 2 * this.marge > max_len_y ? elmHoriz.letter_size + 2 * this.marge : max_len_y
                    len_x += txt_size.width + this.marge * 3
                    break
            }
            elmUI.list.push(elmHoriz)
        }
        if (this.lenx < len_x)
            this.lenx = len_x
        elmUI.len_y = max_len_y
        this.elmList.push(elmUI)
        this.leny += Math.floor(this.marge + max_len_y)
    }

    this.addImage = (img, lenx, leny) => {
        this.elmList.push({
            type : "img",
            img : img,
            lenx : lenx,
            leny : leny
        })
        if (this.lenx < lenx + 2 * this.marge)
            this.lenx = lenx + 2 * this.marge
        this.leny += Math.floor(this.marge + lenx)
    }

    this.drawUI = () => {
        if (this.background) {
            this.canvas.ctx.fillStyle = this.background
            this.canvas.drawFillRect(this.x, this.y, this.x + this.lenx, this.y + this.leny)
        }
        if (this.stroke) {
            this.canvas.ctx.strokeStyle = this.stroke
            this.canvas.drawRect(this.x, this.y, this.x + this.lenx, this.y + this.leny)
        }
        var py = this.y + this.marge
        for (var z in this.elmList) {
            var zone = this.elmList[z]
            switch (zone.type) {
                case "text": 
                    for (var i in zone.txts) {
                        this.canvas.drawTextTopLeft(zone.txts[i], this.x + this.marge, py, this.lenx, zone.letter_size, zone.txt_color, zone.text_font)
                        py += zone.letter_size + this.marge
                    }
                    break
                case "button":
                    this.canvas.ctx.font = "" + zone.letter_size + "px" + zone.text_font
                    var center_x = Math.floor(this.x + zone.txt_size.width / 2 + 2 * this.marge)
                    var center_y = Math.floor(py + zone.letter_size / 2 + 1 * this.marge)
                    var bRect = {
                        ax : Math.floor(center_x - zone.txt_size.width / 2 - this.marge),
                        ay : Math.floor(center_y - zone.letter_size / 2 - this.marge),
                        bx : Math.floor(center_x + zone.txt_size.width / 2 + this.marge),
                        by : Math.floor(center_y + zone.letter_size / 2 + this.marge),
                    }
                    this.canvas.ctx.fillStyle = zone.fillColor
                    if (zone.mouseLight && isInRect(world.Controler.mousePos.x, world.Controler.mousePos.y, bRect))
                        this.canvas.ctx.fillStyle = zone.fillColor.substring(0, 7) + zone.mouseLight
                    this.canvas.drawFillRect(bRect.ax, bRect.ay, bRect.bx, bRect.by)
                    this.canvas.ctx.strokeStyle = zone.strokeColor
                    this.canvas.drawRect(bRect.ax, bRect.ay, bRect.bx, bRect.by)
                    this.canvas.drawTextCenter(zone.txt, center_x, center_y, 9999, zone.letter_size, zone.text_color, zone.text_font)
                    this.buttonList.push({
                        rect : bRect,
                        callback : zone.callback,
                        callback_data : zone.callback_data,
                        key_event : zone.key_event,
                        windowInfo : zone.windowInfo
                    })
                    py += zone.letter_size + this.marge * 3
                    break;
                case ("img"):
                    this.canvas.draw_Image(zone.img, this.x + this.marge, py + this.marge, zone.lenx, zone.leny)
                    py += zone.leny + this.marge
                    break
                case ("gauge"):
                    this.canvas.ctx.fillStyle = zone.colorFill
                    this.canvas.drawFillRect(this.x + this.marge, py + this.marge, this.x + zone.lenx, py + zone.leny)
                    this.canvas.ctx.fillStyle = zone.colorStroke
                    if (zone.fullness > 0)
                        this.canvas.drawFillRect(this.x + this.marge * 2, py + this.marge * 2, Math.floor(this.x + zone.lenx * zone.fullness - this.marge), py + zone.leny - this.marge)
                    this.canvas.drawTextCenter(zone.txt, this.x + this.marge + zone.lenx / 2, py + this.marge + zone.leny / 2, zone.lenx, zone.letter_size, zone.colorText, zone.text_font)
                    py += zone.leny
                    break
                case ("horizontal"):
                    var horizX = this.marge
                    for (var e in zone.list) {
                        var elmH = zone.list[e]
                        switch (elmH.type) {
                            case "txt": 
                                var ppy = py
                                for (var z in elmH.txts) {
                                    this.canvas.drawTextTopLeft(elmH.txts[z], this.x + horizX, ppy, elmH.txt_size, elmH.letter_size, elmH.txt_color, elmH.txt_font)
                                    ppy += elmH.letter_size + this.marge
                                }
                                horizX += this.marge + elmH.txt_size
                                break
                            case "button":
                                this.canvas.ctx.font = "" + elmH.letter_size + "px" + elmH.txt_font
                                var center_x = Math.floor(this.x + horizX + elmH.txt_size / 2 + this.marge / 2)
                                var center_y = Math.floor(py + elmH.letter_size / 2 + this.marge / 2)
                                var bRect = {
                                    ax : Math.floor(center_x - elmH.txt_size / 2 - this.marge),
                                    ay : Math.floor(center_y - elmH.letter_size / 2 - this.marge),
                                    bx : Math.floor(center_x + elmH.txt_size / 2 + this.marge),
                                    by : Math.floor(center_y + elmH.letter_size / 2 + this.marge),
                                }
                                this.canvas.ctx.fillStyle = elmH.fillColor
                                if (elmH.mouseLight && isInRect(world.Controler.mousePos.x, world.Controler.mousePos.y, bRect))
                                    this.canvas.ctx.fillStyle = elmH.fillColor.substring(0, 7) + elmH.mouseLight
                                this.canvas.drawFillRect(bRect.ax, bRect.ay, bRect.bx, bRect.by)
                                this.canvas.ctx.strokeStyle = elmH.strokeColor
                                this.canvas.drawRect(bRect.ax, bRect.ay, bRect.bx, bRect.by)
                                this.canvas.drawTextCenter(elmH.txt, center_x, center_y, 9999, elmH.letter_size, elmH.txt_color, elmH.txt_font)
                                this.buttonList.push({
                                    rect : bRect,
                                    callback : elmH.callback,
                                    callback_data : elmH.callback_data,
                                    key_event : elmH.key_event,
                                    windowInfo : elmH.windowInfo,
                                    mouseLight : true
                                })
                                horizX += this.marge * 3 + elmH.txt_size
                                break;
                            case ("img"):
                                this.canvas.draw_Image(elmH.img, this.x + horizX, py, elmH.len_x, elmH.len_y)
                                horizX += elmH.len_y + this.marge
                                break
                        } 
                    }
                    py += zone.len_y + this.marge
                    break
            }
        }
        this.CheckInfoWindow()
    }
    this.click_buton_check = (x, y) => {
        for (var z in this.buttonList) {
            var buto = this.buttonList[z]
            if (isInRect(x, y, buto.rect)) {
                buto.callback(buto.callback_data)
                return (true)
            }
        }
        return (false)
    }

    this.mouse_move_check = (x, y) => {
        for (var z in this.buttonList) {
            var buto = this.buttonList[z]
            if (buto.mouseLight && isInRect(x, y, buto.rect)) {
                this.needRedraw = true
                return (true)
            }
        }
        return (false)
    }

    this.key_buton_check = (key) => {
        for (var z in this.buttonList) {
            var buto = this.buttonList[z]
            if (buto.key_event && buto.key_event == key) {
                buto.callback(buto.callback_data)
                return (true)
            }
        }
        return (false)
    }
    this.CheckInfoWindow = (redraw) => {
        if (!world.Controler)
            return false
        var mpos = world.Controler.mousePos
        if (!mpos)
            return
        if (new Date().getTime() - mpos.lastTime < MYUI_WINDOWINFO_MOUSETIME) {
            if (this.InfoWindowPos) {
                this.InfoWindowPos = false
                this.needRedraw = true;
            }
            return false
        }
        if (!this.InfoWindowPos)
            this.InfoWindowPos = {
                x : mpos.x,
                y : mpos.y
            }
        else if (!redraw && mpos.x == this.InfoWindowPos.x && mpos.y == this.InfoWindowPos.y)
            return false

        for (var z in this.buttonList) {
            var b = this.buttonList[z]
            if (b.windowInfo && isInRect(mpos.x, mpos.y, b.rect)) {
                var wUI = new MyUI(this.canvas, mpos.x, mpos.y, 50, 1, this.background, this.stroke, 1)
                wUI.addTextZone("  Info  ", MYUI_LETTER_SIZE, 9999, '#000000', MYUI_FONT)
                for (var i in b.windowInfo) {
                    var e = b.windowInfo[i]
                    if (e.callback)
                        wUI.addTextZone(e.callback(e.input), MYUI_LETTER_SIZE, 9999, '#000000', MYUI_FONT)
                }
                wUI.drawUI()
                return true
            }
        }
        return false
    }

}

UIManager = function () {
    this.UI_list = []

    this.createUI = (canvas, x, y, lenx, scale, background, stroke, marge) => {
        var UI = new MyUI(canvas, x, y, lenx, scale, background, stroke, marge)
        this.UI_list.push(UI)
        return UI
    }

    this.Key_Input = (key) => {
        for (var z in this.UI_list) {
            var UI = this.UI_list[z]
            var check = UI.key_buton_check(key)
            if (check)
                return (true)
        }
        return (false)
    }

    this.Mouse_Input = (x, y) => {
        for (var z in this.UI_list) {
            var UI = this.UI_list[z]
            var check = UI.click_buton_check(x, y)
            if (check)
                return (true)
        }
        return (false)
    }
}
MyCanvas = function(id, layer, info) {
        /*
        create a canvas
        option info : default is screen size, else info.x and info.y
        */
       
        this.width = window.innerWidth
        this.height = window.innerHeight


        if (info) {
            if (info.x && info.y) {
                this.width = info.x
                this.height = info.y
            }
        }
        this.canvas = document.createElement("canvas")
        this.canvas.width = this.width
        this.canvas.height = this.height
        this.id = id
        this.canvas.id = id
        this.canvas.style.zIndex = layer
        this.canvas.style.position = 'absolute';
        this.canvas.style.top = "0px";
        this.canvas.style.left = "0px"
        this.ctx = this.canvas.getContext("2d")
        this.fullScreen = false;
        document.body.appendChild(this.canvas)
        
        this.GetCanvasPos = () => {     //get the positon of the canvas relative to the screen
            var pos = this.canvas.getBoundingClientRect()
            if (pos) {
                this.screenAx = Math.floor(pos.x)
                this.screenAy = Math.floor(pos.y)
                this.screenBx = Math.floor(pos.right - pos.x)
                this.screenBy = Math.floor(pos.bottom - pos.y)
            }
            else
                console.log("can't get can pos")
        }
        this.GetCanvasPos();        //first time you create it, get the pos


        this.getPixelPosition = (x, y) => {     //get the pixel position relative to the canvas
            this.GetCanvasPos()
            if (x < this.screenAx || y < this.screenAy || x > this.screenBx || y > this.screenBy)
                return undefined
            var pos = {
                x : Math.floor(x - this.screenAx),
                y : Math.floor(y - this.screenAy)
            }
            return pos
        }


        // TOOL BOX FOR DRAW

        this.cleanCanvas = () => {
            this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height)
        }

        this.drawFillRect = (startx, starty, endx, endy) => {
            this.ctx.fillRect(startx, starty, endx - startx, endy - starty)
        }
        
        this.drawRect = (startx, starty, endx, endy) => {
            this.ctx.strokeRect(startx, starty, endx - startx, endy - starty)
        }
        
        this.drawLine = (startx, starty, endx, endy) => {
            this.ctx.beginPath();
            this.ctx.moveTo(startx, starty);
            this.ctx.lineTo(endx, endy);
            this.ctx.stroke();
        }
        
        this.draw_Image = (image, x, y, lenx, leny) => {
            x = Math.round(x)
            y = Math.round(y)
            lenx = Math.round(lenx)
            leny = Math.round(leny)
            ctx = this.ctx
            //ctx.setTransform(scale, 0, 0, scale, 0, 0); // sets scale and origin
            ctx.drawImage(image, x, y, lenx, leny);
            //ctx.setTransform(1, 0, 0, 1, 0, 0);
        }

        this.drawImageMirrorRotateCenter = (image, x, y, cx, cy, scale, rotation) => {
            x = Math.round(x)
            y = Math.round(y)
            ctx = this.ctx
            ctx.setTransform(-scale, 0, 0, scale, x, y); // sets scale and origin
            ctx.rotate(rotation);
            ctx.drawImage(image, -cx, -cy);
            ctx.setTransform(1, 0, 0, 1, 0, 0); // restore default transform
        }

        this.drawImageRotateCenter = (image, x, y, cx, cy, scale, rotation) => {
            x = Math.round(x)
            y = Math.round(y)
            ctx = this.ctx
            ctx.setTransform(scale, 0, 0, scale, x, y); // sets scale and origin
            ctx.rotate(rotation);
            ctx.drawImage(image, -cx, -cy);
            ctx.setTransform(1, 0, 0, 1, 0, 0); // restore default transform
        } 

        this.drawImageRotate = (image, x, y, scale, rotation) => {
            x = Math.round(x)
            y = Math.round(y)
            ctx = this.ctx
            ctx.setTransform(scale, 0, 0, scale, x, y); // sets scale and origin
            ctx.rotate(rotation);
            ctx.drawImage(image, -image.width / 2, -image.height / 2);
            ctx.setTransform(1, 0, 0, 1, 0, 0); // restore default transform
        }

        this.drawTextTopLeft = (txt, x, y, lenx, letter_size, txt_color, font) => {
            this.ctx.textAlign = 'left';
            this.ctx.textBaseline = "top"
            this.ctx.fillStyle = txt_color
            var fonttxt = "" + letter_size + "px"
            if (!font)
                font = "serif"
            fonttxt = fonttxt + " " + font
            this.ctx.font = fonttxt
            this.ctx.fillText(txt, x, y, lenx)
        }
        this.drawTextCenter = (txt, x, y, lenx, letter_size, txt_color, font) => {
            this.ctx.textAlign = 'center';
            this.ctx.textBaseline = "middle"
            this.ctx.fillStyle = txt_color
            var fonttxt = "" + letter_size + "px"
            if (!font)
                font = "serif"
            fonttxt = fonttxt + " " + font
            this.ctx.font = fonttxt
            this.ctx.fillText(txt, x, y, lenx)
        }
}

CanvasManager = function() {

    this.canList = []
    this.layerLen = 0

    window.addEventListener('resize', () => {
        for (var z in this.canList) {
            var can = this.canList[z].canvas
            can.width = window.innerWidth
            can.height = window.innerHeight
        }
        console.log("resized")
        world.needRedraw()
    })


    document.addEventListener('fullscreenchange', this.EventcloseFullscreen, false);
    document.addEventListener('mozfullscreenchange', this.EventcloseFullscreen, false);
    document.addEventListener('MSFullscreenChange', this.EventcloseFullscreen, false);
    document.addEventListener('webkitfullscreenchange', this.EventcloseFullscreen, false);

    this.EventcloseFullscreen = () => {
        this.fullScreen = false
        this.closeFullscreen()
    }

    this.addCanvas = (id, layer, info) => {
        for (var z in this.canList)
            if (this.canList[z].id == id)
                return console.log("ERROR : CANVAS WITH THIS NAME ALREADY EXIST")
        var canvas = new MyCanvas(id, layer, info)
        this.canList[id] = canvas
    }

    this.openFullscreen = () => {
        this.fullScreen = true;
        document.documentElement.requestFullscreen()
    }
    this.closeFullscreen = () => {
        if (this.fullScreen && document.fullscreenElement) {
                if (document.exitFullscreen) {
                  document.exitFullscreen();
                } else if (document.webkitExitFullscreen) { /* Safari */
                  document.webkitExitFullscreen();
                } else if (document.msExitFullscreen) { /* IE11 */
                  document.msExitFullscreen();
                }
        }
//            document.exitFullscreen()
        this.fullScreen = false;
    }

}


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




PLAYER_DEFAULT_SIZEX = 200
PLAYER_DEFAULT_SIZEY = 200
PLAYER_DEFAULT_HAND_SIZE_X = 40
PLAYER_DEFAULT_HAND_SIZE_Y = 40

PLAYER_ANIMATION_DEFAULT = 0
PLAYER_ANIMATION_MOVING = 1
PLAYER_ANIMATION_ATTACK_DEFAULT = 2
PLAYER_ANIMATION_DODGE = 3

PLAYER_DEFAUTL_MOVECOST = 20

TEAM_HUMAN = 0
TEAM_AI = 1

AP_COST_NOWEAPON = 33

PLAYER_NAME_FONT = "Algerian"

BONUS_DESCRIPTION = []
var id = 1
BONUS_AXE_FOREST_WOOD = id++
BONUS_DESCRIPTION[BONUS_AXE_FOREST_WOOD] = "get x2 more wood in forest"
BONUS_PICKAXE_MINE = id++
BONUS_DESCRIPTION[BONUS_PICKAXE_MINE] = "get more resources in the mine"

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
                else {
                    world.players.MessageSystem.addMessage({txt : this.name + " missed attack (" + chanceHit + "%)"})
                    var animdodge = {
                        type : "dodge",
                        mode : PLAYER_ANIMATION_DODGE,
                        duration : 1000,
                        angle : Math.random() * 2 * Math.PI,
                    }
                    b.player.animation.push(animdodge)
                }
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
            var progress = 1 - (now - this.animation[0].startTime) / this.animation[0].duration
            x -= dir[0] * map.blocksize_x * progress
            y -= dir[1] * map.blocksize_y * progress
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
        else if (this.animation && this.animation[0] && this.animation[0].mode == PLAYER_ANIMATION_DODGE) {
            var anim = this.animation[0]
            var progress = 1 - (now - anim.startTime) / anim.duration
            progress = progress < 0.5 ? 0 : (progress > 0.75) ? 1 - (progress - 0.5) * 2 : (progress - 0.5) * 2
            var dodgex = progress * Math.cos(anim.angle) * 100 * map.scale * this.size
            var dodgey = progress * Math.sin(anim.angle) * 100 * map.scale * this.size
            var x = dodgex + Math.floor(pos_x + this.size * map.blocksize_x / 2)
            var y = dodgey +Math.floor(pos_y + this.size * map.blocksize_y / 2)
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
        else if (this.animation && this.animation[0] && this.animation[0].mode == PLAYER_ANIMATION_ATTACK_DEFAULT) {
            if (!this.weapon) {
                pos = map.get_pixel_by_block(this.animation[0].from[0], this.animation[0].from[1])
                var x = Math.floor(pos.x + this.size * map.blocksize_x / 2)
                var y = Math.floor(pos.y + this.size * map.blocksize_y / 2)
                var dir = [this.animation[0].dir[0] - (this.x + this.size / 2) + 0.5, this.animation[0].dir[1] - (this.y + this.size / 2) + 0.5]
                var progress = 1 - (now - this.animation[0].startTime) / this.animation[0].duration
                if (progress > 0.5)
                    progress = 1 - progress
                x += dir[0] * map.blocksize_x * progress
                y += dir[1] * map.blocksize_y * progress
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
                var progress = 1 - (now - this.animation[0].startTime) / this.animation[0].duration
                if (progress > 0.5)
                    progress = 1 - progress

                x += dir[0] * map.blocksize_x * progress
                y += dir[1] * map.blocksize_y * progress
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
                
                var progress = 1 - (now - this.animation[0].startTime) / this.animation[0].duration
                if (progress > 0.5)
                    progress = 1 - progress

                var dirAngle = Math.atan2(dir[0], -dir[1]) - Math.PI / 2
                canvas.drawImageRotate(this.bodyPartImg, x, y, map.scale * this.size, dirAngle)
                var angle = Math.PI * 7 / 16 + dirAngle
                var angle2 = Math.PI * 7 / 16 - dirAngle
                var handx = Math.floor(100 * (1 - progress) * map.scale * this.size * Math.cos(angle - Math.PI / 2))
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
                var progress = 1 - (now - this.animation[0].startTime) / this.animation[0].duration
                if (progress > 0.5)
                    progress = 1 - progress
                progress = progress / 3
                x += dir[0] * map.blocksize_x * progress
                y += dir[1] * map.blocksize_y * progress
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
                var progress = 1 - (now - this.animation[0].startTime) / this.animation[0].duration
                if (progress > 0.5)
                    progress = 1 - progress
                progress = progress / 3
                x += dir[0] * map.blocksize_x * progress
                y += dir[1] * map.blocksize_y * progress
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









PLAYER_FACE_IMG = ["face_0", "face_1", "face_2", "face_3", "face_4"]
PLAYER_BODY_IMG = ["body_0", "body_1", "body_2", "body_3", "body_4"]

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



GameUI = function (canvas) {
    GAME_UI_DEFAULTSIZE_X = 200
    GAME_UI_DEFAULTMARGE = 5
    GAME_UI_LETTER_SIZE = 30

    GAME_UI_FONT = "'Footlight MT Light'"
    GAME_UI_FONT_BUTTON = "'Bauhaus 93'"
    GAME_UI_WINDOWINFO_MOUSETIME = 400

    this.canvas = canvas
    this.lenx = GAME_UI_DEFAULTSIZE_X
    this.scale = 1
    this.background = "#ffff66"
    this.stroke = "#663300"
    this.marge = GAME_UI_DEFAULTMARGE
    this.needRedraw = true

    this.fps = undefined

    this.UI = undefined
    this.PlayerInfodisplay = false

    this.UIturn = undefined
    this.UIturnExpanded = false
    
    this.UIevent = undefined
    this.UIeventExpanded = false
    this.eventPageOffset = {value : 0}

    this.playersSelected = undefined
    this.blockSelected = undefined
    this.selecting_block = undefined
    this.highlightZone = undefined
    this.mouseInfoWindow = undefined
    this.InfoWinfowPos = undefined

    this.newGameInput = {
        x : 10,
        y : 10
    }

    this.mouseWasOnMouseLightLastDraw = true
    this.init_check_mouse_move = () => {        //highlight button when mouse move over it
        window.addEventListener('mousemove', (event) => {
            var check = false
            if (this.UIturn && this.UIturn.mouse_move_check(event.clientX, event.clientY) && !this.mouseWasOnMouseLightLastDraw) {
                this.needRedraw = true
                this.mouseWasOnMouseLightLastDraw = true
                check = true
            }
            if (this.UI && this.UI.mouse_move_check(event.clientX, event.clientY) && !this.mouseWasOnMouseLightLastDraw){
                this.needRedraw = true
                this.mouseWasOnMouseLightLastDraw = true
                check = true
            }
            if (this.UIevent && this.UIevent.mouse_move_check(event.clientX, event.clientY) && !this.mouseWasOnMouseLightLastDraw) {
                this.needRedraw = true
                this.mouseWasOnMouseLightLastDraw = true
                check = true
            }
            if (!check && this.mouseWasOnMouseLightLastDraw) {
                this.mouseWasOnMouseLightLastDraw = false
                this.needRedraw = true
            }
            if (this == world.GameUI)
                this.init_check_mouse_move()
        }, {once : true});
    }
    this.init_check_mouse_move()


    this.CheckInfoWindow = (redraw) => {
        if (!world.Controler)
            return false
        var mpos = world.Controler.mousePos
        if (!mpos)
            return false
        if (new Date().getTime() - mpos.lastTime < GAME_UI_WINDOWINFO_MOUSETIME) {
            if (this.InfoWinfowPos) {
                this.InfoWinfowPos = false
                this.needRedraw = true;
            }
            return false
        }

        if (this.UI && this.UI.CheckInfoWindow(redraw))
            return true
        if (this.UIturn && this.UIturn.CheckInfoWindow(redraw))
            return true
        if (this.UIevent && this.UIevent.CheckInfoWindow(redraw))
            return true

        if (!this.mouseInfoWindow)
            return false
        if (!this.InfoWinfowPos)
            this.InfoWinfowPos = {
                x : mpos.x,
                y : mpos.y
            }
        else if (!redraw && mpos.x == this.InfoWinfowPos.x && mpos.y == this.InfoWinfowPos.y)
            return false
        var UI = new MyUI(this.canvas, mpos.x, mpos.y, 50, 1, this.background, this.stroke, 1)
        UI.addTextZone("     Info :", GAME_UI_LETTER_SIZE / 2, 9999, '#000000', GAME_UI_FONT)
        var b = world.map.get_block_by_pixel(mpos)
        for (var z in this.mouseInfoWindow) {
            var e = this.mouseInfoWindow[z]
            UI.addTextZone(e.txt + e.callback({block : b}), GAME_UI_LETTER_SIZE / 2, 9999, '#000000', GAME_UI_FONT)
        }
        UI.drawUI()
    }

    this.getKeyInput = (key) => {
        if (this.UI && this.UI.key_buton_check(key))
            return true
        if (this.UIturn && this.UIturn.key_buton_check(key))
            return true
        if (this.UIevent && this.UIevent.key_buton_check(key))
        if (key == 'ControlLeft' && this.cancel_menu())
            return true
        return false
    }

    this.cancel_menu = () => {
        var test = false
        if (this.PlayerInfodisplay) {
            this.PlayerInfodisplay = false
            return true
        }
        if (this.selecting_block) {
            this.selecting_block = undefined
            test = true
        }
        if (this.highlightZone) {
            this.highlightZone = undefined
            this.mouseInfoWindow = undefined
            this.InfoWinfowPos = undefined
            world.map.needRedraw = true
            test = true
        }
        if (test)
            return test
        test = false           
        if (this.playersSelected) {
            this.playersSelected = undefined
            test = true
        }
        if (this.blockSelected) {
            this.blockSelected = undefined
            test = true
        }
        if (test)
            return true
        return false
    }

    this.getMouseInput = (input) => {
        var x = input.x
        var y = input.y
        if (input.button == 2) { //right click
            var test = this.cancel_menu()
            if (test)
                return true
        }
        else {
            if (this.UI && this.UI.click_buton_check(x, y))
                return true
            if (this.UIturn && this.UIturn.click_buton_check(x, y))
                return true
            if (this.UIevent && this.UIevent.click_buton_check(x, y))
                return true
            if (world.map)
                var b = world.map.get_block_by_pixel({x : x, y : y})
            if (!b)
                return false
            if (this.selecting_block && this.highlightZone && this.highlightZone.zone
                    && !this.highlightZone.zone.find(z => z == b))
                return false
            if (this.selecting_block) {
                this.selecting_block.callback({
                    block : b,
                    input : this.selecting_block.input
                })
                this.highlightZone = undefined
                this.mouseInfoWindow = undefined
                this.blockSelected = undefined
                this.selecting_block = undefined
                world.map.needRedraw = true
                return true
            }
            else
                this.blockSelected = b
            this.playersSelected = b.player
            return true
        }
        return false
    }

    this.SelectingBlockAction = (info) => {
        if (!info || !info.callback)
            return
        this.selecting_block = {
            callback : info.callback,
            input : info.input,
            info : info.info
        }
        this.needRedraw = true
        if (info.highlight) {
            this.highlightZone = {
                zone : info.highlight.callback(info.highlight.input),
                type : info.highlight.input.type
            }
            world.map.needRedraw = true
        }
        if (info.windowInfo) {
            this.mouseInfoWindow = info.windowInfo
        }
    }

    this.center_on_selected_player = () => {
        if (!world.players.Playerturn)
            return false
        world.map.centerOnBlock(world.players.Playerturn)
        this.playersSelected = world.players.Playerturn
    }


    this.DrawTabInfoPlayer = () => {0
        var Uielm = []
        Uielm.push({
            type : "img",
            img : this.playersSelected.bodyPartImg,
            lenx : 200,
            leny : 200,
        })
        this.UI.addHorizontalElem(Uielm)
        var p = this.playersSelected
        var txt = "" + p.name + " ("
        var isenemy = p.team == TEAM_AI ? "enemy)" : "allied)"
        txt += isenemy
        txt += "\n" + p.life + "/" + p.lifeMax + " life point"
        txt += "\n" + p.ActionPoint + "/" + p.ActionPointMax + " AP"
        txt += "\n" + "Speed : " + p.speed
        txt += "\n" + "Move AP cost : " + p.movePCost
        for (var z in p.stats)
            txt += "\n" + z + " : " + p.stats[z]
        this.UI.addTextZone(txt, GAME_UI_LETTER_SIZE / 2, 9999, "#000000", GAME_UI_FONT)
        if (p.weapon)
            this.UI.addTextZone("weapon equiped : '" + p.weapon.name + "'\n" + p.weapon.getWeaponAttackDescription(), GAME_UI_LETTER_SIZE / 2, 9999, "#000000", GAME_UI_FONT)
        if (p.armor)
            this.UI.addTextZone("armor equiped : " + p.armor.getArmorDescription(), GAME_UI_LETTER_SIZE / 2, 9999, "#000000", GAME_UI_FONT)
    }

    this.drawMessageSystemEvents = () => {
        this.UIevent = new MyUI(this.canvas, this.UIturn.lenx + this.UI.lenx, 0, 5, this.scale, this.background, this.stroke, this.marge)
        var first_line = []
        first_line.push({
            type : "button",
            mouseLight : "ff",
            callback : () => {this.UIeventExpanded = !this.UIeventExpanded},
            callback_data : GAME_UI_FONT,
            txt : "Events",
            txt_color : "#000000",
            max_letters : 9999,
            letter_size : 20,
            txt_font : VILLAGE_UI_FONT,
            fillColor : "#ffffff88",
            strokeColor : this.UIeventExpanded ? "#00000000" : "ff0000",
            windowInfo : [{
                callback : () => {return "extand the event window"},
                input : z,
            }]
        })
        if (this.UIeventExpanded) {
            var elms = this.GetPageSelector(this.eventPageOffset)
            for (var z in elms)
                first_line.push(elms[z])
        }
            
        this.UIevent.addHorizontalElem(first_line)
        //if (!this.UIeventExpanded && world.players && world.players.MessageSystem.msg.length) 
        //    this.displayMessageEvent(world.players.MessageSystem.msg[0])
        

            
        //this.UIevent.addButton("Events", 20, "#000000", "#ffffff88", this.UIeventExpanded ? "#00000000" : "ff0000", () => {this.UIeventExpanded = !this.UIeventExpanded}, undefined, GAME_UI_FONT, undefined, undefined, "ff")
        
        if (this.UIeventExpanded && world.players) {
            var msgId = -1;
            for (var z = this.eventPageOffset.value + VILLAGE_UI_MAX_TAB_ELM_DRAW; z >= this.eventPageOffset.value; z--) {
                msgId++
                var msg = world.players.MessageSystem.msg[z]
                if (z >= world.players.MessageSystem.msg.length)
                    continue
                if (!msg)
                    break
                this.displayMessageEvent(msg)
            }
        }
        
        console.log(this.eventPageOffset.value)
        this.UIevent.drawUI()
    }

    this.drawGameUI = () => {
        if (!world.map || !world.players)
            return
        this.needRedraw = false
        this.canvas.GetCanvasPos()
        this.canvas.cleanCanvas()


        //Turn UI
        this.UIturn = new MyUI(this.canvas, 0, 0, 50, this.scale, this.background, this.stroke, 1)


        this.UIturn.addHorizontalElem([{
            type : "button",
            mouseLight : "ff",
            callback : () => {this.UIturnExpanded = !this.UIturnExpanded},
            callback_data : GAME_UI_FONT,
            txt : "Turns",
            txt_color : "#000000",
            max_letters : 9999,
            letter_size : 20,
            txt_font : VILLAGE_UI_FONT,
            fillColor : "#ffffff88",
            strokeColor : this.UIeventExpanded ? "#00000000" : "ff0000",
            windowInfo : [{
                callback : () => {return "extand the Turns window"},
                input : z,
            }]
        }])
        //this.UIturn.addButton("Turns", 20, "#000000", "#ffffff88", this.UIturnExpanded ? "#00000000" : "ff0000", () => {this.UIturnExpanded = !this.UIturnExpanded}, undefined, GAME_UI_FONT, undefined, undefined, "ff")

        var playersTurnList = world.players.getNextTurnList(15)
        for (var z in playersTurnList) {
            var p = playersTurnList[z]
            var Uielm = []
            Uielm.push({
                type : "img",
                img : p.bodyPartImg,
                lenx : 30,
                leny : 30
            })
            if (this.UIturnExpanded)
                Uielm.push({
                    type : "button",
                    mouseLight : "ff",
                    callback : (p) => {this.playersSelected = p;if (world.map) world.map.centerOnBlock(p)},
                    callback_data : p,
                    txt : p.name,
                    txt_color : p.team == TEAM_HUMAN ? '#0088ff' : '#ff0000',
                    max_letters : 9999,
                    letter_size : 30,
                    txt_font : VILLAGE_UI_FONT,
                    fillColor : "#ffffff88",
                    strokeColor : this.playersSelected == p ? "#000000ff" : "#00000000",
                    windowInfo : [{
                        callback : (z) => {return "I will play in " + z + " turn"},
                        input : z,
                    }]
                })
            this.UIturn.addHorizontalElem(Uielm)
        }
        
        this.UIturn.drawUI()


        
        

        //MAIN UI
        this.UI = new MyUI(this.canvas, this.UIturn.lenx, 0, this.lenx, this.scale, this.background, this.stroke, this.marge)

        /*
        var txtFps = "No FPS"
        if (this.fps)
            txtFps = "FPS = " + this.fps + "ips"
        //this.UI.addTextZone(txtFps, GAME_UI_LETTER_SIZE, 9999, "#000000", GAME_UI_FONT)
        */            
        if (this.PlayerInfodisplay && this.playersSelected) {
            this.DrawTabInfoPlayer()
            this.UI.addButton((this.PlayerInfodisplay && this.playersSelected ? "return" : "info"), GAME_UI_LETTER_SIZE, "#000000", "#ffffff", this.stroke, () => {this.PlayerInfodisplay = !this.PlayerInfodisplay}, undefined, GAME_UI_FONT, undefined, undefined, "ff")
        }
        
        else {
            /*
            var txtBlockSelect = "No block selected"
            if (this.blockSelected) {
                var txtBlockSelect = "x : " + this.blockSelected.x + "  y : " + this.blockSelected.y
                this.UI.addTextZone(txtBlockSelect, GAME_UI_LETTER_SIZE, 9999, "#000000", GAME_UI_FONT)
            }
            */
            
            if (world.players.Playerturn) {
                this.UI.addButton("End Turn", GAME_UI_LETTER_SIZE, '#ffff00', '#0320fb', this.stroke, world.players.nextTurn, {map : world.map, GameUI : world.GameUI}, GAME_UI_FONT, "Enter")
                this.UI.addButton("center on player", GAME_UI_LETTER_SIZE, '#000000', '#11ff33', this.stroke, this.center_on_selected_player, undefined, GAME_UI_FONT, "Space")
                
            }
            else
                this.UI.addButton("Next Turn", GAME_UI_LETTER_SIZE, '#ffff00', '#0000fb', this.stroke, world.players.nextTurn, {map : world.map, GameUI : world.GameUI}, GAME_UI_FONT, "Enter")
                
            if (this.blockSelected && !this.playersSelected) {
                var x = this.blockSelected.x
                var y = this.blockSelected.y
                var color = {
                    r : Math.floor(Math.random() * 256),
                    g : Math.floor(Math.random() * 256),
                    b : Math.floor(Math.random() * 256)
                }
                this.UI.addButton("spawn player", GAME_UI_LETTER_SIZE, '#000000', '#ff66ff', this.stroke, world.players.createPlayer, {x : x, y : y, color : color}, GAME_UI_FONT)
            }
                
            if (this.playersSelected) {
                var p = this.playersSelected
                //this.UI.addTextZone(p.name, GAME_UI_LETTER_SIZE, 9999, "#000000", GAME_UI_FONT)
                this.UI.addButton(p.name, GAME_UI_LETTER_SIZE, "#000000", "#ffffff", this.stroke, () => {this.PlayerInfodisplay = !this.PlayerInfodisplay}, undefined, GAME_UI_FONT, undefined, undefined, "ff")
                if (this.playersSelected == world.players.Playerturn && this.playersSelected.team == TEAM_HUMAN) {
                    if (p.bodyPartImg && p.bodyPartImgReady && p.bodyPartImg.complete)
                        this.UI.addImage(p.bodyPartImg, 100, 100)
                    else
                        this.needRedraw = true
                    if (this.selecting_block)
                        this.UI.addTextZone("left mouse :\n" + this.selecting_block.info, GAME_UI_LETTER_SIZE * 0.8, 20, "#000000", GAME_UI_FONT)
                    else {
                        for (var z in p.capacityList) {
                            var c = p.capacityList[z]
                            this.UI.addButton(c.name, GAME_UI_LETTER_SIZE, '#000000', '#ff66ff', this.stroke, this.SelectingBlockAction, {
                                callback : c.callback, 
                                info : c.description, 
                                highlight : {
                                    callback : c.zone_target_area,
                                    input : c.zone_selecting_input,
                                },
                                windowInfo : c.windowInfo
                            }, GAME_UI_FONT, (parseInt(z) + 1))
                        }
                    }
                }
    
            }
        }

        //turn event UI
        this.drawMessageSystemEvents()

        
        this.UI.drawUI()
        


        //UI event


        this.CheckInfoWindow(true)
    }

    this.GetPageSelector = (input) => {      
        var buildingPageSelector = [{
            type : "button",
            callback : () => {input.value = (input.value > 0) ? input.value - 1 : 0},
            txt : "∧",
            txt_color : "#ffffff",
            mouseLight : "88",
            max_letters : 9999,
            letter_size : 30,
            txt_font : VILLAGE_UI_FONT_BUILDINGNAME,
            fillColor : "#5500ff",
            strokeColor : "#000000",
            windowInfo : [{
                callback : () => {return ("page up")},
            }]
        },{
            type : "button",
            callback : () => {input.value++},
            txt : "∨",
            txt_color : "#ffffff",
            mouseLight : "88",
            max_letters : 9999,
            letter_size : 30,
            txt_font : VILLAGE_UI_FONT_BUILDINGNAME,
            fillColor : "#5500ff",
            strokeColor : "#000000",
            windowInfo : [{
                callback : () => {return ("page down")},
            }]
        },{
            type : "txt",
            txt : "[" + input.value + ":" + (input.value + VILLAGE_UI_MAX_TAB_ELM_DRAW) + "]",
            txt_color : '#000000',
            max_letters : 9999,
            letter_size : 15,
            txt_font : VILLAGE_UI_FONT
        }]
        return (buildingPageSelector)
    }
    
    this.displayMessageEvent = (msg) => {
        if (!msg)
            return;
        var color = "#000000"
        switch (msg.type) {
            case TEAM_HUMAN :
                color = "#0000ff"
                break
            case TEAM_AI :
                color = "#ff0000"
                break
        }
        this.UIevent.addTextZone(msg.txt, GAME_UI_LETTER_SIZE / 2, 9999, color, GAME_UI_FONT)
    }
    
}

ControlManager = function() {

    this.keyDown = []
    this.keyUp = []
    this.mousePos = {
        x : 0,
        y : 0,
        lastTime : new Date().getTime()
    }

    window.addEventListener('keydown', (event) => {
        if (event.repeat)
            return
        var name = event.key;
        var code = event.code;
        this.keyDown[code] = true
        //console.log("key code : " + code)
    });
    window.addEventListener('keyup', (event) => {
        var name = event.key;
        var code = event.code;
        this.keyDown[code] = false
        this.keyUp[code] = true
    });
    window.addEventListener('wheel', (event) => {
        var wheelDir = event.deltaY
        if (world.map) {
            if (wheelDir > 0)
                world.map.changeMapView(0, 0, 0.95);
            else if (wheelDir < 0)
                world.map.changeMapView(0, 0, 1.05);
        }

    })
    window.addEventListener('mouseup', (event) => {
        var topc = world.Screen.canList["mapFloor"];
        pos = topc.getPixelPosition(event.clientX, event.clientY)
        if (pos) {
            this.inputclick = {
                x : pos.x,
                y : pos.y,
                button : event.button
            }
        }
    });
    window.addEventListener('mousemove', (event) => {
        var topc = world.Screen.canList["mapFloor"];
        this.mousePos = topc.getPixelPosition(event.clientX, event.clientY)
        if (this.mousePos)
            this.mousePos.lastTime = new Date().getTime()
    });



    this.CheckControlInput = () => {
        var GameUigetInput = false

        ///check jey down
        if (world.map) {
            if (this.keyDown['KeyW']) 
                world.map.changeMapView(0, -0.1 / world.map.scale, 1);
            if (this.keyDown['KeyS']) 
                world.map.changeMapView(0, 0.1 / world.map.scale, 1);
            if (this.keyDown['KeyA']) 
                world.map.changeMapView(-0.1 / world.map.scale, 0, 1);
            if (this.keyDown['KeyD']) 
                world.map.changeMapView(0.1 / world.map.scale, 0, 1);
            if (this.keyDown['ArrowUp']) 
                world.map.changeMapView(0, -0.1 / world.map.scale, 1);
            if (this.keyDown['ArrowDown']) 
                world.map.changeMapView(0, 0.1 / world.map.scale, 1);
            if (this.keyDown['ArrowLeft']) 
                world.map.changeMapView(-0.1 / world.map.scale, 0, 1);
            if (this.keyDown['ArrowRight']) 
                world.map.changeMapView(0.1 / world.map.scale, 0, 1);
            if (this.keyDown['NumpadSubtract']) 
                world.map.changeMapView(0, 0, 0.95);
            if (this.keyDown['NumpadAdd']) 
                world.map.changeMapView(0, 0, 1.05);
        }




        //check key up
        if (this.keyUp['KeyF']) {
            if (!world.Screen.fullScreen)
                world.Screen.openFullscreen()
            else
                world.Screen.closeFullscreen(document)
            world.Music.playSound("click", undefined, true)
        }
        for (var z in this.keyUp) {
            if (!GameUigetInput && z.startsWith("Digit") || z.startsWith("Numpad"))
                z = z.replace("Digit", "").replace("Numpad", "")
            if (world.GameUI && !GameUigetInput && world.GameUI.getKeyInput(z)) {
                world.Music.playSound("click", undefined, true)
                GameUigetInput = true
                if (world.GameUI)
                    world.GameUI.needRedraw = true;
                break
            }
            if (world.villageUI && world.villageUI.getKeyInput(z)) {
                world.Music.playSound("click", undefined, true)
                GameUigetInput = true
                if (world.villageUI)
                    world.villageUI.needRedraw = true
                break
            }
        }
        this.keyUp = []




        //check mouse click
        if (this.inputclick) {
            if (!GameUigetInput && world.GameUI && world.GameUI.getMouseInput(this.inputclick)) {
                world.Music.playSound("click", undefined, true)
                GameUigetInput = true
                if (world.GameUI)
                    world.GameUI.needRedraw = true;
            }
            if (!GameUigetInput && world.villageUI && world.villageUI.getMouseInput(this.inputclick)) {
                world.Music.playSound("click", undefined, true)
                GameUigetInput = true
                if (world.villageUI)
                    world.villageUI.needRedraw = true;
            } 
        }
        this.inputclick = undefined
  
    }
}
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
    {
        name : "stone_pickaxe",
        center : {x : 65, y : 70},
        sound : "mine"
    },
]

WEAPON_TYPE = [  
    {   name : "Wood Stick",
        Img : "wood_stick",
        weaponAnim : "sword",
        bonus : [],
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
        bonus : [],
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
        bonus : [BONUS_AXE_FOREST_WOOD],
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
        bonus : [],
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
        bonus : [],
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
        bonus : [],
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
    {   name : "Stone Pickaxe",
        Img : "stone_pickaxe",
        weaponAnim : "sword",
        actionCost : 40,
        bonus : [BONUS_PICKAXE_MINE],
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
                        type : "piercing",
                        value : 2
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
    this.bonus

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
        this.bonus = wp.bonus
        console.log("WEAPON BONUS / " + this.bonus.length)
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
        for (var z in this.bonus) 
            if (BONUS_DESCRIPTION[this.bonus])
                txt += "\n" + BONUS_DESCRIPTION[this.bonus]
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

PLAYER_ARMOR = [{
    name : "Miner helmet",
    img : "miner_helmet",
    dmgArmor : [
        {
            damage : "crushing",
            type : "factor",
            value : 25
        },
        {
            damage : "crushing",
            value : 5
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
        while (list.length < 3) {
            for (var z in ListP) {
                if (Math.floor(Math.random() * 100) < 50)
                    list.push(ListP[z])
                if (list.length > 2)
                    break
            }
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
        world.village.MessageSystem.addMessage({type : "player", txt : this.name + "'s " + input.stat + " " + input.value})
        this.lvlupList = []
        this.lvlup--
        this.lvl++
    }

    this.tryLvLup = () => {
        var chanceLvLup = 50 * (1 - this.lvl / 100)
        var rand = Math.floor(Math.random() * 100)
        if (rand < chanceLvLup) {
            this.lvlup++
            world.village.MessageSystem.addMessage({type : "player", txt : this.name + " can lvl up ++"})
            world.Music.playSound("lvlup")
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

    this.get_valid_action_in_affected_building = () => {
        if (!this.villageActionPoint)
            return []
        var b = world.village.getBatFromPlayer(this)
        if (!b || !b.callback_actionPlayer || !b.callback_actionPlayer.length)
            return []
        var list = b.callback_actionPlayer.filter(a => a.cost <= this.villageActionPoint)
        return list
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
        world.Music.playSound("hammer_nails")
        return true
    }

    this.TryUpgrade = () => {
        var up = this.getNextUpgrade()
        if (this.checkNextUpgrade()) {
            world.village.MessageSystem.addMessage({type : "building", txt : this.name + " uppgraded to LvL " + (this.lvl + 1)})
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
        name : "Stone Pickaxe",
        type : "weapon",
        bat : "workshop",
        resources : {wood : 50, stone : 5},
        APcost : 10,
        description : "get more resources in mine"
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
        name : "Miner helmet",
        type : "armor",
        bat : "workshop",
        resources : {stone : 100, coal : 25},
        APcost : 12,
        description : "light your way in the mine, and protect against rock falling"
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
        return player
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
                this.generateBasicPlayer({weapon : "Stone Pickaxe", armor : "Miner helmet"})
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
            if (!input || !input.bat)
                return
            var b = input.bat
            var village = world.village
            if (b.lvl == 1) {
                village.populationMax += 5
                village.MessageSystem.addMessage({type : "player", txt : "Population max + 5 (" + village.populationMax + ")"})
            }
            if (b.lvl == 2) {
                village.populationMax += 10
                village.MessageSystem.addMessage({type : "player", txt : "Population max + 10 (" + village.populationMax + ")"})
            }
        }
        var b = new Batiment({
            name : "Houses",
            player_size : 0,
            callback_actionPlayer : [],
            description : (b) =>{return("House lvl" + b.lvl + "\nVillage max population = " + world.village.populationMax)},
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
        b.bonusPopulation = 5
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


    this.addMine = (input) => {
        recolteMine = function (input) {
            if (!input || !input.player || input.cost == undefined || input.cost > input.player.villageActionPoint)
                return
            var txt = input.player.name + " is mining resource for " + input.cost + " AP"
            world.village.MessageSystem.addMessage({type : "job", txt : txt})
            input.player.villageActionPoint -= input.cost
            
            var test_pickaxe = (input.player.weapon && input.player.weapon.bonus.find(a => a == BONUS_PICKAXE_MINE)) ? true : false
            var stone = 2 + Math.floor(Math.random() * 5)
            if (test_pickaxe)
                stone += 20
            var coal = Math.floor(Math.random() * 100) > 5 ? 0 : Math.floor(Math.random() * 10)
            var res = {stone : stone}

            if (coal || test_pickaxe)
                res.coal = coal
            world.village.addResource({resources : res})
            world.Music.playSound('mine')
        }
        var b = new Batiment({
            name : input.name,
            player_size : 3,
            callback_actionPlayer : [{
                callback : recolteMine,
                buto_txt : "mine",
                description : "Mine the ground get resources",
                cost : 4
            }],
            description : "A big hole in the ground",
            blocking_end_turn : true,
            imgIcon : "Mine",
            build_progression : input.costAP,
        })
        this.bats.push(b)
    }

    this.addSawmill = () => {
        function craftPlank(input) {
            if (!input || !input.player || input.cost == undefined || input.cost > input.player.villageActionPoint)
                return
            if (!world.village.checkHaveResources({resources : {wood : 10}})) {
                world.village.MessageSystem.addMessage({type : "job", txt : "you need more wood for make a plank"})
                return
            }
            world.Music.playSound("sawmill_song")
            var txt = input.player.name + " crafted a wood plank for 10 wood for" + input.cost + " AP"
            world.village.MessageSystem.addMessage({type : "job", txt : txt})
            input.player.villageActionPoint -= input.cost
            world.village.removeResource({resources : {wood : 10}})
            world.village.addResource({resources : {woodplank : 1,}})
        }

        var b = new Batiment({
            name : "Sawmill",
            player_size : 2,
            callback_actionPlayer : [{
                callback : craftPlank,
                buto_txt : "craft woodplank",
                description : "transform wood into woodplank",
                cost : 5
            }],
            description : "A big circular saw for cut the wood",
            blocking_end_turn : true,
            imgIcon : "sawmill"
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
            if (input.player.weapon && input.player.weapon.bonus.find(a => a == BONUS_AXE_FOREST_WOOD)) {
                wood *= 2
                console.log("doubled wood")
            }
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
            },
            {
                name : "Mine",
                img : "Mine",
                resources : {wood : 20, stone : 5},
                callback : this.addMine,
                input : {name: "Mine", costAP : 10}
            },
            {
                name : "Sawmill",
                img : "sawmill",
                resources : {wood : 20, stone : 5},
                callback : this.addSawmill,
                input : {name: "Sawmill", costAP : 10}
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
                            var test = p.get_valid_action_in_affected_building()
                            if (test && test.length > 0)
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
                    this.MessageSystem.addMessage({type : "player", txt : "Your population eat food, Miam"})
                    this.removeResource({resources : {food : foodconsumed}})
                    this.foodconsumedLastTurn = foodconsumed
                    for (var z in this.players) {
                        this.players[z].tryLvLup();
                        this.players[z].age++
                    }

                    if (this.players.length < this.populationMax) {
                        var rand = Math.floor(Math.random() * 100)
                        if (rand < 50) {
                            var p = this.generateBasicPlayer()
                            this.MessageSystem.addMessage({type : "player", txt : "New PLayer " + p.name + " joined your village"})
                        }
                    }
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


VILLAGE_UI_LETTER_SIZE = 30

VILLAGE_UI_FONT = "'Footlight MT Light'"

VILLAGE_UI_FONT_BUTTON = "'Cooper Black'"
VILLAGE_UI_FONT_BUTTON_2 = "'Comic Sans MS'"

VILLAGE_UI_FONT_TITLE = "'Snap ITC'"
VILLAGE_UI_FONT_PLAYERNAME = "'Chiller'"
VILLAGE_UI_FONT_BUILDINGNAME = "'Ravie'"
VILLAGE_UI_FONT_PHASE = "'Algerian'"

VILLAGE_UI_TABS_FONT = "'Snap ITC'"
VILLAGE_UI_TABS_TXTCOLOR = "#ffffff"
VILLAGE_UI_TABS_FILLCOLOR = "#556b2f88"

VILLAGE_UI_MAX_TAB_ELM_DRAW = 20

VILLAGE_UI_FILLSTYLE = "#ffff66"        //before wood pattern

VILLAGE_UI_BAT_ELM_FILLCOLOR = "#d2691e88"
VILLAGE_UI_PLAYER_ELM_FILLCOLOR = "#6495ed88"
VILLAGE_UI_ITEM_ELM_FILLCOLOR = "#f8f8ff88"

VILLAGE_UI_BUTTON_FILLCOLOR = "#00dd00"

VillageUI = function (canvas) {
    world.Music.playSound("the-britons", true)
    this.canvas = canvas
    this.needRedraw = true
    this.marge = 5
    this.background = VILLAGE_UI_FILLSTYLE
    this.stroke = "#663300"
    this.scale = 1

    this.mouseWasOnMouseLightLastDraw = true

    this.tabs = ['Next Turn', 'building', 'craft', 'resource', 'Items', 'Player']
    this.activeTabId = 0

    this.playerSelected = undefined
    this.playerInfoMenu = undefined
    this.playersPageOffset = {value : 0}

    this.batSelected = undefined
    this.batBuildMenu = undefined
    this.batPageOffset = {value : 0}
    this.batSortModeList = ['a->Z', 'player', 'size']
    this.batSortModeId = {value : 0}

    this.constructionSelected = undefined

    this.itemSelected = undefined
    this.itemsPageOffset = {value : 0}

    this.craftSelected = undefined
    this.craftPageOffset = {value : 0}


    this.UI = undefined
    this.showUI = true
    this.UIplayers = undefined
    this.showUIplayers = true
    this.UIsystem = undefined
    this.showUIsystem = true

    this.eventPage = 0;

    this.warningEndTurnMessage = []

    const canvaspat = document.createElement("canvas")
    const ctxpat = canvaspat.getContext("2d");
    const imgpat = new Image();
    imgpat.src = "./img/player_test3/village/villageUI_patern.png";
    imgpat.onload = () => { // Only use the image after it's loaded
      const pattern = ctxpat.createPattern(imgpat, "repeat");
      this.background = pattern;
      this.needRedraw = true
    };


    this.init_check_mouse_move = () => {        //highlight button when mouse move over it
        window.addEventListener('mousemove', (event) => {
            var check = false
            if (this.UIplayers && this.UIplayers.mouse_move_check(event.clientX, event.clientY) && !this.mouseWasOnMouseLightLastDraw) {
                this.needRedraw = true
                this.mouseWasOnMouseLightLastDraw = true
                check = true
            }
            if (this.UI && this.UI.mouse_move_check(event.clientX, event.clientY) && !this.mouseWasOnMouseLightLastDraw){
                this.needRedraw = true
                this.mouseWasOnMouseLightLastDraw = true
                check = true
            }
            if (this.UIsystem && this.UIsystem.mouse_move_check(event.clientX, event.clientY) && !this.mouseWasOnMouseLightLastDraw){
                this.needRedraw = true
                this.mouseWasOnMouseLightLastDraw = true
                check = true
            }
            if (!check && this.mouseWasOnMouseLightLastDraw) {
                this.mouseWasOnMouseLightLastDraw = false
                this.needRedraw = true
            }
            if (this == world.villageUI)
                this.init_check_mouse_move()
        }, {once : true});
    }
    this.init_check_mouse_move()


    this.getKeyInput = (key) => {
        if (this.UI && this.UI.key_buton_check(key))
            return true
        if (this.UIplayers && this.UIplayers.key_buton_check(key))
            return true
        if (this.UIsystem && this.UIsystem.key_buton_check(key))
            return true
        if (key == 'ControlLeft' && this.cancel_menu())
            return true
        return false
    }

    this.cancel_menu = () => {
        if (this.playerInfoMenu) {
            this.playerInfoMenu = undefined
            return true
        }

        if (this.tabs[this.activeTabId] == 'building') {
            if (this.batBuildMenu) {
                this.batBuildMenu = undefined
                return true
            }
            if (this.batSelected) {
                this.batSelected = undefined
                return true
            }
        }
        return false
    }   

    this.getMouseInput = (input) => {
        var x = input.x
        var y = input.y
        if (input.button == 2) { //right click
            var test = this.cancel_menu()
            if (test)
                return true
        }
        else if (this.UI.click_buton_check(x, y))
            return true
        else if (this.UIplayers.click_buton_check(x, y))
            return true
        else if (this.UIsystem.click_buton_check(x, y))
            return true
        return false
    }

    this.GoToTabName = (input) => {
        if (!input)
            return
        if (input.tab)
            for (var z in this.tabs) {
                if (this.tabs[z] == input.tab)
                    this.activeTabId = z
        }
        if (input.player)
            this.playerSelected = input.player
        if (input.bat)
            this.batSelected = input.bat
    }

    this.CheckInfoWindow = (redraw) => {
        if (this.UI && this.UI.CheckInfoWindow(redraw))
            this.needRedraw = true
        if (this.UIplayers && this.UIplayers.CheckInfoWindow(redraw))
            this.needRedraw = true
        if (this.UIsystem && this.UIsystem.CheckInfoWindow(redraw))
            this.needRedraw = true
    }
        //MENU DRAWING FUNCTIONS//

    this.GetPageSelector = (input) => {
        if (!input.selector)
            return
        var buildingPageSelector = [{
            type : "button",
            callback : () => {input.selector.value = (input.selector.value > 0) ? input.selector.value - 1 : 0},
            txt : "∧",
            txt_color : "#ffffff",
            mouseLight : "88",
            max_letters : 9999,
            letter_size : 30,
            txt_font : VILLAGE_UI_FONT_BUILDINGNAME,
            fillColor : "#5500ff",
            strokeColor : "#000000",
            windowInfo : [{
                callback : () => {return ("page up")},
            }]
        },{
            type : "button",
            callback : () => {input.selector.value++},
            txt : "∨",
            txt_color : "#ffffff",
            mouseLight : "88",
            max_letters : 9999,
            letter_size : 30,
            txt_font : VILLAGE_UI_FONT_BUILDINGNAME,
            fillColor : "#5500ff",
            strokeColor : "#000000",
            windowInfo : [{
                callback : () => {return ("page down")},
            }]
        },{
            type : "txt",
            txt : "[" + input.selector.value + ":" + (input.selector.value + VILLAGE_UI_MAX_TAB_ELM_DRAW) + "]",
            txt_color : '#000000',
            max_letters : 9999,
            letter_size : 15,
            txt_font : VILLAGE_UI_FONT
        }]
        if (input.sortButo)
            buildingPageSelector.push({
                type : "button",
                callback : (sortButo) => {sortButo.id.value = (sortButo.id.value + 1) % sortButo.list.length; console.log("changed " + [sortButo.id.value, sortButo.list.length])},
                callback_data : input.sortButo,
                txt : this.batSortModeList[this.batSortModeId.value],
                txt_color : "#000000",
                mouseLight : "88",
                max_letters : 9999,
                letter_size : 15,
                txt_font : VILLAGE_UI_FONT_BUILDINGNAME,
                fillColor : "#55ff00",
                strokeColor : "#000000",
                windowInfo : [{
                    callback : () => {return ("sort buildings by " + this.batSortModeList[this.batSortModeId.value])},
                }]
            })
        return (buildingPageSelector)
    }

    this.draw_building_tab = () => {
        var village = world.village
        this.UI.addHorizontalElem(this.GetPageSelector({sortButo : {list : this.batSortModeList, id : this.batSortModeId}, selector : this.batPageOffset}))
        switch (this.batSortModeList[this.batSortModeId.value]) {
            case 'a->Z' :
                village.bats.sort((a, b) => {if (a.name > b.name) return 1; return -1})
                break
            case 'player' :
                village.bats.sort((a, b) => {if (a.players_inside.length <= b.players_inside.length) return 1; return -1})
                break
            case 'size' :
                village.bats.sort((a, b) => {if (a.player_size <= b.player_size) return 1; return -1})
                break
        }
        if (village.phase == PHASE_PLACEPLAYER) {
            this.UI.addHorizontalElem(this.GetBatBuildMenuSelector())
            var pageVertiElm = 0
            if (this.batBuildMenu) {        //construction menu
                for (var z in village.batsToBuild) {
                    var b = village.batsToBuild[z]
                    var buildingUI = []
                    buildingUI.push({
                        type : "button",
                        callback : (b) => {if (this.constructionSelected == b) this.constructionSelected = undefined; else this.constructionSelected = b},
                        callback_data : b,
                        txt : b.name,
                        mouseLight : "88",
                        txt_color : "#000000",
                        max_letters : 9999,
                        letter_size : 30,
                        txt_font : VILLAGE_UI_FONT_BUILDINGNAME,
                        fillColor : "#00000000",
                        strokeColor : this.constructionSelected == b ? "#000000" : "#00000000",
                        windowInfo : [{
                            callback : () => {return ("Build new batiments here")},
                        }]
                    })
                    buildingUI.push({
                        type : "img",
                        img : world.Imgs[b.img].img,
                        len_x : 30,
                        len_y : 30
                    })
                    if (pageVertiElm >= this.batPageOffset.value && pageVertiElm <  this.batPageOffset.value + VILLAGE_UI_MAX_TAB_ELM_DRAW)
                        this.UI.addHorizontalElem(buildingUI)
                    pageVertiElm++

                    if (this.constructionSelected == b) {   
                        var buildingUI = []
                        buildingUI.push({
                            type : "button",
                            mouseLight : "88",
                            callback : world.village.TryBuildBat,
                            callback_data : {bat : b},
                            txt : "start construction",
                            txt_color : "#000000",
                            max_letters : 9999,
                            letter_size : 15,
                            txt_font : VILLAGE_UI_FONT_BUTTON_2,
                            fillColor : VILLAGE_UI_BUTTON_FILLCOLOR,
                            strokeColor : "#00000000",
                            windowInfo : [{
                                callback : () => {return ("Build new batiments here")},
                            }]
                        })
                        if (pageVertiElm >= this.batPageOffset.value && pageVertiElm <  this.batPageOffset.value + VILLAGE_UI_MAX_TAB_ELM_DRAW)
                            this.UI.addHorizontalElem(buildingUI)
                        pageVertiElm++

                        if (b.input && b.input.costAP) {
                            if (pageVertiElm >= this.batPageOffset.value && pageVertiElm <  this.batPageOffset.value + VILLAGE_UI_MAX_TAB_ELM_DRAW)
                                this.UI.addHorizontalElem([{
                                    type : "txt",
                                    txt : " -Action Point " + b.input.costAP,
                                    txt_color : '#000000',
                                    max_letters : 9999,
                                    letter_size : 20,
                                    txt_font : VILLAGE_UI_FONT
                                },
                                {
                                    type : "img",
                                    img : world.Imgs["villageAP_icon"].img,
                                    len_x : 20,
                                    len_y : 20,
                                }])
                            pageVertiElm++
                        }
                        for (var i in b.resources) {
                            var resourceCostUi = []
                            resourceCostUi.push({
                                type : "txt",
                                txt : " -" + i + " " + b.resources[i],
                                txt_color : '#000000',
                                max_letters : 9999,
                                letter_size : 20,
                                txt_font : VILLAGE_UI_FONT
                            })
                            resourceCostUi.push({
                                type : "img",
                                img : world.Imgs[i + "_icon"].img,
                                len_x : 20,
                                len_y : 20
                            })
                        }
                        if (pageVertiElm >= this.batPageOffset.value && pageVertiElm <  this.batPageOffset.value + VILLAGE_UI_MAX_TAB_ELM_DRAW)
                            this.UI.addHorizontalElem(this.getResourcesTextAndImg(b.resources, 20))
                        pageVertiElm++
                    }

                }
            }
            else if (!this.batBuildMenu) {      //list building menu
                for (var z in village.bats) {
                    var b = village.bats[z]
                    //name of the building


                    var bd = this.GetDrawBuildingElement(b, 40)
                    if (b.build_progression)
                        bd.push({
                            type : "img",
                            img : world.Imgs["under_construction_icon"].img,
                            len_x : 40,
                            len_y : 40
                        })
                    if (pageVertiElm >= this.batPageOffset.value && pageVertiElm <  this.batPageOffset.value + VILLAGE_UI_MAX_TAB_ELM_DRAW)
                        this.UI.addHorizontalElem(bd)
                    pageVertiElm++

                    if (b.build_progression) {
                        if (pageVertiElm >= this.batPageOffset.value && pageVertiElm <  this.batPageOffset.value + VILLAGE_UI_MAX_TAB_ELM_DRAW)
                            this.UI.addTextZone("" + b.build_progression + " PA left for finish construction", 20, 9999, '#000000', VILLAGE_UI_FONT)
                        pageVertiElm++
                    }

                    var buildingUI = []

                    var up = b.getNextUpgrade()

                    if (this.batSelected == b && b.lvl) {
                        if (pageVertiElm >= this.batPageOffset.value && pageVertiElm <  this.batPageOffset.value + VILLAGE_UI_MAX_TAB_ELM_DRAW)
                            this.UI.addTextZone("lvl " + b.lvl, 15, 9999, "#000000", VILLAGE_UI_FONT)
                        pageVertiElm++
                    }
                    if (this.batSelected == b && up) {
                        var upelm =  this.getResourcesTextAndImg(up.resources, 20)
                        upelm.unshift({
                            type : "button",
                            mouseLight : "88",
                            callback : b.TryUpgrade,
                            callback_data : {},
                            txt : "uppgrade",
                            txt_color : "#000000",
                            max_letters : 9999,
                            letter_size : 20,
                            txt_font : VILLAGE_UI_FONT_BUTTON_2,
                            fillColor : VILLAGE_UI_BUTTON_FILLCOLOR
                        })
                        if (pageVertiElm >= this.batPageOffset.value && pageVertiElm <  this.batPageOffset.value + VILLAGE_UI_MAX_TAB_ELM_DRAW)
                            this.UI.addHorizontalElem(upelm)
                        pageVertiElm++
                    }
                    if (b == this.batSelected && b.player_size) {
                        if (b.player_size && pageVertiElm >= this.batPageOffset.value && pageVertiElm <  this.batPageOffset.value + VILLAGE_UI_MAX_TAB_ELM_DRAW)
                            this.UI.addTextZone("" + b.players_inside.length + " / " + b.player_size + " place", 20, 9999, '#000000', VILLAGE_UI_FONT)
                        pageVertiElm++
                    }
                    if (this.playerSelected && b == this.batSelected && !b.players_inside.find(a => a == this.playerSelected) && b.players_inside.length < b.player_size)
                        buildingUI.push({
                            type : "button",
                            mouseLight : "88",
                            callback : world.village.affectPlayerToBat,
                            callback_data : {
                                player : this.playerSelected,
                                bat : b
                            },
                            txt : "add player",
                            txt_color : "#000000",
                            max_letters : 9999,
                            letter_size : 20,
                            txt_font : VILLAGE_UI_FONT_BUTTON_2,
                            fillColor : VILLAGE_UI_BUTTON_FILLCOLOR
                        })
                    if (buildingUI.length) {
                        if (pageVertiElm >= this.batPageOffset.value && pageVertiElm <  this.batPageOffset.value + VILLAGE_UI_MAX_TAB_ELM_DRAW)
                            this.UI.addHorizontalElem(buildingUI)
                        pageVertiElm++
                    }
                    if (this.batSelected == b) {
                        for (var i in b.players_inside) {
                            var p = b.players_inside[i]
                            var playerUI = this.getPlayerIcone(p)                         
                            playerUI.push({
                                type : "button",
                                mouseLight : "88",
                                callback : world.village.removePlayerFromBat,
                                callback_data : {player : p},
                                txt : " x ",
                                txt_color : "#000000",
                                max_letters : 9999,
                                letter_size : 20,
                                txt_font : VILLAGE_UI_FONT_PLAYERNAME,
                                fillColor : "#ff0000",
                            })
                            if (pageVertiElm >= this.batPageOffset.value && pageVertiElm <  this.batPageOffset.value + VILLAGE_UI_MAX_TAB_ELM_DRAW)
                                this.UI.addHorizontalElem(playerUI)
                            pageVertiElm++
                        }
                    }
                }
            }
        }
        else if (village.phase == PHASE_ACTIONPLAYER) {
            var pageVertiElm = 0
            for (var z in village.bats) {
                var b = village.bats[z]
                //name of the building
                var bd = this.GetDrawBuildingElement(b, 40)
                if (b.build_progression)
                    bd.push({
                        type : "img",
                        img : world.Imgs["under_construction_icon"].img,
                        len_x : 40,
                        len_y : 40
                    })
                if (pageVertiElm >= this.batPageOffset.value && pageVertiElm <  this.batPageOffset.value + VILLAGE_UI_MAX_TAB_ELM_DRAW)
                    this.UI.addHorizontalElem(bd)
                pageVertiElm++

                if (b.build_progression) {
                    if (pageVertiElm >= this.batPageOffset.value && pageVertiElm <  this.batPageOffset.value + VILLAGE_UI_MAX_TAB_ELM_DRAW)
                        this.UI.addTextZone("" + b.build_progression + " PA left for finish construction", 20, 9999, '#000000', VILLAGE_UI_FONT)
                    pageVertiElm++
                }
                
                var buildingUI = []
                if (buildingUI.length) {
                    if (pageVertiElm >= this.batPageOffset.value && pageVertiElm <  this.batPageOffset.value + VILLAGE_UI_MAX_TAB_ELM_DRAW)
                        this.UI.addHorizontalElem(buildingUI)
                    pageVertiElm++
                }
                for (var i in b.players_inside) {
                    var p = b.players_inside[i]
                    var test = p.get_valid_action_in_affected_building()
                    if (this.batSelected == b || (test.length && b.name != "Defend Village")) {
                        var playerUI = this.getPlayerIcone(p)
                        if (b.callback_actionPlayer.length)
                            playerUI.push(
                                {
                                    type : "img",
                                    img : world.Imgs["villageAP_icon"].img,
                                    len_x : 20,
                                    len_y : 20
                                },
                                {
                                type : "txt",
                                txt : "" + p.villageActionPoint + " Action Point left",
                                txt_color : p.villageActionPoint ? '#000000' : "#000000aa",
                                max_letters : 9999,
                                letter_size : 20,
                                txt_font : VILLAGE_UI_FONT
                            })
                        if (pageVertiElm >= this.batPageOffset.value && pageVertiElm <  this.batPageOffset.value + VILLAGE_UI_MAX_TAB_ELM_DRAW)
                            this.UI.addHorizontalElem(playerUI)
                        pageVertiElm++
                        if (b.build_progression) {
                            var buto = []
                            if (p.villageActionPoint > 0) {
                                buto.push({
                                    type : "button",
                                    mouseLight : "88",
                                    callback : b.build,
                                    callback_data : {player : p},
                                    txt : "build",
                                    txt_color : "#000000",
                                    max_letters : 9999,
                                    letter_size : 20,
                                    txt_font : VILLAGE_UI_FONT_BUTTON_2,
                                    fillColor : VILLAGE_UI_BUTTON_FILLCOLOR,
                                    windowInfo : [{
                                        callback : (a) => {return a},
                                        input : "use your action point for construct the building"
                                    }]
                                })
                                buto.push({
                                    type : "txt",
                                    txt : "under construction : " + b.build_progression + " left",
                                    txt_color : p.villageActionPoint ? '#000000' : "#000000aa",
                                    max_letters : 9999,
                                    letter_size : 20,
                                    txt_font : VILLAGE_UI_FONT
                                })
                            }                    
                            if (pageVertiElm >= this.batPageOffset.value && pageVertiElm <  this.batPageOffset.value + VILLAGE_UI_MAX_TAB_ELM_DRAW)
                                this.UI.addHorizontalElem(buto)
                            pageVertiElm++
                        }
                        else {
                            for (var j in b.callback_actionPlayer) {
                                var action = b.callback_actionPlayer[j]
                                if (action.cost && action.cost > p.villageActionPoint || p.villageActionPoint == 0)
                                    continue
                                var buton = {
                                    type : "button",
                                    mouseLight : "88",
                                    callback : action.callback,
                                    callback_data : {player : p, cost : action.cost},
                                    txt : action.buto_txt,
                                    txt_color : "#000000",
                                    max_letters : 9999,
                                    letter_size : 20,
                                    txt_font : VILLAGE_UI_FONT_BUTTON_2,
                                    fillColor : VILLAGE_UI_BUTTON_FILLCOLOR,
                                    windowInfo : [{
                                        callback : (a) => {return a},
                                        input : action.description
                                    }]
                                }
                                if (pageVertiElm >= this.batPageOffset.value && pageVertiElm <  this.batPageOffset.value + VILLAGE_UI_MAX_TAB_ELM_DRAW)
                                    this.UI.addHorizontalElem([buton])
                                pageVertiElm++
                            }
                        }
                    }

                }
            }
        }
    }

    this.GetBatBuildMenuSelector = () => {
        var buto = []
        if (this.batBuildMenu) {
            buto.push({
                type : "button",
                mouseLight : "88",
                callback : () => {this.batBuildMenu = false; this.batPageOffset.value = 0},
                txt : "back",
                mouseLight : "88",
                txt_color : "#a01454",
                max_letters : 9999,
                letter_size : 35,
                txt_font : VILLAGE_UI_FONT,
                fillColor : "#17bdbc",
                strokeColor : "#000000",
                windowInfo : [{
                    callback : () => {return ("Build new batiments here")},
                }]
            })
        }
        else {
            buto.push({
                type : "button",
                mouseLight : "88",
                callback : () => {this.batBuildMenu = true; this.batPageOffset.value = 0},
                txt : "New Building",
                mouseLight : "88",
                txt_color : "#17bdbc",
                max_letters : 9999,
                letter_size : 35,
                txt_font : VILLAGE_UI_FONT,
                fillColor : "#a01454",
                strokeColor : "#000000",
                windowInfo : [{
                    callback : () => {return ("Where your players works")},
                }]
            })
        }
        return buto
    }

    this.getResourcesTextAndImg = (resources, size) => {
        var elms = []
        for (var z in resources) {
            elms.push({
                type : "img",
                img : world.Imgs[z + "_icon"].img,
                len_x : size,
                len_y : size,
            })
            elms.push({
                type : "txt",
                txt : " x" + resources[z],
                txt_color : "#000000",
                max_letters : 9999,
                letter_size : size,
                txt_font : VILLAGE_UI_FONT
            })
        }
        return elms
    }


    this.getItemIcone = (wp, size, Nobuton) => {
        var cb = () => this.itemSelected = (this.itemSelected == wp) ? undefined : wp
        if (Nobuton)
            cb = () => {}
        var elm = [{
            type : "img",
            img : world.Imgs[wp.name + "_icon"].img,
            len_x : size,
            len_y : size,
        },{
            type : "button",
            mouseLight : "ff",
            callback : cb,
            txt : wp.name,
            txt_color : "#000000",
            max_letters : 9999,
            letter_size : size,
            txt_font : VILLAGE_UI_FONT,
            fillColor : VILLAGE_UI_ITEM_ELM_FILLCOLOR,
            strokeColor : this.itemSelected == wp ? "#0000ff88" : "#00000000",
            windowInfo : [{
                callback : wp.itemType == "weapon" ? wp.getWeaponAttackDescription :  wp.getArmorDescription,
            }]
        }]
        return elm
    }

    this.draw_craft_menu = () => {
        var village = world.village
        this.UI.addHorizontalElem(this.GetPageSelector({selector : this.craftPageOffset}))
        var pageVertiElm = 0
        var craftList = village.get_valid_craft_list()
        if (village.phase != PHASE_ACTIONPLAYER)
            this.UI.addTextZone("you can only craft during Phase 2", 20, 9999, '#ff0000', VILLAGE_UI_FONT)
        if (!craftList || craftList.length < 1)
            this.UI.addTextZone("no craft available", 20, 9999, '#000000', VILLAGE_UI_FONT)
        for (var z in craftList) {
            var buto = []
            var c = craftList[z]
            buto.push({
                type : "button",
                mouseLight : "ff",
                callback : (c) => this.craftSelected = this.craftSelected == c ? undefined : c,
                callback_data : c,
                txt : c.name + " (" + c.type + ")",
                txt_color : this.craftSelected == c ? '#666666' : "#000000",
                max_letters : 9999,
                letter_size : 25,
                txt_font : VILLAGE_UI_FONT,
                fillColor : "#ffffff88",
                strokeColor : this.craftSelected == c ? "#000000ff" : "#00000000",
                windowInfo : [{
                    callback : () => {return c.description},
                    input : undefined,
                }]
            })
            if (pageVertiElm >= this.craftPageOffset.value && pageVertiElm <  this.craftPageOffset.value + VILLAGE_UI_MAX_TAB_ELM_DRAW)
                this.UI.addHorizontalElem(buto)
            pageVertiElm++
            if (this.craftSelected == c) {
                var pl = village.get_valid_player_for_craft({craft : c})
                if (pageVertiElm >= this.craftPageOffset.value && pageVertiElm <  this.craftPageOffset.value + VILLAGE_UI_MAX_TAB_ELM_DRAW)
                    this.UI.addHorizontalElem(this.getResourcesTextAndImg(c.resources, 20))
                pageVertiElm++
                if (!pl || pl.length < 1) {
                    if (pageVertiElm >= this.craftPageOffset.value && pageVertiElm <  this.craftPageOffset.value + VILLAGE_UI_MAX_TAB_ELM_DRAW)
                        this.UI.addTextZone("no one can craft it", 20, 9999, '#ff0000', VILLAGE_UI_FONT)
                    pageVertiElm++
                }  
                for (var i in pl) {
                    var p = pl[i]
                    var buto = this.getPlayerIcone(p, 25)
                    if (village.phase == PHASE_ACTIONPLAYER) {
                        buto.push({
                            type : "button",
                            mouseLight : "88",
                            callback : village.TryCraftItem,
                            callback_data : {craft : c, player : p},
                            txt : "craft",
                            txt_color :  "#000000",
                            max_letters : 9999,
                            letter_size : 25,
                            txt_font : VILLAGE_UI_FONT_BUTTON_2,
                            fillColor : "#00D238",
                            strokeColor : this.craftSelected == c ? "#000000ff" : "#00000000",
                            windowInfo : [{
                                callback : () => {return c.description},
                                input : undefined,
                            }]
                        })
                    }
                    if (pageVertiElm >= this.craftPageOffset.value && pageVertiElm <  this.craftPageOffset.value + VILLAGE_UI_MAX_TAB_ELM_DRAW)
                        this.UI.addHorizontalElem(buto)
                    pageVertiElm++
                }
            }
        }
    }

    this.GetDrawBuildingElement = (b, size_x) => {
        var res = [{
            type : "img",
            img : world.Imgs[b.imgIcon].img,
            len_x : size_x,
            len_y : size_x,
        },{
            type : "button",
            mouseLight : "ff",
            callback : (bt) => {this.batSelected = this.batSelected == bt ? undefined : bt},
            callback_data : b,
            txt : b.name,
            txt_color : this.batSelected == b ? '#dddddd' : "#000000",
            max_letters : 9999,
            letter_size : size_x,
            txt_font : VILLAGE_UI_FONT_BUILDINGNAME,
            fillColor : VILLAGE_UI_BAT_ELM_FILLCOLOR,
            strokeColor : this.batSelected == b ? "#000000ff" : "#00000000",
            windowInfo : [{
                callback : (b) => {if (typeof(b.description) == "function") return b.description(b);
                                    if (typeof(b.description) == "string") return (b.description)},
                input : b
            }]
        }]
        return res
    }



    this.GetNextTurnButton = (warning, showWarning, txt) => {
        var buto = {
                type : "button",
                mouseLight : "88",
                callback : world.village.End_Turn,
                callback_data : {warning : warning ? true : false},
                txt : txt,
                txt_color : "#000000",
                max_letters : 9999,
                letter_size : 40,
                txt_font : VILLAGE_UI_FONT_BUTTON_2,
                fillColor : showWarning ? "#FFAD1C" : "#00D238",
                strokeColor : "#000000"
        }
        return buto
    }

    this.getPlayerIcone = (p, size) => {
        if (!p)
            return undefined
        var size = size ? size : 40
        var UIplayerName = [{
            type : "button",
            mouseLight : "ff",
            txt : p.name,
            callback : (p) => {this.playerSelected = this.playerSelected == p ? undefined : p},
            callback_data : p,
            txt_color : p.lvlup ? "#00ff00" : this.playerSelected == p ? "#ffffff" : "#000000",
            max_letters : 9999,
            letter_size : size,
            txt_font : VILLAGE_UI_FONT_PLAYERNAME,
            fillColor : VILLAGE_UI_PLAYER_ELM_FILLCOLOR,
            strokeColor : this.playerSelected == p ? "#000000ff" : "#00000000",
            windowInfo : [{
                callback : p.getVillageUItext,
            }]
        }]
        if (!p.bodyPartImgReady)
            p.LoadPlayerVillageImage()
        UIplayerName.push({
            type : "img",
            img : p.bodyPartImg,
            len_x : size,
            len_y : size,
        })
        if (p.weapon)
            UIplayerName.push({
                type : "img",
                img : world.playerDefaultImgs[p.weapon.name + "_icon"].img,
                len_x : size,
                len_y : size,
            })
        return UIplayerName 
    }

    this.draw_villagePlayerUi = () => {
        var village = world.village
        this.UIplayers = new MyUI(this.canvas, 0, 0, 10, this.scale, this.background, this.stroke, this.marge)
        //this.UIplayers.addTextZone("Players", 40, 9999, '#000000', VILLAGE_UI_FONT_PHASE)
        this.UIplayers.addButton("Players", 40, '#000000', "#00000000", "#00000000", () => {this.showUIplayers = !(this.showUIplayers)}, undefined, VILLAGE_UI_FONT_PHASE)
        var firstline = this.GetPageSelector({selector : this.playersPageOffset})
        if (this.playerSelected && this.tabs[this.activeTabId] != 'Player' && (village.phase == PHASE_PLACEPLAYER || village.phase == PHASE_ACTIONPLAYER))
            firstline.push({
                type : "button",
                mouseLight : "88",
                callback : this.GoToTabName,
                callback_data : {tab : 'Player'},
                txt : "Show",
                txt_color : "#000000",
                max_letters : 9999,
                letter_size : 30,
                txt_font : VILLAGE_UI_FONT_PLAYERNAME,
                fillColor : "#ffffff"
            })
        this.UIplayers.addHorizontalElem(firstline)
        var pageVertiElm = 0
        if (this.showUIplayers) {
            if (!this.playerInfoMenu) {
                for (var z in village.players) {
                    var p = village.players[z]
                    //name of the player
                    if (pageVertiElm >= this.playersPageOffset.value && pageVertiElm <  this.playersPageOffset.value + VILLAGE_UI_MAX_TAB_ELM_DRAW)
                        this.UIplayers.addHorizontalElem(this.getPlayerIcone(p))
                    pageVertiElm++

                    if (p.lvlup && village.phase != PHASE_NEWTURN) {
                        if (pageVertiElm >= this.playersPageOffset.value && pageVertiElm <  this.playersPageOffset.value + VILLAGE_UI_MAX_TAB_ELM_DRAW)
                            this.UIplayers.addButton("lvl up", 10, "#ffffff", "#ff080888", "#000000", this.GoToTabName, {tab : 'Player', player : p}, VILLAGE_UI_FONT_BUTTON, undefined, () => {return "go to player tab for lvl up"}, "ff") 
                        pageVertiElm++
                    }


                    //the bat where the player is
                    var batp = world.village.getBatFromPlayer(p)
                    if (batp) {
                        var playerBat = [{
                            type : "txt",
                            txt : batp.name,
                            txt_color : this.batSelected == batp ? '#888888' : "#000000",
                            max_letters : 9999,
                            letter_size : 15,
                            txt_font : VILLAGE_UI_FONT_BUILDINGNAME
                        },{
                            type : "img",
                            img : world.Imgs[batp.imgIcon].img,
                            len_x : 20,
                            len_y : 20,
                        }]
                        if (village.phase == PHASE_PLACEPLAYER)
                            playerBat.push({
                                type : "button",
                                mouseLight : "88",
                                callback : world.village.removePlayerFromBat,
                                callback_data : {player : p},
                                txt : " leave ",
                                txt_color : "#000000",
                                max_letters : 9999,
                                letter_size : 10,
                                txt_font : VILLAGE_UI_FONT_PLAYERNAME,
                                fillColor : "#ff0000"
                            })
                        if (pageVertiElm >= this.playersPageOffset.value && pageVertiElm <  this.playersPageOffset.value + VILLAGE_UI_MAX_TAB_ELM_DRAW)
                            this.UIplayers.addHorizontalElem(playerBat)
                        pageVertiElm++
                    }
                    //buton under players name
                    var elm = []

                    if (village.phase == PHASE_PLACEPLAYER && this.batSelected && this.tabs[this.activeTabId] == "building"
                            && this.batSelected.player_size && !this.batSelected.players_inside.find(a => a == p) && !batp && !this.batBuildMenu && this.batSelected.players_inside.length < this.batSelected.player_size)
                        elm.push({
                            type : "button",
                            mouseLight : "88",
                            callback : world.village.affectPlayerToBat,
                            callback_data : {
                                player : p,
                                bat : this.batSelected
                            },
                            txt : "add to building",
                            txt_color : "#000000",
                            max_letters : 9999,
                            letter_size : 20,
                            txt_font : VILLAGE_UI_FONT_BUTTON_2,
                            fillColor : VILLAGE_UI_BUTTON_FILLCOLOR
                        })
                    if (elm.length) {
                        if (pageVertiElm >= this.playersPageOffset.value && pageVertiElm <  this.playersPageOffset.value + VILLAGE_UI_MAX_TAB_ELM_DRAW)
                            this.UIplayers.addHorizontalElem(elm)
                        pageVertiElm++
                    }
                    if (this.tabs[this.activeTabId] == "Items") {
                        
                        if (this.playerSelected == p) {
                            if (village.phase == PHASE_PLACEPLAYER && p.weapon) {
                                if (pageVertiElm >= this.playersPageOffset.value && pageVertiElm <  this.playersPageOffset.value + VILLAGE_UI_MAX_TAB_ELM_DRAW)
                                    this.UIplayers.addButton("unequip weapon", 20, '#000000', VILLAGE_UI_BUTTON_FILLCOLOR, '#000000', p.unequipWeapon, undefined, VILLAGE_UI_FONT_BUTTON_2, undefined, undefined, "88")
                                pageVertiElm++
                            }
                            if (village.phase == PHASE_PLACEPLAYER && p.armor) {
                                if (pageVertiElm >= this.playersPageOffset.value && pageVertiElm <  this.playersPageOffset.value + VILLAGE_UI_MAX_TAB_ELM_DRAW)
                                    this.UIplayers.addButton("unequip armor", 20, '#000000', VILLAGE_UI_BUTTON_FILLCOLOR, '#000000', p.unequipArmor, undefined, VILLAGE_UI_FONT_BUTTON_2, undefined, undefined, "88")
                                pageVertiElm++
                            }    
                            if (village.phase == PHASE_PLACEPLAYER && this.itemSelected && this.itemSelected.itemType == "weapon") {
                                if (pageVertiElm >= this.playersPageOffset.value && pageVertiElm <  this.playersPageOffset.value + VILLAGE_UI_MAX_TAB_ELM_DRAW)
                                    this.UIplayers.addButton("equip weapon", 20, '#000000', VILLAGE_UI_BUTTON_FILLCOLOR, '#000000', p.equipWeapon, {weapon : this.itemSelected}, VILLAGE_UI_FONT_BUTTON_2, undefined, undefined, "88")
                                pageVertiElm++
                            }
                            if (village.phase == PHASE_PLACEPLAYER && this.itemSelected && this.itemSelected.itemType == "armor") {
                                if (pageVertiElm >= this.playersPageOffset.value && pageVertiElm < this.playersPageOffset.value + VILLAGE_UI_MAX_TAB_ELM_DRAW)
                                    this.UIplayers.addButton("equip armor", 20, '#000000', VILLAGE_UI_BUTTON_FILLCOLOR, '#000000', p.equipArmor, {armor : this.itemSelected}, VILLAGE_UI_FONT_BUTTON_2, undefined, undefined, "88")
                                pageVertiElm++
                            }
                        }
                    }
                }
            }
            if (this.playerInfoMenu) {
                if (pageVertiElm >= this.playersPageOffset.value && pageVertiElm <  this.playersPageOffset.value + VILLAGE_UI_MAX_TAB_ELM_DRAW)
                    this.UIplayers.addTextZone(this.playerInfoMenu.getVillageUItext(), 40, 9999, '#000000', VILLAGE_UI_FONT)
                pageVertiElm++
            }
        }
        this.UIplayers.drawUI()
    }

    this.draw_newTurnPhase = () => {
        var village = world.village
        var txt = "New Turn ! "
        txt += world.village.getDateText()
        if (village.foodconsumedLastTurn)
            txt += "\nYour village consumed " + village.foodconsumedLastTurn + " food last week"
        for (var z in village.players) {
            var p = village.players
            if (p.lvlup)
                txt += "\n" + p.name + " can lvl up"
        }
        this.UI.addTextZone(txt, 30, 9999, '#000000', VILLAGE_UI_FONT)
        this.UI.addHorizontalElem([this.GetNextTurnButton(false, false, "Start Turn")])
    }

    this.draw_battlePhase = () => {
        var village = world.village
        if (village.battle)
            this.UI.addTextZone("Your Village is attacked !!", 40, 9999, '#000000', VILLAGE_UI_FONT)
        else
            this.UI.addTextZone("Your village is safe\nYou can start next turn", 40, 9999, '#000000', VILLAGE_UI_FONT)
        this.UI.addHorizontalElem([this.GetNextTurnButton(false, false, village.battle ? "Start Battle" : "Next Turn")])
    }

    this.draw_ItemsTab = () => {
        var village = world.village

        this.UI.addHorizontalElem(this.GetPageSelector({selector : this.itemsPageOffset}))
        var pageVertiElm = 0

        if (village.phase != PHASE_PLACEPLAYER)
            this.UI.addTextZone("you can only equip weapon during Phase 1", 20, 9999, '#ff0000', VILLAGE_UI_FONT)
        if (!village.Items.length)
            this.UI.addTextZone("you don't have any weapon in your village", 20, 9999, '#000000', VILLAGE_UI_FONT)
        for (var z in village.Items) {
            var wp = village.Items[z]
            if (pageVertiElm >= this.itemsPageOffset.value && pageVertiElm <  this.itemsPageOffset.value + VILLAGE_UI_MAX_TAB_ELM_DRAW)
                this.UI.addHorizontalElem(this.getItemIcone(wp, 20))
            pageVertiElm++
        }
    }



    this.draw_NextTurnTab = () => {
        var village = world.village
        switch (village.phase) {
            case PHASE_PLACEPLAYER :
                this.UI.addTextZone(world.village.getDateText(), 20, 9999, '#000000', VILLAGE_UI_FONT)
                var txt = "  During Phase 1, you can"
                txt += "\n-equip items"
                txt += "\n-affect players to a building"
                txt += "\n-start the construction of new building"
                txt += "\n\nbefore start Phase 2, you must affect at least 1 player to 'Defend Village'"
                this.UI.addTextZone(txt, 20, 9999, '#000000', VILLAGE_UI_FONT)
                var endTurnButon = [
                    this.GetNextTurnButton(true, this.warningEndTurnMessage.length, "Start Phase 2")
                ]
                this.UI.addHorizontalElem(endTurnButon)
                if (this.warningEndTurnMessage.length) {
                    for (var w in this.warningEndTurnMessage) {
                        var elms = []
                        elms.push({
                            type : "txt",
                            txt : this.warningEndTurnMessage[w].txt,
                            txt_color : "#000000",
                            max_letters : 9999,
                            letter_size : 20,
                            txt_font : VILLAGE_UI_FONT
                        })
                        if (this.warningEndTurnMessage[w].player || this.warningEndTurnMessage[w].bat || this.warningEndTurnMessage[w].tab) {
                            elms.push({
                                type : "button",
                                callback : this.GoToTabName,
                                callback_data : this.warningEndTurnMessage[w],
                                txt : "look",
                                txt_color : "#000000",
                                mouseLight : "88",
                                max_letters : 9999,
                                letter_size : 20,
                                txt_font : VILLAGE_UI_FONT_BUTTON_2,
                                fillColor : VILLAGE_UI_BUTTON_FILLCOLOR,
                                strokeColor : "#000000",
                                windowInfo : [{
                                    callback : () => {return ("page up")},
                                }]
                            })
                        }
                        this.UI.addHorizontalElem(elms)
                    }
                }
                break
            case PHASE_ACTIONPLAYER :
                this.UI.addTextZone(world.village.getDateText(), 20, 9999, '#000000', VILLAGE_UI_FONT)
                var txt = "  During Phase 2, players can spend Action Point for work in their affected building"
                txt += "\n-recolt resource in the forest"
                txt += "\n-progress on the construction of new buildings"
                txt += "\n-craft weapons and armors"
                txt += "\n\nDuring this Phase, you can NOT change equipment or players affected building"
                this.UI.addTextZone(txt, 20, 9999, '#000000', VILLAGE_UI_FONT)

                //end turn
                var endTurnButon = [
                    this.GetNextTurnButton(true, this.warningEndTurnMessage.length, "End Turn")
                ]
                if (this.warningEndTurnMessage.length)
                    endTurnButon.push(this.GetNextTurnButton(false, this.warningEndTurnMessage.length, "Force End Turn"))
                this.UI.addHorizontalElem(endTurnButon)
                if (this.warningEndTurnMessage.length) {
                    for (var w in this.warningEndTurnMessage) {
                        var elms = []
                        elms.push({
                            type : "txt",
                            txt : this.warningEndTurnMessage[w].txt,
                            txt_color : "#000000",
                            max_letters : 9999,
                            letter_size : 20,
                            txt_font : VILLAGE_UI_FONT
                        })
                        if (this.warningEndTurnMessage[w].player || this.warningEndTurnMessage[w].bat || this.warningEndTurnMessage[w].tab) {
                            elms.push({
                                type : "button",
                                callback : this.GoToTabName,
                                callback_data : this.warningEndTurnMessage[w],
                                txt : "look",
                                txt_color : "#000000",
                                mouseLight : "88",
                                max_letters : 9999,
                                letter_size : 20,
                                txt_font : VILLAGE_UI_FONT_BUTTON_2,
                                fillColor : VILLAGE_UI_BUTTON_FILLCOLOR,
                                strokeColor : "#000000",
                                windowInfo : [{
                                    callback : () => {return ("page up")},
                                }]
                            })
                        }
                        this.UI.addHorizontalElem(elms)
                    }
                }
                break
        }
    }

    this.draw_playerTab = () => {
        var village = world.village
        if (!this.playerSelected)
            return this.UI.addTextZone("No player selected", VILLAGE_UI_LETTER_SIZE, 9999, '#000000', VILLAGE_UI_FONT)
        var p = this.playerSelected

        var elm = this.getPlayerIcone(p, 80)
        this.UI.addHorizontalElem(elm)
        
        var batp = world.village.getBatFromPlayer(p)
        if (batp) {
            var playerBat = [{
                type : "txt",
                txt : batp.name,
                txt_color : this.batSelected == batp ? '#888888' : "#000000",
                max_letters : 9999,
                letter_size : 25,
                txt_font : VILLAGE_UI_FONT_BUILDINGNAME
            },{
                type : "img",
                img : world.Imgs[batp.imgIcon].img,
                len_x : 25,
                len_y : 25,
            }]
            if (village.phase == PHASE_PLACEPLAYER)
                playerBat.push({
                    type : "button",
                    mouseLight : "88",
                    callback : world.village.removePlayerFromBat,
                    callback_data : {player : p},
                    txt : " leave ",
                    txt_color : "#000000",
                    max_letters : 9999,
                    letter_size : 10,
                    txt_font : VILLAGE_UI_FONT_PLAYERNAME,
                    fillColor : "#ff0000"
                })
            this.UI.addHorizontalElem(playerBat)

        }

        if (!p.weapon)
            this.UI.addTextZone("no weapon equiped", 20, 9998, "#555555", VILLAGE_UI_FONT)
        else {
            var elms = this.getItemIcone(p.weapon, 30, true)
            if (village.phase == PHASE_PLACEPLAYER)
                elms.push({
                    type : "button",
                    callback : p.unequipWeapon,
                    callback_data : undefined,
                    txt : " x ",
                    txt_color : "#000000",
                    mouseLight : "88",
                    max_letters : 9999,
                    letter_size : 20,
                    txt_font : VILLAGE_UI_FONT_BUTTON_2,
                    fillColor : "#ff0000",
                    strokeColor : "#000000",
                    windowInfo : [{
                        callback : () => {return ("unequip weapon")},
                    }]
                })
            this.UI.addHorizontalElem(elms)
        }
        if (!p.armor)
            this.UI.addTextZone("no armor equiped", 20, 9998, "#555555", VILLAGE_UI_FONT)
        else {
            var elms = this.getItemIcone(p.armor, 30, true)
            if (village.phase == PHASE_PLACEPLAYER)
                elms.push({
                    type : "button",
                    callback : p.unequipArmor,
                    callback_data : undefined,
                    txt : " x ",
                    txt_color : "#000000",
                    mouseLight : "88",
                    max_letters : 9999,
                    letter_size : 20,
                    txt_font : VILLAGE_UI_FONT_BUTTON_2,
                    fillColor : "#ff0000",
                    strokeColor : "#000000",
                    windowInfo : [{
                        callback : () => {return ("unequip armor")},
                    }]
                })
            this.UI.addHorizontalElem(elms)
        }

        if (p.lvlup && p.lvlupList && p.lvlupList.length > 0) {
            for (var z in p.lvlupList) {
                var elm = p.lvlupList[z]
                this.UI.addButton(elm.stat + " " + elm.value, 40, '#000000', "#00ff00", "#000000", p.ApplyListPerkUp, elm, VILLAGE_UI_FONT_BUTTON, undefined, undefined, "ff")
            }
        }
        else if (p.lvlup) {
            this.UI.addButton("Lvl up +1", 60, '#000000', "#ffff00", "#000000", p.getLvlUpPerkList, undefined, VILLAGE_UI_FONT_BUTTON, undefined, undefined, "ff")
        }

        elm = []
        var txt = " Action Point Max (Battle) " + p.ActionPointMax
        txt += "\nLife Max : " + p.lifeMax ,
        txt += "\nSpeed : " + p.speed
        txt += "\nMove AP cost " + p.movePCost
        for (var z in p.stats)
            txt += "\n" + z + " " + p.stats[z]
        elm.push({
            type : "txt",
            txt : txt,
            txt_color : "#000000",
            max_letters : 9999,
            letter_size : 20,
            txt_font : VILLAGE_UI_FONT
        })
        var txt2 = " Action Point (Village) " + p.villageActionPoint + "/" + p.villageActionPointMax
        txt2 += "\nLvl : " + p.lvl
        txt2 += "\nSurvived " + p.age + " weeks"
        elm.push({
            type : "txt",
            txt : txt2,
            txt_color : "#000000",
            max_letters : 9999,
            letter_size : 20,
            txt_font : VILLAGE_UI_FONT
        })
        this.UI.addHorizontalElem(elm)

    }

    this.draw_resource_tab = () => {
        var village = world.village
        for (var z in village.resources) {
            var res = []
            var r = village.resources[z]
            if (r == undefined)
                continue
            res.push({
                type : "txt",
                txt : z,
                txt_color : "#000000",
                max_letters : 9999,
                letter_size : 20,
                txt_font : VILLAGE_UI_FONT
            })
            res.push({
                type : "img",
                img : world.Imgs[z + "_icon"].img,
                len_x : 20,
                len_y : 20,
            })
            res.push({
                type : "txt",
                txt : " " + r,
                txt_color : "#000000",
                max_letters : 9999,
                letter_size : 20,
                txt_font : VILLAGE_UI_FONT
            })
            this.UI.addHorizontalElem(res)
        }
    }

    this.draw_tab_selector = () => {
        var tabsUI = []
        tabsUI.push({
            type : "button",
            mouseLight : "88",
            callback : () => {this.activeTabId = this.activeTabId - 1 >= 0 ? this.activeTabId - 1 : this.tabs.length - 1},
            txt : "<",
            txt_color : VILLAGE_UI_TABS_TXTCOLOR,
            max_letters : 9999,
            letter_size : 40,
            txt_font : VILLAGE_UI_TABS_FONT,
            fillColor : VILLAGE_UI_TABS_FILLCOLOR
        })
        tabsUI.push({
            type : "button",
            mouseLight : "88",
            callback : () => {this.activeTabId = this.activeTabId + 1 < this.tabs.length ? this.activeTabId + 1 : 0},
            txt : ">",
            txt_color : VILLAGE_UI_TABS_TXTCOLOR,
            max_letters : 9999,
            letter_size : 40,
            txt_font : VILLAGE_UI_TABS_FONT,
            fillColor : VILLAGE_UI_TABS_FILLCOLOR
        })
        tabsUI.push({
            type : "button",
            mouseLight : "ff",
            callback : () => {this.activeTabId = undefined},
            callback_data : undefined,
            txt : this.tabs[this.activeTabId],
            txt_color : VILLAGE_UI_TABS_TXTCOLOR,
            max_letters : 9999,
            letter_size : 40,
            txt_font : VILLAGE_UI_TABS_FONT,
            fillColor : VILLAGE_UI_TABS_FILLCOLOR,
        })
        this.UI.addHorizontalElem(tabsUI)
    }

    this.draw_UI_EventMessage = () => {
        var village = world.village
        this.UIsystem = new MyUI(this.canvas, this.UIplayers.lenx + this.UI.lenx, 0, 10, this.scale, this.background, this.stroke, this.marge)

        this.UIsystem.addTextZone("Events", 40, 9999, '#000000', VILLAGE_UI_FONT_PHASE)
        this.UIsystem.addHorizontalElem([
            {
                type : "button",
                mouseLight : "88",
                callback : () => {this.eventPage = this.eventPage > 0 ? this.eventPage - 1 : this.eventPage},
                txt : "∧",
                txt_color : "#ff0000",
                max_letters : 9999,
                letter_size : 20,
                txt_font : VILLAGE_UI_FONT_BUTTON,
                fillColor : '#55aaaa'
            },{
                type : "button",
                mouseLight : "88",
                callback : () => {this.eventPage = this.eventPage < village.MessageSystem.msg.length - 1 ? this.eventPage + 1 : this.eventPage},
                txt : "∨", 
                txt_color : "#ff0000",
                max_letters : 9999,
                letter_size : 20,
                txt_font : VILLAGE_UI_FONT_BUTTON,
                fillColor : '#55aaaa'
        }])

        var msgs = village.MessageSystem.getMessageSystem({page : this.eventPage})
        for (var y in msgs) {
            var z = msgs.length - y - 1
            var color = "#000000"
            switch (msgs[z].type) {  
                case "job" : 
                    color = "#006400"
                    break 
                case "building" :
                    color = "#a52a2a"
                    break
                case "player" : 
                    color = "#0000ff"
                    break                    
                default : 
                    color = '#000000'
                    break
            }
            if (msgs[z].type == "resource")
                this.UIsystem.addHorizontalElem(this.getResourcesTextAndImg(msgs[z].txt, 20))
            else
                this.UIsystem.addTextZone(msgs[z].txt, 20, 9999, color, VILLAGE_UI_FONT)
        }
        this.UIsystem.drawUI()
    }

    this.drawVillageUI = () => {
        if (!world.village)
            return
        var village = world.village
        this.needRedraw = false
        this.canvas.GetCanvasPos()
        this.canvas.cleanCanvas()
        
        this.draw_villagePlayerUi()

        this.UI = new MyUI(this.canvas, this.UIplayers.lenx, 0, 10, this.scale, this.background, this.stroke, this.marge)
        if (!this.showUI)
            this.UI.addButton("Menu", 40, '#000000', "#00000000", "#00000000", () => {this.showUI = !(this.showUI)}, undefined, VILLAGE_UI_FONT_PHASE)
        else if (this.showUI) {
            switch (village.phase) {
                case PHASE_PLACEPLAYER :
                    this.UI.addButton("Phase 1 : Place Players", 40, '#000000', "#00000000", "#00000000", () => {this.showUI = !(this.showUI)}, undefined, VILLAGE_UI_FONT_PHASE)
                    break
                case PHASE_ACTIONPLAYER :
                    this.UI.addButton("Phase 2 : Action Players", 40, '#000000', "#00000000", "#00000000", () => {this.showUI = !(this.showUI)}, undefined, VILLAGE_UI_FONT_PHASE)
                    break
            }
            if (this.activeTabId === undefined) {
                for (var z in this.tabs) {
                    var tabsUI = []
                    tabsUI.push({
                        type : "button",
                        mouseLight : "ff",
                        callback : (z) => {this.activeTabId = parseInt(z)},
                        callback_data : z,
                        txt : this.tabs[z],
                        txt_color : VILLAGE_UI_TABS_TXTCOLOR,
                        max_letters : 9999,
                        letter_size : 40,
                        txt_font : VILLAGE_UI_TABS_FONT,
                        fillColor : VILLAGE_UI_TABS_FILLCOLOR,
                    })
                    this.UI.addHorizontalElem(tabsUI)
                }
            }
            else if (village.phase == PHASE_NEWTURN)
                this.draw_newTurnPhase()
            else if (village.phase == PHASE_COMBAT)
                this.draw_battlePhase()
            else {
                this.draw_tab_selector()
                switch (this.tabs[this.activeTabId]) {
                    case 'Next Turn' :
                        this.draw_NextTurnTab()
                        break
                    case 'building':
                        this.draw_building_tab()
                        break
                    case 'craft':
                        this.draw_craft_menu()
                        break
                    case 'resource':
                        this.draw_resource_tab()
                        break
                    case 'Items':
                        this.draw_ItemsTab()
                        break
                    case 'Player':
                        this.draw_playerTab()
                        break
                }
            }
        }
        
        this.UI.drawUI()

        this.draw_UI_EventMessage()

        this.CheckInfoWindow(false)
    }



}
var IMG_TO_LOAD = [
    ["player_test3/village/resource", "food_icon"],
    ["player_test3/village/resource", "wood_icon"],
    ["player_test3/village/resource", "stone_icon"],
    ["player_test3/village/resource", "coal_icon"],
    ["player_test3/village/resource", "woodplank_icon"],

    ["player_test3/village/building", "forest_icon"],
    ["player_test3/village/building", "defend_village_icon"],
    ["player_test3/village/building", "workshop_icon"],
    ["player_test3/village/building", "Houses"],
    ["player_test3/village/building", "Mine"],
    ["player_test3/village/building", "bow_workshop_icon"],
    ["player_test3/village/building", "sawmill"],

    ["player_test3/village/resource", "villageAP_icon"],
    ["player_test3/village/resource", "under_construction_icon"],
]

var id = 0;



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

PLAYER_ID = 1000        //each player have a unic id

//prevent menu to open when right click pressed
document.oncontextmenu = rightClick;  
function rightClick(clickEvent) {
    clickEvent.preventDefault();
}




window.onload = function() {

    const Screen = new CanvasManager()
    Screen.addCanvas("mapFloor", 0)
    Screen.addCanvas("players", 1)
    Screen.addCanvas("mapTopElem", 2)
    Screen.addCanvas("mapUI", 3)
    Screen.addCanvas("GameUI", 4)

    world = new World(Screen)
    world.init()
    //world.CreateBattleMap()

    var lastTime = new Date().getTime()



    setInterval(() => {
        if (!world || !world.Controler)
            return
        var now = new Date().getTime()
        if (world.GameUI)
            world.GameUI.fps = Math.floor(1000 /(now - lastTime))
        lastTime = now

        if (world.players && world.players.Playerturn && world.players.Playerturn.team == TEAM_AI && !world.players.Playerturn.AI.turnFinished) {
            var test = world.players.playerList.find(a => a.animation.length > 0)
            if (!test) {
                test = world.players.Playerturn.playAIturn()
                console.log("test turn finished : " + test)
                if (test)
                    world.players.Playerturn.AI.turnFinished = true
            }
                
        }
        world.Controler.CheckControlInput()

        if (world.map && world.map.needRedraw) {
            Screen.canList["mapFloor"].GetCanvasPos()
            Screen.canList["mapFloor"].cleanCanvas()
            Screen.canList["mapTopElem"].GetCanvasPos()
            Screen.canList["mapTopElem"].cleanCanvas()
            world.map.set_drawing_map(Screen.canList["mapFloor"].canvas)
            world.map.draw_map(Screen.canList["mapFloor"], Screen.canList["mapTopElem"], Screen.canList["mapUI"])            
        }
        if (world.players) {
            Screen.canList["players"].GetCanvasPos()
            Screen.canList["players"].cleanCanvas()
            
            world.players.drawPlayers()
            scale_changed = false
        }
        if (world.GameUI) {
            world.GameUI.CheckInfoWindow(false)
            if (world.GameUI.needRedraw) {
                world.GameUI.drawGameUI()
            }
        }
        if (world.villageUI) {
            world.villageUI.CheckInfoWindow(false)
            if (world.villageUI.needRedraw) {
                world.villageUI.drawVillageUI()
                console.log("redraw village UI")
            }
        }
    }, 20);
    
}
