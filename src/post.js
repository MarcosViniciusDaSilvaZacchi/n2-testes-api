const getUser = require('./user.js')

function addPost(userId, post){
    if(!post || !post.texto || !post.texto.trim().length === 0) throw new Error("O Post deve ter um conteúdo de texto válido.");    
    const user = getUser.getUserById(userId);
    if(!user) throw new Error("Usuário não encontrado");
    user.posts.push(post);
}

function removePost(userId, index){
    const user = getUser.getUserById(userId);
    if(!user || index < 0 || index >= user.posts.length) throw new Error("Post não encontrado.");
    user.posts.splice(index, 1);
}

function getPosts(userId){
    const user = getUser.getUserById(userId);
    if(!user) return[];
    return[...user.posts];
}

function getPostCategory(userId, category){
    const user = getUser.getUserById(userId);
    if(!user) return[];
    return user.posts.filter(post => post.category === category);
}

function getPostDate(startDate, endDate){
    return posts.filter(p =>{
        p.createAt >= startDate &&
        p.createAt <= endDate
    });
}

function getAllPostCategory(category){
    return posts.filter(post => post.category === category);
}



module.exports = {
    addPost,
    removePost,
    getPosts,
    getPostCategory,
    getPostDate,
    getAllPostCategory
}