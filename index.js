//yo
function countStrings(arr) {
    let counts = {'w': 0, 'o': 0, 'b': 0, 'r': 0, 'g': 0, 'y': 0};

    for (const num of arr) {
    counts[num] = counts[num] ? counts[num] + 1 : 1;
    }

    return counts;
}
class Cube {
    constructor(name,
                layout = [['w', 'w', 'w'],
                          ['w', 'w', 'w'],
                          ['w', 'w', 'w']]
    ) {
        this.name = name;
        this.layout = layout;
    }
    getLayout() {
        return this.layout
    }
    // x 0 1 2
    //y
    //0  1 2 3
    //1  4 5 6
    //2  7 8 9
    //
    //
    // x    0      1      2
    //y
    //0   [0, 0] [1, 0]	[2, 0]
    //1   [0, 1] [1, 1]	[2, 1]
    //2   [0, 2] [1, 2]	[2, 2]
    getLayoutxy(x,y) {
        return this.layout[x][y]
    }
    setLayout(newLayout) {
        this.layout = newLayout
    }
    countCubeStrings() {
        return countStrings(this.getLayout().flat())
    }
    getSquareType(x, y) {
        let xyArray = [x,y];
        switch(xyArray) {
            case [0, 0]:
                result = 'diagonal'
                break;
            case [1, 0]:
                result = 'edge'
                break;
            case [2, 0]:
                result = 'diagonal'
                break;
            case [0, 1]:
                result = 'edge'
                break;
            case [1, 1]:
                result = 'centre'
                break;
            case [2, 1]:
                result = 'edge'
                break;
            case [0, 2]:
                result = 'diagonal'
                break;
            case [1, 2]:
                result = 'edge'
                break;
            case [2, 2]:
                result = 'diagonal'
        };
        return result
    }
    getAdjacents(x,y) {
        let xyArray = [x,y];
        let adjacentsCoords = [];
        let adjacents = [];
        switch(xyArray) {
            case [0, 0]:
                adjacentsCoords = [[1, 0], [0, 1]]
                break;
            case [1, 0]:
                adjacentsCoords = [[0, 0], [2, 0], [1, 1]]
                break;
            case [2, 0]:
                adjacentsCoords = [[1, 0], [2, 1]]
                break;
            case [0, 1]:
                adjacentsCoords = [[0, 0], [1, 1], [0, 2]]
                break;
            case [1, 1]:
                adjacentsCoords = [[1, 0], [0, 1], [2, 1], [1, 2]]
                break;
            case [2, 1]:
                adjacentsCoords = [[2, 0], [1, 1], [2, 2]]
                break;
            case [0, 2]:
                adjacentsCoords = [[0, 1], [1, 2]]
                break;
            case [1, 2]:
                adjacentsCoords = [[1, 1], [0, 2], [2, 2]]
                break;
            case [2, 2]:
                adjacentsCoords = [[2, 1], [1, 2]]
        };
        for(let i = 0; i < adjacentsCoords.length; i++) {
            adjacents.push(this.getLayoutxy(adjacentsCoords[i][0], adjacentsCoords[i][1]))
        }
        return adjacents
    }
    getAttackContributors(x,y) {
        return [this.getLayoutxy(x, y), this.getAdjacents(x,y)]
    }
}

class Player {
    constructor(playerID, health=0, poison=0, temperature=0) {
        this.playerID = playerID;
        this.health = health;
        this.poison = poison;
        this.temperature = temperature;
    }
    getPlayerID() {
        return this.playerID
    }
    getHealth() {
        return this.health
    }
    getPoison() {
        return this.poison
    }
    getTemperature() {
        return this.temperature
    }
    setHealth(newHealth) {
        this.health = newHealth
    }
    setPoison(newPoison) {
        this.poison = newPoison
    }
    setTemperature(newTemperature) {
        this.temperature = newTemperature
    }
}

