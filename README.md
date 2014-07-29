# Let's Dig ADB (Android Debug Bridge)

GDG Korea Android Conf 2014 presentation.
Based on [Reveal.js](https://github.com/hakimel/reveal.js/) & [Atom-Shell](https://github.com/atom/atom-shell)

## Development Prerequisites

* node.js
* bower
* grunt
* adb

## Run

Clone this repo and run following commands.

```
$ npm install
$ grunt
```

## Demo

This presentation has 2 demo slides. You can show them without leaving them. You need to connect real android device or emulator on your machine. If you have neither, [genymotion](http://www.genymotion.com/) will be a neat solution.

## Demo #1 (localabstract)

Install [localabstract-server-demo](https://github.com/chitacan/localabstract-server-demo) on your android device or emulator.
You can send a message to demo application.

## Demo #2 (activitykit)

Just connect your android device or emulator, and lauch some apps.(It just works!! :smiley:)
If you want see more detail about this, see [atom-shell-activitykit](https://github.com/chitacan/atom-shell-activitykit) or [activitykit](https://github.com/chitacan/activitykit).

## Trouble Shooting

* On Windows you need `MSVCR120.dll` to run Atom-Shell. If you don't have one, you can download it [here](http://www.microsoft.com/ko-KR/download/details.aspx?id=40784) (must be 32 bit version).
