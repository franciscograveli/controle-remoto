// =============================================================================
// MAPA DE PRÉ-VISUALIZAÇÃO
// -----------------------------------------------------------------------------
// Mostra um carrinho num mapa e desenha o caminho por onde ele "andou".
// É uma SIMULAÇÃO: não recebe nada do carrinho de verdade (ele não tem sensor
// de posição). O desenho é calculado só com o estado das 4 rodas, do mesmo
// jeito que um carrinho de duas rodas motorizadas se move:
//   - as duas rodas para frente  -> anda reto
//   - uma roda mais rápida       -> faz curva para o lado da roda mais lenta
//   - rodas em sentidos opostos  -> gira no próprio eixo
// =============================================================================

import { lerEstado } from "./estado.js";

const INTERVALO_MS = 40;   // o mapa se atualiza 25 vezes por segundo
const PASSO = 0.5;         // quanto anda por atualização (% do mapa) na velocidade máxima
const GIRO = 4;            // quanto gira por atualização (graus) no giro máximo
const MAX_PONTOS = 400;    // tamanho máximo do rastro
const MIN = 8;             // limites do mapa (%), para o carro não sair da tela
const MAX = 92;

const carroEl = document.getElementById("carro");
const linhas = document.querySelectorAll(".rota polyline");

let carro = novoCarro();

function novoCarro() {
  return { x: 50, y: 50, angulo: 0, rastro: [{ x: 50, y: 50 }] };
}

const limitar = (valor, min, max) => Math.min(max, Math.max(min, valor));

// Calcula a nova posição do carro a partir do estado das rodas
function mover(carro, estado) {
  // velocidade de cada lado: +1 frente, -1 trás, 0 parado (frente + trás se anulam)
  const esquerda = estado.fe - estado.te;
  const direita = estado.fd - estado.td;

  const avanco = (esquerda + direita) / 2;   // para frente ou para trás
  const giro = (direita - esquerda) / 2;     // positivo = vira para a esquerda

  if (avanco === 0 && giro === 0) return carro;   // parado: nada muda

  const angulo = carro.angulo - giro * GIRO;
  const radianos = (angulo * Math.PI) / 180;

  // 0 graus = para cima; o eixo y da tela cresce para baixo
  const x = limitar(carro.x + Math.sin(radianos) * avanco * PASSO, MIN, MAX);
  const y = limitar(carro.y - Math.cos(radianos) * avanco * PASSO, MIN, MAX);

  const andou = x !== carro.x || y !== carro.y;
  const rastro = andou ? [...carro.rastro.slice(-(MAX_PONTOS - 1)), { x, y }] : carro.rastro;

  return { x, y, angulo, rastro };
}

// Posiciona o carro e redesenha o rastro
function desenhar() {
  carroEl.style.left = `${carro.x}%`;
  carroEl.style.top = `${carro.y}%`;
  carroEl.style.transform = `translate(-50%, -50%) rotate(${carro.angulo}deg)`;

  // as 3 linhas (borda, cor e tracejado) usam os mesmos pontos
  const pontos = carro.rastro.map((p) => `${p.x},${p.y}`).join(" ");
  linhas.forEach((linha) => linha.setAttribute("points", pontos));
}

export function iniciarMapa() {
  setInterval(() => {
    const novo = mover(carro, lerEstado());
    if (novo === carro) return;   // parado
    carro = novo;
    desenhar();
  }, INTERVALO_MS);

  document.getElementById("reiniciar-mapa").addEventListener("click", () => {
    carro = novoCarro();
    desenhar();
  });

  desenhar();
}
