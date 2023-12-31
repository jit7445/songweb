let currentsong = new Audio()
var playButton = document.getElementById("play11");
let songs;
let currentFolder;
function secondsToMinutesAndSeconds(seconds) {
    if (isNaN(seconds) || seconds < 0) {
        return "invalid input";
    }
    const minutes = Math.floor(seconds / 60);
    const remainingSecond = Math.floor(seconds % 60)
    const formattedMinutes = String(minutes).padStart(2, '0');
    const formattedSeconds = String(remainingSecond).padStart(2, '0')
    return `${formattedMinutes}:${formattedSeconds}`

}
//
async function getsong(folder) {
    currentFolder = folder;
    let s = await fetch(`http://127.0.0.1:5501/${folder}/`)
    let response = await s.text();

    // console.log(response)
    let div = document.createElement("div")
    div.innerHTML = response;
    //sorting all a songs
    let sonlink = div.getElementsByTagName("a")
    // console.log(sonlink);
    songs = [];
    // sorting only songs anchor tag
    for (let i = 0; i < sonlink.length; i++) {
        if (sonlink[i].href.endsWith(".mp3")) {
            songs.push(sonlink[i].href.split(`/${folder}/`)[1])
            //    console.log(sonlink[i].href)

        }
    }

    //all song in playlist
    let songul = document.querySelectorAll('.songlist1>ul')[0];
    songul.innerHTML = ""
    for (let song of songs) {
        songul.innerHTML = songul.innerHTML + `

     <li class="list">
     <img src="icons/music.svg" alt="">
     <div class="info">
         <div>${song.replaceAll("%20", " ")}</div>
         <div>song artist</div>

     </div>
    <div class="playnow">
     <span>play now</span>
     <img src="icons/play.svg" class="invert" alt="">
    </div>
 </li>
     `
    }
    //song play on click
    let list = document.querySelector(".songlist1").getElementsByTagName("li");
    Array.from(list).forEach(element => {
        element.addEventListener("click", e => {
            // console.log(element.querySelector(".info").firstElementChild.innerHTML);

            playMusic(element.querySelector(".info").firstElementChild.innerHTML.trim())

        })
    })
    return songs;



}
function playMusic(e, paused = false) {

    currentsong.src = `/${currentFolder}/` + e;
    if (!paused) {
        currentsong.play();
        playButton.src = "icons/pause.svg";
    }

    // currentsong.play();
    // var songduration=currentsong.duration;

    document.querySelector(".songinfo").innerHTML = decodeURI(e)
    document.querySelector(".times").innerHTML = "00:00/00:00";

}
async function displayalbum() {
    let s = await fetch(`http://127.0.0.1:5501/songs/`)
    let response = await s.text();

    // console.log(response)
    let div = document.createElement("div")
    div.innerHTML = response;
    // console.log(div)
    let anchor = div.getElementsByTagName("a");
    let card_container = document.querySelector(".card_container")
    let array = Array.from(anchor)

    for (let i = 0; i < array.length; i++) {
        const e = array[i]
        //console.log(e.href)
        if (e.href.includes("/songs/")) {
            let folder = (e.href.split("/").slice(-2)[1])
            console.log(e.href)
            //meta data of folder

            let s = await fetch(`http://127.0.0.1:5501/songs/${folder}/info.json`)
            let response = await s.json();
            card_container.innerHTML = card_container.innerHTML + `
           <div data-folder="${folder}" class="card rounded">
           <div class="img">
               <div  class="play"><a href="#"><svg xmlns="http://www.w3.org/2000/svg" width="34" height="34" viewBox="0 0 35 35" fill="none" id="play">
                   <circle cx="50%" cy="50%" r="50%" fill="#00FF00" />
                   <path fill="#000" d="M10 5.2V6.741a1 1 0 0 1 3.104-.864l9.015 5.26a1 1 0 0 1 0 8.727l-9.015 5.259A1 1 0 0 1 9 20.259Z" />
                 </svg></a>
               </div> 
               <div class="image"> <a href="#">  <img src="/songs/${folder}/cover.jpeg" alt="" class="image2 rounded"></a></div>
             
           </div>
           <h3>${response.title}</h3>
           <p>${response.description}</p>
       </div>
           `

        }
    }
    //load folder
    Array.from(document.getElementsByClassName("card")).forEach(e => {
        e.addEventListener("click", async (items) => {
            console.log("folder")
            songs = await getsong(`songs/${items.currentTarget.dataset.folder}`);
            console.log(items.currentTarget.dataset)

        })
    })

}

async function main() {
    //get song from any folder inside songs folder
    await getsong("songs/ncs");
    playMusic(songs[0], true)
    //display all album
    await displayalbum()


    //play on clik prev and next and play
    playButton.addEventListener("click", (e) => {
        console.log("clicked")
        if (currentsong.paused) {
            currentsong.play();
            playButton.src = "icons/pause.svg"; // Assuming play button is an image
        } else {
            currentsong.pause();
            playButton.src = "icons/play.svg";
        }
    })
    //time update
    currentsong.addEventListener("timeupdate", () => {
        // console.log(currentsong.duration,currentsong.currentTime)
        document.querySelector(".times").innerHTML = `${secondsToMinutesAndSeconds(currentsong.currentTime)} / ${secondsToMinutesAndSeconds(currentsong.duration)}`
        // console.log(secondsToMinutesAndSeconds(currentsong.duration))
        document.querySelector(".circle").style.left = (currentsong.currentTime / currentsong.duration) * 100 + "%"
    }
    )
    // seekbar event lister
    document.querySelector(".seekbar").addEventListener("click", (e) => {
        // console.log(e.offsetX,e.offsetY)
        // console.log("seek bar")
        let percentageplayed = (e.offsetX / e.target.getBoundingClientRect().width) * 100
        document.querySelector(".circle").style.left = (e.offsetX / e.target.getBoundingClientRect().width) * 100 + "%";
        currentsong.currentTime = currentsong.duration * percentageplayed / 100
    })
    //humburger event lister
    document.querySelector(".humburgercontainer").addEventListener("click", () => {
        document.querySelector(".left").style.left = "0"
    })
    //close 
    document.querySelector(".close").addEventListener("click", () => {
        document.querySelector(".left").style.left = "-150%"
    }
    )
    // prev button 
    previous.addEventListener("click", () => {
        let index = songs.indexOf(currentsong.src.split("/").slice(-1)[0])
        //console.log(songlist,index)
        if (index - 1 >= 0) {
            playMusic(songs[index - 1])
        }
    })
    //next button
    next.addEventListener("click", () => {
        // index of song
        let index = songs.indexOf(currentsong.src.split("/").slice(-1)[0])
        if (index + 1 < songs.length) {
            playMusic(songs[index + 1])
        }
        else {
            playMusic(songs[index - 1])
        }
    })
    //volume control
    document.querySelector(".range").getElementsByTagName("input")[0].addEventListener("change", (e) => {
        currentsong.volume = parseInt(e.target.value) / 100;
    })
    //muted button
    document.querySelector(".volume>img").addEventListener("click", e => {
        if (e.target.src.includes("icons/volume.svg")) {
            e.target.src = "icons/mute.svg"
            currentsong.volume = 0;
            document.querySelector(".range").getElementsByTagName("input")[0].value = 0;
        }
        else {
            e.target.src = "icons/volume.svg"
            currentsong.volume = .10;
            document.querySelector(".range").getElementsByTagName("input")[0].value = 10;
        }

    })
}

main()

