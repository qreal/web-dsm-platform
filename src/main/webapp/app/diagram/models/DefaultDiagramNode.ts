/**
 * Created by vladzx on 10.10.14.
 */
class DefaultDiagramNode implements DiagramNode {
    private jointObject: joint.shapes.devs.ImageWithPorts;
    private type: string;
    private properties: PropertiesMap;
    private imagePath: string;

    constructor(type: string, x: number, y: number, properties: PropertiesMap, imagePath: string, id?: string) {
        this.type = type;

        var jointObjectAttributes = {
            position: { x: x, y: y },
            size: { width: 50, height: 50 },
            outPorts: [''],
            attrs: {
                image: {
                    'xlink:href': imagePath
                }
            }
        };

        if (id) {
            jQuery.extend(jointObjectAttributes, {id: id});
        }

        this.jointObject = new joint.shapes.devs.ImageWithPorts(jointObjectAttributes);
        this.properties = properties;
        this.imagePath = imagePath;
    }

    getType(): string {
        return this.type;
    }

    getX(): number {
        return (this.jointObject.get("position"))['x'];
    }

    getY(): number {
        return (this.jointObject.get("position"))['y'];
    }

    getImagePath(): string {
        return this.imagePath;
    }

    getJointObject() {
        return this.jointObject;
    }

    setProperty(name:string, property: Property): void {
        this.properties[name] = property;
    }

    getProperties(): PropertiesMap {
        return this.properties;
    }
}