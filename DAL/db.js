const sql = require( "mssql/msnodesqlv8" );

const config = {
    database: "DraftKings",
    server: "localhost",
    driver: "msnodesqlv8",
    options: {
        trustedConnection: true
    }
  };

module.exports = {
    insertPlayerGame: function(playerGame) {
        var conn = new sql.ConnectionPool(config);
        conn.connect().then(function(conn) {
            var request = new sql.Request(conn);
            request.input("Name", sql.VarChar(50), playerGame.name)
            request.input("Minutes", sql.Int, playerGame.mp)
            request.input("FGA", sql.Int, playerGame.fga)
            request.input("FGM", sql.Int, playerGame.fgm)
            request.input("TPA", sql.Int, playerGame.tpa)
            request.input("TPM", sql.Int, playerGame.tpm)
            request.input("FTA", sql.Int, playerGame.fta)
            request.input("FTM", sql.Int, playerGame.ftm)
            request.input("Points", sql.Int, playerGame.points)
            request.input("Rebounds", sql.Int, playerGame.rebounds)
            request.input("Assists", sql.Int, playerGame.assists)
            request.input("Steals", sql.Int, playerGame.steals)
            request.input("Blocks", sql.Int, playerGame.blocks)
            request.input("Turnovers", sql.Int, playerGame.turnovers)
            request.input("Opponent", sql.VarChar(5), playerGame.opponent)
            request.input("Team", sql.VarChar(5), playerGame.team)
            request.input("DoubleDouble", sql.Int, playerGame.doubleDouble)
            request.input("TripleDouble", sql.Int, playerGame.tripleDouble)
            request.input("Date", sql.Date, playerGame.date)
            request.execute("[dbo].[InsertPlayerGame]").then((err, recordsets, returnValue, affected) =>{
                // console.log(recordsets);
                // console.log(err);
                conn.close();
            }).catch(err => {
                conn.close();
                console.log(err)
            })
        })
    }
}