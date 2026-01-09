import express from 'express';

const app = express();
app.use(express. json());
const PORT = 3000;
const list = [
    {
        id: 1,
        title: "Assignments",
        status: "pending"
    }
]
const items =[
    {
        id: 1,
        list_id: 1,
        description: "programming",
        status: "pending"
    },
    {
        id: 2,
        list_id: 1,
    }
]
const item =[
    {
        id: 2,
        list_id: 1,
        description: "Web Dev",
        status: "pending"
    },
    {
        id: 3,
        list_id: 2,
        description: "Wash Dish",
        status: "pending"
    },
    {
        id: 4,
        list_id: 2,
        description: "Clean the Room",
        status: "pending"
    }
]
app.get('/', (req, res) => {
    res.send('Hello from your Express app!');
});
app.get('/home', (req, res) => {
    res.send('star');
    });
app.get('/get-list', (req, res) => {
    res.status(200).json({ succes: true, list });
    });
app.post('/add-list', (req, res) => {
    const { listTitle } = req.body;

    list.push({
        id: list.length + 1,
        title: listTitle,
        status: "pending"
    });
    res.status(200).json({succes: true, list , message: "List added succesfully"});
    });
app.get('/edit-list', (req, res) => {
    res.send('black');
    });
app.get('/delete-list', (req, res) => {
    res.send('red');
    });
app.get('/get-items/:id', (req, res) => {

    const listId = req.params.id;

    const filtered = items.filter(
        item => item.list_id == listId);

    res.status(200).json({succes: true, items: filtered})
    });
app.get('/add-item', (req, res) => {
    res.send('blue');
    });
app.get('/edi-item', (req, res) => {
    res.send('yellow');
    });
app.get-('/delete-item', (req, res) => {
    res.send('green');
});
app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`);
});