class SensorItem implements AbstractItem {
    protected robotItem: RobotItem;
    protected image : RaphaelElement;
    protected angle : number;
    protected width: number;
    protected height: number;
    protected transformationString = "";
    protected rotateHandle: RaphaelElement;
    protected center : TwoDPosition;
    protected start : TwoDPosition;
    protected  parentCenter : TwoDPosition;
    protected sensorType: DeviceInfo;
    protected deltaPosition: TwoDPosition;
    protected handleRadius = 10;
    protected distanceFromCarToRotateHandle : number;
    protected distanceFromSensorToRotateHandle : number;


    constructor(robotItem: RobotItem, worldModel: WorldModel, sensorType: DeviceInfo, pathToImage: string) {
        this.robotItem = robotItem;
        var paper: RaphaelPaper = worldModel.getPaper();
        this.sensorType = sensorType;
        this.defineImageSizes(sensorType);
        var defaultPosition = this.getDefaultPosition();
        this.start = defaultPosition;
        this.center = new TwoDPosition(this.start.x + this.width / 2, this.start.y + this.height / 2);
        this.parentCenter = robotItem.getCenterPosition();

        this.image = paper.image((pathToImage) ? pathToImage : this.pathToImage(), defaultPosition.x, defaultPosition.y, this.width, this.height);
        this.angle = this.robotItem.getAngle();

        this.distanceFromCarToRotateHandle = this.robotItem.getWidth() + this.width + this.width + this.handleRadius;
        this.distanceFromSensorToRotateHandle = this.distanceFromCarToRotateHandle - (this.center.x - this.parentCenter.x);

        this.image.transform("R" + this.angle + "," +  this.parentCenter.x + "," + this.parentCenter.y);
        var diffX = this.center.x - this.parentCenter.x;
        var diffY = this.center.y - this.parentCenter.y;

        var newD : TwoDPosition = Utils.rotateVector(diffX, diffY, this.angle);
        this.center.x = this.parentCenter.x + newD.x;
        this.center.y = this.parentCenter.y + newD.y;

        this.image.attr({"x" : this.center.x - this.height / 2, "y" : this.center.y - this.width / 2});
        this.image.transform("R" + this.angle);


        var handleAttrs = {
            fill: "#fff",
            "fill-opacity": 0,
            cursor: "pointer",
            "stroke-width": 1,
            stroke: "black"
        };

        var angleInRad : number = Utils.toRadian(this.angle);

        this.rotateHandle = paper.circle(this.parentCenter.x + this.distanceFromCarToRotateHandle * Math.cos(angleInRad),
               this.parentCenter.y + this.distanceFromCarToRotateHandle * Math.sin(angleInRad), this.handleRadius).attr(handleAttrs);

        var sensorItem = this;

        var startHandle = function () {

                this.rotation = sensorItem.angle;
                this.cx = this.attr("cx");
                this.cy = this.attr("cy");
                this.lastX = 0;
                this.lastY = 0;
                sensorItem.updatePosition();
                return this;
            },
            moveHandle = function (dx, dy) {

                var newDx = dx - this.lastX;
                var newDy = dy - this.lastY;

                this.lastX = dx;
                this.lastY = dy;

                var newX = this.cx + newDx;
                var newY = this.cy + newDy;


                if (!worldModel.getDrawMode()) {

                    var offsetX = newX - sensorItem.center.x;
                    var offsetY = newY - sensorItem.center.y;
                    var tan = offsetY / offsetX;
                    var angle = Math.atan(tan) / (Math.PI / 180);
                    if (offsetX < 0) {
                        angle += 180;
                    }

                    sensorItem.angle = angle;

                    sensorItem.image.transform("R" + angle);

                    var angleInRad = Utils.toRadian(angle);
                    var newCx = Math.cos(angleInRad) * (sensorItem.distanceFromSensorToRotateHandle) + sensorItem.center.x;
                    var newCy = Math.sin(angleInRad) * (sensorItem.distanceFromSensorToRotateHandle) + sensorItem.center.y;

                    this.attr({cx: newCx, cy: newCy});
                    this.cx = newCx;
                    this.cy = newCy;
                    sensorItem.updatePosition();
                }
                return this;
            },
            upHandle = function () {

                this.lastDx = 0;
                this.lastDy = 0;
                sensorItem.image.transform("");
                sensorItem.image.attr({"x" : sensorItem.center.x - sensorItem.height / 2,
                                            "y" : sensorItem.center.y - sensorItem.width / 2});
                sensorItem.image.transform("R" + sensorItem.angle);
                sensorItem.updatePosition();
                return this;
            };

        sensorItem.rotateHandle.drag(moveHandle, startHandle, upHandle);

        var start = function () {

                this.lastDx = 0;
                this.lastDy = 0;
                if (!worldModel.getDrawMode()) {
                    this.handleCx = sensorItem.rotateHandle.attr("cx");
                    this.handleCy = sensorItem.rotateHandle.attr("cy");
                    worldModel.setCurrentElement(sensorItem);
                }
                sensorItem.updatePosition();
                return this;
            }

            ,move = function (dx, dy) {

                if (!worldModel.getDrawMode()) {
                    sensorItem.image.transform("R" + sensorItem.angle + "," + sensorItem.center.x + ","
                                                            + sensorItem.center.y + "T" + dx + "," + dy);

                    this.lastDx = dx;
                    this.lastDy = dy;
                    sensorItem.rotateHandle.attr({"cx": this.handleCx + dx, "cy": this.handleCy + dy});
                }
                sensorItem.center.x += this.lastDx;
                sensorItem.center.y += this.lastDy;
                sensorItem.updatePosition();
                sensorItem.center.x -= this.lastDx;
                sensorItem.center.y -= this.lastDy;

                return this;
            }
            ,up = function () {
                if (!worldModel.getDrawMode()) {

                    sensorItem.center.x += this.lastDx;
                    sensorItem.center.y += this.lastDy;
                    sensorItem.image.transform("");
                    sensorItem.image.attr({"x" : sensorItem.center.x - sensorItem.height / 2,
                                            "y" : sensorItem.center.y - sensorItem.width / 2});

                    sensorItem.image.transform("R" + sensorItem.angle + "," + sensorItem.image.x + "," + sensorItem.image.y);

                }
                sensorItem.updatePosition();
                return this;
            };

        this.image.drag(move, start, up);
        this.hideHandles();
    }

