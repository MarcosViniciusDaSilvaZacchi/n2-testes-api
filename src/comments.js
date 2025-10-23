

const { getUserById } = require('./user');
const { getPhotoById } = require('./gallery');

const comentarios = [];
let proximoIdComentario = 1;


function criarComentario(photoId, dadosComentario) {
  if (!photoId || !dadosComentario || !dadosComentario.conteudo || !dadosComentario.idAutor) {
    throw new Error("Preencha todos os dados do comentário corretamente!");
  }

  const usuario = getUserById(dadosComentario.idAutor);
  if (!usuario) throw new Error("Usuário (autor) não encontrado.");

  const foto = getPhotoById(photoId);
  if (!foto) throw new Error("Foto não encontrada.");

  const novoComentario = {
    id: proximoIdComentario++,
    idFoto: photoId,
    conteudo: dadosComentario.conteudo,
    idAutor: dadosComentario.idAutor,
    dataCriacao: new Date()
  };

  foto.comments.push(novoComentario);
  comentarios.push(novoComentario);

  return "Comentário criado com sucesso!";
}

/**
 * Retorna todos os comentários de uma foto.
 */
function listarComentariosPorFoto(photoId) {
  const foto = getPhotoById(photoId);
  if (!foto) throw new Error("Foto não encontrada.");
  return foto.comments;
}

/**
 * Deleta um comentário específico de uma foto.
 */
function deletarComentario(photoId, comentarioId) {
  const foto = getPhotoById(photoId);
  if (!foto) throw new Error("Foto não encontrada.");

  const index = foto.comments.findIndex(c => c.id === comentarioId);
  if (index === -1) throw new Error("Comentário não encontrado.");

  foto.comments.splice(index, 1);
  return "Comentário excluído com sucesso!";
}

function resetarComentarios() {
  comentarios.length = 0;
  proximoIdComentario = 1;
}

module.exports = {
  criarComentario,
  listarComentariosPorFoto,
  deletarComentario,
  resetarComentarios
};
