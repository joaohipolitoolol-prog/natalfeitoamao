# Portugal: checkout Hotmart e atribuição

URL: https://natalfeitoamao.vercel.app/portugal
Checkout fornecido: https://pay.hotmart.com/S108222287S?checkoutMode=10
Rollback: a7b1681cef790ca3a1e456feab8afe11c8329529

Quatro CTAs de compra com href funcional sem JavaScript. Dois links WhatsApp mantidos para suporte. Preço verificado na interface pública da Hotmart com Portugal selecionado: 12,00 EUR, IVA incluído. MB WAY, Multibanco e cartão disponíveis.

Atribuição isolada para Portugal, com UTMs, SCK, SRC e identificadores dos anúncios. Regresso direto conserva a origem da sessão por até 24 horas. Campanha nova descarta os identificadores da anterior. Apenas os parâmetros autorizados são transmitidos ao checkout.

Pixel da LP: 1051422547811449. Produto Hotmart verificado no painel: 8824421. Código de checkout: S108222287S. Moeda: EUR. Eventos PageView, ViewContent e CheckoutClick após autorização nas preferências do rodapé. Meta carrega de forma assíncrona. A atribuição é própria da página, sem o script UTMify que alterava utm_content durante a verificação no navegador. A LP não simula InitiateCheckout nem Purchase.

Duas prévias fixas substituídas por páginas reais da edição em português de Portugal. Sem carrossel.

Validação: node --test tests/portugal-checkout.test.cjs, 9 testes aprovados. Sintaxe dos dois scripts e existência dos assets verificadas. As páginas BR, ES e IT e os seus scripts não foram alterados.

Pendência externa: acesso autenticado concluído. Produto 8824421 e HotLinks confirmados. Formulário Meta preparado com pixel 1051422547811449, Vendas realizadas, Visitas na Página de pagamento, todos os métodos e diferenciação de pagamentos imediatos/não imediatos. A Hotmart exige API de Conversões para essa diferenciação e não permite salvar sem validar o token. Configuração Web + API preparada, mas ainda não salva. Falta o utilizador inserir o token na Hotmart e validá-lo. Nenhuma compra de teste foi criada nem aprovada artificialmente.
