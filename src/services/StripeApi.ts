import Stripe from "stripe";

export default new Stripe(process.env.STRIPE_CHAVE_SECRETA, {
    apiVersion: '2020-08-27'
});
