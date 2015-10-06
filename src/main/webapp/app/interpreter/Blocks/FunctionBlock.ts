class FunctionBlock extends Block {
    static run(node, graph, nodesMap, linksMap, env, timeline): string {
        var nodeId = InterpretManager.getIdByNode(node, nodesMap);
        var links = InterpretManager.getOutboundLinks(graph, nodeId);

        var output = "Function: ";
        var properties = node.getProperties();
        var body = "";
        var initialization = true;
        for (var p in properties) {
            if (properties.hasOwnProperty(p)) {
                if (p == "Body") {
                    body = properties[p].value;
                    output += body + "\n";
                }
                else if (p == "Initialization") {
                    initialization = properties[p].value;
                }
                else {
                    output += "Error, cannot get properties" + "\n";
                }
            }
        }

        var parser = new Parser(body, env);
        parser.parseAssignments();
        if (parser.error != null) {
            output += parser.error + "\n";
        }
        else if (links.length == 1) {
            var nextNode = nodesMap[links[0].get('target').id];
            output += Factory.run(nextNode, graph, nodesMap, linksMap, env, timeline) + "\n";
        }
        else {
            output += "Error: more than one link from Function node";
        }

        return output;
    }
}
