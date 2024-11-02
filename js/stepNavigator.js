import { displaySimplexTableau } from "./tableau.js";

let currentStep = 0;
let stepsData = [];

export function handleStepNavigation(steps) {
    stepsData = steps;  // Guardar los pasos generados
    currentStep = 0;    // Comenzar en el primer paso

    if (stepsData.length === 0) {
        console.error('No se han generado pasos para mostrar.');
        return;
    }

    displayStep(currentStep);  // Mostrar el primer paso

    document.getElementById('prev-step').addEventListener('click', () => {
        if (currentStep > 0) {
            currentStep--;  // Ir al paso anterior
            displayStep(currentStep);  // Mostrar el paso anterior
        }
    });

    document.getElementById('next-step').addEventListener('click', () => {
        if (currentStep < stepsData.length - 1) {
            currentStep++;  // Avanzar al siguiente paso
            displayStep(currentStep);  // Mostrar el siguiente paso
        }
    });
}

function displayStep(stepIndex) {
    const step = stepsData[stepIndex];  // Obtener el paso correspondiente
    if (!step) {
        console.error(`No se pudo mostrar el paso ${stepIndex}`);
        return;
    }

    // Mostrar el nombre de la operación realizada en este paso
    document.getElementById('current-step').textContent = `Paso ${stepIndex + 1}: ${step.operation}`;

    // Llamar a displaySimplexTableau para actualizar la tabla con los valores del tableau en este paso
    displaySimplexTableau(stepIndex, step.tableau);
}
