// main.js
// import {activeWindow} from 'get-windows';
// Modules to control application life and create native browser window
const {
    app,
    BrowserWindow,
    Menu,
    shell,
    ipcMain,
} = require("electron");

// const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));
// const { activeWindow } = require('get-windows');

// console.log( activeWindow);
const { execSync } = require("child_process");

const path = require("node:path");
const isMac = process.platform === "darwin";
let totalTime = 0;

const menuItems = [
    {
        label: "About",
        submenu: [
            {
                label: "Exit",
                click: () => {
                    app.quit();
                },
            },
            {
                type: "separator",
            },
            {
                label: "Learn more",
            },
        ],
    },
    {
        label: "File",
        submenu: [
            {
                label: "New window",
                click: async () => {
                    const win2 = new BrowserWindow({
                        height: 300,
                        width: 400,
                        show: "false",
                        backgroundColor: "#ff00a3",
                        movable: "false",
                    });

                    win2.loadFile("index2.html");
                    // win2.loadURL('https://github.com')
                    win2.once("ready-to-show", () => {
                        win2.show();
                    });
                },
            },
            {
                label: "Open Camera",
                click: async () => {
                    const win2 = new BrowserWindow({
                        height: 500,
                        width: 800,
                        show: "false",
                        backgroundColor: "#2e2c29",
                        movable: "false",
                        webPreferences: {
                            preload: path.join(__dirname, "cameraPreload.js"),
                        },
                    });

                    win2.on("focus", () => {
                        console.log(
                            `Total screen time of main window:${Math.floor(totalTime / 1000)}`
                        );
                    });

                    ipcMain.on("close-window-2", () => {
                        win2.close();
                    });

                    // win2.webContents.openDevTools();
                    win2.loadFile("camera.html");
                    // win2.loadURL('https://github.com')
                    win2.once("ready-to-show", () => {
                        win2.show();
                    });
                },
            },
        ],
    },
    {
        label: "Window",
        submenu: [
            { role: "minimize" },
            { type: "separator" },
            { role: "zoom" },
            { type: "separator" },
            ...(isMac
                ? [
                    { type: "separator" },
                    { role: "front" },
                    { type: "separator" },
                    { role: "window" },
                ]
                : [{ role: "close" }]),
        ],
    },
    {
        role: "help",
        submenu: [
            {
                label: "Learn More",
                click: async () => {
                    await shell.openExternal("https://electronjs.org");
                },
            },
        ],
    },
    {
        label: "View",
        submenu: [
            { role: "togglefullscreen" },
            { type: "separator" },
            { role: "zoomIn" },
            { type: "separator" },
            { role: "zoomOut" },
            { type: "separator" },
            { role: "reload" },
        ],
    },
];

const menu = Menu.buildFromTemplate(menuItems);
Menu.setApplicationMenu(menu);

const getActiveWindowTitle = () => {
    const windowTitle = execSync(
        `xprop -id $(xprop -root 32x '\t$0' _NET_ACTIVE_WINDOW | cut -f 2) _NET_WM_NAME`
    ).toString();

    return windowTitle;
}

const createWindow = () => {
    // Create the browser window.
    const mainWindow = new BrowserWindow({
        width: 800,
        height: 600,
        webPreferences: {
            preload: path.join(__dirname, "preload.js"),
            enableAutoFill: false,
        },
    });

    ipcMain.on("set-image", (event, data) => {
        mainWindow.webContents.send("get-image", data);
    });

    // ipcMain.on('set-text', (event, totalTime) => {
    //     console.log({ totalTime });
    //     mainWindow.webContents.send('set-text', totalTime);
    // })

    mainWindow.on("focus", () => {
        startTime = Date.now();
    });

    mainWindow.on("blur", () => {
        if (startTime) {
            totalTime += Date.now() - startTime;
        }
    });

    mainWindow.webContents.openDevTools();

    // and load the index.html of the app.
    mainWindow.loadFile("index.html");

    setInterval(
        updateWindow = () => {
            const windowTitle = getActiveWindowTitle();
            mainWindow.webContents.send("update-window-title", windowTitle);
        }, 1000,
    );



};

app.whenReady().then(() => {
    createWindow();
    app.on("activate", () => {
        console.log("ready");
        if (BrowserWindow.getAllWindows().length === 0) createWindow();
    });
});

app.on('browser-window-blur', () => {
    console.log('browser-window-blur');
})

// app.on("ready", () => {
//     const activeWindowTitle = getActiveWindowTitle();
//     console.log("Currently focused window:", activeWindowTitle);

// });

app.on("window-all-closed", () => {
    if (process.platform !== "darwin") app.quit();
});


