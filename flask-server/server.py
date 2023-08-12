from flask import Flask
import json
import sqlite3

app = Flask(__name__)

def makeSeasonsTable(cursor):
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

def insertSeason(cursor):
    sql = """INSERT INTO seasons
    (game, season, num_weeks, %ssemester)
    VALUES
    (\"%s\", %d, %d, %s\"%s\");""" %("", "Ultimate", 12, 8, "", "2023 Spring")
    # print(sql)
    cursor.execute(sql)

def getSeason(cursor, season):
    sql = """SELECT * FROM seasons WHERE season = %d;""" %(season)
    cursor.execute(sql)
    return cursor.fetchall()

# Seasons API route
@app.route("/seasons")
def seasons():
    # return {
    #     "season": [9, 10, 11, 12],
    #     "num_weeks": [8, 7, 10, 9]
    # }
    connection = sqlite3.connect("seasons.db")
    cursor = connection.cursor()
    makeSeasonsTable(cursor)
    # insertSeason(cursor)
    rows = getSeason(cursor, 12)
    print(json.dumps(rows))
    encodedJson = json.JSONEncoder().encode(rows)

    connection.commit()
    connection.close()
    
    resp = Flask.response_class(json.dumps(encodedJson, indent=2))
    resp.headers['Access-Control-Allow-Origin'] = '*'
    return resp

if __name__ == "__main__":
    app.run(debug = True)