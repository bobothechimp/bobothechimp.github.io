import sqlite3
from datetime import datetime


class Tournament:
    def __init__(
        self,
        id: int = -1,
        season_id: int = -1,
        week: int = -1,
        date: int = 0,
        slug: str = "",
    ):
        self.id = id  # id of the tournament in the database
        self.season_id = season_id  # id of the season to which this tournament belongs
        self.week = week  # Positive if a normal week number, negative if bimonthly
        # e.g. -10 indicates that this tournament is the 10th bimonthly
        self.date = date  # UNIX representation of date
        self.slug = slug  # start.gg slug for this tournament
        self.connection = sqlite3.connect("busmash.db")
        self.cursor = self.connection.cursor()

    def load_tournament(self, id: int):
        """
        Load a tournament from the database using the provided ID.

        Parameters
        ----------
        id: int
            ID of the tournament to load

        Returns
        -------
        bool
            Whether or not a tournament with the provided ID exists and was loaded
        """

        self.cursor.execute(
            """
        SELECT * FROM tournaments
        WHERE id = ?
        """,
            (id,),
        )

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
        """
        Insert this tournament into the database.

        Parameters
        ----------
        None

        Returns
        -------
        bool
            Whether or not this tournament was inserted (possibly already exists)
        """

        self.cursor.execute("""SELECT * FROM tournaments WHERE id = ?""", (self.id,))
        if self.cursor.fetchone() is not None:
            return False

        self.cursor.execute(
            """
        INSERT INTO tournaments
        (id, season_id, week, date, slug)
        VALUES
        (?, ?, ?, ?, ?)
        """,
            (self.id, self.season_id, self.week, self.date, self.slug),
        )
        self.connection.commit()
        return True

    def toJSON(self):
        """
        Create a JSON object for this tournament's data.

        Parameters
        ----------
        None

        Returns
        -------
        dict
            JSON object representation of this tournament's data.
        """

        date = datetime.utcfromtimestamp(self.date).strftime("%B %d, %Y")
        self.cursor.execute(
            """
        SELECT semester, game FROM seasons
        WHERE id = ?
        """,
            (self.season_id,),
        )
        season = self.cursor.fetchone()
        seasonName = "{} {}".format(season[0], season[1])
        if self.week < 0:
            week = "BM" + str(-1 * self.week)
        else:
            week = self.week

        return {
            "id": self.id,
            "season_id": self.season_id,
            "seasonName": seasonName,
            "week": week,
            "date": date,
            "link": "https://www.start.gg/" + self.slug,
        }

    @staticmethod
    def deleteTournament(cursor: sqlite3.Cursor, tournament_id: int):
        """
        Delete a tournament with the provided ID (if it exists) from the database.

        Parameters
        ----------
        id: int
            ID of the tournament to delete

        Returns
        -------
        None
        """

        sql = """DELETE FROM tournaments
        WHERE id = ? ;"""
        cursor.execute(sql, (tournament_id,))

    @staticmethod
    def ofSeason(cursor: sqlite3.Cursor, season_id: int):
        """
        Return a list of all tournament IDs in the database which belong to the provided season.

        Parameters
        ----------
        id: int
            ID of the season from which to gather tournaments

        Returns
        -------
        list
            List of rows of all tournaments which belong to the provided season. Each row is a list which only contains the ID.
        """

        sql = """SELECT id FROM tournaments WHERE season_id = ?"""
        cursor.execute(sql, (season_id,))
        return cursor.fetchall()

    @staticmethod
    def makeTournamentsTable():
        """
        Create the tournaments table in busmash.db if it doesn't yet exist.

        Parameters
        ----------
        None

        Returns
        -------
        None
        """

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
