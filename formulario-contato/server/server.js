const express = require('express');
const nodemailer = require('nodemailer');
const bodyParser = require('body-parser');
const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

const app = express();
const PORT = 3013;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const transporter = nodemailer.createTransport({
  service: 'gmail',  // Usando o Gmail, pode ser qualquer outro serviço
  auth: {
    user: 'clinicamediacaogit@gmail.com',  // E-mail da clínica (que vai enviar)
    pass: 'hpcw awcc yxtc ywoa'  // Senha ou app password do e-mail da clínica
  }
});


// Configuração do Swagger
const swaggerOptions = {
  swaggerDefinition: {
    openapi: '3.0.0',
    info: {
      title: 'API de Contato da Clínica',
      version: '1.0.0',
      description: 'API para enviar mensagens de contato e confirmar envio para pacientes e clínica',
      contact: {
        name: 'Suporte Técnico',
        email: 'suporte@clinicamediacao.com'
      }
    },
    servers: [
      {
        url: 'http://localhost:3013',
        description: 'Servidor local'
      }
    ]
  },
  apis: ['server.js']  // Onde está a documentação da API (no caso, no próprio arquivo server.js)
};

// Inicializando o Swagger
const swaggerDocs = swaggerJsdoc(swaggerOptions);

// Usando o Swagger UI no endpoint /docs
app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));

// Rota simples de verificação
app.get('/', (req, res) => {
  res.send('Servidor está funcionando!');
});

// Rota para o envio do formulário de contato
/**
 * @swagger
 * /contato:
 *   post:
 *     summary: Envia a mensagem de contato do paciente para a clínica e uma confirmação para o paciente.
 *     description: Recebe os dados do formulário de contato e envia um e-mail para a clínica e um e-mail de confirmação para o paciente.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               nome:
 *                 type: string
 *                 description: Nome do paciente
 *               sobrenome:
 *                 type: string
 *                 description: Sobrenome do paciente
 *               telefone:
 *                 type: string
 *                 description: Telefone do paciente
 *               email:
 *                 type: string
 *                 description: E-mail do paciente
 *               mensagem:
 *                 type: string
 *                 description: Mensagem do paciente
 *     responses:
 *       200:
 *         description: Mensagem enviada com sucesso.
 *       500:
 *         description: Erro ao enviar a mensagem.
 */
app.post('/contato', (req, res) => {
  const { nome, sobrenome, telefone, email, mensagem } = req.body;
  console.log('Dados recebidos:', req.body);

  // Definindo o conteúdo do e-mail que será enviado à clínica
  const mailOptionsClinica = {
    from: email,
    to: 'clinicamediacaogit@gmail.com',
    subject: `O paciente ${nome}, entrou em contato pelo Formulário`,
    text: `Você recebeu uma nova mensagem de contato de ${nome}:

    Nome: ${nome}
    Sobrenome: ${sobrenome}
    Telefone: ${telefone}
    E-mail: ${email}
    Mensagem: ${mensagem}`
  };

  // Enviando o e-mail para a clínica
  transporter.sendMail(mailOptionsClinica, (error, info) => {
    if (error) {
      console.error('Erro ao enviar o e-mail para a clínica:', error);
      return res.status(500).send('Erro ao enviar a mensagem');
    }

    // Enviando confirmação para o paciente
    const mailOptionsPaciente = {
      from: 'clinicamediacaogit@gmail.com',
      to: email,
      subject: 'Confirmação de envio de mensagem',
      text: `Olá ${nome},\n\n
      Agradecemos pelo seu contato!\n\n
      Recebemos sua mensagem e nossa equipe da Clínica Mediação está analisando. Em breve, um de nossos profissionais entrará em contato para fornecer mais informações ou agendar a sua consulta.\n\n
      Estamos à disposição para ajudar no que for necessário.\n\n
      Atenciosamente,\n
      Equipe Clínica Mediação`
    };

    // Enviando o e-mail de confirmação para o paciente
    transporter.sendMail(mailOptionsPaciente, (error, info) => {
      if (error) {
        console.error('Erro ao enviar a confirmação para o paciente:', error);
        return res.status(500).send('Erro ao enviar a confirmação para o paciente');
      } 
      console.log("E-mail de confirmação enviado com sucesso para:", email);  // Log de sucesso
      res.status(200).send('Mensagem enviada com sucesso!');
    });
  });
});

// Iniciando o servidor
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});