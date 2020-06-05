//Declaration of Classes
class Domino {
    constructor(_tailValue, _headValue, _isPlayed) {

        this.tailValue = _tailValue;
        this.headValue = _headValue;
        this.isPlayed = _isPlayed;
    }
}

class Player {
    constructor(_playerName, _playerDominos) {
        this.playerName = _playerName;
        this.playerDominos = _playerDominos; 
    }
}

//This function is used to create all domino instances, then assign them to an array
function createDominos(dominos) {
    // varibles i, j are used to create the permutaion needed for domino objects to be dynamically created
    let j = 0;
    let i = 0;
    // varible k is used to create a single array with 28 objects
    let k = 0;

    while (i < 7)
    {
        while (j <= i)
        {
            dominos[k] = new Domino(i,j,0,0,false);
            j++;
            k++;
        }
        i++;
        j = 0;
    }
    return dominos;
}

// This is an implementation of Fisher-Yates suffle 
// https://en.wikipedia.org/wiki/Fisher%E2%80%93Yates_shuffle

function shuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {
        let j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
      }
}

// this function will be used to initialise the enviroment
function initialise(player1Name, player2Name, dominoArray) {

    if(dominoArray.length != 28)
    {
       throw new Error("~~~~~~~~~ Incorrect amount of dominos to play the game ~~~~~~~~~~~~");    
    }

    let player1Dominos = dominoArray.slice(0,7);
    let player2Dominos = dominoArray.slice(7,14);
    let dominoPool = dominoArray.slice(14,28); 
    let player1 = new Player(player1Name,player1Dominos);
    let player2 = new Player(player2Name, player2Dominos);

    return {p1 : player1, p2 : player2, pool : dominoPool};

}

function cout(text) {
    document.getElementById("output").value = text;
}

