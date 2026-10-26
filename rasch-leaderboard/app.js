'use strict';
const ability = document.getElementById('ability');
const difficulty = document.getElementById('difficulty');
function updatePrediction() {
  const s = Number(ability.value);
  const d = Number(difficulty.value);
  const probability = 1 / (1 + Math.exp(-(s - d)));
  document.getElementById('ability-value').textContent = s.toFixed(1);
  document.getElementById('difficulty-value').textContent = d.toFixed(1);
  document.getElementById('probability').textContent = `${Math.round(probability * 100)}%`;
  document.getElementById('probability-bar').style.width = `${probability * 100}%`;
}
ability.addEventListener('input', updatePrediction);
difficulty.addEventListener('input', updatePrediction);
updatePrediction();
