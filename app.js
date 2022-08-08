const express = require("express")
const exphbs = require('express-handlebars')
const session = require('express-session')
const Acct = require('./user.json')

const app = express()
const port = 3000

app.engine('hbs', exphbs.engine({ defaultLayout: 'main', extname: '.hbs' }))
app.set('view engine', 'hbs')

app.use(express.urlencoded({ extended: true}))
app.use(express.static('pubilc'))
app.use(session({ secret: '987123',  name: 'user', saveUninitialized: false, resave: true}))

app.get('/', (req, res) => {
  if(req.session.user){
    res.render('personal', {name: req.session.user})
  } else {
    res.render('index')
  }
})

app.post('/', (req, res) => {
  const foundData = Acct.users.find(user => user.email === req.body.email )
  if (foundData){
    if (req.body.password === foundData.password){
      res.render('personal', { name: foundData.firstName})
      req.session.user = foundData.firstName
    } else {
      res.render('index', { email: req.body.email, password: req.body.password, incorrect: 'incorrect email or password'})
    }

  } else {
    res.render('index', { email: req.body.email, password: req.body.password, incorrect: 'incorrect email or password'})
  }

})

app.get('/logout', (req, res) => {
  req.session.destroy()
  res.redirect('/')
})

app.listen(port, () => {
  console.log(`Listening on http://localhost${port}`)
})