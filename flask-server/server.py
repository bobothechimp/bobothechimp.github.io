from flask import Flask, request
import json
import sqlite3
import requests
from season import Season
from tournament import Tournament
from event import Event
import apikeys
import calculations

app = Flask(__name__)
app.config["SERVER_NAME"] = "localhost:5000" # Change when deploying

CODES = {
    "SUCCESS": 0,
    "ALREADY_EXISTS": 1,
    "COULDNT_COMPLETE": 2,
    "ERROR": 3,
}

# Create standard json response with provided data
def jsonResponse(jsonData):
    resp = Flask.response_class(json.dumps(jsonData, indent=2))
    resp.headers['Access-Control-Allow-Origin'] = '*'
    return resp

# Return all seasons
@app.route("/seasons")
def seasons():
    Season.makeSeasonsTable()
    connection = sqlite3.connect("busmash.db")
    cursor = connection.cursor()
    
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
    Season.makeSeasonsTable()
    season = Season()
    season.load_season(season_id)
    jsonData = season.toJSON()

    return jsonResponse(jsonData)

# Get particular season's tournaments
@app.route("/seasons/<int:season_id>/tournaments")
def getSeasonTournaments(season_id):
    Tournament.makeTournamentsTable()
    connection = sqlite3.connect("busmash.db")
    cursor = connection.cursor()

    tournament_ids = Tournament.ofSeason(cursor, season_id)
    jsonData = []
    for id in tournament_ids:
        tournament = Tournament()
        tournament.load_tournament(id[0])
        jsonData += [tournament.toJSON()]
    
    connection.commit()
    connection.close()

    return jsonResponse(jsonData)

# Add a new season
@app.route("/seasons/add", methods=["POST"])
def addSeason():
    Season.makeSeasonsTable()
    game = request.form.get("game")
    season_num = request.form.get("season_num")
    fallOrSpring = request.form.get("fallOrSpring")
    year = request.form.get("year")
    semester = "{} {}".format(year, fallOrSpring)

    season = Season(game, season_num, semester)
    season.insert_season()
    jsonData = {
        "status_code": CODES["SUCCESS"],
        "message": "Successfully added season.",
        "id": season.id
    }

    return jsonResponse(jsonData)

# Delete an existing season
@app.route("/seasons/delete", methods=["POST"])
def deleteSeason():
    Season.makeSeasonsTable()
    season_id = request.form.get("season_id")
    connection = sqlite3.connect("busmash.db")
    cursor = connection.cursor()

    Season.deleteSeason(cursor, season_id)
    connection.commit()
    connection.close()

    jsonData = {
        "status_code": CODES["SUCCESS"],
        "id": season_id
    }

    return jsonResponse(jsonData)

# Get all tournaments
@app.route("/tournaments")
def tournaments():
    Tournament.makeTournamentsTable()
    connection = sqlite3.connect("busmash.db")
    cursor = connection.cursor()
    
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

# Get particular tournament
@app.route("/tournaments/<int:tournament_id>")
def getTournament(tournament_id):
    Tournament.makeTournamentsTable()
    tournament = Tournament()
    tournament.load_tournament(tournament_id)
    jsonData = tournament.toJSON()

    return jsonResponse(jsonData)

# Get particular season's tournaments
@app.route("/tournaments/<int:tournament_id>/events")
def getTournamentEvents(tournament_id):
    Event.makeEventsTable()
    connection = sqlite3.connect("busmash.db")
    cursor = connection.cursor()

    event_ids = Event.ofTournament(cursor, tournament_id)
    jsonData = []
    for id in event_ids:
        event = Event()
        event.load_event(id[0])
        jsonData += [event.toJSON()]
    
    connection.commit()
    connection.close()

    return jsonResponse(jsonData)

