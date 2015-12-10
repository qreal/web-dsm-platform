//It id responsible for showing property editor and monitors changes in view, create changePropertyCommand and add it to undo stack of controller
class PropertyEditor {
    private controller: Controller;

    //Initializes handlers for different types of property
    constructor(controller: Controller) {
        this.controller = controller;
        this.setInputStringListener();
        this.setCheckboxListener();
        this.setDropdownListener();
        this.setSpinnerListener();
        this.makeUnselectable(document.getElementById("diagramContent"));
    }

    public clearPropertyEditor() {
        $(".property").remove();
    }

    private setInputStringListener(): void {
        var controller: Controller = this.controller;
        $(document).on('change', '.form-control', function () {
            var tr = $(this).closest('tr');
            var name = tr.find('td:first').html();
            var value = $(this).val();
            var changePropertyValue: Command = new ChangePropertyCommand(name, value);
            controller.addUndoStack(changePropertyValue);
        });
    }

    private setCheckboxListener(): void {
        var controller: Controller = this.controller;
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
            var changePropertyValue: Command = new ChangePropertyCommand(name, value);
            controller.addUndoStack(changePropertyValue);
        });
    }

    private setDropdownListener(): void {
        var controller: Controller = this.controller;
        $(document).on('change', '.mydropdown', function () {
            var tr = $(this).closest('tr');
            var name = tr.find('td:first').html();
            var value = $(this).val();
            var changePropertyValue: Command = new ChangePropertyCommand(name, value);
            controller.addUndoStack(changePropertyValue);
        });
    }

    private setSpinnerListener(): void {
        var controller: Controller = this.controller;
        $(document).on('change', '.spinner', function () {
            var tr = $(this).closest('tr');
            var name = tr.find('td:first').html();
            var value = $(this).val();
            if (value !== "" && !isNaN(value)) {
                var changePropertyValue: Command = new ChangePropertyCommand(name, value);
                controller.addUndoStack(changePropertyValue);
            }
        });
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

    //Changes properties of elements in view
    public setElementProperties(element): void {
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

    private getPropertyHtml(typeName, propertyName: string, property: Property): string {
        return PropertyManager.getPropertyHtml(typeName, propertyName, property);
    }

    private initCombobox(typeName: string, propertyName: string, element) {
        var dropdownList = DropdownListManager.getDropdownList(typeName, propertyName);
        var controller = this.controller;

        element.find('input').autocomplete({
            source: dropdownList,
            minLength: 0,
            select: function (event, ui) {
                var tr = $(this).closest('tr');
                var name = tr.find('td:first').html();
                var value = ui.item.value;
                var changePropertyValue: Command = new ChangePropertyCommand(name, value);
                controller.addUndoStack(changePropertyValue);
            }
        }).focus(function() {
            $(this).autocomplete("search", $(this).val());
        });
    }
}