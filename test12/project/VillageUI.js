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
    this.activeTabId = 1

    this.playerSelected = undefined
    this.playerInfoMenu = undefined
    this.playersPageOffset = {value : 0}

    this.batSelected = undefined
    this.batBuildMenu = undefined
    this.batPageOffset = {value : 0}

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

    this.draw_building_tab = () => {
        var village = world.village
        this.UI.addHorizontalElem(this.GetPageSelector(this.batPageOffset))
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
                    if (b.player_size) {
                        if (b.player_size && pageVertiElm >= this.batPageOffset.value && pageVertiElm <  this.batPageOffset.value + VILLAGE_UI_MAX_TAB_ELM_DRAW)
                            this.UI.addTextZone("" + b.players_inside.length + " / " + b.player_size + " place", 20, 9999, '#000000', VILLAGE_UI_FONT)
                        pageVertiElm++
                    }
                    if (this.playerSelected && !b.players_inside.find(a => a == this.playerSelected))
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
                    if (this.batSelected == b || (p.villageActionPoint && b.name != "Defend Village")) {
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
                type : "txt",
                txt : " x" + resources[z],
                txt_color : "#000000",
                max_letters : 9999,
                letter_size : size,
                txt_font : VILLAGE_UI_FONT
            })
            elms.push({
                type : "img",
                img : world.Imgs[z + "_icon"].img,
                len_x : size,
                len_y : size,
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
        this.UI.addHorizontalElem(this.GetPageSelector(this.craftPageOffset))
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
                callback : (a) => {return a},
                input : b.description
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
            txt_color : this.playerSelected == p ? "#ffffff" : "#000000",
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
        this.UIplayers.addHorizontalElem(this.GetPageSelector(this.playersPageOffset))
        var pageVertiElm = 0
        if (this.showUIplayers) {
            if (!this.playerInfoMenu) {
                for (var z in village.players) {
                    var p = village.players[z]
                    //name of the player
                    if (pageVertiElm >= this.playersPageOffset.value && pageVertiElm <  this.playersPageOffset.value + VILLAGE_UI_MAX_TAB_ELM_DRAW)
                        this.UIplayers.addHorizontalElem(this.getPlayerIcone(p))
                    pageVertiElm++
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
                            && this.batSelected.player_size && !this.batSelected.players_inside.find(a => a == p) && !batp && !this.batBuildMenu)
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
        this.UI.addTextZone(txt, 40, 9999, '#000000', VILLAGE_UI_FONT)
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

        this.UI.addHorizontalElem(this.GetPageSelector(this.itemsPageOffset))
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
        var txt2 = " Action Point (Village) " + p.villageActionPoint + "/" + p.villageActionPoint
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