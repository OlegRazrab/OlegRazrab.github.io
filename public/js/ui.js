//UI
var panel;
var btnFullScreen;
var btnRestart;
var btnMusic;

function UI() {
    slickUI.add(panel = new SlickUI.Element.Panel(0, 0, 200, 50));

    panel.add(btnFullScreen = new SlickUI.Element.Button(0, 0, 50, 50));
    btnFullScreen.events.onInputUp.add(() => {
        if (game.scale.isFullScreen) {
            game.scale.stopFullScreen();
        } else {
            game.scale.startFullScreen(false);
        }
    });
    btnFullScreen.add(new SlickUI.Element.Text(0, 0, "F")).center();

    panel.add(btnRestart = new SlickUI.Element.Button(50, 0, 50, 50));
    btnRestart.events.onInputUp.add(() => {});
    btnRestart.add(new SlickUI.Element.Text(0, 0, "R")).center();

    panel.add(btnMusic = new SlickUI.Element.Button(100, 0, 50, 50));
    btnMusic.events.onInputUp.add(() => {
        if (musicStarted == false) {
            music.play(); console.log('play')
            musicStarted = true;
        } else {
            music.stop();console.log('stop')
            musicStarted = false;
        }
    });
    btnMusic.add(new SlickUI.Element.Text(0, 0, "M")).center();
}