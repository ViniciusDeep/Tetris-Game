//Case, controller to move tetris, with WASD or seta, using ascii table

document.body.onkeydown = function( e ) {
    var keys = {
        37: 'left',
        39: 'right',
        40: 'down',
        38: 'rotate',
        65: 'esquerda',
        68: 'direita',
        83: 'baixo',
        87: 'rodar' //funciona com wasd e setar

    };
    if ( typeof keys[ e.keyCode ] != 'undefined' ) {
        keyPress( keys[ e.keyCode ] );
        render();
    }
};
