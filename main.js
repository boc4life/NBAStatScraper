const axios = require("axios");
const cheerio = require("cheerio");
const DB = require("./DAL/db");

const teams = ["PHI", "BOS", "NYK", "BRK", "TOR", "UTA", "POR", "OKC", "DEN", "MIN", "CLE", "IND", "MIL", "CHI", "DET", "LAL", "PHO", "LAC", "GSW", "SAC", "ORL", "ATL", "MIA", "CHO", "WAS", "NOP", "HOU", "DAL", "SAS", "MEM"]
const month = process.argv[2];
const day = process.argv[3];
const year = process.argv[4];
let playerArr = [];
let promiseArr = [];
let otI = 8;

function scrape() {
return new Promise((resolve, reject) => {

for (let i =0; i < teams.length; i++) {
    promiseArr.push(new Promise((resolve, reject) =>{

    const url = `https://www.basketball-reference.com/boxscores/${year}${month}${day}0${teams[i]}.html`
    // const url = 'https://www.basketball-reference.com/boxscores/202101040GSW.html'

    axios.get(url).then(response => {
    const $ = cheerio.load(response.data);

    let oppId = $("table")[8].attribs.id
    opponent = oppId.split("-")[1]
    let teamId = $("table")[0].attribs.id
    team = teamId.split("-")[1]
    
    // overtime check
    if (opponent == team) {
        otI = 9
    // If there is OT, iterate until value of otI correctly identifies both teams, then decrement at end to account for final iteration
        do {                
            let oppId = $("table")[otI].attribs.id
            opponent = oppId.split("-")[1]
            otI++
        } while (opponent == team)
        otI--
    }

    $("table").each((i, element) => {
        let opponent;
        let team;

        if (i == 0) {
            let oppId = $("table")[otI].attribs.id
            opponent = oppId.split("-")[1]
            let teamId = $("table")[0].attribs.id
            team = teamId.split("-")[1]
        }

        else if (i == otI) {
            let oppId = $("table")[0].attribs.id
            opponent = oppId.split("-")[1]
            let teamId = $("table")[otI].attribs.id
            team = teamId.split("-")[1]
        }        


        // console.log($("table")[0].attribs, $("table")[otI].attribs, i)
        if (element.attribs.id.includes("basic") && 
            element.attribs.id.includes("game")) {
            $(element).find("tbody").children("tr").each((i, element) => {
                // filter out middle table header row
                if (!$(element).attr("class")) {
                   
                    //initialize player object
                    let player = {
                        ddCat: 0,
                        doubleDouble: 0,
                        tripleDouble: 0
                    };
                    
                    // get player name
                    // TODO: Get rid of unneeded each loop
                    $(element).children("th").each((i, element) => {
                        if ($(element).attr("csk")) {
                        const playerName = $(element).attr("csk").split(",").reverse().join().replace(',', ' ');
                        player.name = playerName;
                        }
                    })

                    // get minutes played
                    let mpArray = $(element).children("td[data-stat=mp]").text().split(":")
                    if (mpArray[0]) {
                    mpArray[0] = parseInt(mpArray[0])

                    if (mpArray[1][0] >= 3) mpArray[0]++

                    if (isNaN(mpArray[0])) mpArray[0] = 0
                    else player.mp = mpArray[0]
                    }
                    else {
                    player.mp = 0
                    }
                    
                    // get FGM
                    if ($(element).children("td[data-stat=fg]").text() == '') {
                        player.fgm = 0
                    }
                    else {
                        player.fgm = parseInt($(element).children("td[data-stat=fg]").text())
                    }

                    // get FGA
                    if ($(element).children("td[data-stat=fga]").text() == '') {
                        player.fga = 0
                    }
                    else {
                        player.fga = parseInt($(element).children("td[data-stat=fga]").text())
                    }

                    // get 3pM
                    if ($(element).children("td[data-stat=fg3]").text() == '') {
                        player.tpm = 0
                    }
                    else {
                        player.tpm = parseInt($(element).children("td[data-stat=fg3]").text())
                    }

                    // get 3pA
                    if ($(element).children("td[data-stat=fg3a]").text() == '') {
                        player.tpa = 0
                    }
                    else {
                        player.tpa = parseInt($(element).children("td[data-stat=fg3a]").text())
                    }

                    // get FTM
                    if ($(element).children("td[data-stat=ft]").text() == '') {
                        player.ftm = 0
                    }
                    else {
                        player.ftm = parseInt($(element).children("td[data-stat=ft]").text())
                    }

                    // get FTA
                    if ($(element).children("td[data-stat=fta]").text() == '') {
                        player.fta = 0
                    }
                    else {
                        player.fta = parseInt($(element).children("td[data-stat=fta]").text())
                    }

                    // get points
                    if ($(element).children("td[data-stat=pts]").text() == '') {
                        player.points = 0
                    }
                    else {
                        player.points = parseInt($(element).children("td[data-stat=pts]").text())
                        if (player.points >= 10) player.ddCat += 1;
                    }

                    // get rebounds
                    if ($(element).children("td[data-stat=trb]").text() == '') {
                        player.rebounds = 0
                    }
                    else {
                        player.rebounds = parseInt($(element).children("td[data-stat=trb]").text())
                        if (player.rebounds >= 10) player.ddCat += 1;
                    }

                    // get assists
                    if ($(element).children("td[data-stat=ast]").text() == '') {
                        player.assists = 0
                    }
                    else {
                        player.assists = parseInt($(element).children("td[data-stat=ast]").text())
                        if (player.assists >= 10) player.ddCat += 1;
                    }

                    // get steals
                    if ($(element).children("td[data-stat=stl]").text() == '') {
                        player.steals = 0
                    }
                    else {
                        player.steals = parseInt($(element).children("td[data-stat=stl]").text())
                        if (player.steals >= 10) player.ddCat += 1;
                    }

                    // get blocks
                    if ($(element).children("td[data-stat=blk]").text() == '') {
                        player.blocks = 0
                    }
                    else {
                        player.blocks = parseInt($(element).children("td[data-stat=blk]").text())
                        if (player.blocks >= 10) player.ddCat += 1;
                    }

                    // get turnovers
                    if ($(element).children("td[data-stat=tov]").text() == '') {
                        player.turnovers = 0
                    }
                    else {
                        player.turnovers = parseInt($(element).children("td[data-stat=tov]").text())
                    }

                    // get opponent
                    console.log(team, opponent)
                    player.opponent = opponent;
                    player.team = team;
                    if (player.ddCat >= 2) player.doubleDouble = 1
                    if (player.ddCat >= 3) player.tripleDouble = 1
                    player.date = `${year}/${day}/${month}`
                    playerArr.push(player)
            }
            })
        }
    })
    // console.log("done for " + teams[i])
    resolve("done")
})
.catch(err => {
    // console.log(err + " " + teams[i])
    resolve("no game")
})
}))
}

Promise.all(promiseArr).then(() => {
    resolve("done")
})
})
}

scrape().then(() => {
    // console.log(playerArr)
    DB.insertPlayerGame(playerArr[0])
    for(let i = 0; i < playerArr.length; i++) {
        DB.insertPlayerGame(playerArr[i]);
    }
})