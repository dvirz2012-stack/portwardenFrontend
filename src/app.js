import { WS_URL } from "./config.js";
const ws = new WebSocket(WS_URL);
ws.onopen = (onopen) => {
    console.log("Connected.");
    ws.send("FETCH_PORTS");
};
ws.onclose = (onclose) => {
    console.warn("Connection dropped.");
};
ws.onerror = (onerror) => {
    console.error("Websocket error.");
};
window.killProcess = (pid) => {
    console.log(`Sending kill command for Pid: ${pid}`);
    ws.send(`KILL_PROCESS:${pid}`);
};
ws.onmessage = (event) => {
    const response = JSON.parse(event.data);
    switch (response.type) {
        case "SUCCESS": {
            if (response.message == "Ports fetched successfully") {
                const table = document.getElementById("port-list");
                if (table != null) {
                    table.innerHTML = "";
                    response.data.forEach((portInfo) => {
                        table.innerHTML += `<tr>
                                <td>${portInfo.pid}</td>
                                <td>${portInfo.processName}</td> 
                                <td>${portInfo.port}</td>
                                <td><button onclick="killProcess(${portInfo.pid})">Kill</button></td>
                            </tr>`;
                    });
                }
                console.log(response.data);
            }
            else if (response.message == "Process killed successfully") {
                ws.send("FETCH_PORTS");
            }
            break;
        }
        case "ERROR": {
            alert(`Error: ${response.message}\nDetails: ${response.data}`);
            console.error(response.data);
            break;
        }
    }
};
