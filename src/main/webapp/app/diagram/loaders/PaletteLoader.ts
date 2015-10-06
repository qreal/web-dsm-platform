class PaletteLoader {
    static loadElementsFromXml(controller: DiagramController, pathToXML: string, $scope, $compile): void {
        var req: any = XmlHttpFactory.createXMLHTTPObject();
        if (!req) {
            alert("Can't load xml document!");
            return null;
        }

        req.open("GET", pathToXML, true);
        req.onreadystatechange = function() {
            PaletteLoader.parseElementsXml(req, controller, $scope, $compile);
        };
        req.send(null);
    }

    private static addDropdownList(typeName: string, propertyName: string, variants): void {
        var list = [];
        for (var i = 0; i < variants.length; i++) {
            list.push(variants[i].childNodes[0].nodeValue);
        }
        DropdownListManager.addDropdownList(typeName, propertyName, list);
    }

    private static parseElementsXml(req, controller: DiagramController, $scope, $compile): void {
        try {
            if (req.readyState == 4) {
                if (req.status == 200) {
                    var xmlDoc = req.responseXML;
                    var nodeTypesMap: NodeTypesMap = {};
                    var content: string = '';
                    var categories = xmlDoc.getElementsByTagName("Category");
                    for (var k = 0; k < categories.length; k++) {
                        content += '<li><p>' + categories[k].getAttribute('name') + '</p><ul>';
                        var elements = categories[k].getElementsByTagName("Element");

                        for (var i = 0; i < elements.length; i++) {
                            var typeName: string = elements[i].getAttribute('name');
                            nodeTypesMap[typeName] = new NodeType();
                            content += '<li><div class="tree_element">';

                            var elementProperties = elements[i].getElementsByTagName("Property");
                            var properties:PropertiesMap = {};
                            for (var j = 0; j < elementProperties.length; j++) {
                                var propertyName: string = elementProperties[j].getAttribute('name');
                                var propertyType: string = elementProperties[j].getAttribute('type');

                                if (propertyType === "dropdown") {
                                    this.addDropdownList(typeName, propertyName, elementProperties[j].
                                        getElementsByTagName("Variants")[0].getElementsByTagName("variant"));
                                }

                                var propertyValue: string;
                                var valueElement = elementProperties[j].getElementsByTagName("value")[0];
                                if (valueElement.childNodes[0]) {
                                    propertyValue = valueElement.childNodes[0].nodeValue;
                                } else {
                                    propertyValue = '';
                                }
                                var property: Property = new Property(propertyValue, propertyType);
                                properties[propertyName] = property;
                            }

                            var image: string = elements[i].getElementsByTagName("Image")[0].getAttribute('src');
                            nodeTypesMap[typeName].image = image;
                            nodeTypesMap[typeName].properties = properties;

                            content += '<img class="elementImg" src="' + image + '" />';
                            content += typeName;
                            content += '</div></li>';
                        }

                        content += '</ul></li>';
                    }

                    $('#navigation').append($compile(content)($scope));

                    $("#navigation").treeview({
                        persist: "location"
                    });

                    controller.setNodeTypesMap(nodeTypesMap);
                    controller.initPalette();
                } else {
                    alert("Can't load palette:\n" + req.statusText);
                }
            }
        } catch(e) {
            alert("Palette loading error: " + e.message);
        }
    }
}