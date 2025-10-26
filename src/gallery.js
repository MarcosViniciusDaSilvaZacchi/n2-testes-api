const usuario = require('../src/user')


/**
 * Cria e adiciona uma nova foto à galeria.
 * @param {object} photoData - Objeto com { imageUrl, description, authorId }
 */
function uploadPhoto(usertId, image) {
  
  const user = usuario.getUserById(usertId)
  if(!user) throw new("Usuario não encontrado");

  
  if(image.type !== 'image/png') throw new Error('Tipo de imagem não suportado')

  if(!image.description || !image.description.trim().length === 0){
    throw new Error('Descrição da imagem não pode ser em branco');
  }

  if(!(image.createDat instanceof Date)) image.createDat = new Date (image.createDat)
  if(isNaN(image.createDat)) throw new Error('Data Inválida')
  
  if(!user.images){
    user.images = [];
  }
  
  if(user.images.find(image => image.id == image.id)) throw new Error('Já existe uma imagem com esse id');

  user.images.push({...image});
  return image;
}

/**
 * Busca uma foto pelo seu ID (código).
 * @param {number} id
 */
function getPhotoById(id) {
  return photos.find(p => p.id === id);
}

/**
 * Busca todas as fotos de um usuário específico.
 * @param {number} userId
 */
function getPhotosByUser(userId) {
  return photos.filter(p => p.authorId === userId);
}

/**
 * Busca fotos de um usuário dentro de um intervalo de datas.
 * @param {number} userId
 * @param {Date} startDate - Data inicial
 * @param {Date} endDate - Data final
 */
function getPhotosByRangeDate(userId, startDate, endDate) {
  return photos.filter(p =>
    p.authorId === userId &&
    p.createdAt >= startDate &&
    p.createdAt <= endDate
  );
}

/**
 * Deleta uma foto pelo seu ID.
 * @param {number} photoId
 */
function deletePhoto(photoId) {
  const index = photos.findIndex(p => p.id === photoId);
  if (index === -1) throw new Error("Foto não encontrada");
  photos.splice(index, 1);
}

/**
 * Adiciona um like de um usuário a uma foto.
 * @param {number} photoId
 * @param {number} userId
 */
function likePhoto(photoId, userId) {
  const photo = getPhotoById(photoId);
  if (!photo) throw new Error("Foto não encontrada");

  // Evita likes duplicados
  if (!photo.likes.includes(userId)) {
    photo.likes.push(userId);
  }
  return photo;
}

/**
 * Remove um like de um usuário de uma foto.
 * @param {number} photoId
 * @param {number} userId
 */
function unlikePhoto(photoId, userId) {
  const photo = getPhotoById(photoId); // Linha ~82
  if (!photo) throw new Error("Foto não encontrada"); // Linha ~83

  photo.likes = photo.likes.filter(likerId => likerId !== userId);
  return photo;
}

/**
 * Limpa a galeria para os testes.
 */
function resetPhotos() {
  photos.length = 0;
  nextPhotoId = 1; // Reseta o contador de ID
}

/**
 * Função assíncrona para ser mockada com Sinon.
 * Em um cenário real, buscaria fotos de uma API.
 */
/* istanbul ignore next */ //ignorar na cobertura
async function fetchPhotosFromApi() {
    // Esta função será substituída nos testes.
    // O retorno aqui não importa, pois o Sinon irá interceptá-lo.
    return Promise.resolve([]);
}

module.exports = {
  uploadPhoto,
  getPhotoById,
  getPhotosByUser,
  getPhotosByRangeDate,
  deletePhoto,
  likePhoto,
  unlikePhoto,
  resetPhotos,
  fetchPhotosFromApi
};