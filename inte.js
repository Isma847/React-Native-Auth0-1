const http = require('http');
const mysql = require('mysql');

const connection = mysql.createConnection({
    host: '127.0.0.1',
    user: 'root',
    password: '',
    database: 'user'
});

connection.connect((err) => {
    if (err) {
        console.error('Error conectando a la base de datos: ' + err.stack);
        return;
    }
    console.log('Conectado a la base de datos como id ' + connection.threadId);
});

const server = http.createServer((req, res) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'OPTIONS, POST');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') {
        res.writeHead(200);
        res.end();
        return;
    }
    
    let body = '';
    req.on('data', chunk => {
        body += chunk.toString();
    });

    req.on('end', () => { 
        let data;
        try {
            data = JSON.parse(body);
        } catch (e) {
            res.writeHead(400, { 'Content-Type': 'text/plain' });
            res.end('Error: Datos JSON inválidos.');
            return;
        }

        const { nombre, auth0_id, email } = data; 

        if (req.method === 'POST' && req.url === '/sync-user') {
            
            if (!auth0_id || !nombre) {
                res.writeHead(400, { 'Content-Type': 'text/plain' });
                res.end('Error: Falta el ID de Auth0 o el nombre de usuario.');
                return;
            }

            const sqlCheck = 'SELECT auth0_id FROM usuario WHERE auth0_id = ?';
            
            connection.query(sqlCheck, [auth0_id], (error, results) => {
                if (error) {
                    res.writeHead(500, { 'Content-Type': 'text/plain' });
                    res.end('Error al buscar usuario: ' + error.code); 
                    return;
                }
                
                if (results.length > 0) {
                    res.writeHead(200, { 'Content-Type': 'text/plain' });
                    res.end('Usuario sincronizado (existente).');
                } else {
                    const sqlInsert = 'INSERT INTO usuario (auth0_id, nombre) VALUES (?, ?)';
                    
                    connection.query(sqlInsert, [auth0_id, nombre], (insertError, insertResults) => {
                        if (insertError) {
                            res.writeHead(500, { 'Content-Type': 'text/plain' });
                            res.end('Error al registrar nuevo usuario: ' + insertError.code); 
                            return;
                        }
                        res.writeHead(200, { 'Content-Type': 'text/plain' });
                        res.end('Nuevo usuario registrado con éxito.');
                    });
                }
            });
        }

        else if (req.method === 'POST' && req.url === '/update-user') {
            
            if (!auth0_id) {
                res.writeHead(400, { 'Content-Type': 'text/plain' });
                res.end('Error: Falta el ID de Auth0 para actualizar.');
                return;
            }
            const sqlUpdate = 'UPDATE usuario SET nombre = ?, email = ? WHERE auth0_id = ?';
            
            connection.query(sqlUpdate, [nombre, email, auth0_id], (error, results) => {
                if (error) {
                    res.writeHead(500, { 'Content-Type': 'text/plain' });
                    res.end('Error al actualizar usuario: ' + error.code);
                    return;
                }
                
                if (results.affectedRows === 0) {
                    res.writeHead(404, { 'Content-Type': 'text/plain' });
                    res.end('Error: Usuario no encontrado en la BD.');
                    return;
                }
                
                res.writeHead(200, { 'Content-Type': 'text/plain' });
                res.end('Datos del usuario actualizados con éxito.');
            });
        }
        else {
            res.writeHead(404, { 'Content-Type': 'text/plain' });
            res.end('Ruta no encontrada');
        }
    });
});

const port = 3000;
server.listen(port, () => {
    console.log(`Servidor corriendo en http://localhost:${port}`);
});