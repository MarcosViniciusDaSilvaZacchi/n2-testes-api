const chai = require('chai');
const sinon = require('sinon');
const expect = chai.expect;
const should = chai.should();
const assert = chai.assert;

const { criarComentario, listarComentariosPorFoto, deletarComentario, resetarComentarios } = require('../src/comments');
const { createUser, resetUsers } = require('../src/user');
const { uploadPhoto, resetPhotos } = require('../src/gallery');

describe("Testes de Comentários", () => {

  beforeEach(() => {
    resetarComentarios();
    resetUsers();
    resetPhotos();

    createUser({ id: 1, name: "Yan", userName: "yanc", password: "123", email: "yan@email.com" });
    createUser({ id: 2, name: "Marcos", userName: "marcos", password: "123", email: "marcos@email.com" });

    uploadPhoto({ imageUrl: "foto.jpg", description: "Foto teste", authorId: 1 });
  });

  describe("Criar comentário", () => {
    it("deve criar comentário com sucesso", () => {
      const resultado = criarComentario(1, { conteudo: "Muito boa!", idAutor: 2 });
      expect(resultado).to.equal("Comentário criado com sucesso!");
    });

    it("deve dar erro se faltar dados", () => {
      expect(() => criarComentario()).to.throw("Preencha todos os dados do comentário corretamente!");
    });

    it("deve dar erro se autor não existir", () => {
      expect(() => criarComentario(1, { conteudo: "Oi", idAutor: 999 }))
        .to.throw("Usuário (autor) não encontrado.");
    });

    it("deve dar erro se a foto não existir", () => {
      expect(() => criarComentario(99, { conteudo: "oi", idAutor: 2 }))
        .to.throw("Foto não encontrada.");
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
