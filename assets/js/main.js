﻿var _gPlaceId = 0;
var _gGameMenuSet = ["Charactor", "Deco", "Word", "Share"];
var _gGameMenuId = _gGameMenuSet[0];
var _gCharactorMenuSet = ["Head", "Clothes"];
var _gCharactorMenuId = _gCharactorMenuSet[0];
var _gCharactorGrander = true;
var _gCharactorList = {};
var _gIsSelectCharactor = false;
var _gSelectCharactorID;

var _gGameObj = null;
var _gObjID = 0;

var _gShowZH = true; // true:zh false:en
var _gZhPath = "assets/img/zh";
var _gEnPath = "assets/img/en";

var _gPhotoPath = "s/shareImg/";
var _gPhotoGUID = "";
var _gPhotoShareUrl = "";
var _gPhotoUrl = "";
var _gUrl = "https://happyholidays.china-airlines.com/";
var _gRedirectionUrl = _gUrl + "redirection.html";
var _gClipboard;

//Modify Page
var _gCanModify = false;
var _gIsInitalBefore = false;
var _gSelectClouthId = 0;
var _gFaceDefaultWidth = 300;
var _gFaceMaximumWidth = _gFaceDefaultWidth * 10;
var _gCanvasSize = { 'male': [800, 800], 'female': [720, 760] };
var _gMaleClip = [397, 88, 59, 88];
var _gFemaleClip = [361, 105, 73, 94];
var _gFaceInfo = { 'x': 0, 'y': 0, 'width': 0, 'height': 0, 'rotate': 0 };
var _gFaceInfoBackup = _gFaceInfo;
var _gFaceRotateTmp;
var _gCTX = null;
var _gBody = null;
var _gHead = null;
var _gFace = null;
var _gFaceFilter = null;
var _gHammer = null;

Number.prototype.pad = function (size) {
    var s = String(this);
    while (s.length < (size || 2)) { s = "0" + s; }
    return s;
}

//---------------------------
//AJAX
function toSUploadPhoto(photo, callback) {

    $.post(
        "s/upload.aspx",
        {
            active: "uploadImg",
            image: photo
        },
        "json"
    ).done(
        function (data) {
            var result = JSON.parse(data);
            if (result["result"]) {
                _gPhotoGUID = result["guid"];
                _gPhotoShareUrl = result["link"];
                _gPhotoUrl = _gUrl + 's/shareImg/' + _gPhotoGUID + ".jpg";
                if (typeof callback != "undefined") {
                    callback();
                }
            }
        }
    )
}

//---------------------------
//Stage Page
function setPlace() {
    var name = "place" + (_gPlaceId + 1).pad(2);
    _gGameObj.setPlace(name);

    $("#modifyBG").attr('src', "assets/img/background/" + name + ".jpg");

    gtaEvent("Country", (_gPlaceId + 1));
}

//---------------------------
//Game Page
function showCharactor() {
    $("#charactorGranderDiv").show();
    $("#charactorItemDiv").hide();
}

function showCharactorItem(isMale) {
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

    if (_gCharactorMenuId != _gCharactorMenuSet[0]) {
        troggleBtn($("#btn" + _gCharactorMenuId).get(0));
        troggleBtn($("#btn" + _gCharactorMenuSet[0]).get(0));
        _gCharactorMenuId = _gCharactorMenuSet[0];
    }
}

