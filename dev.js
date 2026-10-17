const liveServer = require("live-server");
const { spawn } = require("child_process");

const PORT = 8080;
const URL = `http://127.0.0.1:${PORT}`;

const params = {
    port: PORT,
    host: "127.0.0.1",
    root: ".",
    open: false, // Handled below with full path to prevent ENOENT crash
    wait: 500,
    logLevel: 1
};

liveServer.start(params);

console.log("\x1b[32m%s\x1b[0m", `\n  ✔ Portfolio server active at: ${URL}\n`);

// Safely open the browser on Windows using absolute system paths
setTimeout(() => {
    const cmdPath = process.env.ComSpec || "C:\\Windows\\System32\\cmd.exe";
    try {
        const child = spawn(cmdPath, ["/c", "start", "", URL], {
            detached: true,
            stdio: "ignore"
        });
        child.on("error", () => {
            try {
                const exp = spawn("C:\\Windows\\explorer.exe", [URL], { detached: true, stdio: "ignore" });
                exp.unref();
            } catch (_) {}
        });
        child.unref();
    } catch (_) {
        console.log(`Open ${URL} directly in your browser.`);
    }
}, 300);
