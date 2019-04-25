import path from 'path';
import config from 'config';
import http from "http";
import easyRTC from "easyrtc";
import express from 'express';
import socketIO from "socket.io";
import AWS from 'aws-sdk';

const ICE_SERVERS = config.iceServers;
const LISTEN_PORT = config.listenPort;
const NAF_LISTEN_PORT = config.NAFListenPort;
const bucket_route = config.ROOM_CONFIG.bucket_route;
const BUCKET_NAME = config.ROOM_CONFIG.BUCKET_NAME;
const BUCKET_PATH = config.ROOM_CONFIG.BUCKET_PATH;
const BUCKET_PATH_AVATAR = config.ROOM_CONFIG.BUCKET_PATH_AVATAR;
const ROOM_CONFIG = config.ROOM_CONFIG;


const AWSAccessKeyId = config.AWSCred.AWSAccessKeyId;
const AWSSecretKey = config.AWSCred.AWSSecretKey;


const AWSConfig = {
    "accessKeyId": AWSAccessKeyId,
    "secretAccessKey": AWSSecretKey,
    "region": 'us-east-1'
};


var gallery_content = {};
var avatars = [];
const server = express();
 
// Set aws config
AWS.config.update(AWSConfig);

// Create the parameters for calling createBucket
var bucketParams = {
   Bucket : BUCKET_NAME
};                    
                             
var s3 = new AWS.S3({apiVersion: '2006-03-01'});

const contentTypes = {
    'gltf': '3d',
    'jpg': 'image',
    'jpeg': 'image',
    'png': 'image',
    'mp4': 'video',
    'obj': '3d',
    'webm': 'video',
    'webp': 'image'
};

s3.listObjects(bucketParams, function(err, data) {
    if (err) {console.log(err, err.stack);}
    else {
        //debugger;

        for (var content of data.Contents) {
            var room_name = "";
            var re = /\/([0-9a-zA-Z\-_,\s]+)\.(.*)/i;

            // gallery_content
            if (content.Key.startsWith(BUCKET_PATH) && !content.Key.endsWith('/')) {
                room_name = content.Key.slice(BUCKET_PATH.length).split('/')[0];

                if (!gallery_content[room_name]) {
                    gallery_content[room_name] = [];
                }

                var result = {
                    id: content.Key.match(re)[1].replace(new RegExp(' ', 'g'), '-'),
                    route: content.Key,
                    name: content.Key.match(re)[1].replace(new RegExp('-', 'g'), ' '),
                    ext: content.Key.match(re)[2],
                    type: contentTypes[content.Key.match(re)[2]]
                };
                // console.log(result);
                gallery_content[room_name].push(result);
            }
            // avatars
            else if (content.Key.startsWith(BUCKET_PATH_AVATAR) && content.Key.endsWith('.gltf')) {
                // console.log(content.Key);
                var avatar_name = content.Key.slice(BUCKET_PATH_AVATAR.length).split('/')[0];
                // console.log(avatar_name);

                var result = {
                    src: bucket_route + '/' + BUCKET_NAME  + '/' + content.Key,
                    name: avatar_name
                }
                avatars.push(result);
            }
        }
    }
});


Promise.resolve()
  .then(async function() {

    global.env = {
        iceServers: ICE_SERVERS
    };

    // CORS
    server.use(function(req, res, next) {
        res.setHeader("Access-Control-Allow-Origin", "*");
        res.setHeader("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
        next();
      });

    // serve static files
    server.use('/static/', express.static(path.join(__dirname, '../static')));
    server.use(express.static('./dist'));
    server.use('/dist', express.static('./dist'));

    // test content
    server.get('/test/content/', function(req, res) {
        // //debugger;
        res.json(gallery_content);
    });

    // room configuration
    server.get('/roomconfig', function (req, res) {
        res.json(ROOM_CONFIG);
    });

    // avatars
    server.get('/avatars', function (req, res) {
        // console.log("server.get/avatars");
        // console.log(avatars);
        res.json(avatars);
    });

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

    server.listen(LISTEN_PORT, () => console.log('LIFESCOPE XR config server listening on port:' + LISTEN_PORT));

  })