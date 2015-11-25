class Scene {
    private graph: joint.dia.Graph = new joint.dia.Graph;
    private paper: DiagramPaper = new DiagramPaper(this, this.graph);
    private nodeTypesMap: NodeTypesMap = {};
    private controller: Controller;
    private model: Model;
    private paletteLoader: PaletteLoader;
    private clickFlag: boolean = false;

    constructor(controller: Controller, model: Model, paletteLoader: PaletteLoader) {
        this.controller = controller;
        this.model = model;
        this.paletteLoader = paletteLoader;
        this.nodeTypesMap = this.paletteLoader.getNodeTypesMap();
        this.initDragAndDrop();
        this.initPointerdownListener();
        this.initPointerMoveAndUpListener();
        this.initDeleteListener();
        this.initCustomContextMenu();
    }

    public addLink(linkId: string, linkObject: Link) {
        var addCommand: Command = new AddLinkCommand(linkId, linkObject);
        this.controller.addUndoStack(addCommand);
    }

    public addNode(node) {
        this.graph.addCell(node.getJointObject());
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

    private initPointerdownListener(): void {
        var scene: Scene = this;
        var model: Model = this.model;
        var controller: Controller = this.controller;
        this.paper.on('cell:pointerdown',
            function (cellView) {
                scene.clickFlag = true;
                var node: DiagramNode = model.getNodesMap()[cellView.model.id];
                console.log(node);
                if (node) {
                    var changeElement: Command = new ChangeCurrentElementCommand(node);
                    controller.addUndoStack(changeElement);
                } else {
                    var link: Link = model.getLinksMap()[cellView.model.id];
                    if (link) {
                        var changeElement: Command = new ChangeCurrentElementCommand(link);
                        controller.addUndoStack(changeElement);
                    } /*else {
                        controller.currentElement = undefined;
                    }*/
                }
            });
    }

    private initPointerMoveAndUpListener(): void {
        var scene: Scene = this;
        this.paper.on('cell:pointermove', function () {
                scene.clickFlag = false;
            }
        );

        this.paper.on('cell:pointerup', function (cellView, event) {
            if (!($(event.target).parents(".custom-menu").length > 0)) {
                $(".custom-menu").hide(100);
            }
            if ((scene.clickFlag) && (event.button == 2)) {
                console.log("right-click");
                $(".custom-menu").finish().toggle(100).
                    css({
                        top: event.pageY + "px",
                        left: event.pageX + "px"
                    });
            }
        });
    }

    private initCustomContextMenu(): void {
        var controller = this.controller;
        $("#diagramContent").bind("contextmenu", function (event) {
            event.preventDefault();
        });

        $(".custom-menu li").click(function(){
            switch($(this).attr("data-action")) {
                case "delete":
                    var remove: Command = new RemoveCurrentElement();
                    controller.addUndoStack(remove);
                    break;
            }

            $(".custom-menu").hide(100);
        });
    }

    private initDeleteListener(): void {
        var controller = this.controller;
        var deleteKey: number = 46;
        $('html').keyup(function(e){
            if(e.keyCode == deleteKey) {
                if(!(document.activeElement.tagName === "INPUT")) {
                    console.log(document.activeElement.tagName);
                    var remove: Command = new RemoveCurrentElement();
                    controller.addUndoStack(remove);
                }
            }
        });
    }
}