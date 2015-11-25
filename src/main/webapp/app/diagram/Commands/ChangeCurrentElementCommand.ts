class ChangeCurrentElementCommand implements Command {
    private element: DiagramElement;

    constructor(element: DiagramElement) {
        this.element = element;
    }

    public execute(model: Model) {
        model.setCurrentElement(this.element);
    }
}