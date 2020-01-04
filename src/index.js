const path=require('path')//core module
const express=require('express')
const http=require('http')//---
const socketio=require('socket.io')
const Filter=require('bad-words')

const {generateMessage,generateLocationMessage}=require('./utils/messages')
const {addUser, removeUser, getUser, getUsersInRoom }=require('./utils/users')

const app=express();
// const server=http.createServer(app);//---//done by nodejs on back-end, but we need it explicitly, so get it
// const io=socketio(server)//for this creared server


const port= process.env.PORT  ||3000

const publicDirectoryPath=path.join(__dirname,'../public')

app.use(express.static(publicDirectoryPath))


 // Console which port server is listening to

const server = app.listen(port, () => {
    console.log(`Server is up and running on port ${port}`);
});
 
// const server = http.createServer(app);
socketio.listen(server);
 
// Setup Socket.io with raw HTTP server
const io = socketio(server);
 


//event         emit/sender     receiver     -----> acknowledgement     sender
//countUpdate  server           client                                  server
//increment     client          server                                  client


//sender will define callback acknowlwdgement function and receiver receive it and call it 



 //let count=0;
// Set up some message when socket.io gets 'connection' event---defined already
io.on('connection', (socket) => {//socket contains info about the connection
    console.log('New websocket connection');

    //socket.emit('message','WELCOME! ')--------want to send time also along

    // socket.emit('messages',{
    //     text:'WELCOME!!',
    //     createdAt:new Date().getTime()//js function
    // })

    //to avoid code repetioiton



    // socket.emit('message',generateMessage('WELCOME! '))
    // socket.broadcast.emit('message',generateMessage('A new user has joined!'))//broadcast the message, send to all connected clients, except the requesting client--ie socket

    //listeners

    socket.on("join",({username,room},callback)=>{

        const {error,user}=addUser({id:socket.id,username,room})//addUser trim username and room, so use that version
        //need these functions so that we can get room and username when we send msg etc

        if(error){
            return callback(error)//acknowledgement
        }


        //socket.join((room))//use user ka room ---- trimmed vala
        socket.join(user.room)//connect same rooms


        //socket.emit   io.emit      socket.broadcast.emit
        //in rooms  --- io,to.emit   socket.to.broadcast.emit       --to send message to part room



    socket.emit('message',generateMessage('Admin','WELCOME! '))
    socket.broadcast.to(user.room).emit('message',generateMessage('Admin',`${user.username} has joined!`))//broadcast the message, send to all connected clients, except the requesting client--ie socket

    io.to(user.room).emit('room-data',{
        room:user.room,
        users:getUsersInRoom(user.room)
    })


    callback();//if no error--acknowlegde, no arg

    })

    socket.on('sendMsg',(msg,callback)=>{
        
        const user=getUser(socket.id);
//user will exist...bcoz sending msg on well established client

        const filter=new Filter();//initialise bad words

        if(filter.isProfane(msg)){
            return callback('Profanity not allowed!')//argument  to callback if error there
        }

        io.to(user.room).emit('message',generateMessage(user.username,msg))
        //callback('Delivered!')
        callback();
    })

//on receives message---arg 1 is event name and arg 2 is function to run---what to doon event
    
    socket.on('sendLocation',(position,callback)=>{

        const user=getUser(socket.id)

        // io.emit('message',"latitude is "+position.latitude+" and longitude is "+position.longitude)
        io.to(user.room).emit('message-location',generateLocationMessage(user.username,"https://google.com/maps?q="+position.latitude+","+position.longitude))
        //to generate a link
        callback();        
    })                                                                                              



    socket.on('disconnect',()=>{//disconnect is predefined event ,which runs when client leaves, and is provided in callback
        
        const user=removeUser(socket.id)//if suppose close a browswer, in which tried to join using invalid data, and when close it, we dont want to see this msg, that user left

        if(user){
            io.to(user.room).emit('message',generateMessage('Admin',`${user.username} has left!`))//no need of broadcast as that user has already left

            io.to(user.room).emit('room-data',{
                room:user.room,
                users:getUsersInRoom(user.room)
            })
        
        }

        
       

    })
});


 /*
    socket.emit('countUpdated',count);//emit sends data from server to client that requested connection
    //----countUpdated is name of event--must match with event receinng in chat.js

    socket.on('increment',()=>{
        count++;
       // socket.emit('countUpdated',count);
       io.emit('countUpdated',count);//io will send response to all clients....
    })
    */




