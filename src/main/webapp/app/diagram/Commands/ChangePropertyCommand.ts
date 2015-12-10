//Change value of property with a certain name and keeps old value for unexecute
class ChangePropertyCommand implements Command{
    private name: string;
    private value: string;
    private oldValue: string;

    constructor(name: string, value: string) {
        this.name = name;
        this.value = value;
    }

    public execute(model: Model) {
        this.oldValue = model.getCurrentElement().getProperties()[this.name].value;
        model.changePropertyValue(this.name, this.value);
    }

    public unexecute(model: Model) {
        model.changePropertyValue(this.name, this.oldValue);
    }
}