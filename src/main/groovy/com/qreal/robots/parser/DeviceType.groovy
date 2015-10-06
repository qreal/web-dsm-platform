package com.qreal.robots.parser

import groovy.transform.EqualsAndHashCode

/**
 * Created by dageev on 03.04.15.
 */
@EqualsAndHashCode(includeFields = true)
class DeviceType {
    String name
    Map<String, String> properties

    public DeviceType(String name, Map<String, String> properties) {
        this.name = name
        this.properties = properties
    }

    void addProperty(String key, String value) {
        properties.put(key, value)
    }

    String getProperty(String key) {
        return properties.get(key)
    }

    String addProperties(Map properties) {
        this.properties.putAll(properties)
    }
}
