package com.qreal.robots.parser

import groovy.transform.TupleConstructor

/**
 * Created by dageev on 26.03.15.
 */
@TupleConstructor
class SystemConfig {
    List<Device> devices
    List<Port> ports

}
