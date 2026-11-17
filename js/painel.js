// =============================================================================
// PAINEL DE ESTADO
// -----------------------------------------------------------------------------
// Mostra o que está sendo enviado ao carrinho:
//   - "Parado" ou "Em movimento"
//   - as 4 rodas (acesa = ligada)
//   - a mensagem JSON exata
// =============================================================================

const marcador = document.getElementById("marcador");
const textoEstado = document.getElementById("estado-texto");
const textoJson = document.getElementById("json");
const rodas = document.querySelectorAll(".rodas [data-roda]");

export function desenharPainel(estado) {
  const parado = Object.values(estado).every((valor) => valor === 0);

  textoEstado.textContent = parado ? "Parado" : "Em movimento";
  marcador.classList.toggle("movendo", !parado);

  rodas.forEach((roda) => {
    roda.classList.toggle("ligada", estado[roda.dataset.roda] === 1);
  });

  textoJson.textContent = JSON.stringify(estado);
}
