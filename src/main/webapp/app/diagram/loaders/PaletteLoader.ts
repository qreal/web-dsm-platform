class PaletteLoader {
    private nodeTypesMap: NodeTypesMap = {};
    private categories: string[];
    private categoriesMap: CategoriesMap = {};

    constructor (pathToXML: string, func) {
        this.loadElementsFromXml(pathToXML, func);
    }

    private loadElementsFromXml(pathToXML: string, func) {
        var paletteLoader = this;
        var req: any = XmlHttpFactory.createXMLHTTPObject();
        if (!req) {
            alert("Can't load xml document!");
            return null;
        }

        req.open("GET", pathToXML, true);
        req.onreadystatechange = function() {
            paletteLoader.parseElementsXml(req, func);
        };
        req.send(null);
    }

    public getNodeTypesMap() {
        return this.nodeTypesMap;
    }

    public getCategories() {
        return this.categories;
    }

    public getNodeTypeByCategory(category: string) {
        return this.categoriesMap[category].elements;
    }

    public getImageByNodeType(nodeType: string) {
        return this.nodeTypesMap[nodeType].image;
    }

    public getPropertiesByNodeType(nodeType: string) {
        return this.nodeTypesMap[nodeType].properties;
    }

    private parseElementsXml(req, func): void {
        try {
            if (req.readyState == 4) {
                if (req.status == 200) {
                    var xmlDoc = req.responseXML;
                    var categories = xmlDoc.getElementsByTagName("Category");
                    this.categories = [categories.length];
                    for (var k = 0; k < categories.length; k++) {
                        var elements = categories[k].getElementsByTagName("Element");
                        this.categories[k] = categories[k].getAttribute('name');
                        this.categoriesMap[this.categories[k]] = new Category();
                        this.categoriesMap[this.categories[k]].elements = [elements.length];
                        for (var i = 0; i < elements.length; i++) {
                            var typeName: string = elements[i].getAttribute('name');
                            this.nodeTypesMap[typeName] = new NodeType();
                            this.categoriesMap[this.categories[k]].elements[i] = typeName;
                            var elementProperties = elements[i].getElementsByTagName("Property");
                            var properties: PropertiesMap = {};
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
                            this.nodeTypesMap[typeName].image = image;
                            this.nodeTypesMap[typeName].properties = properties;
                        }
                    }
                    func();
                } else {
                    alert("Can't load palette:\n" + req.statusText);
                }
            }
        } catch(e) {
            alert("Palette loading error: " + e.message);
        }
    }

    private addDropdownList(typeName: string, propertyName: string, variants): void {
        var list = [];
        for (var i = 0; i < variants.length; i++) {
            list.push(variants[i].childNodes[0].nodeValue);
        }
        DropdownListManager.addDropdownList(typeName, propertyName, list);
    }
}