    /**
     * Returns upper left conner of the car's model
     * @returns {TwoDPosition}
     */
    getDefaultPosition(): TwoDPosition {
        return new TwoDPosition(this.robotItem.getCenterPosition().x + this.robotItem.getWidth() + this.width / 2,
                                      this.robotItem.getCenterPosition().y - this.height / 2);
    }

    /**
     * Returns the type of the sensor
     * @returns {string}
     */
    name(): string {
        if (this.sensorType.isA(TouchSensor)) {
            return "touch";
        } else if (this.sensorType.isA(ColorSensorFull) || this.sensorType.isA(ColorSensorPassive)) {
            return "color_empty";
        } else if (this.sensorType.isA(ColorSensorRed)) {
            return "color_red";
        } else if (this.sensorType.isA(ColorSensorGreen)) {
            return "color_green";
        } else if (this.sensorType.isA(ColorSensorBlue)) {
            return "color_blue";
        } else if (this.sensorType.isA(RangeSensor)) {
            return "sonar";
        } else if (this.sensorType.isA(LightSensor)) {
            return "light";
        } else {
            alert(!"Unknown sensor type");
            return "";
        }
    }

    pathToImage(): string
    {
        return "images/2dmodel/sensors/2d_" + this.name() + ".png";
    }

    /**
     * Defines the image's size for current type of the sensor
     * @param sensorType
     */
    defineImageSizes(sensorType): void {
        if (sensorType.isA(TouchSensor)) {
            this.width = 25;
            this.height = 25;
        } else if (sensorType.isA(ColorSensor) || sensorType.isA(LightSensor)) {
            this.width = 15;
            this.height = 15;
        } else if (sensorType.isA(RangeSensor)) {
            this.width = 35;
            this.height = 35;
        } else {
            alert("Unknown sensor type");
        }
    }

    /**
     * Transform sensor and his items by transformationString
     * @param transformationString
     */
    transform(transformationString : string): void {
        var tmpPosition = this.robotItem.getCenterPosition();
        var tmp : string = "";
        for (var i = 1; i < transformationString.length; i++)
            tmp = tmp + transformationString[i];
        if (transformationString[0] === 'T') {
            var shifts : string[] = tmp.split(",");
            this.translateSensor(parseFloat(shifts[0]), parseFloat(shifts[1]));
        } else {
            var params : string[] = tmp.split(",");
            this.rotateSensor(parseFloat(params[0]), parseFloat(params[1]), parseFloat(params[2]));
        }
    }

    /**
     * Translate sensor and his items by dx,dy
     * @param dx
     * @param dy
     */
    translateSensor(dx : number, dy : number) {
        var cx = this.rotateHandle.attr("cx");
        var cy = this.rotateHandle.attr("cy");
        this.rotateHandle.attr({"cx" : cx + dx, "cy" : cy + dy});
        var sensor = this;
        sensor.center.x += dx;
        sensor.center.y += dy;
        sensor.image.transform("");
        sensor.image.attr({"x" : sensor.center.x - sensor.height / 2, "y" : sensor.center.y - sensor.width / 2});
        sensor.image.transform("R" + sensor.angle + "," + sensor.image.x + "," + sensor.image.y);
    }

    /**
     * Rotates sensor and his items around (x,y) by andle degrees
     * @param angle
     * @param x
     * @param y
     */
    rotateSensor(angle : number, x : number, y: number) {
        var previousCenter : TwoDPosition = this.center;

        var centrDx = this.center.x - x;
        var centrDy = this.center.y - y;
        var handleDx = this.rotateHandle.attr("cx") - x;
        var handleDy = this.rotateHandle.attr("cy") - y;

        var newC : TwoDPosition = Utils.rotateVector(centrDx, centrDy, angle);
        this.center.x = newC.x + x;
        this.center.y = newC.y + y;

        newC = Utils.rotateVector(handleDx, handleDy, angle);
        this.rotateHandle.attr({"cx" : x + newC.x, "cy" : y + newC.y});
        this.angle += angle;
        this.image.transform("");

        var diffX = this.center.x - previousCenter.x;
        var diffY = this.center.y - previousCenter.y;

        this.transform("T" + diffX + "," + diffY);
    }

    updatePosition(): void {
    }

    rotate(angle: number) {
        this.image.transform(this.transformationString + "R" + angle)
    }

    hideHandles(): void {
        this.rotateHandle.hide();
    }

    showHandles(): void {
        this.rotateHandle.toFront();
        this.rotateHandle.show();
    }

    remove(): void {
        this.image.remove();
        this.rotateHandle.remove();
    }

}