package com.qreal.robots.parser

import groovy.transform.TupleConstructor

/**
 * Created by dageev on 29.03.15.
 */
@TupleConstructor
class ModelConfigValidator {

    SystemConfig systemConfig

    public ModelConfigValidator(SystemConfig systemConfig) {
        this.systemConfig = systemConfig;
    }

    ValidationResult validate(ModelConfig modelConfig) {
        ValidationResult validationResult = new ValidationResult(errors: [])
        modelConfig.devicePorts.each { key, value ->
            systemConfig.devices.each { device ->
                if (device.name == value && device.types.size() > 0) {
                    validationResult.addError("Unable to set $device.name to port $key, when it has deviceTypes")
                }
            }

        }
        return validationResult;

    }
}
