// =============================================================================
// TECLADO
// -----------------------------------------------------------------------------
// Cada seta é uma direção (veja direcoes.js). Segurar duas setas ao mesmo tempo
// soma as rodas; quando sobram frente e trás do mesmo lado, o carrinho as anula
// e o resultado é uma curva. Ex: ↑ + ← = só a roda direita anda para frente.
// =============================================================================

import { pressionar, soltar, soltarTudo } from "./estado.js";
import { DIRECOES } from "./direcoes.js";

const TECLAS = {
  ArrowUp:    "cima",
  ArrowDown:  "baixo",
  ArrowLeft:  "esquerda",
  ArrowRight: "direita",
};

export function iniciarTeclado() {
  window.addEventListener("keydown", (e) => {
    // Espaço = PARAR (solta tudo)
    if (e.key === " " && e.target.tagName !== "INPUT") {
      e.preventDefault();
      soltarTudo();
      return;
    }

    if (!deveTratar(e)) return;
    e.preventDefault();   // impede a página de rolar
    pressionar("tecla-" + e.key, DIRECOES[TECLAS[e.key]]);
  });

  window.addEventListener("keyup", (e) => {
    if (!(e.key in TECLAS)) return;
    soltar("tecla-" + e.key);
  });
}

// Só trata as setas, e não atrapalha quem está digitando no campo de IP
function deveTratar(e) {
  return e.key in TECLAS && e.target.tagName !== "INPUT";
}
