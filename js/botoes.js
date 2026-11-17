// =============================================================================
// BOTÕES NA TELA
// -----------------------------------------------------------------------------
// Cada botão do HTML tem data-direcao="cima" | "baixo" | "esquerda" | "direita".
// Fica pressionado enquanto você segura e solta ao soltar.
// =============================================================================

import { pressionar, soltar, soltarTudo } from "./estado.js";
import { DIRECOES } from "./direcoes.js";

const botoes = document.querySelectorAll("[data-direcao]");

export function iniciarBotoes() {
  botoes.forEach(configurarBotao);

  // PARAR: solta tudo de uma vez
  document.getElementById("parar").addEventListener("click", soltarTudo);
}

function configurarBotao(botao) {
  const direcao = botao.dataset.direcao;
  const id = "botao-" + direcao;

  botao.addEventListener("pointerdown", (e) => {
    // "captura" o ponteiro: o soltar chega aqui mesmo se o mouse sair do botão
    botao.setPointerCapture(e.pointerId);
    pressionar(id, DIRECOES[direcao]);
  });

  botao.addEventListener("pointerup", () => soltar(id));
  botao.addEventListener("pointercancel", () => soltar(id));

  // impede o menu que aparece ao segurar o dedo
  botao.addEventListener("contextmenu", (e) => e.preventDefault());
}

// Pinta de verde o botão cujas duas rodas estão ligadas (vale também para o teclado)
export function desenharBotoes(estado) {
  botoes.forEach((botao) => {
    const rodas = DIRECOES[botao.dataset.direcao];
    botao.classList.toggle("ativo", rodas.every((roda) => estado[roda] === 1));
  });
}
