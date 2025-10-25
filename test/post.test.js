const chai = require('chai');
const usuario = require('../src/user.js');
const postagem = require('../src/post.js');

const expect = chai.expect;

beforeEach(() => {
    usuario.resetUsers();
});

describe("addPost", ()=>{
   it("Deve criar e associar corretamente um novo post ao ID do usuário", ()=>{
        const user = {
            id: 1,
            name: 'Catatau',
            userName: 'catatau',
            password: '12345',
            email: 'catatau@gmail.com'
        };
        usuario.createUser(user);
        const userId = 1;
        const newPost = {
            date: "24/10/2025",
            category: "Política",
            text: "Os politicos são corruptos, por isso a população passa fome."
        };
        const result = postagem.createPost(userId,newPost);
        const postCriado = postagem.searchPosts(userId)[0];

        expect(postCriado).to.be.exist;
        expect(postCriado).to.deep.equal(newPost)


    });
    it("Deve lançar um erro caso o campo text seja vazio", ()=>{
        const userId = 50;
        const invalidPost = {
            date: "24/10/2025",
            category: "Política",
            text: ""
        }
        expect(()=>{
            postagem.createPost(userId,invalidPost)
        }).to.throw("O Post deve ter um conteúdo de texto válido.");
        
    });
    it("Deve lançar um erro caso o campo date seja vazio", ()=>{
        const userId = 50;
        const invalidPost = {
            date: "",
            category: "Política",
            text: "Os politicos são corruptos, por isso a população passa fome."
        }
        expect(()=>{
            postagem.createPost(userId,invalidPost)
        }).to.throw("Data não pode ser vazia");
        
    });
    it("Deve lançar um erro caso o campo category seja vazio", ()=>{
        const userId = 50;
        const invalidPost = {
            date: "24/10/2025",
            category: "",
            text: "Os politicos são corruptos, por isso a população passa fome."
        }
        expect(()=>{
            postagem.createPost(userId,invalidPost)
        }).to.throw("Categoria não pode ser vazia.");
        
    });
    it("Deve lançar um erro caso usuário não exista", ()=>{
        const userId = 35;
        const invalidPost = {
            date: "24/10/2025",
            category: "Política",
            text: "Os politicos são corruptos, por isso a população passa fome."
        }
        expect(()=>{
            postagem.createPost(userId,invalidPost)
        }).to.throw("Usuário não encontrado");
        
    });
});

describe("removePost",()=>{
    it("Deve remover um post de um usuário específico",()=>{
        const user = {
            id: 35,
            name: 'Catatau',
            userName: 'catatau',
            password: '12345',
            email: 'catatau@gmail.com'
        };
        usuario.createUser(user);
        const userId = 35;

        const post1 = {date: "2025/01/10",category: "Tecnologia",text: "Novidades do JS"};
        const post2 = {date: "2025/01/11",category: "Esportes",text: "Resultado do jogo"};

        postagem.createPost(userId,post1);
        postagem.createPost(userId,post2);

        expect (postagem.searchPosts(userId)).to.have.lengthOf(2);

        postagem.removePost(userId,1);

        const postagensRestantes = postagem.searchPosts(userId);

        expect (postagem.searchPosts(userId)).to.have.lengthOf(1);

        expect(postagensRestantes[0]).to.deep.equal(post1);
    });
    it("Deve lançar erro ao excluir post caso usuário não exista",()=>{
        const userId = 10;
        expect(()=>{
            postagem.removePost(userId,1);
        }).to.throw("Post não encontrado.");
    });
    it("Deve lançar erro caso o index seja menor do que tamanho de posts",()=>{
        const user = {
            id: 35,
            name: 'Catatau',
            userName: 'catatau',
            password: '12345',
            email: 'catatau@gmail.com'
        };
        usuario.createUser(user);
        const userId = 35;

        const post1 = {date: "2025/01/10",category: "Tecnologia",text: "Novidades do JS"};
        const post2 = {date: "2025/01/11",category: "Esportes",text: "Resultado do jogo"};

        postagem.createPost(userId,post1);
        postagem.createPost(userId,post2);

        expect(()=>{
            postagem.removePost(userId,-1);
        }).to.throw("Post não encontrado.");
    })
    it("Deve lançar erro caso o index seja maio do que o tamanho de posts",()=>{
        const user = {
            id: 35,
            name: 'Catatau',
            userName: 'catatau',
            password: '12345',
            email: 'catatau@gmail.com'
        };
        usuario.createUser(user);
        const userId = 35;

        const post1 = {date: "2025/01/10",category: "Tecnologia",text: "Novidades do JS"};
        const post2 = {date: "2025/01/11",category: "Esportes",text: "Resultado do jogo"};

        postagem.createPost(userId,post1);
        postagem.createPost(userId,post2);

        expect(()=>{
            postagem.removePost(userId,2);
        }).to.throw("Post não encontrado.");
    })
});

