const sinon = require('sinon');
const chai = require('chai');
//const chaiHttp = require('chai-http').default;
const usuario = require('../src/user.js');

const expect = chai.expect;
const assert = chai.assert;
chai.should();
//chai.use(chaiHttp);

beforeEach(() => {
    usuario.resetUsers();
});

describe('createUser', () => {
    it('EXPECT - Usuário adicionado', () => {
        const user = {
            id: 1,
            name: 'Carlos',
            userName: 'Carlinhos',
            password: '12345',
            email: 'carlos@gmail.com'
        };
        usuario.createUser(user);

        const listUser = usuario.getAllUsers();
        expect(listUser).to.length(1);
        expect(listUser[0]).to.deep.equal({
            id: 1,
            name: 'Carlos',
            userName: 'Carlinhos',
            password: '12345',
            email: 'carlos@gmail.com',
            gallery: [], 
            posts: []
        });
    });

    it('SHOULD - Dados do usuário inválidos', () => {
        // !user
        (() => usuario.createUser({})).should.throw('Dados inválidos');
        
        // !user.id
        (() => usuario.createUser({userName: 'Error', password: 'error123', email: 'error@gmail'})).should.throw('Dados inválidos');
        
        // !user.userName
        (() => usuario.createUser({id: 99, password: 'error123', email: 'error@gmail'})).should.throw('Dados inválidos');
        
        // !user.password
        (() => usuario.createUser({id: 99, userName: 'Error', email: 'error@gmail'})).should.throw('Dados inválidos');
        
        // !user.email
        (() => usuario.createUser({id: 99, userName: 'Error', password: 'error123'})).should.throw('Dados inválidos');
    });

    it('SHOULD - Email do usuário inválido', () => {
        // Sem o ' @ '

        (() => usuario.createUser({
            id: 99,
            name: 'Rodrigo',
            userName: 'Digo',
            password: 'senha987',
            email: 'digogmail.com'
        })).should.throw('Email inválido');
    });

    it('SHOULD - Dados duplicados', () => {
        const user = {
            id: 1,
            name: 'Carlos',
            userName: 'Carlinhos',
            password: '12345',
            email: 'carlos@gmail.com'
        };
        usuario.createUser(user);

        // id
        (() => usuario.createUser({
            id: 1,
            name: 'Mateus',
            userName: 'Teteu',
            password: 'senha123',
            email: 'teteu@gmail.com'
        })).should.throw('ID já está cadastrado');

        // userName
        (() => usuario.createUser({
            id: 2,
            name: 'Mateus',
            userName: 'Carlinhos',
            password: 'senha123',
            email: 'teteu@gmail.com'
        })).should.throw('Nome de usuário já está cadastrado');

        // email
        (() => usuario.createUser({
            id: 2,
            name: 'Mateus',
            userName: 'Teteu',
            password: 'senha123',
            email: 'carlos@gmail.com'
        })).should.throw('Email já está cadastrado');
    });
});

describe('LogInUser', () => {
    it('SINON  - Loga usuário', () => {
        const user = {
            id: 1,
            name: 'Carlos',
            userName: 'Carlinhos',
            password: '12345',
            email: 'carlos@gmail.com'
        };
        usuario.createUser(user);

        const logStub = sinon.stub(console, 'log');

        usuario.logInUser('Carlinhos', '12345');

        expect(logStub.calledOnce).to.be.true;
        expect(logStub.calledWith('Usuário Carlinhos foi logado')).to.be.true;

        logStub.restore();
    });

    it('SHOULD - Usuário não encontrado', () => {
        (() => usuario.logInUser('Error', 'error123')).should.throw('Usuário não encontrado');
    });

    it('SHOULD - Senha inválida', () => {
        const user = {
            id: 1,
            name: 'Carlos',
            userName: 'Carlinhos',
            password: '12345',
            email: 'carlos@gmail.com'
        };
        usuario.createUser(user);

        (() => usuario.logInUser('Carlinhos', 'error123')).should.throw('Senha inválida');
    });
});

describe('getAllUsers', () => {
    it('EXPECT - Busca todos os usuários', () => {
        usuario.createUser({
            id: 1,
            name: 'Marcelo',
            userName: 'Marcelinho123',
            password: 'marcelo123',
            email: 'marcelo@gmail.com'
        });

        usuario.createUser({
            id: 2,
            name: 'Carlos',
            userName: 'Carlinhos',
            password: '12345',
            email: 'carlos@gmail.com'
        });
        
        const listUser = usuario.getAllUsers();
        expect(listUser).to.length(2);
        expect(listUser[0]).to.contain({id: 1, userName: 'Marcelinho123'});
    });

    it('ASSERT - Lista de usuários vazia', () => {
        const listUser = usuario.getAllUsers()
        assert.strictEqual(listUser.length, 0);
        assert.deepStrictEqual(listUser, []);
    });
});

describe('getUserById', () => {
    it('EXPECT - Busca o usuário pelo id', () => {
        usuario.createUser({
            id: 1,
            name: 'Marcelo',
            userName: 'Marcelinho123',
            password: 'marcelo123',
            email: 'marcelo@gmail.com'
        });

        usuario.createUser({
            id: 2,
            name: 'Carlos',
            userName: 'Carlinhos',
            password: '12345',
            email: 'carlos@gmail.com'
        });
        
        expect(usuario.getUserById(1)).to.contain({ id:1, userName: 'Marcelinho123', email: 'marcelo@gmail.com' });
    });

    it('ASSERT - Usuário não encontrado', () => {
        assert.isUndefined(usuario.getUserById(99));
    });
});

