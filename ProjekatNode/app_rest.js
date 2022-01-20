const express = require('express');
const { sequelize } = require('./models');
const cors = require('cors');
const user_routes = require('./routes/user_route');
const post_routes = require('./routes/post_route');
const tag_routes = require('./routes/tag_route');
const comment_routes = require('./routes/comment_route');
const app = express();

var corsOptions = {
    origin: "http://localhost:8000",
    optionsSuccessStatus: 200
}

app.use(express.json());
app.use(cors(corsOptions));

app.use('/admin', user_routes);
app.use('/admin', post_routes);
app.use('/admin', tag_routes);
app.use('/admin', comment_routes);


app.listen({ port: 8080 }, async () => {
    await sequelize.authenticate();
    console.log('Pokrenut REST servis na 8080 portu');
});