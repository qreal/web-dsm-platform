class DropdownListManager {

    private static nodeDropdowns = {};

    static addDropdownList(typeName: string, propertyName: string, list) {
        if (!this.nodeDropdowns[typeName]) {
            this.nodeDropdowns[typeName] = {};
        }
        this.nodeDropdowns[typeName][propertyName] = list;
    }

    static getDropdownList(typeName: string, propertyName: string) {
        return this.nodeDropdowns[typeName][propertyName];
    }
}