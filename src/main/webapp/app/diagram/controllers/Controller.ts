class Controller {
    private undoStack: Command[] = [];
    private redoStack: Command[] = [];
    private model: Model;

    constructor(model: Model) {
        this.model = model;
    }

    public addUndoStack(command: Command) {
        this.undoStack.push(command);
        command.execute(this.model);
        console.log(command);
    }
}