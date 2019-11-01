class Row extends Array {
    constructor(...args) {
        super(...args);
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
        super(...args);
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
        this.valuesCount = this.rowsCount * this.columnsCount;

        this.rows = [];
        this.columns = [];

        this.__values = options.values || [];

        this.__initRows();
        this.__initColumns();
    }

    getRow(n) {
        return this.rows[n - 1] || null;
    }

    setRow(n, row) {
        if (!this.rows[n - 1]) {
            return;
        }

        this.rows[n - 1] = row;
    }

    getColumn(n) {
        return this.columns[n - 1] || null;
    }

    setColumn(n, column) {
        if (!this.columns[n - 1]) {
            return;
        }

        this.columns[n - 1] = column;
    }

    multiplyOn(coef) {
        const resultMatrix = new Matrix({
            rows: this.rowsCount,
            columns: this.rowsCount
        });

        const values = this.values.map(i => i * coef);
        resultMatrix.values = values;

        return resultMatrix;
    }

    __initRows() {
        const rows = [];

        for (let j = 0; j < this.rowsCount; j++) {
            const values = [];
            for (let i = 0; i < this.columnsCount; i++) {
                let index = j * this.columnsCount + i;
                const rowValue = this.__values[index] || 0;

                values.push(rowValue);
            }

            const row = new Row(...values);
            rows.push(row);
        }

        this.rows = rows;
    }

    __initColumns() {
        const columns = [];

        for (let j = 0; j < this.columnsCount; j++) {
            const values = [];
            for (let i = 0; i < this.rowsCount; i++) {
                let index = j + i * this.rowsCount;
                const columnValue = this.__values[index] || 0;

                values.push(columnValue);
            }

            const column = new Column(...values);
            columns.push(column);
        }

        this.columns = columns;
    }

    set values(vals) {
        this.__values = vals.slice();
        this.__initRows();
        this.__initColumns();
    }

    get values() {
        return this.__values.slice();
    }

    static summ(A, B) {
        if (A.rowsCount != B.rowsCount || A.columnsCount != B.columnsCount) {
            console.warn("Cannot sum not matched matrixes");
        }

        const resultMatrix = new Matrix({
            rows: A.rowsCount,
            columns: A.rowsCount
        });

        const AValues = A.values;
        const BValues = B.values;
        const SValues = AValues.map((v, i) => v + BValues[i]);

        resultMatrix.values = SValues;
        return resultMatrix;
    }

    static difference(A, B) {
        if (A.rowsCount != B.rowsCount || A.columnsCount != B.columnsCount) {
            console.warn("Cannot take difference between not matched matrixes");
        }

        const resultMatrix = new Matrix({
            rows: A.rowsCount,
            columns: A.rowsCount
        });

        const AValues = A.values;
        const BValues = B.values;
        const DValues = AValues.map((v, i) => v - BValues[i]);

        resultMatrix.values = DValues;
        return resultMatrix;
    }

    static multiplication(A, B) {
        if (A.columnsCount != B.rowsCount) {
            console.warn("Cannot make multiplication between not matched matrixes");
        }

        const resultMatrix = new Matrix({
            rows: A.columnsCount,
            columns: B.rowsCount
        });

        const values = [];

        for (let j = 1; j <= resultMatrix.rowsCount; j++) {
            const row = A.getRow(j);
            for (let i = 1; i <= resultMatrix.columnsCount; i++) {
                const column = B.getColumn(i);
                const ag = row.aggregate(column);
                values.push(ag);
            }
        }

        resultMatrix.values = values;
        return resultMatrix;
    }
}