class Motors extends Block {
    static run(node, graph, nodesMap, linksMap, forward, env, timeline): string {
        var output = "Motors forward/backward" + "\n";
        var ports = [];
        var power = 0;
        var nodeId = InterpretManager.getIdByNode(node, nodesMap);
        var links = InterpretManager.getOutboundLinks(graph, nodeId);

        var properties = node.getProperties();
        for (var p in properties) {
            if (p == "Ports") {
                ports = properties[p].value.replace(/ /g,'').split(",");
            }
            if (p == "Power (%)") {
                var parser = new Parser(properties[p].value, env);
                parser.parseExpression();
                var models = timeline.getRobotModels();
                var model = models[0];
                if (parser.error == null) {
                    power = parser.result;
                    if (power < 0 || power > 100) {
                        output += "Error: incorrect power value";
                    }
                    else {
                        output += "Ports: " + ports + "\n" + "Power: " + power + "\n";

                        power = (forward) ? power : -power;
                        if (ports.length == 1) {
                            if (ports[0] == "M3") {
                                model.setMotor1(power);
                            }
                            else if (ports[0] == "M4") {
                                model.setMotor2(power);
                            }
                            else {
                                output += "Error: Incorrect port name";
                            }
                        }
                        else if (ports.length == 2) {
                            if (ports[0] == "M3" && ports[1] == "M4" || ports[0] == "M4" && ports[1] == "M3") {

                                model.setMotor1(power);
                                model.setMotor2(power);
                            }
                            else {
                                output += "Error: Incorrect port names";
                            }
                        }
                        else {
                            output += "Error: Incorrect number of ports";
                        }

                        if (links.length == 1) {
                            var nextNode = nodesMap[links[0].get('target').id];
                            output += Factory.run(nextNode, graph, nodesMap, linksMap, env, timeline);
                        }
                        else if (links.length > 1) {
                            output += "Error: too many links\n";
                        }
                    }
                }
                else {
                    output += "Error: " + parser.error + "\n";
                }
            }
        }

        return output;
    }
}