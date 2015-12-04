class ChangeCurrentElementCommand implements Command {
    private element: DiagramElement;
    private oldElement: DiagramElement;

    constructor(element: DiagramElement) {
        this.element = element;
    }

    public execute(model: Model) {
        this.oldElement = model.getCurrentElement();
        model.setCurrentElement(this.element);
    }

    public unexecute(model: Model) {
        model.setCurrentElement(this.oldElement);
    }
}