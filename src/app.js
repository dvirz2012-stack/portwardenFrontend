import { WS_URL } from "./config.js";
const ws = new WebSocket(WS_URL);
const confirmDialog = document.getElementById("confirm-kill");
const confirmName = document.getElementById("confirm-kill-name");
const confirmPort = document.getElementById("confirm-kill-port");
let currentPorts = [];
let pendingPort = null;
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
window.killProcess = (port) => {
    pendingPort = port;
    confirmName.textContent = currentPorts.find(p => p.port === port)?.processName ?? "the process";
    confirmPort.textContent = String(port);
    confirmDialog.returnValue = "";
    confirmDialog.showModal();
};
confirmDialog.addEventListener("close", () => {
    if (confirmDialog.returnValue === "kill" && pendingPort !== null) {
        console.log(`Sending kill command for Port: ${pendingPort}`);
        ws.send("KILL_PROCESS");
        ws.send(String(pendingPort));
    }
    pendingPort = null;
});
ws.onmessage = (event) => {
    const response = JSON.parse(event.data);
    switch (response.type) {
        case "SUCCESS": {
            if (response.message == "Ports fetched successfully") {
                currentPorts = response.data;
                const table = document.getElementById("port-list");
                if (table != null) {
                    table.innerHTML = "";
                    response.data.forEach((portInfo) => {
                        table.innerHTML += `<tr>
                                <td>${portInfo.pid}</td>
                                <td>${portInfo.icon ? `<img class="process-icon" src="${portInfo.icon}" alt = "">` : ""}</td>
                                <td>${portInfo.processName}</td>  
                                <td>${portInfo.port}</td>
                                <td><button onclick="killProcess(${portInfo.port})">Kill</button></td>
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
