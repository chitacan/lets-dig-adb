
var net = require('net');

function sendMsg(msg, el, cb) {
  var callback = cb;
  var cmds = [{
    cmd : 'host:transport-any',
    expect : function(res) { return 'OKAY' === res; }
  }, {
    cmd : 'localabstract:chitacan_remote',
    expect : function(res) { return 'OKAY' === res; }
  }, {
    cmd : msg,
    expect : function(res) { return true; }
  }]

  function prefixLen(cmd) {
    var hexlen = cmd.length.toString(16);
    var prefix = ('000'.concat(hexlen)).slice(-4);
    return prefix.concat(cmd);
  }

  function updateResult(res) {
    var status = res.slice(0, 4);
    if (status === 'OKAY') {
      el.innerText = res.slice(8);
    } else {
      el.innerText = status;
    }
  }

  var socket = new net.Socket({
    readable : true,
    writable : true,
    allowHalfOpen : true
  });

  socket.writeData = function() {
    var data = this.cmds.shift();
    if (!data) {
      if (callback) callback.call(this);
      return;
    }

    this.expect = data.expect;
    console.log('sending : ' + prefixLen(data.cmd));
    this.write(prefixLen(data.cmd));
  }

  socket.writeNext = function(res) {
    if (this.expect && this.expect(res))
      this.writeData();
  }

  socket.connect({port: '5037'}, function() {
    this.cmds = cmds;
    this.writeData();
    this.on('data', function(chunk) {
      var res = chunk.toString();
      updateResult(res);
      console.log(res);
      this.writeNext(res);
    });
    this.on('drain', function() {
      console.log('drain');
    });
    this.on('end', function() {
      console.log('FIN');
    });
  });

  socket.writeMsg = function(msg, cb) {
    callback = cb;
    cmds.push({
      cmd : msg,
      expect : function(res) { return true; }
    });
    socket.writeData();
  }

  return {
    write : socket.writeMsg,
    end   : socket.end
  }
}

var sender;
var btn  = document.querySelector('button');
btn.addEventListener('click', function() {
  var input = document.querySelector('#demo-input');
  var msg   = input.value;
  if (!msg.length) return;
  if (sender)
    sender.write(msg);
});

Reveal.addEventListener('slidechanged', function(event) {
  var isDemo = event.currentSlide.id === 'demo-1';
  if (isDemo) {
    var res  = document.querySelector('#result');
    sender = sendMsg('hello', res);
  } else {
    if (sender) sender.end();
  }

});
