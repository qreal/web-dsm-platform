//Changes current element to new element and keeps old element to realize unexecute
class ChangeCurrentElementCommand implements Command {
    private element: DiagramElement;
    private oldElement: DiagramElement;

    constructor(element: DiagramElement) {
        this.element = element;
    }

    public reversible(model: Model) : boolean{
        this.oldElement = model.getCurrentElement();
        return (this.oldElement !== this.element);
    }

    public execute(model: Model) {
        model.setCurrentElement(this.element);
    }

    public unexecute(model: Model) {
        model.setCurrentElement(this.oldElement);
    }
}