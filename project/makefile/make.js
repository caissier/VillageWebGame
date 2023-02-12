var fs = require('fs');



function mergeFile(main,append_file){

    var data = fs.readFileSync(append_file)
    console.log("Read file"+append_file);
    fs.appendFileSync(main,'\n'+data)
    console.log("Done "+append_file + " in " + main);
}

var src = "../"
var dst = "../../"

var comp_list={
    'script.js' : [
        'SoundManager.js',
        'ToolsBox.js',
        'LoadImage.js',
        'myUI.js',
        'Canvas_manager.js',
        'Map.js',
        'Player.js',
        'GameUI.js',
        'Controler.js',
        'Weapon.js',
        'Armor.js',
        'Village.js',
        'VillageUI.js',
        'World.js',
        'main.js',
    ],
    //'combine.css':['3.css','2.css','1.css']
}
for(var key in comp_list) {
    // delete a file
    try {
        if (fs.existsSync(dst + key)) { //if file exist
            fs.unlinkSync(dst + key)    //delete file
            console.log("File " + dst + key + "is deleted.")
        }
      } catch(err) {
        console.error(err)
      }

    for(var idx of comp_list[key]){
        mergeFile(dst + key,src + idx);    //add the file to the main file
}}