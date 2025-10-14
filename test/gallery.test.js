// test/gallery.test.js

const chai = require('chai');
const sinon = require('sinon');

const should = chai.should();
const expect = chai.expect;
const assert = chai.assert;

// Importa as funções que vamos testar
const {
  addPhoto,
  getAllPhotos,
  getPhotoById,
  getPhotosByTitle,
  updatePhotoTitle,
  deletePhoto,
  resetPhotos,
  fetchPhotosFromApi
} = require('../src/gallery.js');

const galleryModule = require('../src/gallery.js');

describe('Gerenciamento da Galeria de Fotos', () => {
    
    // Limpa a lista de fotos antes de cada teste
    beforeEach(() => {
        resetPhotos();
    });

    // Testes com o estilo EXPECT
    describe('Testes Unitários com EXPECT', () => {
        it('deve adicionar uma nova foto com sucesso', () => {
            const photo = { id: 1, title: 'Minha Foto', url: 'http://foto.com/1.jpg', authorId: 1 };
            addPhoto(photo);
            const allPhotos = getAllPhotos();
            expect(allPhotos).to.have.lengthOf(1);
            expect(allPhotos[0]).to.deep.equal(photo);
        });

        it('deve lançar um erro ao adicionar uma foto com ID duplicado', () => {
            const photo = { id: 1, title: 'Minha Foto', url: 'http://foto.com/1.jpg', authorId: 1 };
            addPhoto(photo);
            expect(() => addPhoto(photo)).to.throw('ID da foto já está cadastrado');
        });

        it('deve encontrar uma foto pelo ID', () => {
            const photo1 = { id: 1, title: 'Foto 1', url: 'http://foto.com/1.jpg', authorId: 1 };
            addPhoto(photo1);
            const foundPhoto = getPhotoById(1);
            expect(foundPhoto).to.be.an('object');
            expect(foundPhoto).to.have.property('title').that.equals('Foto 1');
        });

        it('deve retornar uma lista de fotos ao buscar por título', () => {
            addPhoto({ id: 1, title: 'Viagem para a praia', url: 'http://a.com', authorId: 1 });
            addPhoto({ id: 2, title: 'Viagem para o campo', url: 'http://b.com', authorId: 1 });
            const results = getPhotosByTitle('Viagem');
            expect(results).to.be.an('array').with.lengthOf(2);
        });

        it('deve retornar undefined ao buscar por um ID que não existe', () => {
            const result = getPhotoById(999);
            expect(result).to.be.undefined;
        });
    });

    // Testes com o estilo SHOULD
    describe('Testes Unitários com SHOULD', () => {
        it('deve deletar uma foto com sucesso', () => {
            const photo = { id: 1, title: 'Foto para deletar', url: 'http://a.com', authorId: 1 };
            addPhoto(photo);
            let allPhotos = getAllPhotos();
            allPhotos.should.have.lengthOf(1);

            deletePhoto(1);

            allPhotos = getAllPhotos();
            allPhotos.should.have.lengthOf(0);
        });

        it('deve lançar um erro ao tentar deletar uma foto que não existe', () => {
            (() => deletePhoto(999)).should.throw('Foto não encontrada');
        });

        it('deve atualizar o título de uma foto', () => {
            const photo = { id: 1, title: 'Título Antigo', url: 'http://a.com', authorId: 1 };
            addPhoto(photo);
            
            updatePhotoTitle(1, 'Título Novo');
            
            const updatedPhoto = getPhotoById(1);
            updatedPhoto.title.should.equal('Título Novo');
        });

        it('deve lançar um erro ao atualizar com um título inválido', () => {
            const photo = { id: 1, title: 'Título', url: 'http://a.com', authorId: 1 };
            addPhoto(photo);
            (() => updatePhotoTitle(1, '  ')).should.throw('Título novo inválido');
        });

        it('a função getAllPhotos deve retornar um array', () => {
            const photos = getAllPhotos();
            photos.should.be.an('array');
        });
    });

    // Testes com o estilo ASSERT
    describe('Testes Unitários com ASSERT', () => {
        it('deve lançar um erro se os dados da foto forem inválidos', () => {
            const invalidPhoto = { id: 1, title: 'Incompleta' };
            assert.throws(() => addPhoto(invalidPhoto), 'Dados da foto inválidos');
        });
        
        it('deve lançar um erro para URL inválida', () => {
            const photo = { id: 1, title: 'Título', url: 'url-sem-http', authorId: 1 };
            assert.throws(() => addPhoto(photo), 'URL da foto inválida');
        });

        it('deve encontrar fotos que contenham parte do título', () => {
            addPhoto({ id: 1, title: 'Festa na piscina', url: 'http://a.com', authorId: 1 });
            const results = getPhotosByTitle('piscina');
            assert.strictEqual(results.length, 1, 'Deveria encontrar uma foto');
        });
        
        it('não deve lançar erro ao atualizar uma foto existente', () => {
            addPhoto({ id: 1, title: 'Título', url: 'http://a.com', authorId: 1 });
            assert.doesNotThrow(() => updatePhotoTitle(1, 'Novo Título'), 'Não deveria lançar erro');
        });

        it('deve retornar uma lista vazia ao buscar por um título que não existe', () => {
            const results = getPhotosByTitle('Título Inexistente');
            assert.deepEqual(results, [], 'Deveria retornar um array vazio');
        });
    });

    // Testes de API com SINON
    describe('Testes de API Mockada com SINON', () => {
        let fetchStub;

        // Antes de cada teste, criamos o stub
        beforeEach(() => {
            fetchStub = sinon.stub(galleryModule, 'fetchPhotosFromApi');
        });
    
        // Depois de cada teste, restauramos a função original
        afterEach(() => {
            fetchStub.restore();
        });

        it('deve chamar a função fetchPhotosFromApi uma vez', async () => {
            fetchStub.resolves([]); // Configura para retornar um array vazio
            await galleryModule.fetchPhotosFromApi();
            assert.isTrue(fetchStub.calledOnce, 'A função deveria ter sido chamada uma vez');
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
                // Se o código chegar aqui, o teste deve falhar, pois um erro era esperado.
                assert.fail('A função deveria ter lançado um erro');
            } catch (error) {
                error.message.should.equal(errorMessage);
            }
        });

        it('deve garantir que a função foi chamada sem argumentos', async () => {
            fetchStub.resolves([]);
            await galleryModule.fetchPhotosFromApi();
            assert.isTrue(fetchStub.calledWith(), 'A função foi chamada com argumentos inesperados');
        });
        
        it('o stub deve retornar um array, mesmo que vazio', async () => {
            fetchStub.resolves([]);
            const result = await galleryModule.fetchPhotosFromApi();
            assert.isArray(result);
        });
    });
});