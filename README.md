# Controle Remoto Virtual

Controle web (HTML + JavaScript puro) para o carrinho Wi-Fi. Conversa com o
carrinho por WebSocket, usando o mesmo protocolo do controle físico.

## Como usar

1. Ligue o carrinho e anote o IP que ele mostra no Serial.
2. **Desligue o controle físico.** Os dois mandam estado a cada 100 ms e o
   carrinho ficaria alternando entre eles.
3. Na pasta do projeto, inicie um servidor local:

   ```
   python3 -m http.server 8000
   ```

4. Abra `http://localhost:8000` no navegador (no computador, na mesma rede do carrinho).
5. O campo de IP já vem com `172.20.10.6` (pode ser alterado; o último IP
   usado fica salvo). Clique em **Conectar**. O mesmo botão vira **Desconectar**.

> Abrir o `index.html` com duplo clique não funciona: o navegador bloqueia
> módulos JavaScript carregados de `file://`.

## Controles

Botões na tela (segure para ativar) e setas do teclado usam a mesma tabela,
com duas rodas por direção:

| Botão / tecla | Rodas | Efeito |
|---|---|---|
| ▲ / ↑ | `fd` + `fe` | frente |
| ▼ / ↓ | `td` + `te` | ré |
| ◀ / ← | `fd` + `te` | gira para a esquerda |
| ▶ / → | `fe` + `td` | gira para a direita |

**PARAR** (botão vermelho ou tecla Espaço) solta tudo de uma vez.

No teclado, duas setas juntas somam as rodas. Com o mouse só dá para apertar
um botão por vez, então as curvas só funcionam pelo teclado (ou por toque, com
dois dedos). Se sobrarem frente e trás do mesmo lado, o
carrinho anula as duas. Por isso ↑ + ← faz uma curva para a esquerda (só a roda
direita anda).

## Painel e mapa

- **Painel:** mostra "Parado / Em movimento", as 4 rodas acesas e a mensagem
  JSON exata que está sendo enviada.
- **Mapa:** é uma **simulação**. O carrinho não tem sensor de posição, então o
  desenho é calculado só com o estado das rodas: as duas para frente andam
  reto, uma roda mais rápida faz curva, e rodas em sentidos opostos giram o
  carrinho no próprio eixo. O botão ↺ reinicia a posição.

## Protocolo

Mensagem de texto para `ws://<ip>:81/`, sempre com os 4 campos (1 = ligado):

```json
{"fd":1,"td":0,"fe":1,"te":0}
```

O estado é enviado a cada mudança e também a cada 100 ms. O carrinho para
sozinho se ficar 500 ms sem receber nada.

## Estrutura

```
index.html        página
css/style.css     visual
js/main.js        liga as peças
js/estado.js      o que está pressionado agora
js/conexao.js     WebSocket, reconexão e reenvio
js/direcoes.js    tabela direção -> rodas (usada por botões e teclado)
js/botoes.js      botões da tela e PARAR
js/teclado.js     setas e Espaço
js/painel.js      painel de estado, rodas e JSON
js/mapa.js        mapa de pré-visualização (simulação)
```
