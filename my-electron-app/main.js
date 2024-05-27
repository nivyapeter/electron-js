// main.js

// Modules to control application life and create native browser window
const { app, BrowserWindow, Menu, shell } = require('electron')
const path = require('node:path');
const isMac = process.platform === 'darwin'

const menuItems = [
    {
        label: "About",
        submenu: [
            {
                label: "Exit",
                click: () => {
                    app.quit();
                }
            },
            {
                type: "separator"
            },
            {
                label: "Learn more",
            }

        ]
    }, {
        label: 'File',
        submenu: [
            {
                label: 'New window',
                click: async () => {
                    const win2 = new BrowserWindow({
                        height: 300,
                        width: 400,
                        show:'false',
                        backgroundColor:'#ff00a3',
                        movable:'false'
                    });

                    win2.loadFile('index2.html')
                    // win2.loadURL('https://github.com')
                    win2.once('ready-to-show',() =>{
                        win2.show();
                    })
                }
            },
            {
                label: 'Open Camera',
                click: async () => {
                    const win2 = new BrowserWindow({
                        height: 500,
                        width: 800,
                        show:'false',
                        backgroundColor:'#2e2c29',
                        movable:'false'
                    });

                    // win2.webContents.openDevTools();
                    win2.loadFile('camera.html')
                    // win2.loadURL('https://github.com')
                    win2.once('ready-to-show',() =>{
                        win2.show();
                    })
                }
            }
        ]
    }, {
        label: 'Window',
        submenu: [
            { role: 'minimize' },
            { type: 'separator' },
            { role: 'zoom' },
            { type: 'separator' },
            ...(isMac
                ? [
                    { type: 'separator' },
                    { role: 'front' },
                    { type: 'separator' },
                    { role: 'window' }
                ]
                : [
                    { role: 'close' }
                ])
        ]
    },
    {
        role: 'help',
        submenu: [
            {
                label: 'Learn More',
                click: async () => {
                    await shell.openExternal('https://electronjs.org')
                }
            }
        ]
    },
    {
        label: 'View',
        submenu: [
            { role: 'togglefullscreen' },
            { type: 'separator' },
            { role: 'zoomIn' },
            { type: 'separator' },
            { role: 'zoomOut' },
            { type: 'separator' },
            { role: 'reload' }
        ]
    },


]

const menu = Menu.buildFromTemplate(menuItems);
Menu.setApplicationMenu(menu);

const createWindow = () => {
    // Create the browser window.
    const mainWindow = new BrowserWindow({
        width: 800,
        height: 600,
        webPreferences: {
            preload: path.join(__dirname, 'preload.js')
        }
    })

    // and load the index.html of the app.
    mainWindow.loadFile('index.html')

    // Open the DevTools.
    // mainWindow.webContents.openDevTools()
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(() => {
    createWindow()

    app.on('activate', () => {
        // On macOS it's common to re-create a window in the app when the
        // dock icon is clicked and there are no other windows open.
        if (BrowserWindow.getAllWindows().length === 0) createWindow()
    })
})

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') app.quit()
})

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.