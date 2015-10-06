module utils {
    export class Pair {
        first: number;
        second: number;

        constructor (public newFirst : number, public newSecond : number) {
            this.first = newFirst;
            this.second = newSecond;
        }
    }

    export class PairString {
        first: string;
        second: string;

        constructor (public curString: string) {
            var index = curString.indexOf(" ");
            this.first = curString.substr(0, index);
            this.second = curString.substr(index, curString.length - index);
        }

        getString() {
            return this.first + " - " + this.second;
        }
    }

    export interface PairArray {
        [index: number]: Pair;
        length: number;
        push(pair: Pair);
    }

    export interface PairArrayS {
        [index: number]: PairString;
        length: number;
        push(pairString: PairString);
    }
}