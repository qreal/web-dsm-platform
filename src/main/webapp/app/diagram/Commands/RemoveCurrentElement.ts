//Removes current element in execute and add him in unexecute
class RemoveCurrentElement implements Command {
    private element: DiagramElement;

    public execute(model: Model) {
        this.element = model.getCurrentElement();
        model.removeCurrentElement();
    }

    public unexecute(model: Model) {
        model.addElement(this.element);
    }
}