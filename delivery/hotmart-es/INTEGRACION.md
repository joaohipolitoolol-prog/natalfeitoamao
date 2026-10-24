# Funil Hotmart em espanhol

Fluxo final: três upsells, sem downsells. Tanto o aceite quanto a recusa levam à próxima oferta.

| Etapa | Preço USD | Aceite e recusa |
| --- | --- | --- |
| /cojines-navidenos/oferta-mesa-encantada | 9,90 | /cojines-navidenos/oferta-familia-munecos-nieve |
| /cojines-navidenos/oferta-familia-munecos-nieve | 17,90 | /cojines-navidenos/oferta-mi-arbol-hecho-mano |
| /cojines-navidenos/oferta-mi-arbol-hecho-mano | 6,90 | /cojines-navidenos/gracias |

Os antigos endereços de downsell redirecionam à oferta normal do respectivo produto. As páginas não oferecem desconto após a recusa. Não há promessa de preço maior na área de membros: essa precificação ainda não foi definida.

A LP e o checkout principal permanecem sem alterações. A cobrança de um clique ainda depende do widget nativo. Os botões ficam desabilitados enquanto a integração estiver pendente.

Arquivo de configuração: dist/assets/funil-hotmart-es-config-20261024.js. Preencher productId, offerCode e widgetHtml por etapa ou o widgetHtml global fornecido pela Hotmart. Usar o mesmo destino para os conectores de aceite e recusa no painel. Conferir o preço em cada página e na oferta selecionada. O widget é responsável pela cobrança e pelo fluxo real. Testar em uma sessão real antes de direcionar o front para U1.

Não anunciar vídeo em espanhol sem conferir o idioma. Não disparar Purchase pela visita.
