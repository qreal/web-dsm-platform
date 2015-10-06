class Parser {
    private index: number = 0;
    private expr: string;
    private env;
    private types = {
        NUMBER: 0,
        VARIABLE: 1,
        OBRACKET: 2,
        CBRACKET: 3,
        ADD: 4,
        SUB: 5,
        MUL: 6,
        DIV: 7,
        MOD: 8,
        NOT: 9,
        EOF: 10,
        ERROR: 11,
        EQ: 12,
        NEQ: 13,
        GR: 14,
        LE: 15,
        GOE: 16,
        LOE: 17,
        AND: 18,
        OR: 19,
        ASSIGN: 20,
        SEMICOLON: 21
    };
    private type;
    error;
    result;

    constructor (str: string, env) {
        this.expr = str;
        this.env = env;
    }

    parseExpression() {
        this.parseExpr();
        if (this.error == null) {
            if (this.type != this.types.EOF) {
                this.error = "Parse error on " + this.index;
                this.type = this.types.ERROR;
            }
        }
    }

    parseAssignments() {
        this.parseNext();
        while (this.type != this.types.EOF && this.type != this.types.ERROR) {
            if (this.type != this.types.VARIABLE) {
                this.error = "Variable expected";
                break;
            }
            this.parseAssign();
            this.parseNext();
        }
    }

    private parseAssign() {
        var name = this.result;
        this.parseNext();
        if (this.type == this.types.ASSIGN) {
            this.parseExpr();
            this.env[name] = this.result;
            if (this.type != this.types.SEMICOLON) {
                this.type = this.types.ERROR;
                this.error = "Semicolon expected";
            }
        }
        else {
            this.type = this.types.ERROR;
            this.error = "Assignment expected";
        }
    }

    private parseExpr() {
        if (this.error == null) {
            this.parseOr();
        }
    }

    private parseOr() {
        if (this.error == null) {
            this.parseAnd();
            var result = this.result;
            if (this.type == this.types.OR) {
                this.parseOr();
                this.result = this.result || result;
            }
        }
    }

    private parseAnd() {
        if (this.error == null) {
            this.parseComp();
            var result = this.result;
            if (this.type == this.types.AND) {
                this.parseAnd();
                this.result = this.result && result;
            }
        }
    }

    private parseComp() {
        if (this.error == null) {
            this.parseTerm();
            var result = this.result;
            if (this.type == this.types.EQ) {
                this.parseTerm();
                this.result = result == this.result;
            }
            else if (this.type == this.types.NEQ) {
                this.parseTerm();
                this.result = result != this.result;
            }
            else if (this.type == this.types.GR) {
                this.parseTerm();
                this.result = result > this.result;
            }
            else if (this.type == this.types.LE) {
                this.parseTerm();
                this.result = result < this.result;
            }
            else if (this.type == this.types.GOE) {
                this.parseTerm();
                this.result = result >= this.result;
            }
            else if (this.type == this.types.LOE) {
                this.parseTerm();
                this.result = result <= this.result;
            }
        }
    }

    private parseTerm() {
        if (this.error == null) {
            this.parseFactor();
            var result = this.result;
            var type = this.type;
            while (type == this.types.ADD || type == this.types.SUB) {
                this.parseFactor();
                if (type == this.types.ADD) {
                    result += this.result;
                }
                else {
                    result -= this.result;
                }
                type = this.type;
            }
            this.result = result;
        }
    }

    private parseFactor() {
        if (this.error == null) {
            this.parseUnary();
            var result = this.result;
            this.parseNext();
            var type = this.type;
            while (type == this.types.MUL || type == this.types.DIV) {
                this.parseUnary();
                if (type == this.types.MUL) {
                    result *= this.result;
                }
                else if (this.result == 0) {
                    this.error = "Division by zero!";
                    this.type = this.types.ERROR;
                    break;
                }
                else if (type == this.types.MOD) {
                    result %= this.result;
                }
                else {
                    result /= this.result;
                }
                this.parseNext();
                type = this.type;
            }
            this.result = result;
        }
    }

    private parseUnary() {
        if (this.error == null) {
            this.parseNext();
            if (this.type == this.types.NOT) {
                this.parseNext();
                this.parsePrimary();
                this.result = !this.result;
            }
            else if (this.type == this.types.SUB) {
                this.parseNext();
                this.parsePrimary();
                this.result = -this.result;
            }
            else {
                this.parsePrimary();
            }
        }
    }

    private parsePrimary() {
        if (this.error == null) {
            if (this.type == this.types.OBRACKET) {
                this.parseExpr();
                if (this.type != this.types.CBRACKET) {
                    this.error = "Close bracket expected";
                    this.type = this.types.ERROR;
                }
            }
            else if (this.type == this.types.VARIABLE) {
                if (this.env.hasOwnProperty(this.result)) {
                    this.result = this.env[this.result];
                }
                else {
                    this.error = "Undefined variable: " + this.result;
                    this.type = this.types.ERROR;
                }
            }
            else if (this.type != this.types.NUMBER) {
                this.error = "Primary expected";
                this.type = this.types.ERROR;
            }
        }
    }

    private parseNext() {
        if (this.error == null) {
            if (this.index == this.expr.length) {
                this.type = this.types.EOF;
            }
            else {
                var cur = this.expr.charCodeAt(this.index);

                if (cur == ' '.charCodeAt(0)) {
                    this.parseVoid();
                    this.parseNext();
                }
                else if (cur >= '0'.charCodeAt(0) && cur <= '9'.charCodeAt(0)) {
                    this.parseInt();
                    this.type = this.types.NUMBER;
                }
                else if (cur >= 'a'.charCodeAt(0) && cur <= 'z'.charCodeAt(0)
                      || cur >= 'A'.charCodeAt(0) && cur <= 'Z'.charCodeAt(0)) {
                    this.parseVar();
                }
                else if (cur == '('.charCodeAt(0)) {
                    this.type = this.types.OBRACKET;
                    this.index++;
                }
                else if (cur == ')'.charCodeAt(0)) {
                    this.type = this.types.CBRACKET;
                    this.index++;
                }
                else if (cur == '+'.charCodeAt(0)) {
                    this.type = this.types.ADD;
                    this.index++;
                }
                else if (cur == '-'.charCodeAt(0)) {
                    this.type = this.types.SUB;
                    this.index++;
                }
                else if (cur == '*'.charCodeAt(0)) {
                    this.type = this.types.MUL;
                    this.index++;
                }
                else if (cur == '/'.charCodeAt(0)) {
                    this.type = this.types.DIV;
                    this.index++;
                }
                else if (cur == '%'.charCodeAt(0)) {
                    this.type = this.types.MOD;
                    this.index++;
                }
                else if (cur == '!'.charCodeAt(0)) {
                    this.index++;
                    if (this.expr[this.index] == '=') {
                        this.type = this.types.NEQ;
                        this.index++;
                    }
                    else {
                        this.type = this.types.NOT;
                    }
                }
                else if (cur == '<'.charCodeAt(0)) {
                    this.index++;
                    if (this.expr[this.index] == '=') {
                        this.type = this.types.LOE;
                        this.index++;
                    }
                    else {
                        this.type = this.types.LE;
                    }
                }
                else if (cur == '>'.charCodeAt(0)) {
                    this.index++;
                    if (this.expr[this.index] == '=') {
                        this.type = this.types.GOE;
                        this.index++;
                    }
                    else {
                        this.type = this.types.GR;
                    }
                }
                else if (cur == '='.charCodeAt(0)) {
                    this.index++;
                    if (this.expr[this.index] == '=') {
                        this.type = this.types.EQ;
                        this.index++;
                    }
                    else {
                        this.type = this.types.ASSIGN;
                    }
                }
                else if (cur == '&'.charCodeAt(0) && this.expr[this.index + 1] == '&') {
                    this.index += 2;
                    this.type = this.types.AND;
                }
                else if (cur == '|'.charCodeAt(0) && this.expr[this.index + 1] == '|') {
                    this.index += 2;
                    this.type = this.types.OR;
                }
                else if (cur == ';'.charCodeAt(0)) {
                    this.index++;
                    this.type = this.types.SEMICOLON;
                }
                else {
                    this.error = "Unexpected character";
                    this.type = this.types.ERROR;
                }
            }
        }
    }

    private parseVoid(): void {
        if (this.type != this.types.EOF) {
            while (this.expr[this.index] == ' ') {
                this.index++;
            }
        }
    }

    private parseInt() {
        if (this.error == null) {
            var cur = this.expr.charCodeAt(this.index);
            this.result = 0;
            while (cur >= '0'.charCodeAt(0) && cur <= '9'.charCodeAt(0)) {
                this.result = this.result * 10 + (cur - '0'.charCodeAt(0));
                this.index++;
                cur = this.expr.charCodeAt(this.index);
            }
        }
    }

    private parseVar() {
        if (this.error == null) {
            var i = this.index + 1;
            var cur = this.expr.charCodeAt(i);
            while (cur >= 'a'.charCodeAt(0) && cur <= 'z'.charCodeAt(0)
                || cur >= 'A'.charCodeAt(0) && cur <= 'Z'.charCodeAt(0)
                || cur >= '0'.charCodeAt(0) && cur <= '9'.charCodeAt(0)
                || cur == '_'.charCodeAt(0))
            {
                i++;
                cur = this.expr.charCodeAt(i);
            }
            var variable = this.expr.substring(this.index, i);
            this.type = this.types.VARIABLE;
            this.result = variable;
            this.index = i;
        }
    }


}
