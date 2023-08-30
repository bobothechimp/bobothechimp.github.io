from flask import Flask, request
import json
import time
import sqlite3
import requests
from season import Season
from tournament import Tournament
from event import Event
from set import Set
from player import Player
import apikeys
import calculations

app = Flask(__name__)
app.config["SERVER_NAME"] = "localhost:5000"  # Change when deploying
app.config["CLIENT_NAME"] = "http://localhost:5173"  # Change when deploying

Season.makeSeasonsTable()
Tournament.makeTournamentsTable()
Event.makeEventsTable()
Set.makeSetsTable()
Player.makePlayersTable()

CODES = {
    "SUCCESS": 0,
    "ALREADY_EXISTS": 1,
    "COULDNT_COMPLETE": 2,
    "ERROR": 3,
}


# Create standard json response with provided data
def jsonResponse(jsonData):
    resp = Flask.response_class(json.dumps(jsonData, indent=2))
    resp.headers["Access-Control-Allow-Origin"] = app.config["CLIENT_NAME"]
    return resp


# Get all seasons
@app.route("/seasons", methods=["GET", "POST"])
def seasons():
    connection = sqlite3.connect("busmash.db")
    cursor = connection.cursor()

    cursor.execute("SELECT id FROM seasons")
    rows = cursor.fetchall()

    try:
        data = request.get_json(force=True)
        page = data["page"]
        perPage = data["perPage"]
    except:
        page = 1
        perPage = len(rows)

    jsonData = []
    for i in range((page - 1) * perPage, min(len(rows), page * perPage)):
        row = rows[i]
        season = Season()
        season.load_season(row[0])
        jsonData += [season.toJSON()]

    connection.commit()
    connection.close()

    return jsonResponse({"total": len(rows), "seasons": jsonData})


# Get particular season
@app.route("/seasons/<int:season_id>")
def getSeason(season_id):
    season = Season()
    season.load_season(season_id)
    jsonData = season.toJSON()

    return jsonResponse(jsonData)


# Get particular season's tournaments
@app.route("/seasons/<int:season_id>/tournaments")
def getSeasonTournaments(season_id):
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

    return jsonResponse({"total": len(tournament_ids), "tournaments": jsonData})


# Get particular season's events
@app.route("/seasons/<int:season_id>/events", methods=["GET", "POST"])
def getSeasonEvents(season_id):
    connection = sqlite3.connect("busmash.db")
    cursor = connection.cursor()

    event_ids = Event.ofSeason(cursor, season_id)

    try:
        data = request.get_json(force=True)
        page = data["page"]
        perPage = data["perPage"]
    except:
        page = 1
        perPage = len(event_ids)

    jsonData = []
    for i in range((page - 1) * perPage, min(len(event_ids), page * perPage)):
        id = event_ids[i]
        event = Event()
        event.load_event(id[0])
        jsonData += [event.toJSON()]

    connection.commit()
    connection.close()

    return jsonResponse({"total": len(event_ids), "events": jsonData})


# Add a new season
@app.route("/seasons/add", methods=["POST"])
def addSeason():
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
        "id": season.id,
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

    jsonData = {"status_code": CODES["SUCCESS"], "id": season_id}

    return jsonResponse(jsonData)


# Get all tournaments
@app.route("/tournaments", methods=["GET", "POST"])
def tournaments():
    connection = sqlite3.connect("busmash.db")
    cursor = connection.cursor()

    cursor.execute("SELECT id FROM tournaments")
    rows = cursor.fetchall()

    try:
        data = request.get_json(force=True)
        page = data["page"]
        perPage = data["perPage"]
    except:
        page = 1
        perPage = len(rows)

    jsonData = []
    for i in range((page - 1) * perPage, min(len(rows), page * perPage)):
        row = rows[i]
        tournament = Tournament()
        tournament.load_tournament(row[0])
        jsonData += [tournament.toJSON()]

    connection.commit()
    connection.close()

    return jsonResponse({"total": len(rows), "tournaments": jsonData})


# Get particular tournament
@app.route("/tournaments/<int:tournament_id>")
def getTournament(tournament_id):
    tournament = Tournament()
    tournament.load_tournament(tournament_id)
    jsonData = tournament.toJSON()

    return jsonResponse(jsonData)


