interface WorldModel {
    setDrawLineMode(): void;
    setDrawWallMode(): void;
    setDrawPencilMode(): void;
    setDrawEllipseMode(): void;
    getDrawMode(): number;
    setNoneMode(): void;
    getPaper(): RaphaelPaper;
    setCurrentElement(element): void;
    clearPaper(): void;
}