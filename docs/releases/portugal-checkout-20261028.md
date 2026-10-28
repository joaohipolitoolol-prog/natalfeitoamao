# Portugal: checkout Hotmart e atribuição

URL: https://natalfeitoamao.vercel.app/portugal
Checkout fornecido: https://pay.hotmart.com/S108222287S?checkoutMode=10
Rollback: a7b1681cef790ca3a1e456feab8afe11c8329529

Quatro CTAs de compra com href funcional sem JavaScript. Dois links WhatsApp mantidos para suporte. Preço verificado na interface pública da Hotmart com Portugal selecionado: 12,00 EUR, IVA incluído. MB WAY, Multibanco e cartão disponíveis.

Atribuição isolada para Portugal, com UTMs, SCK, SRC e identificadores dos anúncios. Regresso direto conserva a origem da sessão por até 24 horas. Campanha nova descarta os identificadores da anterior. Apenas os parâmetros autorizados são transmitidos ao checkout.

Pixel da LP: 1051422547811449. Produto: S108222287S. Moeda: EUR. Eventos PageView, ViewContent e CheckoutClick após autorização nas preferências do rodapé. Meta e UTMify carregam de forma assíncrona. A LP não simula InitiateCheckout nem Purchase.

Duas prévias fixas substituídas por páginas reais da edição em português de Portugal. Sem carrossel.

Validação: node --test tests/portugal-checkout.test.cjs, 8 testes aprovados. Sintaxe dos dois scripts e existência dos assets verificadas. As páginas BR, ES e IT e os seus scripts não foram alterados.

Pendência externa: a resposta pública do checkout devolveu pixels vazio. O painel Hotmart solicitou login. A configuração de eventos de checkout e compra aprovada no produto novo ainda precisa de acesso autenticado e validação.
