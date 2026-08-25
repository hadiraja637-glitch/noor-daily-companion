const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();

app.use(cors({
  origin: "*",
  methods: ["GET", "POST"]
}));
app.use(express.json());

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});

const BLOGS_FILE = path.join(__dirname, 'blogs.json');
const CHAT_FILE = path.join(__dirname, 'chat.json');

const readData = (filePath) => {
  try {
    if (!fs.existsSync(filePath)) {
      fs.writeFileSync(filePath, JSON.stringify([]));
      return [];
    }
    return JSON.parse(fs.readFileSync(filePath, 'utf8'));
  } catch (err) {
    return [];
  }
};

const writeData = (filePath, data) => {
  try {
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
  } catch (err) {
    console.error("Error writing file:", err);
  }
};

if (!fs.existsSync(BLOGS_FILE)) writeData(BLOGS_FILE, []);
if (!fs.existsSync(CHAT_FILE)) writeData(CHAT_FILE, []);

app.get('/', (req, res) => {
  res.json({ status: "Islamic Community Hub Backend is running!" });
});

app.get('/api/blogs', (req, res) => {
  res.json(readData(BLOGS_FILE));
});

app.post('/api/blogs', (req, res) => {
  const { title, content, author, category, img } = req.body;
  if (!title || !content || !author) {
    return res.status(400).json({ error: 'Required fields missing.' });
  }

  const blogs = readData(BLOGS_FILE);
  const newPost = {
    id: Date.now().toString(),
    title,
    content,
    author,
    category: category || 'Islamic Discussion',
    img: img || '',
    date: new Date().toLocaleDateString()
  };

  blogs.unshift(newPost);
  writeData(BLOGS_FILE, blogs);
  res.status(201).json({ message: 'Posted successfully', post: newPost });
});

app.get('/api/chat', (req, res) => {
  res.json(readData(CHAT_FILE));
});

io.on('connection', (socket) => {
  console.log('User connected:', socket.id);

  socket.emit('init_chat', readData(CHAT_FILE));

  socket.on('send_message', (msgData) => {
    if (!msgData || !msgData.text) return;

    const chatMessages = readData(CHAT_FILE);
    const newMsg = {
      id: msgData.id || Date.now().toString(),
      user: msgData.user || 'Anonymous',
      text: msgData.text,
      timestamp: msgData.timestamp || new Date().toLocaleTimeString()
    };

    chatMessages.push(newMsg);
    if (chatMessages.length > 100) chatMessages.shift();
    writeData(CHAT_FILE, chatMessages);

    io.emit('new_chat_message', newMsg);
  });

  socket.on('delete_message', (msgId) => {
    let chatMessages = readData(CHAT_FILE);
    chatMessages = chatMessages.filter(m => m.id !== msgId);
    writeData(CHAT_FILE, chatMessages);
    io.emit('delete_chat_message', msgId);
  });

  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
  });
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Backend running on port ${PORT}`);
});
