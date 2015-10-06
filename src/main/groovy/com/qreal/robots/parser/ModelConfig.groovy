package com.qreal.robots.parser

import groovy.xml.MarkupBuilder

/**
 * Created by dageev on 26.03.15.
 */

class ModelConfig {
    Map<String, String> devicePorts
    Map<String, Map<String, String>> typeProperties;

    def ModelConfig(Map<String, String> devicePorts) {
        this.devicePorts = devicePorts
    }

    def ModelConfig(Map<String, String> devicePorts, List<Map<String, String>> typeProperties) {
        this.devicePorts = devicePorts
        this.typeProperties = getTypePropertiesMap(typeProperties)
    }

    Map<String, Map<String, String>> getTypePropertiesMap(List<Map<String, String>> mapList) {
        Map<String, Map<String, String>> typeProperties = new HashMap<>();
        mapList.each { map ->
            String type = map.type
            Map<String, String> newMap = [:]
            newMap.putAll(map)
            newMap.remove("type")
            typeProperties.put(type, newMap)
        }
        return typeProperties
    }

    def getDeviceName(String portName) {
        return devicePorts.get(portName)
    }

    String convertToXml() {
        def sw = new StringWriter()
        MarkupBuilder builder = new MarkupBuilder(sw)
        builder.config {
            "initScript"()
            devicePorts.each { key, value ->
                "$key" {
                    "$value"(typeProperties.get(value))
                }
            }
        }
        return sw.toString()
    }
}
