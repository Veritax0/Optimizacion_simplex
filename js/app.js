import { handleFormSubmit } from './inputHandler.js';

window.addEventListener('DOMContentLoaded', () => {
    document.getElementById('simplex-form').addEventListener('submit', handleFormSubmit);
});