# Get particular tournament's events
@app.route("/tournaments/<int:tournament_id>/events")
def getTournamentEvents(tournament_id):
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

    return jsonResponse({"total": len(event_ids), "events": jsonData})


# Add a new tournament
@app.route("/tournaments/add", methods=["POST"])
def addTournament():
    season_id = request.form.get("season_id")
    url_id = request.form.get("tournament_url_id")
    # url or id of tournament, don't know which one yet
    week_num = request.form.get("week_num")
    auto_add_events = request.form.get("auto_add_events")
    if auto_add_events == "on":
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
        slug = url_id[start : start + end]

        headers = {"Authorization": "Bearer {}".format(apikeys.STARTGG_KEY)}
        data = {
            "query": """
            query TournamentQuery($slug: String!) {
                tournament(slug: $slug) {
                    id
                }
            }
            """,
            "variables": {"slug": slug},
        }
        sggResponse = requests.post(
            "https://api.start.gg/gql/alpha", headers=headers, json=data
        )
        if sggResponse.json()["data"]["tournament"] is None:
            jsonData = {
                "status_code": CODES["ERROR"],
                "message": "Tournament does not exist.",
                "id": -1,
            }
            return jsonResponse(jsonData)
        tournament_id = (sggResponse.json())["data"]["tournament"]["id"]

    # Calling start.gg API
    headers = {"Authorization": "Bearer {}".format(apikeys.STARTGG_KEY)}
    data = {
        "query": """
        query TournamentQuery($id: ID!) {{
            tournament(id: $id) {{
                id
                name
                startAt
                slug
                {}
            }}
        }}""".format(
            eventsQuery
        ),
        "variables": {"id": tournament_id},
    }
    sggResponse = requests.post(
        "https://api.start.gg/gql/alpha", headers=headers, json=data
    )
    tournamentData = (sggResponse.json())["data"]
    if tournamentData["tournament"] is None:
        jsonData = {
            "status_code": CODES["ERROR"],
            "message": "Tournament does not exist.",
            "id": -1,
        }
        return jsonResponse(jsonData)

    # Grabbing tournament info
    date = tournamentData["tournament"]["startAt"]
    slug = tournamentData["tournament"]["slug"]
    failures = False
    if auto_add_events == "on":
        events = tournamentData["tournament"]["events"]
        for event in events:
            status_code = createEvent(tournament_id, event["id"])
            failures = failures or status_code > 0

    # Checking if inserting a bimonthly
    if week_num[0:2].lower() == "bm":
        inserted_wn = -1 * int(week_num[2:])
    else:
        inserted_wn = week_num
    tournament = Tournament(tournament_id, season_id, inserted_wn, date, slug)
    inserted = tournament.insert_tournament()

    # Determining success of operation
    if inserted and not failures:
        jsonData = {
            "status_code": CODES["SUCCESS"],
            "message": "Successfully added tournament.",
            "id": tournament_id,
        }
    elif inserted and failures:
        jsonData = {
            "status_code": CODES["COULDNT_COMPLETE"],
            "message": "One or more events couldn't be added.",
            "id": tournament_id,
        }
    elif not inserted and not failures and auto_add_events:
        jsonData = {
            "status_code": CODES["ALREADY_EXISTS"],
            "message": "Tournament already exists in database. Tournament events successfully added.",
            "id": tournament_id,
        }
    else:
        jsonData = {
            "status_code": CODES["ALREADY_EXISTS"],
            "message": "Tournament already exists in database.",
            "id": tournament_id,
        }

    return jsonResponse(jsonData)


# Delete an existing tournament
@app.route("/tournaments/delete", methods=["POST"])
def deleteTournament():
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
        "id": tournament_id,
    }

    return jsonResponse(jsonData)


# Get all events
@app.route("/events", methods=["GET", "POST"])
def events():
    connection = sqlite3.connect("busmash.db")
    cursor = connection.cursor()

    cursor.execute("SELECT id FROM events")
    rows = cursor.fetchall()

    try:
        data = request.get_json(force=True)
        page = data["page"]
        perPage = data["perPage"]
    except:
        page = 1
        perPage = len(rows)

    jsonData = []
    for i in range((page - 1) * perPage, min(len(rows), page * perPage)):
        row = rows[i]
        event = Event()
        event.load_event(row[0])
        jsonData += [event.toJSON()]

    connection.commit()
    connection.close()

    return jsonResponse({"total": len(rows), "events": jsonData})


