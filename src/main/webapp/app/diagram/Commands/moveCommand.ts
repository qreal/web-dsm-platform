class MoveCommand {
    private oldX: number;
    private oldY: number;
    private newX: number;
    private newY: number;
    private node: DiagramNode;

    constructor (node: DiagramNode, oldX: number, oldY: number) {
        this.oldX = oldX;
        this.oldY = oldY;
        this.node = node;
    }

    public execute(model: Model) {
        if(this.newX && this.newY) {
            model.moveNode(this.node, this.newX, this.newY);
        }
    }

    public unexecute(model: Model) {
        this.newX = this.node.getX();
        this.newY = this.node.getY();
        model.moveNode(this.node, this.oldX, this.oldY);
    }
}