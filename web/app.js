const http=require("http");



const {PORT} =require("../config/constant")

const handler =require("./handle.js")

const app=http.createServer(handler)


process.on('unhandledRejection', (reason, promise) => {
    console.log('Unhandled Rejection at:', promise, 'reason:', reason);
});

process.on('uncaughtException', (err, origin) => {
    console.log( `Caught exception: ${err}\n` +`Exception origin: ${origin}`)
});


app.listen(PORT,()=>{
    console.log("serve is running "+PORT);
})