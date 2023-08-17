import sqlite3
from datetime import datetime

class Tournament:

    def __init__(self, id = -1, season_id = -1, week = -1, date=0):
        self.id = id
        self.season_id = season_id
        self.week = week
        self.date = date #UNIX representation of date
        self.connection = sqlite3.connect("busmash.db")
        self.cursor = self.connection.cursor()
    
    def load_tournament(self, id):
        self.cursor.execute("""
        SELECT * FROM tournaments
        WHERE id = {}
        """.format(id))

        row = self.cursor.fetchone()
        if row is None:
            return False
        
        self.id = row[0]
        self.season_id = row[1]
        self.week = row[2]
        self.date = row[3]
        return True
    
    def insert_tournament(self):
        self.cursor.execute("""
        INSERT INTO tournaments
        (id, season_id, week, date)
        VALUES
        ({}, {}, {}, {})
        """.format(self.id, self.season_id, self.week, self.date))
        self.connection.commit()
    
    def toJSON(self):
        date = datetime.utcfromtimestamp(self.date).strftime('%B %d, %Y')
        return {
            "id": self.id,
            "season_id": self.season_id,
            "week": self.week,
            "date": date
        }
    
    @staticmethod
    def deleteTournament(cursor, tournament_id):
        sql = """DELETE FROM tournaments
        WHERE id = {} ;""".format(tournament_id)
        cursor.execute(sql)
    
    @staticmethod
    def makeTournamentsTable():
        connection = sqlite3.connect("busmash.db")
        cursor = connection.cursor()
        sql = """CREATE TABLE IF NOT EXISTS tournaments (
            id INTEGER PRIMARY KEY,
            season_id INTEGER NOT NULL,
            week INTEGER NOT NULL,
            date INTEGER NOT NULL
        );"""
        cursor.execute(sql)
        connection.commit()
        connection.close()