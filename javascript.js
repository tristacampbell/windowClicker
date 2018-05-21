//CONST
var SCORE_SIZE_MIN = 60;
var SCORE_SIZE_RATE = 3;
var SCORE_TIMER = 500;

//Output
function writeToElementHTML(element, text) {
    document.getElementById(element).innerHTML = text;
}

//Time
var timerRateScore = 1000;
var timerRateVisuals = 50;

function startTimers() {
    runTimerVisuals();
    runTimerScore();
}

function runTimerScore() {
    //addToScore(calculateScores());
    setTimeout(runTimerScore, timerRateScore);
}

function runTimerVisuals() {
    updateVisuals();
    setTimeout(runTimerVisuals, timerRateVisuals);
}

//Score
var totalScore = 0;

function addToScore(points, item) {
    totalScore = totalScore+points;
    var elem = document.getElementById('totalScore');
    var style = window.getComputedStyle(elem, null).getPropertyValue("font-size");
    var fontSize = parseFloat(style);
    if (fontSize < itemInfo[item].fontIncrease) {
        document.getElementById('totalScore').style.fontSize = itemInfo[item].fontIncrease+'px';
    }
    updateButtons();
}

function calculateScores() {
    var calcScore = 1;
    for(var i = 0; i < itemInfo.length; i++) {
        calcScore += addItemValues(itemInfo[i].items);
    }
    return calcScore;
}

function addItemValues(list) {
    var itemCalcScore = 0;
    for(var i = 0; i < list.length; i++) {
        itemCalcScore = itemCalcScore + list[i].value;
    }
    return itemCalcScore;
}

//Items
var itemInfo = [];

function addItem(item) {
    if ((document.getElementById(itemInfo[item].fieldName).disabled) || (itemInfo[item].cost > totalScore)) {
        return;
    }
    itemInfo[item].items.push({value:itemInfo[item].value});
    addToScore(-itemInfo[item].cost, item);
    itemInfo[item].cost = Math.round(itemInfo[item].cost * 1.2);
    updateButtonText(item);
}

function addNewItemOption(item) {
    var newChoice = document.createElement("li");
    var list = document.getElementById('itemList');
    newChoice.appendChild(document.createTextNode(itemInfo[item].name));
    newChoice.setAttribute("id", itemInfo[item].fieldName);
    newChoice.setAttribute("onClick", 'addItem(' + item + ');');
    list.appendChild(newChoice);
    updateButtonText(item);
}

function runItem(item) {
    if (itemInfo[item].items.length > 0) {
        console.log(itemInfo[item].items.length);
        addToScore(itemInfo[item].value, item);
        setTimeout(runItem.bind(null, item), SCORE_TIMER/itemInfo[item].items.length);
    }else{
        setTimeout(runItem.bind(null, item), SCORE_TIMER);
    }
}

//Visuals
function updateVisuals() {
    writeToElementHTML('totalScore', totalScore);
    smoothTextResize('totalScore', SCORE_SIZE_MIN, SCORE_SIZE_RATE);
}

function smoothTextResize(element, toSize, rate) {
    var elem = document.getElementById(element);
    var style = window.getComputedStyle(elem, null).getPropertyValue("font-size");
    var fontSize = parseFloat(style);
    
    if (fontSize > toSize) {
        if ((fontSize-rate) < toSize) {
            elem.style.fontSize = toSize;
        }else{
            elem.style.fontSize = (fontSize - rate) + 'px';
        }
    }
    if (fontSize < toSize) {
        if ((fontSize+rate) > toSize) {
            elem.style.fontSize = toSize;
        }else{
            elem.style.fontSize = (fontSize + rate) + 'px';
        }
    }
}

function updateButtonText(item) {
    writeToElementHTML(itemInfo[item].fieldName, '$' + itemInfo[item].cost + ' - ' + itemInfo[item].name);
}

function updateButtons() {
    for(var i = 0; i < itemInfo.length; i++) {
        if ((totalScore > itemInfo[i].cost) && (!itemInfo[i].activated)) {
            itemInfo[i].activated = true;
            addNewItemOption(i);
        }
    }
}

//Utility
function addToList(listID, item) {
    var list = document.getElementById(listID);
    list.appendChild(item);
}

//Game
function init() {
    startTimers();
    itemInfo.push({name:'Mission Statement', cost:50, value:1, fieldName:'item1', items:[], activated:true, fontIncrease:90});
    itemInfo.push({name:'Optimised Stratagies', cost:100, value:5, fieldName:'item2', items:[], activated:false, fontIncrease:100});
    itemInfo.push({name:'Brand Trajectories', cost:250, value:10, fieldName:'item3', items:[], activated:false, fontIncrease:120});
    itemInfo.push({name:'Automation of Assets', cost:500, value:50, fieldName:'item4', items:[], activated:false, fontIncrease:150});
    itemInfo.push({name:'Business Infrastructure', cost:1000, value:10000, fieldName:'item5', items:[], activated:false, fontIncrease:210});
    itemInfo.push({name:'Synchronisation', cost:1000000, value:100000, fieldName:'item6', items:[], activated:false, fontIncrease:260});
    itemInfo.push({name:'Corporate Interests', cost:10000000, value:1000000, fieldName:'item7', items:[], activated:false, fontIncrease:320});
    itemInfo.push({name:'Investment', cost:100000000, value:10000000, fieldName:'item8', items:[], activated:false, fontIncrease:400});
    itemInfo.push({name:'Selling Out', cost:1000000000, value:100000000, fieldName:'item9', items:[], activated:false, fontIncrease:500});
    addNewItemOption(0);
    for(var i = 0; i < itemInfo.length; i++) {
        runItem(i);
    }
}