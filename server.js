const express = require('express');
const { spawn } = require('child_process');

const app = express();
app.use(express.json());

app.post('/ffmpeg', (req, res) => {
  const args = req.body.args;
  if (!Array.isArray(args)) {
    return res.status(400).json({ error: 'args must be an array' });
  }

  const ffmpeg = spawn('ffmpeg', args);
  let output = '';

  ffmpeg.stdout.on('data', data => {
    output += data.toString();
  });

  ffmpeg.stderr.on('data', data => {
    output += data.toString();
  });

  ffmpeg.on('close', code => {
    res.json({ code, output });
  });

  ffmpeg.on('error', err => {
    res.status(500).json({ error: err.message });
  });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`FFmpeg server listening on port ${PORT}`);
});
