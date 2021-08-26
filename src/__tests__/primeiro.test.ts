import {app} from '../app';
import request from 'supertest';
import createConnection from '../database';
import { getConnection } from 'typeorm';
let itens = [];
for(let i = 0; i < 13; i++){
    itens.push(String(i));
}
describe('Test the root path', ()=>{
    beforeAll(async () => {
        const connection = await createConnection();  
        await connection.runMigrations();
    });
    afterAll(async()=>{
        const connection = getConnection();
        await connection.dropDatabase();
        await connection.close();
    });
    it("[get]('/')) quero um texto", async () => {  
        const response = await request(app).get('/');
        expect(response.text).toBe('home');
    });
    
    test.each(['0','1','2'])("[get]('/page/%s') 10 itens por pagina", async (indice) =>{
        const response = await request(app).get(`/page/${indice}`)
        expect(response.body.produtos.length).toBe(10);
    });
   
});