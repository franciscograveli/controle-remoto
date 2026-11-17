# Rede: Mac + carrinho no hotspot do iPhone

## O problema

O hotspot do iPhone entrega ao Mac só **IPv6**. O macOS cria um endereço de
tradução (`192.0.0.2`, o `clat46` do `ifconfig`) para continuar acessando sites
IPv4, mas esse endereço **não é uma rede local**. O carrinho está numa rede
IPv4 local (`172.20.10.x`), então o Mac não consegue chegar nele e o navegador
dá `ERR_ADDRESS_IN_USE`.

Como o ESP32 só fala IPv4, o Mac precisa de um endereço `172.20.10.x` para
conversar com ele.

## Configuração que funciona (IPv4 manual)

Ajustes do Sistema → Wi-Fi → Detalhes do hotspot → TCP/IP → **Manualmente**:

| Campo | Valor |
|---|---|
| Endereço IPv4 | `172.20.10.12` |
| Máscara | `255.255.255.240` |
| Roteador | `172.20.10.1` |

O IP precisa estar livre: não use o `.6` (carrinho) nem o do controle físico.
O hotspot só tem endereços de `.2` a `.14`.

Conferir:

```
ifconfig en0 | grep "inet "     # deve mostrar 172.20.10.12
ping -c 3 172.20.10.6           # deve responder
```

## Por que a internet fica ruim nesse modo

Não foi investigado a fundo, mas as causas mais prováveis são:

- **Sem DNS configurado:** em modo manual o Mac não recebe os servidores DNS
  do hotspot, e a resolução de nomes fica lenta.
- **IPv4 e IPv6 misturados:** o Mac passa a ter um caminho IPv4 manual e o
  caminho IPv6 do hotspot, e o navegador pode tentar um e esperar o outro
  falhar.

Para testar o DNS: Detalhes do hotspot → **DNS** → adicione `1.1.1.1` e
`8.8.8.8`.

## Para não mexer toda hora

Trocar entre os dois modos pelo terminal:

```
# modo carrinho
sudo networksetup -setmanual Wi-Fi 172.20.10.12 255.255.255.240 172.20.10.1

# modo normal (volta ao DHCP)
sudo networksetup -setdhcp Wi-Fi
```

Outra opção, pela interface: em Ajustes do Sistema → Rede, o menu **⋯ →
Locais** permite criar um local "Carrinho" com o IPv4 manual e deixar o local
padrão em DHCP. Trocar de local é um clique no menu  → Local.

## Ideia ainda não testada

Adicionar o endereço `172.20.10.12` **além** do que o Mac já tem, em vez de
trocar tudo para manual, para manter a internet normal:

```
sudo ifconfig en0 alias 172.20.10.12 255.255.255.240
```

Some ao desligar o Wi-Fi ou reiniciar. Se funcionar, resolve sem mexer nas
configurações do macOS.

## Outras saídas

- Usar outra rede que entregue IPv4 normal (roteador ou hotspot de um Android).
  Exige trocar `SSID` e `SENHA` no código do carrinho e do controle físico.
- Deixar o carrinho criar a própria rede Wi-Fi (`WiFi.softAP`), com IP fixo.
