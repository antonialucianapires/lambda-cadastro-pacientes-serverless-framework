'use strict';
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
      body: JSON.stringify(dados.Items)
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
  try {
    const { pacienteId } = event.pathParameters;

    const data = await dynamoDB
      .get({
        ...params,
        Key: {
          paciente_id: pacienteId,
        },
      })
      .promise();

    if (!data.Item) {
      return {
        statusCode: 404,
        body: JSON.stringify({ error: "Paciente não existe" }, null, 2),
      };
    }

    const paciente = data.Item;

    return {
      statusCode: 200,
      body: JSON.stringify(paciente, null, 2),
    };
  } catch (err) {
    console.log("Error", err);
    return {
      statusCode: err.statusCode ? err.statusCode : 500,
      body: JSON.stringify({
        error: err.name ? err.name : "Exception",
        message: err.message ? err.message : "Unknown error",
      }),
    };
  }
};
