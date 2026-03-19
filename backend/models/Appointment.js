const db = require('../server');

const Appointment = {
    create: (paciente, data, horario, endereco, cep, observacaoClima) => {
        const stmt = db.prepare('INSERT INTO appointments (paciente, data, horario, endereco, cep, observacaoClima) VALUES (?, ?, ?, ?, ?, ?)');
        return stmt.run(paciente, data, horario, endereco, cep, observacaoClima);
    },
    findAll: () => {
        const stmt = db.prepare('SELECT * FROM appointments ORDER BY data DESC');
        return stmt.all();
    }
};

module.exports = Appointment;