import { handleFormSubmit, addConstraint } from './inputHandler.js';

window.addEventListener('DOMContentLoaded', () => {
    document.getElementById('simplex-form').addEventListener('submit', handleFormSubmit);
    document.getElementById('add-constraint').addEventListener('click', addConstraint);
});
