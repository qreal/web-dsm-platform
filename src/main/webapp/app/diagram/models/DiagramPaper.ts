class DiagramPaper extends joint.dia.Paper {
    private controller;
    private gridSizeValue: number;

    constructor(controller: DiagramController, graph: joint.dia.Graph) {
        this.controller = controller;
        this.gridSizeValue = 25;

        super({
            el: $('#diagram_paper'),
            width: $('#diagram_paper').width(),
            height: $('#diagram_paper').height(),
            model: graph,
            gridSize: this.gridSizeValue,
            defaultLink: new joint.dia.Link({
                attrs: {
                    '.connection': { stroke: 'black' },
                    '.marker-target': { fill: 'black', d: 'M 10 0 L 0 5 L 10 10 z' }
                }
            }),
            validateConnection: function (cellViewS, magnetS, cellViewT, magnetT, end, linkView) {
                return (!(magnetT && magnetT.getAttribute('type') === 'output') && !(cellViewT && cellViewT.model.get('type') === 'link'));
            },
            validateMagnet: function (cellView, magnet) {
                return magnet.getAttribute('magnet') !== 'passive';
            },
            diagramElementView: joint.dia.ElementView.extend(this.getDiagramElementView())
        });
    }

    getGridSizeValue(): number {
        return this.gridSizeValue;
    }

    private getDiagramElementView() {
        var controller = this.controller;
        return jQuery.extend(joint.shapes.basic.PortsViewInterface,
            {
                pointerdown: function (evt, x, y) {
                    if ( // target is a valid magnet start linking
                    evt.target.getAttribute('magnet') &&
                    this.paper.options.validateMagnet.call(this.paper, this, evt.target)
                    ) {
                        this.model.trigger('batch:start');

                        var link = this.paper.getDefaultLink(this, evt.target);
                        if (evt.target.tagName === "circle") {
                            link.set({
                                source: {
                                    id: this.model.id
                                },
                                target: { x: x, y: y }
                            });
                        } else {
                            link.set({
                                source: {
                                    id: this.model.id,
                                    selector: this.getSelector(evt.target),
                                    port: $(evt.target).attr('port')
                                },
                                target: { x: x, y: y }
                            });
                        }

                        var linkObject: Link = new Link(link);

                        controller.addLink(link.id, linkObject);

                        this.paper.model.addCell(link);

                        this._linkView = this.paper.findViewByModel(link);
                        this._linkView.startArrowheadMove('target');

                    } else {

                        this._dx = x;
                        this._dy = y;

                        joint.dia.CellView.prototype.pointerdown.apply(this, arguments);
                    }
                }
            });
    }
}