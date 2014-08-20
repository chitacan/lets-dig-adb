# Let's Dig ADB (Android Debug Bridge)

GDG Korea Android Conf 2014 presentation(watch video on [here](http://www.youtube.com/watch?v=BTFuVx2FhtQ)).
Based on [Reveal.js](https://github.com/hakimel/reveal.js/) & [Atom-Shell](https://github.com/atom/atom-shell)

## Run

Download [release](https://github.com/chitacan/lets-dig-adb/releases), run following

* osx : unzip & run `*.app`
* win : unzip & run `atom.exe`

## Demo

This presentation has 2 demo slides. You can see them without leaving presentation. You need to connect real android device or emulator on your machine. If you have neither, [genymotion](http://www.genymotion.com/) will be a neat solution.

### Demo #1 (localabstract)

Install [localabstract-server-demo](https://github.com/chitacan/localabstract-server-demo) on your android device or emulator.
You can send a message to demo application.

### Demo #2 (activitykit)

Connect your android device or emulator, and fire up `adb server`.  Whenever you launch some apps, you can see whole activity stack. :smiley:
If you want see more detail about this project, see [atom-shell-activitykit](https://github.com/chitacan/atom-shell-activitykit) or [activitykit](https://github.com/chitacan/activitykit).

## Trouble Shooting

* On Windows you need `MSVCR120.dll` to run Atom-Shell. If you don't have one, you can download it [here](http://www.microsoft.com/ko-KR/download/details.aspx?id=40784) (must be 32 bit version).

## Development

### Prerequisites

* node.js
* bower
* grunt
* adb

### Hack it !!

Clone this repo and run following commands.

```
$ npm install
$ grunt
```
