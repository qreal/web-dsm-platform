class Gesture {
        name: string;
        key: string[];
        factor: number;
        
        constructor(public newName : string, public newKey : string[], public newFactor: number)
        {
            this.name = newName;
            this.key = newKey;
            this.factor = newFactor;
        }
}