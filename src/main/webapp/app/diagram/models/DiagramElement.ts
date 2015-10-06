interface DiagramElement {
    getJointObject();
    getType(): string;
    getProperties(): PropertiesMap;
    setProperty(name: string, property: Property): void;
}