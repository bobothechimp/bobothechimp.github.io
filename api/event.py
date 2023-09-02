import sqlite3
from datetime import datetime


class Event:
    def __init__(
        self,
        id: int = -1,
        tournament_id: int = -1,
        title: str = "",
        entrants: int = 0,
        top3: list = [],
        topUpset: list = [-1, 0, 0, 0],
        topSPR: list = [-1, 0, 0, 0],
        slug: str = "",
    ):
        self.id = id  # id of the event in the database
        self.tournament_id = tournament_id
        # id of the tournament to which this event belongs
        self.title = title  # title of the event
        self.entrants = entrants  # number of entrants at the event
        self.top3 = top3  # ids of top 3 finishers for the event
        self.topUpset = topUpset  # information about the event's biggest upset
        # [set id, upsetter seed, upsettee seed, upset factor]
        # ex: [120385, 28, 8, 4]
        self.topSPR = topSPR  # information about the event's biggest SPR
        # [player id, seeded placement, final placement, SPR]
        # ex: [693829, 25, 3, 7]
        self.slug = slug  # start.gg slug for this event
        self.connection = sqlite3.connect("busmash.db")
        self.cursor = self.connection.cursor()

    def load_event(self, id: int):
        """
        Load an event from the database using the provided ID.

        Parameters
        ----------
        id: int
            ID of the event to load

        Returns
        -------
        bool
            Whether or not an event with the provided ID exists and was loaded
        """

        self.cursor.execute(
            """
        SELECT * FROM events
        WHERE id = ?
        """,
            (id,),
        )

        row = self.cursor.fetchone()
        if row is None:
            return False

        self.id = row[0]
        self.tournament_id = row[1]
        self.title = row[2]
        self.entrants = row[3]
        self.top3 = str(row[4]).split(",")
        self.topUpset = list(map(int, str(row[5]).split(",")))
        self.topSPR = list(map(int, str(row[6]).split(",")))
        self.slug = row[7]
        return True

    def insert_event(self):
        """
        Insert this event into the database.

        Parameters
        ----------
        None

        Returns
        -------
        bool
            Whether or not this event was inserted (possibly already exists)
        """

        self.cursor.execute("""SELECT * FROM events WHERE id = ?""", (self.id,))
        if self.cursor.fetchone() is not None:
            return False

        top3 = ",".join(self.top3)
        upsetInfo = ",".join(map(str, self.topUpset))
        sprInfo = ",".join(map(str, self.topSPR))
        self.cursor.execute(
            """
        INSERT INTO events
        (id, tournament_id, title, entrants, top3, upset, spr, slug)
        VALUES
        (?, ?, ?, ?, ?, ?, ?, ?)
        """,
            (
                self.id,
                self.tournament_id,
                self.title,
                self.entrants,
                top3,
                upsetInfo,
                sprInfo,
                self.slug,
            ),
        )
        self.connection.commit()
        return True

    def toJSON(self):
        """
        Create a JSON object for this event's data.

        Parameters
        ----------
        None

        Returns
        -------
        dict
            JSON object representation of this event's data.
        """

        self.cursor.execute(
            """
        SELECT semester, game, week, date
        FROM seasons JOIN tournaments
        ON seasons.id = tournaments.season_id
        WHERE tournaments.id = ?;
        """,
            (self.tournament_id,),
        )
        tournament = self.cursor.fetchone()
        if tournament is None:
            tournamentName = "Tournament not in database"
        else:
            if tournament[2] < 0:
                week = "BM" + str(-1 * tournament[2])
            else:
                week = "Week " + str(tournament[2])
            tournamentName = "{} {} {}".format(tournament[0], tournament[1], week)
        if self.topUpset[3] == 0:
            # 0 UF means no upsets
            tu = "No upsets"
        else:
            self.cursor.execute(
                """
            SELECT winnerScore, name
            FROM sets JOIN players
            ON sets.winner_id = players.id
            WHERE sets.id = ?
            """,
                (self.topUpset[0],),
            )
            winner = self.cursor.fetchone()

            self.cursor.execute(
                """
            SELECT loserScore, name
            FROM sets JOIN players
            ON sets.loser_id = players.id
            WHERE sets.id = ?
            """,
                (self.topUpset[0],),
            )
            loser = self.cursor.fetchone()

            scoreHeadline = "{} {} - {} {}".format(
                winner[1], winner[0], loser[0], loser[1]
            )
            tu = [scoreHeadline] + self.topUpset[1:4]
        if self.topSPR[3] == 0:
            # 0 SPR means no overperformers
            tspr = "No overperformers"
        else:
            self.cursor.execute(
                """SELECT name FROM players WHERE id = ?""", (self.topSPR[0],)
            )
            name = self.cursor.fetchone()
            tspr = [name] + self.topSPR[1:4]
        if tournament is None:
            date = "Unknown date"
        else:
            date = datetime.utcfromtimestamp(tournament[3]).strftime("%B %d, %Y")

        return {
            "id": self.id,
            "tournament_id": self.tournament_id,
            "tournamentName": tournamentName,
            "title": self.title,
            "date": date,
            "entrants": self.entrants,
            "top3": self.top3,
            "topUpset": tu,
            "topSPR": tspr,
            "link": "https://www.start.gg/" + self.slug,
        }

    @staticmethod
    def deleteEvent(cursor: sqlite3.Cursor, event_id: int):
        """
        Delete an event with the provided ID (if it exists) from the database.

        Parameters
        ----------
        id: int
            ID of the event to delete

        Returns
        -------
        None
        """

        sql = """DELETE FROM events
        WHERE id = ? ;"""
        cursor.execute(sql, (event_id,))

    @staticmethod
    def deleteFromTournament(cursor, tournament_id):
        """
        Delete all events of the tournament with the provided ID (if it exists) from the database.

        Parameters
        ----------
        id: int
            ID of the tournament whose events to delete

        Returns
        -------
        None
        """

        sql = """DELETE FROM events
        WHERE tournament_id = ? ;"""
        cursor.execute(sql, (tournament_id,))

    @staticmethod
    def ofSeason(cursor: sqlite3.Cursor, season_id: int):
        """
        Return a list of all event IDs in the database which belong to the provided season.

        Parameters
        ----------
        id: int
            ID of the season from which to gather events

        Returns
        -------
        list
            List of rows of all events which belong to the provided season\n
            Each row is a list which only contains the ID
        """

        sql = """SELECT events.id FROM
        events JOIN tournaments ON events.tournament_id = tournaments.id
        WHERE tournaments.season_id = ?;"""
        cursor.execute(sql, (season_id,))
        return cursor.fetchall()

    @staticmethod
    def ofTournament(cursor: sqlite3.Cursor, tournament_id: int):
        sql = """SELECT id FROM events WHERE tournament_id = ?"""
        cursor.execute(sql, (tournament_id,))
        return cursor.fetchall()

    @staticmethod
    def makeEventsTable():
        """
        Create the events table in busmash.db if it doesn't yet exist.

        Parameters
        ----------
        None

        Returns
        -------
        None
        """

        connection = sqlite3.connect("busmash.db")
        cursor = connection.cursor()
        sql = """CREATE TABLE IF NOT EXISTS events (
            id INTEGER PRIMARY KEY,
            tournament_id INTEGER NOT NULL,
            title TEXT NOT NULL,
            entrants INTEGER NOT NULL,
            top3 TEXT NOT NULL,
            upset TEXT NOT NULL,
            spr TEXT NOT NULL,
            slug TEXT NOT NULL
        );"""
        cursor.execute(sql)
        connection.commit()
        connection.close()
