# Natal Feito à Mão

Landing page estática da oferta principal:

- `dist/index.html`: Presépio de Feltro com Moldes, R$37 (+ order bump R$27).

## Abrir localmente

Abra `dist/index.html` no navegador.

## Conectar checkout e pixel

Abra `dist/assets/app.js` e preencha no início do arquivo:

```js
const checkoutUrls = {
  feltro: "https://seu-checkout-feltro.com",
  feltroBump: "https://seu-checkout-feltro-com-bump.com"
};

const metaPixelId = "SEU_PIXEL_ID";
```

- `feltro`: checkout só do pacote (R$37).
- `feltroBump`: checkout com moldes extras de árvore/estrelas (R$64).
- `metaPixelId`: ID do Meta Pixel (PageView + InitiateCheckout).

Enquanto as URLs estiverem vazias, os botões abrem o aviso de checkout não configurado.

## O que a LP já faz

- Marca **Natal Feito à Mão** no hero
- Avatar único: montar o presépio em casa (hobby natalino)
- Urgência dinâmica até 25/12
- Prova social (troque os 3 depoimentos por relatos reais antes de anunciar)
- Transparência de materiais (R$60–90 à parte)
- Order bump + total dinâmico
- Sticky CTA e garantia de 7 dias

## Antes de tráfego pago

1. Preencher `checkoutUrls` e `metaPixelId` em `app.js`
2. Substituir depoimentos por clientes reais (com autorização)
3. Criar o checkout do bump (R$64) ou o mesmo checkout com order bump nativo da plataforma
4. Confirmar que os PDFs de entrega existem e a automação envia o acesso

## Estrutura

- `dist/assets/styles.css`: identidade visual e responsividade
- `dist/assets/app.js`: checkout, bump, pixel, urgência, sticky, modal
- `dist/assets/presepio-feltro.png`: imagem principal
- `.openai/hosting.json`: configuração ChatGPT Sites

O pacote não contém os moldes finais PDF — só a página de venda.
