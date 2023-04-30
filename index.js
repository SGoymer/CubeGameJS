//yo
const prompt=require("prompt-sync")({sigint:true}); 
function countStrings(arr) {
    let counts = {'w': 0, 'o': 0, 'b': 0, 'r': 0, 'g': 0, 'y': 0};

    for (const num of arr) {
    counts[num] = counts[num] ? counts[num] + 1 : 1;
    }

    return counts;
}
/*
function arrayEquals(a, b) {
    return Array.isArray(a) &&
        Array.isArray(b) &&
        a.length === b.length &&
        a.every((val, index) => val === b[index]);
}
*/
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
    getLayoutxy(x, y) {
        return this.layout[y][x]
    }
    printLayout() {
        console.log(
            " x 0 1 2\n" +
            "y\n" +
            "0  " + this.getLayoutxy(0, 0) + " " + this.getLayoutxy(1, 0) + " " + this.getLayoutxy(2, 0) + "\n" +
            "1  " + this.getLayoutxy(0, 1) + " " + this.getLayoutxy(1, 1) + " " + this.getLayoutxy(2, 1) + "\n" +
            "2  " + this.getLayoutxy(0, 2) + " " + this.getLayoutxy(1, 2) + " " + this.getLayoutxy(2, 2)
        )
    }
    setLayout(newLayout) {
        this.layout = newLayout
    }
    countCubeStrings() {
        return countStrings(this.getLayout().flat())
    }
    getSquareType(x, y) {
        let xyString = x.toString() + y.toString();
        switch(xyString) {
            case "00":
                result = 'diagonal'
                break;
            case "10":
                result = 'edge'
                break;
            case "20":
                result = 'diagonal'
                break;
            case "01":
                result = 'edge'
                break;
            case "11":
                result = 'centre'
                break;
            case "21":
                result = 'edge'
                break;
            case "02":
                result = 'diagonal'
                break;
            case "12":
                result = 'edge'
                break;
            case "22":
                result = 'diagonal'
        };
        return result
    }
    getAdjacents(x, y) {
        let xyString = x.toString() + y.toString();
        let adjacentsCoords = [];
        let adjacents = [];
        switch(xyString) {
            case "00":
                adjacentsCoords = [[1, 0], [0, 1]]
                break;
            case "10":
                adjacentsCoords = [[0, 0], [2, 0], [1, 1]]
                break;
            case "20":
                adjacentsCoords = [[1, 0], [2, 1]]
                break;
            case "01":
                adjacentsCoords = [[0, 0], [1, 1], [0, 2]]
                break;
            case "11":
                adjacentsCoords = [[1, 0], [0, 1], [2, 1], [1, 2]]
                break;
            case "21":
                adjacentsCoords = [[2, 0], [1, 1], [2, 2]]
                break;
            case "02":
                adjacentsCoords = [[0, 1], [1, 2]]
                break;
            case "12":
                adjacentsCoords = [[1, 1], [0, 2], [2, 2]]
                break;
            case "22":
                adjacentsCoords = [[2, 1], [1, 2]]
        };
        console.log("adjC: " + adjacentsCoords);
        for(let i = 0; i < adjacentsCoords.length; i++) {
            console.log(this.getLayoutxy(adjacentsCoords[i][0], adjacentsCoords[i][1]));
            adjacents.push(this.getLayoutxy(adjacentsCoords[i][0], adjacentsCoords[i][1]))
        }
        return adjacents
    }
    getAttackContributors(x, y) {
        return [this.getLayoutxy(x, y), this.getAdjacents(x, y)]
    }
}

