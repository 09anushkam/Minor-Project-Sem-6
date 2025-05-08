const express = require('express');
const path = require('path');

const app = express();

app.use(express.static(path.join(__dirname, 'frontend/dist')));

app.get('/*', (req, res) => {
    res.sendFile(path.join(__dirname, 'frontend/dist', 'index.html'));
});

const PORT = process.env.PORT || 8090;
app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});
