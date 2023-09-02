import sqlite3
from event import Event


class Player:
    def __init__(
        self,
        id: int = -1,
        name: str = "",
        team: str = "",
        numWins: int = 0,
        numLosses: int = 0,
        topPlacing: list = [-1, -1],
        demon: list = ["", 0, 0],
        blessing: list = ["", 0, 0],
    ):
        self.id = id
        self.name = name  # name of the player
        self.team = team  # player's team, if any
        self.numWins = numWins  # number of wins for the player
        self.numLosses = numLosses  # number of losses for the player
        self.topPlacing = topPlacing  # information about the player's highest placing
        # [event id, placing at event]
        self.demon = demon  # information about the player's bracket demon
        # [demon name, num wins, num losses]
        # ex: ["Bob", 2, 11]
        self.blessing = blessing  # information about the player's bracket blessing
        # [blessing name, num wins, num losses]
        # ex: ["Billy", 8, 1]
        self.connection = sqlite3.connect("busmash.db")
        self.cursor = self.connection.cursor()

    def load_player(self, id: int):
        """
        Load a player from the database using the provided ID.

        Parameters
        ----------
        id: int
            ID of the player to load

        Returns
        -------
        bool
            Whether or not a player with the provided ID exists and was loaded
        """

        self.cursor.execute(
            """
        SELECT * FROM players
        WHERE id = ?
        """,
            (id,),
        )

        row = self.cursor.fetchone()
        if row is None:
            return False

        self.id = row[0]
        self.name = row[1]
        self.team = row[2]
        self.numWins = row[3]
        self.numLosses = row[4]
        topPlacingInfo = list(map(int, str(row[5]).split(",")))
        self.topPlacing = [topPlacingInfo[0], topPlacingInfo[1]]
        demonInfo = str(row[6]).split(",")
        self.demon = [demonInfo[0], demonInfo[1], demonInfo[2]]
        blessingInfo = str(row[7]).split(",")
        self.blessing = [blessingInfo[0], blessingInfo[1], blessingInfo[2]]
        return True

    def insert_player(self):
        """
        Insert this player into the database.

        Parameters
        ----------
        None

        Returns
        -------
        bool
            Whether or not this player was inserted (possibly already exists)
        """

        self.cursor.execute("""SELECT * FROM players WHERE id = ?""", (self.id,))
        if self.cursor.fetchone() is not None:
            return False
        if self.team is None:
            team = ""
        else:
            team = self.team
        topPlacingInfo = ",".join(map(str, self.topPlacing))
        demonInfo = ",".join(map(str, self.demon))
        blessingInfo = ",".join(map(str, self.blessing))
        self.cursor.execute(
            """
        INSERT INTO players
        (id, name, team, numWins, numLosses, topPlacing, demon, blessing)
        VALUES
        (?, ?, ?, ?, ?, ?, ?, ?)
        """,
            (
                self.id,
                self.name,
                team,
                self.numWins,
                self.numLosses,
                topPlacingInfo,
                demonInfo,
                blessingInfo,
            ),
        )
        self.connection.commit()
        return True

    def update_player(self):
        """
        Update this player's entries in the database.

        Parameters
        ----------
        None

        Returns
        -------
        bool
            Whether or not this player was updated (possibly doesn't exist)
        """

        self.cursor.execute("""SELECT * FROM players WHERE id = ?""", (self.id,))
        if self.cursor.fetchone() is None:
            return False

        if self.team is None:
            team = ""
        else:
            team = self.team
        topPlacingInfo = ",".join(map(str, self.topPlacing))
        demonInfo = ",".join(map(str, self.demon))
        blessingInfo = ",".join(map(str, self.blessing))

        self.cursor.execute(
            """
        UPDATE players SET
        name = ?,
        team = ?,
        numWins = ?,
        numLosses = ?,
        topPlacing = ?,
        demon = ?,
        blessing = ?
        WHERE id = ?
        """,
            (
                self.name,
                team,
                self.numWins,
                self.numLosses,
                topPlacingInfo,
                demonInfo,
                blessingInfo,
                self.id,
            ),
        )
        self.connection.commit()
        return True

    def toJSON(self):
        """
        Create a JSON object for this player's data.

        Parameters
        ----------
        None

        Returns
        -------
        dict
            JSON object representation of this player's data.
        """

        tpEvent = Event()
        if tpEvent.load_event(self.topPlacing[0]):
            eventJson = tpEvent.toJSON()
            topPlacing = [
                eventJson["title"],
                eventJson["tournamentName"],
                eventJson["entrants"],
            ] + self.topPlacing[1:2]
        else:
            topPlacing = [None] + self.topPlacing[1:2]
        demonPlayer = Player()
        if demonPlayer.load_player(self.demon[0]):
            demon = [demonPlayer.name] + self.demon[1:3]
        else:
            demon = ["Unknown"] + self.demon[1:3]
        blessingPlayer = Player()
        if blessingPlayer.load_player(self.blessing[0]):
            blessing = [blessingPlayer.name] + self.blessing[1:3]
        else:
            blessing = ["Unknown"] + self.blessing[1:3]

        return {
            "id": self.id,
            "name": self.name,
            "team": self.team,
            "numWins": self.numWins,
            "numLosses": self.numLosses,
            "topPlacing": topPlacing,
            "demon": demon,
            "blessing": blessing,
        }

    @staticmethod
    def deletePlayer(cursor: sqlite3.Cursor, player_id: int):
        """
        Delete a player with the provided ID (if it exists) from the database.

        Parameters
        ----------
        id: int
            ID of the player to delete

        Returns
        -------
        None
        """

        sql = """DELETE FROM players
        WHERE id = ? ;"""
        cursor.execute(sql, (player_id,))

    @staticmethod
    def makePlayersTable():
        """
        Create the players table in busmash.db if it doesn't yet exist.

        Parameters
        ----------
        None

        Returns
        -------
        None
        """

        connection = sqlite3.connect("busmash.db")
        cursor = connection.cursor()
        sql = """CREATE TABLE IF NOT EXISTS players (
            id INTEGER PRIMARY KEY,
            name TEXT NOT NULL,
            team TEXT,
            numWins INTEGER NOT NULL,
            numLosses INTEGER NOT NULL,
            topPlacing TEXT NOT NULL,
            demon TEXT NOT NULL,
            blessing TEXT NOT NULL
        );"""
        cursor.execute(sql)
        connection.commit()
        connection.close()
