function copy(arr) {
    const result = new Array(arr.length);
    
    for (let i = 0; i < arr.length; i++) {
        result[i] = arr[i];
    }

    return result;
}

class Row extends Array {
    constructor(...args) {
        super();
        this.push(...args);
    }

    takeOut(row) {
        return this.map((v, i) => v - row[i]);
    }

    apply(row) {
        return this.map((v, i) => v + row[i]);
    }

    multiply(coef) {
        return this.map(v => v * coef);
    }

    aggregate(arr) {
        return this.reduce((acc, v, i) => acc + v * arr[i], 0);
    }

    map(...args) {
        return  new Row(...super.map(...args));
    }
}

class Column extends Array {
    constructor(...args) {
        super();
        this.push(...args);
    }

    takeOut(column) {
        return this.map((v, i) => v - column[i]);
    }

    apply(column) {
        return this.map((v, i) => v + column[i]);
    }

    multiply(coef) {
        return this.map(v => v * coef);
    }

    aggregate(arr) {
        return this.reduce((acc, v, i) => acc + v * arr[i], 0);
    }

    map(...args) {
        return  new Column(...super.map(...args));
    }
}

class Matrix {
    constructor(options) {
        this.rowsCount = options.rows;
        this.columnsCount = options.columns;

        this.__values = options.values || this.__setEmptyValues();
    }

    getRow(n) {
        const row = [];
        const values = this.values;
        const offset = this.columnsCount * (n - 1);

        for (let i = 0; i < this.columnsCount; i++) {
            row.push(values[i + offset]);
        }

        return row;
    }

    setRow(n, row) {
        if (!this.rows[n - 1]) {
            return;
        }

        this.rows[n - 1] = row;
    }

    getColumn(n) {
        const column = [];
        const values = this.values;

        for (let i = 0; i < this.rowsCount; i++) {
            column.push(values[i * this.columnsCount + n - 1]);
        }
        
        return column;
    }

    setColumn(n, column) {
        if (!this.columns[n - 1]) {
            return;
        }

        this.columns[n - 1] = column;
    }

    multiplyOn(coef) {
        // for test
        let values = [];
        for (let i = 0; i < this.values.length; i++) {
            values.push(this.values[i] * coef);
        }

        let resultMatrix = new Matrix({
            rows: this.rowsCount,
            columns: this.columnsCount,
            values: values
        });

        // const values = this.values.map(i => i * coef);
        // resultMatrix.values = values;

        return resultMatrix;
    }

    overwrite(f) {
        // for test
        let values = [];
        for (let i = 0; i < this.values.length; i++) {
            values.push(f(this.values[i]));
        }

        let resultMatrix = new Matrix({
            rows: this.rowsCount,
            columns: this.columnsCount,
            values: values
        });

        return resultMatrix;
    }

    transpose() {
        const resultMatrix = new Matrix({
            rows: this.columnsCount,
            columns: this.rowsCount,
            values: this.transposeValues
        });

        return resultMatrix;
    }

    __setEmptyValues() {
        const empty = [];
        for (let i = 0; i < this.rowsCount * this.columnsCount; i++) {
            empty.push(0);
        }

        return empty;
    }

    set values(vals) {
        this.__values = vals;
        // this.__initRows();
        // this.__initColumns();
    }

    get values() {
        return this.__values;
    }

    get averValue() {
        return this.__values.reduce((acc, i) => acc + i, 0) / this.__values.length;
    }

    get transposeValues() {
        let values = [];
        for (let i = 0; i < this.columnsCount; i++) {
            const column = this.getColumn(i + 1);

            // for test
            for (let j = 0; j < column.length; j++) {
                values.push(column[j]);
            }
            // values.push(...column);
        }

        //const values = this.columns.reduce((acc ,c) => acc.concat(c), []);
        return values;
    }

    static multiply(A, B) {
        if (A.rowsCount != B.rowsCount || A.columnsCount != B.columnsCount) {
            console.warn("Cannot multiply not matched matrixes");
        }

        const AValues = A.values;
        const BValues = B.values;
        const SValues = [];//AValues.map((v, i) => v * BValues[i]);

        // for test
        for (let i = 0; i < AValues.length; i++) {
            SValues.push(AValues[i] * BValues[i]); 
        }

        const resultMatrix = new Matrix({
            rows: A.rowsCount,
            columns: A.columnsCount,
            values: SValues
        });

        //resultMatrix.values = values;
        return resultMatrix;
    }

    static divide(A, B) {
        if (A.rowsCount != B.rowsCount || A.columnsCount != B.columnsCount) {
            console.warn("Cannot divide not matched matrixes");
        }

        const AValues = A.values;
        const BValues = B.values;
        const SValues = [];//AValues.map((v, i) => v * BValues[i]);

        // for test
        for (let i = 0; i < AValues.length; i++) {
            SValues.push(AValues[i] / BValues[i]); 
        }

        const resultMatrix = new Matrix({
            rows: A.rowsCount,
            columns: A.columnsCount,
            values: SValues
        });

        //resultMatrix.values = values;
        return resultMatrix;
    }

    static summ(A, B) {
        if (A.rowsCount != B.rowsCount || A.columnsCount != B.columnsCount) {
            console.warn("Cannot sum not matched matrixes");
        }        

        const AValues = A.values;
        const BValues = B.values;
        const SValues = []; //AValues.map((v, i) => v + BValues[i]);

        for (let i = 0; i < AValues.length; i++) {
            SValues.push(AValues[i] + BValues[i]); 
        }

        const resultMatrix = new Matrix({
            rows: A.rowsCount,
            columns: A.columnsCount,
            values: SValues
        });

        //resultMatrix.values = values;
        return resultMatrix;
    }

    static difference(A, B) {
        if (A.rowsCount != B.rowsCount || A.columnsCount != B.columnsCount) {
            console.warn("Cannot take difference between not matched matrixes");
        }

        const AValues = A.values;
        const BValues = B.values;
        const DValues = []; //AValues.map((v, i) => v - BValues[i]);
        
        for (let i = 0; i < AValues.length; i++) {
            DValues.push(AValues[i] - BValues[i]); 
        }

        const resultMatrix = new Matrix({
            rows: A.rowsCount,
            columns: A.columnsCount,
            values: DValues
        });

        //resultMatrix.values = values;
        return resultMatrix;
    }

    static multiplication(A, B) {
        if (A.columnsCount != B.rowsCount) {
            console.warn("Cannot make multiplication between not matched matrixes");
        }

        const values = [];

        for (let j = 1; j <= A.rowsCount; j++) {
            const row = A.getRow(j);

            for (let i = 1; i <= B.columnsCount; i++) {
                const column = B.getColumn(i);
                //const ag = row.reduce((acc, v, i) => acc + v * column[i], 0);
                
                // for test
                let reduceResult = 0;
                for (let k = 0; k < row.length; k++) {
                    reduceResult += row[k] * column[k];
                }
                values.push(reduceResult);
            }
        }

        const resultMatrix = new Matrix({
            rows: A.rowsCount,
            columns: B.columnsCount,
            values: values
        });

        //resultMatrix.values = values;
        return resultMatrix;
    }
}