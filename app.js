import express from 'express';
import http from 'http';
import {Server} from 'socket.io';
import path from 'path';



const app = express();
const server = http.createServer(app);
const io = new Server(server,
    {
        cors: {
            origin: "http://localhost:3000",
            methods: ["GET", "POST"]
        }
    }
);

io.on("connection" , function(socket){
    console.log("A user connected: ", socket.id);
    socket.on("send-location",(data)=>{
        io.emit("receive-location",{id:socket.id, ...data})
    })

    socket.on("disconnect",function(){
        io.emit("user-disconnected",{id : socket.id})
        console.log("A user disconnected: ", socket.id);
    })
})
// ...existing code...

const PORT = process.env.PORT || 5000;

app.set("view engine","ejs");
app.use(express.static(path.join("public")));

app.get('/', (req,res)=>{
    res.render('index.ejs');
});

server.listen(PORT , () =>{
    console.log("server is running on port ",PORT);
});