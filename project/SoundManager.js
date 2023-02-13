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