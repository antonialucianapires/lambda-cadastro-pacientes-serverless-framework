'use strict';

const pacientes = [
  { "id": 1, "nome": "Leanne Graham", "dataNascimento": "1997-10-01" },
  { "id": 2, "nome": "Ervin Howell", "dataNascimento": "1972-11-30" },
  { "id": 3, "nome": "Clementine Bauc", "dataNascimento": "2000-08-18" },
  { "id": 4, "nome": "Patricia Lebsack", "dataNascimento": "1995-12-24" }
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
  console.log(event)
  const { pacienteId } = event.pathParameters;

  console.log(pacienteId)

  const paciente = pacientes.find((paciente) => paciente.id === pacienteId);

  if(!paciente) {
    return {
      statusCode: 404,
      body: JSON.stringify({"error": "paciente não encontrado"}, null, 2),
    };
  }

  return {
    statusCode: 200,
    body: JSON.stringify(paciente, null, 2),
  };
};
