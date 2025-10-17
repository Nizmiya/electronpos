const { app, BrowserWindow, Menu, ipcMain, dialog } = require('electron');
const path = require('path');
const Store = require('electron-store');
const axios = require('axios');

const store = new Store();

let mainWindow;

const API_BASE_URL = 'http://localhost:5000/api';

// Create the main window
function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    minWidth: 800,
    minHeight: 600,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
      enableRemoteModule: true
    },
    icon: path.join(__dirname, 'assets/icon.png'),
    titleBarStyle: 'default',
    show: false
  });

  // Load the HTML file
  mainWindow.loadFile('index.html');

  // Show window when ready
  mainWindow.once('ready-to-show', () => {
    mainWindow.show();
  });

  // Open DevTools in development
  if (process.argv.includes('--dev')) {
    mainWindow.webContents.openDevTools();
  }

  // Handle window closed
  mainWindow.on('closed', () => {
    mainWindow = null;
  });
}

// App event handlers
app.whenReady().then(createWindow);

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});

// Create application menu
const template = [
  {
    label: 'File',
    submenu: [
      {
        label: 'New Sale',
        accelerator: 'CmdOrCtrl+N',
        click: () => {
          mainWindow.webContents.send('new-sale');
        }
      },
      {
        label: 'Print Receipt',
        accelerator: 'CmdOrCtrl+P',
        click: () => {
          mainWindow.webContents.send('print-receipt');
        }
      },
      { type: 'separator' },
      {
        label: 'Exit',
        accelerator: process.platform === 'darwin' ? 'Cmd+Q' : 'Ctrl+Q',
        click: () => {
          app.quit();
        }
      }
    ]
  },
  {
    label: 'View',
    submenu: [
      {
        label: 'Toggle Full Screen',
        accelerator: process.platform === 'darwin' ? 'Ctrl+Cmd+F' : 'F11',
        click: () => {
          mainWindow.setFullScreen(!mainWindow.isFullScreen());
        }
      },
      {
        label: 'Toggle Developer Tools',
        accelerator: process.platform === 'darwin' ? 'Alt+Cmd+I' : 'Ctrl+Shift+I',
        click: () => {
          mainWindow.webContents.toggleDevTools();
        }
      }
    ]
  },
  {
    label: 'Help',
    submenu: [
      {
        label: 'About',
        click: () => {
          dialog.showMessageBox(mainWindow, {
            type: 'info',
            title: 'About POS System',
            message: 'POS System v1.0.0',
            detail: 'Point of Sale System built with Electron'
          });
        }
      }
    ]
  }
];

const menu = Menu.buildFromTemplate(template);
Menu.setApplicationMenu(menu);

// IPC handlers for API communication
ipcMain.handle('api-request', async (event, { method, url, data, headers = {} }) => {
  try {
    const token = store.get('authToken');
    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }

    const response = await axios({
      method,
      url: `${API_BASE_URL}${url}`,
      data,
      headers
    });

    return { success: true, data: response.data };
  } catch (error) {
    return {
      success: false,
      error: error.response?.data || { message: 'Network error' }
    };
  }
});

// IPC handlers for authentication
ipcMain.handle('login', async (event, { email, password }) => {
  try {
    console.log('Attempting login for:', email);
    const response = await axios.post(`${API_BASE_URL}/auth/login`, {
      email,
      password
    });

    console.log('Login response status:', response.status);
    console.log('Login response data:', response.data);
    
    if (response.status === 200 && response.data.message === 'Login successful') {
      const { token, user } = response.data;
      store.set('authToken', token);
      store.set('user', user);

      console.log('Login successful, user stored:', user);
      console.log('Returning success to frontend');
      return { success: true, user };
    } else {
      console.log('Login failed - unexpected response format');
      return {
        success: false,
        error: { message: 'Unexpected response format' }
      };
    }
  } catch (error) {
    console.error('Login error:', error.response?.data || error.message);
    console.error('Error status:', error.response?.status);
    console.error('Error details:', error);
    return {
      success: false,
      error: error.response?.data || { message: 'Login failed' }
    };
  }
});

ipcMain.handle('logout', () => {
  store.delete('authToken');
  store.delete('user');
});

ipcMain.handle('get-stored-user', () => {
  return store.get('user');
});

ipcMain.handle('get-stored-token', () => {
  return store.get('authToken');
});

// IPC handlers for printing
ipcMain.handle('print-receipt', async (event, receiptData) => {
  try {
    // This would integrate with a printer library
    // For now, we'll just log the receipt data
    console.log('Printing receipt:', receiptData);
    return { success: true };
  } catch (error) {
    return { success: false, error: error.message };
  }
});
