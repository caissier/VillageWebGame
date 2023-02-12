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
            world.Music.playSound("click")
        }
        for (var z in this.keyUp) {
            if (!GameUigetInput && z.startsWith("Digit") || z.startsWith("Numpad"))
                z = z.replace("Digit", "").replace("Numpad", "")
            if (world.GameUI && !GameUigetInput && world.GameUI.getKeyInput(z)) {
                world.Music.playSound("click")
                GameUigetInput = true
                if (world.GameUI)
                    world.GameUI.needRedraw = true;
                break
            }
            if (world.villageUI && world.villageUI.getKeyInput(z)) {
                world.Music.playSound("click")
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
                world.Music.playSound("click")
                GameUigetInput = true
                if (world.GameUI)
                    world.GameUI.needRedraw = true;
            }
            if (!GameUigetInput && world.villageUI && world.villageUI.getMouseInput(this.inputclick)) {
                world.Music.playSound("click")
                GameUigetInput = true
                if (world.villageUI)
                    world.villageUI.needRedraw = true;
            } 
        }
        this.inputclick = undefined
  
    }
}