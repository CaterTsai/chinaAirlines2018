var _gPlaceId = 0;
var _gGameMenuSet = ["Charactor", "Deco", "Word"];
var _gGameMenuId = _gGameMenuSet[0];
var _gCharactorMenuSet = ["Head", "Clothes"];
var _gCharactorMenuId = _gCharactorMenuSet[0];
var _gCharactorGrander = true;
var _gGameObj = null;
var _gObjID = 0;

var _gShowZH = true; // true:zh false:en
var _gZhPath = "assets/img/zh";
var _gEnPath = "assets/img/en";

//Modify Page
var _gSelectClouthId = 2;
var _gFaceDefaultWidth = 300;
var _gFaceMaximumWidth = _gFaceDefaultWidth * 10;
var _gCanvasSize = { 'male': [800, 800], 'female': [720, 760] };
var _gMaleClip = [398, 99, 44, 54];
var _gFemaleClip = [361, 111, 41, 59];
var _gFaceInfo = { 'x': 0, 'y': 0, 'width': 0, 'height': 0 };
var _gFaceInfoBackup = _gFaceInfo;
var _gCTX = null;
var _gBody = null;
var _gHead = null;
var _gFace = null;
var _gHammer = null;

Number.prototype.pad = function (size) {
    var s = String(this);
    while (s.length < (size || 2)) { s = "0" + s; }
    return s;
}

//---------------------------
//Stage Page
function setPlace() {
    var name = "place" + (_gPlaceId + 1).pad(2);
    _gGameObj.setPlace(name);

    $("#modifyBG").attr('src', "assets/img/background/" + name + ".jpg");
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

    if (after == _gGameMenuSet[1]) {
        showCharactor();
    }
}

function switchCharactorSubpage(before, after) {
    if (_gCharactorGrander) {
        $("#charactor" + after + "MaleDiv").show();
        $("#charactor" + before + "MaleDiv").hide();
    }
    else {
        $("#charactor" + after + "FemaleDiv").show();
        $("#charactor" + before + "FemaleDiv").hide();
    }
}

//---------------------------
//Modify Page
function enableModifyCtrl() {
    var modifyCanvas = $("#modifyCanvas")[0];
    _gHammer = new Hammer(modifyCanvas);
    _gHammer.get('pan').set({ direction: Hammer.DIRECTION_ALL });
    _gHammer.get('pinch').set({ enable: true });

    _gHammer.on('pan', function (e) {
        _gFaceInfo['x'] = _gFaceInfoBackup['x'] + e.deltaX;
        _gFaceInfo['y'] = _gFaceInfoBackup['y'] + e.deltaY;

        updateCanvas();
    });

    _gHammer.on('panend', function (e) {
        _gFaceInfoBackup = Object.assign({}, _gFaceInfo);
    });

    _gHammer.on('pinch', function (e) {
        _gFaceInfo['width'] = _gFaceInfoBackup['width'] * e.scale;
        _gFaceInfo['height'] = _gFaceInfo['width'] * (_gFace.height / _gFace.width);
        updateCanvas();
    });

    _gHammer.on('pinchend', function (e) {
        _gFaceInfoBackup = Object.assign({}, _gFaceInfo);
    });
}

function initModifyCanvas() {
    var c = $("#modifyCanvas")[0];
    _gCTX = c.getContext("2d");

    if (_gCharactorGrander) {

        _gHead = $("#headCoverMale")[0];
        c.width = _gCanvasSize['male'][0];
        c.height = _gCanvasSize['male'][1];
    }
    else {
        _gHead = $("#headCoverFemale")[0];
        c.width = _gCanvasSize['female'][0];
        c.height = _gCanvasSize['female'][1];
    }

    _gBody = new Image();
    _gBody.onload = function () {
        _gCTX.drawImage(_gHead, 0, 0);
        _gCTX.drawImage(_gBody, 0, 0);
    }

    if (_gCharactorGrander) {
        _gBody.src = 'assets/img/charactor/male/c' + (_gSelectClouthId + 1).pad(2) + '.png';
    }
    else {
        _gBody.src = 'assets/img/charactor/female/c' + (_gSelectClouthId + 1).pad(2) + '.png';
    }
}

function addFace(src) {
    _gFace = new Image();
    _gFace.onload = function () {
        enableModifyCtrl();
        _gFaceInfo['width'] = _gFaceDefaultWidth;
        _gFaceInfo['height'] = _gFaceDefaultWidth * (_gFace.height / _gFace.width);
        if (_gCharactorGrander)
        {
            _gFaceInfo['x'] = _gCanvasSize['male'][0] * 0.5;
        }
        else
        {
            _gFaceInfo['x'] = _gCanvasSize['female'][0] * 0.5;
        }
        _gFaceInfo['y'] = _gFaceInfo['height'] * 0.5;
        _gFaceInfoBackup = Object.assign({}, _gFaceInfo);

        updateCanvas();
    }
    _gFace.src = src;


}

