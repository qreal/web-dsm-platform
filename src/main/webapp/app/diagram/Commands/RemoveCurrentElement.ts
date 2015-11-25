class RemoveCurrentElement implements Command {
    public execute(model: Model) {
        model.removeCurrentElement();
    }

    public unexecute(model: Model) {

    }
}