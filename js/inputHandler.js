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

    // Create a table for the expression "Z = <input1> X_1 + <input2> X_2 + ..."
    const coefTable = document.createElement('table');
    coefTable.className = 'linear-function-table';
    const row = document.createElement('tr');

    // Add the "Z" cell
    let zCell = document.createElement('td');
    zCell.textContent = 'Z';
    row.appendChild(zCell);

    // Add the "=" cell
    let equalCell = document.createElement('td');
    equalCell.textContent = '=';
    row.appendChild(equalCell);

    // Add input cells, variable cells, and "+" cells between them
    for (let i = 1; i <= variables; i++) {
        // Create and append input cell
        const inputCell = document.createElement('td');
        const input = document.createElement('input');
        input.type = 'number';
        input.name = `coefficient${i}`;
        input.placeholder = `C_${i}`;
        input.required = true;
        inputCell.appendChild(input);
        row.appendChild(inputCell);

        // Create and append variable cell (e.g., X1, X2)
        const variableCell = document.createElement('td');
        variableCell.textContent = `X_${i}`;
        row.appendChild(variableCell);

        // Add "+" cell after each variable except the last one
        if (i < variables) {
            const plusCell = document.createElement('td');
            plusCell.textContent = '+';
            row.appendChild(plusCell);
        }
    }

    coefTable.appendChild(row); // Add the row to the table
    form.appendChild(coefTable); // Append the table to the form


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

        // Create a table for each restriction
        const restriccionTable = document.createElement('table');
        restriccionTable.className = 'restriccion-table';
        const row = document.createElement('tr');

        // Add input cells and variable labels
        for (let j = 1; j <= variables; j++) {
            // Input cell
            const inputCell = document.createElement('td');
            const input = document.createElement('input');
            input.type = 'number';
            input.name = `r${i}_v${j}`;
            input.placeholder = `Coef. X${j}`;
            input.required = true;
            inputCell.appendChild(input);
            row.appendChild(inputCell);

            // Variable label cell (e.g., X1, X2)
            const variableCell = document.createElement('td');
            variableCell.textContent = `X${j}`;
            row.appendChild(variableCell);
        }

        // Dropdown menu cell for comparison operator
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

        // RHS input cell
        const rhsCell = document.createElement('td');
        const rhsInput = document.createElement('input');
        rhsInput.type = 'number';
        rhsInput.name = `rhs${i}`;
        rhsInput.placeholder = 'RHS';
        rhsInput.required = true;
        rhsCell.appendChild(rhsInput);
        row.appendChild(rhsCell);

        // Append row to the table and the table to restriccionDiv
        restriccionTable.appendChild(row);
        restriccionDiv.appendChild(restriccionTable);
        form.appendChild(restriccionDiv);
    }

    // Add a submit button
    const solveButton = document.createElement('button');
    solveButton.textContent = 'Resolver';
    solveButton.type = 'submit';
    form.appendChild(solveButton);

    container.appendChild(form);

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
