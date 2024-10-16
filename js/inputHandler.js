import { solveSimplex } from './simplex.js';

// Convierte las entradas del usuario en matrices
export function parseLinearProblem(objective, constraints) {
    const c = objective.split(',').map(Number);
    const A = constraints.map(row => row.split(',').slice(0, -1).map(Number));
    const b = constraints.map(row => Number(row.split(',').slice(-1)[0]));

    return { c, A, b };
}

// Maneja el envío del formulario
export function handleFormSubmit(event) {
    event.preventDefault();

    const objective = document.getElementById('objective').value;
    const constraints = Array.from(document.getElementsByClassName('constraint-input'))
        .map(input => input.value);

    const { c, A, b } = parseLinearProblem(objective, constraints);
    solveSimplex(c, A, b);
}

// Añade un nuevo campo para restricciones
export function addConstraint() {
    const container = document.getElementById('constraints-container');
    const input = document.createElement('input');
    input.type = 'text';
    input.className = 'constraint-input';
    input.placeholder = 'Ejemplo: 1,2,10';
    input.required = true;
    container.appendChild(input);
    container.appendChild(document.createElement('br'));
}
