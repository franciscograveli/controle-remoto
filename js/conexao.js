// =============================================================================
// CONEXÃO
// -----------------------------------------------------------------------------
// Cuida do WebSocket com o carrinho:
//   - abre a conexão em ws://<ip>:81
//   - reconecta sozinho se a conexão cair
//   - envia o estado dos botões, e reenvia a cada 100 ms
//
// Por que reenviar? O carrinho para sozinho se ficar 500 ms sem receber nada.
// =============================================================================

const PORTA = 81;
const REENVIO_MS = 100;
const RECONEXAO_MS = 3000;

let ws = null;
let ip = "";
let timerReconexao = null;
let aoMudarStatus = () => {};

// Só uma aba pode controlar o carrinho. Quando uma aba conecta, ela avisa as
// outras, que desconectam e param de tentar reconectar. Sem isso, duas abas
// mandariam comandos diferentes ao mesmo tempo e o carrinho travaria.
const canal = new BroadcastChannel("controle-carrinho");
canal.onmessage = () => desconectar();

export function aoMudarConexao(funcao) {
  aoMudarStatus = funcao;
}

// Conecta (ou reconecta) em um IP novo
export function conectar(novoIp) {
  ip = novoIp;
  clearTimeout(timerReconexao);
  canal.postMessage("assumi");   // as outras abas se desconectam

  if (ws) {
    ws.onclose = null;   // evita que o fechamento antigo agende outra reconexão
    ws.close();
  }
  abrir();
}

function abrir() {
  try {
    ws = new WebSocket(`ws://${ip}:${PORTA}/`);
  } catch {
    aoMudarStatus(false);   // IP em formato inválido
    return;
  }

  ws.onopen = () => aoMudarStatus(true);

  // A reconexão só acontece aqui: quando a conexão cai ou não consegue abrir
  ws.onclose = () => {
    aoMudarStatus(false);
    timerReconexao = setTimeout(abrir, RECONEXAO_MS);
  };
}

// Para o carrinho, fecha a conexão e não tenta reconectar
export function desconectar() {
  clearTimeout(timerReconexao);
  if (!ws) return;

  ws.onclose = null;   // fechamento pedido por nós: sem reconexão automática
  enviar({ fd: 0, td: 0, fe: 0, te: 0 });
  ws.close();
  ws = null;
  aoMudarStatus(false);
}

// Envia o estado, se a conexão estiver aberta
export function enviar(estado) {
  if (ws && ws.readyState === WebSocket.OPEN) {
    ws.send(JSON.stringify(estado));   // ex: {"fd":1,"td":0,"fe":1,"te":0}
  }
}

// Reenvia o estado atual a cada 100 ms, mesmo sem mudança
export function iniciarReenvio(lerEstado) {
  setInterval(() => enviar(lerEstado()), REENVIO_MS);
}
