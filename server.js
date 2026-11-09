// Servidor baseado no JSON Server que já fazia parte do projeto original.
const jsonServer = require('json-server');
const path = require('path');

const server = jsonServer.create();
const router = jsonServer.router(path.join(__dirname, 'db.json'));
const middlewares = jsonServer.defaults({ static: path.join(__dirname, 'public') });

server.use(middlewares);
server.use(jsonServer.bodyParser);
server.use(router);

const porta = 3000;
server.listen(porta, () => {
    console.log(`SportZone está rodando em http://localhost:${porta}`);
    console.log('API de usuários: http://localhost:3000/pessoas');
});
