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
    print("Test==============")
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