import sqlite3

class Season:
    def __init__(self, game = "None", season_num = -1, semester = "None"):
        self.id = -1
        self.game = game
        self.season_num = season_num
        self.semester = semester
        self.connection = sqlite3.connect("busmash.db")
        self.cursor = self.connection.cursor()
    
    def load_season(self, id):
        self.cursor.execute("""
        SELECT * FROM seasons
        WHERE id = ?
        """, (id,))

        row = self.cursor.fetchone()
        if row is None:
            return False
        
        self.id = row[0]
        self.game = row[1]
        self.season_num = row[2]
        self.semester = row[3]
        return True

    def insert_season(self):
        self.cursor.execute("""
        INSERT INTO seasons
        (game, season, semester)
        VALUES
        (?, ?, ?)
        """, (self.game, self.season_num, self.semester))
        self.connection.commit()
    
    def toJSON(self):
        self.cursor.execute(
            """SELECT * FROM tournaments WHERE season_id = ?""", (self.id,)
        )
        weeks = self.cursor.fetchall()
        if(weeks is None):
            numWeeks = 0
        else:
            numWeeks = len(weeks)

        return {
            "id": self.id,
            "game": self.game,
            "season": self.season_num,
            "numWeeks": numWeeks,
            "semester": self.semester
        }
    
    @staticmethod
    def deleteSeason(cursor, season_id):
        sql = """DELETE FROM seasons
        WHERE id = ? ;""", (season_id,)
        cursor.execute(sql)

    @staticmethod
    def makeSeasonsTable():
        connection = sqlite3.connect("busmash.db")
        cursor = connection.cursor()
        sql = """CREATE TABLE IF NOT EXISTS seasons (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            game TEXT NOT NULL,
            season INTEGER NOT NULL,
            semester TEXT NOT NULL
        );"""
        cursor.execute(sql)
        connection.commit()
        connection.close()