import {Router} from 'express';
const router = Router();

//#region Controllers
import {VendedoresController}from './controllers/VendedoresController';
const vendedoresController = new VendedoresController();
import {ClienteController} from './controllers/ClienteController';
const clienteController = new ClienteController();
import {CarrinhoController} from './controllers/CarrinhoController';
const carrinhoController = new CarrinhoController();
import {ProdutosController} from './controllers/ProdutosController';
const produtosController = new ProdutosController();
import { ImagemController } from './controllers/ImagemController';
const imagemController = new ImagemController();

//#endregion
//#region middlewares
import {clienteAuth} from './controllers/middleware/clienteAuth';
import {uploadImgs} from './controllers/middleware/multer';
import {vendedorAuth} from './controllers/middleware/vendedorAuth';
import { hasLogout } from './controllers/middleware/logout';
import { apagueTokens } from './controllers/middleware/apagueTokens';
import { limiteImages } from './controllers/middleware/limiteImages';

//#endregion
router
    //home
    .get('/', (req, res)=>{
        res.status(201).send("home")
    })
    //home

    //mostruario
    .get('/page/:page', produtosController.index)
    .get('/show/:id', produtosController.show)
    //mostruario

    //usuario
    .post('/usuario/criar',clienteController.criarUsuario)
    .get('/usuario/logar', clienteController.logarUsuario)
    // .put()
    // .delete()
    .get('/usuario/auth/logout', clienteAuth, hasLogout)
    //usuario
    
    //carrinho
    .get('/usuario/auth/carrinho',clienteAuth,carrinhoController.carrinho)
    .put('/usuario/auth/carrinho/adicionar/:id_produto',clienteAuth,carrinhoController.setCarrinho)
    .delete('/usuario/auth/carrinho/deletar/:id_produto',clienteAuth,carrinhoController.deletarCarrinho)
    //carrinho

    //favoritos
    .get('/usuario/auth/favoritos',clienteAuth, carrinhoController.verFavoritos)
    .put('/usuario/auth/favoritos/adicionar/:id_produto',clienteAuth, carrinhoController.addFavorito)
    .delete('/usuario/auth/favoritos/deletar/:id_produto',clienteAuth, carrinhoController.deletarFavorito)
    //favoritos

    //vendedor
    .get('/vendedor/logar',vendedoresController.show)
    .post('/vendedor/criar',vendedoresController.create)
    .put('/vendedor/auth/editar',vendedorAuth, vendedoresController.update)
    .delete('/vendedor/auth/deletar/:id_vendedor', vendedorAuth, vendedoresController.delete)
    .get('/vendedor/auth/logout', vendedorAuth, apagueTokens, hasLogout)
    //vendedor

    //produtos
    .get('/produto/auth/produtos/:page', vendedorAuth, produtosController.index)
    .get('/produto/auth/produto/:id', vendedorAuth, produtosController.show)
    .post('/produto/auth/criar',vendedorAuth,produtosController.create)
    .put('/produto/auth/editar/:id_produto',vendedorAuth,uploadImgs.array('img_add',10), produtosController.update)
    .delete('/produto/auth/deletar/:id_produto',vendedorAuth,produtosController.delete)
    //produtos
    
    //imagem do produto
    .get('/prodtuo/auth/imagem/exibir/:id_produto',vendedorAuth,imagemController.index)
    .post('/produto/auth/imagem/criar/:id_produto',vendedorAuth,limiteImages,uploadImgs.array('image',10), imagemController.create)
    .delete('/produto/auth/imagem/deletar/:id_produto',vendedorAuth,imagemController.delete)
    //imagem do produto
    .get('*',(req, res)=>{res.status(404).send("nada do tipo foi encontrado.")})

export {router};
