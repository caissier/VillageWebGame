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