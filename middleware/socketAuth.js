function socketAuth(socket, next) {
    const { userId } = socket.handshake.query;
    if (!userId || typeof userId !== 'string'){
        return next(new Error('Unauthorized: userId is required'));
    }
    return next();
    }

module.exports = socketAuth;