// This contains all the game logic
function gameLoop(gameObject) {

    let dominosActiveArray = [0];
    let arrayHeadValue = 0;
    let arrayTailValue = 0;
    let winCondition = false;
    let staleMateValue = 0;
    let text = "";
    let activeArrayText = "";

    // These varibles are used to keep track of the tile values at either end of the array
    arrayHeadValue = gameObject.pool[0].headValue;
    arrayTailValue = gameObject.pool[0].tailValue;

    activeArrayText += " <" + arrayHeadValue + ":" + arrayTailValue + "> ";

    //First move
    //removes first element from domino pool, then assigns it to the 1st element of the active pieces array(dominos on the board)
    gameObject.pool[0].isPlayed = true; 
    dominosActiveArray[0] = gameObject.pool.shift();

    cout(text);

    let p1 = gameObject.p1;
    let p2 = gameObject.p2;
    let currentPLayer = gameObject.p1;
    //change the first domino played top this value
    let playableDomino;
    let foundPlayableDomino = false;
    let playerDominosIndex = 0;
    let isHeadValueMatch = false;

    console.log("~~~~~~~~~~~~~game loop has started~~~~~~~~~~~~~~");
    
    while (!(winCondition)) 
    {
        // check if domino pool is empty
        // if so then change players
        if(gameObject.pool.length == 0 )
        {
            if(currentPLayer.playerName != p1.playerName)
            {
                currentPLayer = p1;
                staleMateValue++;
                text += "Player " + currentPLayer.playerName + " has another chance, because  " + p2.playerName + " has run out of moves \n";
                cout(text);
            }else {
                currentPLayer = p2;
                staleMateValue++;
                text += "Player " + currentPLayer.playerName + " has another chance, because  " + p1.playerName + " has run out of moves \n";
                cout(text);
            }
        }

        //If we find a matching tile at the head it is played there
        //check for all edge cases
        if(currentPLayer.playerDominos.some(item => item.headValue == arrayHeadValue))
        {
             playerDominosIndex = currentPLayer.playerDominos.findIndex(item => item.headValue == arrayHeadValue);
             playableDomino = currentPLayer.playerDominos.find(item => item.headValue == arrayHeadValue);
             // //add domino to head and set head value
             dominosActiveArray.unshift(playableDomino);
             currentPLayer.playerDominos.splice(playerDominosIndex,1);
             arrayHeadValue = dominosActiveArray[0].tailValue;
             activeArrayText = (" <" + dominosActiveArray[0].headValue + ":" + dominosActiveArray[0].tailValue + "> ").concat(activeArrayText);
             foundPlayableDomino = true;
             isHeadValueMatch = true;
        }
        if(currentPLayer.playerDominos.some(item => item.tailValue == arrayHeadValue) && (foundPlayableDomino == false))
        {
             playerDominosIndex = currentPLayer.playerDominos.findIndex(item => item.tailValue == arrayHeadValue);
             playableDomino = currentPLayer.playerDominos.find(item => item.tailValue == arrayHeadValue);
            // //add domino to head and set tail head
             dominosActiveArray.unshift(playableDomino);
             currentPLayer.playerDominos.splice(playerDominosIndex,1);
             arrayHeadValue = dominosActiveArray[0].headValue;
             activeArrayText = (" <" + dominosActiveArray[0].headValue + ":" + dominosActiveArray[0].tailValue + "> ").concat(activeArrayText);
             foundPlayableDomino =true;
             isHeadValueMatch = true;
        }
        //Now we check the tail values
        if(currentPLayer.playerDominos.some(item => item.headValue == arrayTailValue) && (foundPlayableDomino == false))
        {
             playerDominosIndex = currentPLayer.playerDominos.findIndex(item => item.headValue == arrayTailValue);
             playableDomino = currentPLayer.playerDominos.find(item => item.headValue == arrayTailValue);
            ////add domino to tail and set tail value 
            dominosActiveArray.push(playableDomino);
            currentPLayer.playerDominos.splice(playerDominosIndex,1);
            arrayTailValue = dominosActiveArray[dominosActiveArray.length - 1].tailValue;
            activeArrayText = (" <" + dominosActiveArray[dominosActiveArray.length - 1].headValue + ":" + dominosActiveArray[dominosActiveArray.length - 1].tailValue + "> ").concat(activeArrayText);
            foundPlayableDomino =true;
        }
        if(currentPLayer.playerDominos.some(item => item.tailValue == arrayTailValue) && (foundPlayableDomino == false))
        {
             playerDominosIndex = currentPLayer.playerDominos.findIndex(item => item.tailValue == arrayTailValue);
             playableDomino = currentPLayer.playerDominos.find(item => item.tailValue == arrayTailValue);
             //add domino to tail and set tail value
             dominosActiveArray.push(playableDomino);
             currentPLayer.playerDominos.splice(playerDominosIndex,1);
             arrayTailValue = dominosActiveArray[dominosActiveArray.length - 1].headValue;
             activeArrayText = (" <" + dominosActiveArray[dominosActiveArray.length - 1].headValue + ":" + dominosActiveArray[dominosActiveArray.length - 1].tailValue + "> ").concat(activeArrayText);
             foundPlayableDomino =true;

        }
      
        text += currentPLayer.playerName + " plays " + "<" + playableDomino.headValue + ":" +playableDomino.tailValue + ">" + " to connect to tile " + activeArrayText  + " on the board" + "\n";
        cout(text);
        text += "Board is now " + activeArrayText + "\n";
        cout(text);
        
        //condition used if player has an un-playable pieces
        if(foundPlayableDomino == false)
        {
            if (gameObject.pool.length == 0)
            {
                text += "Domino pool depleted \n";
                cout(text);
            } 
            if (gameObject.pool.length >= 1)
            {
                //remove a domino from the pool and adds it to the players domino stack
                currentPLayer.playerDominos.unshift(gameObject.pool.shift());
                text += currentPLayer.playerName + " can not play, drawing tile " + "<" + currentPLayer.playerDominos[0].headValue + ":" + currentPLayer.playerDominos[0].tailValue + "> \n";
                cout(text);

            }

        } else {

        playableDomino.isPlayed = true;
        //change player for next turn
        if(currentPLayer.playerName != p1.playerName)
        {
            currentPLayer = p1;
        }else {
            currentPLayer = p2;
        }

    }  
      // Set win condition
      if(currentPLayer.playerDominos.length == 0)
      {
          winCondition = true;
      }
      if((gameObject.pool.length == 0) && (staleMateValue > 5))
      {
          winCondition = true;
          text += "Players have reached a stale mate, no valid moves to be made \n";
          cout(text);
      }
        // reset varibles
        foundPlayableDomino = false;
        playerDominosIndex = 0;
        isHeadValueMatch = false;
    }
    if(!((gameObject.pool.length == 0) && (staleMateValue > 5)))
    {
    text += "Player " + p1.playerName + " has " + p1.playerDominos.length + " tiles" + "\n";
    text += "Player " + p2.playerName + " has " + p2.playerDominos.length + " tiles" + "\n";
    text += "Player " + currentPLayer.playerName + " has won!";
    cout(text);
    }
}


//All code is executed in this function
function main()
{
    p1Name = document.getElementById("p1name").value;
    p2Name = document.getElementById("p2name").value;
    
    if(p1Name === "" || p2Name === ""){
        alert("Invalid inputs");
        throw new Error("Invalid Inputs");
    }

    let dominoArray = [];
    let orderdDominoArray = createDominos(dominoArray);
    shuffle(orderdDominoArray);
    let gameObject =  initialise(p1Name, p2Name, orderdDominoArray);

    gameLoop(gameObject);

}
