championsList = []
currentPatch = 0
selected = null
champ = null

let blueBans = ["./img/square.png","./img/square.png","./img/square.png","./img/square.png","./img/square.png"]
let redBans = ["./img/square.png","./img/square.png","./img/square.png","./img/square.png","./img/square.png"]

let bluePicks = ["./img/square.png","./img/square.png","./img/square.png","./img/square.png","./img/square.png"]
let redPicks = ["./img/square.png","./img/square.png","./img/square.png","./img/square.png","./img/square.png"]

function clean(){
    blueBans = ["./img/square.png","./img/square.png","./img/square.png","./img/square.png","./img/square.png"]
    redBans = ["./img/square.png","./img/square.png","./img/square.png","./img/square.png","./img/square.png"]
    
    bluePicks = ["./img/square.png","./img/square.png","./img/square.png","./img/square.png","./img/square.png"]
    redPicks = ["./img/square.png","./img/square.png","./img/square.png","./img/square.png","./img/square.png"] 
}

async function load(){
    const patchResponse = await fetch("https://ddragon.leagueoflegends.com/api/versions.json");
    var patchRaw = await patchResponse.json();
    currentPatch = patchRaw[0]

    const listResponse = await fetch("https://ddragon.leagueoflegends.com/cdn/" + currentPatch + "/data/en_US/champion.json");
    // Storing data in form of JSON
    var listRaw = await listResponse.json();
    var data = listRaw.data;
    for (let key in data) {
        championsList.push(key)
    }

    // Affichage des champions de la liste
    var list = document.getElementById("list")
    var defaultImg = document.createElement("img")
    defaultImg.src = "./img/square.png"
    defaultImg.classList.add("champImg")
    defaultImg.onclick = function () { imageListClick(this) }
    list.appendChild(defaultImg)

    for (let index = 0; index < championsList.length; index++) {
        var img = document.createElement("img")
        img.src = "https://ddragon.leagueoflegends.com/cdn/" + currentPatch + "/img/champion/" + championsList[index] + ".png"
        img.classList.add("champImg")
        img.id = championsList[index]
        img.onclick = function () { imageListClick(this) }
        list.appendChild(img)
    }

    // var defaultImg = document.createElement("img")
    // defaultImg.src = "./img/square.png"
    // defaultImg.classList.add("champImg")
    // defaultImg.onclick = function () { imageListClick(this) }
    // list.appendChild(defaultImg)
}

load()



function pickBanClick(element){
    // console.log(playerDataTeam)
    // console.log(playerDataTeam+"Team")
    // console.log(playerId)
    // console.log(element.classList)
    // Cas à traiter
    if(!element.classList.contains(playerDataTeam+"Team")){
        return
    }

    if(selected == null){
        selected = element
        element.classList.add("selected")
    }else if(!element.classList.contains("selected")){     
        // On clique sur un élément pas sélectionné
        selected.classList.remove("selected") 
        selected = element
        element.classList.add("selected")
    }else if(element.classList.contains("selected")){ 
        // On clique sur un élément déjà sélectionné
        selected == null
        element.classList.remove("selected")
    }
}

function imageListClick(element){
    // Cas à traiter
    // Si élément sélectionné remplace + griser
    if(selected != null){
        console.log(element)
        var selId = selected.name
        if(selected.classList.contains("banImg")){

            
            //Eliminar
            if(element.src.includes("square")){
                if (playerDataTeam == "blue") {
                    // var index = blueBans.indexOf(selected.src)
                    // blueBans.splice(index,1)
                    // blueBans[index]= "./img/square.png"
                    blueBans[selId]= "./img/square.png"
                    db.ref("bans/blue").set({
                        blueBans
                    });
                } else {
                    // var index = redBans.indexOf(selected.src)
                    // redBans.splice(index,1)
                    // redBans[index]= "./img/square.png"
                    redBans[selId]= "./img/square.png"
                    db.ref("bans/red").set({
                        redBans
                    });
                }
                selected.src = element.src
            } else {
    
                selected.src = element.src
    
                if (playerDataTeam == "blue") {
                    // blueBans.push(element.src)
                    blueBans[selId] = element.src
                    db.ref("bans/blue").set({
                        blueBans
                    });
                } else {
                    // redBans.push(element.src)
                    redBans[selId] = element.src
                    db.ref("bans/red").set({
                        redBans
                    });
                }
            }
        } else if (selected.classList.contains("pickImg")){
            if(element.src.includes("square")){
                if (playerDataTeam == "blue") {
                    // var index = bluePicks.indexOf(selected.src)
                    // bluePicks.splice(index,1)
                    blueBans[selId]= "./img/square.png"
                    db.ref("picks/blue").set({
                        bluePicks
                    });
                } else {
                    // var index = redPicks.indexOf(selected.src)
                    // redPicks.splice(index,1)
                    redBans[selId]= "./img/square.png"
                    db.ref("picks/red").set({
                        redPicks
                    });
                }
                selected.src = element.src
            } else {
                
                if(element.src)

                selected.src = element.src
    
                if (playerDataTeam == "blue") {
                    // bluePicks.push(element.src)
                    bluePicks[selId] = element.src
                    db.ref("picks/blue").set({
                        bluePicks
                    });
                } else {
                    redPicks[selId] = element.src
                    db.ref("picks/red").set({
                        redPicks
                    });
                }
            }
        } else {
            selected.src = element.src
        }

        
    }
}

