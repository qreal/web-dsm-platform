class Timer extends Block {
    static run(node, graph, nodesMap, linksMap, env, timeline):string {
        var output = "Timer" + "\n";
        var delay = 0;
        var nodeId = InterpretManager.getIdByNode(node, nodesMap);
        var links = InterpretManager.getOutboundLinks(graph, nodeId);

        var properties = node.getProperties();
        for (var p in properties) {
            if (p == "Delay (ms)") {
                var parser = new Parser(properties[p].value, env);
                parser.parseExpression();
                if (parser.error == null) {
                    delay = parser.result;
                    if (delay < 0) {
                        output += "Error: incorrect delay value";
                    }
                    else {
                        output += "Delay: " + delay + "\n";

                        if (links.length == 1) {
                            var nextNode = nodesMap[links[0].get('target').id];
                            setTimeout(function () { output += Factory.run(nextNode, graph, nodesMap, linksMap, env, timeline); }, delay);
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
