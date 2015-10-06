package com.qreal.robots.parser

/**
 * Created by dageev on 26.03.15.
 */
class SystemConfigParser {

    List<String> unsupportedAttributes = ["class", "type"]

    SystemConfig parse(String systemConfigXml) {
        List<Device> deviceClassesList = []
        List<Port> ports = []
        Set<String> portsString = new LinkedHashSet<>();

        def systemConfig = new XmlParser().parseText(systemConfigXml)

        def deviceClasses = systemConfig.deviceClasses
        assert deviceClasses.size() == 1
        deviceClasses[0].children().each {
            deviceClassesList.add(new Device(it.name()))
        }


        def devicePorts = systemConfig.devicePorts
        assert devicePorts.size() == 1
        deviceClassesList.each { device ->
            devicePorts[0].each { port ->
                if (device.name == port.name()) {
                    device.availablePorts.add(port.@port)
                }
            }

        }

        devicePorts[0].each { device ->
            if (!portsString.contains(device.@port)) {
                def deviceClass = getDevice(deviceClassesList, device.name())
                ports.add(new Port(name: device.@port, devices: [deviceClass]))
                portsString.add(device.@port)

            } else {
                Port port = getPort(ports, device.@port)
                def deviceClass = getDevice(deviceClassesList, device.name())
                port.devices.add(deviceClass)
            }
        }

        def deviceTypes = systemConfig.deviceTypes
        assert deviceTypes.size() == 1
        deviceClassesList.each { device ->
            deviceTypes[0].children().each { deviceType ->
                if (device.name == deviceType.@class) {
                    def attributes = deviceType.attributes().findAll {
                        !unsupportedAttributes.contains(it.key)
                    }
                    device.types.add(new DeviceType(deviceType.name(), attributes))
                }
            }
        }




        return new SystemConfig(devices: deviceClassesList, ports: ports)
    }


    def getPort(List<Port> ports, def portName) {
        def result
        ports.each {
            if (it.name == portName) {
                result = it
            }
        }
        return result
    }

    def getDevice(List<Device> devices, def deviceName) {
        def result
        devices.each {
            if (it.name == deviceName) {
                result = it
            }
        }
        return result
    }
}
