import sqlite3


class Season:
    def __init__(
        self, game: str = "None", season_num: int = -1, semester: str = "None"
    ):
        self.id = -1  # id of the season in the database
        self.game = game  # game of the season
        self.season_num = season_num  # the season's number
        self.semester = semester  # the semester in which the season happened
        self.connection = sqlite3.connect("busmash.db")
        self.cursor = self.connection.cursor()

    def load_season(self, id: int):
        """
        Load a season from the database using the provided ID.

        Parameters
        ----------
        id: int
            ID of the season to load

        Returns
        -------
        bool
            Whether or not a season with the provided ID exists and was loaded
        """

        self.cursor.execute(
            """
        SELECT * FROM seasons
        WHERE id = ?
        """,
            (id,),
        )

        row = self.cursor.fetchone()
        if row is None:
            return False

        self.id = row[0]
        self.game = row[1]
        self.season_num = row[2]
        self.semester = row[3]
        return True

    def insert_season(self):
        """
        Insert this season into the database.

        Parameters
        ----------
        None

        Returns
        -------
        None
        """

        self.cursor.execute(
            """
        INSERT INTO seasons
        (game, season, semester)
        VALUES
        (?, ?, ?)
        """,
            (self.game, self.season_num, self.semester),
        )
        self.connection.commit()

    def toJSON(self):
        """
        Create a JSON object for this season's data.

        Parameters
        ----------
        None

        Returns
        -------
        dict
            JSON object representation of this season's data.
        """

        self.cursor.execute(
            """SELECT * FROM tournaments WHERE season_id = ?""", (self.id,)
        )
        weeks = self.cursor.fetchall()
        if weeks is None:
            numWeeks = 0
        else:
            numWeeks = len(weeks)

        return {
            "id": self.id,
            "game": self.game,
            "season": self.season_num,
            "numWeeks": numWeeks,
            "semester": self.semester,
        }

    @staticmethod
    def deleteSeason(cursor: sqlite3.Cursor, season_id: int):
        """
        Delete a season with the provided ID (if it exists) from the database.

        Parameters
        ----------
        id: int
            ID of the season to delete

        Returns
        -------
        None
        """

        sql = """DELETE FROM seasons
        WHERE id = ? ;"""
        cursor.execute(sql, (season_id,))

    @staticmethod
    def makeSeasonsTable():
        """
        Create the seasons table in busmash.db if it doesn't yet exist.

        Parameters
        ----------
        None

        Returns
        -------
        None
        """

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
