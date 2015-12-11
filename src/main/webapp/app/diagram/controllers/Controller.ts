//Adds commands to undo and redo stacks
class Controller {
    private undoRedoStack: Command[] = [];
    private pointer: number = -1;
    private model: Model;

    constructor(model: Model) {
        this.model = model;
    }

    //adds command to stack and calls execute
    public addUndoStack(command: Command) {
        if (command.reversible(this.model)) {
            this.pointer++;
            this.undoRedoStack[this.pointer] = command;
            command.execute(this.model);
            console.log(command);
        }
    }

    public undo() {
        if (this.pointer < this.undoRedoStack.length - 1) {
            this.pointer++;
            this.undoRedoStack[this.pointer].execute(this.model);
        }
    }

    public redo() {
        if (this.pointer !== -1) {
            this.undoRedoStack[this.pointer].unexecute(this.model);
            this.pointer--;
        }
    }
}