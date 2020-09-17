const io = require('socket.io')();

const { createGameState, gameLoop,getUpdatedvelocity }  = require('./game');
const { FRAME_RATE } = require('./constants');

const state = {};
const clentRooms = {};

io.on('connection',client =>{
  

   client.on('keydown',handleKeydown);
   client.on('newGame',handleNewGame);

   function handleNewGame(){
       let roomName = makeid(5);
       clientRooms[client.id] = roomName;
       client.emit('gameCode',roomName);
       state[roomName] = createGameState()

   }

   function handleKeydown(keyCode){
        try{
            keycode = parseInt(keyCode)
        }catch(e){
            console.error(e);
            return;
        }

        const vel = getUpdatedvelocity(keycode);

        if(vel){
            state.player.vel = vel;
        }

   }

    startGameInterval(client,state);
})


function startGameInterval(client, state)
{
    const intervalId = setInterval(() =>{

        const winner = gameLoop(state);
        if(!winner){
            client.emit('gameState',JSON.stringify(state))
        }else{
            client.emit('gameOver');
            clearInterval(intervalId);;
        }

    },1000 / FRAME_RATE )
}

io.listen(3000);
