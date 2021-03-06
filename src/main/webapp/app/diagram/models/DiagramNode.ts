/**
 * Created by vladzx on 10.10.14.
 */
interface DiagramNode extends DiagramElement {
    getX(): number;
    getY(): number;
    getImagePath(): string;
    setCoord(x: number, y: number);
    getOldX(): number;
    getOldY(): number;
    setOldCoord(x: number, y: number);
}