# Get a particular event
@app.route("/events/<int:event_id>")
def getEvent(event_id):
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
            "variables": {"eventId": event_id},
        }
    except:
        # An error in the try block means url_id is not an id, so it's a url
        # Find start and end of event slug
        start = url_id.index("tournament/")
        eventIndex = url_id[start:].index("/event/") + 7
        try:
            end = url_id[start + eventIndex :].index("/")
        except:
            end = len(url_id[start + eventIndex :])
        slug = url_id[start : start + eventIndex + end]

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
            "variables": {"slug": slug},
        }

    # Call start.gg API
    headers = {"Authorization": "Bearer {}".format(apikeys.STARTGG_KEY)}
    sggResponse = requests.post(
        "https://api.start.gg/gql/alpha", headers=headers, json=data
    )
    eventData = (sggResponse.json())["data"]
    if eventData["event"] is None:
        jsonData = {
            "status_code": CODES["ERROR"],
            "message": "Event does not exist.",
            "id": -1,
        }

        return jsonResponse(jsonData)

    # Get basic tournament info
    event_id = eventData["event"]["id"]  # In case url_id was the url
    tournament_id = eventData["event"]["tournament"]["id"]

    status_code = createEvent(tournament_id, event_id)

    jsonData = {"status_code": status_code, "id": event_id}

    if status_code == CODES["SUCCESS"]:
        jsonData["message"] = "Successfully added event"
    if status_code == CODES["ALREADY_EXISTS"]:
        jsonData["message"] = "Event already exists in database."
    if status_code == CODES["COULDNT_COMPLETE"]:
        jsonData["message"] = "Event could not be added."
    if status_code == CODES["ERROR"]:
        jsonData["message"] = "Event does not exist."

    return jsonResponse(jsonData)


# Helper function to allow both addEvent() and
# addTournament() to insert events
def createEvent(tournament_id, event_id):
    headers = {"Authorization": "Bearer {}".format(apikeys.STARTGG_KEY)}
    data = {
        "query": (
            """
        query EventEntrants($eventId: ID!) {
            event(id: $eventId) {
                name
                slug
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
                        participants {
                        player {
                                id
                                gamerTag
                                prefix
                            }
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
        }"""
        ),
        "variables": {"eventId": event_id},
    }
    sggResponse = requests.post(
        "https://api.start.gg/gql/alpha", headers=headers, json=data
    )
    eventData = (sggResponse.json())["data"]

    if eventData["event"]["sets"]["pageInfo"]["total"] == 0:
        # Some events were never published, so they won't be inserted
        return CODES["COULDNT_COMPLETE"]
    if eventData["event"] is None:
        return CODES["ERROR"]

    title = eventData["event"]["name"]
    slug = eventData["event"]["slug"]

    entrantsCount = eventData["event"]["entrants"]["pageInfo"]["total"]
    entrants = eventData["event"]["entrants"]["nodes"]

    # ID table makes calculating upset factors and SPRs easier
    entrantsIdTable = {}
    for entrant in entrants:
        entrantsIdTable[entrant["id"]] = {
            "playerId": entrant["participants"][0]["player"]["id"],
            "name": entrant["name"],  # Full name, team and gamer tag
            "gamerTag": entrant["participants"][0]["player"]["gamerTag"],
            "team": entrant["participants"][0]["player"]["prefix"],
            "seed": entrant["initialSeedNum"],
            "placing": entrant["standing"]["placement"],
        }
    sets = eventData["event"]["sets"]["nodes"]
    setsStatusCode, [ufSetId, upsetterSeed, upsetteeSeed, maxUF] = addSets(
        event_id, sets, entrantsIdTable
    )
    playersStatusCode, [sprPlayerId, sprSeed, sprPlacing, maxSPR] = addPlayers(
        event_id, entrantsIdTable
    )

    podium = eventData["event"]["standings"]["nodes"]
    top3 = []
    for player in podium:
        top3 += [player["entrant"]["name"]]

    event = Event(
        event_id,
        tournament_id,
        title,
        entrantsCount,
        top3,
        [ufSetId, upsetterSeed, upsetteeSeed, maxUF],
        [sprPlayerId, sprSeed, sprPlacing, maxSPR],
        slug,
    )
    if event.insert_event():
        return CODES["SUCCESS"]
    else:
        return CODES["ALREADY_EXISTS"]


