
const chai = require('chai');
const sinon = require('sinon');
const should = chai.should();
const expect = chai.expect;
const assert = chai.assert;

const { 
  criarComentario, 
  listarComentariosPorFoto, 
  deletarComentario, 
  resetarComentarios 
} = require('../src/comments');

const { 
  createUser, 
  resetUsers 
} = require('../src/user');

const { 
  uploadPhoto, 
  resetPhotos 
} = require('../src/gallery');

describe("Gerenciamento de Comentários", () => {

  beforeEach(() => {
    resetarComentarios();
    resetUsers();
    resetPhotos();

    createUser({ id: 1, name: "Yan", userName: "yanc", password: "123", email: "yan@email.com" });
    createUser({ id: 2, name: "Marcos", userName: "marcos", password: "123", email: "marcos@email.com" });

    uploadPhoto({ imageUrl: "teste.jpg", description: "Foto teste", authorId: 1 });
  });

  // ==========================
  // Testes com EXPECT
  // ==========================
  describe("Criação de Comentários", () => {
    it("deve criar um comentário em uma foto com sucesso", () => {
      const resultado = criarComentario(1, { conteudo: "Linda foto!", idAutor: 2 });
      expect(resultado).to.equal("Comentário criado com sucesso!");
    });

    it("deve lançar erro se faltar dados obrigatórios", () => {
      expect(() => criarComentario()).to.throw("Preencha todos os dados do comentário corretamente!");
    });

    it("deve lançar erro se o autor não existir", () => {
      expect(() => criarComentario(1, { conteudo: "Oi", idAutor: 999 }))
        .to.throw("Usuário (autor) não encontrado.");
    });

    it("deve lançar erro se a foto não existir", () => {
      expect(() => criarComentario(99, { conteudo: "Foto não existe", idAutor: 2 }))
        .to.throw("Foto não encontrada.");
    });
  });

  // ==========================
  // Testes com SHOULD
  // ==========================
  describe("Listagem de Comentários", () => {
    it("deve listar comentários corretamente", () => {
      criarComentario(1, { conteudo: "Teste 1", idAutor: 2 });
      criarComentario(1, { conteudo: "Teste 2", idAutor: 2 });
      const lista = listarComentariosPorFoto(1);
      lista.should.have.lengthOf(2);
    });

    it("deve lançar erro ao listar comentários de foto inexistente", () => {
      (() => listarComentariosPorFoto(99)).should.throw("Foto não encontrada.");
    });
  });

  // ==========================
  // Testes com ASSERT
  // ==========================
  describe("Exclusão de Comentários", () => {
    it("deve excluir um comentário corretamente", () => {
      criarComentario(1, { conteudo: "Remover este", idAutor: 2 });
      const mensagem = deletarComentario(1, 1);
      assert.strictEqual(mensagem, "Comentário excluído com sucesso!");
    });

    it("deve lançar erro ao tentar excluir um comentário que não existe", () => {
      assert.throws(() => deletarComentario(1, 999), "Comentário não encontrado.");
    });
  });

  // ==========================
  // Testes com SINON
  // ==========================
  describe("Sinon - monitorando funções", () => {
    it("deve verificar se getUserById foi chamado", () => {
      const userModule = require('../src/user');
      const spy = sinon.spy(userModule, 'getUserById');
      criarComentario(1, { conteudo: "Verificando spy", idAutor: 2 });
      assert.isTrue(spy.called);
      spy.restore();
    });
  });
});
