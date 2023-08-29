import sqlite3

class Set:

    def __init__(self, id = -1, event_id = -1, winner_id = -1, loser_id = -1,
                 winnerScore = 0, loserScore = 0, uf = 0):
        self.id = id
        self.event_id = event_id
        self.winner_id = winner_id
        self.loser_id = loser_id
        self.winnerScore = winnerScore
        self.loserScore = loserScore
        self.uf = uf
        self.connection = sqlite3.connect("busmash.db")
        self.cursor = self.connection.cursor()
    
    def load_set(self, id):
        self.cursor.execute("""
        SELECT * FROM sets
        WHERE id = ?
        """, (id,))

        row = self.cursor.fetchone()
        if row is None:
            return False
        
        self.id = row[0]
        self.event_id = row[1]
        self.winner_id = row[2]
        self.loser_id = row[3]
        self.winnerScore = row[4]
        self.loserScore = row[5]
        self.uf = row[6]
        return True
    
    def insert_set(self):
        self.cursor.execute("""SELECT * FROM sets WHERE id = ?""", (self.id,))
        if(self.cursor.fetchone() is not None):
            return False
        
        self.cursor.execute("""
        INSERT INTO sets
        (id, event_id, winner_id, loser_id, winnerScore, loserScore, uf)
        VALUES
        (?, ?, ?, ?, ?, ?, ?)
        """, (self.id, self.event_id, self.winner_id, self.loser_id,
                   self.winnerScore, self.loserScore, self.uf))
        self.connection.commit()
        return True
    
    def toJson(self):
        return {
            "id": self.id,
            "event_id": self.event_id,
            "winner_id": self.winner_id,
            "loser_id": self.loser_id,
            "winnerScore": self.winnerScore,
            "loserScore": self.loserScore,
            "uf": self.uf
        }
    
    @staticmethod
    def deleteSet(cursor, set_id):
        sql = """DELETE FROM sets
        WHERE id = ? ;""", (set_id,)
        cursor.execute(sql)
    
    @staticmethod
    def makeSetsTable():
        connection = sqlite3.connect("busmash.db")
        cursor = connection.cursor()
        sql = """CREATE TABLE IF NOT EXISTS sets (
            id INTEGER PRIMARY KEY,
            event_id INTEGER NOT NULL,
            winner_id INTEGER NOT NULL,
            loser_id INTEGER NOT NULL,
            winnerScore INTEGER NOT NULL,
            loserScore INTEGER NOT NULL,
            uf INTEGER NOT NULL
        );"""
        cursor.execute(sql)
        connection.commit()
        connection.close()