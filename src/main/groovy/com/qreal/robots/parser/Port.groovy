package com.qreal.robots.parser

import groovy.transform.TupleConstructor

/**
 * Created by dageev on 28.03.15.
 */

@TupleConstructor
class Port {
    List<Device> devices
    String name

    public getDevices() {
        return this.devices
    }
}
