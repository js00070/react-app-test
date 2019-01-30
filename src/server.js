// 引入WebSocket模块
const wss = require('nodejs-websocket')
const PORT = 80
 
const sessionMap = new Map()

function setupSessionHandler(msg,conn) {
    console.log("setup session: "+ msg.sessionKey)
    let sessionKey = msg.sessionKey
    if(sessionMap.has(sessionKey)){
        sessionMap.set(sessionKey,sessionMap.get(sessionKey).concat([conn]))
    }else{
        sessionMap.set(sessionKey,[conn])
    }
}

function orderHandler(msg) {
    console.log("handle order: "+ msg.sessionKey)
    let sessionKey = msg.sessionKey
    if(sessionMap.has(sessionKey)){
        const connList = sessionMap.get(sessionKey)
        connList.forEach(conn => {
            conn.sendText(JSON.stringify(msg))
        })
    }
}

// on就是addListener，添加一个监听事件调用回调函数
const server = wss.createServer(function(conn){
    console.log('New connection')
    
    conn.on("text",function(str){
        console.log("Received"+str)
        let msg = JSON.parse(str)
        if(msg.setup_session == true){
            setupSessionHandler(msg,conn)
        }else{
            orderHandler(msg)
        }
        //conn.sendText(str)  //收到直接发回去
    })
    conn.on("close",function(code,reason){
        console.log("connection closed")
    })
    conn.on("error",function(err){
        console.log("handle err")
        console.log(err)
    })
}).listen(PORT)
 
console.log('websocket server listening on port ' + PORT)
