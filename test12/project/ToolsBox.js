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
    