class Game {
    constructor(gameNo=0, turnNumber=0, turnPlayerID=1, isActive=true, result=null,
        p1Cube= [['w', 'w', 'w'],
                 ['w', 'w', 'w'],
                 ['w', 'w', 'w']],

        p2Cube= [['w', 'w', 'w'],
                 ['w', 'w', 'w'],
                 ['w', 'w', 'w']]
    ) {
        this.gameNo = gameNo,
        this.turnNumber = turnNumber,
        this.turnPlayerID = turnPlayerID,
        this.isActive = isActive,
        this.result = result,
        this.Player1 = new Player(1),
        this.Player2 = new Player(2),
        this.p1Cube = new Cube('p1Cube', p1Cube),
        this.p2Cube = new Cube('p2Cube', p2Cube)
    }
    getGameNo() {
        return this.gameNo
    }
    getTurnNumber() {
        return this.turnNumber
    }
    getTurnPlayerID() {
        return this.turnPlayerID
    }
    getPlayer(playerNo) {
        if(playerNo == 1) {
            return this.Player1
        } else {
            return this.Player2
        }
    }
    getTurnPlayer() {
        if(this.turnPlayerID == 1) {
            return this.Player1
        } else {
            return this.Player2
        }
    }
    getIsActive() {
        return this.isActive
    }
    getResult() {
        return this.result
    }
    getPlayerCube(playerNo) {
        if(playerNo == 1) {
            return this.p1Cube
        } else {
            return this.p2Cube
        }
    }
    getTurnPlayerCube() {
        if(this.turnPlayerID == 1) {
            return this.p1Cube
        } else {
            return this.p2Cube
        }
    }
    getPlayerCubexy(playerNo, x, y) {
        if(playerNo == 1) {
            return this.p1Cube.getLayoutxy(x, y)
        } else {
            return this.p2Cube.getLayoutxy(x, y)
        }
    }
    getStatusChangesandAttackContributors(targetPlayerID, x, y) {
        let poisonChange = 0;
        let temperatureChange = 0;
        let attackContributors = this.getTurnPlayerCube().getAttackContributors(x, y);
        let attackContributorsCounts = countStrings(attackContributors[0]);
        poisonChange = (((this.turnPlayerID!=targetPlayerID)*2 - 1)*(attackContributors[0] == 'g') + attackContributorsCounts['o'])*attackContributorsCounts['w'];
        temperatureChange = ((attackContributors[0] == 'r') - (attackContributors[0] == 'b') + attackContributorsCounts['o'])*attackContributorsCounts['w'];
        return [poisonChange, temperatureChange, attackContributors, attackContributorsCounts]
    }
    getHealthChange(attackingPlayerID, targetPlayerID, attackContributors, attackContributorsCounts) {
        let result = 0;
        if(attackContributors[0] == 'y') {
            result = 0
        } else {
            //If to opponent, add self temperature (if positive) and add (negative) opponent temperature (if negative)
            //Opponent negative temperature deductions can't reduce the damage to below 1.
            let attackingPlayerPositiveTemperature = Math.max(this.getPlayer(attackingPlayerID).getTemperature(), 0);
            let targetPlayerNegativeTemperature = Math.min(this.getPlayer(targetPlayerID).getTemperature(), 0);
            result = max(1, (((this.turnPlayerID==targetPlayerID)*2 - 1)*2*(attackContributors[0] == 'y') + attackContributorsCounts['o'])*attackContributorsCounts['w'] + attackingPlayerPositiveTemperature + targetPlayerNegativeTemperature);
        };
        return result
    }
    Attack(targetPlayerID, x, y) {
        let healthChange = 0;
        let SC_AC_Array = this.getStatusChangesandAttackContributors(targetPlayerID, x, y);
        let poisonChange = SC_AC_Array[0];
        let temperatureChange = SC_AC_Array[1];
        let attackContributors = SC_AC_Array[2];
        let attackContributorsCounts = SC_AC_Array[3];
        this.getPlayer(targetPlayerID).setPoison(this.getPlayer(targetPlayerID).getPoison + poisonChange);
        this.getPlayer(targetPlayerID).setTemperature(this.getPlayer(targetPlayerID).getTemperature() + temperatureChange);
        this.getPlayer(targetPlayerID).setHealth(this.getPlayer(targetPlayerID).getHealth + this.getHealthChange(this.turnPlayerID, targetPlayerID, attackContributors, attackContributorsCounts));
        return({attackingPlayer: this.turnPlayerID, targetPlayer: targetPlayerID, healthChange: healthChange, poisonChange: poisonChange, temperatureChange: temperatureChange})
    }
    //Next: add turn functionality (choosing type of attack etc)
}