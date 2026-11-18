const express = require('express');
const cors = require('cors');
const Evento = require('./Evento');
const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const { text } = require('stream/consumers');


const app = express();

// Permite que o Vue (que vai rodar na porta 5173) consiga conversar com esta API
app.use(cors());
// Permite que a API entenda informações enviadas no formato JSON
app.use(express.json());

const CHAVE_SECRETA_JWT = "ekaHW4sH3r3";

const gerarHash = (textoPuro) => {
  return crypto.createHash('sha256').update(textoPuro).digest('hex');
}

// 1. array de eventos pre cadastrados na memoria
let eventosDb = [
  new Evento(1, "Reunião de Planejamento", "2026-10-28", "reuniao", "Definição de metas para o próximo trimestre", ["Ana", "Carlos"]),
  new Evento(2, "Conferência Anual", "2026-11-15", "conferencia", "Apresentação de resultados e novidades do setor", ["Equipe Completa"])
];
let proximoId = 3;

// 1.5 Pré-cadastro de Usuários
let usuariosDb = [
  { id: 1, nome: "admin",
     senha: "a665a45920422f9d417e4867efdc4fb8a04a1f3fff1fa07e998e86f7f7a27ae3", 
     papel: "admin" },
  { id: 2, nome: "equipe", 
    senha: "a665a45920422f9d417e4867efdc4fb8a04a1f3fff1fa07e998e86f7f7a27ae3", 
    papel: "espectador" }
];
let proximoUsuarioId = 3;

// 2. Rota de Login (Devolve o Token)
app.post('/login', (req, res) => {
  const { nome, senha } = req.body;
  
  const senhaHash = gerarHash(senha);

  const usuarioEncontrado = usuariosDb.find(u => u.nome === nome && u.senha === senhaHash);

  if (!usuarioEncontrado) {
    console.log(`[LOGIN] Tentativa falhada para o utilizador: ${nome}`);
    return res.status(401).json({ erro: "Nome de utilizador ou senha incorretos." });
  }

  const dataHora = new Date().toLocaleString('pt-BR');
  console.log(`[${dataHora}] Login efetuado: ${usuarioEncontrado.nome} acessou como ${usuarioEncontrado.papel.toUpperCase()}`);
  
const token = jwt.sign(
    { id: usuarioEncontrado.id, nome: usuarioEncontrado.nome, papel: usuarioEncontrado.papel },
    CHAVE_SECRETA_JWT,
    { expiresIn: '4h' } 
  );
  
  res.json({ token, papel: usuarioEncontrado.papel, nome: usuarioEncontrado.nome });
});

// 3. verificadorrrrrr
const verificarToken = (req, res, next) => {
  // Pega o token 
  const token = req.headers['authorization'];
  
  // sem token sobra nada pro beta
  if (!token) {
    return res.status(401).json({ erro: "Acesso negado. Token não fornecido (Status 401)." });
  }
  jwt.verify(token, CHAVE_SECRETA_JWT, (err, dadosDecodificados) => {
    if (err) {
      console.log(`[SEGURANÇA] 🚨 Tentativa de acesso com token inválido ou expirado.`);
      return res.status(401).json({ erro: "Token inválido ou expirado." });
    }
    
    req.usuarioLogado = dadosDecodificados;
    next(); 
  });
};

// 4. Rotas do CRUD (Protegidas pelo 'verificarToken')

// LER (Listar todos os eventos)
app.get('/eventos', verificarToken, (req, res) => {
  console.log("Eventos requisitados")
  res.json(eventosDb);
});

// CRIAR (Adicionar novo evento)
app.post('/eventos', verificarToken, (req, res) => {
  const { titulo, data, tipo, descricao, pessoas } = req.body;
  console.log(`tentantiva de criar evento "${titulo}"`)
  
  try {
    const novoEvento = new Evento(proximoId++, titulo, data, tipo, descricao, pessoas);
    eventosDb.push(novoEvento);
    res.status(201).json(novoEvento); // 201 = Criado com sucesso
    console.log("Evento criado")
  } catch (erro) {
    // Caso caia na validação do Setter da classe (ex: título vazio)
    res.status(400).json({ erro: erro.message });
    console.log("Erro na criacao do evento registrado")
  }
});

// ATUALIZAR (Editar evento existente)
app.put('/eventos/:id', verificarToken, (req, res) => {
  const id = parseInt(req.params.id);
  const index = eventosDb.findIndex(e => e.id === id);
  
  if (index === -1) return res.status(404).json({ erro: "Evento não encontrado." });

  const { titulo, data, tipo, descricao, pessoas } = req.body;
  
  try {
    // Utilizamos os setters da nossa classe para atualizar
    if (titulo !== undefined) eventosDb[index].titulo = titulo;
    if (data !== undefined) eventosDb[index].data = data;
    if (tipo !== undefined) eventosDb[index].tipo = tipo;
    if (descricao !== undefined) eventosDb[index].descricao = descricao;
    if (pessoas !== undefined) eventosDb[index].pessoas = pessoas;
    
    res.json(eventosDb[index]);
  } catch (erro) {
    res.status(400).json({ erro: erro.message });
  }
});

// EXCLUIR (Deletar evento)
app.delete('/eventos/:id', verificarToken, (req, res) => {
  const id = parseInt(req.params.id);
  const tamanhoInicial = eventosDb.length;
  
  eventosDb = eventosDb.filter(e => e.id !== id);
  
  if (eventosDb.length === tamanhoInicial) {
    return res.status(404).json({ erro: "Evento não encontrado." });
  }
  
  res.status(204).send(); // 204 = Sem Conteúdo (Deletado com sucesso)
  console.log("Evento Deletado com sucesso")
});

//admin USUARIOS

app.get('/usuarios', verificarToken, (req, res) => {
  res.json(usuariosDb);
});

app.post('/usuarios', verificarToken, (req, res) => {
  const { nome, senha, papel } = req.body;
  
  if (usuariosDb.some(u => u.nome === nome)) {
    return res.status(400).json({ erro: "Este nome de utilizador já existe." });
  }

  const novoUsuario = { id: proximoUsuarioId++, nome, senha: gerarHash(senha), papel };
  usuariosDb.push(novoUsuario);
  
  console.log(`[ADMIN] Novo utilizador criado: ${nome} (${papel})`);
  res.status(201).json(novoUsuario);
});


// 5. Ligar o Servidor na porta 3000
const PORTA = 3000;
app.listen(PORTA, () => {
  console.log(` Servidor Backend rodando em http://localhost:${PORTA}`);
  console.log(` Rotas protegidas (CRUD) aguardando Token.`);
});