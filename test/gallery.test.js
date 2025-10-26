// test/gallery.test.js

const chai = require('chai');
const sinon = require('sinon');

const should = chai.should();
const expect = chai.expect;
const assert = chai.assert;

const {
  uploadPhoto,
  getPhotoById,
  getPhotosByUser,
  getPhotosByRangeDate,
  deletePhoto,
  likePhoto,
  unlikePhoto,
  resetPhotos
} = require('../src/gallery.js');

const galleryModule = require('../src/gallery.js'); // Para o Sinon

describe('Gerenciamento da Galeria de Fotos (Avançado)', () => {

  beforeEach(() => {
    resetPhotos();
  });

  // Testes com o estilo EXPECT (7 testes)
  describe('Funções de Criação e Busca (com EXPECT)', () => {
    it('deve fazer o upload de uma nova foto com sucesso', () => {
      const photoData = { imageUrl: 'http://a.com/1.jpg', description: 'Minha foto', authorId: 1 };
      const newPhoto = uploadPhoto(photoData);
      expect(newPhoto).to.be.an('object');
      expect(newPhoto).to.have.property('id', 1);
    });

    it('a foto criada deve conter um array de likes vazio', () => {
        const newPhoto = uploadPhoto({ imageUrl: 'http://a.com/1.jpg', description: 'Foto', authorId: 1 });
        expect(newPhoto.likes).to.be.an('array').that.is.empty;
    });

    it('deve encontrar fotos de um usuário específico', () => {
      uploadPhoto({ imageUrl: 'http://a.com/1.jpg', description: 'Foto de A', authorId: 1 });
      uploadPhoto({ imageUrl: 'http://b.com/1.jpg', description: 'Foto de B', authorId: 2 });
      const userPhotos = getPhotosByUser(1);
      expect(userPhotos).to.have.lengthOf(1);
    });

    it('deve retornar um array vazio para um usuário sem fotos', () => {
        const userPhotos = getPhotosByUser(999);
        expect(userPhotos).to.be.an('array').that.is.empty;
    });

    it('deve lançar um erro se dados da foto forem inválidos', () => {
      const invalidData = { description: 'Faltando URL e autor' };
      expect(() => uploadPhoto(invalidData)).to.throw("Dados da foto inválidos");
    });

    it('a propriedade createdAt deve ser um objeto Date', () => {
        const newPhoto = uploadPhoto({ imageUrl: 'http://a.com', description: 'Data', authorId: 1 });
        expect(newPhoto.createdAt).to.be.a('Date');
    });

    it('deve lançar um erro ao tentar curtir uma foto que não existe (EXPECT)', () => {
      const idInexistente = 999;
      const userId = 100;
      expect(() => {
        likePhoto(idInexistente, userId);
      }).to.throw('Foto não encontrada');
    });
  });

  // Testes com o estilo SHOULD (7 testes)
  describe('Funções de Like e Unlike (com SHOULD)', () => {
    let photo;
    beforeEach(() => {
        photo = uploadPhoto({ imageUrl: 'http://a.com', description: 'Foto', authorId: 1 });
    });

    it('deve adicionar um like a uma foto', () => {
      likePhoto(photo.id, 100);
      const likedPhoto = getPhotoById(photo.id);
      likedPhoto.likes.should.have.lengthOf(1);
      likedPhoto.likes[0].should.equal(100);
    });

    it('não deve adicionar um like duplicado', () => {
      likePhoto(photo.id, 100);
      likePhoto(photo.id, 100);
      const likedPhoto = getPhotoById(photo.id);
      likedPhoto.likes.should.have.lengthOf(1);
    });

    it('deve remover um like de uma foto', () => {
      likePhoto(photo.id, 100);
      unlikePhoto(photo.id, 100);
      const unlikedPhoto = getPhotoById(photo.id);
      unlikedPhoto.likes.should.not.include(100);
    });

    it('a lista de likes deve ser um array', () => {
        const result = likePhoto(photo.id, 101);
        result.likes.should.be.an('array');
    });

    it('a remoção de um like que não existe não deve quebrar a função', () => {
        unlikePhoto(photo.id, 999);
        const currentPhoto = getPhotoById(photo.id);
        currentPhoto.likes.should.be.an('array').that.is.empty;
    });

    it('deve lançar erro ao tentar descurtir foto que não existe', () => {
        const idInexistente = 999;
        const userId = 100;
        (() => {
            unlikePhoto(idInexistente, userId);
        }).should.throw('Foto não encontrada');
    });
  });

  // Testes com o estilo ASSERT (6 testes)
  describe('Funções de Filtro e Deleção (com ASSERT)', () => {
    it('deve deletar uma foto e ela não deve mais ser encontrada', () => {
      const photo = uploadPhoto({ imageUrl: 'http://a.com', description: 'Para deletar', authorId: 1 });
      deletePhoto(photo.id);
      assert.isUndefined(getPhotoById(photo.id), 'Foto não deveria mais ser encontrada');
    });

    it('deve lançar um erro ao tentar deletar uma foto que não existe', () => {
      assert.throws(() => deletePhoto(999), "Foto não encontrada");
    });

    it('deve encontrar fotos por intervalo de data', () => {
      uploadPhoto({ imageUrl: 'http://a.com', description: 'Foto 1', authorId: 1 });
      const startDate = new Date(Date.now() - 1000);
      const endDate = new Date(Date.now() + 1000);
      const results = getPhotosByRangeDate(1, startDate, endDate);
      assert.strictEqual(results.length, 1);
    });

    it('não deve encontrar fotos fora do intervalo de data', () => {
      uploadPhoto({ imageUrl: 'http://a.com', description: 'Foto 1', authorId: 1 });
      const futureStartDate = new Date(Date.now() + 5000);
      const futureEndDate = new Date(Date.now() + 10000);
      const results = getPhotosByRangeDate(1, futureStartDate, futureEndDate);
      assert.isEmpty(results, 'Não deveria encontrar fotos em um intervalo futuro');
    });

    it('o id de uma foto criada deve ser um número', () => {
        const newPhoto = uploadPhoto({ imageUrl: 'http://a.com', description: 'a', authorId: 1 });
        assert.isNumber(newPhoto.id);
    });

    it('não deve lançar erro ao deletar uma foto existente', () => {
        const photo = uploadPhoto({ imageUrl: 'http://a.com', description: 'b', authorId: 1 });
        assert.doesNotThrow(() => deletePhoto(photo.id));
    });
  });

  // Testes com o SINON (5 testes)
  describe('Testes de API Mockada com SINON', () => {
    let fetchStub;
    beforeEach(() => {
        fetchStub = sinon.stub(galleryModule, 'fetchPhotosFromApi');
    });
    afterEach(() => {
        fetchStub.restore();
    });

    it('deve chamar a função fetchPhotosFromApi uma vez', async () => {
        fetchStub.resolves([]);
        await galleryModule.fetchPhotosFromApi();
        assert.isTrue(fetchStub.calledOnce);
    });

    it('deve retornar os dados mockados corretamente', async () => {
        const fakeData = [{ id: 99, title: 'Foto Mockada' }];
        fetchStub.resolves(fakeData);
        const result = await galleryModule.fetchPhotosFromApi();
        expect(result).to.deep.equal(fakeData);
    });

    it('deve simular um erro na chamada da API', async () => {
        const errorMessage = 'API fora do ar';
        fetchStub.rejects(new Error(errorMessage));
        try {
            await galleryModule.fetchPhotosFromApi();
            assert.fail('A função deveria ter lançado um erro');
        } catch (error) {
            error.message.should.equal(errorMessage);
        }
    });

    it('deve garantir que a função foi chamada sem argumentos', async () => {
        fetchStub.resolves([]);
        await galleryModule.fetchPhotosFromApi();
        assert.isTrue(fetchStub.calledWith());
    });

    it('o stub deve retornar um array, mesmo que vazio', async () => {
        fetchStub.resolves([]);
        const result = await galleryModule.fetchPhotosFromApi();
        assert.isArray(result);
    });
  });
});