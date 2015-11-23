class Facade {
    private paletteLoader:PaletteLoader;
    private palette: Palette;
    private controller: Controller;
    private scene: Scene;
    private propertyEditor: PropertyEditor;
    private model: Model;

    constructor($scope) {
        var facade: Facade = this;
        $scope.vm = facade;
        this.paletteLoader = new PaletteLoader("configs/elements.xml", function () {
            facade.init()
        });

        DropdownListManager.addDropdownList("Link", "Guard", ["", "false", "iteration", "true"]);
        this.model = new Model;
        this.controller = new Controller(this.model);
    }

    public init() {
        this.palette = new Palette(this.paletteLoader);
        this.propertyEditor = new PropertyEditor(this.controller);
        this.scene = new Scene(this.controller, this.model, this.paletteLoader);
    }
}