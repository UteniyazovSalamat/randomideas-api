const express = require('express');
const port = 5001;

const app = express();

app.get('/', (req, res) => {
    res.json({ message: 'Hello World' });
});

app.listen(port, () => console.log(`Server listening on port ${port}`));
