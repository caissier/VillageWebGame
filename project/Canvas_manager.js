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

