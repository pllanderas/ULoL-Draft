var roleBans = {
      tanques: false,
      luchadores: false,
      magos: false,
      tiradores: false,
      asesinos: false,
      apoyo: false
}

function checkboxes() {
      document.getElementById("tanques").checked = roleBans.tanques;
      document.getElementById("luchadores").checked = roleBans.luchadores;
      document.getElementById("magos").checked = roleBans.magos;
      document.getElementById("tiradores").checked = roleBans.tiradores;
      document.getElementById("asesinos").checked = roleBans.asesinos;
      document.getElementById("apoyo").checked = roleBans.apoyo;

      document.getElementById("tanques").addEventListener("change", function () {
            roleBans.tanques = this.checked;
            applyGrayFilterToBannedChampions()
      });

      document.getElementById("luchadores").addEventListener("change", function () {
            roleBans.luchadores = this.checked;
            applyGrayFilterToBannedChampions()
      });

      document.getElementById("magos").addEventListener("change", function () {
            roleBans.magos = this.checked;
            applyGrayFilterToBannedChampions()
      });

      document.getElementById("tiradores").addEventListener("change", function () {
            roleBans.tiradores = this.checked;
            applyGrayFilterToBannedChampions()
      });

      document.getElementById("asesinos").addEventListener("change", function () {
            roleBans.asesinos = this.checked;
            applyGrayFilterToBannedChampions()
      });

      document.getElementById("apoyo").addEventListener("change", function () {
            roleBans.apoyo = this.checked;
            applyGrayFilterToBannedChampions()
      });

}

var roleList = {
      "Tanques": [
            "Alistar",
            "Amumu",
            "Blitzcrank",
            "Braun",
            "Cho'gath",
            "Dr. Mundo",
            "Galio",
            "Leona",
            "Malphite",
            "Maokai",
            "Nasus",
            "Nautilus",
            "Ornn",
            "Poppy",
            "Ramus",
            "Rell",
            "Sejuani",
            "Shen",
            "Singed",
            "Sion",
            "Skarner",
            "Tahm Kench",
            "Zac",
            "Nunu & Willump",
            "Thresh",
            "Kassadin"
      ],
      "Luchadores": [
            "Aatrox",
            "Camille",
            "Darius",
            "Fiora",
            "Gangplank",
            "Garen",
            "Gwen",
            "Hecarim",
            "Irelia",
            "Jarvan IV",
            "Illaoi",
            "Jax",
            "Kled",
            "Lee Sin",
            "Mordekaiser",
            "Olaf",
            "Renekton",
            "Riven",
            "Sett",
            "Sylas",
            "Trundle",
            "Tryndamere",
            "Udyr",
            "Urgot",
            "Viego",
            "VI",
            "Volibear",
            "Warwick",
            "Wukong",
            "Xin Zhao",
            "Yasuo",
            "Yone",
            "Yorick",
            "Vel'Koz",
            "Gnar",
            "Shyvana",
            "Rumble",
            "Lillia",
            "Diana",
            "Pantheon"
      ],
      "Magos": [
            "Anivia",
            "Annie",
            "Aurelion Sol",
            "Azir",
            "Brand",
            "Cassiopeia",
            "Fiddlesticks",
            "Gragas",
            "Heimerdinger",
            "Karthus",
            "Kennen",
            "Lissandra",
            "Lux",
            "Malzahar",
            "Morgana",
            "Neeko",
            "Orianna",
            "Ryze",
            "Seraphine",
            "Swain",
            "Syndra",
            "Taliyah",
            "Twisted Fate",
            "Veigar",
            "Vel'Koz",
            "Vex",
            "Viktor",
            "Vladimir",
            "Xerath",
            "Ziggs",
            "Zoe",
            "Zyra"
      ],
      "Tiradores": [
            "Akshan",
            "Aphelios",
            "Ashe",
            "Caitlyn",
            "Draven",
            "Ezreal",
            "Jhin",
            "Jinx",
            "Kaisa",
            "Kalista",
            "Kindred",
            "Kog Maw",
            "Lucian",
            "Miss Fortune",
            "Quinn",
            "Samira",
            "Senna",
            "Sivir",
            "Tristana",
            "Varus",
            "Vayne",
            "Xayah",
            "Zeri",
            "Nylah",
            "Twitch",
            "Corki",
            "Teemo",
            "Graves",
            "Kayle"
      ],
      "Asesinos": [
            "Ahri",
            "Akali",
            "Ekko",
            "Elise",
            "Evelynn",
            "Fizz",
            "Kassadin",
            "Katarina",
            "Kayn",
            "Kha'zix",
            "Leblanc",
            "Nidalee",
            "Pyke",
            "Qiyana",
            "Rek'sai",
            "Rengar",
            "Shaco",
            "Talon",
            "Zed",
            "Jayce",
            "Maestro Yi",
            "Nocturne"
      ],
      "Apoyo": [
            "Bard",
            "Ivern",
            "Janna",
            "Karma",
            "Lulu",
            "Nami",
            "Rakan",
            "Sona",
            "Soraka",
            "Renata",
            "Yummi",
            "Taric",
            "Zilean"
      ]
}

function applyGrayFilterToBannedChampions() {
      console.log(roleList)
      for (let role in roleList) {
            var champions = roleList[role];
            for (let index = 0; index < champions.length; index++) {
                  var championName = champions[index];
                  var img = document.getElementById(championName);
                  console.log(championName)
                  console.log(img)
                  if (img) {
                        if (isChampionBanned(role)) {
                              // img.style.filter = "grayscale(100%)";
                              img.classList.add('red-filter');
                        } else {
                              // img.style.filter = "none";
                              img.classList.remove('red-filter')
                        }
                  }
            }
      }
}

function isChampionBanned(role) {
      return roleBans[role.toLowerCase()];
}