# Add a list of new sets
def addSets(event_id: int, sets: list, entrantsIdTable: dict):
    maxUF = [0, -1, 0, 0]  # set id, upsetter seed, upsettee seed, UF
    status_code = CODES["SUCCESS"]
    for setData in sets:
        if setData["displayScore"] == "DQ":
            continue
        player1_id = setData["slots"][0]["entrant"]["id"]
        player2_id = setData["slots"][1]["entrant"]["id"]
        player1Won = setData["winnerId"] == player1_id
        # True if P1 won, false if P2 won

        if player1Won:
            winner_id = player1_id
            loser_id = player2_id
        else:
            winner_id = player2_id
            loser_id = player1_id
        winnerName = entrantsIdTable[winner_id]["name"]
        loserName = entrantsIdTable[loser_id]["name"]
        winnerScore, loserScore = calculations.getScores(
            setData["displayScore"], winnerName, loserName
        )
        uf = calculations.calculateUF(
            entrantsIdTable[winner_id], entrantsIdTable[loser_id]
        )
        set = Set(
            setData["id"],
            event_id,
            entrantsIdTable[winner_id]["playerId"],
            entrantsIdTable[loser_id]["playerId"],
            winnerScore,
            loserScore,
            uf,
        )
        if not set.insert_set():
            status_code = CODES["ALREADY_EXISTS"]

        if uf > maxUF[3]:
            upsetterSeed = entrantsIdTable[winner_id]["seed"]
            upsetteeSeed = entrantsIdTable[loser_id]["seed"]
            maxUF = [setData["id"], upsetterSeed, upsetteeSeed, uf]
    return status_code, maxUF


# Add a list of new players
def addPlayers(event_id: int, players: dict):
    maxSPR = [-1, 0, 0, 0]  # player id, seed, placing, SPR
    status_code = CODES["SUCCESS"]

    connection = sqlite3.connect("busmash.db")
    cursor = connection.cursor()
    for entrant_id in players.keys():
        playerData = players[entrant_id]
        player_id = playerData["playerId"]
        oldData = Player()
        inDB = oldData.load_player(player_id)

        cursor.execute(
            """
        SELECT * FROM sets
        WHERE winner_id = {}
        """.format(
                player_id
            )
        )
        winningSets = cursor.fetchall()

        cursor.execute(
            """
        SELECT * FROM sets
        WHERE loser_id = {}
        """.format(
                player_id
            )
        )
        losingSets = cursor.fetchall()

        topPlacing = [event_id, playerData["placing"]]
        if inDB:
            topPlacing = calculations.determineBetterPlacing(
                topPlacing, oldData.topPlacing
            )
        demon, blessing = calculations.calculateDemonAndBlessing(
            player_id, winningSets, losingSets
        )

        player = Player(
            player_id,
            playerData["gamerTag"],
            playerData["team"],
            len(winningSets),
            len(losingSets),
            topPlacing,
            demon,
            blessing,
        )
        if not inDB:
            if not player.insert_player():
                status_code = CODES["ALREADY_EXISTS"]
        else:
            if not player.update_player():
                status_code = CODES["ERROR"]

        spr = calculations.calculateSPR(playerData)
        if spr > maxSPR[3]:
            maxSPR = [player_id, playerData["seed"], playerData["placing"], spr]
    return status_code, maxSPR


# Delete an existing event
@app.route("/events/delete", methods=["POST"])
def deleteEvent():
    event_id = request.form.get("event_id")
    connection = sqlite3.connect("busmash.db")
    cursor = connection.cursor()

    Event.deleteEvent(cursor, event_id)
    connection.commit()
    connection.close()

    jsonData = {
        "status_code": CODES["SUCCESS"],
        "message": "Successfully deleted event.",
        "id": event_id,
    }

    return jsonResponse(jsonData)


