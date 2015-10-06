class SwitchBlock extends Block {

    static run(node, graph, nodesMap, linksMap, env, timeline): string {

        var output = "Switch\n";
        var nodeId = InterpretManager.getIdByNode(node, nodesMap);
        var links = InterpretManager.getOutboundLinks(graph, nodeId);
        var condition : string = SwitchBlock.getCondition(node);
        var parser = new Parser(condition, env);
        parser.parseExpression();
        var parseResult : string = parser.result.toString();
        var isFound : boolean = false;
        var nextNode;
        var otherwiseNode;
        for (var i = 0; i < links.length; i++) {
            var link = links[i];
            var messageOnLink = SwitchBlock.getGuard(linksMap[link.id]);
            if (messageOnLink === parseResult) {
                isFound = true;
                nextNode = nodesMap[link.get('target').id];
                break;
            }
            if (messageOnLink === "false") {
                otherwiseNode = nodesMap[link.get('target').id];
            }
        }
        output += Factory.run(nextNode, graph, nodesMap, linksMap, env, timeline) + "\n";
        return output;
    }

    private static getCondition(node) : string {
        var condition : string = "";
        var properties = node.getProperties();
        for (var property in properties) {
            if (property == "Condition") {
                condition = properties[property].value;
            }
        }
        return condition;
    }

    private static getGuard(link : Link) : string {
        var guard : string = "";
        var properties = link.getProperties();
        for (var property in properties) {
            if (property == "Guard") {
                guard = properties[property].value;
            }
        }
        return guard;
    }
}