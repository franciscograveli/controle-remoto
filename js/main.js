// =============================================================================
// MAIN
// -----------------------------------------------------------------------------
// Liga as peças:
//   botões / teclado  ->  estado  ->  tela (verde) + carrinho (WebSocket)
// =============================================================================

import { aoMudar, lerEstado, soltarTudo } from "./estado.js";
import { conectar, enviar, iniciarReenvio, aoMudarConexao } from "./conexao.js";
import { iniciarBotoes, desenharBotoes } from "./botoes.js";
import { iniciarTeclado } from "./teclado.js";

const form = document.getElementById("form-conexao");
const campoIp = document.getElementById("campo-ip");
const textoStatus = document.getElementById("status");

// ---- Quando o estado muda: atualiza a tela e avisa o carrinho na hora ----
aoMudar((estado) => {
  desenharBotoes(estado);
  enviar(estado);
});

// ---- Status da conexão ----
aoMudarConexao((conectado) => {
  textoStatus.textContent = conectado ? "Conectado" : "Desconectado";
  textoStatus.className = conectado ? "conectado" : "desconectado";
});

// ---- Campo de IP: lembra o último usado ----
campoIp.value = localStorage.getItem("ip") || "";

form.addEventListener("submit", (e) => {
  e.preventDefault();
  const ip = campoIp.value.trim();
  localStorage.setItem("ip", ip);
  conectar(ip);
});

// ---- Segurança: se a aba perder o foco, solta tudo (o carrinho para) ----
window.addEventListener("blur", soltarTudo);
document.addEventListener("visibilitychange", () => {
  if (document.hidden) soltarTudo();
});

// ---- Início ----
iniciarBotoes();
iniciarTeclado();
iniciarReenvio(lerEstado);
