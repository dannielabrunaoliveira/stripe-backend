const express = require('express');
const cors = require('cors');
const Stripe = require('stripe');

const app = express();
app.use(cors());
app.use(express.json());

const stripe = new Stripe(process.env.STRIPE_KEY);

app.get('/criar-checkout', async (req, res) => {
  try {

    // 🔹 PEGAR DADOS DA URL
    const nome = req.query.nome;
    const valor = req.query.valor;

    // 🔹 TRATAR VALOR
    const valorNumerico = Number(valor.replace(/\./g,'').replace(',','.'));

    // 🔹 CRIAR SESSÃO STRIPE
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      mode: 'payment',
      line_items: [
        {
          price_data: {
            currency: 'brl',
            product_data: {
              name: nome,
            },
            unit_amount: valorNumerico * 100,
          },
          quantity: 1,
        },
      ],
      success_url: 'https://milleniumon.com/pagamento/',
      cancel_url: 'https://milleniumon.com/pagamento-cancelado/',
    });

    // 🔹 REDIRECIONA PARA PAGAMENTO
    res.redirect(session.url);

  } catch (err) {
    console.error("ERRO STRIPE:", err);
    res.status(500).send("Erro real: " + err.message);
  }
});

app.listen(3000, () => {
  console.log('Servidor rodando em http://localhost:3000');
});
