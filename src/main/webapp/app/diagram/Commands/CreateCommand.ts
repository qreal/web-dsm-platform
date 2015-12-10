//Adds element in execute and removes this element in unexecute
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