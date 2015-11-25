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
        this.model = new Model(function (element) {facade.propertyEditor.setNodeProperties(element)}
            , function (node) { facade.scene.addNode(node)});
        this.controller = new Controller(this.model);
        this.propertyEditor = new PropertyEditor(this.controller);

        DropdownListManager.addDropdownList("Link", "Guard", ["", "false", "iteration", "true"]);
    }

    public init() {
        this.palette = new Palette(this.paletteLoader);
        this.scene = new Scene(this.controller, this.model, this.paletteLoader);
    }
}