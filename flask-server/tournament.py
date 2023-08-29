import sqlite3
from datetime import datetime

class Tournament:

    def __init__(self, id = -1, season_id = -1, week = -1, date = 0, slug = ""):
        self.id = id
        self.season_id = season_id
        self.week = week #Positive if a normal week number, negative if bimonthly
        #e.g. -10 indicates that this tournament is the 10th bimonthly
        self.date = date #UNIX representation of date
        self.slug = slug
        self.connection = sqlite3.connect("busmash.db")
        self.cursor = self.connection.cursor()
    
    def load_tournament(self, id):
        self.cursor.execute("""
        SELECT * FROM tournaments
        WHERE id = ?
        """, (id,))

        row = self.cursor.fetchone()
        if row is None:
            return False
        
        self.id = row[0]
        self.season_id = row[1]
        self.week = row[2]
        self.date = row[3]
        self.slug = row[4]
        return True
    
    def insert_tournament(self):
        self.cursor.execute("""SELECT * FROM tournaments WHERE id = ?""", (self.id,))
        if(self.cursor.fetchone() is not None):
            return False
        
        self.cursor.execute("""
        INSERT INTO tournaments
        (id, season_id, week, date, slug)
        VALUES
        (?, ?, ?, ?, ?)
        """, (self.id, self.season_id, self.week, self.date, self.slug))
        self.connection.commit()
        return True
    
    def toJSON(self):
        date = datetime.utcfromtimestamp(self.date).strftime('%B %d, %Y')
        self.cursor.execute("""
        SELECT semester, game FROM seasons
        WHERE id = ?
        """, (self.season_id,))
        season = self.cursor.fetchone()
        seasonName = "{} {}".format(season[0], season[1])
        if(self.week < 0):
            week = "BM" + str(-1 * self.week)
        else:
            week = self.week

        return {
            "id": self.id,
            "season_id": self.season_id,
            "seasonName": seasonName,
            "week": week,
            "date": date,
            "link": "https://www.start.gg/" + self.slug
        }
    
    @staticmethod
    def deleteTournament(cursor, tournament_id):
        sql = """DELETE FROM tournaments
        WHERE id = ? ;"""
        cursor.execute(sql, (tournament_id,))
    
    @staticmethod
    def ofSeason(cursor, season_id):
        sql = """SELECT id FROM tournaments WHERE season_id = ?"""
        cursor.execute(sql, (season_id,))
        return cursor.fetchall()

    @staticmethod
    def makeTournamentsTable():
        connection = sqlite3.connect("busmash.db")
        cursor = connection.cursor()
        sql = """CREATE TABLE IF NOT EXISTS tournaments (
            id INTEGER PRIMARY KEY,
            season_id INTEGER NOT NULL,
            week INTEGER NOT NULL,
            date INTEGER NOT NULL,
            slug TEXT NOT NULL
        );"""
        cursor.execute(sql)
        connection.commit()
        connection.close()