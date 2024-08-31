// const { app, BrowserWindow, ipcMain, Menu } = require('electron');
// const path = require('path');
// const { exec } = require('child_process');
// const sudo = require('sudo-prompt');

// function createWindow() {
//   const mainWindow = new BrowserWindow({
//     width: 800,
//     height: 600,
//     webPreferences: {
//       preload: path.join(__dirname, 'preload.js'),
//       contextIsolation: true,
//       enableRemoteModule: false,
//     },
//   });

//   mainWindow.loadFile('index2.html');
//   mainWindow.webContents.openDevTools();
//   Menu.setApplicationMenu(null);
// }

// app.on('ready', createWindow);

// ipcMain.on('run-command', (event, command, dashboard) => {
//   exec(command, (error, stdout, stderr) => {
//     if (error) {
//       console.error(`Error: ${error.message}`);
//       event.sender.send('command-output', `Error: ${error.message}`, dashboard);

//       // Check if it's a permissions error
//       if (error.message.includes('need to run as root')) {
//         // Ask for elevated permissions to run the command
//         sudo.exec(command, { name: 'Your App Name' }, (sudoError, sudoStdout, sudoStderr) => {
//           if (sudoError) {
//             if (sudoError.message.includes('User did not grant permission')) {
//               event.sender.send('command-output', 'Permission denied: Please grant permissions or run the application with elevated privileges.', dashboard);
//             } else {
//               console.error(`Sudo Error: ${sudoError}`);
//               event.sender.send('command-output', `Sudo Error: ${sudoError.message}`, dashboard);
//             }
//           } else {
//             event.sender.send('command-output', sudoStdout, dashboard);
//           }
//         });
//       }
//     } else if (stdout) {
//       event.sender.send('command-output', stdout, dashboard);
//     }
//   });
// });




























// const { app, BrowserWindow, ipcMain, Menu } = require('electron');
// const path = require('path');
// const { exec } = require('child_process');


// function createWindow() {
//   const mainWindow = new BrowserWindow({
//     width: 800,
//     height: 600,
//     webPreferences: {
//       preload: path.join(__dirname, 'preload.js'), // Ensure this path is correct
//       contextIsolation: true, // Ensure contextIsolation is true for security
//       enableRemoteModule: false, // Disable remote module for security
//     },
//   });

//   mainWindow.loadFile('index2.html');
//   // mainWindow.webContents.openDevTools();
//   Menu.setApplicationMenu(null);


// }

// app.on('ready', createWindow);


// ipcMain.on('run-command', (event, command, dashboard) => {
//   exec(command, (error, stdout, stderr) => {
//     if (error) {
//       console.error(`Error: ${error.message}`);
//       event.sender.send('command-output', `Error: ${error.message}`, dashboard);
//     }
    
//     if (stderr) {
//       console.error(`stderr: ${stderr}`);
//       // event.sender.send('command-output', `stderr: ${stderr}`, dashboard);
//     }
    
//     if (stdout) {
//       // console.log(`stdout: ${stdout}`);
//       event.sender.send('command-output', stdout, dashboard);
//     }
//   });
// });








const { app, BrowserWindow, ipcMain, Menu } = require('electron');
const path = require('path');
const { exec } = require('child_process');

function createWindow() {
  const mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
      enableRemoteModule: false,
    },
  });

  mainWindow.loadFile('index2.html');
  // mainWindow.webContents.openDevTools();
  Menu.setApplicationMenu(null);

  // Enable right-click context menu
  const contextMenu = Menu.buildFromTemplate([
    { role: 'cut', label: 'Cut' },
    { role: 'copy', label: 'Copy' },
    { role: 'paste', label: 'Paste' }
  ]);

  mainWindow.webContents.on('context-menu', (event, params) => {
    contextMenu.popup(mainWindow, params.x, params.y);
  });
}

app.on('ready', createWindow);

ipcMain.on('run-command', (event, command, dashboard) => {
  exec(command, (error, stdout, stderr) => {
    if (error) {
      console.error(`Error: ${error.message}`);
      event.sender.send('command-output', `Error: ${error.message}`, dashboard);
    }

    if (stderr) {
      console.error(`stderr: ${stderr}`);
      // event.sender.send('command-output', `stderr: ${stderr}`, dashboard);
    }

    if (stdout) {
      // console.log(`stdout: ${stdout}`);
      event.sender.send('command-output', stdout, dashboard);
    }
  });
});







