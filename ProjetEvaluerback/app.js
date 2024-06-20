const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const mongoose = require('mongoose');
const authRoutes = require('./routes/authRoutes');
const postRoutes = require('./routes/postRoutes');
const commentRoutes = require('./routes/commentRoutes')
const path = require('path');
require('dotenv').config();

const app = express();

const MONGO_ACESS= process.env.MONGO_DB
async function connectDatabase() {
      try {
          await mongoose.connect( MONGO_ACESS, {
              useNewUrlParser: true,
              useUnifiedTopology: true,
          });
          console.log('Connexion à MongoDB réussie !');
      } catch (error) {
          console.error('Erreur de connexion à la base de données :', error);
      }
  }

connectDatabase();

app.use(cors());
app.use(helmet())

app.use(express.json());

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
  next();
});
app.use('/images', express.static(path.join(__dirname,'images')));
app.use('/api', authRoutes);
app.use('/api', postRoutes);
app.use('/api', commentRoutes);

module.exports = app;