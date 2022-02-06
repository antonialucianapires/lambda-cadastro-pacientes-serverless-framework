'use strict';
const { v4: uuidv4 } = require('uuid');
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

module.exports.cadastrarPaciente = async (event) => {

  try {
    const body = JSON.parse(event.body);
    const { nome, email, data_nascimento, telefone } = body;

    const timestamp = new Date(new Date().getTime());

    const paciente = {
      paciente_id: uuidv4(),
      nome: nome,
      data_nascimento: data_nascimento,
      email: email,
      telefone: telefone,
      status: true,
      criado_em: timestamp.toLocaleDateString() + ' ' + timestamp.toLocaleTimeString(),
      atualizado_em: timestamp.toLocaleDateString() + ' ' + timestamp.toLocaleTimeString()
    }

    await dynamoDB
      .put({
        TableName: "PACIENTES",
        Item: paciente,
      })
      .promise();


    return {
      statusCode: 201,
      body: JSON.stringify({ message: "Paciente cadastrado com sucesso" }, paciente, 2)
    }
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
}

module.exports.atualizarPaciente = async (event) => {
  try {
    const timestamp = new Date(new Date().getTime());
    const { pacienteId } = event.pathParameters;
    const body = JSON.parse(event.body);
    const { nome, email, data_nascimento, telefone } = body;

    await dynamoDB.update({
      ...params,
      Key: {
        paciente_id: pacienteId
      },
      UpdateExpression:
        'SET nome = :nome, data_nascimento = :dt, email = :email, telefone = :telefone, atualizado_em = :atualizado_em',
      ConditionExpression: 'attribute_exists(paciente_id)',
      ExpressionAttributeValues: {
        ':nome': nome,
        ':dt': data_nascimento,
        ':email': email,
        ':telefone': telefone,
        ':atualizado_em': timestamp.toLocaleDateString() + ' ' + timestamp.toLocaleTimeString()
      }
    }).promise();

    return {
      statusCode: 204,
    }

  } catch (err) {
    console.log("Error", err);

    let error = err.name ? err.name : "Exception";
    let message = err.message ? err.message : "Unknown error";
    let statusCode = err.statusCode ? err.statusCode : 500;

    if (error === 'ConditionalCheckFailedException') {
      error = 'Paciente não existe';
      message = `Recurso solicitado não existe e não pode ser atualizado`;
      statusCode = 404;
    }

    return {
      statusCode,
      body: JSON.stringify({
        error,
        message
      }),
    };
  }

}


module.exports.deletarPaciente = async (event) => {
  const { pacienteId } = event.pathParameters;

  try {

    await dynamoDB.delete({
      ... params,
      Key: {
        paciente_id: pacienteId
      },
      ConditionExpression: 'attribute_exists(paciente_id)'
    }).promise();

    return {
      statusCode: 204
    }

  } catch (err) {
    console.log("Error", err);

    let error = err.name ? err.name : "Exception";
    let message = err.message ? err.message : "Unknown error";
    let statusCode = err.statusCode ? err.statusCode : 500;

    if (error === 'ConditionalCheckFailedException') {
      error = 'Paciente não existe';
      message = `Recurso solicitado não existe e não pode ser atualizado`;
      statusCode = 404;
    }

    return {
      statusCode,
      body: JSON.stringify({
        error,
        message
      }),
    };
  }
}