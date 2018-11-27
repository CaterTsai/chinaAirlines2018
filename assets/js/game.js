
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

            this.layer = new Konva.Layer();
            this.bgLayer = new Konva.Layer();
            this.stage.add(this.bgLayer);
            this.stage.add(this.layer);

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
        }
    },

    setPlace: function (id) {
        var bgImg = new Image();
        var layer = this.bgLayer;
        var w = this.width;
        var h = this.height;
        bgImg.onload = function () {
            var bgObj = new Konva.Image(
            {
                x: 0,
                y: 0,
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

    addObject: function (objId, obj) {

        var group = new Konva.Group({
            x: this.width * 0.5 - obj.clientWidth * 0.5,
            y: this.height * 0.5 - obj.clientHeight * 0.5,
            width: obj.clientWidth,
            height: obj.clientHeight,
            id: objId,
            name: "item",
            draggable: true
        });

        var box = new Konva.Rect({
            x: 0,
            y: 0,
            width: obj.clientWidth,
            height: obj.clientHeight,
            fillEnabled: false,
            stroke: "#3e5bc7",
            strokeWidth: 2,
            name: 'rect'
        });
        var img = new Konva.Image({
            image: obj,
            x: 0,
            y: 0,
            width: obj.clientWidth,
            height: obj.clientHeight,
            name: 'element'
        });

        var close = this.getCloseBtn(obj.clientWidth);
        var scale = this.getScaleBtn(group, obj.clientWidth);

        var parent = this;
        close.on('click tap', function () { parent.removeObj(objId); });
        scale.on('mousedown touchstart', function () { parent.stopDrag(objId); })
        scale.on('dragmove', function () {
            parent.scaleObj(this, objId);
            parent.layer.draw();
        });
        scale.on('dragend', function () { parent.startDrag(objId); });
        group.on('click touchstart', function () { parent.onObjectClick(this); })
        group.add(img);
        group.add(box);
        group.add(close);
        group.add(scale);
        this.layer.add(group);
        this.layer.draw();

        this.ctrlObjId = objId;
    },

    addCharObject: function (objId, isMale) {
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

        var charW = this.width * 0.8;
        var charH = charW * (clothes.height / clothes.width);
        var boxW = this.width * 0.5;
        var boxH = charH;

        var group = new Konva.Group({
            x: this.width * 0.5 - charW * 0.5,
            y: this.height * 0.5 - charW * 0.5,
            width: charW,
            height: charH,
            id: objId,
            name: "charactor",
            draggable: true
        });

        var box = new Konva.Rect({
            x: charW * 0.5 - boxW * 0.5,
            y: 0,
            width: boxW,
            height: boxH,
            fillEnabled: false,
            stroke: "#3e5bc7",
            strokeWidth: 2,
            name: 'rect'
        });
        var head = new Konva.Image({
            image: head,
            x: 0,
            y: 0,
            width: charW,
            height: charH,
            name: 'head'
        });
        var clothes = new Konva.Image({
            image: clothes,
            x: 0,
            y: 0,
            width: charW,
            height: charH,
            name: 'clothes'
        });

        var close = this.getCharCloseBtn(charW, boxW);
        var scale = this.getCharScaleBtn(group, box, charW, boxW);

        var parent = this;
        close.on('click tap', function () { parent.removeObj(objId); });
        scale.on('mousedown touchstart', function () { parent.stopDrag(objId); })
        scale.on('dragmove', function () {
            parent.scaleCharObj(this, objId);
            parent.layer.draw();
        });
        scale.on('dragend', function () { parent.startDrag(objId); });
        group.on('click touchstart', function () { parent.onObjectClick(this); })
        group.add(clothes);
        group.add(head);
        group.add(box);
        group.add(close);
        group.add(scale);
        this.layer.add(group);
        this.layer.draw();

        this.ctrlObjId = objId;
    },

    changeHead: function (headPath) {
        var newHead = new Image();

        var parent = this;
        newHead.onload = function () {
            var obj = parent.layer.findOne('#' + parent.ctrlObjId);
            var head = obj.findOne('.head');
            var newHeadObj = new Konva.Image(
            {
                x: 0,
                y: 0,
                image: newHead,
                width: head.width(),
                height: head.height(),
                name: 'head'
            });
            head.destroy();

            obj.add(newHeadObj);
            parent.layer.draw();
        }
        newHead.src = headPath;
    },

    changeClothes: function (clothesPath) {
        var newClothes = new Image();

        var parent = this;
        newClothes.onload = function () {
            var obj = parent.layer.findOne('#' + parent.ctrlObjId);
            var clothes = obj.findOne('.clothes')
            var newClothesObj = new Konva.Image(
            {
                x: 0,
                y: 0,
                image: newClothes,
                width: clothes.width(),
                height: clothes.height(),
                name: 'clothes'
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

    getCharCloseBtn:function(groupW, boxW){
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
                
                if (pos.x - objPos.x < this.width() || (objPos.y + obj.height()) - newY <this.height())
                {
                    pos = oldPos;
                }
                else
                {
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

    getCharScaleBtn : function(obj, box, groupW, boxW)
    {
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
                
                if (pos.x - objPos.x < this.width() || (objPos.y + box.height()) - newY <this.height())
                {
                    pos = oldPos;
                }
                else
                {
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

    onObjectClick: function (obj) {
        if (!obj.draggable()) {
            this.disableAllCtrl();
            this.setCtrl(obj, true);
            obj.moveToTop();

        }
    },

    removeObj: function (objId) {
        var group = this.layer.find('#' + objId);
        group.destroy();
        this.layer.draw();
    },

    stopDrag: function (objId) {
        var group = this.layer.findOne('#' + objId);
        group.draggable(false);
    },

    startDrag: function (objId) {
        var group = this.layer.findOne('#' + objId);
        group.draggable(true);
    },

    scaleObj: function (anchor, objId) {
        var group = this.layer.findOne('#' + objId);
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

    scaleCharObj: function (anchor, objId) {
        var group = this.layer.findOne('#' + objId);
        var head = group.findOne('.head');
        var clothes = group.findOne('.clothes');
        var rect = group.findOne('.rect');
        var pAnchor = anchor.getAbsolutePosition();
        pAnchor.x += anchor.width() * 0.5;
        pAnchor.y += anchor.height() * 0.5;

        pOldAnchor = rect.getAbsolutePosition();
        pOldAnchor.x += rect.width();
        diffX = (pAnchor.x - pOldAnchor.x);
        diffY = (pAnchor.y - pOldAnchor.y) * -1;
        
        var pImage = clothes.getAbsolutePosition();

        var newW = clothes.width() + (diffX);
        var newH = clothes.height() + diffY;

        head.width(newW);
        head.height(newH);
        clothes.width(newW);
        clothes.height(newH);
        rect.width(rect.width() + diffX);
        rect.height(rect.height() + diffY);
        rect.position({ x: (newW - rect.width()) * 0.5, y:0})
        group.position({ x: pImage.x - diffX * 0.5, y: pImage.y - diffY });
        group.width(newW);
        group.height(newH);
    },

    setCtrl: function (obj, isEnable) {
        var rect = obj.findOne('.rect');
        var close = obj.findOne('.close');
        var scale = obj.findOne('.scale');

        if (isEnable) {
            rect.show();
            close.show();
            scale.show();
            obj.draggable(true);
        }
        else {
            rect.hide();
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
    },

}