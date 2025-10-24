const sinon = require('sinon');
const chai = require('chai');
const usuario = require('../src/user.js');
const postagem = require('../src/post.js');

const expect = chai.expect;
const assert = chai.assert;

beforeEach(() => {
    usuario.resetUsers();
});

describe("addPost", ()=>{
   it("Deve criar e associar corretamente um novo post ao ID do usuário", ()=>{
        const user = {
            id: 1,
            name: 'Catatau',
            userName: 'catatau',
            password: '12345',
            email: 'catatau@gmail.com'
        };
        usuario.createUser(user);
        const userId = 1;
        const newPost = {
            date: "24/10/2025",
            category: "Política",
            text: "Os politicos são corruptos, por isso a população passa fome."
        };
        const result = postagem.createPost(userId,newPost);
        const postCriado = postagem.searchPosts(userId)[0];

        expect(postCriado).to.be.exist;
        expect(postCriado).to.deep.equal(newPost)


    });
    it("Deve lançar um erro caso o campo text seja vazio", ()=>{
        const userId = 50;
        const invalidPost = {
            date: "24/10/2025",
            category: "Política",
            text: ""
        }
        expect(()=>{
            postagem.createPost(userId,invalidPost)
        }).to.throw("O Post deve ter um conteúdo de texto válido.");
        
    });
    it("Deve lançar um erro caso o campo date seja vazio", ()=>{
        const userId = 50;
        const invalidPost = {
            date: "",
            category: "Política",
            text: "Os politicos são corruptos, por isso a população passa fome."
        }
        expect(()=>{
            postagem.createPost(userId,invalidPost)
        }).to.throw("Data não pode ser vazia");
        
    });
    it("Deve lançar um erro caso o campo category seja vazio", ()=>{
        const userId = 50;
        const invalidPost = {
            date: "24/10/2025",
            category: "",
            text: "Os politicos são corruptos, por isso a população passa fome."
        }
        expect(()=>{
            postagem.createPost(userId,invalidPost)
        }).to.throw("Categoria não pode ser vazia.");
        
    });
    it("Deve lançar um erro caso usuário não exista", ()=>{
        const userId = 35;
        const invalidPost = {
            date: "24/10/2025",
            category: "Política",
            text: "Os politicos são corruptos, por isso a população passa fome."
        }
        expect(()=>{
            postagem.createPost(userId,invalidPost)
        }).to.throw("Usuário não encontrado");
        
    });
});