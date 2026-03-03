require('dotenv').config();

const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const mongoose = require('mongoose');
const path = require('path');

const analyzeRouter = require('./src/routes/analyze');

const app = express();

app.use(helmet());
app.use(cors({ origin: true }));
app.use(express.json({ limit: '1mb' }));
app.use(morgan('dev'));

// serve static frontend files
const publicDir = path.join(__dirname, 'public');
app.use(express.static(publicDir));

// api routes
app.use('/api', analyzeRouter);

// fallback: if someone goes directly to /results.html?id=... etc
app.get(['/','/index.html'], (req,res)=>{
  res.sendFile(path.join(publicDir,'index.html'));
});
app.get(['/results','/results.html'], (req,res)=>{
  res.sendFile(path.join(publicDir,'results.html'));
});

const PORT = process.env.PORT || 5000;

async function start() {
  try {
    console.log('Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGO_URI, { dbName: 'resume_analyzer' });
    console.log('✅ Connected to MongoDB');

    app.listen(PORT, () => {
      console.log(`✅ Backend + Frontend running on http://localhost:${PORT}`);
    });
  } catch (err) {
    console.error('❌ Failed to start server', err);
    process.exit(1);
  }
}

start();
