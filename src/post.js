const getUser = require('./user.js')

function addPost(userId, post){
    if(!post || post.trim().length === 0) throw new Error("O Post não pode ser vazio ou conter somente espaços.");    
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


module.export = {
    addPost,
    removePost,
    getPosts
}