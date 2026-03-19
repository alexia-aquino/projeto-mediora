require('dotenv').config();
const express = require('express');
const Database = require('better-sqlite3');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const app = express();

// Configurações
app.use(cors());
app.use(express.json());

// Criar banco de dados local
const db = new Database('clinica.db');

// Criar tabelas
db.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    nome TEXT,
    email TEXT UNIQUE,
    senha TEXT,
    tipo TEXT,
    id_funcionario TEXT
  )
`);

db.exec(`
  CREATE TABLE IF NOT EXISTS appointments (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    paciente TEXT,
    data TEXT,
    horario TEXT,
    endereco TEXT,
    cep TEXT,
    observacaoClima TEXT,
    user_id INTEGER
  )
`);

// Rota de Cadastro
app.post('/api/auth/register', (req, res) => {
  try {
    const { nome, email, senha, tipo, id_funcionario } = req.body;
    const hashedPassword = bcrypt.hashSync(senha, 10);
    db.prepare('INSERT INTO users (nome, email, senha, tipo, id_funcionario) VALUES (?, ?, ?, ?, ?)').run(nome, email, hashedPassword, tipo, id_funcionario || null);
    res.status(201).json({ msg: 'Usuário cadastrado com sucesso' });
  } catch (error) {
    res.status(500).json({ msg: 'Erro no servidor' });
  }
});

// Rota de Login
app.post('/api/auth/login', (req, res) => {
  try {
    const { email, senha } = req.body;

    // validação básica
    if (!email || !senha) {
      return res.status(400).json({
        msg: 'Preencha email e senha'
      });
    }

    const user = db
      .prepare('SELECT * FROM users WHERE email = ?')
      .get(email);

    // usuário não encontrado
    if (!user) {
      return res.status(401).json({
        msg: 'Email ou senha inválidos'
      });
    }

    // senha incorreta
    const senhaValida = bcrypt.compareSync(senha, user.senha);

    if (!senhaValida) {
      return res.status(401).json({
        msg: 'Email ou senha inválidos'
      });
    }

    // login sucesso
    const token = jwt.sign(
      { id: user.id, tipo: user.tipo },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    res.json({
      token,
      user: {
        id: user.id,
        nome: user.nome,
        tipo: user.tipo,
        id_funcionario: user.id_funcionario
      }
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({
      msg: 'Erro interno do servidor'
    });
  }
});

// Rota de Agendamento
app.post('/api/appointments', (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      return res.status(401).json({ msg: 'Não autorizado' });
    }
    
    const token = authHeader.split(' ')[1];
    const payload = JSON.parse(Buffer.from(token.split('.')[1], 'base64').toString());
    const userId = payload.id;
    
    const { paciente, data, horario, cep, observacaoClima } = req.body;
    
    db.prepare('INSERT INTO appointments (paciente, data, horario, endereco, cep, observacaoClima, user_id) VALUES (?, ?, ?, ?, ?, ?, ?)').run(
      paciente, data, horario, 'Endereço via CEP', cep, observacaoClima, userId
    );
    
    res.status(201).json({ msg: 'Agendamento realizado' });
  } catch (error) {
    console.error('Erro ao agendar:', error);
    res.status(500).json({ msg: 'Erro ao agendar' });
  }
});

// Rota de Listar Agendamentos
app.get('/api/appointments', (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      return res.status(401).json({ msg: 'Não autorizado' });
    }
    
    const token = authHeader.split(' ')[1];
    const payload = JSON.parse(Buffer.from(token.split('.')[1], 'base64').toString());
    const userId = payload.id;
    const userType = payload.tipo;
    
    let agendamentos;
    
    if (userType === 'secretario') {
      agendamentos = db.prepare('SELECT * FROM appointments ORDER BY data DESC').all();
    } else {
      agendamentos = db.prepare('SELECT * FROM appointments WHERE user_id = ? ORDER BY data DESC').all(userId);
    }
    
    res.json(agendamentos);
  } catch (error) {
    res.status(500).json({ msg: 'Erro ao listar' });
  }
});

// Iniciar servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
  console.log('Banco SQLite criado com sucesso!');
});