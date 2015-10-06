class SonarSensorItem extends SensorItem {
    private scanningRegion: RaphaelPath;
    private sonarRange = 255;
    private regionStartX: number;
    private regionStartY: number;
    private regionTransformationString = "";


    constructor(robotItem: RobotItem, worldModel: WorldModel, sensorType: DeviceInfo, pathToImage: string) {
        super(robotItem, worldModel, sensorType, pathToImage);
        this.drawRegion();
    }

    /**
     * Apply transformation to sensor
     * @param transformationString
     */
    transform(transformationString: string) {
        super.transform(transformationString);
        this.drawRegion();
    }

    /**
     * Rotates vector toRotate around center to angle degrees
     * @param toRotate
     * @param center
     * @param angle
     * @returns {TwoDPosition} new vector after rotation
     */
    private rotateVector(toRotate : TwoDPosition, center : TwoDPosition, angle : number) : TwoDPosition {
        var dx = toRotate.x - center.x;
        var dy = toRotate.y - center.y;
        var newD : TwoDPosition = Utils.rotateVector(dx, dy, angle);
        return new TwoDPosition(center.x + newD.x, center.y + newD.y);
    }

    updatePosition(): void {
        super.updatePosition();
        this.drawRegion();
    }

    /**
     * Rotate sensor by angle degree
     * @param angle
     */
    rotate(angle: number) {
        super.rotate(angle);

        var regionRotationX = this.image.matrix.x(this.regionStartX, this.regionStartY);
        var regionRotationY = this.image.matrix.y(this.regionStartX, this.regionStartY);

        this.scanningRegion.transform(this.regionTransformationString + "R" + angle + "," +
            regionRotationX + "," + regionRotationY);
    }

    /**
     * Remove sensor and all his items from paper
     */
    remove(): void {
        super.remove();
        this.scanningRegion.remove();
    }

    /**
     * Redrawing sonar way on the current moment
     */
    private drawRegion() : void {
        var worldModel : WorldModel = this.robotItem.getWorldModel();
        if (this.scanningRegion) {
            this.scanningRegion.remove();
        }
        var paper : RaphaelPaper = worldModel.getPaper();

        var angleInRad = Utils.toRadian(this.angle);
        this.regionStartX = this.center.x + (this.width) * Math.cos(angleInRad);
        this.regionStartY = this.center.y + (this.width) * Math.sin(angleInRad);

        var regAngle = 20;
        var halfRegAngleInRad = Utils.toRadian(regAngle / 2);

        var rangeInPixels = this.sonarRange * Constants.pixelsInCm;

        var regionTopX = this.regionStartX + Math.cos(halfRegAngleInRad) * rangeInPixels;
        var regionTopY = this.regionStartY - Math.sin(halfRegAngleInRad) * rangeInPixels;

        var regionBottomX = regionTopX;
        var regionBottomY = this.regionStartY + Math.sin(halfRegAngleInRad) * rangeInPixels;


        var newRegionTop : TwoDPosition = this.rotateVector(new TwoDPosition(regionTopX, regionTopY),
                                                new TwoDPosition(this.regionStartX, this.regionStartY),
                                                this.angle - regAngle / 2);

        regionTopX = newRegionTop.x;
        regionTopY = newRegionTop.y;


        var newRegionBottom : TwoDPosition = this.rotateVector(new TwoDPosition(regionBottomX, regionBottomY),
                                                new TwoDPosition(this.regionStartX, this.regionStartY),
                                                this.angle + regAngle / 2);

        regionBottomX = newRegionBottom.x;
        regionBottomY = newRegionBottom.y

        this.scanningRegion = paper.path("M" + this.regionStartX + "," + this.regionStartY +
            "L" + regionTopX + "," + regionTopY +
            "L" + regionBottomX + "," + regionBottomY + "L" + this.regionStartX + "," + this.regionStartY +
            "Z");
        this.scanningRegion.attr({fill: "#c5d0de", stroke: "#b1bbc7", opacity: 0.5});
    }

}