# Add a new tournament
@app.route("/tournaments/add", methods=["POST"])
def addTournament():
    Tournament.makeTournamentsTable()
    season_id = request.form.get("season_id")
    url_id = request.form.get("tournament_url_id")
    # url or id of tournament, don't know which one yet
    week_num = request.form.get("week_num")
    auto_add_events = request.form.get("auto_add_events")
    if(auto_add_events == "on"):
        eventsQuery = """
        events {
            id
        }"""
    else:
        eventsQuery = """"""

    try:
        # First check if url_id is a number
        # If this runs without error, we can assume url_id is the id
        int(url_id)
        tournament_id = url_id
    except:
        # An error in the try block means url_id is not an id, so it's a url
        # Find start and end of tournament slug
        try:
            start = url_id.index("tournament/") + 11
        except:
            start = 0
        try:
            end = url_id[start:].index("/")
        except:
            end = len(url_id[start:])
        slug = url_id[start:start+end]

        headers = {"Authorization": "Bearer {}".format(apikeys.STARTGG_KEY)}
        data = {
            "query": """
            query TournamentQuery($slug: String!) {
                tournament(slug: $slug) {
                    id
                }
            }
            """,
            "variables": {
                "slug": slug
            }
        }
        sggResponse = requests.post("https://api.start.gg/gql/alpha",
                               headers=headers, json=data)
        tournament_id = sggResponse["data"]["tournament"]["id"]
    

    # Calling start.gg API
    headers = {"Authorization": "Bearer {}".format(apikeys.STARTGG_KEY)}
    data = {
        "query": """
        query TournamentQuery($id: ID!) {{
            tournament(id: $id) {{
                id
                name
                startAt
                {}
            }}
        }}""".format(eventsQuery),
        "variables": {
            "id": tournament_id
        }
    }
    sggResponse = requests.post("https://api.start.gg/gql/alpha",
                               headers=headers, json=data)
    tournamentData = (sggResponse.json())["data"]
    if(tournamentData["tournament"] is None):
        jsonData = {
            "status_code": CODES["ERROR"],
            "message": "Tournament does not exist.",
            "id": -1
        }
        return jsonResponse(jsonData)

    # Grabbing tournament info
    date = tournamentData["tournament"]["startAt"]
    failures = False
    if(auto_add_events == "on"):
        events = tournamentData["tournament"]["events"]
        for event in events:
            status_code = createEvent(tournament_id, event["id"])
            failures = failures or status_code > 0

    # Checking if inserting a bimonthly
    if(week_num[0:2].lower() == "bm"):
        inserted_wn = -1 * int(week_num[2:])
    else:
        inserted_wn = week_num
    tournament = Tournament(tournament_id, season_id, inserted_wn, date)
    inserted = tournament.insert_tournament()

    # Determining success of operation
    if(inserted and not failures):
        jsonData = {
            "status_code": CODES["SUCCESS"],
            "message": "Successfully added tournament.",
            "id": tournament_id
        }
    elif(inserted and failures):
        jsonData = {
            "status_code": CODES["COULDNT_COMPLETE"],
            "message": "One or more events couldn't be added.",
            "id": tournament_id
        }
    elif(not inserted and not failures and auto_add_events):
        jsonData = {
            "status_code": CODES["ALREADY_EXISTS"],
            "message": "Tournament already exists in database. Tournament events successfully added.",
            "id": tournament_id
        }
    else:
        jsonData = {
            "status_code": CODES["ALREADY_EXISTS"],
            "message": "Tournament already exists in database.",
            "id": tournament_id
        }

    return jsonResponse(jsonData)

# Delete an existing tournament
@app.route("/tournaments/delete", methods=["POST"])
def deleteTournament():
    Tournament.makeTournamentsTable()
    tournament_id = request.form.get("tournament_id")
    delete_all_events = request.form.get("delete_all_events")
    connection = sqlite3.connect("busmash.db")
    cursor = connection.cursor()

    Tournament.deleteTournament(cursor, tournament_id)
    if delete_all_events == "true":
        Event.deleteFromTournament(cursor, tournament_id)
    connection.commit()
    connection.close()

    jsonData = {
        "status_code": CODES["SUCCESS"],
        "message": "Successfully deleted tournament.",
        "id": tournament_id
    }

    return jsonResponse(jsonData)

# Get all events
@app.route("/events")
def events():
    Event.makeEventsTable()
    connection = sqlite3.connect("busmash.db")
    cursor = connection.cursor()
    
    cursor.execute("SELECT id FROM events")
    rows = cursor.fetchall()
    jsonData = []
    for row in rows:
        event = Event()
        event.load_event(row[0])
        jsonData += [event.toJSON()]

    connection.commit()
    connection.close()
    
    return jsonResponse(jsonData)

# Get a particular event
@app.route("/events/<int:event_id>")
def getEvent(event_id):
    Event.makeEventsTable()
    event = Event()
    event.load_event(event_id)
    jsonData = event.toJSON()

    return jsonResponse(jsonData)

