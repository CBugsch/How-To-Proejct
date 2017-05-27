/**
 * Created by Christopher on 5/11/2017.
 */

var deckID = "btshybyjei25";
var pDeck = {
    'name': "pDeck",
    'value':0,
    'cardValues': [],
    'win':0,
    'stay':false

}
var dDeck = {
    'name': "dDeck",
    'value':0,
    'cardValues': [],
    'win':0

}
var dCard1 = {
    'image':null,
    'value':null
}


var round = 0;



function reshuffle(){
    var req = new XMLHttpRequest();
    req.open('GET', "https://deckofcardsapi.com/api/deck/" + deckID + "/shuffle/", true);
    req.addEventListener('load', function () {
        if (req.status >= 200 && req.status < 400) {
            console.log("Deck reshuffled")
        }
        else {
            console.log("Error in network request: " + req.statusText);
        }
    });
    req.send(null);
    event.preventDefault();
}

document.getElementById('newHand').addEventListener('click', newHand );
document.getElementById('hit').addEventListener('click', hit );
document.getElementById('stay').addEventListener('click', stay );


function addCard(obj, who){


    if(obj.length > 3){
        who.value += 10;
    }
    else if(obj == "ACE"){

        if(who.value >= 11){
            who.value += 1;
        }
        else{
            who.value +=11;
            who.cardValues.push('ACE');
        }
    }
    else{
        who.value += parseInt(obj);
    }
    if(contains(who.cardValues,'ACE')){
        if(who.value > 21){
            who.cardValues.pop();
            who.value -=10;}
    }
    console.log(who.value);
    document.getElementById(who.name).textContent = who.value;
    setTimeout(hitValue,100);

}
function hitValue(){
    if(pDeck.value > 21){
        alert("BUST!")
        addScore(dDeck);

        setTimeout(newHand(), 100);
    }
    else if (pDeck.value == 21){
        alert("Blackjack! You Win!")
        addScore(pDeck);
        setTimeout(newHand(), 100);
    }
}
function contains(arr, findValue){
    var i=arr.length;
    while(i--){
        if(arr[i] === findValue)return true;
    }return false;
}

function newHand(){
    console.log(document.getElementById('playerHand').childElementCount);
    while(document.getElementById('playerHand').childElementCount >5){
        var deck = document.getElementById('playerHand');
        deck.removeChild(deck.lastElementChild);
    }
    while(document.getElementById('dealerHand').childElementCount >5){
        var deck = document.getElementById('dealerHand');
        deck.removeChild(deck.lastElementChild);
    }

    pDeck.value = 0;
    dDeck.value = 0;
    playerStay = false;
    pDeck.cardValues = [];
    dDeck.cardValues = [];
    document.getElementById("pDeck").textContent = pDeck.value;
    document.getElementById("dDeck").textContent = dDeck.value;

    var req = new XMLHttpRequest();
    req.open('GET', "https://deckofcardsapi.com/api/deck/" + deckID + "/draw/?count=4", true);


    req.addEventListener('load', function () {
        if (req.status >= 200 && req.status < 400) {
            var response = JSON.parse(req.responseText);
            console.log(response);
            if(response.success){
                document.getElementById('pCard1').setAttribute("src", response.cards[0].image);
                dCard1.image = response.cards[1].image;
                dCard1.value = response.cards[1].value;
                document.getElementById('dCard1').setAttribute("src", "http://res.freestockphotos.biz/pictures/15/15541-illustration-of-a-card-deck-back-pv.png");
                document.getElementById('pCard2').setAttribute("src", response.cards[2].image);
                document.getElementById('dCard2').setAttribute("src", response.cards[3].image);

                setTimeout(function () {


                    addCard(response.cards[0].value, pDeck);
                    addCard(response.cards[2].value, pDeck);
                    addCard(response.cards[3].value, dDeck);

                }, 100);

            }else{reshuffle();
                newHand();}}
    });
    pDeck.cardNum = 2;
    req.send(null);
    event.preventDefault();
}

function hit(){
    var req = new XMLHttpRequest();
    req.open('GET', "https://deckofcardsapi.com/api/deck/" + deckID + "/draw/?count=1", true);


    req.addEventListener('load', function () {
        if (req.status >= 200 && req.status < 400) {
            var response = JSON.parse(req.responseText);
            if(response.success){
                var newCard = document.createElement("img")
                newCard.setAttribute("src", response.cards[0].image);
                newCard.setAttribute("style", "width:104px; height:142px;");
                document.getElementById('playerHand').appendChild(newCard);


                setTimeout(addCard(response.cards[0].value, pDeck), 100);

            }else{reshuffle();
                hit();}}
    });

    req.send(null);
    event.preventDefault();


}

function stay() {
    pDeck.stay = true;
    document.getElementById('dCard1').setAttribute("src", dCard1.image);
    addCard(dCard1.value, dDeck);
    if(dDeck.value <16){
        dealerHit();}
    else{
        setTimeout(checkWin, 100);
    }

}


function dealerHit(){
    var req = new XMLHttpRequest();
    req.open('GET', "https://deckofcardsapi.com/api/deck/" + deckID + "/draw/?count=1", true);


    req.addEventListener('load', function () {
        if (req.status >= 200 && req.status < 400) {
            var response = JSON.parse(req.responseText);
            if(response.success){
                console.log(response);
                var newCard = document.createElement("img")
                newCard.setAttribute("src", response.cards[0].image);
                newCard.setAttribute("style", "width:104px; height:142px;");
                document.getElementById('dealerHand').appendChild(newCard);


                setTimeout(function () {
                    addCard(response.cards[0].value, dDeck);

                }, 100);

                setTimeout(checkDealer, 200);
            }else{reshuffle();
                dealerHit();}}
    });

    req.send(null);
    event.preventDefault();
}
function checkDealer(){
    if(dDeck.value <16){
        dealerHit();
    }
    else if(dDeck.value > 21){
        alert("Dealer Bust! You Win!");
        addScore(pDeck);
        newHand();
    }
    else checkWin();
}
function checkWin(){

    if(pDeck.stay){
        if(pDeck.value > dDeck.value){
            alert("You Win!");
            addScore(pDeck);
            setTimeout( newHand(), 100);

        }
        else{
            alert("You Lose!");
            addScore(dDeck);
            setTimeout(newHand(),100);
        }
    }

}

function addScore(who){
    who.win++;
    round++;
    document.getElementById('pWins').textContent = pDeck.win;
    document.getElementById('dWins').textContent = dDeck.win;
    document.getElementById('rounds').textContent = round;
}