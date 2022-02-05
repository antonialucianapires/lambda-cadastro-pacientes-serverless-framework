'use strict';

const pacientes = [
  { id: 1, nome: 'Maria', dataNascimento: '1984-11-01' },
  { id: 2, nome: 'Joao', dataNascimento: '1980-01-16' },
  { id: 3, nome: 'Jose', dataNascimento: '1998-06-06' }
]

const AWS = require('aws-sdk');
const dynamoDB = new AWS.DynamoDB.DocumentClient();
const params = {
  TableName: 'PACIENTES',
};

module.exports.listarPacientes = async (event) => {
  try {

    let dados = await dynamoDB.scan(params).promise();

    if (!dados || dados.Items.length === 0) {
      return {
        statusCode: 204,
        body: JSON.stringify({})
      }
    }

    return {
      statusCode: 200,
      body: JSON.stringify(dados)
    }

  } catch (error) {

    console.log("Error", error);
    return {
      statusCode: error.statusCode ? error.statusCode : 500,
      body: JSON.stringify({
        error: error.name ? error.name : "Exception",
        message: error.message ? error.message : "Unkown error"
      })
    }

  }
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
