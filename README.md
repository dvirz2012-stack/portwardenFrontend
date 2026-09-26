<div align="center">

# PortWarden: Frontend

![html5](https://img.shields.io/badge/html5-E34C26?style=for-the-badge&logo=html5&logoColor=white)
![css3](https://img.shields.io/badge/css3-1572B6?style=for-the-badge&logo=css3&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white)
![Status](https://img.shields.io/badge/status-in%20development-orange?style=for-the-badge)

**Hi, this is Portwarden, a cool web application I'm making using Kotlin + TypeScript, here are some 
details:**

</div>

**The steps for running the application are written in the Backend repo!**

**Backend repo link:**

https://github.com/dvirz2012-stack/portwarden

**Credit for design**

I wanted to thank Claude for making my design, since I'm the expert at writing 
only backend and APIs, it really helped me :)

**What happens in the client?**

The only thing connecting the client and the server is the WebSocket URL
(ws://127.0.0.1:8887), and whenever the JSON response body is getting sent, the client
checks what is the content in it, and by that knows what to do (whether it's
showing the port list and creating tables).
After a successful kill, the client sends FETCH_PORTS again to the backend,
and rebuilds the whole table again according to the new list.

The logic is written with TypeScript, app.ts has lifecycle listeners to whenever a 
WebSocket event happens (onerror, onmessage, onopen, onclose).

There is an arrow function killProcess, which is coming from the frontend and gets sent to the backend,
we send to it the port that holds the process we want to kill, and then it sends the port to the
WebSocket with the command KILL_PROCESS for the backend to know that it needs to do KILL_PROCESS
on the port $port, note that the client obviously doesn't do the kill, it just sends the message to the server saying
"check if this process is killable and then kill", note that there are 2 messages that get sent to the server:

```typescript
  ws.send("KILL_PROCESS");
  ws.send(String(port));
```

The table-creating occurs on onmessage, where it reads the data that got sent from
the JSON response body, and by that knows what to do (either notify that the ports were fetched successfully or a process was killed successfully).

**Good to mention:**

 - The WebSocket URL exists in src/config.ts.
 - After editing app.ts (or config.ts), run tsc in your terminal to recompile, since the browser loads the compiled app.js file :)

<div align="center">
  
  Made by **Dvir** :)
  
</div>
