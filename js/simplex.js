import { buildInitialTableau, displaySimplexTableau } from './tableau.js';

export function findEnteringColumn(tableau) {
    const zRow = tableau[tableau.length - 1];  // Última fila (función objetivo)
    let maxValue = Math.max(...zRow.slice(0, -1));  // Buscar el valor más positivo
    console.log("Fila Z:", zRow);  // Verificar los valores de Z antes de buscar la columna entrante
    return maxValue <= 0 ? -1 : zRow.indexOf(maxValue);  // Si no hay valores positivos, solución óptima
}

export function findLeavingRow(tableau, col) {
    let minRatio = Infinity;
    let leavingRow = -1;

    // Iterar sobre todas las filas excepto la última (función objetivo)
    tableau.slice(0, -1).forEach((row, i) => {
        const value = row[col];  // Valor en la columna entrante
        const rhs = row[row.length - 1];  // Lado derecho (RHS)

        if (value > 0) {  // Solo consideramos valores positivos en la columna entrante
            const ratio = rhs / value;  // Calculamos la razón mínima
            if (ratio < minRatio) {
                minRatio = ratio;
                leavingRow = i;  // Actualizamos la fila saliente
            }
        }
    });

    return leavingRow;  // Retorna el índice de la fila saliente
}

export function pivot(tableau, pivotRow, pivotCol) {
    const pivotElement = tableau[pivotRow][pivotCol];  // Elemento pivote
    console.log(`Realizando pivote en fila ${pivotRow}, columna ${pivotCol} con valor:`, pivotElement);

    // Dividir la fila pivote por el elemento pivote para convertirlo en 1
    tableau[pivotRow] = tableau[pivotRow].map(value => value / pivotElement);

    // Actualizar las demás filas para que los demás elementos en la columna pivote sean 0
    tableau.forEach((row, i) => {
        if (i !== pivotRow) {
            const factor = row[pivotCol];  // Factor para eliminar los elementos de la columna
            tableau[i] = row.map((value, j) => value - factor * tableau[pivotRow][j]);
        }
    });

    console.log("Tableau después del pivoteo:", tableau);  // Verificar el tableau actualizado
}

export function solveSimplex(c, A, b, operation) {
    const steps = [];
    const cAdjusted = operation === 'maximizar' ? c.map(coef => -coef) : [...c];
    let tableau = buildInitialTableau(cAdjusted, A, b);
    let iteration = 0;

    // Almacenar el tableau inicial
    steps.push({
        iteration,
        tableau: JSON.parse(JSON.stringify(tableau)),  // Clonar el tableau
        operation: "Tableau inicial",
    });

    while (true) {
        const enteringCol = findEnteringColumn(tableau);  // Buscar la columna entrante
        if (enteringCol === -1) {  // Si no hay columna entrante, hemos alcanzado la solución óptima
            steps.push({
                iteration,
                tableau: JSON.parse(JSON.stringify(tableau)),
                operation: "Solución óptima encontrada",
            });
            break;
        }

        const leavingRow = findLeavingRow(tableau, enteringCol);  // Buscar la fila saliente
        if (leavingRow === -1) {  // Si no hay fila saliente, el problema no tiene solución acotada
            console.error("El problema no tiene solución acotada.");
            steps.push({
                iteration,
                tableau: JSON.parse(JSON.stringify(tableau)),
                operation: "Problema no acotado",
            });
            break;
        }

        // Realizar el pivoteo y almacenar el nuevo tableau
        pivot(tableau, leavingRow, enteringCol);
        steps.push({
            iteration: ++iteration,
            tableau: JSON.parse(JSON.stringify(tableau)),  // Clonar el tableau actualizado
            enteringCol,
            leavingRow,
            operation: `Pivote en fila ${leavingRow}, columna ${enteringCol}`,
        });
    }

    console.log("Pasos generados:", steps);  // Mostrar todos los pasos generados
    return steps;
}