//Takes from paletteLoader array of categories, array of node types, images and appends it to jsp; creates palette
class Palette {
    private paletteLoader: PaletteLoader;
    private categories;

    constructor (loader: PaletteLoader) {
        this.paletteLoader = loader;
        this.categories = loader.getCategories();
        this.createPalette();
    }

    private createPalette() {
        var content: string = '';
        for (var k = 0; k < this.categories.length; k++) {
            content += '<li><p>' + this.categories[k] + '</p><ul>';

            var nodesType: string[] = this.paletteLoader.getNodeTypeByCategory(this.categories[k]);

            for(var i = 0; i < nodesType.length; i++) {
                content += '<li><div class="tree_element">';
                content += '<img class="elementImg" src="' + this.paletteLoader.getImageByNodeType(nodesType[i]) + '" />';
                content += nodesType[i];
                content += '</div></li>';
            }
            content += '</ul></li>';
        }
        $('#navigation').append(content);
        $("#navigation").treeview({
            persist: "location"
        });
    }
}