import {Router} from 'express';
const router = Router();

//#region Controllers
import VendedoresController from './controllers/VendedoresController';
import ClienteController from './controllers/ClienteController';
import CarrinhoController from './controllers/CarrinhoController';
import ProdutosController from './controllers/ProdutosController';
//#endregion
//#region middlewares
import {clienteAuth} from './controllers/middleware/clienteAuth';
import {uploadImgs} from './controllers/middleware/multer';
import {vendedorAuth} from './controllers/middleware/vendedorAuth';

//#endregion

router
    .get('/', ProdutosController.produtosHome)
    .get('/page/:categoria?', ProdutosController.produtosPage)

    .post('/criar_usuario',ClienteController.criarUsuario)
    .get('/logar', ClienteController.logarUsuario)
    .post('/criar_cliente', clienteAuth, ClienteController.criarCliente)
    .get('/logout', clienteAuth, ClienteController.logout)

    .post('/criar_vendedor',VendedoresController.criarVendedor)
    .get('/logar_vendedor',VendedoresController.logarVendedor)

    .get('/carrinho',clienteAuth,CarrinhoController.carrinho)
    .put('/add_carrinho/:id_produto',clienteAuth,CarrinhoController.setCarrinho)
    .delete('/deletar_produto/:id_produto',clienteAuth,CarrinhoController.deletarCarrinho)
    
    .put('/add_favoritos/:id_produto',clienteAuth, CarrinhoController.addFavorito)
    .get('/favoritos',clienteAuth, CarrinhoController.verFavoritos)

    .get('/exbir_produtos',vendedorAuth, VendedoresController.exibir)
    .post('/criar_produto',vendedorAuth,uploadImgs.array('arquivos',10),VendedoresController.criarProduto)
    .put('/editar_produto/:id_produto',vendedorAuth,uploadImgs.array('arquivos',10), VendedoresController.editarProduto)
    

export {router};
