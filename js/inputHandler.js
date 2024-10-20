import { solveSimplex } from './simplex.js';

export function handleFormSubmit(event) {
    event.preventDefault();

    const totalVariables = parseInt(document.getElementById('totalVariables').value);
    const totalRestricciones = parseInt(document.getElementById('totalRestricciones').value);

    if (isNaN(totalVariables) || totalVariables <= 0 || isNaN(totalRestricciones) || totalRestricciones <= 0) {
        alert("Por favor ingrese números válidos.");
        return;
    }

    generarFormularioFuncionObjetivo(totalVariables, totalRestricciones);
}

function generarFormularioFuncionObjetivo(variables, restricciones) {
    const container = document.getElementById('generatedContent');
    container.innerHTML = ''; 

    const form = document.createElement('form');
    form.className = 'linear-function-form';

    form.innerHTML = `
        <h2>Función Objetivo</h2>
        <select id="operation" required>
            <option value="maximizar">Maximizar</option>
            <option value="minimizar">Minimizar</option>
        </select>
    `;

    for (let i = 1; i <= variables; i++) {
        const input = document.createElement('input');
        input.type = 'number';
        input.name = `coefficient${i}`;
        input.placeholder = `Coeficiente X${i}`;
        input.required = true;
        form.appendChild(input);
    }

    const nextButton = document.createElement('button');
    nextButton.textContent = 'Continuar';
    nextButton.type = 'button';
    form.appendChild(nextButton);

    nextButton.addEventListener('click', () => {
        const formData = new FormData(form);
        const operation = formData.get('operation');
        const coefficients = Array.from(formData.entries())
            .filter(([key]) => key.startsWith('coefficient'))
            .map(([, value]) => parseFloat(value));

        generarFormularioRestricciones(restricciones, variables, coefficients, operation);
    });

    container.appendChild(form);
}

function generarFormularioRestricciones(restricciones, variables, coefficients, operation) {
    const container = document.getElementById('generatedContent');
    container.innerHTML = '';

    const form = document.createElement('form');

    for (let i = 1; i <= restricciones; i++) {
        const restriccionDiv = document.createElement('div');
        restriccionDiv.innerHTML = `<h3>Restricción ${i}</h3>`;

        for (let j = 1; j <= variables; j++) {
            const input = document.createElement('input');
            input.type = 'number';
            input.name = `r${i}_v${j}`;
            input.placeholder = `Coef. X${j}`;
            input.required = true;
            restriccionDiv.appendChild(input);
        }

        const rhsInput = document.createElement('input');
        rhsInput.type = 'number';
        rhsInput.name = `rhs${i}`;
        rhsInput.placeholder = 'RHS';
        rhsInput.required = true;
        restriccionDiv.appendChild(rhsInput);

        form.appendChild(restriccionDiv);
    }

    const solveButton = document.createElement('button');
    solveButton.textContent = 'Resolver';
    solveButton.type = 'submit';
    form.appendChild(solveButton);

    form.addEventListener('submit', (event) => {
        event.preventDefault();
        const formData = new FormData(form);
        const A = [];
        const b = [];

        for (let i = 1; i <= restricciones; i++) {
            const row = [];
            for (let j = 1; j <= variables; j++) {
                row.push(parseFloat(formData.get(`r${i}_v${j}`)));
            }
            A.push(row);
            b.push(parseFloat(formData.get(`rhs${i}`)));
        }

        solveSimplex(coefficients, A, b, operation);
    });

    container.appendChild(form);
}
