// Ejecuta el algoritmo simplex revisado hasta encontrar la solución
import { buildInitialTableau, displaySimplexTableau } from './tableau.js';

// Encuentra la columna entrante (la de mayor valor negativo en la fila Z)
export function findEnteringColumn(tableau) {
    const zRow = tableau[tableau.length - 1];
    let minValue = Math.min(...zRow.slice(0, -1));
    return minValue >= 0 ? -1 : zRow.indexOf(minValue);
}

// Encuentra la fila saliente utilizando la regla de la razón mínima
export function findLeavingRow(tableau, col) {
    let minRatio = Infinity;
    let leavingRow = -1;

    tableau.slice(0, -1).forEach((row, i) => {
        const value = row[col];
        const rhs = row[row.length - 1];

        if (value > 0) {
            const ratio = rhs / value;
            if (ratio < minRatio) {
                minRatio = ratio;
                leavingRow = i;
            }
        }
    });

    return leavingRow;
}

// Realiza el pivotaje
export function pivot(tableau, pivotRow, pivotCol) {
    const pivotElement = tableau[pivotRow][pivotCol];

    // Dividir la fila pivote por el elemento pivote
    tableau[pivotRow] = tableau[pivotRow].map(value => value / pivotElement);

    // Actualizar las demás filas
    tableau.forEach((row, i) => {
        if (i !== pivotRow) {
            const factor = row[pivotCol];
            tableau[i] = row.map((value, j) => value - factor * tableau[pivotRow][j]);
        }
    });
}

export function solveSimplex(c, A, b, operation) {
    const cAdjusted = operation === 'maximizar' ? c.map(coef => -coef) : [...c];
    const tableau = buildInitialTableau(cAdjusted, A, b);

    displaySimplexTableau(0, tableau);
}
