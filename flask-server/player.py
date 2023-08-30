import sqlite3
from event import Event


class Player:
    def __init__(
        self,
        id=-1,
        name="",
        team="",
        numWins=0,
        numLosses=0,
        topPlacing=[-1, -1],
        demon=["", 0, 0],
        blessing=["", 0, 0],
    ):
        self.id = id
        self.name = name
        self.team = team
        self.numWins = numWins
        self.numLosses = numLosses
        self.topPlacing = topPlacing
        # [event id, placing at event]
        self.demon = demon
        # [demon name, num wins, num losses]
        # ex: ["Bob", 2, 11]
        self.blessing = blessing
        # [blessing name, num wins, num losses]
        # ex: ["Billy", 8, 1]
        self.connection = sqlite3.connect("busmash.db")
        self.cursor = self.connection.cursor()

    def load_player(self, id):
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
        tpEvent = Event()
        if tpEvent.load_event(self.topPlacing[0]):
            eventJson = tpEvent.toJSON()
            topPlacing = [
                eventJson["title"],
                eventJson["tournamentName"],
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
    def deletePlayer(cursor, player_id):
        sql = """DELETE FROM players
        WHERE id = ? ;"""
        cursor.execute(sql, (player_id,))

    @staticmethod
    def makePlayersTable():
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
