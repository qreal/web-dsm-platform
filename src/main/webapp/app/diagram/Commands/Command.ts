//interface for editor commands, execute and unexecute has model as parameters to call her methods
interface Command {
    execute(model: Model);
    unexecute(model: Model);
}