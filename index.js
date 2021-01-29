const express = require('express')
const path = require('path');
const mongoose = require('mongoose');
const exphbs = require('express-handlebars')
const homeRoutes = require('./routes/home')
const cardRoutes = require('./routes/card')
const addRoutes = require('./routes/add')
const coursesRoutes = require('./routes/courses');
const User = require('./models/user')

const app = express()

const hbs = exphbs.create({
  defaultLayout: 'main',
  extname: 'hbs'
})

app.engine('hbs', hbs.engine)
app.set('view engine', 'hbs')
app.set('views', 'views');

app.use( async (req, res, next) => {
  try{
    const user = await User.findById('60142c0816b7ad37947d9f40');
    req.user = user;
    next();
  } catch (e) {
    console.log(e);
  }
});

app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({extended: true}));

app.use('/', homeRoutes);
app.use('/add', addRoutes);
app.use('/courses', coursesRoutes);
app.use('/card', cardRoutes);

const PORT = process.env.PORT || 3000;

async function start() {
  try {
    const url = 'mongodb+srv://stanislav:You_KnowTheDay1969@cluster0.24jfd.mongodb.net/shop';
    await mongoose.connect(url, {useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false});

    const candidate = await User.findOne();
    if(!candidate) {
      const user = new User({
        email: 'stanistav@mail.ru',
        name: 'stanislav',
        card: {items: []}
      });

      await user.save();
    }

    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  } catch (e) {
    console.log(e)
  }
};

start();