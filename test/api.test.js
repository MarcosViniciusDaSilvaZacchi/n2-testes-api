const chai = require('chai');
const chaiHttp = require('chai-http');
const { it } = require('mocha');
const expect = chai.expect;

chai.use(chaiHttp);

// URL base do JSONPlaceholder
const BASE_URL = 'https://jsonplaceholder.typicode.com';

describe('JSONPlaceholder - Testes de API', () => {

  describe('GET', () => {
    it('/post', async () => {
      const res = await chai.request(BASE_URL).get('/posts');

      expect(res).to.have.status(200);
      expect(res.body).to.be.an('array');
      expect(res.body).to.be.lengthOf(100);
    });

    it('/users', async () => {
      const res = await chai.request(BASE_URL).get('/users');

      expect(res).to.have.status(200);
      expect(res.body).to.be.an('array');
      expect(res.body).to.be.lengthOf(10);
    });

    it('/users/1', async () => {
      const res = await chai.request(BASE_URL).get('/users/1');

      expect(res).to.have.status(200);
      expect(res.body).to.be.an('object');
      expect(res.body.address).to.have.keys(['street', 'suite', 'city', 'zipcode', 'geo']);
      expect(res.body.company).to.have.keys(['name', 'catchPhrase', 'bs']);
    });
    
    it('/users/10', async () => {
      const res = await chai.request(BASE_URL).get('/users/10');

      expect(res).to.have.status(200);
      expect(res.body).to.be.an('object');
      expect(res.body.id).to.equal(10);
      expect(res.body.name).to.equal('Clementina DuBuque');
    });

    it('/users/99', async () => {
      try {
        await chai.request(BASE_URL).get('/users/99');
      } 
      catch (err) {
        expect(err.response).to.have.status(404);
        expect(err.response.body).to.be.an('object');
      }
    });

    it('/users/5/albuns', async () => {
      const res = await chai.request(BASE_URL).get('/users/5/albums');

      expect(res).to.have.status(200);
      expect(res.body).to.be.an('array');
      expect(res.body.length).to.be.greaterThan(0);

      res.body.forEach(a => {
          expect(a.userId).to.equal(5);
      });
    });

    
    it('users/1/todos', async () => {
      const res = await chai.request(BASE_URL).get('/users/1/todos');

      expect(res).to.have.status(200);
      expect(res.body).to.be.an('array');

      const statusFalse = res.body.filter(a => a.completed === false);
      expect(statusFalse.length).to.be.lessThan(res.body.length);
    });
    
    it('/posts/5/comments', async () => {
      const res = await chai.request(BASE_URL).get('/posts/5/comments');

      expect(res).to.have.status(200);
      expect(res.body).to.be.an('array');
      expect(res.body.length).to.be.greaterThan(0);

      res.body.forEach(a => {
          expect(a.postId).to.equal(5);
      });

      const emailUsers = res.body.map(a => a.email);
      expect(emailUsers).to.include('Sophia@arianna.co.uk');
    });

    it('/comments', async() => {
      const res = await chai.request(BASE_URL).get('/comments');

      expect(res).to.have.status(200);
      expect(res.body).to.be.an('array');
      expect(res.body).to.be.lengthOf(500);

      res.body.forEach(comment => {
          expect(comment).to.have.property('postId');   
          expect(comment.postId).to.be.a('number');     
          expect(comment.postId).to.not.be.NaN;
      });
    });

    it('/photos - Deve retornar todas as fotos com URLs válidas', async() => {
      const res = await chai.request(BASE_URL).get('/photos');

      expect(res).to.have.status(200);
      expect(res.body).to.be.an('array');

      res.body.forEach(a => {
          expect(a.url).to.contain('https://');
          expect(a.thumbnailUrl).to.contain('https://');
      });
    });

  });

  describe('POST', () => {
    it('/posts', async () => {
      const newPost = {
        userId: 1,
        id: 101,
        title: 'Teste de API',
        body: 'Um post criado para teste de API'
    };

      const res = await chai.request(BASE_URL).post('/posts').send(newPost);
      expect(res).to.have.status(201);
      expect(res.body).to.be.an('object');
      expect(res.body).to.deep.include(newPost);
    });

    it('/posts - Sem ID', async () => {
      const newPost = {
        userId: 1,
        //id: 101,
        title: 'Teste de API',
        body: 'Um post criado para teste de API'
    };

      try{
        await chai.request(BASE_URL).post('/posts').send(newPost);
      }
      catch(err) {
        expect(err.response).to.have.status(404);
        expect(err.response.body).to.be.an('object');
      }
    });

    it('/posts - Usuario Inválido', async () => {
      const newPost = {
        userId: 99,
        id: 101,
        title: 'Teste de API',
        body: 'Um post criado para teste de API'
    };

      try{
        await chai.request(BASE_URL).post('/posts').send(newPost);
      }
      catch(err) {
        expect(err.response).to.have.status(404);
        expect(err.response.body).to.be.an('object');
      }
    });

    it('/albums/1/photos - ID repetido', async () => {
      const newPhoto = {
        albumId: 1,
        id: 1,
        title: 'Teste de API',
        url: 'https://testeApi.com',
        thumbnailUrl: 'https://linkParaTesteApi.com'
      };

      
      try{
        await chai.request(BASE_URL).post('/albums/1/photos').send(newPhoto);
      }
      catch(err) {
        expect(err.response).to.have.status(404);
        expect(err.response.body).to.be.an('object');
      }
    });

    it('/todos - Faltando a propriedade "completed"', async () => {
      const newTodo = {
        userId: 1,
        id: 201,
        title: 'Teste de API'
        //completed
      };

      const res = await chai.request(BASE_URL).post('/todos').send(newTodo);
      expect(res).to.have.status(201);
      expect(res.body).to.be.an('object');
      expect(res.body.id).to.equal(newTodo.id);
      expect(res.body).to.not.have.property('completed');
    });

    it('/albums - Envia dados vazio', async () => {
      try{
        await chai.request(BASE_URL).post('/albums').send({});
      } 
      catch(err) {
        expect(err.response).to.have.status(404);
        expect(err.response.body).to.be.an('object');
      }
    });
  });

  describe('PUT', () => {
      it('/posts/1 - Deve atualizar uma postagem', async () => {
      const updatePost = {
        userId: 1,
        id: 1,
        title: "Novo Titulo",
        body: "Novo Body"
      };

      const res = await chai.request(BASE_URL).put('/posts/1').send(updatePost);
      expect(res).to.have.status(200);
      expect(res.body.title).to.equal("Novo Titulo");
    });

    // Corrigir
    it('/todos/1 - Deve atualizar completed de false para true', async () => {
      const updateTodo = {
        completed: true
      };

      const res = await chai.request(BASE_URL).put('/todos/1').send(updateTodo);
      expect(res).to.have.status(200);
      expect(res.body.completed).to.be.a('boolean').and.to.equal(true);
    });

    it('/photos/9999', async () => {
      const updatePhoto = {
        albumId: 1,
        id: 9999,
        title: 'Teste de API'
      };

      const res = await chai.request(BASE_URL).put('/photos/9999').send(updatePhoto);
      expect([404, 500]).to.include(res.status);
      expect(res.body).to.be.an('object');
    });
  });
  describe('DELETE', () => {
    it('/users/1', async () => {
      const res = await chai.request(BASE_URL).delete('/users/1');
      expect(res).to.have.status(200);
      expect(res.body).to.be.an('object');
      expect(res.body).to.be.empty;
    });

    it('/albums/999', async () => {
      const res = await chai.request(BASE_URL).delete('/albums/999');
      expect(res).to.have.status(200);
      expect(res.body).to.be.an('object');
      expect(res.body).to.be.empty;
    });
  });

});