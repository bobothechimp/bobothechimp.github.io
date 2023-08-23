import sqlite3
from datetime import datetime

class Event:

    def __init__(self, id = -1, tournament_id = -1, title = "", entrants = 0,
                 top3 = [], topUpset = ["", 0, 0, 0], topSPR = ["", 0, 0, 0],
                 slug = ""):
        self.id = id
        self.tournament_id = tournament_id
        self.title = title
        self.entrants = entrants
        self.top3 = top3
        self.topUpset = topUpset
        #[set headline, upsetter seed, upsettee seed, upset factor]
        #ex: ["John 3-1 Bob", 28, 8, 4]
        self.topSPR = topSPR
        #[player name, seeded placement, final placement, SPR]
        #ex: ["John", 25, 3, 7]
        self.slug = slug
        self.connection = sqlite3.connect("busmash.db")
        self.cursor = self.connection.cursor()
    
    def load_event(self, id):
        self.cursor.execute("""
        SELECT * FROM events
        WHERE id = {}
        """.format(id))

        row = self.cursor.fetchone()
        if row is None:
            return False
        
        self.id = row[0]
        self.tournament_id = row[1]
        self.title = row[2]
        self.entrants = row[3]
        self.top3 = str(row[4]).split(",")
        upsetInfo = str(row[5]).split(",")
        self.topUpset = [upsetInfo[0], int(upsetInfo[1]),
                         int(upsetInfo[2]), int(upsetInfo[3])]
        sprInfo = str(row[6]).split(",")
        self.topSPR = [sprInfo[0], int(sprInfo[1]),
                       int(sprInfo[2]), int(sprInfo[3])]
        self.slug = row[7]
        return True
    
    def insert_event(self):
        self.cursor.execute("""SELECT * FROM events WHERE id = {}""".format(self.id))
        if(self.cursor.fetchone() is not None):
            return False

        top3 = "{},{},{}".format(self.top3[0], self.top3[1], self.top3[2])
        upsetInfo = "{},{},{},{}".format(self.topUpset[0], self.topUpset[1], 
                                         self.topUpset[2], self.topUpset[3])
        sprInfo = "{},{},{},{}".format(self.topSPR[0], self.topSPR[1], 
                                         self.topSPR[2], self.topSPR[3])
        self.cursor.execute("""
        INSERT INTO events
        (id, tournament_id, title, entrants, top3, upset, spr, slug)
        VALUES
        ({}, {}, \"{}\", {}, \"{}\", \"{}\", \"{}\", \"{}\")
        """.format(self.id, self.tournament_id, self.title, self.entrants,
                   top3, upsetInfo, sprInfo, self.slug))
        self.connection.commit()
        return True
    
    def toJSON(self):
        self.cursor.execute("""
        SELECT semester, game, week, date
        FROM seasons JOIN tournaments
        ON seasons.id = tournaments.season_id
        WHERE tournaments.id = {};
        """.format(self.tournament_id))
        tournament = self.cursor.fetchone()
        if tournament is None:
            tournamentName = "Tournament not in database"
        else:
            if(tournament[2] < 0):
                week = "BM" + str(-1 * tournament[2])
            else:
                week = "Week " + str(tournament[2])
            tournamentName = "{} {} {}".format(tournament[0], tournament[1], week)
        if self.topUpset[3] == 0:
            #0 UF means no upsets
            tu = "No upsets"
        else:
            tu = self.topUpset
        if self.topSPR[3] == 0:
            #0 SPR means no overperformers
            tspr = "No overperformers"
        else:
            tspr = self.topSPR
        date = datetime.utcfromtimestamp(tournament[3]).strftime('%B %d, %Y')

        return {
            "id": self.id,
            "tournament_id": self.tournament_id,
            "tournamentName": tournamentName,
            "title": self.title,
            "date": date,
            "entrants": self.entrants,
            "top3": self.top3,
            "topUpset": tu,
            "topSPR": tspr,
            "link": "https://www.start.gg/" + self.slug
        }
    
    @staticmethod
    def deleteEvent(cursor, event_id):
        sql = """DELETE FROM events
        WHERE id = {} ;""".format(event_id)
        cursor.execute(sql)

    @staticmethod
    def deleteFromTournament(cursor, tournament_id):
        # Delete every event from a tournament
        sql = """DELETE FROM events
        WHERE tournament_id = {} ;""".format(tournament_id)
        cursor.execute(sql)
    
    @staticmethod
    def ofSeason(cursor, season_id):
        sql = """SELECT events.id FROM
        events JOIN tournaments ON events.tournament_id = tournaments.id
        WHERE tournaments.season_id = {};""".format(season_id)
        cursor.execute(sql)
        return cursor.fetchall()

    @staticmethod
    def ofTournament(cursor, tournament_id):
        sql = """SELECT id FROM events WHERE tournament_id = {}""".format(tournament_id)
        cursor.execute(sql)
        return cursor.fetchall()
    
    @staticmethod
    def makeEventsTable():
        connection = sqlite3.connect("busmash.db")
        cursor = connection.cursor()
        sql = """CREATE TABLE IF NOT EXISTS events (
            id INTEGER PRIMARY KEY,
            tournament_id INTEGER NOT NULL,
            title TEXT NOT NULL,
            entrants INTEGER NOT NULL,
            top3 TEXT NOT NULL,
            upset TEXT NOT NULL,
            spr TEXT NOT NULL,
            slug TEXT NOT NULL
        );"""
        cursor.execute(sql)
        connection.commit()
        connection.close()