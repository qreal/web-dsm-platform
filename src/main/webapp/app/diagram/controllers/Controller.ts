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

    public undo() {
        this.addUndoStack(this.redoStack.pop());
    }

    public addRedoStack(command: Command) {
        this.redoStack.push(command);
        command.unexecute(this.model);
        console.log(command);
    }

    public redo() {
        this.addRedoStack(this.undoStack.pop());
    }
}