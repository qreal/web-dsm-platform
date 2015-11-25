class Model {
    private nodesMap = {};
    private linksMap = {};
    private currentElement: DiagramElement;
    private nodeTypesMap: NodeTypesMap = {};

    constructor(handler) {
        this.addHandler(handler);
    }

    private handlers: { (data?: any): void; }[] = [];

    public addHandler(handler: { (data?: any): void }) {
        this.handlers.push(handler);
    }

    public removeHandler(handler: { (data?: any): void }) {
        this.handlers = this.handlers.filter(h => h !== handler);
    }

    public dispatch(data?: any) {
        this.handlers.slice(0).forEach(h => h(data));
    }

    public getNodeTypesMap(): NodeTypesMap {
        return this.nodeTypesMap
    }

    public getNodesMap() {
        return this.nodesMap;
    }

    public getLinksMap() {
        return this.linksMap;
    }

    public getCurrentElement() {
        return this.currentElement;
    }

    public setProperty(name: string, property: Property) {
        this.currentElement.setProperty(name, property);
    }

    public setCurrentElement(element: DiagramElement) {
        this.currentElement = element;
        this.dispatch(element);
    }

    public changePropertyValue(nameProperty, value) {
        var property: Property = this.currentElement.getProperties()[nameProperty];
        property.value = value;
        this.currentElement.setProperty(nameProperty, property);
    }

    public addLink(linkId: string, linkObject: Link) {
        this.linksMap[linkId] = linkObject;
    }

    public createNode(node: DiagramNode): void {
        this.setCurrentElement(node);
        this.nodesMap[node.getJointObject().id] = node;
    }

    public clear() {
        this.nodesMap = {};
        this.linksMap = {};
        this.currentElement = undefined;
    }

    private removeCurrentElement(): void {
        if (this.currentElement) {
            var node = this.nodesMap[this.currentElement.getJointObject().id];
            if (node) {
                /*var links = this.graph.getConnectedLinks(node.getJointObject(), { inbound: true, outbound: true });

                links.forEach(function (link) {
                    delete model.linksMap[link.id];
                });*/

                delete this.nodesMap[this.currentElement.getJointObject().id];
            } else {
                var link = this.linksMap[this.currentElement.getJointObject().id];
                if (link) {
                    delete this.linksMap[this.currentElement.getJointObject().id];
                }
            }
            this.currentElement.getJointObject().remove();
            this.currentElement = undefined;
        }
    }
}