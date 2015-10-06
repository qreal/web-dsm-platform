interface DrawingItem {
    setDrawingState(newState : boolean) : void;
    drawLine() : void;
    setPosition(x : number, y : number) : void;
}