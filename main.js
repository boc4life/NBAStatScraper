const axios = require("axios");
const cheerio = require("cheerio");

const teams = [""]

axios.get("https://www.basketball-reference.com/boxscores/202101030DET.html").then(response => {
    const $ = cheerio.load(response.data);
    let playerArr = [];

    $("table").each((i, element) => {
        let opponent;
        if (i == 0) {
            let teamId = $("table")[8].attribs.id
            opponent = teamId.split("-")[1]
        }
        else if (i == 8) {
            let teamId = $("table")[0].attribs.id
            opponent = teamId.split("-")[1]
        }
        if (element.attribs.id.includes("basic") && 
            element.attribs.id.includes("game")) {
            $(element).find("tbody").children("tr").each((i, element) => {
                // filter out middle table header row
                if (!$(element).attr("class")) {
                   
                    //initialize player object
                    let player = {};

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
                    }

                    // get rebounds
                    if ($(element).children("td[data-stat=trb]").text() == '') {
                        player.rebounds = 0
                    }
                    else {
                        player.rebounds = parseInt($(element).children("td[data-stat=trb]").text())
                    }

                    // get assists
                    if ($(element).children("td[data-stat=ast]").text() == '') {
                        player.assists = 0
                    }
                    else {
                        player.assists = parseInt($(element).children("td[data-stat=ast]").text())
                    }

                    // get steals
                    if ($(element).children("td[data-stat=stl]").text() == '') {
                        player.steals = 0
                    }
                    else {
                        player.steals = parseInt($(element).children("td[data-stat=stl]").text())
                    }

                    // get blocks
                    if ($(element).children("td[data-stat=blk]").text() == '') {
                        player.blocks = 0
                    }
                    else {
                        player.blocks = parseInt($(element).children("td[data-stat=blk]").text())
                    }

                    // get turnovers
                    if ($(element).children("td[data-stat=tov]").text() == '') {
                        player.turnovers = 0
                    }
                    else {
                        player.turnovers = parseInt($(element).children("td[data-stat=tov]").text())
                    }

                    // get opponent
                    player.opponent = opponent
                    console.log(player)
            }
            })
        }
    })
})