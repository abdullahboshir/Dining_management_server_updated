import nodemailer from 'nodemailer'
import config from '../config'

export const sendEmail = async (to: string, html: string) => {
  const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 587,
    secure: config.NODE_ENV === 'production',
    auth: {
      user: 'allused20177@gmail.com',
      pass: 'djjw mcxy viib tmuz',
    },
  })

  const info = await transporter.sendMail({
    from: 'allused20177@gmail.com', // sender address
    to, // list of receivers 
    subject: 'Hello ✔, Mawlana Mubarak Hossen!', // Subject line
    text: 'Reset your password within 10 minutes!', // plain text body
    html: `<h1>Reset your password within 10 minutes!!</h1> ${html}`,
  })

  console.log('Message sent successfully:', info)
  // Message sent: <d786aa62-4e0a-070a-47ed-0b0666549519@ethereal.email>
  return info;
}

// async..await is not allowed in global scope, must use a wrapper