# Get all players
@app.route("/players", methods=["GET", "POST"])
def getPlayers():
    connection = sqlite3.connect("busmash.db")
    cursor = connection.cursor()

    cursor.execute("SELECT id, name, numWins, numLosses FROM players")
    rows = cursor.fetchall()

    try:
        data = request.get_json(force=True)
        page = data["page"]
        perPage = data["perPage"]
        search = data["search"]
        print("test1")
        cursor.execute(
            "SELECT id, name, numWins, numLosses FROM players WHERE name LIKE ? ;",
            ("%" + search + "%",),
        )
        rows = cursor.fetchall()
        print("test2")
        sort = data["sort"]
    except:
        page = 1
        perPage = len(rows)
        search = ""
        sort = "id"

    if sort == "alph":
        sortKey = lambda row: row[1]
    elif sort == "sets":
        sortKey = lambda row: -(row[2] + row[3])
    elif sort == "wins":
        sortKey = lambda row: -row[2]
    elif sort == "winrate":
        # Add the max function to prevent division by zero
        sortKey = lambda row: -(row[2] / max(1, row[2] + row[3]))
    else:
        sortKey = lambda row: row[0]
    # Sort rows by most sets played
    rows = sorted(rows, key=sortKey)

    jsonData = []
    for i in range((page - 1) * perPage, min(len(rows), page * perPage)):
        row = rows[i]
        player = Player()
        player.load_player(row[0])
        jsonData += [player.toJSON()]

    connection.commit()
    connection.close()

    return jsonResponse({"total": len(rows), "players": jsonData})


# Recalculate players' stats
@app.route("/players/recalculate", methods=["POST"])
def recalculatePlayerStats():
    connection = sqlite3.connect("busmash.db")
    cursor = connection.cursor()

    cursor.execute("SELECT id FROM events ;")
    event_ids = cursor.fetchall()

    status_code = CODES["SUCCESS"]
    for row in event_ids:
        start = time.time()
        event_id = row[0]
        newSC = updatePlayersInEvent(event_id)
        status_code = max(status_code, newSC)

        # Limiting the loop to at most 80 iterations per minute
        time.sleep(max(60.0 / 80 - (time.time() - start), 0))

    cursor.execute("SELECT id FROM players ;")
    player_ids = cursor.fetchall()
    for row in player_ids:
        player_id = row[0]
        player = Player()
        player.load_player(player_id)
        # Remove this player if they have played no sets
        # (most likely because they DQed from the only events
        # for which they registered)
        if player.numWins == 0 and player.numLosses == 0:
            Player.deletePlayer(cursor, player_id)

    connection.commit()
    connection.close()

    jsonData = {"status_code": status_code}

    if status_code == CODES["SUCCESS"]:
        jsonData["message"] = "Successfully recalculated stats."
    if status_code == CODES["COULDNT_COMPLETE"]:
        jsonData["message"] = "Could not recalculate some stats."
    if status_code == CODES["ERROR"]:
        jsonData["message"] = "Error while recalculating stats."

    return jsonResponse(jsonData)


# Update info of players from a particular event
def updatePlayersInEvent(event_id):
    headers = {"Authorization": "Bearer {}".format(apikeys.STARTGG_KEY)}
    data = {
        "query": (
            """
        query EventEntrants($eventId: ID!) {
            event(id: $eventId) {
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
                        participants {
                            player {
                                id
                                gamerTag
                                prefix
                            }
                        }
                    }
                }
            }
        }"""
        ),
        "variables": {"eventId": event_id},
    }
    sggResponse = requests.post(
        "https://api.start.gg/gql/alpha", headers=headers, json=data
    )
    eventData = (sggResponse.json())["data"]
    entrants = eventData["event"]["entrants"]["nodes"]

    # ID table makes calculating upset factors and SPRs easier
    entrantsIdTable = {}
    for entrant in entrants:
        entrantsIdTable[entrant["id"]] = {
            "playerId": entrant["participants"][0]["player"]["id"],
            "name": entrant["name"],  # Full name, team and gamer tag
            "gamerTag": entrant["participants"][0]["player"]["gamerTag"],
            "team": entrant["participants"][0]["player"]["prefix"],
            "seed": entrant["initialSeedNum"],
            "placing": entrant["standing"]["placement"],
        }
    # Not actually adding players; it'll just update each one
    status_code, spr = addPlayers(event_id, entrantsIdTable)
    return status_code


if __name__ == "__main__":
    app.run(debug=True)
