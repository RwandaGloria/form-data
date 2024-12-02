import app from './app'; 
import logger from './config/logger'
import http from 'http';  
import socketIo from 'socket.io'; 

const server = http.createServer(app);

const io = new socketIo.Server(server, {
    cors: {
        origin: "*", 
        methods: ["GET", "POST"],  
    }
});


export { io };

io.on('connection', (socket) => {
    logger.info('A user connected');
  
    socket.on('disconnect', () => {
        logger.info('A user disconnected');
    });

});

const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
    logger.info(`Server running on port ${PORT}`);
});
