import {Router} from 'express';
const router = Router();
import {} from 'bcryptjs'

//#region Controllers
import stripeController from './controllers/StripeController';
import ClienteController from './controllers/ClienteController';
import CarrinhoController from './controllers/CarrinhoController';
import ProdutosController from './controllers/ProdutosController';
//#endregion
//#region middlewares
import {clienteAuth} from './controllers/middleware/clienteAuth';
import {uploadImgs} from './controllers/middleware/multer';
//#endregion

router.get('/', ProdutosController.produtosHome);
router.get('/page/:categoria?', ProdutosController.produtosPage);
router.post('/criar_usuario',ClienteController.criarUsuario);
router.post('/criar_cliente', ClienteController.criarCliente);
router.get('/logar', ClienteController.logarUsuario);
router.get('/carrinho',clienteAuth,CarrinhoController.carrinho);
router.get('/add_carrinho/:id_produto',clienteAuth,CarrinhoController.setCarrinho);
router.post('/criar_produto',uploadImgs.array('arquivos',3),stripeController.criarProduto);
router.get('/pagar/:acesso?',clienteAuth,stripeController.pagar);
router.get('/cobrar/:id',stripeController.cobrar);

export {router};
