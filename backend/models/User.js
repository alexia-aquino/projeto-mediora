const db = require('../server');

const User = {
    create: (nome, email, senha, tipo) => {
        const stmt = db.prepare('INSERT INTO users (nome, email, senha, tipo) VALUES (?, ?, ?, ?)');
        return stmt.run(nome, email, senha, tipo);
    },
    findByEmail: (email) => {
        const stmt = db.prepare('SELECT * FROM users WHERE email = ?');
        return stmt.get(email);
    }
};

module.exports = User;