class MarkerBlock extends Block {

    static run(node, graph, nodesMap, linksMap, env, timeline, isUp : boolean): string {
        var output : string = "Marker " + ((isUp) ? "UP" : "DOWN") + "\n";

        var nodeId = InterpretManager.getIdByNode(node, nodesMap);
        var links = InterpretManager.getOutboundLinks(graph, nodeId);

        if (links.length == 0) {
            output += "Too small links";
        } else
        if (links.length > 1) {
            output += "Too much links";
        }

        var models = timeline.getRobotModels();

        for (var modelId = 0; modelId < models.length; modelId++) {
            var model = models[modelId];
            model.setDrawingState(isUp);
        }

        if (links.length == 1) {
            var link = links[0];
            var nextNode = nodesMap[link.get('target').id];
            output += Factory.run(nextNode, graph, nodesMap, linksMap, env, timeline);
        }

        return output;
    }

}