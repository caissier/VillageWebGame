

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