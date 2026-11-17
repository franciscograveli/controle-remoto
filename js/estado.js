// =============================================================================
// ESTADO
// -----------------------------------------------------------------------------
// Guarda o que está pressionado agora. Botões da tela e teclado usam este
// módulo e não se conhecem entre si.
//
// Cada entrada pressionada liga uma ou mais "rodas":
//   fd = frente direita   td = trás direita
//   fe = frente esquerda  te = trás esquerda
// O estado final é a soma (OU) de tudo o que está pressionado.
// =============================================================================

// id da entrada -> rodas que ela liga. Ex: "tecla-ArrowUp" -> ["fd", "fe"]
const pressionados = new Map();

// Função chamada sempre que o estado muda (definida pelo main.js)
let ouvinte = () => {};

export function aoMudar(funcao) {
  ouvinte = funcao;
}

// Devolve o estado completo no formato que o carrinho espera
export function lerEstado() {
  const estado = { fd: 0, td: 0, fe: 0, te: 0 };
  for (const rodas of pressionados.values()) {
    for (const roda of rodas) estado[roda] = 1;
  }
  return estado;
}

export function pressionar(id, rodas) {
  if (pressionados.has(id)) return;   // ignora a repetição automática do teclado
  pressionados.set(id, rodas);
  ouvinte(lerEstado());
}

export function soltar(id) {
  if (pressionados.delete(id)) ouvinte(lerEstado());
}

// Solta tudo de uma vez (usado quando a aba perde o foco)
export function soltarTudo() {
  if (pressionados.size === 0) return;
  pressionados.clear();
  ouvinte(lerEstado());
}
