class AddLinkCommand implements Command {
    private linkId: string;
    private linkObject: Link;

    constructor(linkId: string, linkObject: Link) {
        this.linkId = linkId;
        this.linkObject = linkObject;
    }

    public execute(model: Model) {
        model.addLink(this.linkId, this.linkObject);
    }

    public unexecute(model: Model) {

    }
}