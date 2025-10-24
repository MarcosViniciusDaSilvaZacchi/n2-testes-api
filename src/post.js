const getUser = require('./user.js')

function createPost(userId, post){
    if(!post.text || post.text.trim().length === 0) throw new Error("O Post deve ter um conteúdo de texto válido.");
    if(!post.date || post.date.trim().length === 0) throw new Error("Data não pode ser vazia");
    if(!post.category || post.category.trim().length === 0) throw new Error("Categoria não pode ser vazia.");    
    const user = getUser.getUserById(userId);
    if(!user) throw new Error("Usuário não encontrado");
    user.posts.push(post);
}

function removePost(userId, index){
    const user = getUser.getUserById(userId);
    if(!user || index < 0 || index >= user.posts.length) throw new Error("Post não encontrado.");
    user.posts.splice(index, 1);
}

function searchPosts(userId){
    const user = getUser.getUserById(userId);
    if(!user) return[];
    return[...user.posts];
}

function searchPostCategory(userId, category){
    const user = getUser.getUserById(userId);
    if(!user) return[];
    return user.posts.filter(post => post.category === category);
}

function searchPostDate(startDate, endDate){
    return posts.filter(post =>{
        post.createAt >= startDate &&
        post.createAt <= endDate
    });
}

function searchAllPostCategory(category){
    return posts.filter(post => post.category === category);
}

module.exports = {
    createPost,
    removePost,
    searchPosts,
    searchPostCategory,
    searchPostDate,
    searchAllPostCategory
}