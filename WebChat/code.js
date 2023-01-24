var MYAPP = {

    db_msg: [],  //SE GUARDARAN TODOS LOS MENSAJES DELA ROOM
    db_rms: [], //SE GUARDARAN TODAS LAS ROOMS (FINALMENTE SOLO PUEDE EXISTIR UNA ROOM)
    login: true, //BOOL PARA CONTROLAR SI NOS ENCONTRAMOS EN LA ZONA DE LOGIN
    image: [],
    profilePicture: null, //DEFINICION DE LA IMAGEN DE PERFIL
    server: null,
    currentRoom: null,
    user:{
        username: null,
        user_id: null
    },

    db_users: [], //SE GURADAN TODOS LOS USERID DE LA ROOM

    init: function()
    {
        //LOG IN
        var loginButton = MYAPP.Q("button#b-login");
        var loginSection = MYAPP.Q("section#login");
        MYAPP.image = document.querySelectorAll("img.profile-picture");
    
        //CHAT
        var input = MYAPP.Q("input#user-message");
        var elem = MYAPP.Q("button#send-message");

        //SILLY CLIENT
        MYAPP.server = new SillyClient();
        MYAPP.server.on_user_connected = MYAPP.onServerUserConnected;
        MYAPP.server.on_user_disconnected = MYAPP.onServerUserDisconnected;
        MYAPP.server.on_message = MYAPP.onServerUserMessage;
        MYAPP.server.on_room_info = MYAPP.onServerRoomInfo;

        loginButton.addEventListener("click", MYAPP.enterChat);
        loginSection.addEventListener("keydown", MYAPP.onKeyDown);
        elem.addEventListener("click", MYAPP.sendMessage);
        input.addEventListener("keydown", MYAPP.onKeyDown);
        input.addEventListener("keydown", MYAPP.opacityButton);

        for(let i=0; i<MYAPP.image.length; i++)
        {
            MYAPP.image[i].addEventListener("click", function setProfilePicture() {
                    MYAPP.profilePicture = MYAPP.image[i];
                },);
        }
    },

    Q: function(type){
        return document.querySelector(type);
    },

    C: function(type){
        return document.createElement(type);
    },

    //DOS GETTERS HERRAMIENTA, QUE NO DEVUELVEN NI USERNAME NI ROOM PERO DEVUELVEN LOS p DE HTML PARA PODER EDITARLOS
    getUsername: function(){
        return MYAPP.Q("p#user-description");
    },

    getRoom:function(){
        return MYAPP.Q("p#room-name");
    },

    enterChat: function(){ //FUNCION PARA PASAR DE LA SECCION DE LOG IN AL CHAT Y CONECTARSE AL SERVER
        var username = MYAPP.getUsername();
        var roomname = MYAPP.getRoom();

        var inputUsername = MYAPP.Q("input#input-name");
        var inputRoom = MYAPP.Q("input#input-room");

        var loginSection = MYAPP.Q("section#login");
        var main = MYAPP.Q("div#main");

        var img = MYAPP.Q("img#receiver-image");

        if(MYAPP.isEmpty(inputRoom.value)){  //VALOR DEFAULT DE ROOMNAME 
            roomname.innerText = "JarJarBinks_ClubDeFans";
            MYAPP.currentRoom = "JarJarBinks_ClubDeFans";
            img.src = "img/jarjar.png";
        }
        else{
            roomname.innerText = inputRoom.value;
            MYAPP.currentRoom = inputRoom.value;
            img.src = "img/chat.png"
        }

        

        if(MYAPP.profilePicture != null){  //SI NO SE ESCOGE PROFILE PICTURE NO ENTRAMOS
            if(!MYAPP.isEmpty(inputUsername.value)){  //SI NO HAY UN USERNAME NO ENTRAMOS
                //SET PHOTO
                var divPhoto = MYAPP.Q("div#user-photo");
                var userPhoto = MYAPP.C("img");
                userPhoto.id = "user-image";
                userPhoto.className = "image";
                userPhoto.src = MYAPP.profilePicture.src;
                divPhoto.appendChild(userPhoto);  

                //SET USERNAME
                username.innerText = inputUsername.value;
                MYAPP.user.username = inputUsername.value;

                loginSection.remove();

                MYAPP.createRoom(roomname.innerText);
                MYAPP.showRooms();
                //CONNECT TO SERVER
                MYAPP.server.connect( "wss://ecv-etic.upf.edu/node/9000/ws", MYAPP.currentRoom);
                MYAPP.server.on_ready = MYAPP.onServerReady;

                setTimeout(function(){
                    main.style.visibility = "visible";
                    MYAPP.login = false;
                }, 500);
                }
        }  
    },

    updateRoomLog: function(newMsg){  //FUNCION PARA ACTUALIZAR EL ULTIMO MENSAJE QUE APARECE EN EL HISTORIAL DE ROOM
        var room = MYAPP.Q("div#" + MYAPP.currentRoom);
        var p = MYAPP.C("p");
        var roomDivOld = MYAPP.Q("div.room");
        var roomDiv = MYAPP.C("div");

        roomDiv.className = "room";

        var b = MYAPP.C("b");
        var p = MYAPP.C("p");
        
        b.innerText = MYAPP.currentRoom;
        p.innerText ="\n" + newMsg.content;
        roomDiv.appendChild(b);
        roomDiv.appendChild(p);
        roomDivOld.replaceWith(roomDiv); //REMPLAZAMOS EL VIEJO MENSAJE POR EL NUEVO
    },

    showRooms: function(){
        for(var i = 0; i < MYAPP.db_rms.length; i++){  //FUNCION GENERALIZADA PARA MOSTRAR LAS ROOMS EN EL HISTORIAL DE ROOMS, AL FINAL SOLO SE PUEDE TENER UNA ROOM PERO SERVIRIA PARA MAS
            var roomname = MYAPP.db_rms[i].name; 
            var history = MYAPP.Q("div#message-history");

            var nChat = MYAPP.C("div");
            var room = MYAPP.C("div");
            var img = MYAPP.C("img");
            var p = MYAPP.C("b");

            img.className = "image";
            nChat.className = "n-chat";
            room.className = "room";
            nChat.id = roomname;

            if(MYAPP.currentRoom == "JarJarBinks_ClubDeFans")
                img.src = "img/jarjar.png";
            else
                img.src = "img/chat.png"; //IMAGEN GENERICA PARA TODOS LOS GRUPOS SI NO ES LA DEFAULT ROOM

            p.innerText = MYAPP.currentRoom;

            nChat.appendChild(img);
            room.appendChild(p);
            nChat.appendChild(room);
            history.appendChild(nChat);
        }
    },

    showMessage: function(msg){ //FUNCION PARA MOSTRAR LOS MENSAJES, YA SEA ENVIADOS O RECIBIDOS. DE USUARIOS PERO TAMBIEN DEL SISTEMA.
        var p = MYAPP.C("p");
        var b = MYAPP.C("b");
        var div = MYAPP.C("div");
        var log = MYAPP.Q("div#chat-zone");
        var sendButton = MYAPP.Q("button#send-message");
        var chat = MYAPP.Q("div#chat-zone");


        if(msg.type == "text"){
            var img = MYAPP.C("img");
            img.className = "chat-img";
            img.src = msg.image;
            
            if(msg.username != MYAPP.user.username)
                div.className ="msg-received";
            else
                div.className ="msg-sent";
            b.innerText = msg.username + ":\t";
            p.innerText = msg.content;

            div.appendChild(img);
            div.appendChild(b);
            div.appendChild(p);
            log.appendChild(div);

            MYAPP.updateRoomLog(msg);
        
            sendButton.style.opacity = "0.4";
        }

        if(msg.type == "sys"){
            p.innerText = msg.content;
            div.className = "sys-msg";

            div.appendChild(p);
            log.appendChild(div);
        }
        chat.scrollTop = 10000;          
    },

    sendMessage: function(){ //FUNCION PARA ENVIAR EL MENSAJE. CREAMOS EL MENSAJE Y LO ENVIAMOS AL SERVER
        var input = MYAPP.Q("input#user-message");
        
        if(MYAPP.isEmpty(input.value)) //SOLO LO HACEMOS SI EL VALOR DEL INPUT NO ES VACIO, ASI NO ENVIAMOS MENSAJES VACIOS
            return;
        
        var msg = MYAPP.createMessage("text", input.value, MYAPP.user.username, MYAPP.currentRoom, MYAPP.profilePicture.src);

        
        MYAPP.showMessage(msg);
        
        var newMsg = JSON.stringify(msg);
        MYAPP.server.sendMessage(newMsg);      
        
        input.value = "";
    },

    createMessage: function(typ, txt, user, room, src){ //FUNCION PARA CREAR MENSAJES
        var msg = {
            type: typ,
            content: txt,
            username: user,
            roomname: room,
            image: src,
        }
        MYAPP.db_msg.push(msg); //UNA VEZ CREADOS LOS METEMOS EN EL HISTORIAL O DATABASE DE MENSAJES
        return msg;
    },

    createRoom: function(name){ //FUNCION PARA CREAR ROOMS
        var rms = {
            name: name,
        }
        MYAPP.db_rms.push(rms); 
        return rms;
    },

    onServerReady: function(user_id){ //LO QUE HACEMOS CUANDO NOS CONECTAMOS A LA ROOM
        MYAPP.user.user_id = user_id; 
        var sysMsg = "";
        //MENSAJE PERSONALIZADO PARA LA ROOM DEFAULT, GENERICO PARA LAS OTRAS
        if(MYAPP.currentRoom == "JarJarBinks_ClubDeFans")
            sysMsg = MYAPP.createMessage("sys", "Connected! Meesa welcome "+ MYAPP.user.username + " to the room. Your user id is: " + MYAPP.user.user_id, "system", MYAPP.currentRoom);
        else
            sysMsg = MYAPP.createMessage("sys", "Connected! Welcome to the room " + MYAPP.user.username + ". Your user id is: " + MYAPP.user.user_id, "system", MYAPP.currentRoom)
            MYAPP.showMessage(sysMsg);
    },

    onServerUserConnected: function(user_id){ //CUANDO SE CONECTA ALGUIEN NUEVO A LA ROOM.
        var sysMsg = MYAPP.createMessage("sys", "Someone new in the chat. User id: " + user_id, "system", MYAPP.currentRoom);
        console.log(MYAPP.currentRoom);
        MYAPP.showMessage(sysMsg);
        MYAPP.db_users.push(user_id);

        //PARA ENVIAR HISTORIAL DE MENSAJES SI ERES EL LOWER ID
        var intID = MYAPP.db_users.map(function(x){
            return parseInt(x,10);
        })
        var minId = Math.min(...intID);
        console.log(minId);
        if(MYAPP.user.user_id == minId)
        {
            for(let i = 0; i<MYAPP.db_msg.length; i++){
                if(MYAPP.db_msg[i].type != "sys"){
                    var msg = JSON.stringify(MYAPP.db_msg[i]);                    
                    MYAPP.server.sendMessage(msg, [user_id]); //ES IMPORTANTE QUE SOLO QUEREMOS ENVIAR EL MENSAJE AL ULTIMO USER EN CONECTARSE
                }
            }
        }
    },

    onServerUserDisconnected: function(user_id){ //CUANDO ALGUIEN SE VA DE LA ROOM
        var sysMsg = MYAPP.createMessage("sys", "Someone left the chat. User id: " + user_id);
        MYAPP.showMessage(sysMsg);

        var index = MYAPP.db_users.indexOf(Number(user_id));
        MYAPP.db_users.splice(index, 1); //ELIMINAMOS EL USER DE LA DATABASE PARA EL CORRECTO FUNCIONAMIENTO DE ENVIAR EL HISTORIAL DE MENSAJES
    },

    onServerUserMessage: function(user_id, msg){ //CUANDO ALGUIEN ENVIA UN MENSAJE
        var newMsg = JSON.parse(msg);

        MYAPP.db_msg.push(newMsg);
        MYAPP.showMessage(newMsg);
    },

    onServerRoomInfo: function(){ //FUNCION PARA SABER LOS USERS QUE HAY EN LA ROOM CUANDO NOS CONECTAMOS
        MYAPP.db_users = Object.keys(MYAPP.server.clients).map(Number);
    },

    onKeyDown: function(event){ //CUANDO TENEMOS UN EVENTLISTENER CON KEYDOWN
        if(event.code == "Enter"){
            if(MYAPP.login)
                MYAPP.enterChat();
            else
               MYAPP.sendMessage();
        }
    },
    
    isEmpty: function(text) { //FUNCION PARA DETECTAR SI TEXTO ES VACIO O SOLO ESPACIOS
        return !text.trim().length;
    },

    opacityButton: function(event){ //FUNCION PARA CANVIAR LA OPACIDAD DEL BUTTON
        var sendButton = MYAPP.Q("button#send-message");
        sendButton.style.opacity = "1.0";
    },
    
};


