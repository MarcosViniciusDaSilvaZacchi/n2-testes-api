// test/comments.test.js
const chai = require('chai');
const sinon = require('sinon');
const axios = require('axios');

const comments = require('../src/comments');

const expect = chai.expect;
const assert = chai.assert;

describe('Módulo de Comentários', () => {

  // Testes unitários
  describe('Funções locais', () => {
    it('deve criar um comentário fake corretamente', () => {
      const result = comments.criarComentarioFake({ body: "Teste", email: "a@a.com" });
      assert.isObject(result);
      assert.strictEqual(result.body, "Teste");
      expect(result).to.have.property('id');
    });

    it('deve lançar erro ao criar comentário com dados inválidos', () => {
      assert.throws(() => comments.criarComentarioFake({}), /Dados inválidos/);
    });

    it('deve apagar comentário retornando true', () => {
      const deletado = comments.apagarComentario(1);
      assert.isBoolean(deletado);
      assert.isTrue(deletado);
    });

    it('deve lançar erro ao apagar comentário sem ID', () => {
      assert.throws(() => comments.apagarComentario(), /ID inválido/);
    });
  });

  // Testes de API mockados com Sinon
  describe('Requisições mockadas com Sinon', () => {
    let stubGet;

    afterEach(() => sinon.restore());

    it('deve simular listar comentários com sucesso', async () => {
      const fakeResponse = { data: [{ id: 1, body: "comentário fake" }] };
      stubGet = sinon.stub(axios, 'get').resolves(fakeResponse);

      const result = await comments.listarComentarios();
      assert.isArray(result);
      assert.lengthOf(result, 1);
      assert.deepEqual(result[0], fakeResponse.data[0]);
    });

    it('deve simular busca de comentário por ID', async () => {
      const fakeResponse = { data: { id: 1, body: "ok" } };
      stubGet = sinon.stub(axios, 'get').resolves(fakeResponse);

      const result = await comments.buscarComentarioPorId(1);
      expect(result).to.have.property('id', 1);
      assert.strictEqual(result.body, "ok");
    });

    it('deve simular filtro por Post ID', async () => {
      const fakeResponse = { data: [{ postId: 1, id: 10, body: "x" }] };
      stubGet = sinon.stub(axios, 'get').resolves(fakeResponse);

      const result = await comments.filtrarComentariosPorPostId(1);
      assert.isArray(result);
      expect(result[0]).to.have.property("postId", 1);
    });

    it('deve lançar erro se postId for vazio', async () => {
      try {
        await comments.filtrarComentariosPorPostId();
        assert.fail("Deveria ter lançado erro");
      } catch (err) {
        assert.match(err.message, /postId é obrigatório/);
      }
    });

    it('deve mockar erro em requisição de API', async () => {
      stubGet = sinon.stub(axios, 'get').rejects(new Error("Falha na API"));
      try {
        await comments.listarComentarios();
        assert.fail("Deveria ter lançado erro");
      } catch (err) {
        assert.match(err.message, /Falha/);
      }
    });
  });
});
