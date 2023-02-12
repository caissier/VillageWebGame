
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
