 document.addEventListener("DOMContentLoaded", () => {

    const fakeInputEl = document.getElementById("fake-input");

    const historyEl = document.getElementById("terminal-history");

    const screenEl = document.getElementById("terminal-screen");


    // Sequência de animações pré-programadas

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


    // 1. Exibe a resposta linha por linha com um pequeno delay de carregamento

    function printResponseLineByLine(lines, container, delay = 150) {

        return new Promise((resolve) => {

            let lineIndex = 0;


            function printNextLine() {

                if (lineIndex < lines.length) {

                    const lineText = lines[lineIndex];

                   

                    // Cria uma tag pre para manter a formatação de cada linha

                    const pre = document.createElement("pre");

                    pre.style.color = "#00ff66";

                    pre.style.margin = "2px 0";

                    pre.style.fontFamily = "inherit";

                    pre.style.whiteSpace = "pre-wrap";

                    pre.textContent = lineText;


                    container.appendChild(pre);

                   

                    // Scroll suave usando requestAnimationFrame para melhor performance

                    requestAnimationFrame(() => {

                        screenEl.scrollTop = screenEl.scrollHeight;

                    });


                    lineIndex++;

                    setTimeout(printNextLine, delay);

                } else {

                    // Adiciona uma quebra de linha sutil ao final do bloco de comando

                    container.appendChild(document.createElement("br"));

                    resolve();

                }

            }


            printNextLine();

        });

    }


    // 2. Prepara os blocos de comando e chama o renderizador de linhas

    async function printToTerminal(command, response) {

        // Cria a linha que mostra o comando que foi "digitado"

        const commandLine = document.createElement("div");

        commandLine.className = "history-line";

        commandLine.innerHTML = `<p style="margin: 5px 0;"><span style="color: #00ffcc; font-weight: bold;">guest@libremilq:~$</span> <span style="color: #fff;">${command}</span></p>`;

        historyEl.appendChild(commandLine);


        // Cria o container que vai receber as linhas da resposta

        const responseContainer = document.createElement("div");

        responseContainer.className = "history-response";

        historyEl.appendChild(responseContainer);


        // Quebra a resposta em um array de linhas

        const lines = response.split("\n");


        // Executa o efeito visual de carregar linha por linha e aguarda concluir

        await printResponseLineByLine(lines, responseContainer, 200); // 200ms entre cada linha

    }


    // 3. Simula a digitação caractere por caractere

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


    // 4. Controla o ciclo de animações

    async function runSecurityMonitor() {

        while (true) {

            await new Promise(r => setTimeout(r, 1200));


            for (const step of SCAN_SEQUENCE) {

                // Digita o comando

                await simulateTyping(step.command, 70);

                await new Promise(r => setTimeout(r, 600));


                // Limpa a digitação e começa a cuspir o resultado linha por linha

                fakeInputEl.textContent = "";

                await printToTerminal(step.command, step.response);

               

                // Espera um tempo de leitura antes do próximo comando

                await new Promise(r => setTimeout(r, 2000));

            }


            // Animação final de limpeza de tela para reiniciar o ciclo

            await simulateTyping("clear", 100);

            await new Promise(r => setTimeout(r, 500));

            historyEl.innerHTML = "";

            fakeInputEl.textContent = "";

        }

    }


    runSecurityMonitor();

}); 