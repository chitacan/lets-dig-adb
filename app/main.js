var app      = require('app')
  , Menu     = require('menu')
  , MenuItem = require('menu-item')
  , BW       = require('browser-window')
  , Screen   = require('screen')
  , win;

app.on('ready', function() {
  var size = Screen.getPrimaryDisplay().workAreaSize;
  win = new BW({
    width  : size.width,
    height : size.height,
    frame: false,
    show: true,
    title: 'ADB'
  });

  win.on('closed', function() {
    win = null;
  });

  win.loadUrl('file://' + __dirname + '/index.html');
  win.show();

  var menu_tmpl = [{
    lable: 'ADB',
    submenu: [{
      label: 'reload',
      accelerator: 'Command+R',
      click: function() {
        win.reload();
      }
    }, {
      label: 'Toggle DevTools',
      accelerator: 'Alt+Command+I',
      click: function() {
        win.toggleDevTools();
      }
    }, {
      label: 'Copy',
      accelerator: 'Command+C',
      selector: 'copy:'
    },
    {
      label: 'Paste',
      accelerator: 'Command+V',
      selector: 'paste:'
    },{
      label: 'Enter Fullscreen',
      click: function() { win.setFullScreen(true); }
    }]
  }];
  menu = Menu.buildFromTemplate(menu_tmpl);
  Menu.setApplicationMenu(menu);
});
