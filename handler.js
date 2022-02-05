'use strict';

const pacientes = [
  { id: 1, nome: 'Maria', dataNascimento: '1984-11-01' },
  { id: 2, nome: 'Joao', dataNascimento: '1980-01-16' },
  { id: 3, nome: 'Jose', dataNascimento: '1998-06-06' }
]

module.exports.listarPacientes = async (event) => {
  return {
    statusCode: 200,
    body: JSON.stringify(
      {
        pacientes
      },
      null,
      2
    ),
  };
};


module.exports.obterPaciente = async (event) => {
  
  const { pacienteId } = event;

  const paciente = pacientes.find(p => p.id == pacienteId);

  if (!paciente) {
    return {
      statusCode: 404,
      body: JSON.stringify({ error: 'Paciente não existe' }, null, 2)
    }
  }

  return {
    statusCode: 200,
    body: JSON.stringify(
      {
        paciente
      },
      null,
      2
    )
  }
}
