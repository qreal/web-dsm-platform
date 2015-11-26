class CreateCommand implements Command {
    private element: DiagramElement;

    constructor(element: DiagramElement) {
        this.element = element;
    }

    public execute(model: Model) {
        model.addElement(this.element);
    }

    public unexecute(model: Model) {
        model.removeElement(this.element);
    }
}