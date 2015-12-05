class Facade {
    private paletteLoader:PaletteLoader;
    private palette: Palette;
    private controller: Controller;
    private scene: Scene;
    private propertyEditor: PropertyEditor;
    private model: Model;
    private menuController: DiagramMenuManager;

    constructor($scope) {
        var facade: Facade = this;
        $scope.vm = facade;
        this.paletteLoader = new PaletteLoader("configs/elements.xml", function () {
            facade.init()
        });
        this.model = new Model();
        this.model.addHandler('setCurrentElement', function(element) {facade.propertyEditor.setNodeProperties(element)});
        this.model.addHandler('addElement', function(element) { facade.scene.addElement(element)});
        this.model.addHandler('removeElement', function() {facade.propertyEditor.clearPropertyEditor()});
        this.model.addHandler('changePropertyValue', function(element) {facade.propertyEditor.setNodeProperties(element)});
        this.model.addHandler('clear', function() {facade.scene.clearScene()});
        this.model.addHandler('clear', function() {facade.propertyEditor.clearPropertyEditor()});
        this.controller = new Controller(this.model);
        this.propertyEditor = new PropertyEditor(this.controller);

        DropdownListManager.addDropdownList("Link", "Guard", ["", "false", "iteration", "true"]);

        this.menuController = new DiagramMenuManager($scope);
    }

    public init() {
        this.palette = new Palette(this.paletteLoader);
        this.scene = new Scene(this.controller, this.model, this.paletteLoader);
    }

    public getModel() {
        return this.model;
    }

    public getGraph() {
        return this.scene.getGraph();
    }
}