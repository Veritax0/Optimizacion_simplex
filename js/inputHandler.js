import { solveSimplex } from './simplex.js';
import { handleStepNavigation } from './stepNavigator.js';

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
    const container = document.getElementById('def-funcion-objetivo');
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

    // Crear la tabla para la ecuación de la función objetivo
    const coefTable = document.createElement('table');
    coefTable.className = 'linear-function-table';
    const row = document.createElement('tr');

    // Añadir las celdas de "Z =", coeficientes, variables y "+"
    let zCell = document.createElement('td');
    zCell.textContent = 'Z';
    row.appendChild(zCell);

    let equalCell = document.createElement('td');
    equalCell.textContent = '=';
    row.appendChild(equalCell);

    for (let i = 1; i <= variables; i++) {
        const inputCell = document.createElement('td');
        const input = document.createElement('input');
        input.type = 'number';
        input.name = `coefficient${i}`;
        input.placeholder = `C_${i}`;
        input.required = true;
        inputCell.appendChild(input);
        row.appendChild(inputCell);

        const variableCell = document.createElement('td');
        variableCell.textContent = `X_${i}`;
        row.appendChild(variableCell);

        if (i < variables) {
            const plusCell = document.createElement('td');
            plusCell.textContent = '+';
            row.appendChild(plusCell);
        }
    }

    coefTable.appendChild(row);
    form.appendChild(coefTable);

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
    const container = document.getElementById('def-restricciones');
    container.innerHTML = ''; 

    const form = document.createElement('form');

    for (let i = 1; i <= restricciones; i++) {
        const restriccionDiv = document.createElement('div');
        restriccionDiv.innerHTML = `<h3>Restricción ${i}</h3>`;

        const restriccionTable = document.createElement('table');
        restriccionTable.className = 'restriccion-table';
        const row = document.createElement('tr');

        for (let j = 1; j <= variables; j++) {
            const inputCell = document.createElement('td');
            const input = document.createElement('input');
            input.type = 'number';
            input.name = `r${i}_v${j}`;
            input.placeholder = `Coef. X${j}`;
            input.required = true;
            inputCell.appendChild(input);
            row.appendChild(inputCell);

            const variableCell = document.createElement('td');
            variableCell.textContent = `X${j}`;
            row.appendChild(variableCell);
        }

        const dropdownCell = document.createElement('td');
        const dropdown = document.createElement('select');
        dropdown.name = `operator${i}`;
        ['<=', '=', '>='].forEach(optionText => {
            const option = document.createElement('option');
            option.value = optionText;
            option.textContent = optionText;
            dropdown.appendChild(option);
        });
        dropdownCell.appendChild(dropdown);
        row.appendChild(dropdownCell);

        const rhsCell = document.createElement('td');
        const rhsInput = document.createElement('input');
        rhsInput.type = 'number';
        rhsInput.name = `rhs${i}`;
        rhsInput.placeholder = 'RHS';
        rhsInput.required = true;
        rhsCell.appendChild(rhsInput);
        row.appendChild(rhsCell);

        restriccionTable.appendChild(row);
        restriccionDiv.appendChild(restriccionTable);
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
    
        // Llamar a solveSimplex y almacenar los pasos
        const steps = solveSimplex(coefficients, A, b, operation);

        if (!Array.isArray(steps)) {
            console.error('La variable steps no es un array.');
        } else if (steps.length > 0) {
            handleStepNavigation(steps);
        } else {
            console.error('No se generaron pasos del método simplex.');
        }
        
        if (steps.length > 0) {
            handleStepNavigation(steps);  // Pasar los pasos para navegar entre ellos
        } else {
            console.error('No se generaron pasos del método simplex.');
        }
    });

    container.appendChild(form);
}

