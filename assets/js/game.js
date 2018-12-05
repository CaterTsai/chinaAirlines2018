
var gameCanvas = function () {
    this.isInit = false;
    this.width = 0;
    this.height = 0;
    this.stage = null;
    this.layer = null;
    this.bgLayer = null;
    this.groupSet = {};

    this.closeBtn = null;
    this.scaleBtn = null;

    this.defaultMaleHead = null;
    this.defaultMaleClothes = null;
    this.defaultFemaleHead = null;
    this.defaultFemaleClothes = null;

    this.ctrlObjId = "";
};

gameCanvas.prototype = {

    init: function (id, w, h) {
        if (!this.isInit) {
            this.stage = new Konva.Stage({
                container: id,
                width: w,
                height: h
            });
            this.isInit = true;
            this.width = w;
            this.height = h;

            this.bgLayer = new Konva.Layer();
            this.layer = new Konva.Layer();
            this.topLayer = new Konva.Layer();
            this.coverLayer = new Konva.Layer();
            this.coverLayer.listening(false);
            this.stage.add(this.bgLayer);
            this.stage.add(this.layer);
            this.stage.add(this.topLayer);
            this.stage.add(this.coverLayer);

            this.closeBtn = new Image();
            this.scaleBtn = new Image();
            this.closeBtn.src = "assets/img/btnClose.png";
            this.scaleBtn.src = "assets/img/btnScale.png";

            this.defaultMaleHead = new Image();
            this.defaultFemaleHead = new Image();
            this.defaultMaleClothes = new Image();
            this.defaultFemaleClothes = new Image();
            this.defaultMaleHead.src = "assets/img/charactor/male/h02.png";
            this.defaultFemaleHead.src = "assets/img/charactor/female/h02.png";
            this.defaultMaleClothes.src = "assets/img/charactor/male/c01.png";
            this.defaultFemaleClothes.src = "assets/img/charactor/female/c01.png";

            parent = this;
            this.bgLayer.on('click tap', function () { parent.disableAllCtrl() });

            var cover = new Image();
            var clayer = this.coverLayer;
            cover.onload = function(){
                var img = new Konva.Image({
                    image: cover,
                    x: 0,
                    y: 0,
                    width: w,
                    height: h,
                    listening:false
                });
                clayer.add(img);
                clayer.draw();
            }
            cover.src = "assets/img/photoFrame.png";
        }
    },

    setPlace: function (id) {
        var bgImg = new Image();
        var layer = this.bgLayer;
        var w = this.width * 0.93;
        var h = this.height * 0.93;
        var posX = (this.width - w) * 0.5;
        var posY = (this.height - h) * 0.5;
        bgImg.onload = function () {
            var bgObj = new Konva.Image(
            {
                x: posX,
                y: posY,
                image: bgImg,
                width: w,
                height: h
            }
            );
            layer.add(bgObj);
            layer.draw();
        }
        bgImg.src = "assets/img/place/" + id + ".jpg";
    },    

    addObject: function (objId, obj, onTop) {

        if (typeof onTop == 'undefined') {
            onTop = false;
        }

        var objWidth = obj.width;
        var objHeight = obj.height;

        if (objWidth > this.width) {
            objWidth = this.width * 0.8;
            objHeight = objWidth * obj.height / obj.width;
        }
        var group = new Konva.Group({
            x: this.width * 0.5 - objWidth * 0.5,
            y: this.height * 0.5 - objHeight * 0.5,
            width: objWidth,
            height: objHeight,
            id: objId,
            name: "item"
        });

        var box = new Konva.Rect({
            x: 0,
            y: 0,
            width: objWidth,
            height: objHeight,
            fillEnabled: true,
            stroke: "#3e5bc7",
            strokeWidth: 2,
            name: 'rect',
            draggable: true
        });
        var img = new Konva.Image({
            image: obj,
            x: 0,
            y: 0,
            width: objWidth,
            height: objHeight,
            name: 'element'
        });

        var close = this.getCloseBtn(objWidth);
        var scale = this.getScaleBtn(group, objWidth);

        var parent = this;
        close.on('click tap', function () { parent.removeObj(close); });
        scale.on('mousedown touchstart', function () { parent.stopDrag(scale); })
        scale.on('dragmove', function () {
            parent.scaleObj(this, scale);
            scale.getLayer().draw();
        });
        scale.on('dragend', function () { parent.startDrag(scale); });
        box.on('dragmove', function () {
            parent.dragRect(box);
            box.getLayer().draw();
        });
        box.on('click touchstart', function () { parent.onObjectClick(group); });
        group.add(img);
        group.add(box);
        group.add(close);
        group.add(scale);

        if (onTop) {
            this.topLayer.add(group);
            this.topLayer.draw();
        }
        else {
            this.layer.add(group);
            this.layer.draw();
        }
        this.ctrlObjId = objId;
    },

    addCharObject: function (objId, isMale, onSelect, onRemove) {
        head = null;
        clothes = null;
        if (isMale) {
            head = this.defaultMaleHead;
            clothes = this.defaultMaleClothes;
        }
        else {
            head = this.defaultFemaleHead;
            clothes = this.defaultFemaleClothes;
        }

        var charW = this.width * 0.7;
        var charH = charW * (clothes.height / clothes.width);
        var boxW = this.width * 0.3;
        var boxH = charH;

        var group = new Konva.Group({
            x: this.width * 0.5 - boxW * 0.5,
            y: this.height * 0.5 - boxH * 0.5,
            width: boxW,
            height: boxH,
            id: objId,
            name: "charactor"
        });

        var box = new Konva.Rect({
            x: 0,
            y: 0,
            width: boxW,
            height: boxH,
            fillEnabled: true,
            stroke: "#3e5bc7",
            strokeWidth: 2,
            name: 'rect',
            draggable: true
        });
        var head = new Konva.Image({
            image: head,
            x: (boxW - charW) * 0.5,
            y: 0,
            width: charW,
            height: charH,
            name: 'head',
            listening: false
        });
        var clothes = new Konva.Image({
            image: clothes,
            x: (boxW - charW) * 0.5,
            y: 0,
            width: charW,
            height: charH,
            name: 'clothes',
            listening: false
        });

        var close = this.getCharCloseBtn(boxW, boxW);
        var scale = this.getCharScaleBtn(clothes, box, boxW, boxW);

        var parent = this;
        close.on('click tap', function () { parent.removeObj(close, onRemove); });
        scale.on('mousedown touchstart', function () { parent.stopDrag(scale); })
        scale.on('dragmove', function () {
            parent.scaleCharObj(this);
            parent.layer.draw();
        });
        scale.on('dragend', function () { parent.startDrag(scale); });
        box.on('dragmove', function () {
            parent.dragRect(box);
            parent.layer.draw();
        });
        box.on('click touchstart', function () { parent.onObjectClick(group, isMale, onSelect); });
        group.add(clothes);
        group.add(head);
        group.add(box);
        group.add(close);
        group.add(scale);
        this.layer.add(group);
        this.layer.draw();

        this.ctrlObjId = objId;
    },

    changeHead: function (objId, headPath) {
        var parent = this;


        var newHead = new Image();
        newHead.onload = function () {
            var obj = parent.layer.findOne('#' + objId);
            var head = obj.findOne('.head');
            
            var newHeadObj = new Konva.Image(
            {
                x: (obj.width() - head.width()) * 0.5,
                y: 0,
                image: newHead,
                width: head.width(),
                height: head.height(),
                name: 'head',
                listening: false
            });
            head.destroy();

            obj.add(newHeadObj);
            parent.layer.draw();
        }
        newHead.src = headPath;
    },

    changeClothes: function (objId, clothesPath) {
        var parent = this;
        var newClothes = new Image();

        newClothes.onload = function () {
            var obj = parent.layer.findOne('#' + objId);
            var clothes = obj.findOne('.clothes')
            var newClothesObj = new Konva.Image(
            {
                x: (obj.width() - clothes.width()) * 0.5,
                y: 0,
                image: newClothes,
                width: clothes.width(),
                height: clothes.height(),
                name: 'clothes',
                listening: false
            });
            clothes.destroy();

            obj.add(newClothesObj);
            var head = obj.findOne('.head');
            head.moveToTop();
            parent.layer.draw();
        }
        newClothes.src = clothesPath;
    },

    getCloseBtn: function (w) {
        var size = this.width * 0.08;
        var close = new Konva.Image({
            x: size * -0.5,
            y: size * -0.5,
            image: this.closeBtn,
            width: size,
            height: size,
            name: 'close'
        });
        return close;
    },

    getCharCloseBtn: function (groupW, boxW) {
        var size = this.width * 0.08;
        var close = new Konva.Image({
            x: (groupW - boxW) * 0.5 + (size * -0.5),
            y: size * -0.5,
            image: this.closeBtn,
            width: size,
            height: size,
            name: 'close'
        });
        return close;
    },

    getScaleBtn: function (obj, w) {
        var size = this.width * 0.08;

        var scale = new Konva.Image({
            x: w - size * 0.5,
            y: size * -0.5,
            image: this.scaleBtn,
            width: size,
            height: size,
            draggable: true,
            dragOnTop: false,
            name: 'scale',
            dragBoundFunc: function (pos) {
                var oldPos = obj.getAbsolutePosition();
                oldPos.x += obj.width();
                oldPos.x -= this.width() * 0.5;
                oldPos.y -= this.height() * 0.5;
                var newY = oldPos.y - (pos.x - oldPos.x) * (obj.height() / obj.width());
                var objPos = obj.getAbsolutePosition();
                objPos.x -= this.width() * 0.5;
                objPos.y -= this.height() * 0.5;

                if (pos.x - objPos.x < this.width() || (objPos.y + obj.height()) - newY < this.height()) {
                    pos = oldPos;
                }
                else {
                    pos.y = newY;
                }
                return {
                    x: pos.x,
                    y: pos.y
                }
            }
        });
        return scale;
    },

    getCharScaleBtn: function (obj, box, groupW, boxW) {
        var size = this.width * 0.08;

        var scale = new Konva.Image({
            x: (groupW + boxW) * 0.5 - size * 0.5,
            y: size * -0.5,
            image: this.scaleBtn,
            width: size,
            height: size,
            draggable: true,
            dragOnTop: false,
            name: 'scale',
            dragBoundFunc: function (pos) {
                var oldPos = box.getAbsolutePosition();
                oldPos.x += box.width();
                oldPos.x -= this.width() * 0.5;
                oldPos.y -= this.height() * 0.5;
                var newY = oldPos.y - (pos.x - oldPos.x) * (obj.height() / obj.width());
                var objPos = box.getAbsolutePosition();
                objPos.x -= this.width() * 0.5;
                objPos.y -= this.height() * 0.5;

                if (pos.x - objPos.x < this.width() || (objPos.y + box.height()) - newY < this.height()) {
                    pos = oldPos;
                }
                else {
                    pos.y = newY;
                }
                return {
                    x: pos.x,
                    y: pos.y
                }
            }
        });
        return scale;
    },

    onObjectClick: function (obj, isMale, callback) {
        if (!obj.draggable()) {
            this.disableAllCtrl();
            this.setCtrl(obj, true);
            obj.moveToTop();
        }

        if (typeof callback != "undefined") {
            callback(obj.id(), isMale);
        }
    },

    removeObj: function (obj, callback) {
        var layer = obj.getLayer();
        var group = obj.getParent();

        group.destroy();
        layer.draw();

        if (typeof callback != "undefined") {
            callback();
        }
    },

    dragRect: function (obj) {
        var group = obj.getParent();
        var clothes = group.findOne('.clothes');
        var rectPos = obj.getAbsolutePosition();
        group.position(rectPos);
    },

    stopDrag: function (obj) {
        var group = obj.getParent();
        group.draggable(false);
    },

    startDrag: function (obj) {
        var group = obj.getParent();
        group.draggable(true);
    },

    scaleObj: function (anchor, obj) {
        var group = obj.getParent();
        var image = group.findOne('.element');
        var rect = group.findOne('.rect');
        var pAnchor = anchor.getAbsolutePosition();
        pAnchor.x += anchor.width() * 0.5;
        pAnchor.y += anchor.height() * 0.5;
        var pImage = image.getAbsolutePosition();

        var newW = pAnchor.x - pImage.x;
        var newH = pImage.y + image.height() - pAnchor.y;
        image.width
        image.width(newW);
        image.height(newH);
        rect.width(newW);
        rect.height(newH);
        group.position({ x: pImage.x, y: pImage.y + (pAnchor.y - pImage.y) });
        group.width(newW);
        group.height(newH);
    },

    scaleCharObj: function (obj) {
        var group = obj.getParent();
        var head = group.findOne('.head');
        var clothes = group.findOne('.clothes');
        var rect = group.findOne('.rect');
        var pAnchor = obj.getAbsolutePosition();
        pAnchor.x += obj.width() * 0.5;
        pAnchor.y += obj.height() * 0.5;

        pOldAnchor = rect.getAbsolutePosition();
        pOldAnchor.x += rect.width();

        diffX = (pAnchor.x - pOldAnchor.x);
        diffY = (pAnchor.y - pOldAnchor.y) * -1;


        var newW = clothes.width() + (diffX);
        var newH = clothes.height() + diffY;
        var newBoxW = rect.width() + diffX;
        var newBoxH = rect.height() + diffY;
        head.width(newW);
        head.height(newH);
        clothes.width(newW);
        clothes.height(newH);

        group.position({ x: group.x(), y: group.y() - diffY });
        group.width(newBoxW);
        group.height(newBoxH);
        rect.width(newBoxW);
        rect.height(newBoxH);
    },

    setCtrl: function (obj, isEnable) {
        var rect = obj.findOne('.rect');
        var close = obj.findOne('.close');
        var scale = obj.findOne('.scale');

        if (isEnable) {
            rect.strokeEnabled(true);
            close.show();
            scale.show();
            obj.draggable(true);
        }
        else {
            rect.strokeEnabled(false);
            close.hide();
            scale.hide();
            obj.draggable(false);
        }
    },

    disableAllCtrl: function () {
        var allObj = this.layer.getChildren();
        for (var i = 0; i < allObj.length; i++) {
            this.setCtrl(allObj[i], false);
        }
        this.layer.draw();

        allObj = this.topLayer.getChildren();
        for (var i = 0; i < allObj.length; i++) {
            this.setCtrl(allObj[i], false);
        }
        this.topLayer.draw();
    },

    getResult: function () {
        var result = this.stage.toDataURL({ "mimeType": "image/jpeg", "pixelRatio":3});
        return result;
    }
}