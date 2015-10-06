interface PortInfo {
    getName(): string;
    getDirection(): Direction;
    getNameAliases(): string[];
    getReservedVariable(): string;
    getReservedVariableType(): ReservedVariableType;
}