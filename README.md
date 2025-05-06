# Loja Frontend Zap
Uma loja web que utiliza apenas front‑end. Os produtos ficam em `public/db.json`, informando ao front‑end o id, título, imagem(s), preço, tamanho(s) e descrição dos produtos.

Os produtos adicionados na sacola são armazenados no localStorage do usuário, mantendo os itens mesmo que o navegador seja fechado. O pedido é enviado posteriormente via WhatsApp.

> Os ícones do Instagram, WhatsApp e o botão de finalizar compra na sacola não estão funcionais propositalmente, pois é apenas um demonstrativo.

# Ferramentas e libs utilizadas:
- React com TypeScript no Vite.
- Tailwind CSS.
- axios.
- react-hot-toast.
- react-slick.

# Objetivo
- Mostrar na página Home os produtos, separados em categorias: promoção, novidades e geral.
- Ao selecionar um produto, exibir informações sobre o mesmo.
- Design responsivo.
- Manter o carrinho persistido no localStorage.

# Demonstração
<img src="demonstracao.gif" width="50%">
