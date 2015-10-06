interface RobotModel {
    info(): TwoDRobotModel;
    recalculateParams(): void;
    nextFragment(): void;
    removeSensorItem(portName: string): void;
    addSensorItem(portName: string, deviceType: DeviceInfo): void;
    getSensorsConfiguration(): SensorsConfiguration;
    setAngle(angle: number): void;
    getAngle(): number;
    setPosition(position: TwoDPosition): void;
    setDrawingState(newState : boolean): void;
}