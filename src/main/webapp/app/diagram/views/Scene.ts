class Scene {
    private graph: joint.dia.Graph = new joint.dia.Graph;
    private paper: DiagramPaper = new DiagramPaper(this, this.graph);
    private nodeTypesMap: NodeTypesMap = {};
    private controller: Controller;
    private model: Model;
    private paletteLoader: PaletteLoader;

    constructor(controller: Controller, model: Model, paletteLoader: PaletteLoader) {
        this.controller = controller;
        this.model = model;
        this.paletteLoader = paletteLoader;
        this.nodeTypesMap = this.paletteLoader.getNodeTypesMap();
        this.initDragAndDrop();
    }

    public addLink(linkId: string, linkObject: Link) {
        var addCommand: Command = new AddLinkCommand(linkId, linkObject);
        this.controller.addUndoStack(addCommand);
    }

    private initDragAndDrop(): void {
        var scene: Scene = this;
        var controller: Controller = this.controller;
        $(".tree_element").draggable({
            helper: function () {
                var clone =  $(this).find('.elementImg').clone();
                clone.css('position','fixed');
                clone.css('z-index', '1000');
                return clone;
            },
            revert:"invalid"
        });

        $("#diagram_paper").droppable({
            drop: function(event, ui) {
                var topElementPos: number = ui.offset.top - $(this).offset().top + $(this).scrollTop();
                var leftElementPos: number = ui.offset.left - $(this).offset().left + $(this).scrollLeft();
                var gridSize: number = scene.paper.getGridSizeValue();
                topElementPos -= topElementPos % gridSize;
                leftElementPos -= leftElementPos % gridSize;
                var type: string = $(ui.draggable.context).text();
                var image: string = scene.nodeTypesMap[type].image;
                var typeProperties: PropertiesMap = scene.nodeTypesMap[type].properties;

                var nodeProperties: PropertiesMap = {};
                for (var property in typeProperties) {
                    nodeProperties[property] = new Property(typeProperties[property].value,
                        typeProperties[property].type);
                }

                var node: DiagramNode = new DefaultDiagramNode(type, leftElementPos, topElementPos, nodeProperties, image);
                scene.graph.addCell(node.getJointObject());

                var createNode: Command = new CreateNodeCommand(node);
                controller.addUndoStack(createNode);
            }
        });
    }


}