# Add a new event
@app.route("/events/add", methods=["POST"])
def addEvent():
    url_id = request.form.get("event_url_id")
    # url or id of event, don't know which one yet

    try:
        # First check if url_id is a number
        # If this runs without error, we can assume url_id is the id
        int(url_id)
        event_id = url_id
        data = {
            "query": """
            query EventQuery($eventId: ID!) {
                event(id: $eventId) {
                    id
                    tournament {
                        id
                    }
                }
            }""",
            "variables": {
                "eventId": event_id
            }
        }
    except:
        # An error in the try block means url_id is not an id, so it's a url
        # Find start and end of event slug
        start = url_id.index("tournament/")
        eventIndex = url_id[start:].index("/event/") + 7
        try:
            end = url_id[start+eventIndex:].index("/")
        except:
            end = len(url_id[start+eventIndex:])
        slug = url_id[start:start+eventIndex+end]

        data = {
            "query": """
            query EventQuery($slug: String!) {
                event(slug: $slug) {
                    id
                    tournament {
                        id
                    }
                }
            }
            """,
            "variables": {
                "slug": slug
            }
        }
    
    # Call start.gg API
    headers = {"Authorization": "Bearer {}".format(apikeys.STARTGG_KEY)}
    sggResponse = requests.post("https://api.start.gg/gql/alpha",
                               headers=headers, json=data)
    eventData = (sggResponse.json())["data"]
    if(eventData["event"] is None):
        jsonData = {
            "status_code": CODES["ERROR"],
            "message": "Event does not exist.",
            "id": -1
        }

        return jsonResponse(jsonData)

    # Get basic tournament info
    event_id = eventData["event"]["id"] #In case url_id was the url
    tournament_id = eventData["event"]["tournament"]["id"]

    status_code = createEvent(tournament_id, event_id)

    jsonData = {
        "status_code": status_code,
        "id": event_id
    }

    if(status_code == CODES["ALREADY_EXISTS"]):
        jsonData["message"] = "Event already exists in database."
    if(status_code == CODES["COULDNT_COMPLETE"]):
        jsonData["message"] = "Event could not be added."
    if(status_code == CODES["ERROR"]):
        jsonData["message"] = "Event does not exist."

    return jsonResponse(jsonData)

# Helper function to allow both addEvent() and
# addTournament() to insert events
def createEvent(tournament_id, event_id):
    Event.makeEventsTable()
    headers = {"Authorization": "Bearer {}".format(apikeys.STARTGG_KEY)}
    data = {
        "query": ("""
        query EventEntrants($eventId: ID!) {
            event(id: $eventId) {
                name
                entrants(query: {perPage: 60, page: 1}) {
                    pageInfo {
                        total
                        totalPages
                    }
                    nodes {
                        id
                        name
                        initialSeedNum
                        standing {
                            placement
                        }
                    }
                }
                standings(query: {perPage: 3, page: 1}) {
                nodes {
                    placement
                    entrant {
                        id
                        name
                        }
                    }
                }
                sets(perPage: 120, page: 1) {
                    pageInfo {
                        total
                        totalPages
                    }
                    nodes {
                        id
                        displayScore
                        winnerId
                        slots {
                            entrant {
                                id
                            }
                        }
                    }
                }
            }
        }"""),
        "variables": {
            "eventId": event_id
        }
    }
    sggResponse = requests.post("https://api.start.gg/gql/alpha",
                               headers=headers, json=data)
    eventData = (sggResponse.json())["data"]

    if(eventData["event"]["sets"]["pageInfo"]["total"] == 0):
        #Some events were never published, so they won't be inserted
        return CODES["COULDNT_COMPLETE"]
    if(eventData["event"] is None):
        return CODES["ERROR"]
    
    title = eventData["event"]["name"]

    entrantsCount = eventData["event"]["entrants"]["pageInfo"]["total"]
    entrants = eventData["event"]["entrants"]["nodes"]
    maxSPR, sprPlayer, sprSeed, sprPlacing = calculations.highestSPR(entrants)

    # ID table makes calculating upset factors easier
    entrantsIdTable = {}
    for entrant in entrants:
        entrantsIdTable[entrant["id"]] = {
            "name": entrant["name"],
            "seed": entrant["initialSeedNum"],
            "placing": entrant["standing"]["placement"]
        }
    sets = eventData["event"]["sets"]["nodes"]
    maxUF, upsetScore, upsetterSeed, upsetteeSeed = calculations.highestUF(
        sets, entrantsIdTable
    )

    podium = eventData["event"]["standings"]["nodes"]
    top3 = []
    for player in podium:
        top3 += [player["entrant"]["name"]]
    
    Event.makeEventsTable()
    event = Event(event_id, tournament_id, title, entrantsCount, top3,
                  [upsetScore, upsetterSeed, upsetteeSeed, maxUF],
                  [sprPlayer, sprSeed, sprPlacing, maxSPR])
    if(event.insert_event()):
        return CODES["SUCCESS"]
    else:
        return CODES["ALREADY_EXISTS"]

# Delete an existing event
@app.route("/events/delete", methods=["POST"])
def deleteEvent():
    Event.makeEventsTable()
    event_id = request.form.get("event_id")
    connection = sqlite3.connect("busmash.db")
    cursor = connection.cursor()

    Event.deleteEvent(cursor, event_id)
    connection.commit()
    connection.close()

    jsonData = {
        "status_code": CODES["SUCCESS"],
        "message": "Successfully deleted event.",
        "id": event_id
    }

    return jsonResponse(jsonData)

if __name__ == "__main__":
    app.run(debug = True)