function filterListResults(element){
    filter = element.value.toLowerCase()
    for (let index = 0; index < championsList.length; index++) {
        if(championsList[index].toLowerCase().includes(filter)){
            document.getElementById(championsList[index]).style.display = "initial"
        }else{
            document.getElementById(championsList[index]).style.display = "none"
        }
    }
}

function endBans(){
    fetchBans.once("value").then(function (snapshot) {
        console.log("Obteniendo todos los Bans")
        // console.log(playerDataTeam)
        // console.log(snapshot.val())
        // console.log(phaseDisplay)
        bans = snapshot.val()
        if(!bans){
            console.log("No hay baneos tras la ronda")
            return
        }
    
        blue = bans.blue
        if(blue){
            blueBans = blue.blueBans
            updateBlueBans()
        }
        red = bans.red
        if(red){
            redBans = red.redBans
            updateRedBans()
        }
        console.log("test?")
        markBans()
    });

}

function endPicks(){
    fetchPicks.once("value").then(function (snapshot) {
        console.log("Obteniendo todos los picks")
        // console.log(playerDataTeam)
        // console.log(snapshot.val())
        // console.log(phaseDisplay)
        picks = snapshot.val()
        if(!picks){
            console.log("No hay picks")
            return
        }

        blue = picks.blue
        if(blue){
            bluePicks = blue.bluePicks
            updateBluePicks()
        }
        red = picks.red
        if(red){
            redPicks = red.redPicks
            updateRedPicks()
        }
    });
}

fetchBans.on("value", function (snapshot) {
    // console.log("fBans")
    // console.log(playerDataTeam)
    // console.log(snapshot.val())
    // console.log(phaseDisplay)
    bans = snapshot.val()
    if(!bans){
        console.log("No hay baneos")
        return
    }

    if(playerDataTeam=="spec") {
        blue = bans.blue
        if(blue){
            blueBans = blue.blueBans
            updateBlueBans()
        }
        red = bans.red
        if(red){
            redBans = red.redBans
            updateRedBans()
        }

    }

    if(playerDataTeam=="blue"){
        blue = bans.blue
        if(blue){
            blueBans = blue.blueBans
            updateBlueBans()
        }

        if(phaseDisplay=="picks") {
            red = bans.red
            if(red){
                redBans = red.redBans
                updateRedBans()
            }
        }
    }

    if (playerDataTeam=="red"){
        red = bans.red
        if(red){
            redBans = red.redBans
            updateRedBans()
        }

        if(phaseDisplay=="picks") {
            blue = bans.blue
            if(blue){
                blueBans = blue.blueBans
                updateBlueBans()
            }
        }
    }
});

fetchPicks.on("value", function (snapshot) {
    // console.log("fBans")
    // console.log(playerDataTeam)
    // console.log(snapshot.val())
    // console.log(phaseDisplay)
    picks = snapshot.val()
    if(!picks){
        console.log("No hay picks")
        return
    }

    if(playerDataTeam=="spec") {
        blue = picks.blue
        if(blue){
            bluePicks = blue.bluePicks
            updateBluePicks()
        }
        red = picks.red
        if(red){
            redPicks = red.redPicks
            updateRedPicks()
        }

    }

    if(playerDataTeam=="blue"){
        blue = picks.blue
        if(blue){
            bluePicks = blue.bluePicks
            updateBluePicks()
        }

        if(phaseDisplay=="game") {
            red = picks.red
            if(red){
                redPicks = red.redPicks
                updateRedPicks()
            }
        }
    }

    if (playerDataTeam=="red"){
        red = picks.red
        if(red){
            redPicks = red.redPicks
            updateRedPicks()
        }

        if(phaseDisplay=="game") {
            blue = picks.blue
            if(blue){
                bluePicks = blue.bluePicks
                updateBluePicks()
            }
        }
    }
});

function updateBlueBans(){
    var elements = document.querySelectorAll(".blueBan");
    var i=0
    blueBans.forEach(ban => {
        elements[i].src = ban;
        i++;
    });
}

function updateRedBans(){
    var elements = document.querySelectorAll(".redBan");
    var i=0
    redBans.forEach(ban => {
        elements[i].src = ban;
        i++;
    });
}

function updateBluePicks(){
    var elements = document.querySelectorAll(".bluePick");
    var i=0
    bluePicks.forEach(pick => {
        elements[i].src = pick;
        i++;
    });
}

function updateRedPicks(){
    var elements = document.querySelectorAll(".redPick");
    var i=0
    redPicks.forEach(pick => {
        elements[i].src = pick;
        i++;
    });
}

function markBans(){
    var img = document.getElementsByClassName("champImg");
    console.log(img)

    for (let c of img) {
        console.log(c)
        if (!c.src.includes("square")){
            if(blueBans.includes(c.src) || redBans.includes(c.src)){
                console.log("a gris")
                c.style.filter = "grayscale(100%)";
            }
        }
    }
}