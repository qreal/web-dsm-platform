package com.qreal.robots.parser

import groovy.transform.EqualsAndHashCode

/**
 * Created by dageev on 26.03.15.
 */

@EqualsAndHashCode(includeFields = true)
class Device {
    String name
    Map<String, String> properties
    List<String> availablePorts
    List<DeviceType> types

    def Device(String name) {
        this.name = name
        properties = [:]
        availablePorts = []
        types = []
    }

}

