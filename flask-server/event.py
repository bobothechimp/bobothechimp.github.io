import sqlite3

class Event:

    def __init__(self, id = -1, tournament_id = -1, title = "", entrants = 0,
                 top3 = [], topUpset = ["", 0, 0, 0], topSPR = ["", 0, 0, 0]):
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
        return True
    
    def insert_event(self):
        top3 = "{},{},{}".format(self.top3[0], self.top3[1], self.top3[2])
        upsetInfo = "{},{},{},{}".format(self.topUpset[0], self.topUpset[1], 
                                         self.topUpset[2], self.topUpset[3])
        sprInfo = "{},{},{},{}".format(self.topSPR[0], self.topSPR[1], 
                                         self.topSPR[2], self.topSPR[3])
        self.cursor.execute("""
        INSERT INTO events
        (id, tournament_id, title, entrants, top3, upset, spr)
        VALUES
        ({}, {}, \"{}\", {}, \"{}\", \"{}\", \"{}\")
        """.format(self.id, self.tournament_id, self.title, self.entrants,
                   top3, upsetInfo, sprInfo))
        self.connection.commit()
    
    def toJSON(self):
        return {
            "id": self.id,
            "tournament_id": self.tournament_id,
            "title": self.title,
            "entrants": self.entrants,
            "top3": self.top3,
            "topUpset": self.topUpset,
            "topSPR": self.topSPR
        }
    
    @staticmethod
    def makeTournamentsTable(cursor):
        sql = """CREATE TABLE IF NOT EXISTS events (
            id INTEGER PRIMARY KEY,
            tournament_id INTEGER NOT NULL,
            title TEXT NOT NULL,
            entrants INTEGER NOT NULL,
            top3 TEXT NOT NULL,
            upset TEXT NOT NULL,
            spr TEXT NOT NULL
        );"""
        cursor.execute(sql)