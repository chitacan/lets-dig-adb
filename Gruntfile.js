module.exports = function(grunt) {
  require('load-grunt-tasks')(grunt);
  
  var fs   = require('fs')
    , path = require('path')
    , dir  = 'binaries';

  grunt.initConfig({
    'download-atom-shell': {
      version: '0.14.1',
      outputDir: dir
    },
    'shell': {
      'mac': {
        command: dir + '/Atom.app/Contents/MacOS/Atom app'
      },
      'linux': {
        command: 'chmod +x ' + dir + '/atom && ' + dir + '/atom app'
      },
      'win': {
        command: dir + '\\atom.exe app'
      },
      'distMac': {
        command: 'cp -a ' + dir + ' dist && cp -a app/ dist/Atom.app/Contents/Resources/app'
      },
      'distWin': {
        command: 'echo d | xcopy /e /y /k /h ' + dir + ' dist && echo d | xcopy /e /y /k /h app dist\\resources\\app'
      },
      'distLinux': {
        command: 'cp -R ' + dir + ' dist && cp -R app/ dist/resources/app'
      }
    }
  });

  grunt.registerTask('default', [
    'install',
    'run'
  ]);
  
  grunt.registerTask('init', 'initialize project', function() {
    var cwd     = process.cwd()
      , appPath = path.join(cwd, 'app')
      , gitPath = path.join(cwd, '.git')

    if (grunt.file.exists(appPath))
      return;
    
    fs.readdirSync(cwd).forEach(function(file) {
      if (file.charAt(0) !== '_') return;
      
      var src = path.join(cwd, file);
      var dst = path.join(appPath, file.slice(1))
      grunt.file.copy(src, dst);
      grunt.file.delete(src)
    });
    grunt.file.delete(gitPath);
  })
  
  grunt.registerTask('install', [
    'init',
    'download-atom-shell'
  ]);
  
  grunt.registerTask('run', function() {
    if (process.platform === 'darwin')
      grunt.task.run('shell:mac');
    else if (process.platform === 'win32')
      grunt.task.run('shell:win')
    else
      grunt.task.run('shell:linux')
  });
  grunt.registerTask('dist', function() {
    if (process.platform === 'darwin')
      grunt.task.run('shell:distMac');
    else if (process.platform === 'win32')
      grunt.task.run('shell:distWin')
    else
      grunt.task.run('shell:distLinux')
  });
}
