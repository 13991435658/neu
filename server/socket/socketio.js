const startio = (server)=>{
    const {Server} = require('socket.io')
    const io = new Server(server,{
        cors:{
            origin:'http://localhost:3000'
        }
    })
 
    var users = []
    const addUser = (userId,socketId)=>{
        !users.some(user=>user.userId===userId)?users.push({userId,socketId}):users.find(user=>user.userId=userId).socketId=socketId
    }
    const removeUser = (socketId)=>{
        users = users.filter(user=>user.socketId!==socketId)
    }
    
    io.on('connection',(socket)=>{
        socket.on('addUser',(userId)=>{
            addUser(userId,socket.id)
            io.emit('allUsers',users)
        })
        socket.on('sendMsg',({conversationId,senderId,receiverId,content})=>{
            io.to(users.find(user=>user.userId===receiverId)?.socketId).emit('receiveMsg',{
                conversationId,
                senderId,
                content,
                time:Date.now()
            })
        })
        socket.on('sendGroupMsg',({groupId,senderId, receiverIdList,content})=>{
            receiverIdList.forEach(receiverId=>{
                io.to(users.find(user=>user.userId===Number(receiverId))?.socketId).emit('receiveMsg',{
                    conversationId:groupId,
                    senderId,
                    content,
                    time:Date.now()
                })
            })
        })
        socket.on('disconnect',()=>{
            removeUser(socket.id)
            io.emit('allUsers',users)
        })
    })

}

module.exports = startio