describe("searchPost()",()=>{
    it("Deve retornar o conteudo do post",()=>{
        const user = {
            id: 35,
            name: 'Catatau',
            userName: 'catatau',
            password: '12345',
            email: 'catatau@gmail.com'
        };
        usuario.createUser(user);
        const userId = 35;

        const post1 = {date: "2025/01/10",category: "Tecnologia",text: "Novidades do JS"};
        const post2 = {date: "2025/01/11",category: "Esportes",text: "Resultado do jogo"};

        postagem.createPost(userId,post1);
        postagem.createPost(userId,post2);

        const postagensTotais = postagem.searchPosts(userId);

        expect (postagensTotais).to.have.lengthOf(2);

        const postArray = [post1, post2];

        expect(postagensTotais).to.deep.equal(postArray);
    });
    it("Deve retornar uma array de post vazia",()=>{
        const userId = 35;

        const postagensTotais = postagem.searchPosts(userId);

        expect (postagensTotais).to.have.lengthOf(0);
    });
});

describe("serachPostCategoria",()=>{
    it("Deve retornar todos os post com uma categoria especifica",()=>{
        const user = {
            id: 5,
            name: 'Catatau',
            userName: 'catatau',
            password: '12345',
            email: 'catatau@gmail.com'
        };
        usuario.createUser(user);
        const userId = 5;

        const post1 = {date: "2025/01/10",category: "Tecnologia",text: "Novidades do JS"};
        const post2 = {date: "2025/01/11",category: "Esportes",text: "Resultado do jogo"};

        postagem.createPost(userId,post1);
        postagem.createPost(userId,post2);

        const category = "Esportes"

        expect (postagem.searchPostCategory(userId,category)).to.have.lengthOf(1);

    });
    it("Deve retornar uma string vazia",()=>{
        const userId = 10;
        const category = "Esportes";
        expect (()=>{postagem.searchPostCategory(userId,category)}).to.have.lengthOf(0);
    });
})

describe("serachPostID",()=>{
    it("Deve retornar um post por ID",()=>{
        const user = {
            id: 7,
            name: 'Catatau',
            userName: 'catatau',
            password: '12345',
            email: 'catatau@gmail.com'
        };
        usuario.createUser(user);
        const userId = 7;

        const post1 = {id: 10, date: "2025/01/10",category: "Tecnologia",text: "Novidades do JS"};
        const post2 = {id: 14, date: "2025/01/11",category: "Esportes",text: "Resultado do jogo"};

        postagem.createPost(userId,post1);
        postagem.createPost(userId,post2);

        const postId = 10;

        expect (postagem.searchPostID(userId,postId)).to.have.lengthOf(1);

    });
    it("Deve retornar uma array vazia",()=>{
        const userId = 10;
        const postId = 3;
        expect (()=>{postagem.searchPostID(userId,postId)}).to.have.lengthOf(0);
    });
})