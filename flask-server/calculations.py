# Calculate highest SPR in list of entrants
def highestSPR(entrants):
    maxSPR = 0
    player = entrants[0]["name"]
    seed = entrants[0]["initialSeedNum"]
    placing = entrants[0]["standing"]["placement"]
    for entrant in entrants:
        spr = calculateSPR(entrant)
        if spr > maxSPR:
            maxSPR = spr
            player_id = entrant["name"]
            seed = entrant["initialSeedNum"]
            placing = entrant["standing"]["placement"]
    return maxSPR, player_id, seed, placing

# Calculate the SPR of a single entrant
def calculateSPR(entrant):
    seed = entrant["initialSeedNum"]
    placing = entrant["standing"]["placement"]
    return calculateSetsFromWinning(seed) - calculateSetsFromWinning(placing)

# Calculate highest UF in list of sets
def highestUF(sets, entrantsIdTable):
    maxUF = 0
    score = sets[0]["displayScore"]
    upsetterSeed = entrantsIdTable[sets[0]["slots"][0]["entrant"]["id"]]["seed"]
    upsetteeSeed = entrantsIdTable[sets[0]["slots"][1]["entrant"]["id"]]["seed"]
    for set in sets:
        player1_id = set["slots"][0]["entrant"]["id"]
        player2_id = set["slots"][1]["entrant"]["id"]
        player1Won = set["winnerId"] == player1_id
        #True if P1 won, false if P2 won

        if(player1Won):
            winner_id = player1_id
            loser_id = player2_id
        else:
            winner_id = player2_id
            loser_id = player1_id
        uf = calculateUF(entrantsIdTable[winner_id], entrantsIdTable[loser_id])

        if(uf > maxUF):
            maxUF = uf
            score = createScoreHeadline(set["displayScore"], winner_id,
                                        loser_id, entrantsIdTable)
            upsetterSeed = entrantsIdTable[winner_id]["seed"]
            upsetteeSeed = entrantsIdTable[loser_id]["seed"]
    return maxUF, score, upsetterSeed, upsetteeSeed

# Calculate the UF of a single set
def calculateUF(winner, loser):
    winnerSeed = winner["seed"]
    loserSeed = loser["seed"]
    return calculateSetsFromWinning(winnerSeed) - calculateSetsFromWinning(loserSeed)

# Create a score headline in the form of "Winner # - # Loser"
def createScoreHeadline(displayScore, winner_id, loser_id, entrantsIdTable):
    winnerName = entrantsIdTable[winner_id]["name"]
    loserName = entrantsIdTable[loser_id]["name"]
    winnerScoreIndex = displayScore.index(winnerName) + len(winnerName) + 1
    loserScoreIndex = displayScore.index(loserName) + len(loserName) + 1
    return "{} {} - {} {}".format(winnerName, displayScore[winnerScoreIndex],
                                  displayScore[loserScoreIndex], loserName)

# Calculate the number of losers rounds a
# seed/placing is away from first place
def calculateSetsFromWinning(position):
    placings = [1, 2, 3, 4, 6, 8, 12, 16, 24, 32, 48, 64, 96]
    for i in range(len(placings)):
        if(position <= placings[i]):
            return i
    return len(placings)