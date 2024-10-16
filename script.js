document.getElementById('submitBtn').addEventListener('click', function() {
    const operation = document.getElementById('operation').value;
    const totalVariables = document.getElementById('totalVariables').value;
    const totalRestricciones = document.getElementById('totalRestricciones').value;
    
    // Validate inputs
    if (!totalVariables || isNaN(totalVariables) || totalVariables <= 0) {
        alert("Por favor, ingrese un número válido para Total de variables.");
        return;
    }
    
    if (!totalRestricciones || isNaN(totalRestricciones) || totalRestricciones <= 0) {
        alert("Por favor, ingrese un número válido para Total de restricciones.");
        return;
    }

    const resultMessage = `Operación: ${operation.charAt(0).toUpperCase() + operation.slice(1)}<br>
                           Total de variables: ${totalVariables}<br>
                           Total de restricciones: ${totalRestricciones}`;

    document.getElementById('result').innerHTML = resultMessage;
});