class Player {
    constructor(playerID, health=100, poison=0, temperature=0) {
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
    constructor(
        p1Cube= [['w', 'w', 'w'],
                 ['w', 'w', 'w'],
                 ['w', 'w', 'w']],

        p2Cube= [['w', 'w', 'w'],
                 ['w', 'w', 'w'],
                 ['w', 'w', 'w']],

        gameNo=0, turnNumber=0, turnPlayerID=1, allowedSquareType=null, isActive=true, result=null
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
    checkGameOver() {
        return this.Player1.getHealth() < 0 || this.Player2.getHealth < 0
    }
    gameOver() {
        this.isActive = false;
        this.result = this.getTurnPlayerID()
    }
    getTurnNumber() {
        return this.turnNumber
    }
    nextTurn() {
        this.turnNumber = this.turnNumber + 1
    }
    getTurnPlayerID() {
        return this.turnPlayerID
    }
    getNotTurnPlayerID() {
        return -1*this.turnPlayerID + 3
    }
    setTurnPlayerID(turnPlayerID) {
        this.turnPlayerID = turnPlayerID
    }
    advanceTurnPlayer() {
        if(this.getTurnPlayerID() == 1) {
            this.setTurnPlayerID(2)
        } else {
            this.setTurnPlayerID(1)
        }
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
    getNotTurnPlayer() {
        if(this.turnPlayerID == 1) {
            return this.Player2
        } else {
            return this.Player1
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
        let attackContributorsCounts = countStrings(attackContributors[1]);
        let targetPlayerNegativeTemperature = Math.min(this.getPlayer(targetPlayerID).getTemperature(), 0);
        //+1 poison per hit if targeting opponent, -2 poison per hit if healing self.
        //+1 extra poision per hit per negative temperature if targeting opponent with a negative temperature
        poisonChange = (
            ((this.turnPlayerID!=targetPlayerID)*3 - 2) //1 if targeting opponent, -2 if targeting self
            - targetPlayerNegativeTemperature //+1 extra poision per hit per negative temperature if targeting opponent with a negative temperature
            + attackContributorsCounts['o']
        )
        *
        (attackContributors[0] == 'g')
        *
        (1+attackContributorsCounts['w']);

        temperatureChange = (
            (attackContributors[0] =='r')*(1 + attackContributorsCounts['o'])*(1+attackContributorsCounts['w'])
            +
            (attackContributors[0] =='b')*(-1 - attackContributorsCounts['o'])*(1+attackContributorsCounts['w'])
        )
        console.log("[pC, tC, aC, ACC]");
        console.log([poisonChange, temperatureChange, attackContributors, attackContributorsCounts]);
        return [poisonChange, temperatureChange, attackContributors, attackContributorsCounts]
    }
    getHealthChange(attackingPlayerID, targetPlayerID, attackContributors, attackContributorsCounts) {
        let result = 0;
        if(attackContributors[0] == 'y') {
            //If to opponent, add self temperature (if positive) and add (negative) opponent temperature (if negative)
            //Opponent negative temperature deductions can't reduce the damage to below 1.
            let attackingPlayerPositiveTemperature = Math.max(this.getPlayer(attackingPlayerID).getTemperature(), 0);
            let targetPlayerNegativeTemperature = Math.min(this.getPlayer(targetPlayerID).getTemperature(), 0);
            result = (
                (
                    ((this.turnPlayerID==targetPlayerID)*2 - 1)
                    *
                    (2 + attackContributorsCounts['o'])
                ) + attackingPlayerPositiveTemperature + targetPlayerNegativeTemperature
            )
            *(attackContributors[0] == 'y')
            *(1+attackContributorsCounts['w']);

            if(this.turnPlayerID!=targetPlayerID) {
                result = Math.min(-1, result)
            }
        } else {
            result = 0
        };
        return result
    }
    checkLegalAttack(allowedSquareType, x, y) {
        let result = null;
        switch(allowedSquareType) {
            case "diagonal":
                result = (x == 0 || x == 2) && (y == 0 || y == 2)
                break;
            case "edge":
                result = Math.abs(x - y) == 1;
                break;
            case "centre":
                result = x == 1 && y == 1
                break;
        };
        return result
    }
    attack(targetPlayerID, x, y, carryOutAttack = true) {
        let SC_AC_Array = this.getStatusChangesandAttackContributors(targetPlayerID, x, y);
        let poisonChange = SC_AC_Array[0];
        let temperatureChange = SC_AC_Array[1];
        let attackContributors = SC_AC_Array[2];
        let attackContributorsCounts = SC_AC_Array[3];
        let healthChange = this.getHealthChange(this.turnPlayerID, targetPlayerID, attackContributors, attackContributorsCounts)
        if(carryOutAttack) {
            this.getPlayer(targetPlayerID).setPoison(this.getPlayer(targetPlayerID).getPoison() + poisonChange);
            this.getPlayer(targetPlayerID).setTemperature(this.getPlayer(targetPlayerID).getTemperature() + temperatureChange);
            this.getPlayer(targetPlayerID).setHealth(this.getPlayer(targetPlayerID).getHealth() + healthChange);
        }
        console.log({attackingPlayer: this.turnPlayerID, targetPlayer: targetPlayerID, healthChange: healthChange, poisonChange: poisonChange, temperatureChange: temperatureChange})
        return({attackingPlayer: this.turnPlayerID, targetPlayer: targetPlayerID, healthChange: healthChange, poisonChange: poisonChange, temperatureChange: temperatureChange})
    }
    doPoisonDamage() {
        for (let playerID = 1; playerID < 3; playerID++) {
            this.getPlayer(this.playerID).setHealth(this.getPlayer(playerID).getHealth() - this.getPlayer(playerID).getPoison())
        }
    }
    doHotDamage() {
        for (let playerID = 1; playerID < 3; playerID++) {
            this.getPlayer(this.playerID).setHealth(this.getPlayer(playerID).getHealth() - Math.max(this.getPlayer(playerID).getTemperature(), 0))
        }
    }

    //Next: add turn functionality (choosing type of attack etc)
    promptSquareType(useJquery=true) {
        let selectedSquareType = null;
        /*
        if(useJquery) {
            $('#dialog').dialog({
                title: "Prompt",
                buttons: {
                    "Diagonal": function() {
                    selectedSquareType = 'd';
                    },
                    "Edge": function() {
                    selectedSquareType = 'e';
                    },
                    "Centre": function() {
                    selectedSquareType = 'c';
                    }
                    // ..............
                }
            });
        } else {
        */
            selectedSquareType = prompt("Select which attack types are available this round: d for diagonal, e for edge, c for centre.")
            if(!["d", "e", "c"].includes(selectedSquareType)) {
                while(!["d", "e", "c"].includes(selectedSquareType)) {
                    selectedSquareType = prompt("Please enter your attack type in the format 'd', 'e', or 'c'.")
                }
            }
        //}
        ;
        console.log(selectedSquareType)
        if(selectedSquareType == "d") {
            selectedSquareType = "diagonal"
        };
        if(selectedSquareType == "e") {
            selectedSquareType = "edge"
        };
        if(selectedSquareType == "c") {
            selectedSquareType = "centre"
        };
        //console.log(selectedSquareType)
        return selectedSquareType
    }
    promptAttackxy(useJquery=true) {
        let selectedAttackxy = null;
        /*
        if(useJquery) {
            //below is broken, probably needs reworking anyway
            $('#dialog').dialog({
                title: "Prompt",
                buttons: {
                    "Diagonal": function() {
                    selectedAttackxy = 'd';
                    },
                    "Edge": function() {
                    selectedAttackxy = 'e';
                    },
                    "Centre": function() {
                    selectedAttackxy = 'c';
                    }
                    // ..............
                }
            });
        } else {
            */
            this.getTurnPlayerCube().printLayout();
            selectedAttackxy = prompt("Select which square to attack from using the format 'xy'. You can use a " + this.allowedSquareType + " attack this turn.");

            if(!this.checkLegalAttack(this.allowedSquareType, Number(selectedAttackxy[0]), Number(selectedAttackxy[1]))) {
                while(!this.checkLegalAttack(this.allowedSquareType, Number(selectedAttackxy[0]), Number(selectedAttackxy[1]))) {
                    selectedAttackxy = prompt("Please enter your square to attack from in the format 'xy'. Both values must be between 0 and 2. You can use a " + this.allowedSquareType + " attack this turn.")
                }
            }
        //}
        ;
        return [Number(selectedAttackxy[0]), Number(selectedAttackxy[1])]
    }
    promptAttackTarget(useJquery=true) {
        let attackTarget = null;
        /*
        if(useJquery) {
            $('#dialog').dialog({
                title: "Prompt",
                buttons: {
                    "Self": function() {
                    attackTarget = 's';
                    },
                    "Opponent": function() {
                    attackTarget = 'o';
                    }
                    // ..............
                }
            });
        } else {
        */
            attackTarget = prompt("Select whether to target self or opponent: s for self, o for opponent.")
            if(!["s", "o"].includes(attackTarget)) {
                while(!["s", "o"].includes(attackTarget)) {
                    attackTarget = prompt("Please enter your attack type in the format 's' or 'o.")
                }
            }
        //}
        ;
        if(attackTarget == "s") {
            attackTarget = "self"
        };
        if(attackTarget == "o") {
            attackTarget = "opponent"
        };
        //console.log(attackTarget);
        return attackTarget
    }
    executeTurn(useJquery = true, verbose = false) {
        //Go to the next turn
        this.nextTurn();
        if(verbose) {
            console.log("Advancing to Turn " + this.turnNumber)
        };

        //Advance the active player
        this.advanceTurnPlayer();

        if(verbose) {
            console.log("Player " + this.turnPlayerID + ":")
        };

        //Ask the active player what attack type is allowed this turn
        this.allowedSquareType = this.promptSquareType(useJquery);

        //Ask the next player what attack they will do this turn. They will attack first.
        this.advanceTurnPlayer();

        if(verbose) {
            console.log("Player " + this.turnPlayerID + ":")
        };

        let firstAttackxy = this.promptAttackxy(useJquery);
        let firstAttackTarget = this.promptAttackTarget(useJquery);
        let firstAttackTargetID = null;
        if(firstAttackTarget == "self") {
            firstAttackTargetID = this.turnPlayerID
        } else {
            firstAttackTargetID = this.getNotTurnPlayerID()
        };
        
        //Ask the other player what attack they will do this turn. They will attack second.
        this.advanceTurnPlayer();

        if(verbose) {
            console.log("Player " + this.turnPlayerID + ":")
        };

        let secondAttackxy = this.promptAttackxy(useJquery);
        let secondAttackTarget = this.promptAttackTarget(useJquery);
        let secondAttackTargetID = null;
        if(secondAttackTarget == "self") {
            secondAttackTargetID = this.turnPlayerID
        } else {
            secondAttackTargetID = this.getNotTurnPlayerID()
        };

        //Execute the attacks
        this.advanceTurnPlayer();
        if(verbose) {
            console.log("Commence attacks!");
            if(firstAttackTarget == "self") {
                console.log("Player " + this.turnPlayerID)
            } else {
                console.log("Player " + this.turnPlayerID + " attacks Player " + this.getNotTurnPlayerID() + "!")
            }
        };

        let firstAttackResult = this.attack(firstAttackTargetID, firstAttackxy[0], firstAttackxy[1], true);

        if(verbose) {
            if(firstAttackTarget == "self") {
                console.log("Healed for " + firstAttackResult["healthChange"] + ". Now at " + this.getTurnPlayer().getHealth() + " health.");
                console.log("Healed " + firstAttackResult["poisonChange"] + " poison. Now at " + this.getTurnPlayer().getPoison() + " poison.");
                console.log("Changed temperature by " + firstAttackResult["temperatureChange"] + " poison. Now at " + this.getTurnPlayer().getTemperature() + " temperature.");               
            } else {
                console.log("Dealt " + firstAttackResult["healthChange"] + " damage. Opponent now at " + this.getNotTurnPlayer().getHealth() + " health.");
                console.log("Inflicted " + firstAttackResult["poisonChange"] + " poison. Opponent now at " + this.getNotTurnPlayer().getPoison() + " poison.");
                console.log("Changed opponent temperature by " + firstAttackResult["temperatureChange"] + ". Opponent now at " + this.getNotTurnPlayer().getTemperature() + " temperature.");  
            }
        }

        //Check if the attacking player just KO'd the opponent. If so, end the game
        if(this.checkGameOver()) {
            this.gameOver()
            if(verbose) {
                console.log("That's a KO! Player " + this.result + " wins!")
            }
        };

        if(this.isActive) {

            this.advanceTurnPlayer();
            if(verbose) {
                if(firstAttackTarget == "self") {
                    console.log("Player " + this.turnPlayerID)
                } else {
                    console.log("Player " + this.turnPlayerID + " attacks Player " + this.getNotTurnPlayerID() + "!")
                }
            };

            let secondAttackResult = this.attack(secondAttackTargetID, secondAttackxy[0], secondAttackxy[1], true);
            if(verbose) {
                if(secondAttackTarget == "self") {
                    console.log("Healed for " + secondAttackResult["healthChange"] + ". Now at " + this.getTurnPlayer().getHealth() + " health.");
                    console.log("Healed " + secondAttackResult["poisonChange"] + " poison. Now at " + this.getTurnPlayer().getPoison() + " poison.");
                    console.log("Changed temperature by " + secondAttackResult["temperatureChange"] + " poison. Now at " + this.getTurnPlayer().getTemperature() + " temperature.");               
                } else {
                    console.log("Dealt " + secondAttackResult["healthChange"] + " damage. Opponent now at " + this.getNotTurnPlayer().getHealth() + " health.");
                    console.log("Inflicted " + secondAttackResult["poisonChange"] + " poison. Opponent now at " + this.getNotTurnPlayer().getPoison() + " poison.");
                    console.log("Changed opponent temperature by " + secondAttackResult["temperatureChange"] + ". Opponent now at " + this.getNotTurnPlayer().getTemperature() + " temperature.");  
                }
            }

            //Check if the attacking player just KO'd the opponent. If so, end the game
            if(this.checkGameOver()) {
                this.gameOver()
                if(verbose) {
                    console.log("That's a KO! Player " + this.result + " wins!")
                }
            };
        }
    }
    playGame(useJquery=true, verbose=false) {
        if(verbose) {
            console.log("A new game begins!");
            console.log("Player 1 Cube:");
            this.getPlayerCube(1).printLayout();
            console.log("Player 2 Cube:");
            this.getPlayerCube(2).printLayout();
        }
        while(this.isActive) {
            this.executeTurn(useJquery=useJquery, verbose=verbose)
        }
    }
}

let firstGame = new Game(
    p1Cube = [['y', 'w', 'y'],
              ['o', 'y', 'o'],
              ['y', 'w', 'y']]
    ,
    p2Cube = [['y', 'y', 'y'],
              ['y', 'y', 'y'],
              ['y', 'y', 'y']]
    );
firstGame.playGame(useJquery = false, verbose=true);
//Next: QA damage on edges/diagonals, posion, temp change