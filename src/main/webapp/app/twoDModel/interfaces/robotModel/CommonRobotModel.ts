interface CommonRobotModel extends RobotModelInterface {
    addAllowedConnection(port: PortInfo, devices: DeviceInfo[]);
}