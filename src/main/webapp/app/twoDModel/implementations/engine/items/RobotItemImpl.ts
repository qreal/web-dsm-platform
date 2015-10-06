class RobotItemImpl implements RobotItem {

    private worldModel: WorldModel;
    private robot: RobotModel;
    private startPosition: TwoDPosition;
    private startCenter: TwoDPosition = new TwoDPosition();
    private center: TwoDPosition = new TwoDPosition();
    private currentStartPosition : TwoDPosition = new TwoDPosition();
    private image;
    private rotateHandle: RaphaelElement;
    private width: number = 50;
    private height: number = 50;
    private angle: number;
    private lastDx: number;
    private lastDy: number;
    private previousAngle : number;
    private sensors: {string?: SensorItem} = {};
    private draftsman : DrawingItemImpl;

    constructor(worldModel: WorldModel, position: TwoDPosition, imageFileName: string, robot: RobotModel) {
        this.worldModel = worldModel;
        this.robot = robot;
        this.startPosition = position;
        this.currentStartPosition = this.startPosition;
        this.angle = 0;
        var paper = worldModel.getPaper();
        this.image = paper.image(imageFileName, position.x, position.y, this.width, this.height);
        this.center = new TwoDPosition(position.x + this.width / 2, position.y + this.width / 2);
        this.startCenter = new TwoDPosition(this.center.x, this.center.y);
        this.draftsman = new DrawingItemImpl(worldModel, this);
        var handleRadius: number = 10;

        var handleAttrs = {
            fill: "#fff",
            "fill-opacity": 0,
            cursor: "pointer",
            "stroke-width": 1,
            stroke: "black"
        };

        this.rotateHandle = paper.circle(position.x + this.width + 20,
                position.y + this.height / 2, handleRadius).attr(handleAttrs);

        var robotItem = this;

        var startHandle = function () {

                this.rotation = robotItem.angle;
                this.cx = this.attr("cx");
                this.cy = this.attr("cy");

                // lastDx and lastDy - delta on the previous moment
                this.lastDx = 0;
                this.lastDy = 0;

                if (!worldModel.getDrawMode()) {
                    robotItem.updateSensorsTransformations();
                }
                return this;
            },
            moveHandle = function (dx, dy) {
                if (!worldModel.getDrawMode()) {

                    var newDx : number = dx - this.lastDx;
                    var newDy : number = dy - this.lastDy;

                    this.lastDx = dx;
                    this.lastDy = dy;

                    var newX : number = this.cx + newDx;
                    var newY : number = this.cy + newDy;

                    var offsetX : number = newX - robotItem.center.x;
                    var offsetY : number = newY - robotItem.center.y;
                    var tan : number = offsetY / offsetX;
                    var angle : number = Math.atan(tan) / (Math.PI / 180);
                    if (offsetX < 0) {
                        angle += 180;
                    }

                    var diffAngle : number = angle - robotItem.angle;

                    robotItem.image.transform("R" + angle + "," + robotItem.center.x + "," + robotItem.center.y);
                    robotItem.transformSensorsItems("R" + diffAngle + "," + robotItem.center.x + "," + robotItem.center.y);

                    robotItem.rotateCircle(diffAngle);
                    this.cx = this.attr("cx");
                    this.cy = this.attr("cy");
                    robotItem.angle = angle;

                }
                return this;
            },
            upHandle = function () {

                this.lastDx = 0;
                this.lastDy = 0;

                robotItem.image.transform("");
                robotItem.image.attr({"x" : robotItem.center.x - robotItem.height / 2,
                                            "y" : robotItem.center.y - robotItem.width / 2});

                robotItem.image.transform("R" + robotItem.angle);

                if (!worldModel.getDrawMode()) {

                    robotItem.updateSensorsTransformations();
                }
                return this;
            };

        robotItem.rotateHandle.drag(moveHandle, startHandle, upHandle);

        var start = function () {

                this.lastDx = 0;
                this.lastDy = 0;
                if (!worldModel.getDrawMode()) {
                    robotItem.updateSensorsTransformations();
                    this.handleCx = robotItem.rotateHandle.attr("cx");
                    this.handleCy = robotItem.rotateHandle.attr("cy");
                    worldModel.setCurrentElement(robotItem);
                }
                return this;
            }
            ,move = function (dx, dy) {
                var newDx = dx - this.lastDx;
                var newDy = dy - this.lastDy;
                if (!worldModel.getDrawMode()) {
                    robotItem.image.transform("R" + robotItem.angle + "," + robotItem.center.x + ","
                                                + robotItem.center.y + "T" + dx + "," + dy);

                    robotItem.transformSensorsItems("T" + newDx + "," + newDy);
                    this.lastDx = dx;
                    this.lastDy = dy;

                    robotItem.rotateHandle.attr({"cx": this.handleCx + dx, "cy": this.handleCy + dy});
                }
                return this;
            }
            ,up = function () {
                if (!worldModel.getDrawMode()) {
                    robotItem.center.x += this.lastDx;
                    robotItem.center.y += this.lastDy;

                    robotItem.image.transform("");
                    robotItem.image.attr({"x" : robotItem.center.x - robotItem.height / 2,
                                            "y" : robotItem.center.y - robotItem.width / 2});

                    robotItem.image.transform("R" + robotItem.angle + "," + robotItem.image.x + "," + robotItem.image.y);

                    robotItem.updateSensorsTransformations();
                }
                return this;
            };

        this.image.drag(move, start, up);
        this.hideHandles();
    }

    /**
     *
     * @returns {RaphaelElement} - pointer to rotate Handle (circle)
     */
    getRotateHandle(): RaphaelElement {
        return this.rotateHandle;
    }

    /**
     * Redraw robot Item and his sensors on the WoldModel's paper
     */
    redraw(): void {

        var diffX = this.center.x - this.startCenter.x;
        var diffY = this.center.y - this.startCenter.y;
        var robotItem = this;
        robotItem.image.transform("");
        robotItem.image.attr({"x" : robotItem.center.x - robotItem.height / 2, "y" : robotItem.center.y - robotItem.width / 2});

        // Change the rotateHandle's position to a new center!

        var oldX = robotItem.rotateHandle.attr("cx");
        var oldY = robotItem.rotateHandle.attr("cy");
        robotItem.rotateHandle.attr({cx : oldX + diffX, cy : oldY + diffY});

        var diffAngle : number = this.angle - this.previousAngle
        this.rotateCircle(diffAngle);

        var toDraftsPosition = Utils.rotateVector(-this.getWidth() / 2 - 3, 0, this.angle);
        this.draftsman.setPosition(this.center.x + toDraftsPosition.x, this.center.y + toDraftsPosition.y);
        this.draftsman.drawLine();

        robotItem.image.transform("R" + robotItem.angle);
        robotItem.transformSensorsItems("T" + diffX + "," + diffY);
        robotItem.transformSensorsItems("R" + diffAngle +"," + this.center.x + "," + this.center.y);
    }

    /**
     * Returns the value of the rotation
     * @returns {number} - current value in degrees
     */
    public getAngle() : number {
        return this.angle;
    }

    /**
     * Rotate the rotateHandle by angle degrees relative to the center of the machine
     * @param angle
     */
    private rotateCircle(angle : number) : void {
        var cX = this.rotateHandle.attr("cx");
        var cY = this.rotateHandle.attr("cy");
        var diffX = cX - this.center.x;
        var diffY = cY - this.center.y;
        var newDiff : TwoDPosition = Utils.rotateVector(diffX, diffY, angle);
        this.rotateHandle.attr({cx : this.center.x + newDiff.x, cy : this.center.y + newDiff.y});
    }

    /**
     * Save the previous position and angle in stratCenter and previousAngle
     * @param position - new position for robot
     * @param angle - new angle for robot
     */
    updateRobotLocation(position: TwoDPosition, angle): void {
        this.startCenter = new TwoDPosition(this.center.x, this.center.y);
        this.previousAngle = this.angle;
        this.center.x = position.x;
        this.center.y = position.y;
        this.angle = angle;
    }


    hideHandles(): void {
        this.rotateHandle.hide();
    }

    showHandles(): void {
        this.rotateHandle.toFront();
        this.rotateHandle.show();
    }

    getCenterPosition() : TwoDPosition {
        return this.center;
    }

    getWidth(): number {
        return this.width;
    }

    getHeight(): number {
        return this.height;
    }

    getCurrentCenter() : TwoDPosition {
        return new TwoDPosition(this.center.x, this.center.y);
    }

    getStartPosition(): TwoDPosition {
        return this.startPosition;
    }

    getWorldModel() : WorldModel {
       return this.worldModel;
    }

    /**
     * Remove sensor with name as portName from observed sensors
     * @param portName
     */
    removeSensorItem(portName: string): void {
        var sensor = this.sensors[portName];
        if (sensor) {
            sensor.remove();
            delete this.sensors[portName];
        }
    }

    /**
     * Change drawingState to new value
     * @param newState
     */
    setDrawingState(newState : boolean) : void {
        this.draftsman.setDrawingState(newState);
    }


    /**
     * Add new sensor with name as portName to observing sensors
     * @param portName
     * @param sensorType
     * @param pathToImage
     */
    addSensorItem(portName: string, sensorType: DeviceInfo, pathToImage: string): void {
        var sensor: SensorItem;
        if (sensorType.isA(RangeSensor)) {
            sensor = new SonarSensorItem(this, this.worldModel, sensorType, pathToImage);
        } else {
            sensor = new SensorItem(this, this.worldModel, sensorType, pathToImage);
        }
        this.sensors[portName] = sensor;
    }

    /**
     * Notify all sensors update their current positions
     */
    private updateSensorsTransformations(): void {
        for(var portName in this.sensors) {
            var sensor = this.sensors[portName];
            sensor.updatePosition();
        }
    }

    /**
     * Applied transformation for all sensors
     * @param transformationString
     * IMPORTANT -- only either "T x,y" or "R angle,x,y"
     */
    private transformSensorsItems(transformationString: string): void {
        for(var portName in this.sensors) {
            var sensor = this.sensors[portName];
            sensor.transform(transformationString);
        }
    }
}