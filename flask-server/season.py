import sqlite3

class Season:
    def __init__(self, game = "None", season_num = -1, num_weeks = 0,
                 bimonthlies = [], semester = "None"):
        self.id = -1
        self.game = game
        self.season_num = season_num
        self.num_weeks = num_weeks
        self.bimonthlies = bimonthlies
        self.semester = semester
        self.connection = sqlite3.connect("busmash.db")
        self.cursor = self.connection.cursor()
    
    def load_season(self, id):
        self.cursor.execute("""
        SELECT * FROM seasons
        WHERE id = {}
        """.format(id))

        row = self.cursor.fetchone()
        if row is None:
            return False
        
        self.id = row[0]
        self.game = row[1]
        self.season_num = row[2]
        self.num_weeks = row[3]
        self.bimonthlies = [row[4], row[5]]
        self.semester = row[6]
        return True

    def insert_season(self):
        bmStrings = ["", ""]
        for i in range(len(self.bimonthlies)):
            bm = self.bimonthlies[i]
            bmStrings[0] += "bimonthly{}, ".format(i + 1)
            bmStrings[1] += "{}, ".format(bm)
        
        print("""
        INSERT INTO seasons
        (game, season, num_weeks, {}semester)
        VALUES
        (\"{}\", {}, {}, {}\"{}\")
        """.format(bmStrings[0], self.game, self.season_num,
                   self.num_weeks, bmStrings[1], self.semester))
        self.cursor.execute("""
        INSERT INTO seasons
        (game, season, num_weeks, {}semester)
        VALUES
        (\"{}\", {}, {}, {}\"{}\")
        """.format(bmStrings[0], self.game, self.season_num,
                   self.num_weeks, bmStrings[1], self.semester))
        self.connection.commit()
    
    def toJSON(self):
        return {
            "id": self.id,
            "game": self.game,
            "season": self.season_num,
            "num_weeks": self.num_weeks,
            "bimonthly1": self.bimonthlies[0],
            "bimonthly2": self.bimonthlies[1],
            "semester": self.semester
        }
    
    @staticmethod
    def deleteSeason(cursor, season_id):
        sql = """DELETE FROM seasons
        WHERE id = {} ;""".format(season_id)
        cursor.execute(sql)

    @staticmethod
    def makeSeasonsTable():
        connection = sqlite3.connect("busmash.db")
        cursor = connection.cursor()
        sql = """CREATE TABLE IF NOT EXISTS seasons (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            game TEXT NOT NULL,
            season INTEGER NOT NULL,
            num_weeks INTEGER NOT NULL,
            bimonthly1 INTEGER,
            bimonthly2 INTEGER,
            semester TEXT NOT NULL
        );"""
        cursor.execute(sql)
        connection.commit()
        connection.close()