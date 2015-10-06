// algoritm to get a key

declare function ContextMenu() : void;

class StandardsCustomEvent {
    static get(eventType: string, data: {}) {
        var customEvent = <any>CustomEvent;
        var event = new customEvent(eventType, data);
        return <CustomEvent> event;
    }
}
        
class KeyGiver {

    private list: utils.PairArray = [];
    private contextMenu;
    private contextMenuX: number;
    private contextMenuY: number;
    private prevKey: number;
    private controller: DiagramController;
    private gestureMatrixSize = 9;

    private width: number;
    private height: number;

    private gestures: Gesture[];

    constructor(newController: DiagramController) {
        this.controller = newController;
        this.contextMenu = new ContextMenu();
        this.gestures = this.controller.getGestureData();
        this.list = this.controller.getGestureList();
        if (this.list.length === 0)
            this.list[0] = new utils.Pair(0, 0);
        var minX = this.list[0].first;
        var minY = this.list[0].second;
        for (var i = 1; i < this.list.length; i++) {
            if (this.list[i].first < minX)
                minX = this.list[i].first;
            if (this.list[i].second < minY)
                minY = this.list[i].second;
        }
        this.width = 0;
        this.height = 0;
        for (var i = 0; i < this.list.length; i++) {
            this.list[i].first -= minX;
            this.list[i].second -= minY;
            if (this.list[i].first + 1 > this.width)
                this.width = this.list[i].first + 1;
            if (this.list[i].second + 1 > this.height)
                this.height = this.list[i].second + 1;
        }
        var maxX = 0;
        var maxY = 0;
        if (this.width > this.height) {
            maxY = this.gestureMatrixSize - 1;
            var ratio = this.gestureMatrixSize / this.height;
            for (var i = 0; i < this.list.length; i++) {
                this.list[i].first *= ratio;
                this.list[i].second *= ratio;
                if (this.list[i].first > maxX)
                    maxX = this.list[i].first;
            }
        } else {
            maxX = this.gestureMatrixSize - 1;
            var ratio = this.gestureMatrixSize / this.width;
            for (var i = 0; i < this.list.length; i++) {
                this.list[i].first *= ratio;
                this.list[i].second *= ratio;
                if (this.list[i].second > maxY)
                    maxY = this.list[i].second;
            }
        }
        this.width = maxX + 1;
        this.height = maxY + 1;
        this.contextMenuX = this.controller.getMouseupEvent().x;
        this.contextMenuY = this.controller.getMouseupEvent().y;
    }

    private getSymbol(pair: utils.Pair) {
        var columnNames = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I'];
        return columnNames[Math.floor(pair.first * this.gestureMatrixSize / this.width)] + (Math.floor(pair.second * this.gestureMatrixSize / this.height));
    }

    public makeKey() {
        var key = [];
        var index = 0;
        var firstCell = this.getSymbol(this.list[0]);
        key[index] = firstCell;
        index++;
        for (var i = 1; i < this.list.length; i++) {
            var secondCell = this.getSymbol(this.list[i]);
            if (secondCell != firstCell) {
                firstCell = secondCell;
                key[index] = firstCell;
                index++;
            }
        }
        key.sort();
        for (var i = key.length - 2; i >= 0; i--) {
            if (key[i] === key[i + 1])
                key.splice(i, 1);
        }
        return key;
    }

    public isGesture() {
        var key = this.makeKey();
        for (var i = 0; i < this.gestures.length; i++) {
            var curr = this.gestures[i];
            this.prevKey = i - 1;
            var curRes = this.gestureDistance(this.gestures[i].key, key) / Math.min(this.gestures[i].key.length, key.length);

            while (this.prevKey >= 0
            && this.gestureDistance(this.gestures[this.prevKey].key, key) / Math.min(this.gestures[this.prevKey].key.length, key.length) > curRes) {
                this.gestures[this.prevKey + 1] = this.gestures[this.prevKey];
                this.gestures[this.prevKey] = curr;
                this.prevKey--;
            }
        }
        this.prevKey = 0;
        while (this.prevKey < this.gestures.length)
        {
            var factor = this.gestureDistance(this.gestures[this.prevKey].key, key) / Math.min(this.gestures[this.prevKey].key.length, key.length);
            if (factor > this.gestures[this.prevKey].factor)
                break;
            this.prevKey++;
        }

        if (this.prevKey === 0)
            return;

        var names = new Array();
        for (var i = 0; i < this.prevKey; ++i)
            names[i] = this.gestures[i].name;

        if (this.prevKey === 1) {
            this.controller.createNode(names[0], this.controller.getMouseupEvent().x, this.controller.getMouseupEvent().y);
            return;
        }

        var getItems = function() {
            var items = new Array();
            var tempController = this.controller;
            for (var i = 0; i < this.prevKey; ++i) {
                items.push({"name": names[i],
                            "action": function(text) {
                                tempController.createNode(text, tempController.getMouseupEvent().x, tempController.getMouseupEvent().y); }.bind(null, names[i])
                });
            }
            return items;
        }

        var contextMenuEvent = StandardsCustomEvent.get("myevent", {
            detail: {
                message: "Hello World!",
                time: new Date(),
            },
            bubbles: true,
            cancelable: true
        });

        function showContextMenu(keyGiver, e) {
            e.preventDefault();
            var menuDiv = document.createElement("div");
            menuDiv.style.left = keyGiver.contextMenuX + "px";
            menuDiv.style.top = keyGiver.contextMenuY + "px";
            menuDiv.style.width = "320px";
            menuDiv.style.height = "240px";
            menuDiv.style.position = "absolute";
            menuDiv.style["z-index"] = 100;
            document.body.appendChild(menuDiv);
            keyGiver.contextMenu.showMenu("myevent", menuDiv, getItems.bind(keyGiver)());
        }
        var diagramPaper = document.getElementById('diagram_paper');
        var bindContextMenu = showContextMenu.bind(null, this);
        diagramPaper.addEventListener("myevent", bindContextMenu, false);
        diagramPaper.setAttribute("oncontextmenu", "javascript: context_menu.showMenu('myevent', this, getItems());");
        diagramPaper.dispatchEvent(contextMenuEvent);
        diagramPaper.removeEventListener("myevent", bindContextMenu, false);
    }

    // Calculate  distance between gestures s1 and s2
    private gestureDistance(s1, s2) {
        var ans = 0;

        for (var i = 0; i < s1.length; i++) {
            var minDist = 1000;
            for (var j = 0; j < s2.length; j++) {
                var d1 = Math.abs(s1[i].charCodeAt(0) - s2[j].charCodeAt(0));
                var d2 = Math.abs(s1[i][1] - s2[j][1]);
                if (d1 + d2 < minDist)
                    minDist = d1 + d2;
            }
            ans += minDist;
        }

        for (var i = 0; i < s2.length; i++) {
            var minDist = 1000;
            for (var j = 0; j < s1.length; j++) {
                var d1 = Math.abs(s2[i].charCodeAt(0) - s1[j].charCodeAt(0));
                var d2 = Math.abs(s2[i][1] - s1[j][1]);
                if (d1 + d2 < minDist)
                    minDist = d1 + d2;
            }
            ans += minDist;
        }
        return ans / 2;
    }
}
