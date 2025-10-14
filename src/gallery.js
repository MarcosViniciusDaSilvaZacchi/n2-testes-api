const photos = [];
let nextPhotoId = 1; // Para gerar IDs automaticamente

//Cria e adiciona uma nova foto à galeria
function uploadPhoto(photoData) {
  if (!photoData || !photoData.imageUrl || !photoData.description || !photoData.authorId) {
    throw new Error("Dados da foto inválidos");
  }

  const newPhoto = {
    id: nextPhotoId++,
    imageUrl: photoData.imageUrl,
    description: photoData.description,
    authorId: photoData.authorId,
    likes: [],
    createdAt: new Date(),
    comments: []
  };

  photos.push(newPhoto);
  return newPhoto;
}

//Busca uma foto pelo seu ID (código)
function getPhotoById(id) {
  return photos.find(p => p.id === id);
}

//Busca todas as fotos de um usuário específico
function getPhotosByUser(userId) {
  return photos.filter(p => p.authorId === userId);
}

//Busca fotos de um usuário dentro de um intervalo de datas
function getPhotosByRangeDate(userId, startDate, endDate) {
  return photos.filter(p => 
    p.authorId === userId && 
    p.createdAt >= startDate && 
    p.createdAt <= endDate
  );
}

//Deleta uma foto pelo seu ID
function deletePhoto(photoId) {
  const index = photos.findIndex(p => p.id === photoId);
  if (index === -1) throw new Error("Foto não encontrada");
  photos.splice(index, 1);
}

//Adiciona um like de um usuário a uma foto
function likePhoto(photoId, userId) {
  const photo = getPhotoById(photoId);
  if (!photo) throw new Error("Foto não encontrada");
  
  // Evita likes duplicados
  if (!photo.likes.includes(userId)) {
    photo.likes.push(userId);
  }
  return photo;
}

//Remove um like de um usuário de uma foto
function unlikePhoto(photoId, userId) {
  const photo = getPhotoById(photoId);
  if (!photo) throw new Error("Foto não encontrada");

  photo.likes = photo.likes.filter(likerId => likerId !== userId);
  return photo;
}

//Limpa a galeria para os testes
function resetPhotos() {
  photos.length = 0;
  nextPhotoId = 1; // Reseta o contador de ID
}

//Função assíncrona para ser mockada com Sinon.
//Em um cenário real, buscaria fotos de uma API.
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
  fetchPhotosFromApi // <--- Adicione aqui
};