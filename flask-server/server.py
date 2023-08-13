from flask import Flask
import json
import sqlite3
from season import Season
from tournament import Tournament
from event import Event

app = Flask(__name__)

def getSeason(cursor, season):
    sql = """SELECT * FROM seasons WHERE season = %d;""" %(season)
    cursor.execute(sql)
    return cursor.fetchall()

# Return all seasons
@app.route("/seasons")
def seasons():
    connection = sqlite3.connect("busmash.db")
    cursor = connection.cursor()
    Season.makeSeasonsTable(cursor)

    s9 = Season()
    if not s9.load_season(9):
        s9 = Season(9, "Ultimate", 9, 8, [10, 11], "2021 Fall")
        s9.insert_season()
    s10 = Season()
    if not s10.load_season(10):
        s10 = Season(10, "Ultimate", 10, 7, [12], "2022 Spring")
        s10.insert_season()
    s11 = Season()
    if not s11.load_season(11):
        s11 = Season(11, "Ultimate", 11, 10, [13, 14], "2022 Fall")
        s11.insert_season()
    s12 = Season()
    if not s12.load_season(12):
        s12 = Season(12, "Ultimate", 12, 8, [15, 16], "2023 Spring")
        s12.insert_season()
    jsonData = [s9.toJSON(), s10.toJSON(), s11.toJSON(), s12.toJSON()]

    connection.commit()
    connection.close()
    
    resp = Flask.response_class(json.dumps(jsonData, indent=2))
    resp.headers['Access-Control-Allow-Origin'] = '*'
    return resp

# Get particular season
@app.route("/seasons/<int:season_num>")
def getSeason(season_num):
    season = Season()
    season.load_season(season_num)
    jsonData = season.toJSON()

    resp = Flask.response_class(json.dumps(jsonData, indent=2))
    resp.headers['Access-Control-Allow-Origin'] = '*'
    return resp

# Get particular tournament
@app.route("/tournaments/<int:tournament_id>")
def getTournament(tournament_id):
    tournament = Tournament()
    tournament.load_tournament(tournament_id)
    jsonData = tournament.toJSON()

    resp = Flask.response_class(json.dumps(jsonData, indent=2))
    resp.headers['Access-Control-Allow-Origin'] = '*'
    return resp

@app.route("/events/<int:event_id>")
def getEvent(event_id):
    event = Event()
    event.load_event(event_id)
    jsonData = event.toJSON()

    resp = Flask.response_class(json.dumps(jsonData, indent=2))
    resp.headers['Access-Control-Allow-Origin'] = '*'
    return resp

if __name__ == "__main__":
    app.run(debug = True)