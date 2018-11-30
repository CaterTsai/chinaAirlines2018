var _gPlaceId = 0;
var _gGameMenuSet = ["Charactor", "Deco", "Word"];
var _gGameMenuId = _gGameMenuSet[0];
var _gCharactorMenuSet = ["Head", "Clothes"];
var _gCharactorMenuId = _gCharactorMenuSet[0];
var _gCharactorGrander = null;
var _gGameObj = null;
var _gObjID = 0;

var _gShowZH = true; // true:zh false:en
var _gZhPath = "assets/img/zh";
var _gEnPath = "assets/img/en";

Number.prototype.pad = function(size) {
    var s = String(this);
    while (s.length < (size || 2)) {s = "0" + s;}
    return s;
}


//---------------------------
//Game Page
function showCharactor() {
    $("#charactorGranderDiv").show();
    $("#charactorItemDiv").hide();
}

function switchSubpage(before, after) {
    $("#game" + after + "Div").show();
    $("#game" + before + "Div").hide();

    if(after == _gGameMenuSet[1])
    {
        showCharactor();
    }
}

function switchCharactorSubpage(before, after) {
    if (_gCharactorGrander)
    {
        $("#charactor" + after + "MaleDiv").show();
        $("#charactor" + before + "MaleDiv").hide();
    }
    else
    {
        $("#charactor" + after + "FemaleDiv").show();
        $("#charactor" + before + "FemaleDiv").hide();
    }
}

//---------------------------
function setPlace() {
    _gGameObj.setPlace("place" + (_gPlaceId + 1).pad(2));
}

//---------------------------
//Button
function onBtnLanguageChange()
{
    if(_gShowZH)
    {
        $("#btnLanguageZH").hide();
        $("#btnLanguageEN").show();
    }
    else
    {
        $("#btnLanguageZH").show();
        $("#btnLanguageEN").hide();
    }
    _gShowZH = !_gShowZH;
    changeLanguage();
}

function onBtnEnter() {
    $("#startDiv").hide();
    $("#stageDiv").show();
}

function onPlaceSelect(placeId) {
    if(_gPlaceId != placeId)
    {
        $("#place" + (_gPlaceId).toString()).toggleClass("cover");
        $("#place" + (placeId).toString()).toggleClass("cover");

        _gPlaceId = placeId;
    }
}

function onBtnMake() {
    $("#stageDiv").hide();
    $("#gameDiv").show();

    var h = $("#gameContainer").height();
    var w = $("#gameContainer").width();
    _gGameObj.init("gameContainer", w, h);

    setPlace();
}

function onGameMenuBtn(obj) {
    var nextID = obj.getAttribute("data-itemID")
    if (nextID == _gGameMenuId) {
        if(nextID == "Charactor")
        {
            showCharactor();
        }
    }
    else {
        troggleBtn($("#btn" + _gGameMenuId).get(0));
        troggleBtn(obj);
        switchSubpage(_gGameMenuId, nextID);
        _gGameMenuId = nextID;
    }
}

function onGameMenuShare() {
    $("#gameSelectDiv").hide();
    $("#gameShareDiv").show();

    _gGameObj.disableAllCtrl();
}

function onCharactorMenuBtn(obj) {
    var nextID = obj.getAttribute("data-itemID")
    if (nextID == _gCharactorMenuId) {
        return;
    }
    troggleBtn($("#btn" + _gCharactorMenuId).get(0));
    troggleBtn(obj);
    switchCharactorSubpage(_gCharactorMenuId, nextID);
    _gCharactorMenuId = nextID;    
}

function onAddItemBtn(obj) {
    _gObjID++;
    _gGameObj.disableAllCtrl();
    _gGameObj.addObject("obj_" + _gObjID, obj);
}

function onGranderBtn(isMale)
{
    _gObjID++;
    _gGameObj.disableAllCtrl();
    _gGameObj.addCharObject("obj_" + _gObjID, isMale);

    if (_gCharactorMenuId != _gCharactorMenuSet[0])
    {
        troggleBtn($("#btn" + _gCharactorMenuId).get(0));
        troggleBtn($("#btn" + _gCharactorMenuSet[0]).get(0));
        _gCharactorMenuId = _gCharactorMenuSet[0];
    }

    _gCharactorGrander = isMale;
    $("#charactorGranderDiv").hide();
    $("#charactorItemDiv").show();
    if(isMale){
        $("#charactorHeadMaleDiv").show();
        $("#charactorHeadFemaleDiv").hide();

    }
    else {
        $("#charactorHeadFemaleDiv").show();
        $("#charactorHeadMaleDiv").hide();
    }
    $("#charactorClothesFemaleDiv").hide();
    $("#charactorClothesMaleDiv").hide();
    
}

function onChangeHead(headId)
{
    var path;
    if (_gCharactorGrander)
    {
        path = 'assets/img/charactor/male/h' + (headId + 1).pad(2) + '.png';
    }
    else
    {
        path = 'assets/img/charactor/female/h' + (headId + 1).pad(2) + '.png';
    }
    
    _gGameObj.changeHead(path);
}

function onChangeClothes(clothesId) {
    var path;
    if (_gCharactorGrander) {
        path = 'assets/img/charactor/male/c' + (clothesId + 1).pad(2) + '.png';
    }
    else {
        path = 'assets/img/charactor/female/c' + (clothesId + 1).pad(2) + '.png';
    }
    _gGameObj.changeClothes(path);
}
//---------------------------

function changeLanguage()
{
    var list = $('img[data-tag="language"]');
    for(var i = 0; i < list.length; i++)
    {
        var path = list[i].src;
        var filename = path.substring(path.lastIndexOf('/'));
        if(_gShowZH)
        {
            filename = _gZhPath + filename;
        }
        else
        {
            filename = _gEnPath + filename;
        }
        list[i].src = filename;
    }
}

function troggleBtn(obj, val) {
    
    var id = obj.id;
    $("#" + id).toggleClass("btnInactive");

}

function getUrlParameter() {
    var url = new URL(window.location.href);
    var type = get("type");
    if(type=="blue")
    {
        $("#content").css({ "background-color": "#caeefb" });
        $("#gameSelectDiv").css({ "background-color": "#caeefb" });
    }
}

function get(name) {
    if (name = (new RegExp('[?&]' + encodeURIComponent(name) + '=([^&]*)')).exec(location.search))
        return decodeURIComponent(name[1]);
}


//---------------------------

window.onload = function () {
    _gGameObj = new gameCanvas();
    getUrlParameter();
    
}