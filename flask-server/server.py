from flask import Flask, request
import json
import sqlite3
from season import Season
from tournament import Tournament
from event import Event

app = Flask(__name__)

# Create standard json response with provided data
def jsonResponse(jsonData):
    resp = Flask.response_class(json.dumps(jsonData, indent=2))
    resp.headers['Access-Control-Allow-Origin'] = '*'
    return resp

# Return all seasons
@app.route("/seasons")
def seasons():
    connection = sqlite3.connect("busmash.db")
    cursor = connection.cursor()
    Season.makeSeasonsTable(cursor)
    
    cursor.execute("SELECT id FROM seasons")
    rows = cursor.fetchall()
    jsonData = []
    for row in rows:
        season = Season()
        season.load_season(row[0])
        jsonData += [season.toJSON()]

    connection.commit()
    connection.close()
    
    return jsonResponse(jsonData)

# Get particular season
@app.route("/seasons/<int:season_id>")
def getSeason(season_id):
    season = Season()
    season.load_season(season_id)
    jsonData = season.toJSON()

    return jsonResponse(jsonData)

# Add a new season
@app.route("/seasons/add", methods=["POST"])
def addSeason():
    game = request.form.get("game")
    season_num = request.form.get("season_num")
    num_weeks = request.form.get("num_weeks")
    fallOrSpring = request.form.get("fallOrSpring")
    year = request.form.get("year")
    semester = "{} {}".format(year, fallOrSpring)

    season = Season(game, season_num, num_weeks, [], semester)
    season.insert_season()
    jsonData = {
        "OK": True,
        "id": season.id
    }

    return jsonResponse(jsonData)

# Delete an existing season
@app.route("/seasons/delete", methods=["POST"])
def deleteSeason():
    season_id = request.form.get("season_id")
    connection = sqlite3.connect("busmash.db")
    cursor = connection.cursor()

    Season.deleteSeason(cursor, season_id)
    connection.commit()
    connection.close()

    jsonData = {
        "OK": True,
        "id": 11
    }

    return jsonResponse(jsonData)

# Get all tournaments
@app.route("/tournaments")
def tournaments():
    connection = sqlite3.connect("busmash.db")
    cursor = connection.cursor()
    Tournament.makeTournamentsTable(cursor)
    
    cursor.execute("SELECT id FROM tournaments")
    rows = cursor.fetchall()
    jsonData = []
    for row in rows:
        tournament = Tournament()
        tournament.load_tournament(row[0])
        jsonData += [tournament.toJSON()]

    connection.commit()
    connection.close()
    
    return jsonResponse(jsonData)

# Add a new tournament
@app.route("/tournaments/add", methods=["POST"])
def addTournament():
    season_id = request.form.get("season_id")
    url = request.form.get("tournament_url")
    week_num = request.form.get("week_num")

    # TODO fetch tournament data with start.gg API
    id = 1000
    date = 1672179200

    tournament = Tournament(id, season_id, week_num, date)
    tournament.insert_tournament()
    jsonData = {
        "OK": True,
        "id": tournament.id
    }

    return jsonResponse(jsonData)

# Get particular tournament
@app.route("/tournaments/<int:tournament_id>")
def getTournament(tournament_id):
    tournament = Tournament()
    tournament.load_tournament(tournament_id)
    jsonData = tournament.toJSON()

    return jsonResponse(jsonData)

@app.route("/events/<int:event_id>")
def getEvent(event_id):
    event = Event()
    event.load_event(event_id)
    jsonData = event.toJSON()

    return jsonResponse(jsonData)

if __name__ == "__main__":
    app.run(debug = True)