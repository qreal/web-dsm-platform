class SensorsConfiguration extends DevicesConfigurationProvider {
    private robotModel: RobotModel;
    private robotModelName: string;

    constructor(robotModel: RobotModel) {
        super();
        this.robotModel = robotModel;
        this.robotModelName = robotModel.info().getName();
    }

    private isSensorHaveView(sensorType: DeviceInfo): boolean {
        return sensorType.isA(TouchSensor)
            || sensorType.isA(ColorSensor)
            || sensorType.isA(LightSensor)
            || sensorType.isA(RangeSensor)
            || sensorType.isA(VectorSensor);
    }

    addSensor(portName: string, sensorType: DeviceInfo): void {
        if (this.getCurrentConfiguration(this.robotModelName, portName)) {
            this.removeSensor(portName);
        }
        this.deviceConfigurationChanged(this.robotModel.info().getName(), portName, sensorType);
        if (this.isSensorHaveView(sensorType)) {
            this.robotModel.addSensorItem(portName, sensorType);
        }
    }

    removeSensor(portName: string): void {
        var sensor = this.getCurrentConfiguration(this.robotModelName, portName);
        if (sensor) {
            if (this.isSensorHaveView(sensor)) {
                this.robotModel.removeSensorItem(portName);
            }
            this.deviceConfigurationChanged(this.robotModelName, portName, null);
        }
    }
}