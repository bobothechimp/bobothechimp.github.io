from event import Event

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
            player = entrant["name"]
            seed = entrant["initialSeedNum"]
            placing = entrant["standing"]["placement"]
    return maxSPR, player, seed, placing

# Calculate the SPR of a single entrant
def calculateSPR(player):
    seed = player["seed"]
    placing = player["placing"]
    return calculateSetsFromWinning(seed) - calculateSetsFromWinning(placing)

# Determine if a player's placing is better than their current best ever
def determineBetterPlacing(curPlacing, oldTopPlacing):
    if(curPlacing[1] < oldTopPlacing[1]):
            return curPlacing
    else:
        curEvent = Event()
        curEvent.load_event(curPlacing[0])
        oldEvent = Event()
        oldEvent.load_event(oldTopPlacing[0])
        if(curPlacing[1] == oldTopPlacing[1] and
            curEvent.entrants > oldEvent.entrants):
            return curPlacing
        else:
            return oldTopPlacing

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

# Get the numerical scores of a set's winner and loser
def getScores(displayScore, winnerName, loserName):
    winnerScoreIndex = displayScore.index(winnerName) + len(winnerName) + 1
    loserScoreIndex = displayScore.index(loserName) + len(loserName) + 1
    if(displayScore[winnerScoreIndex] == "W"):
        winnerScore = 3
        loserScore = 0
    else:
        winnerScore = int(displayScore[winnerScoreIndex])
        loserScore = int(displayScore[loserScoreIndex])
    return winnerScore, loserScore

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

# Determine a player's bracket demon and blessing
def calculateDemonAndBlessing(player_id, winningSets, losingSets):
    records = {}
    #dict of length 2 arrays
    #example entry: opponent_id: [numWins, numLosses]
    for set in winningSets:
        loser_id = set[3] #id of opponent
        if(records.get(loser_id) is None):
            records[loser_id] = [1, 0]
        else:
            records[loser_id][0] += 1
    
    for set in losingSets:
        winner_id = set[2] #id of opponent
        if(records.get(winner_id) is None):
            records[winner_id] = [0, 1]
        else:
            records[winner_id][1] += 1
    
    demon = [-1, 0, 0]
    demonScore = 1.0
    #make default winrate against demon 100% so that it's practically
    #impossible for this to end up as the returned demon value
    blessing = [-1, 0, 0]
    blessingScore = 0.0
    #same logic but 0% winrate
    for opponent_id in records.keys():
        record = records[opponent_id] #TODO stop players from having their demon be themselves
        """
        THE PROBLEM:
        It's hard to say whether an 21-13 record against opponent 1 is
           better or worse than a 5-3 record against opponent 2
        It's 61.8% vs 62.5%, but the total number of sets is too low for
           such a minor difference to be the end all be all
        If opponent 1 wins their next set, the winrate drops to 60.0%
           but if opponent 2 wins their next set, the winrate drops to 55.5%
        This issue is much more apparent when comparing something like
           a 2-0 record vs a 19-1 record, where the 2-0 comes out on top
        
        THE SOLUTION (a trick I learned online):
        Add 1 win and 1 loss to each record, and compare *those* records
        For our first example, it would now be 22-14 vs 6-4, which is
           61.1% vs 60.0%, so the 21-13 record is better
        For our second example, it would now be 3-1 vs 20-2, which is
           75.0% vs 90.9%, so the 19-1 record is better
        """
        
        score = 1.0 * (record[0] + 1) / (record[0] + record[1] + 2)
        if(score < demonScore):
            demonScore = score
            demon = [opponent_id, record[0], record[1]]
        if(score > blessingScore):
            blessingScore = score
            blessing = [opponent_id, record[0], record[1]]
    return demon, blessing
