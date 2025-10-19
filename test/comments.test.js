// test/comments.test.js
const { assert, expect, should } = require("chai");
const sinon = require("sinon");
const axios = require("axios");
const chai = require("chai");
const chaiHttp = require("chai-http");
const comments = require("../src/comments");

chai.use(chaiHttp);
should();

describe("🔹 Testes do módulo de comentários", function () {
  
  // ----------------------------
  // 🔸 TESTES UNITÁRIOS
  // ----------------------------
  describe("Funções locais", function () {
    
    it("Deve criar um comentário fake corretamente", function () {
      const result = comments.criarComentarioFake({ body: "Teste", email: "a@a.com" });
      assert.strictEqual(result.body, "Teste");
      expect(result).to.have.property("id");
      result.should.be.an("object");
    });

    it("Deve lançar erro ao criar comentário com dados inválidos", function () {
      (() => comments.criarComentarioFake({})).should.throw("Dados inválidos");
    });

    it("Deve apagar comentário retornando true", function () {
      const deletado = comments.apagarComentario(1);
      assert.isTrue(deletado);
      deletado.should.be.a("boolean");
    });

    it("Deve lançar erro ao apagar comentário sem ID", function () {
      expect(() => comments.apagarComentario()).to.throw("ID inválido");
    });

    it("Função buscarComentarioPorId deve lançar erro se ID não for passado", async function () {
      try {
        await comments.buscarComentarioPorId();
      } catch (error) {
        expect(error.message).to.equal("ID é obrigatório");
      }
    });
  });

  // ----------------------------
  // 🔸 TESTES MOCKADOS (Sinon)
  // ----------------------------
  describe("Requisições mockadas com Sinon", function () {
    afterEach(() => sinon.restore());

    it("Deve simular listar comentários com sucesso", async function () {
      const fakeResponse = { data: [{ id: 1, body: "comentário fake" }] };
      sinon.stub(axios, "get").resolves(fakeResponse);

      const result = await comments.listarComentarios();
      expect(result).to.have.lengthOf(1);
      assert.deepEqual(result[0], fakeResponse.data[0]);
    });

    it("Deve simular busca de comentário por ID", async function () {
      const fakeResponse = { data: { id: 1, body: "ok" } };
      sinon.stub(axios, "get").resolves(fakeResponse);

      const result = await comments.buscarComentarioPorId(1);
      result.should.have.property("id", 1);
      expect(result.body).to.equal("ok");
    });

    it("Deve simular filtro por Post ID", async function () {
      const fakeResponse = { data: [{ postId: 1, id: 10, body: "x" }] };
      sinon.stub(axios, "get").resolves(fakeResponse);

      const result = await comments.filtrarComentariosPorPostId(1);
      expect(result[0]).to.have.property("postId", 1);
    });

    it("Deve lançar erro se postId for vazio", async function () {
      try {
        await comments.filtrarComentariosPorPostId();
      } catch (err) {
        err.message.should.equal("postId é obrigatório");
      }
    });

    it("Deve mockar erro em requisição de API", async function () {
      sinon.stub(axios, "get").rejects(new Error("Falha na API"));
      try {
        await comments.listarComentarios();
      } catch (err) {
        expect(err.message).to.match(/Falha/);
      }
    });
  });

  // ----------------------------
  // 🔸 TESTES DE API REAIS
  // ----------------------------
  describe("Testes reais com JSONPlaceholder API", function () {
    this.timeout(5000); // Aumenta timeout por segurança

    it("Deve retornar lista de comentários reais da API", async function () {
      const res = await chai.request("https://jsonplaceholder.typicode.com").get("/comments");
      res.should.have.status(200);
      expect(res.body).to.be.an("array");
      expect(res.body[0]).to.have.property("id");
    });

    it("Deve buscar um comentário real por ID", async function () {
      const res = await chai.request("https://jsonplaceholder.typicode.com").get("/comments/1");
      res.should.have.status(200);
      expect(res.body).to.have.property("id", 1);
    });

    it("Deve filtrar comentários por postId", async function () {
      const res = await chai.request("https://jsonplaceholder.typicode.com").get("/comments?postId=1");
      res.should.have.status(200);
      expect(res.body[0]).to.have.property("postId", 1);
    });

    it("Deve retornar 404 ao buscar ID inexistente", async function () {
      const res = await chai.request("https://jsonplaceholder.typicode.com").get("/comments/999999");
      res.should.have.status(404);
    });
  });
});