describe('getUsersByName', () => {
    it('EXPECT - Busca os usuários pelo nome', () => {
        usuario.createUser({
            id: 1,
            name: 'Marcelo',
            userName: 'Marcelinho123',
            password: 'marcelo123',
            email: 'marcelo@gmail.com'
        });

        usuario.createUser({
            id: 2,
            name: 'Carlos',
            userName: 'Carlinhos',
            password: '12345',
            email: 'carlos@gmail.com'
        });

        usuario.createUser({
            id: 3,
            name: 'Marcelo',
            userName: 'Marcelao',
            password: '12345',
            email: 'marcelao@gmail.com'
        });

        const listUser = usuario.getUsersByName('Marcelo');
        expect(listUser).to.length(2);
        expect(listUser[0]).to.contain({id: 1, name: 'Marcelo'});
        expect(listUser[1]).to.contain({id: 3, name: 'Marcelo'});

        // Valida se a senha foi ocultada
        expect(listUser[0]).to.not.contain({password: 12345});
    });

    it('ASSERT - Nome não encontrado', () => {
        const listUser = usuario.getUsersByName('Pablo');
        assert.lengthOf(listUser, 0)
        assert.deepStrictEqual(listUser, []);
    });

    it('SINON  - Busca os usuários pelo nome, usando stub', () => {
        const fakeUser = {
            id: 1,
            name: 'Stubbed User',
            userName: 'stub_user',
            password: '12345',
            email: 'stubbed_user@gmail.com'
        };

        const stub = sinon.stub(usuario, 'getUsersByName').returns([fakeUser]);

        const result = usuario.getUsersByName('Stubbed User');

        expect(stub.calledOnce).to.be.true;
        expect(result).to.be.an('array').that.has.lengthOf(1);
        expect(result[0].name).to.equal('Stubbed User');
    });
});

describe('updateUser', () => {
    it('EXPECT - Atualiza usuário', () => {
        const user = {
            id: 1,
            name: 'Carlos',
            userName: 'Carlinhos',
            password: '12345',
            email: 'carlos@gmail.com'
        };
        usuario.createUser(user);

        usuario.updateUser(1, 'name', 'Carlao');

        const dataUser = usuario.getUserById(1);
        expect(dataUser).to.contain({name: 'Carlao'});
    });

    it('SHOULD - Usuário não encontrado', () => {
        (() => usuario.updateUser(99, 'name', 'Error')).should.throw('Usuário não encontrado');
    });

    it('SHOULD - Dados que não podem ser alterados', () => {
        const user = {
            id: 1,
            name: 'Carlos',
            userName: 'Carlinhos',
            password: '12345',
            email: 'carlos@gmail.com'
        };
        usuario.createUser(user);

        // id
        (() => usuario.updateUser(1, 'id', 99)).should.throw('Esses dados não podem ser alterados');
        
        // email
        (() => usuario.updateUser(1, 'email', 'error@gmail.com')).should.throw('Esses dados não podem ser alterados');
    });

    it('SHOULD - Campo inválido', () => {
        const user = {
            id: 1,
            name: 'Carlos',
            userName: 'Carlinhos',
            password: '12345',
            email: 'carlos@gmail.com'
        };
        usuario.createUser(user);

        (() => usuario.updateUser(1, 'banana', 'Error')).should.throw('Campo inválido');
    });

    it('SHOULD - Apelido já exite', () => {
        usuario.createUser({
            id: 1,
            name: 'Marcelo',
            userName: 'marcelinho123',
            password: 'marcelo123',
            email: 'marcelo@gmail.com'
        });

        usuario.createUser({
            id: 2,
            name: 'Carlos',
            userName: 'Carlinhos',
            password: '12345',
            email: 'carlos@gmail.com'
        });

        (() => usuario.updateUser(1, 'userName', 'CARLINHOS')).should.throw('Nome de usuário já está cadastrado');
    });

    it('ASSERT - Atualiza userName mantendo o mesmo usuário', () => {
        const user = {
            id: 1,
            name: 'Carlos',
            userName: 'Carlinhos',
            password: '12345',
            email: 'carlos@gmail.com'
        };
        usuario.createUser(user);

        usuario.updateUser(1, 'userName', 'CARLINHOS');

        const dataUser = usuario.getUserById(1);
        assert.strictEqual(dataUser.userName, 'CARLINHOS');
    });
});

describe('deleteUser', () => {
    it('EXPECT - Deleta usuário', () => {
        usuario.createUser({
            id: 1,
            name: 'Marcelo',
            userName: 'marcelinho123',
            password: 'marcelo123',
            email: 'marcelo@gmail.com'
        });

        usuario.createUser({
            id: 2,
            name: 'Carlos',
            userName: 'Carlinhos',
            password: '12345',
            email: 'carlos@gmail.com'
        });

        usuario.deleteUser(1);
        expect(usuario.getAllUsers()).to.length(1);
        expect(usuario.getUserById(1)).to.be.undefined;
    });

    it('SHOULD - Usuário não encontrado', () => {
        (() => usuario.deleteUser(99)).should.throw('Usuário não encontrado');
    });
});

describe('reseteUsers', () => {
    it('ASSERT - Reseta lista de usuários', () => {
        const user = {
            id: 1,
            name: 'Carlos',
            userName: 'Carlinhos',
            password: '12345',
            email: 'carlos@gmail.com'
        };
        usuario.createUser(user);

        usuario.resetUsers();
        assert.strictEqual(usuario.getAllUsers().length, 0);
    });
});