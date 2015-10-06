class FinalBlock extends Block {
    static run(node, graph, timeline): string {
        var output = "Final" + "\n";
        timeline.stop();
        return output;
    }
}
