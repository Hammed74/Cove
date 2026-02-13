const users = new Map();
const sockets = new Map();

function addUser(userId, socketId, friends = []) {
    users.set(userId, {socketId, friends, location: null});
    sockets.set(socketId, userId)
}

function removeBySocket(socketId) {
    const userId = sockets.get(socketId);
    if (userId) {
        users.delete(userId);
    }
    sockets.delete(socketId); 
}

function updateLocation(userId, location){
    const user = users.get(userId);
    if (!user) return;
    user.location = location;
    users.set(userId, user)
}

function getUserBySocket(socketId){
    const userId = sockets.get(socketId);
    if (!userId) return null;
    return users.get(userId) || null;
}

function getUser(userId) {
  return users.get(userId) || null;
}

function getOtherUsers(currentUserId) {
  // Return array of other connected users (max 3 others)
  const others = [];
  for (const [uid, data] of users.entries()) {
    if (uid !== currentUserId) others.push({ userId: uid, socketId: data.socketId, location: data.location });
  }
  return others;
}

function setFriends(userId, friends) {
  const user = users.get(userId);
  if (!user) return;
  user.friends = Array.isArray(friends) ? friends : [];
  users.set(userId, user);
}

function getFriends(userId) {
  const user = users.get(userId);
  return user ? user.friends : [];
}

function getSocketId(userId) {
  const user = users.get(userId);
  return user ? user.socketId : null;
}

module.exports = {
  addUser,
  removeBySocket,
  updateLocation,
  getUserBySocket,
  getUser,
  getOtherUsers,
  setFriends,
  getFriends,
  getSocketId
};