//Adds commands to undo and redo stacks
class Controller {
    private undoStack: Command[] = [];
    private redoStack: Command[] = [];
    private model: Model;

    constructor(model: Model) {
        this.model = model;
    }

    //adds command to undo stack and calls execute
    public addUndoStack(command: Command) {
        this.undoStack.push(command);
        command.execute(this.model);
        console.log(command);
    }

    public undo() {
        if (this.redoStack.length !== 0) {
            this.addUndoStack(this.redoStack.pop());
        }
    }

    //add command to undo stack and calls unexecute
    public addRedoStack(command: Command) {
        this.redoStack.push(command);
        command.unexecute(this.model);
        console.log(command);
    }

    public redo() {
        if (this.undoStack.length !== 0) {
            this.addRedoStack(this.undoStack.pop());
        }
    }
}