interface RobotModelInterface {
    getAvailablePorts(): PortInfo[];
    getConfigurablePorts(): PortInfo[];
    getAllowedDevices(port: PortInfo): DeviceInfo[];
}