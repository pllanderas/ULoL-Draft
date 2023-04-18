// Your web app's Firebase configuration
var firebaseConfig = {
  apiKey: "AIzaSyA_tKZn_B5xmTJX6vXeycuARANVcH3gcTA",
  authDomain: "ulol-940d6.firebaseapp.com",
  databaseURL: "https://ulol-940d6-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "ulol-940d6",
  storageBucket: "ulol-940d6.appspot.com",
  messagingSenderId: "643404582299",
  appId: "1:643404582299:web:8ecb30dcbce7a6644f253e"
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);

// initialize database
const db = firebase.database();
const fetchBans = db.ref("bans/");
const fetchPicks = db.ref("picks/");
const username = prompt("Nombre:");
// const username = "Name"

let playerId;
let playerRef;
let playerDataName;

let playerDataTeam;
let control = {
  phaseDisplay : null,
  timerTime : null,
  timerType : null
  
}
// let phaseDisplay;

var backgroundMusic;
var timer;

var timerElement;
var phaseDisplayElement;
var banTimerInputElement;
var pickTimerInputElement;
var chatTeamSelectorElement;
var specTeamChat;

window.onload = function() {
  timerElement = document.getElementById('timer')
  phaseDisplayElement = document.getElementById("phase")
  backgroundMusic = document.getElementById("myAudio");
  banTimerInputElement = document.getElementById("banTime");
  pickTimerInputElement = document.getElementById("pickTime");
  chatTeamSelectorElement = document.getElementById("colorSelector");
  document.getElementById("message-form").addEventListener("submit", sendMessage);
  backgroundMusic.loop;
  backgroundMusic.volume = 0.01
  banTimerInputElement.value = 60
  pickTimerInputElement.value = 120
  // document.body.style.cursor = url("/assets/hand1.png")
  playMusic()
  hide_or_show("st","none")
  hide_or_show("st2","none")
  checkboxes()
}
// var timerTime;

function playMusic(){
  backgroundMusic.play();
}

firebase.auth().onAuthStateChanged((user) => {
  console.log(user)
  if(user) {
    // console.log("loggeado")
    playerId = user.uid
    playerRef = firebase.database().ref(`players/${playerId}`)
    playerRef.set({
      id: playerId,
      name: username,
      team: ""
    })

    playerRef.onDisconnect().remove()

    playerRef.on("value", (snapshot) => {
      let playerData = snapshot.val();
      if(playerData){
        playerDataTeam = playerData.team
        playerDataName = playerData.name
      }
    });

  } else {
    // window.location.href = "index.html";
  }
})

firebase.auth().signInAnonymously().catch((error) =>{
  var errorCode = error.code;
  var errorMessage = error.message;
  console.log(errorCode,errorMessage)
})



// send message to db
function sendMessage(e) {
  e.preventDefault();

  // get values to be submitted
  const timestamp = Date.now();
  const messageInput = document.getElementById("message-input");
  const message = messageInput.value;
  var team;
  if (playerDataTeam == "spec") {
    team = chatTeamSelectorElement.value
  } else {
    team = playerDataTeam
  }
  // clear the input box
  messageInput.value = "";

  //auto scroll to bottom
  document
    .getElementById("messages")
    .scrollIntoView({ behavior: "smooth", block: "end", inline: "nearest" });

  // create db collection and send in the data
  db.ref("messages/"+ timestamp).set({
    team,
    username,
    message,
  });
}

// display the messages
// reference the collection created earlier
// document.getElementById("message-form").addEventListener("submit", sendMessage);
// const fetchChat = db.ref("messages/"+playerDataTeam+"/");

// // check for new messages using the onChildAdded event listener
// fetchChat.on("child_added", function (snapshot) {
//   const messages = snapshot.val();
//   const message = `<li class=${
//     username === messages.username ? "sent" : "receive"
//   }><span>${messages.username}: </span>${messages.message}</li>`;
//   // append the message on the page
//   document.getElementById("messages").innerHTML += message;
// });

const fetchChat = db.ref("messages/");



// check for new messages using the onChildAdded event listener
fetchChat.on("child_added", function (snapshot) {
  const messages = snapshot.val();
  // console.log(messages)
  if (messages.team == playerDataTeam || messages.team == "all") {
    const message = `<li class=${
      username === messages.username ? "sent" : "receive"
    }><span>${messages.username}: </span>${messages.message}</li>`;
    // append the message on the page
    document.getElementById("messages").innerHTML += message;

  } else if (playerDataTeam == "spec") {
    const message = `<li class=${
    username === messages.username ? "sent" : "receive"
    }><span>${messages.team} - ${messages.username}: </span>${messages.message}</li>`;
    // append the message on the page
    document.getElementById("messages").innerHTML += message;
  }
});

/****************************************************************************************************************
*                                                GESTION de equipos                                             *
****************************************************************************************************************/
function hide_or_show(team, show){
  var r = document.getElementsByClassName(team)
  for (var i = 0; i < r.length; i++) {
    r[i].style.display = show;
  }
}

function joinBlue(){
  playMusic()
  playerRef.update({
    team: "blue"
  })
  noTimer = 0;
  control.phaseDisplay = "Idel"
  hide_or_show("redButton","none")
  hide_or_show("st","none")
  hide_or_show("st2","none")
}

function joinRed(){
  playMusic()
  playerRef.update({
    team: "red"
  })
  noTimer = 0;
  control.phaseDisplay = "Idel"
  hide_or_show("blueButton","none")
  hide_or_show("st","none")
  hide_or_show("st2","none")
}

