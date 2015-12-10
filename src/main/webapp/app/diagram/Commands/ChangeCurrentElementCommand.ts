//Changes current element to new element and keeps old element to realize unexecute
class ChangeCurrentElementCommand implements Command {
    private element: DiagramElement;
    private oldElement: DiagramElement;

    constructor(element: DiagramElement) {
        this.element = element;
    }

    public execute(model: Model) {
        this.oldElement = model.getCurrentElement();
        if (this.oldElement !== this.element) {
            model.setCurrentElement(this.element);
        }
    }

    public unexecute(model: Model) {
        if (this.oldElement !== this.element) {
            model.setCurrentElement(this.oldElement);
        }
    }
}