 document.addEventListener("DOMContentLoaded", () => {

    const fakeInputEl = document.getElementById("fake-input");

    const historyEl = document.getElementById("terminal-history");

    const screenEl = document.getElementById("terminal-screen");



    const SCAN_SEQUENCE = [

        {

            command: "check --integrity",

            response: `[+] Verifying local file systems...

[+] Hash check complete: SHA-256 matches verified build.

[+] All system modules secure.`

        },

        {

            command: "netstat -an | grep LISTEN",

            response: `tcp        0      0 0.0.0.0:80              0.0.0.0:* LISTEN    

tcp        0      0 0.0.0.0:443             0.0.0.0:* LISTEN    

[!] Unauthorized port scanning attempt blocked from 185.220.101.5`

        },

        {

            command: "search --query exploit-db",

            response: `Searching local database for active CVEs...

[FOUND] CVE-2026-44321 (Critical) -> Patched.

[FOUND] CVE-2026-11092 (Medium)   -> Mitigated by Firewall rule.

[+] 0 vulnerabilities active.`

        },

        {

            command: "syslog --tail 3",

            response: `Jul 16 11:47:30 libremilq systemd[1]: Started Periodic Command Scheduler.

Jul 16 11:47:31 libremilq sshd[4012]: Connection closed by authenticating user root.

Jul 16 11:47:31 libremilq kernel: [Security] Intrusion prevention triggered on interface eth0.`

        }

    ];



    function printResponseLineByLine(lines, container, delay = 150) {

        return new Promise((resolve) => {

            let lineIndex = 0;


            function printNextLine() {

                if (lineIndex < lines.length) {

                    const lineText = lines[lineIndex];

                   


                    const pre = document.createElement("pre");

                    pre.style.color = "#00ff66";

                    pre.style.margin = "2px 0";

                    pre.style.fontFamily = "inherit";

                    pre.style.whiteSpace = "pre-wrap";

                    pre.textContent = lineText;


                    container.appendChild(pre);

                   

                    requestAnimationFrame(() => {

                        screenEl.scrollTop = screenEl.scrollHeight;

                    });


                    lineIndex++;

                    setTimeout(printNextLine, delay);

                } else {


                    container.appendChild(document.createElement("br"));

                    resolve();

                }

            }


            printNextLine();

        });

    }



    async function printToTerminal(command, response) {


        const commandLine = document.createElement("div");

        commandLine.className = "history-line";

        commandLine.innerHTML = `<p style="margin: 5px 0;"><span style="color: #00ffcc; font-weight: bold;">guest@libremilq:~$</span> <span style="color: #fff;">${command}</span></p>`;

        historyEl.appendChild(commandLine);



        const responseContainer = document.createElement("div");

        responseContainer.className = "history-response";

        historyEl.appendChild(responseContainer);



        const lines = response.split("\n");



        await printResponseLineByLine(lines, responseContainer, 200); 

    }



    function simulateTyping(text, delay = 80) {

        return new Promise((resolve) => {

            let index = 0;

            fakeInputEl.textContent = "";

           

            const interval = setInterval(() => {

                fakeInputEl.textContent += text[index];

                index++;

                if (index >= text.length) {

                    clearInterval(interval);

                    resolve();

                }

            }, delay);

        });

    }



    async function runSecurityMonitor() {

        while (true) {

            await new Promise(r => setTimeout(r, 1200));


            for (const step of SCAN_SEQUENCE) {


                await simulateTyping(step.command, 70);

                await new Promise(r => setTimeout(r, 600));



                fakeInputEl.textContent = "";

                await printToTerminal(step.command, step.response);

               


                await new Promise(r => setTimeout(r, 2000));

            }



            await simulateTyping("clear", 100);

            await new Promise(r => setTimeout(r, 500));

            historyEl.innerHTML = "";

            fakeInputEl.textContent = "";

        }

    }


    runSecurityMonitor();

}); 