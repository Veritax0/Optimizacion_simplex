// Función para crear el tableau inicial
export function buildInitialTableau(c, A, b) {
    const numRestricciones = A.length;
    const identity = Array.from({ length: numRestricciones }, (_, i) =>
        Array.from({ length: numRestricciones }, (_, j) => (i === j ? 1 : 0))
    );

    // Crear el tableau inicial: [A | I | b]
    const tableau = A.map((row, i) => [...row, ...identity[i], b[i]]);
    tableau.push([...c, ...Array(numRestricciones).fill(0), 0]);

    return tableau;
}

// Función para mostrar el tableau en la interfaz (dentro de "result")
export function displaySimplexTableau(iteration, tableau) {
    const resultDiv = document.getElementById('result');
    
    // Limpiar el contenido previo del div
    resultDiv.innerHTML = `<h2>Iteración ${iteration}</h2>`;

    // Crear una nueva tabla HTML
    const table = document.createElement('table');
    table.border = "1";  // Asegurarse de que la tabla tenga bordes visibles

    tableau.forEach(row => {
        const tr = document.createElement('tr');
        row.forEach(value => {
            const td = document.createElement('td');
            td.textContent = value.toFixed(2);  // Mostrar los valores con 2 decimales
            tr.appendChild(td);
        });
        table.appendChild(tr);
    });

    // Añadir la tabla generada al div "result"
    resultDiv.appendChild(table);
}
