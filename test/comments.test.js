// test/comments.test.js

const chai = require('chai');
const sinon = require('sinon');

const should = chai.should();
const expect = chai.expect;
const assert = chai.assert;

const commentsModule = require('../src/comments.js'); // Para o Sinon
const {
  criarComentarioFake,
  apagarComentario,
  resetComentarios,
  listarComentarios,
  buscarComentarioPorId,
  filtrarComentariosPorPostId
} = commentsModule;

describe('Gerenciamento de Comentários', () => {

  // Limpa comentários antes de cada teste
  beforeEach(() => {
    resetComentarios();
  });

  // =========================
  // Testes com EXPECT
  // =========================
  describe('Funções de Criação e Busca (com EXPECT)', () => {
    it('deve criar um comentário fake com sucesso', () => {
      const dados = { body: 'Comentário teste', email: 'teste@ex.com' };
      const comentario = criarComentarioFake(dados);
      expect(comentario).to.be.an('object');
      expect(comentario).to.have.property('body', 'Comentário teste');
      expect(comentario).to.have.property('email', 'teste@ex.com');
      expect(comentario.id).to.be.a('number');
    });

    it('deve lançar erro se dados forem inválidos', () => {
      expect(() => criarComentarioFake({})).to.throw('Dados inválidos para criar comentário');
      expect(() => criarComentarioFake(null)).to.throw('Dados inválidos para criar comentário');
    });

    it('deve buscar um comentário por ID (mockado)', async () => {
      const stub = sinon.stub(commentsModule, 'buscarComentarioPorId').resolves({ id: 1, body: 'Comentário 1' });
      const result = await commentsModule.buscarComentarioPorId(1);
      expect(result).to.have.property('id', 1);
      stub.restore();
    });

    it('deve filtrar comentários por postId (mockado)', async () => {
      const stub = sinon.stub(commentsModule, 'filtrarComentariosPorPostId').resolves([{ id: 2, postId: 1 }]);
      const result = await commentsModule.filtrarComentariosPorPostId(1);
      expect(result).to.be.an('array');
      expect(result[0]).to.have.property('postId', 1);
      stub.restore();
    });

    it('listarComentarios deve retornar array (mockado)', async () => {
      const stub = sinon.stub(commentsModule, 'listarComentarios').resolves([{ id: 1, body: 'Comentário 1' }]);
      const result = await commentsModule.listarComentarios();
      expect(result).to.be.an('array');
      stub.restore();
    });
  });

  // =========================
  // Testes com SHOULD
  // =========================
  describe('Funções de Modificação (com SHOULD)', () => {
    it('deve apagar um comentário com sucesso', () => {
      const comentario = criarComentarioFake({ body: 'Teste', email: 'a@a.com' });
      apagarComentario(comentario.id).should.be.true;
    });

    it('deve lançar erro ao apagar comentário sem ID', () => {
      (() => apagarComentario()).should.throw('ID inválido');
    });
  });

  // =========================
  // Testes com ASSERT
  // =========================
  describe('Testes de Validação e Filtros (com ASSERT)', () => {
    it('ID de comentário criado deve ser número', () => {
      const comentario = criarComentarioFake({ body: 'Teste', email: 'a@a.com' });
      assert.isNumber(comentario.id);
    });

    it('deve lançar erro ao buscar comentário sem ID', async () => {
      try {
        await buscarComentarioPorId();
        assert.fail('Deveria lançar erro');
      } catch (err) {
        assert.strictEqual(err.message, 'ID é obrigatório');
      }
    });

    it('deve lançar erro ao filtrar sem postId', async () => {
      try {
        await filtrarComentariosPorPostId();
        assert.fail('Deveria lançar erro');
      } catch (err) {
        assert.strictEqual(err.message, 'postId é obrigatório');
      }
    });
  });

  // =========================
  // Testes com SINON
  // =========================
  describe('Testes de API Mockada com SINON', () => {
    let listarStub, buscarStub, filtrarStub;

    beforeEach(() => {
      listarStub = sinon.stub(commentsModule, 'listarComentarios').resolves([]);
      buscarStub = sinon.stub(commentsModule, 'buscarComentarioPorId').resolves({ id: 1, body: 'Teste' });
      filtrarStub = sinon.stub(commentsModule, 'filtrarComentariosPorPostId').resolves([]);
    });

    afterEach(() => {
      listarStub.restore();
      buscarStub.restore();
      filtrarStub.restore();
    });

    it('listarComentarios deve ser chamado uma vez', async () => {
      await commentsModule.listarComentarios();
      assert.isTrue(listarStub.calledOnce);
    });

    it('buscarComentarioPorId deve retornar dados mockados', async () => {
      const result = await commentsModule.buscarComentarioPorId(1);
      expect(result).to.have.property('id', 1);
    });

    it('filtrarComentariosPorPostId deve retornar array mockado', async () => {
      const result = await commentsModule.filtrarComentariosPorPostId(1);
      assert.isArray(result);
    });

    it('buscarComentarioPorId deve lançar erro mockado', async () => {
      buscarStub.rejects(new Error('Erro mockado'));
      try {
        await commentsModule.buscarComentarioPorId(1);
        assert.fail('Deveria lançar erro');
      } catch (err) {
        err.message.should.equal('Erro mockado');
      }
    });

    it('listarComentarios chamado sem argumentos retorna array', async () => {
      const result = await commentsModule.listarComentarios();
      assert.isArray(result);
    });
  });
});
