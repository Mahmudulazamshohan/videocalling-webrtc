const express = require('express');
const app =express()

let port = process.env.PORT || 8010;
app.use(express.static(__dirname + '/build'));
var server = require('http').Server(app);
var io = require('socket.io')(server);
server.listen(port,()=>{
    console.log(`Server PORT ${port}`)
})

var userList = []
io.on('connection',(socket)=>{

    socket.on('send_offer',(data)=>{
        io.to(data.target.id).emit('get_offer',data)
    })
    socket.on('send_answer',(data)=>{
        io.to(data.target.id).emit('get_answer',data)
    })
    socket.on('outgoing_call',(data)=>{
        io.to(data.target.id).emit('incoming_call',data)
    })

    socket.on('send_candidate',(data)=>{
        io.to(data.target.id).emit('get_candidate',data)
       // io.broadcast.emit('get_candidate',data)
    })
    socket.on('created',(data)=>{
        var user = {
            id :socket.id,
            username:data.username
        }
        userList.push(user)
        socket.emit('join-me',user)
        if(userList.length){
            socket.emit('joined-users',userList)
        }
        socket.broadcast.emit('join-new-user',userList)
    })
    socket.on('disconnect',()=>{
        userList =  userList.filter(user => user.id != socket.id )
        socket.broadcast.emit('user-leave',userList)
    })
})
