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
    pass: 'hpcw awcc yxtc ywoa'  // Senha ou app password do e-mail da clínica
  }
});

// Rota para o envio do formulário de contato
app.post('/contato', (req, res) => {
  const { nome, sobrenome, telefone, email, mensagem } = req.body;

  console.log('Dados recebidos:', req.body);  // Log dos dados recebidos

  // Definindo o conteúdo do e-mail que será enviado à clínica
  const mailOptionsClinica = {
    from: email,  // O e-mail de quem preencheu o formulário (paciente)
    to: 'clinicamediacaogit@gmail.com',  // O e-mail da clínica que vai receber os dados
    subject: `O paciente ${nome}, entrou em contato pelo Formulário`,  // Com interpolação
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
      console.error('Erro ao enviar o e-mail para a clínica:', error);  // Log detalhado do erro
      return res.status(500).send(`Erro ao enviar a mensagem: ${error.message}`);  // Envia mensagem detalhada ao cliente
    }

    // Enviando confirmação para o paciente
    const mailOptionsPaciente = {
      from: 'clinicamediacaogit@gmail.com',  // E-mail da clínica para enviar confirmação
      to: email,  // E-mail do paciente
      subject: 'Confirmação de envio de mensagem',
      text: `Olá ${nome},\n\n
      Agradecemos pelo seu contato!\n\n
      Recebemos sua mensagem e nossa equipe da Clínica Mediação está analisando. Em breve, um de nossos profissionais entrará em contato para fornecer mais informações ou agendar a sua consulta.\n\n
      Estamos à disposição para ajudar no que for necessário.\n\n
      Atenciosamente,\n
      Equipe Clínica Mediação`,
      replyTo: 'clinicamediacaogit@gmail.com',
      headers: {
        'List-Unsubscribe': '<http://www.suaurl.com/desinscrever>'
      }
    };

    // Enviando o e-mail de confirmação para o paciente
    transporter.sendMail(mailOptionsPaciente, (error, info) => {
      if (error) {
        console.error('Erro ao enviar a confirmação para o paciente:', error);  // Log do erro detalhado
        return res.status(500).send(`Erro ao enviar a confirmação para o paciente: ${error.message}`);
      }
      console.log("E-mail de confirmação enviado com sucesso para:", email);  // Log de sucesso
      res.status(200).send('Mensagem enviada com sucesso!');
    });
  });
});