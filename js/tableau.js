export function buildInitialTableau(c, A, b) {
    const numRestricciones = A.length;
    const identity = Array.from({ length: numRestricciones }, (_, i) =>
        Array.from({ length: numRestricciones }, (_, j) => (i === j ? 1 : 0))
    );

    const tableau = A.map((row, i) => [...row, ...identity[i], b[i]]);
    tableau.push([...c, ...Array(numRestricciones).fill(0), 0]);

    return tableau;
}

export function displaySimplexTableau(iteration, tableau) {
    const resultDiv = document.getElementById('result');
    resultDiv.innerHTML = `<h2>Iteración ${iteration}</h2>`;

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
