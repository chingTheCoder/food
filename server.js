
"use strict";

// Imports dependencies and set up http server
import express from 'express'
import hbs from 'hbs'

import webhookRoute from './routes/webhook/webhook.js'
import dashboard from './routes/dashboard/dashboard.js'
import menu from './routes/menu/menu.js'

import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)

const __dirname = path.dirname(__filename)

let app = express()
app.use('/dashboard', dashboard)
app.use('/webhook', webhookRoute)
app.use('/menu', menu)
app.use(express.static('public'))
app.set('view engine', 'hbs')
//hbs.registerPartials('')
hbs.registerPartials(__dirname + '/views/partials')

app.listen(process.env.PORT || 80, () => console.log("Abc WhatsappChatBot Webhook is listening"));


app.get("/", (req, res) => {
  res.render('signin')
})

app.post("/", (req, res) => {
  console.log('a request was made here')
  res.redirect('/dashboard')
})