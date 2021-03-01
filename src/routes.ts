import {Router} from 'express';
const router = Router();
import {} from 'bcryptjs'

//#region Controllers
import stripeController from './controllers/StripeController';
import ClienteController from './controllers/ClienteController';
import CarrinhoController from './controllers/CarrinhoController';
//#endregion
//#region middlewares
import {clienteAuth} from './controllers/middleware/clienteAuth';
//#endregion


router.post('/criar_usuario',ClienteController.criarUsuario);
router.post('/criar_cliente', ClienteController.criarCliente);
router.get('/logar', ClienteController.logarUsuario);
router.get('/carrinho',clienteAuth,CarrinhoController.carrinho);
router.get('/add_carrinho/:id_produto',clienteAuth,CarrinhoController.setCarrinho);
router.post('/criar_produto',stripeController.criarProduto);
router.get('/pagar/:acesso?',clienteAuth,stripeController.pagar);
router.get('/cobrar/:id',stripeController.cobrar);

export {router};
