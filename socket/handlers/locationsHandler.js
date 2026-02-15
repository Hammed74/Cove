const {
    addUser,
    removeBySocket,
    updateLocation,
    getUserBySocket,
    getOtherUsers,
    setFriends,
    getFriends,
    getSocketId
} = require('../../services/locationStore');

function registerLocationHandlers(io,socket){

    socket.on('authenticate', (data, ack) => {
        const userId = data?.userId;
        const friends = Array.isArray(data?.friends) ? data.friends : [];

        if (!userId){
            if (ack){
             ack({ok: false, error: 'userId required'});
            }
            return;
        }

        addUser(userId, socket.id, friends);

        if (ack) ack({ok: true});

        console.log("Authenticated")
    });

    socket.on('location:update', (data, ack) => {
        // const sender = getUserBySocket(socket.id);
        // if (!sender){
        //     if (ack) ack({ok: false, error: 'not authenticated'});
        //     return;
        // }
        const senderId = socket.handshake.query.userId

        const location = {
            latitude: Number(data.latitude),
            longitude: Number(data.longitude),
            altitude: data.altitude != null ? Number(data.altitude) : null,
            accuracy: data.accuracy != null ? Number(data.accuracy) : null,
            timestamp: data.timestamp || Date.now()
        };
        if (Number.isNaN(location.latitude) || Number.isNaN(location.longitude)) {
            if (ack) ack({ ok: false, error: 'invalid coordinates' });
            return;
        }

        console.log("Location is " + location.latitude + "+" + location.longitude)

        updateLocation(senderId, location)

        const friends = getFriends(senderId);

        if (friends.length > 0){
            friends.forEach((fid) => {
                const targetSocketId = getSocketId(fid)
                if (targetSocketId){
                    io.to(targetSocketId).emit('friend:location', {userId: senderId, location});
                }
            });
        } else {
            const others = getOtherUsers(senderId);
            others.forEach(({ socketId }) => {
                io.to(socketId).emit('friend:location', { userId: senderId, location });
            });
        }

        if (ack) ack({ok: true})
    });

    socket.on('disconnect', (_reason) => {
        removeBySocket(socket.id);
    });
}

module.exports = registerLocationHandlers;