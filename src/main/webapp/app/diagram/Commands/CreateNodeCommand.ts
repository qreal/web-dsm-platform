class CreateNodeCommand implements Command {
    private node: DiagramNode;

    constructor(node: DiagramNode) {
        this.node = node;
    }

    public execute(model: Model) {
        model.createNode(this.node);
    }
}