interface RobotItem extends AbstractItem {
    redraw(): void;
    updateRobotLocation(position: TwoDPosition, angle: number): void;
    getWidth(): number;
    getHeight(): number;
    getStartPosition(): TwoDPosition;
    getCurrentCenter() : TwoDPosition;
    getAngle() : number;
    removeSensorItem(portName: string): void;
    addSensorItem(portName: string, deviceType: DeviceInfo, pathToImage: string): void;
    getRotateHandle() : RaphaelElement;
    getCenterPosition() : TwoDPosition;
    getWorldModel() : WorldModel;
    setDrawingState(newState : boolean) : void;
}