function joinTotal(){
  playMusic()
  hide_or_show("st","")
  hide_or_show("st2","")
  playerRef.update({
    team: "spec"
  })
  control.phaseDisplay = "Idel"
  hide_or_show("blueButton","")
  hide_or_show("redButton","")
}

const phase = firebase.database().ref("phase")


let noTimer = 0;
phase.on("value", (snapshot) => {
  let p = snapshot.val();

  if (playerDataTeam == "spec" || p == null) {
    return
  }

  //Update control data for players
  control.phaseDisplay = p.value;
  control.timerTime = p.time;
  control.timerType = p.timerType;

  phaseDisplayElement.innerHTML = "Fase de: " + control.phaseDisplay

  // if (p.timerType == 1) {
  if (p.value == "bans") {
    console.log("Fase de baneos")
    noTimer=1;
    timerElement.style.display=""
    timer = setInterval(updateCountdown,1000);

  // } else if(p.timerType == 2 && noTimer==1){
  } else if(p.value == "picks"){
    console.log("Fase de picks")
    noTimer=2;
    endBans()
    timerElement.style.display=""
    timer = setInterval(updateCountdown,1000);
  }

  if(control.phaseDisplay == "mirror") {
    console.log("Fase de mirror")

    alert("Ha ocurrido Mirror Pick, espera a las indicaciones del arbitro")
  }

  if (control.phaseDisplay == "game") {
    console.log("Fase de juego")

    endPicks()
  }
});

function start(){
  if (playerDataTeam != "spec") {
    console.log("No eres arbitro")
    return
  }

  //Prepare the exit clause
  phase.onDisconnect().remove()

  //DEBUG Purpose only
  // control.timerTime = 30;
  // console.log(banTimerInputElement.value)
  control.phaseDisplay = "bans"
  phaseDisplayElement.innerHTML = "Fase de: " + control.phaseDisplay
  control.timerTime = banTimerInputElement.value
  //Initialize the phase system
  phase.set({
    value: control.phaseDisplay, //Phase
    time: control.timerTime, //Timer time
    timerType: 1 //Timer type: 0 - no timer, 1 - Bans, 2 - Pick, 3 - End
  })

  //Restart bans and picks from last game
  db.ref("bans").remove()
  db.ref("picks").remove()
  db.ref("messages").remove()



  //Admin time control
  control.timerTime = parseInt(control.timerTime) + 5
  console.log("el timer es: " + control.timerTime)
  timer = setInterval(updateCountdownAdmin,1000);

}

function updateCountdownAdmin() {

  //maths and timer display
  const min = Math.floor(control.timerTime/60);
  let seconds = control.timerTime % 60;
  seconds = seconds < 10 ? '0' + seconds: seconds;
  timerElement.innerHTML = `${min}:${seconds}`
  control.timerTime--;

  if(control.timerTime <= 0){
    clearInterval(timer);

    if(control.phaseDisplay=="bans") {
      phaseDisplayElement.innerHTML = "Fase de validación de: " + control.phaseDisplay
      timerElement.style.display=""
      console.log("END BANS - arbitro")
      endBans()

    } else if(control.phaseDisplay =="picks"){ //TODO - Mirror check?
      timerElement.style.display="none"
      console.log("END PICKS - arbitro")
      console.log("Checking Mirror Pick")

      mirror = checkMirror()
      
      console.log("Mirror: ", mirror)
      // mirror = true

      if(mirror) {

        control.phaseDisplay = "mirror"
        control.timerTime = 0
        control.timerType = 3
        phaseDisplayElement.innerHTML = "Fase de: " + control.phaseDisplay
  
        phase.update({
          value: control.phaseDisplay,
          time: control.timerTime,
          timer: control.timerType
        })

        alert("Mirror Pick, decide quien gana la elección:")
        openPopup()

        // endPicks()
      }

    }
  }
}

function startPicks(){
  control.phaseDisplay = "picks"
  control.timerTime = pickTimerInputElement.value
  control.timerType = 2
  phaseDisplayElement.innerHTML = "Fase de: " + control.phaseDisplay

  phase.update({
    value: control.phaseDisplay,
    time: control.timerTime,
    timer: control.timerType
  })
  
  timer = setInterval(updateCountdownAdmin,1000);
}

function startGame() {
  control.phaseDisplay = "game"
  control.timerTime = 0
  control.timerType = 3
  phaseDisplayElement.innerHTML = "Fase de: " + control.phaseDisplay

  phase.update({
    value: control.phaseDisplay,
    time: control.timerTime,
    timer: control.timerType
  })
  endPicks()
}

function updateCountdown() {
  const min = Math.floor(control.timerTime/60);
  let seconds = control.timerTime % 60;
  seconds = seconds < 10 ? '0' + seconds: seconds;
  timerElement.innerHTML = `${min}:${seconds}`
  control.timerTime--;

  if(control.timerTime <= 0){
    clearInterval(timer);
    phaseDisplayElement.innerHTML = "Fase de validación de: " + control.phaseDisplay
    if(control.phaseDisplay=="bans") {
      console.log("END BANS - player")
      timerElement.style.display="none"
      // endBans()

    } else if(control.phaseDisplay =="picks"){
      console.log("END PICKS - player")
      timerElement.style.display="none"
      // endPicks()
    }
  }
  
}

var coin
function openPopup() {
  var coin = window.open("coinFlip/coin.html", "coin", "width=400,height=400");
}
var newWindow
function test(){
  // alert("Mirror Pick, decide quien gana la elección:")openPopup()
  openPopup()
  var newWindow = window.open("popups/confirm.html", "popup", "width=400,height=400");
  // openPopup()
  console.log("Hola Caracola")

}