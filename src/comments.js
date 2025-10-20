// src/comments.js

const comentarios = [];
let nextComentarioId = 1; // Para gerar IDs automaticamente

// Cria um comentário fake e adiciona ao array (não persiste de verdade)
function criarComentarioFake(dados) {
  if (!dados || !dados.body || !dados.email) {
    throw new Error("Dados inválidos para criar comentário");
  }

  const novoComentario = {
    id: nextComentarioId++,
    body: dados.body,
    email: dados.email,
    postId: dados.postId || 0,
    createdAt: new Date()
  };

  comentarios.push(novoComentario);
  return novoComentario;
}

// Remove um comentário pelo ID (simulação)
function apagarComentario(id) {
  if (!id) throw new Error("ID inválido");

  const index = comentarios.findIndex(c => c.id === id);
  if (index === -1) throw new Error("Comentário não encontrado");

  comentarios.splice(index, 1);
  return true;
}

// Lista todos os comentários (assíncrono, simula requisição)
async function listarComentarios() {
  return Promise.resolve([...comentarios]);
}

// Busca um comentário por ID (assíncrono, simula requisição)
async function buscarComentarioPorId(id) {
  if (!id) throw new Error("ID é obrigatório");

  const comentario = comentarios.find(c => c.id === id);
  if (!comentario) throw new Error("Comentário não encontrado");

  return Promise.resolve(comentario);
}

// Filtra comentários por postId (assíncrono, simula requisição)
async function filtrarComentariosPorPostId(postId) {
  if (!postId) throw new Error("postId é obrigatório");

  const filtrados = comentarios.filter(c => c.postId === postId);
  return Promise.resolve(filtrados);
}

// Limpa comentários e reseta IDs (útil para testes)
function resetComentarios() {
  comentarios.length = 0;
  nextComentarioId = 1;
}

// Função assíncrona para ser mockada com Sinon (simula API externa)
async function fetchComentariosFromApi() {
  return Promise.resolve([]);
}

module.exports = {
  criarComentarioFake,
  apagarComentario,
  listarComentarios,
  buscarComentarioPorId,
  filtrarComentariosPorPostId,
  resetComentarios,
  fetchComentariosFromApi
};
