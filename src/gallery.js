

const photos = [];
// photo = [id, title, url, authorId]

//Adiciona uma nova foto à galeria
function addPhoto(photo) {
  if (!photo || !photo.id || !photo.title || !photo.url || !photo.authorId) throw new Error("Dados da foto inválidos");

  if (!photo.url.startsWith('http')) throw new Error("URL da foto inválida");

  if (photos.find(p => p.id === photo.id)) throw new Error("ID da foto já está cadastrado");

  photos.push({ ...photo });
}

//Busca todas as fotos da galeria
function getAllPhotos() {
  return [...photos];
}

//Busca uma foto pelo seu ID
function getPhotoById(id) {
  return photos.find(p => p.id === id);
}

//Busca fotos pelo título
function getPhotosByTitle(title) {
  return photos.filter(p => p.title.toLowerCase().includes(title.toLowerCase()));
}

//Atualiza o título de uma foto
function updatePhotoTitle(id, newTitle) {
  const photo = photos.find(p => p.id === id);
  if (!photo) throw new Error("Foto não encontrada");

  if (typeof newTitle !== 'string' || newTitle.trim() === '') throw new Error("Título novo inválido");
  
  photo.title = newTitle;
}

//Deleta uma foto da galeria
function deletePhoto(id) {
  const index = photos.findIndex(p => p.id === id);
  if (index === -1) throw new Error("Foto não encontrada");
  photos.splice(index, 1);
}

//Limpa a galeria para os testes
function resetPhotos() {
  photos.length = 0;
}

//Função assíncrona para ser mockada com Sinon.
//Em um cenário real, buscaria fotos de uma API.
async function fetchPhotosFromApi() {
    // Esta função será substituída nos testes.
    // Em um app real, aqui teria uma chamada com axios ou fetch.
    return Promise.resolve([
        { id: 101, title: 'Foto da API 1', url: 'http://api.com/1.jpg', authorId: 1 },
        { id: 102, title: 'Foto da API 2', url: 'http://api.com/2.jpg', authorId: 2 }
    ]);
}

module.exports = {
  addPhoto,
  getAllPhotos,
  getPhotoById,
  getPhotosByTitle,
  updatePhotoTitle,
  deletePhoto,
  resetPhotos,
  fetchPhotosFromApi
};