// =============================================================================
// DIREÇÕES
// -----------------------------------------------------------------------------
// Cada direção liga duas rodas. Botões da tela e setas do teclado usam esta
// mesma tabela.
//   fd = frente direita   td = trás direita
//   fe = frente esquerda  te = trás esquerda
// =============================================================================

export const DIRECOES = {
  cima:     ["fd", "fe"],   // frente
  baixo:    ["td", "te"],   // ré
  esquerda: ["fd", "te"],   // gira para a esquerda
  direita:  ["fe", "td"],   // gira para a direita
};
