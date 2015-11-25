interface Command {
    execute(model: Model);
    unexecute(model: Model);
}