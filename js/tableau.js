// Crea la tabla inicial del simplex (tableau)
export function buildInitialTableau(c, A, b) {
    const tableau = A.map((row, i) => [...row, b[i]]);
    tableau.push([...c, 0]); // Agregar la fila Z (función objetivo)
    return tableau;
}

// Muestra una tabla de iteración en pantalla
export function displaySimplexIteration(iteration, tableau) {
    const resultDiv = document.getElementById('result');
    resultDiv.innerHTML += `<h2>Iteración ${iteration}</h2>`;

    const table = document.createElement('table');
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
