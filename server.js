import config from 'config';
import http from "http";
import easyRTC from "easyrtc";
import express from 'express';
import socketIO from "socket.io";


const ICE_SERVERS = config.iceServers;
const LISTEN_PORT = config.listenPort;
const NAF_LISTEN_PORT = 7070;

const server = express();


Promise.resolve()
  .then(async function() {

    global.env = {
        iceServers: ICE_SERVERS
    };

    // serve static files
    server.use(express.static('.'));
    server.use('/static', express.static('static'));
    server.use(express.static('./dist'));
    
    // start websockets for NAF
    // Start Express http server for NAF
    var NAFServer = http.createServer(server);
    var socketServer = socketIO.listen(NAFServer, {"log level":1});

    // start RTC for NAF
    easyRTC.setOption("appIceServers", ICE_SERVERS);
    easyRTC.setOption("logLevel", "debug");
    easyRTC.setOption("demosEnable", false);

    // Overriding the default easyrtcAuth listener, only so we can directly access its callback
    easyRTC.events.on("easyrtcAuth", function(socket, easyrtcid, msg, socketCallback, callback) {
        easyRTC.events.defaultListeners.easyrtcAuth(socket, easyrtcid, msg, socketCallback, function(err, connectionObj){
            if (err || !msg.msgData || !msg.msgData.credential || !connectionObj) {
                callback(err, connectionObj);
                return;
            }

            connectionObj.setField("credential", msg.msgData.credential, {"isShared":false});

            console.log("["+easyrtcid+"] Credential saved!", connectionObj.getFieldValueSync("credential"));

            callback(err, connectionObj);
        });
    });

    // To test, lets print the credential to the console for every room join!
    easyRTC.events.on("roomJoin", function(connectionObj, roomName, roomParameter, callback) {
        console.log("["+connectionObj.getEasyrtcid()+"] Credential retrieved!", connectionObj.getFieldValueSync("credential"));
        easyRTC.events.defaultListeners.roomJoin(connectionObj, roomName, roomParameter, callback);
    });

    // Start EasyRTC server
    var rtc = easyRTC.listen(server, socketServer, null, function(err, rtcRef) {
        console.log("Initiated");

        rtcRef.events.on("roomCreate", function(appObj, creatorConnectionObj, roomName, roomOptions, callback) {
            console.log("roomCreate fired! Trying to create: " + roomName);

            appObj.events.defaultListeners.roomCreate(appObj, creatorConnectionObj, roomName, roomOptions, callback);
        });
    });

    NAFServer.listen(NAF_LISTEN_PORT, function () {
        console.log('NAFServer listening on http://localhost:' + NAF_LISTEN_PORT);
    });

  })