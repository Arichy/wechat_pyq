const WebSocket = require('ws')

const wsServer = new WebSocket.Server({ port: 3000 })

let socketSet = []

wsServer.on('connection', (ws, req, res) => {
    console.log(req.url);

    const userid = req.url.split('/')
    let isExist = false; // 当前用户是否在线
    socketSet.forEach(ws => {
        if (ws.currentId == userid[2]) {
            isExist = true;
        }
    })

    if (!isExist) {
        socketSet.push({
            ws,
            currentId: userid[1]
        })
    }

    ws.on('message', msg => {
        const msgObj = JSON.parse(msg)
        socketSet.forEach(ws => {
            if (ws.ws.readyState == 1) {
                if (ws.currentId == msgObj.target) {
                    ws.ws.send(
                        JSON.stringify({
                            msg: msgObj.msg,
                            from: msgObj.current
                        })
                    )
                }
            }
        })
    })
})