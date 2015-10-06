class WallItemImpl implements WallItem {
    private path: RaphaelPath;
    private handleStart: RaphaelElement;
    private handleEnd: RaphaelElement;
    private pathArray;
    private width;

    constructor(worldModel: WorldModel, xStart: number, yStart: number, xEnd: number, yEnd: number) {
        var paper = worldModel.getPaper();
        var wall = this;
        this.width = 15;
        this.path = paper.path("M" + xStart + " " + yStart + " L" + xEnd + " " + yEnd);
        this.path.toBack();

        this.path.attr({
            cursor: "pointer",
            "stroke-width": wall.width
        });

        $(this.path.node).attr("class", "path");
        $(".path").attr("stroke", "url(#wall_pattern)");
        this.pathArray = this.path.attr("path");

        var handleRadius: number = 10;

        var handleAttrs = {
            fill: "#fff",
            "fill-opacity": 0,
            cursor: "pointer",
            "stroke-width": 1,
            stroke: "black"
        };

        this.handleStart = paper.circle(xStart, yStart, handleRadius).attr(handleAttrs);
        this.handleEnd = paper.circle(xEnd, yEnd, handleRadius).attr(handleAttrs);

        var start = function () {
                if (!worldModel.getDrawMode()) {
                    this.cx = this.attr("cx");
                    this.cy = this.attr("cy");
                }
                return this;
            },
            moveStart = function (dx, dy) {
                if (!worldModel.getDrawMode()) {
                    var newX = this.cx + dx;
                    var newY = this.cy + dy;
                    wall.updateStart(newX, newY)
                }
                return this;
            },
            moveEnd = function (dx, dy) {
                if (!worldModel.getDrawMode()) {
                    var newX = this.cx + dx;
                    var newY = this.cy + dy;
                    wall.updateEnd(newX, newY);
                }
                return this;
            },
            up = function () {
                return this;
            };

        wall.handleStart.drag(moveStart, start, up);
        wall.handleEnd.drag(moveEnd, start, up);


        var startPath = function () {
                if (!worldModel.getDrawMode()) {
                    this.startX = wall.pathArray[0][1];
                    this.startY = wall.pathArray[0][2];
                    this.endX = wall.pathArray[1][1];
                    this.endY = wall.pathArray[1][2];
                    this.ox = this.attr("x");
                    this.oy = this.attr("y");
                    worldModel.setCurrentElement(wall);
                }
                return this;
            },
            movePath = function (dx, dy) {
                if (!worldModel.getDrawMode()) {
                    var trans_x = dx - this.ox;
                    var trans_y = dy - this.oy;

                    wall.pathArray[0][1] = this.startX + dx;
                    wall.pathArray[0][2] = this.startY + dy;
                    wall.pathArray[1][1] = this.endX + dx;
                    wall.pathArray[1][2] = this.endY + dy;
                    wall.path.attr({path: wall.pathArray});

                    this.ox = dx;
                    this.oy = dy;

                    var hStartX = wall.handleStart.attr("cx") + trans_x;
                    var hStartY = wall.handleStart.attr("cy") + trans_y;
                    var hEndX = wall.handleEnd.attr("cx") + trans_x;
                    var hEndY = wall.handleEnd.attr("cy") + trans_y;

                    wall.handleStart.attr({cx: hStartX, cy: hStartY});
                    wall.handleEnd.attr({cx: hEndX, cy: hEndY});
                }
                return this;
            },
            upPath = function () {
                return this;
            };

        wall.path.drag(movePath, startPath, upPath);
    }

    getPath(): RaphaelPath {
        return this.path;
    }

    updateStart(x: number, y: number): void {
        this.pathArray[0][1] = x;
        this.pathArray[0][2] = y;
        this.path.attr({path: this.pathArray});
        this.handleStart.attr({cx: x, cy: y});
    }

    updateEnd(x: number, y: number): void {
        this.pathArray[1][1] = x;
        this.pathArray[1][2] = y;
        this.path.attr({path: this.pathArray});
        this.handleEnd.attr({cx: x, cy: y});
    }

    hideHandles(): void {
        this.handleStart.hide();
        this.handleEnd.hide();
    }

    showHandles(): void {
        this.handleStart.show();
        this.handleEnd.show();
    }

    remove(): void {
        this.handleStart.remove();
        this.handleEnd.remove();
        this.path.remove();
    }
}