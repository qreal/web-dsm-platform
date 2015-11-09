class DiagramController {
    private graph: joint.dia.Graph = new joint.dia.Graph;
    private paper: DiagramPaper = new DiagramPaper(this, this.graph);
    private nodeTypesMap: NodeTypesMap = {};
    private nodesMap = {};
    private linksMap = {};
    private currentElement: DiagramElement;
    private diagramPaper : HTMLDivElement;
    private menuController: DiagramMenuManager;
    private clickFlag : boolean;

    constructor($scope, $compile) {
        var controller: DiagramController = this;
        $scope.vm = controller;
        PaletteLoader.loadElementsFromXml(this, "configs/elements.xml", $scope, $compile);

        DropdownListManager.addDropdownList("Link", "Guard", ["", "false", "iteration", "true"]);

        this.initPointerdownListener();
        this.initPointerMoveAndUpListener();
        this.initDeleteListener();
        this.initCustomContextMenu();
        this.menuController = new DiagramMenuManager($scope);
    }

    public getGraph(): joint.dia.Graph {
        return this.graph;
    }

    public getNodeTypesMap(): NodeTypesMap {
        return this.nodeTypesMap
    }

    public getNodesMap() {
        return this.nodesMap;
    }

    public getLinksMap() {
        return this.linksMap;
    }

    initPalette() {
        this.setInputStringListener();
        this.setCheckboxListener();
        this.setDropdownListener();
        this.setSpinnerListener();
        this.initDragAndDrop();
        this.makeUnselectable(document.getElementById("diagramContent"));
    }

    setNodeTypesMap(nodeTypesMap: NodeTypesMap): void {
        this.nodeTypesMap = nodeTypesMap;
    }

    createDefaultNode(type: string, x: number, y: number, properties: PropertiesMap,
                              imagePath: string, id?: string): DefaultDiagramNode {
        var node: DefaultDiagramNode = new DefaultDiagramNode(type, x, y, properties, imagePath, id);
        this.nodesMap[node.getJointObject().id] = node;
        this.graph.addCell(node.getJointObject());
        return node;
    }

    createNode(type: string, x: number, y: number): void {
        var image: string = this.nodeTypesMap[type].image;

        var typeProperties: PropertiesMap = this.nodeTypesMap[type].properties;

        var nodeProperties: PropertiesMap = {};
        for (var property in typeProperties) {
            nodeProperties[property] = new Property(typeProperties[property].value,
                typeProperties[property].type);
        }

        var leftElementPos: number = x - $(this.diagramPaper).offset().left + $(this.diagramPaper).scrollLeft();
        var topElementPos: number = y - $(this.diagramPaper).offset().top + $(this.diagramPaper).scrollTop();
        var gridSize: number = this.paper.getGridSizeValue();
        leftElementPos -= leftElementPos % gridSize;
        topElementPos -= topElementPos % gridSize;
        var node = this.createDefaultNode(type, leftElementPos, topElementPos, nodeProperties, image);
        this.currentElement = node;
        this.setNodeProperties(node);
    }

    private removeCurrentElement(): void {
        var controller = this;
        if (this.currentElement) {
            var node = this.nodesMap[this.currentElement.getJointObject().id];
            if (node) {
                var links = this.graph.getConnectedLinks(node.getJointObject(), { inbound: true, outbound: true });

                links.forEach(function (link) {
                    delete controller.linksMap[link.id];
                });

                delete this.nodesMap[this.currentElement.getJointObject().id];
            } else {
                var link = this.linksMap[this.currentElement.getJointObject().id];
                if (link) {
                    delete this.linksMap[this.currentElement.getJointObject().id];
                }
            }
            this.currentElement.getJointObject().remove();
            $(".property").remove();
            this.currentElement = undefined;
        }
    }

    private initDragAndDrop(): void {
        var controller: DiagramController = this;
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
                var gridSize: number = controller.paper.getGridSizeValue();
                topElementPos -= topElementPos % gridSize;
                leftElementPos -= leftElementPos % gridSize;
                var type: string = $(ui.draggable.context).text();
                var image: string = controller.nodeTypesMap[type].image;
                var typeProperties: PropertiesMap = controller.nodeTypesMap[type].properties;

                var nodeProperties: PropertiesMap = {};
                for (var property in typeProperties) {
                    nodeProperties[property] = new Property(typeProperties[property].value,
                        typeProperties[property].type);
                }

                var node = controller.createDefaultNode(type, leftElementPos, topElementPos, nodeProperties, image);
                controller.currentElement = node;
                controller.setNodeProperties(node);
            }
        });
    }

    private initPointerdownListener(): void {
        var controller: DiagramController = this;
        this.paper.on('cell:pointerdown',
            function (cellView) {
                controller.clickFlag = true;
                var node: DiagramNode = controller.nodesMap[cellView.model.id];
                if (node) {
                    controller.currentElement = node;
                    controller.setNodeProperties(node);
                } else {
                    var link: Link = controller.linksMap[cellView.model.id];
                    if (link) {
                        controller.currentElement = link;
                        controller.setNodeProperties(link);
                    } else {
                        controller.currentElement = undefined;
                    }
                }
            });
    }

    private initPointerMoveAndUpListener(): void {

        var controller:DiagramController = this;
        this.paper.on('cell:pointermove', function () {
                controller.clickFlag = false;
            }
        );

        this.paper.on('cell:pointerup', function (cellView, event) {
            if (!($(event.target).parents(".custom-menu").length > 0)) {
                $(".custom-menu").hide(100);
            }
            if ((controller.clickFlag) && (event.button == 2)) {
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
        var controller = this;
        $("#diagramContent").bind("contextmenu", function (event) {
            event.preventDefault();
        });

        $(".custom-menu li").click(function(){
            switch($(this).attr("data-action")) {
                case "delete":
                    controller.removeCurrentElement();
                    break;
            }

            $(".custom-menu").hide(100);
        });
    }

    private initDeleteListener(): void {
        var controller = this;
        var deleteKey: number = 46;
        $('html').keyup(function(e){
            if(e.keyCode == deleteKey) {
                if(!(document.activeElement.tagName === "INPUT")) {
                    console.log(document.activeElement.tagName);
                    controller.removeCurrentElement();
                }
            }
        });
    }

    private setInputStringListener(): void {
        var controller: DiagramController = this;
        $(document).on('change', '.form-control', function () {
            var tr = $(this).closest('tr');
            var name = tr.find('td:first').html();
            var value = $(this).val();
            var property: Property = controller.currentElement.getProperties()[name];
            property.value = value;
            controller.currentElement.setProperty(name, property);
        });
    }

    private setCheckboxListener(): void {
        var controller: DiagramController = this;
        $(document).on('change', '.checkbox', function () {
            var tr = $(this).closest('tr');
            var name = tr.find('td:first').html();
            var label = tr.find('label');
            var value = label.contents().last()[0].textContent;
            if (value === "True") {
                value = "False";
                label.contents().last()[0].textContent = value;
            } else {
                value = "True";
                label.contents().last()[0].textContent = value;
            }
            var property: Property = controller.currentElement.getProperties()[name];
            property.value = value;
            controller.currentElement.setProperty(name, property);
        });
    }

    private setDropdownListener(): void {
        var controller: DiagramController = this;
        $(document).on('change', '.mydropdown', function () {
            var tr = $(this).closest('tr');
            var name = tr.find('td:first').html();
            var value = $(this).val();
            var property: Property = controller.currentElement.getProperties()[name];
            property.value = value;
            controller.currentElement.setProperty(name, property);
        });
    }

    private setSpinnerListener(): void {
        var controller: DiagramController = this;
        $(document).on('change', '.spinner', function () {
            var tr = $(this).closest('tr');
            var name = tr.find('td:first').html();
            var value = $(this).val();
            if (value !== "" && !isNaN(value)) {
                var property: Property = controller.currentElement.getProperties()[name];
                property.value = value;
                controller.currentElement.setProperty(name, property);
            }
        });
    }

    private setNodeProperties(element): void {
        $('#property_table tbody').empty();
        var properties: PropertiesMap = element.getProperties();
        for (var property in properties) {
            var newItem = $(this.getPropertyHtml(element.getType(), property, properties[property]));
            $('#property_table tbody').append(newItem);
            console.log(properties[property].type);

            if (properties[property].type === "combobox") {
                this.initCombobox(element.getType(), property, newItem);
            }
        }
    }

    private initCombobox(typeName: string, propertyName: string, element) {
        var dropdownList = DropdownListManager.getDropdownList(typeName, propertyName);

        var controller: DiagramController = this;

        element.find('input').autocomplete({
            source: dropdownList,
            minLength: 0,
            select: function (event, ui) {
                var tr = $(this).closest('tr');
                var name = tr.find('td:first').html();
                var value = ui.item.value;;
                var property: Property = controller.currentElement.getProperties()[name];
                property.value = value;
                controller.currentElement.setProperty(name, property);
            }
        }).focus(function() {
            $(this).autocomplete("search", $(this).val());
        });
    }

    private getPropertyHtml(typeName, propertyName: string, property: Property): string {
        return PropertyManager.getPropertyHtml(typeName, propertyName, property);
    }

    private addLink(linkId: string, linkObject: Link) {
        this.linksMap[linkId] = linkObject;
    }

    public clearScene(): void {
        this.graph.clear();
        this.nodesMap = {};
        this.linksMap = {};
        $(".property").remove();
        this.currentElement = undefined;
    }

    private makeUnselectable(element) {
        if (element.nodeType == 1) {
            element.setAttribute("unselectable", "on");
        }
        var child = element.firstChild;
        while (child) {
            this.makeUnselectable(child);
            child = child.nextSibling;
        }
    }
}