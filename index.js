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
let playerDataTeam;
let playerDataName;
let phaseDisplay;
var timerElement;
var phaseDisplayElement;
var timer;
var backgroundMusic;
window.onload = function() {
  timerElement = document.getElementById('timer')
  phaseDisplayElement = document.getElementById("phase")
  backgroundMusic = document.getElementById("myAudio");
  backgroundMusic.loop;
  backgroundMusic.volume = 0.10
  playMusic()
}
var timerTime;

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
      // console.log("Cambio")
      // console.log(snapshot)
      let playerData = snapshot.val();
      if(playerData){
        playerDataTeam = playerData.team
        playerDataName = playerData.name
      }
      // console.log(playerData.name); // logs the player's name
      // console.log(playerData.team); // logs the player's team
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

  // clear the input box
  messageInput.value = "";

  //auto scroll to bottom
  document
    .getElementById("messages")
    .scrollIntoView({ behavior: "smooth", block: "end", inline: "nearest" });

  // create db collection and send in the data
  db.ref("messages/" + timestamp).set({
    username,
    message,
  });
}

// display the messages
// reference the collection created earlier
// const fetchChat = db.ref("messages/");

// // check for new messages using the onChildAdded event listener
// fetchChat.on("child_added", function (snapshot) {
//   const messages = snapshot.val();
//   const message = `<li class=${
//     username === messages.username ? "sent" : "receive"
//   }><span>${messages.username}: </span>${messages.message}</li>`;
//   // append the message on the page
//   document.getElementById("messages").innerHTML += message;
// });


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
  hide_or_show("redButton","none")
}

function joinRed(){
  playMusic()

  playerRef.update({
    team: "red"
  })

  hide_or_show("blueButton","none")

}
// console.log()
hide_or_show("st","none")
function joinTotal(){
  playMusic()

  playerRef.update({
    team: "spec"
  })

  hide_or_show("blueButton","")
  hide_or_show("redButton","")
}

const phase = firebase.database().ref("phase")
let noTimer = 0;
phase.on("value", (snapshot) => {
  let p = snapshot.val();
  phaseDisplay = p.value;
  timerTime = p.time;
  phaseDisplayElement.innerHTML = "Fase de: " + phaseDisplay

  if (p.timer == 1 && noTimer==0 && playerDataTeam != "spec") {
    noTimer=1;
    timerElement.style.display=""
    var time = timerTime
    timer = setInterval(updateCountdown,1000);

  } else if(p.timer == 2 && noTimer==1 && playerDataTeam != "spec"){
    noTimer=2;
    endBans()
    timerElement.style.display=""
    var time = timerTime
    timer = setInterval(updateCountdown,1000);
  }


});

function start(){

  phase.onDisconnect().remove()

  timerTime = 30;
  phase.set({
    value: "bans",
    time: timerTime,
    timer: 1
  })

  db.ref("bans").remove()
  db.ref("picks").remove()



  var time = timerTime
  // timerElement.style.display=""
  timer = setInterval(updateCountdownAdmin,1000);

}

function updateCountdownAdmin() {
  const min = Math.floor(timerTime/60);
  let seconds = timerTime % 60;
  seconds = seconds < 10 ? '0' + seconds: seconds;
  timerElement.innerHTML = `${min}:${seconds}`
  timerTime--;
  if(timerTime <= 0) {
    timerElement.innerHTML= "0:00"
  }

  if(timerTime <= -5){
    clearInterval(timer);
    if(phaseDisplay=="bans") {
      timerElement.style.display=""
      console.log("END BANS")
      phase.update({
        value: "picks",
        time: 60,
        timer: 2
      })
      var time = timerTime
      timer = setInterval(updateCountdownAdmin,1000);
      endBans()
    } else if(phaseDisplay =="picks"){
      console.log("END PICKS")
      phase.update({
        value: "game",
        time: 0,
        timer: 5
      })
      timerElement.style.display="none"
      endPicks()
    }
  }
}

function updateCountdown() {
  const min = Math.floor(timerTime/60);
  let seconds = timerTime % 60;
  seconds = seconds < 10 ? '0' + seconds: seconds;
  timerElement.innerHTML = `${min}:${seconds}`
  timerTime--;

  if(timerTime <= 0){
    clearInterval(timer);
    if(phaseDisplay=="bans") {
      console.log("END BANS")
      var time = timerTime
      // timer = setInterval(updateCountdown,1000);
      timerElement.style.display="none"
      endBans()
    } else if(phaseDisplay =="picks"){
      console.log("END PICKS")
      timerElement.style.display="none"
      endPicks()
    }
  }
  
}

function playMusic(){
  backgroundMusic.play();
}