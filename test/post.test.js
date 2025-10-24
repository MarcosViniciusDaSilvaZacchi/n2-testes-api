const sinon = require('sinon');
const chai = require('chai');
const postagem = require('../src/post.js');

const expect = chai.expect;
const assert = chai.assert;

beforeEach(() => {
    usuario.resetUsers();
});

describe("addPost", ()=>{
   it("Deve criar e associar corretamente um novo post ao ID do usuário", ()=>{
        const userId = 1
        const newPost = {
            date: "24/10/2025",
            categoria: "Política",
            texto: "Os politicos são corruptos, por isso a população passa fome."
        };
        postagem.addPost(1,newPost);
        const postCriado = postagem.getPost(userId)[0];

        expect(postCriado).to.be.exist;

    });
});