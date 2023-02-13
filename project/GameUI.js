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
