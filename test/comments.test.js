const chai = require('chai');
const sinon = require('sinon');
const expect = chai.expect;
const should = chai.should();
const assert = chai.assert;

const comments = require('../src/comments');
const { createUser, resetUsers, getUserById } = require('../src/user');
const photo = require('../src/gallery');
const post = require('../src/post');

describe("Testes de Comentários", () => {

  beforeEach(() => {
    resetUsers();

    createUser({ id: 1, name: "Yan", userName: "yanc", password: "123", email: "yan@email.com" });
    post.createPost(1, { id: 1, createdAt: "2025/01/10", category: "Tecnologia", content: "Novidades do JS" });
    post.createPost(1, { id: 2, createdAt: "2025/01/11", category: "Esportes",   content: "Resultado do jogo" });

    createUser({ id: 2, name: "Marcos", userName: "marcos", password: "123", email: "marcos@email.com" });
    post.createPost(2, { id: 1, createdAt: "2025/03/12", category: "Culinaria", content: "Receita prática" });
    post.createPost(2, { id: 2, createdAt: "2025/04/01", category: "Política",  content: "Propaganda política" });
  });

  describe("criarComentario()", () => {
    it("Cria comentário para postagem", () => {
        comments.criarComentario(1, 'post', 2, {
            id: 1, 
            conteudo: "Muito boa!", 
            idAutor: 2, 
            dataCriacao: new Date()
        });

        const comentarioCriado = comments.procuraComentario(1, 'post', 2, 1);
        expect(comentarioCriado).to.exist;
        expect(comentarioCriado).to.have.keys(['id', 'conteudo', 'idAutor', 'dataCriacao']);
        expect(comentarioCriado.id).to.equal(1);
        
        const postagem = post.searchPostID(1, 2); 
        expect(postagem.comments).to.have.lengthOf(1);
        expect(postagem.comments[0]).to.deep.include(comentarioCriado);
    });

    // it("Cria comentário para foto", () => {
    //     comments.criarComentario(1, 'post', 2, {
    //         id: 1, 
    //         conteudo: "Muito boa!", 
    //         idAutor: 2, 
    //         dataCriacao: new Date()
    //     });

    //     const comentarioCriado = comments.procuraComentario(1, 'photos', 2, 1);
    //     expect(comentarioCriado).to.exist;
        
    //     const postagem = post.ARRUMAR(1, 2); 
    //     expect(postagem.comments).to.have.lengthOf(1);
    //     expect(postagem.comments[0]).to.deep.include(comentarioCriado);
    // });

    it("Parâmetros de destino inválidos", () => {
      (() => comments.criarComentario()).should.throw("Parâmetros de destino inválidos");  // !targetUserId
      (() => comments.criarComentario(1)).should.throw("Parâmetros de destino inválidos");  // !target
      (() => comments.criarComentario(1, "post")).should.throw("Parâmetros de destino inválidos");  // !targetId
      (() => comments.criarComentario(1, "post", -1)).should.throw("Parâmetros de destino inválidos");  // targetId <= 0
    });

    it("Usuário (alvo do comentário) não encontrado.", () => {
      (() => comments.criarComentario(9999, 'post', 2, {
            id: 1, 
            conteudo: "Muito boa!", 
            idAutor: 2, 
            dataCriacao: new Date()
            })).should.throw("Usuário (alvo do comentário) não encontrado.");
    });

    it("Usuário (autor do comentário) não encontrado.", () => {
      (() => comments.criarComentario(1, 'post', 2, {
            id: 1, 
            conteudo: "Muito boa!", 
            idAutor: 9999, 
            dataCriacao: new Date()
            })).should.throw("Usuário (autor do comentário) não encontrado.");
    });

    it("Dados do comentário inválidos", () => {
      (() => comments.criarComentario(1, 'post', 2, {
            //id: 1, 
            conteudo: "Muito boa!", 
            idAutor: 2, 
            dataCriacao: new Date()
            })).should.throw("Dados do comentário inválidos");

      (() => comments.criarComentario(1, 'post', 2, {
            id: 1, 
            //conteudo: "Muito boa!", 
            idAutor: 2, 
            dataCriacao: new Date()
            })).should.throw("Dados do comentário inválidos");

      (() => comments.criarComentario(1, 'post', 2, {
            id: 1, 
            conteudo: "Muito boa!", 
            //idAutor: 2, 
            dataCriacao: new Date()
            })).should.throw("Dados do comentário inválidos");

      (() => comments.criarComentario(1, 'post', 2, {
            id: 1, 
            conteudo: "Muito boa!", 
            idAutor: 2, 
            //dataCriacao: new Date()
            })).should.throw("Dados do comentário inválidos");
    });

    it("Usuário (autor do comentário) não encontrado.", () => {
      (() => comments.criarComentario(1, 'teste', 2, {
            id: 1, 
            conteudo: "Muito boa!", 
            idAutor: 2, 
            dataCriacao: new Date()
            })).should.throw("Tipo de 'target' inválido. Aceito: 'photo'/'foto' ou 'post'.");
    });

    it("ID de comentário já está cadastrado neste conteúdo.", () => {
      comments.criarComentario(1, 'post', 2, {
            id: 1, 
            conteudo: "Maravilhoso!", 
            idAutor: 2, 
            dataCriacao: new Date()
      });

      (() => comments.criarComentario(1, 'post', 2, {
            id: 1, 
            conteudo: "Muito boa!", 
            idAutor: 2, 
            dataCriacao: new Date()
            })).should.throw("ID de comentário já está cadastrado neste conteúdo.");
    });
  });

  describe.only("procuraComentario()", () => {
    it("Retorna um comentário de uma postagem", () => {
      comments.criarComentario(1, 'post', 2, { id: 1, conteudo: "Muito boa!", idAutor: 2, dataCriacao: new Date() });

      const lista = comments.procuraComentario(1, "post", 2, 1);
      expect(lista).to.have.keys(['id', 'conteudo', 'idAutor', 'dataCriacao']);
      expect(lista.id).to.equal(1);
    });

    // it("Retorna um comentário de uma foto", () => {
    //   const novaFoto = comments.ARRUMAR(1, 'photo', 2, { id: 1, conteudo: "Muito boa!", idAutor: 2, dataCriacao: new Date() });

    //   const lista = comments.procuraComentario(1, "photo", 2, novaFoto.id);
    //   expect(lista).to.have.keys(['id', 'conteudo', 'idAutor', 'dataCriacao']);
    //   expect(lista.id).to.equal(1);
    // });

    it("Tipo de 'target' inválido. Aceito: 'photo'/'foto' ou 'post'.", () => {
      comments.criarComentario(1, 'post', 2, { id: 1, conteudo: "Muito boa!", idAutor: 2, dataCriacao: new Date() });

      (() => comments.procuraComentario(1, "teste", 2, 1)).should.throw("Tipo de 'target' inválido. Aceito: 'photo'/'foto' ou 'post'.");
    });
  });

  describe("Listar comentários", () => {
    it("deve listar comentários da foto", () => {
      criarComentario(1, { conteudo: "Comentário 1", idAutor: 2 });
      criarComentario(1, { conteudo: "Comentário 2", idAutor: 2 });
      const lista = listarComentariosPorFoto(1);
      lista.should.have.lengthOf(2);
    });

    it("deve dar erro se foto não existir", () => {
      (() => listarComentariosPorFoto(999)).should.throw("Foto não encontrada.");
    });
  });

  describe("Excluir comentário", () => {
    it("deve excluir um comentário", () => {
      criarComentario(1, { conteudo: "Apagar", idAutor: 2 });
      const msg = deletarComentario(1, 1);
      assert.strictEqual(msg, "Comentário excluído com sucesso!");
    });

    it("deve dar erro se comentário não existir", () => {
      assert.throws(() => deletarComentario(1, 999), "Comentário não encontrado.");
    });
  });

});