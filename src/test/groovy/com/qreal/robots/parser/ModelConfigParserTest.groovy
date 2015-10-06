package com.qreal.robots.parser

/**
 * Created by dageev on 26.03.15.
 */
class ModelConfigParserTest extends GroovyTestCase {
    void testParse() {
        def xml = this.getClass().getResource('/model-config.xml').text
        ModelConfigParser modelConfigParser = new ModelConfigParser()
        def devicePorts = modelConfigParser.parse(xml).devicePorts

        assert devicePorts.size() == 25
        assert devicePorts.get("C1") == "angularServomotor"
        assert devicePorts.get("B1") == "encoder95"
    }


}
