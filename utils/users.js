const users = [];

//Join user to chat
function userJoin(id, username, room){
    const user = {id, username, room};

    users.push(user);

    return user;
}

//get current user
function getCurrentUser(id){
    if(id !== undefined){
        return users.find(user => user.id === id);
    }else{
        console.log('cos nie tak')
    }
}

//user disconnect
function disconnectUser(id){
    const nazwa = users.findIndex(user => user.id === id)
    if (nazwa !== -1){
        return users.splice(nazwa, 1)[0];
    }
}
//narazie nie uzywane
function userCheckRoom(room){
    return users.filter(user => user.room === room)
}

function findUserPriv(privName){
    const userp = users.find(user => user.username === privName)
    return userp
}



//nieuzywane
module.exports = {
    userJoin,
    getCurrentUser,
    disconnectUser,
    userCheckRoom, 
    userx: users,
    findUserPriv
}