function solveSimplex(c, A, b, operation) {
    // Ajustar los signos de la función objetivo si es maximización
    const cAdjusted = operation === 'maximizar' ? c.map(coef => -coef) : [...c];

    // Construir el tableau inicial con la matriz identidad para las variables de holgura
    const tableau = buildInitialTableau(cAdjusted, A, b);

    // Mostrar el tableau inicial en la interfaz
    displaySimplexTableau(0, tableau);
    console.log("Tableau Inicial:", tableau);
}

function buildInitialTableau(c, A, b) {
    const numRestricciones = A.length;
    const numVariables = A[0].length;

    // Crear la matriz identidad para las variables de holgura
    const identity = Array.from({ length: numRestricciones }, (_, i) =>
        Array.from({ length: numRestricciones }, (_, j) => (i === j ? 1 : 0))
    );

    // Construir el tableau inicial: [A | I | b]
    const tableau = A.map((row, i) => [...row, ...identity[i], b[i]]);

    // Agregar la fila Z (función objetivo)
    const zRow = [...c, ...Array(numRestricciones).fill(0), 0];
    tableau.push(zRow);

    return tableau;
}

function displaySimplexTableau(iteration, tableau) {
    const resultDiv = document.getElementById('result');
    resultDiv.innerHTML = `<h2>Iteración ${iteration}</h2>`;

    const table = document.createElement('table');
    table.border = "1"; // Opcional: bordes para mejor visualización

    tableau.forEach(row => {
        const tr = document.createElement('tr');
        row.forEach(value => {
            const td = document.createElement('td');
            td.textContent = value;
            tr.appendChild(td);
        });
        table.appendChild(tr);
    });

    resultDiv.appendChild(table);
}
