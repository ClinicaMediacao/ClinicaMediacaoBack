const express = require('express');
const nodemailer = require('nodemailer');
const bodyParser = require('body-parser');

const app = express();
const PORT = 3013;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Verificação simples se a rota está configurada corretamente
app.get('/', (req, res) => {
    res.send('Servidor está funcionando!');
  });
  
  // Iniciando o servidor e exibindo a mensagem de confirmação
  app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
  });

// Configuração do Nodemailer para enviar e-mails
const transporter = nodemailer.createTransport({
  service: 'gmail',  // Usando o Gmail, pode ser qualquer outro serviço
  auth: {
    user: 'clinicamediacaogit@gmail.com',  // E-mail da clínica (que vai enviar)
    pass: 'wysl lbxa dark wwfo'  // Senha ou app password do e-mail da clínica
  }
});

// Rota para o envio do formulário de contato
app.post('/contato', (req, res) => {
  const { nome, sobrenome, telefone, email, mensagem } = req.body;

  console.log('Nome do paciente:', nome);

  // Definindo o conteúdo do e-mail que será enviado à clínica
  const mailOptions = {
    from: email,  // O e-mail de quem preencheu o formulário (paciente)
    to: "douglasrodrigues.larre@gmail.com",  // O e-mail da clínica que vai receber os dados
    subject: `O paciente ${nome}, entrou em contato pelo Formulário`, //
    text: `Você recebeu uma nova mensagem de contato de ${nome}:

    Nome: ${nome}
    Sobrenome: ${sobrenome}
    Telefone: ${telefone}
    E-mail: ${email}
    Mensagem: ${mensagem}`
  };

  // Enviando o e-mail para a clínica
  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      return res.status(500).send('Erro ao enviar a mensagem');
    }
    res.status(200).send('Mensagem enviada com sucesso!');
  });
});