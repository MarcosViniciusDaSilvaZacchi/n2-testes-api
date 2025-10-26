//Importando as funções necessárias para os test
const usuario = require('../src/user.js')
const postagem = require('../src/post.js')
const imagem = require('../src/gallery.js');

//importando ferramentas de test
const chai = require('chai');
const sinon = require('sinon');
const should = chai.should();
const expect = chai.expect;
const assert = chai.assert;

beforeEach(()=>{
    usuario.resetUsers()
    sinon.restore();
})

describe("uploadPhoto with assert",()=>{
    beforeEach(()=>{
      const user = {
        id: 1,
        name: 'Catatau',
        userName: 'catatau',
        password: '12345',
        email: 'catatau@gmail.com'
      }
      usuario.createUser(user);
    })
    it('Deve retornar o objeto imagem', () => {
      const userId = 1;
      const image = { 
        id: 15,
        type: 'image/png',
        description: 'Zé comeia foi pego com pote de mel na cueca',
        createDat: "2024/10/02"
      };
      const newPhoto = imagem.uploadPhoto(userId,image);
      assert.deepEqual(newPhoto,image);
    });
    it("Deve lançar error ao tentar salvar imagem com id de usuario inexistente",()=>{
      const userId = 10;
      const image = { 
        id: 15,
        type: 'image/png',
        description: 'Zé comeia foi pego com pote de mel na cueca',
        createDat: "2024/10/02"
      };

      assert.throws(()=>imagem.uploadPhoto(userId,image),"Usuario não encontrado");
    });
    it('Deve lança erro caso extenção não seja png',()=>{
      const userId = 1;
      const image = { 
        id: 15,
        type: 'image/pdf',
        description: 'Zé comeia foi pego com pote de mel na cueca',
        createDat: "2024/10/02"
      };

      assert.throws(()=>imagem.uploadPhoto(userId,image),'Tipo de imagem não suportado');
    });
    it('Deve lança erro caso campo data não for informado',()=>{
      const userId = 1;
      const image = { 
        id: 15,
        type: 'image/png',
        description: 'Zé comeia foi pego com pote de mel na cueca'
      };

      assert.throws(()=>imagem.uploadPhoto(userId,image),'Data Inválida');
    });
    it("Deve lançar error ao tentar salvar outra imagem com id já existente",()=>{
      const userId = 1;
      const image1 = { 
        id: 15,
        type: 'image/png',
        description: 'Zé comeia foi pego com pote de mel na cueca',
        createDat: "2024/10/02"
      };
      const image2 = { 
        id: 15,
        type: 'image/png',
        description: 'Zé comeia foi pego com pote de mel na cueca',
        createDat: "2024/10/02"
      };
      imagem.uploadPhoto(userId,image1)

      assert.throws(()=>imagem.uploadPhoto(userId,image2),'Já existe uma imagem com esse id');
    });
    it("Deve lançar error caso campo description estiver em branco",()=>{
      const userId = 1;
      const image = { 
        id: 15,
        type: 'image/png',
        description: '',
        createDat: "2024/10/02"
      };
      assert.throws(()=>imagem.uploadPhoto(userId,image),'Descrição da imagem não pode ser em branco');
    });
    it("Deve lançar error caso campo description for inexistente",()=>{
      const userId = 1;
      const image = { 
        id: 15,
        type: 'image/png',
        createDat: "2024/10/02"
      };
      assert.throws(()=>imagem.uploadPhoto(userId,image),'Descrição da imagem não pode ser em branco');
    });
});

describe('getPhotoById',()=>{
    it('retorna uma imagem usando stub',()=>{
        const fakeUser = {
            id: 1,
            name: 'Catatau',
            userName: 'catatau',
            password: '12345',
            email: 'catatau@gmail.com',
            images: [
                {id: 15,type: 'image/png',description: 'Zé comeia foi pego com pote de mel na cueca',createDat: "2024/10/02"},
                {id: 20,type: 'image/png',description: 'Zé comeia preso por lavagem de mel',createDat: "2024/10/15"}
            ] 
        }
        sinon.stub(usuario,'getUserById').returns(fakeUser);
        const result = imagem.getPhotoById(1,20);
        expect(result).to.deep.equal({id: 20,type: 'image/png',description: 'Zé comeia preso por lavagem de mel',createDat: "2024/10/15"});
        sinon.restore();
    })
});
describe('getPhotosByRangeDate',()=>{
    it('retorna um range imagens com base na data usando stub',()=>{
        const fakeUser = {
            id: 1,
            name: 'Catatau',
            userName: 'catatau',
            password: '12345',
            email: 'catatau@gmail.com',
            images: [
                {id: 15,type: 'image/png',description: 'Zé comeia foi pego com pote de mel na cueca',createDat: "2024/10/02"},
                {id: 20,type: 'image/png',description: 'Zé comeia preso por lavagem de mel',createDat: "2024/10/15"}
            ] 
        }
        sinon.stub(usuario,'getUserById').returns(fakeUser);
        const result = imagem.getPhotosByRangeDate(1,"2024/10/01","2024/10/25");
        expect(result).to.deep.equal([{id: 15,type: 'image/png',description: 'Zé comeia foi pego com pote de mel na cueca',createDat: "2024/10/02"},
            {id: 20,type: 'image/png',description: 'Zé comeia preso por lavagem de mel',createDat: "2024/10/15"}
        ]);
        sinon.restore();
    })
});
