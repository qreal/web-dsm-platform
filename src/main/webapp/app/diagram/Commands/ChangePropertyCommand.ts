class ChangePropertyCommand implements Command{
    private name: string;
    private value: string;

    constructor(name: string, value: string) {
        this.name = name;
        this.value = value;
    }

    public execute(model: Model) {
        model.changePropertyValue(this.name, this.value);
    }
}