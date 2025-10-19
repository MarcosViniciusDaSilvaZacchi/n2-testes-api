// src/comments.js
const axios = require("axios");
const BASE_URL = "https://jsonplaceholder.typicode.com/comments";

// Lista todos os comentários
async function listarComentarios() {
  const response = await axios.get(BASE_URL);
  return response.data;
}

// Busca um comentário por ID
async function buscarComentarioPorId(id) {
  if (!id) throw new Error("ID é obrigatório");
  const response = await axios.get(`${BASE_URL}/${id}`);
  return response.data;
}

// Filtra comentários por Post ID
async function filtrarComentariosPorPostId(postId) {
  if (!postId) throw new Error("postId é obrigatório");
  const response = await axios.get(`${BASE_URL}?postId=${postId}`);
  return response.data;
}

// Cria um comentário fake (não persiste de verdade)
function criarComentarioFake(dados) {
  if (!dados || !dados.body || !dados.email)
    throw new Error("Dados inválidos para criar comentário");
  return { id: Date.now(), ...dados };
}

// Remove um comentário (simulação)
function apagarComentario(id) {
  if (!id) throw new Error("ID inválido");
  return true;
}

module.exports = {
  listarComentarios,
  buscarComentarioPorId,
  filtrarComentariosPorPostId,
  criarComentarioFake,
  apagarComentario,
};
