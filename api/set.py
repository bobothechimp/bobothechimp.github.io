import sqlite3


class Set:
    def __init__(
        self,
        id: int = -1,
        event_id: int = -1,
        winner_id: int = -1,
        loser_id: int = -1,
        winnerScore: int = 0,
        loserScore: int = 0,
        uf: int = 0,
    ):
        self.id = id  # id of the set in the database
        self.event_id = event_id  # id of the event to which this set belongs
        self.winner_id = winner_id  # id of the winning player
        self.loser_id = loser_id  # id of the losing player
        self.winnerScore = winnerScore  # final score of the winning player
        self.loserScore = loserScore  # final score of the losing player
        self.uf = uf  # upset factor of the set
        self.connection = sqlite3.connect("busmash.db")
        self.cursor = self.connection.cursor()

    def load_set(self, id: int):
        """
        Load a set from the database using the provided ID.

        Parameters
        ----------
        id: int
            ID of the set to load

        Returns
        -------
        bool
            Whether or not a set with the provided ID exists and was loaded
        """

        self.cursor.execute(
            """
        SELECT * FROM sets
        WHERE id = ?
        """,
            (id,),
        )

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
        """
        Insert this set into the database.

        Parameters
        ----------
        None

        Returns
        -------
        bool
            Whether or not this set was inserted (possibly already exists)
        """

        self.cursor.execute("""SELECT * FROM sets WHERE id = ?""", (self.id,))
        if self.cursor.fetchone() is not None:
            return False

        self.cursor.execute(
            """
        INSERT INTO sets
        (id, event_id, winner_id, loser_id, winnerScore, loserScore, uf)
        VALUES
        (?, ?, ?, ?, ?, ?, ?)
        """,
            (
                self.id,
                self.event_id,
                self.winner_id,
                self.loser_id,
                self.winnerScore,
                self.loserScore,
                self.uf,
            ),
        )
        self.connection.commit()
        return True

    def toJson(self):
        """
        Create a JSON object for this set's data.

        Parameters
        ----------
        None

        Returns
        -------
        dict
            JSON object representation of this set's data.
        """

        return {
            "id": self.id,
            "event_id": self.event_id,
            "winner_id": self.winner_id,
            "loser_id": self.loser_id,
            "winnerScore": self.winnerScore,
            "loserScore": self.loserScore,
            "uf": self.uf,
        }

    @staticmethod
    def deleteSet(cursor: sqlite3.Cursor, set_id: id):
        """
        Delete a set with the provided ID (if it exists) from the database.

        Parameters
        ----------
        id: int
            ID of the set to delete

        Returns
        -------
        None
        """

        sql = """DELETE FROM sets
        WHERE id = ? ;"""
        cursor.execute(sql, (set_id,))

    @staticmethod
    def makeSetsTable():
        """
        Create the sets table in busmash.db if it doesn't yet exist.

        Parameters
        ----------
        None

        Returns
        -------
        None
        """

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
