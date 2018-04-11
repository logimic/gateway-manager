# Gateway Manager

The tool for easy configuration of your IOT Gateway and end devices.

* [Available releases for Win and Lin](https://github.com/logimic/gateway-manager/releases)

**Supported gateways:**

1. IQRF Daemon Gateway V2.0

# Build from sources

## Prerequisites

* Node.js
* npm
* [Angular CLI](https://github.com/angular/angular-cli) version 1.3.2. Latest recommended version for build is 1.4.3. Install:
```
npm uninstall -g @angular/cli
npm cache clean
# if npm version is > 5 then use `npm cache verify` to avoid errors (or to avoid using --force)
npm install -g @angular/cli@1.4.3
```

## Building after pulling from Github

1. Open terminal/command line and go to main folder.
2. Install local packages from command line.

```
rm -rf node_modules dist # use rmdir /S/Q node_modules dist in Windows Command Prompt; use rm -r -fo node_modules,dist in Windows PowerShell
npm install --save-dev @angular/cli@1.4.3
npm install
```

## Apply fix

1. Update file **..\gateway-manager\node_modules\\@types\three\three-core.d.ts**
2. Add following code at the end of class:
```
export class Camera extends Object3D {
  ...

  //Fix
  aspect: number;

  updateProjectionMatrix(): void;
}
```

## Run via Web Browser

Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The app will automatically reload if you change any of the source files.

## Run via Electron
Inspired by [this page..](http://www.blog.bdauria.com/?p=806)

1. Install Electron
```
npm install -g electron
```

2. Create **..\src\electron** folder with two files:

  * **electron.js**
  ```
  // src/electron/electron.js

  const {app, BrowserWindow} = require('electron')

  // Keep a global reference of the window object, if you don't, the window will
  // be closed automatically when the JavaScript object is garbage collected.
  let win

  function createWindow () {
    // Create the browser window.
    win = new BrowserWindow({width: 1024, height: 768})

    // and load the index.html of the app.
    win.loadURL(`file://${__dirname}/index.html`)

    // Open the DevTools.
    win.webContents.openDevTools()

    // Emitted when the window is closed.
    win.on('closed', () => {
      // Dereference the window object, usually you would store windows
      // in an array if your app supports multi windows, this is the time
      // when you should delete the corresponding element.
      win = null
    })
  }

  // This method will be called when Electron has finished
  // initialization and is ready to create browser windows.
  // Some APIs can only be used after this event occurs.
  app.on('ready', createWindow)

  // Quit when all windows are closed.
  app.on('window-all-closed', () => {
    // On macOS it is common for applications and their menu bar
    // to stay active until the user quits explicitly with Cmd + Q
    if (process.platform !== 'darwin') {
      app.quit()
    }
  })

  app.on('activate', () => {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (win === null) {
      createWindow()
    }
  })

  // In this file you can include the rest of your app's specific main process
  // code. You can also put them in separate files and require them here.
  ```
  * **package.json**
```
{
  "name"    : "GatewayManager",
  "version" : "0.1.0",
  "main": "electron.js",
  "scripts": {
    "start": "electron ."
  }
}
```
3. Update **index.html** this way:

```
<base href="/">
```
change to
```
<base href="./">
```
4. Update **package.json** in project (note that **www** is folder done via **ng build** :()

```
"scripts" {
[...]
"build-electron": "ng build --base-href . && copy src\\electron\\* www",
"electron": "npm run build-electron && electron www/electron.js"
},
[...]
```

5. Run
```
$ ng build
$ npm run electron
```

## Deployment via Electron

This uses [electron-packager](https://github.com/electron-userland/electron-packager) and creates standalone app runnable on many operating systems.

1. Instal package via npm if you didn't
```
# for use from cli
npm install electron-packager -g
```
2. Go to **../gateway-manager/www/** folder (or dist/ or whenever you have electron build)
3. Make package
```
electron-packager .
```
4. You should see **../gateway-manager/www/angular-electron-win32-x64/** folder on Win.  Inside you run **.exe** app
5. If any issues see https://github.com/electron-userland/electron-packager



## Further help

To get more help on the Angular CLI use `ng help` or go check out the [Angular CLI README](https://github.com/angular/angular-cli/blob/master/README.md).
