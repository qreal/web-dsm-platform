//Is responsible for keeping nodesMap and linksMap
class Model {
    private nodesMap = {};
    private linksMap = {};
    private currentElement: DiagramElement;
    private handlers = {};
    private nodeTypesMap: NodeTypesMap = {};

    public addHandler(event: string, handler: { (data?: any): void }) {
        this.handlers[event] = this.handlers[event] || [];
        this.handlers[event].push(handler);
    }
/*
    public removeHandler(event: string, handler: { (data?: any): void }) {
        this.handlers[event] = this.handlers[event].filter(h => h !== handler);
    }
*/
    public dispatch(event: string, data?: any) {
        this.handlers[event].slice(0).forEach(h => h(data));
    }

    public setNodeTypesMap(nodeTypesMap) {
        this.nodeTypesMap = nodeTypesMap;
    }

    public getNodeTypesMap() {
        return this.nodeTypesMap;
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
        this.dispatch('setCurrentElement', element);
    }

    public changePropertyValue(nameProperty, value) {
        var property: Property = this.currentElement.getProperties()[nameProperty];
        property.value = value;
        this.currentElement.setProperty(nameProperty, property);
        this.dispatch('changePropertyValue', this.currentElement);
    }

    public addElement(element: DiagramElement) {
        this.setCurrentElement(element);
        if (element.getType() === "Link") {
            this.linksMap[element.getJointObject().id] = element;
        }
        else {
            this.nodesMap[element.getJointObject().id] = element;
        }
        this.dispatch('addElement', element);
    }

    public clear() {
        this.nodesMap = {};
        this.linksMap = {};
        this.currentElement = undefined;
        this.dispatch('clear');
    }

    public removeElement(element: DiagramElement): void {
        var node = this.nodesMap[element.getJointObject().id];
        if (node) {
            delete this.nodesMap[element.getJointObject().id];
        } else {
            var link = this.linksMap[element.getJointObject().id];
            if (link) {
                delete this.linksMap[element.getJointObject().id];
            }
        }
        element.getJointObject().remove();
    }

    public removeCurrentElement(): void {
        if (this.currentElement) {
            this.removeElement(this.currentElement);
            this.currentElement = undefined;
            this.dispatch('removeElement');
        }
    }

    public moveNode(node: DiagramNode, newX: number, newY: number): void {
        node.setCoord(newX, newY);
    }
}