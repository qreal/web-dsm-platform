//Is responsible for moving nodes
class MoveCommand implements Command {
    private oldX: number;
    private oldY: number;
    private newX: number;
    private newY: number;
    private node: DiagramNode;

    //receives node and sets coordinates
    constructor (node: DiagramNode) {
        this.oldX = node.getOldX();
        this.oldY = node.getOldY();
        this.newX = node.getX();
        this.newY = node.getY();
        this.node = node;
    }

    public execute(model: Model) {
        model.moveNode(this.node, this.newX, this.newY);
    }

    public unexecute(model: Model) {
        model.moveNode(this.node, this.oldX, this.oldY);
    }

    public reversible(model: Model): boolean {
        return (this.newX !== this.oldX && this.newY !== this.oldY);
    }
}