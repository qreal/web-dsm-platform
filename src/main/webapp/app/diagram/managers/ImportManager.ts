class ImportManager {

    static import(response, graph: joint.dia.Graph, nodesMap, linksMap, nodeTypesMap: NodeTypesMap): number {
        for (var i = 0; i < response.nodes.length; i++) {
            var nodeObject = response.nodes[i];

            var properties: PropertiesMap = ImportManager.importProperties(nodeObject.properties);

            this.importNode(graph, nodesMap, nodeObject.jointObjectId, nodeObject.type, nodeObject.x,
                nodeObject.y, properties, nodeTypesMap[nodeObject.type].image);
        }

        for (var i = 0; i < response.links.length; i++) {
            var linkObject = response.links[i];

            var properties: PropertiesMap = ImportManager.importProperties(linkObject.properties);
            var vertices = this.importVertices(linkObject.vertices);

            this.importLink(graph, linksMap, linkObject.jointObjectId,
                linkObject.source, linkObject.target, vertices, properties);
        }

        return response.nodeIndex;
    }

    private static importProperties(propertiesObject): PropertiesMap {
        var properties: PropertiesMap = {};

        for (var j = 0; j < propertiesObject.length; j++) {
            var property: Property = new Property(propertiesObject[j].value, propertiesObject[j].type);
            properties[propertiesObject[j].name] = property;
        }

        return properties;
    }

    private static importNode(graph: joint.dia.Graph, nodesMap, jointObjectId: string,
                      type: string, x: number, y: number, properties, imagePath: string): void {
        var node: DefaultDiagramNode = new DefaultDiagramNode(type, x, y, properties, imagePath, jointObjectId);
        nodesMap[jointObjectId] = node;
        graph.addCell(node.getJointObject());
    }

    private static importLink(graph: joint.dia.Graph, linksMap, jointObjectId: string,
                      sourceId:string, targetId:string, vertices, properties): void {
        var jointObject: joint.dia.Link = new joint.dia.Link({
            id: jointObjectId,
            attrs: {
                '.connection': { stroke: 'black' },
                '.marker-target': { fill: 'black', d: 'M 10 0 L 0 5 L 10 10 z' }
            },
            source: { id: sourceId },
            target: { id: targetId },
            vertices: vertices
        });

        linksMap[jointObjectId] = new Link(jointObject, properties);
        graph.addCell(jointObject);
    }

    private static importVertices(verticesJSON) {
        var vertices = [];
        verticesJSON.forEach(function (vertex) {
            vertices.push(
                {
                    x : vertex.x,
                    y : vertex.y
                }
            )
        });
        return vertices;
    }
}