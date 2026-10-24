# Funil Hotmart em espanhol

As seis páginas estão em /cojines-navidenos/oferta-* e /cojines-navidenos/oferta-especial-*. Página final: /cojines-navidenos/gracias.

A LP e o checkout principal não foram alterados. Os botões de compra ficam desabilitados até receber o widget nativo. A mensagem de indisponibilidade é substituída pelo widget na integração. Não há cobrança simulada nem redirecionamento local tratado como aceite.

Arquivo de configuração: dist/assets/funil-hotmart-es-config-20261024.js. Preencher productId, offerCode e widgetHtml por etapa ou o widgetHtml global fornecido pela plataforma. Conferir o preço em cada HTML e no widget. Configurar no painel Hotmart os conectores acceptNext e declineNext indicados no arquivo. O widget é o responsável pela cobrança e pelo fluxo real, inclusive preservação da sessão de pagamento. Testar em uma sessão real do funil antes de direcionar o front para U1.

Valores em USD são a proposta de 24/10/2026. Não anunciar vídeo em espanhol sem conferir o idioma. Não disparar Purchase pela visita.