function updateCanvas() {
    if (_gCTX == null) {
        return;
    }

    _gCTX.save();
    if (_gCharactorGrander)
    {
        drawEllipseByCenter(_gCTX, _gMaleClip[0], _gMaleClip[1], _gMaleClip[2], _gMaleClip[3]);
    }
    else
    {
        drawEllipseByCenter(_gCTX, _gFemaleClip[0], _gFemaleClip[1], _gFemaleClip[2], _gFemaleClip[3]);
    }
    
    _gCTX.clip();
    _gCTX.drawImage(_gFace, _gFaceInfo['x'] + _gFaceInfo['width'] * -0.5, _gFaceInfo['y'] + _gFaceInfo['height'] * -0.5, _gFaceInfo['width'], _gFaceInfo['height']);
    _gCTX.restore();
    _gCTX.drawImage(_gHead, 0, 0);
    _gCTX.drawImage(_gBody, 0, 0);
}

function drawEllipseByCenter(ctx, cx, cy, w, h) {
    drawEllipse(ctx, cx - w / 2.0, cy - h / 2.0, w, h);
}

function drawEllipse(ctx, x, y, w, h) {
    var kappa = .5522848,
        ox = (w / 2) * kappa, // control point offset horizontal
        oy = (h / 2) * kappa, // control point offset vertical
        xe = x + w,           // x-end
        ye = y + h,           // y-end
        xm = x + w / 2,       // x-middle
        ym = y + h / 2;       // y-middle

    ctx.beginPath();
    ctx.moveTo(x, ym);
    ctx.bezierCurveTo(x, ym - oy, xm - ox, y, xm, y);
    ctx.bezierCurveTo(xm + ox, y, xe, ym - oy, xe, ym);
    ctx.bezierCurveTo(xe, ym + oy, xm + ox, ye, xm, ye);
    ctx.bezierCurveTo(xm - ox, ye, x, ym + oy, x, ym);
    //ctx.closePath(); // not used correctly, see comments (use to close off open path)
    ctx.stroke();
}

//---------------------------
//Button
function onBtnLanguageChange() {
    if (_gShowZH) {
        $("#btnLanguageZH").hide();
        $("#btnLanguageEN").show();
    }
    else {
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
    if (_gPlaceId != placeId) {
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
        if (nextID == "Charactor") {
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

function onGranderBtn(isMale) {
    _gObjID++;
    _gGameObj.disableAllCtrl();
    _gGameObj.addCharObject("obj_" + _gObjID, isMale);

    if (_gCharactorMenuId != _gCharactorMenuSet[0]) {
        troggleBtn($("#btn" + _gCharactorMenuId).get(0));
        troggleBtn($("#btn" + _gCharactorMenuSet[0]).get(0));
        _gCharactorMenuId = _gCharactorMenuSet[0];
    }

    _gCharactorGrander = isMale;
    _gSelectClouthId = 0;
    $("#charactorGranderDiv").hide();
    $("#charactorItemDiv").show();
    if (isMale) {
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

function onChangeHead(headId) {
    var path;
    if (_gCharactorGrander) {
        path = 'assets/img/charactor/male/h' + (headId + 1).pad(2) + '.png';
    }
    else {
        path = 'assets/img/charactor/female/h' + (headId + 1).pad(2) + '.png';
    }
    _gGameObj.changeHead(path);
}

function onModifyHead() {
    initModifyCanvas();
    $("#gameDiv").hide();
    $("#modifyDiv").show();
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
    _gSelectClouthId = clothesId;
}

function onPhotoUpload(input) {
    if (input.files && input.files[0]) {
        var reader = new FileReader();
        reader.onload = function (e) {
            addFace(e.target.result);
            //$("#" + id).attr('src', e.target.result)
        };
        reader.readAsDataURL(input.files[0]);

        if ($("#btnOK").hasClass("btnInactive")) {
            $("#btnOK").removeClass("btnInactive");
        }
    }
}

function onBtnUploadOK()
{
    if($("#btnOK").hasClass("btnInactive"))
    {
        return;
    }

    var canvas = $("#modifyCanvas")[0];
    _gGameObj.changeHead(canvas.toDataURL("image/png"));

    $("#gameDiv").show();
    $("#modifyDiv").hide();
}
//---------------------------

function changeLanguage() {
    var list = $('img[data-tag="language"]');
    for (var i = 0; i < list.length; i++) {
        var path = list[i].src;
        var filename = path.substring(path.lastIndexOf('/'));
        if (_gShowZH) {
            filename = _gZhPath + filename;
        }
        else {
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
    if (type == "blue") {
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
    initModifyCanvas();
}