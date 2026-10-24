# Funil Hotmart em espanhol

Três upsells; aceite e recusa seguem para a próxima oferta:
- Mesa, US$ 9,90 → Família.
- Família, US$ 12,90 → Árvore.
- Árvore, US$ 6,90 → /cojines-navidenos/gracias.

O código oficial fornecido pelo proprietário foi integrado: hotmart-checkout-elements.js e checkoutElements.init('salesFunnel').mount('#hotmart-sales-funnel'). O widget recebe o contexto da sessão e das etapas no painel Hotmart; nenhum aceite ou Purchase é simulado localmente. Os dados productId no arquivo de configuração são usados como metadados e não substituem a configuração nativa das ofertas.

A configuração exige apenas widgetEnabled. Fora de uma sessão válida, pode não haver botões nativos. O botão local de compra permanece desativado. A navegação local de recusa é somente a alternativa de visualização, ocultada quando a interface nativa é renderizada.

Área de membros criada: NAVIDAD HECHA A MANO, slug navidadhechaamano-es. Sete produtos adicionados pelo painel:
- Cojines de Navidad, 8772584.
- Pantuflas, 8785564.
- Galletita, 8799525.
- Pingüino, 8799850.
- Mesa, 8800882.
- Família, 8800941.
- Árvore, 8800964.

A criação e a adição dos sete produtos foram confirmadas na UI. A edição de MIS COMPRAS foi iniciada, mas não publicada antes da indisponibilidade do navegador. Ainda faltam a revisão visual da vitrine, os arquivos anexados e a verificação real do funil Hotmart. Não afirmar que a cobrança de um clique foi testada só pela publicação do código.