function switchSubpage(before, after) {
    $("#game" + after + "Div").show();
    $("#game" + before + "Div").hide();

    if (after == _gGameMenuSet[0]) {
        showCharactor();
    }
    else if (after == _gGameMenuSet[3]) {
        _gGameObj.disableAllCtrl();

        _gIsSelectCharactor = false;
        _gSelectCharactorID = -1;

        _gPhotoGUID = "";
        _gPhotoShareUrl = "";
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

function onCharactorRemove() {
    if (_gGameMenuId == "Charactor") {
        showCharactor();
    }

    _gIsSelectCharactor = false;
    _gSelectCharactorID = -1;
}

function onCharactorSelect(id, isMale) {
    _gIsSelectCharactor = true;
    _gSelectCharactorID = id;
    if (_gGameMenuId != "Charactor") {
        switchSubpage(_gGameMenuId, "Charactor");
        troggleBtn($("#btn" + _gGameMenuId).get(0));
        troggleBtn($("#btn" + "Charactor").get(0));
        _gGameMenuId = "Charactor";

        showCharactorItem(isMale);
    }
    else {
        if (isMale != _gCharactorGrander) {
            showCharactorItem(isMale);
            _gCharactorGrander = isMale;
        }
    }
}

//---------------------------
//Modify Page
function enableModifyCtrl() {

    if (_gIsInitalBefore) {
        return;
    }
    var modifyCanvas = $("#modifyCanvas")[0];
    _gHammer = new Hammer(modifyCanvas);
    _gHammer.get('pan').set({ direction: Hammer.DIRECTION_ALL });
    _gHammer.get('pinch').set({ enable: true });
    _gHammer.get('rotate').set({ enable: true });

    _gHammer.on('pan', function (e) {
        _gFaceInfo['x'] = _gFaceInfoBackup['x'] + e.deltaX;
        _gFaceInfo['y'] = _gFaceInfoBackup['y'] + e.deltaY;
        updateCanvas();
    });

    _gHammer.on('pinch', function (e) {
        _gFaceInfo['width'] = _gFaceInfoBackup['width'] * e.scale;
        _gFaceInfo['height'] = _gFaceInfo['width'] * (_gFace.height / _gFace.width);
        updateCanvas();
    });

    _gHammer.on('rotatestart', function (e) {
        _gFaceRotateTmp = e.rotation;
    });

    _gHammer.on('rotate', function (e) {
        _gFaceInfo['rotate'] = _gFaceInfoBackup['rotate'] + (e.rotation - _gFaceRotateTmp);
        updateCanvas();
    });

    _gHammer.on('panend', function (e) {
        _gFaceInfoBackup['x'] = _gFaceInfo['x'];
        _gFaceInfoBackup['y'] = _gFaceInfo['y'];
    });

    _gHammer.on('pinchend', function (e) {
        _gFaceInfoBackup['width'] = _gFaceInfo['width'];
        _gFaceInfoBackup['height'] = _gFaceInfo['height'];
    });

    _gHammer.on('rotateend', function (e) {
        _gFaceInfoBackup['rotate'] = _gFaceInfo['rotate'];
    });
    _gIsInitalBefore = true;
}

function initModifyCanvas() {
    _gCanModify = false;
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

    if (!$("#btnOK").hasClass("btnInactive")) {
        $("#btnOK").addClass("btnInactive");
    }

    $("#uploadPhoto").replaceWith($("#uploadPhoto").val('').clone(true));
}

function addFace(src) {
    _gFace = new Image();
    _gFace.onload = function () {
        applyFilter(this);

    }
    _gFace.src = src;
    _gCanModify = true;
}

function applyFilter(img) {
    var tmpCanv = document.createElement("canvas");
    tmpCanv.id = "tmpCanvas";
    tmpCanv.width = img.width;
    tmpCanv.height = img.height;
    var ctx = tmpCanv.getContext("2d");

    ctx.drawImage(img, 0, 0);
    var data = ctx.getImageData(0, 0, tmpCanv.width, tmpCanv.height);
    JSManipulate.gain.filter(data, { gain: 0.4, bias: 0.75 });
    JSManipulate.rgbadjust.filter(data, { red: 1.1, green: 1.05, blue: 1.0 });

    ctx.putImageData(data, 0, 0);
    var newImg = tmpCanv.toDataURL();

    _gFaceFilter = new Image();
    _gFaceFilter.onload = function () {
        enableModifyCtrl();
        _gFaceInfo['width'] = _gFaceDefaultWidth;
        _gFaceInfo['height'] = _gFaceDefaultWidth * (_gFaceFilter.height / _gFaceFilter.width);
        if (_gCharactorGrander) {
            _gFaceInfo['x'] = _gCanvasSize['male'][0] * 0.5;
        }
        else {
            _gFaceInfo['x'] = _gCanvasSize['female'][0] * 0.5;
        }
        _gFaceInfo['y'] = _gFaceInfo['height'] * 0.5;
        _gFaceInfoBackup = JSON.parse(JSON.stringify(_gFaceInfo));

        updateCanvas();

        swal({
            title: "完成",
            type: "success",
            showConfirmButton : false,
            timer: 1000
        });
    }
    _gFaceFilter.src = newImg;
}

function updateCanvas() {
    if (_gCTX == null) {
        return;
    }
    var modifyCanvas = $("#modifyCanvas")[0];
    _gCTX.clearRect(0, 0, modifyCanvas.width, modifyCanvas.height);

    _gCTX.save();
    if (_gCharactorGrander) {
        drawEllipseByCenter(_gCTX, _gMaleClip[0], _gMaleClip[1], _gMaleClip[2], _gMaleClip[3]);
    }
    else {
        drawEllipseByCenter(_gCTX, _gFemaleClip[0], _gFemaleClip[1], _gFemaleClip[2], _gFemaleClip[3]);
    }
    _gCTX.clip();

    _gCTX.translate(_gFaceInfo['x'], _gFaceInfo['y']);
    _gCTX.rotate(_gFaceInfo['rotate'] * Math.PI / 180);
    _gCTX.drawImage(_gFaceFilter, _gFaceInfo['width'] * -0.5, _gFaceInfo['height'] * -0.5, _gFaceInfo['width'], _gFaceInfo['height']);
    _gCTX.restore();

    _gCTX.drawImage(_gHead, 0, 0);
    _gCTX.drawImage(_gBody, 0, 0);
}

function updateCanvasWithoutBody() {
    if (_gCTX == null) {
        return;
    }
    var modifyCanvas = $("#modifyCanvas")[0];
    _gCTX.clearRect(0, 0, modifyCanvas.width, modifyCanvas.height);

    _gCTX.save();
    if (_gCharactorGrander) {
        drawEllipseByCenter(_gCTX, _gMaleClip[0], _gMaleClip[1], _gMaleClip[2], _gMaleClip[3]);
    }
    else {
        drawEllipseByCenter(_gCTX, _gFemaleClip[0], _gFemaleClip[1], _gFemaleClip[2], _gFemaleClip[3]);
    }
    _gCTX.clip();

    _gCTX.translate(_gFaceInfo['x'], _gFaceInfo['y']);
    _gCTX.rotate(_gFaceInfo['rotate'] * Math.PI / 180);
    _gCTX.drawImage(_gFaceFilter, _gFaceInfo['width'] * -0.5, _gFaceInfo['height'] * -0.5, _gFaceInfo['width'], _gFaceInfo['height']);
    _gCTX.restore();
    _gCTX.drawImage(_gHead, 0, 0);
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
//Share Page
function uploadPhoto(callback) {
    var imgData = _gGameObj.getResult();
    imgData = imgData.split(',')[1];
    toSUploadPhoto(imgData, callback);
}

function savePhoto() {

    var iOS = !!navigator.platform && /iPad|iPhone|iPod/.test(navigator.platform);

    var imgData = _gGameObj.getResult();
    if (iOS) {
        popoutResult(imgData);
    }
    else {
        download(imgData, "cards.jpg", "image/jpeg");
    }

}

function shareFB() {
    if (_gPhotoGUID == "") {
        return;
    }

    var url = encodeURIComponent(_gPhotoShareUrl);

    var hashTag = encodeURIComponent("#旅人賀卡");
    var reurl = encodeURIComponent(_gRedirectionUrl);
    var share_url = "https://www.facebook.com/dialog/share?"
        + "app_id=295185771003716"
        + "&href=" + url
        + "&hashtag=" + hashTag
        + "&redirect_uri=" + reurl;
    window.location = share_url;
}

function shareWeChat() {
    savePhoto();
    if (_gShowZH) {
        swal("圖片儲存後，您就可以開啟WeChat分享給朋友了！");
    }
    else {
        swal("You can open WeChat and share with your friends after saving this image!");
    }
}

function shareLine() {
    if (_gPhotoGUID == "") {
        return;
    }

    var url = "";
    if (jQuery.browser.mobile) {
        url = "line://msg/text/" + encodeURIComponent(_gPhotoShareUrl);
    }
    else {
        url = "https://lineit.line.me/share/ui?url=" + encodeURIComponent(_gPhotoShareUrl);
    }

    window.location = url;
}

function popoutResult(resultData) {
    $("#resultImg")[0].src = resultData;
    $("#resultImg")[0].onload = function () {
        $("#popout").show();
        $("#result").show();
    }
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

    var title, text;
    if (_gShowZH)
    {
        title = "地點選好就要出發囉！";
        text = "如果你想要更換地點，你可以選擇再多玩幾次，試看看每個國家不一樣的風情吧！"
    }
    else
    {
        title = "Get ready for take-off！";
        text = "Don't forget to play again to check out the beauty of different city themes!"
    }
    swal(
        {
            title: title,
            text: text,
            showConfirmButton:true,
            showCancelButton: true
        }).then(function(result){
            if (result.dismiss != "cancel") {
                $("#stageDiv").hide();
                $("#gameDiv").show();

                var h = $("#canvasDiv").height();
                var w = $("#canvasDiv").width();
                var size = w;
                if (w > document.documentElement.clientWidth) {
                    var size = document.documentElement.clientWidth * 0.8;

                    $("#canvasDiv").width(size);
                    $("#canvasDiv").height(size);
                }

                _gGameObj.init("gameContainer", size, size);
                setPlace();
            }
        });
}

function onGameMenuBtn(obj) {
    var nextID = obj.getAttribute("data-itemID")
    if (nextID == _gGameMenuId) {
        if (nextID == "Charactor") {
            showCharactor();
        }
    }
    else {
        if (_gGameMenuId != "Share") {
            troggleBtn($("#btn" + _gGameMenuId).get(0));
        }

        if (nextID != "Share") {
            troggleBtn(obj);
        }
        switchSubpage(_gGameMenuId, nextID);
        _gGameMenuId = nextID;
    }
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

function onAddItemBtn(obj, onTop) {
    if (typeof onTop == 'undefined') {
        onTop = false;
    }

    _gObjID++;
    _gGameObj.disableAllCtrl();
    _gIsSelectCharactor = false;
    _gSelectCharactorID = -1;
    if (obj.src.search("Menu") == -1) {
        _gGameObj.addObject("obj_" + _gObjID, obj, onTop);
    }
    else {
        var img = new Image();
        img.onload = function () {
            _gGameObj.addObject("obj_" + _gObjID, img, onTop);
        }
        var path = obj.src.replace("Menu", "");
        img.src = path;
    }

    var name = obj.src.substring(obj.src.lastIndexOf('/'));
    if (_gGameMenuId == "Deco")
    {
        gtaEvent("item", "deco" + name);
    }
    else if(_gGameMenuId == "Word")
    {
        gtaEvent("item", "word" + name);
    }
    

}

function onGranderBtn(isMale) {
    _gObjID++;
    _gIsSelectCharactor = true;
    _gSelectCharactorID = "obj_" + _gObjID;

    _gGameObj.disableAllCtrl();
    _gGameObj.addCharObject(_gSelectCharactorID, isMale, onCharactorSelect, onCharactorRemove);

    _gCharactorGrander = isMale;
    _gCharactorList[_gSelectCharactorID] = { "grander": isMale, "head": 0, "clouth": 0 };

    _gSelectClouthId = 0;
    showCharactorItem(_gCharactorGrander);

    if (_gCharactorGrander)
    {
        gtaEvent("grander", "male");
    }
    else
    {
        gtaEvent("grander", "female");
    }
}

function onChangeHead(headId) {
    if (_gIsSelectCharactor) {
        var path;
        if (_gCharactorGrander) {
            path = 'assets/img/charactor/male/h' + (headId + 1).pad(2) + '.png';
        }
        else {
            path = 'assets/img/charactor/female/h' + (headId + 1).pad(2) + '.png';
        }
        _gGameObj.changeHead(_gSelectCharactorID, path);

        if (_gCharactorGrander) {
            gtaEvent("head", "male" + (headId + 1));
        }
        else {
            gtaEvent("head", "female" + (headId + 1));
        }
    }

}

function onModifyHead() {
    initModifyCanvas();
    $("#gameDiv").hide();
    $("#modifyDiv").show();

    if (_gCharactorGrander) {
        gtaEvent("head", "male-Modify");
    }
    else {
        gtaEvent("head", "female-Modify");
    }
    
}

function onChangeClothes(clothesId) {
    if (_gIsSelectCharactor) {
        var path;
        if (_gCharactorGrander) {
            path = 'assets/img/charactor/male/c' + (clothesId + 1).pad(2) + '.png';
        }
        else {
            path = 'assets/img/charactor/female/c' + (clothesId + 1).pad(2) + '.png';
        }
        _gGameObj.changeClothes(_gSelectCharactorID, path);
        _gSelectClouthId = clothesId;


        if (_gCharactorGrander) {
            gtaEvent("Clothes", "male" + (clothesId + 1));
        }
        else {
            gtaEvent("Clothes", "female" + (clothesId + 1));
        }
    }
}

function onBtnCloseModify() {
    $("#gameDiv").show();
    $("#modifyDiv").hide();
}

function onBtnZoom(size) {
    if (!_gCanModify) {
        return;
    }
    _gFaceInfo['width'] += size;
    _gFaceInfo['height'] = _gFaceInfo['width'] * (_gFace.height / _gFace.width);
    updateCanvas();
}

function onBtnRotate(degree) {
    if (!_gCanModify) {
        return;
    }
    _gFaceInfo['rotate'] += degree;
    updateCanvas();
}

function onPhotoUpload(input) {
    if (input.files && input.files[0]) {

        swal({
            title: "處理中",
            showConfirmButton: false,
            allowOutsideClick: false,
            allowEscapeKey: false,
        });

        EXIF.getData(input.files[0], function () {
            var orientation = EXIF.getTag(this, "Orientation");
            switch (orientation) {
                case 3: // 180° rotate left
                    _gFaceInfo['rotate'] = 180;
                    break;

                case 6: // 90° rotate right
                    _gFaceInfo['rotate'] = 90;
                    break;

                case 8: // 90° rotate left
                    _gFaceInfo['rotate'] = -90;
                    break;

                default:
                    _gFaceInfo['rotate'] = 0;
                    break;
            }

        });
        var reader = new FileReader();
        reader.onload = function (e) {
            addFace(e.target.result);
        };
        reader.readAsDataURL(input.files[0]);

        if ($("#btnOK").hasClass("btnInactive")) {
            $("#btnOK").removeClass("btnInactive");
        }
    }
}

function onBtnUploadOK() {
    if ($("#btnOK").hasClass("btnInactive")) {
        return;
    }
    updateCanvasWithoutBody();
    var canvas = $("#modifyCanvas")[0];
    _gGameObj.changeHead(_gSelectCharactorID, canvas.toDataURL("image/png"));

    $("#gameDiv").show();
    $("#modifyDiv").hide();
}

function onBtnDownload() {
    savePhoto();
    gtaEvent("Share", "Link");
}

function onBtnLink() {

    if (_gShowZH) {
        swal("活動連結複製成功");
    }
    else {
        swal("The link has been copied to your clipboard!");
    }
    
    gtaEvent("Share", "Link");
}

function onBtnFacebook() {
    if (_gPhotoGUID == "") {
        uploadPhoto(shareFB);
    }
    else {        
        shareFB();
    }
    gtaEvent("Share", "FB");
}

function onBtnWechat() {
    if (_gPhotoGUID == "") {
        uploadPhoto(shareWeChat);
    }
    else {
        shareWeChat();
    }
    gtaEvent("Share", "wechat");
}

function onBtnLine() {
    if (_gPhotoGUID == "") {
        uploadPhoto(shareLine);
    }
    else {
        shareLine();
    }
    gtaEvent("Share", "line");
}

function onBtnRemake() {

    gtaEvent("Share", "remake");
    if (_gShowZH) {
        window.location = _gUrl + "?from=remake";
    }
    else {
        window.location = _gUrl + "?from=remake&language=en";
    }
}

function onBtnPopoutCR() {
    $("#popout").show();
    $("#copyright").show();
}

function onBtnPopoutPrivacy() {
    $("#popout").show();
    $("#privacy").show();
}

function onBtnPopoutClose() {
    $("#popout").hide();
    $("#copyright").hide();
    $("#privacy").hide();
    $("#result").hide();
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
    var from = get("from");
    if (from == "remake") {
        $("#startDiv").hide();
        $("#stageDiv").show();
    }
    var language = get("language");
    if (language == "en") {
        onBtnLanguageChange();
    }
}

function get(name) {
    if (name = (new RegExp('[?&]' + encodeURIComponent(name) + '=([^&]*)')).exec(location.search))
        return decodeURIComponent(name[1]);
}

function loadCR() {

    $.get(
		"assets/copyright.txt",
		function (data) {
		    $("#crText").text(data);
		},
		"text"
	);
}

function loadPrivacy() {

    $.get(
		"assets/privacy.txt",
		function (data) {
		    $("#privacyText").text(data);
		},
		"text"
	);
}

function initCopy() {
    _gClipboard = new ClipboardJS('.copy-button', {
        text: function () {
            return _gUrl;
        }
    });
}
//---------------------------

window.onload = function () {
    _gGameObj = new gameCanvas();

    var isIE11 = !!window.MSInputMethodContext && !!document.documentMode;
    if (!isIE11) {
        getUrlParameter();
    }

    initModifyCanvas();
    initCopy();
    loadCR();
    loadPrivacy();
}