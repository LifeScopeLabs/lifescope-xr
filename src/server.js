import path from 'path';
import config from 'config';
import http from "http";
import express from 'express';
import socketIO from "socket.io";
import AWS from 'aws-sdk';

const ICE_SERVERS = config.iceServers;
const LISTEN_PORT = config.listenPort;
const NAF_LISTEN_PORT = config.NAFListenPort;
const BUCKET_NAME = config.ROOM_CONFIG.BUCKET_NAME;
const BUCKET_PATH = config.ROOM_CONFIG.BUCKET_PATH;
const BUCKET_PATH_AVATAR = config.ROOM_CONFIG.BUCKET_PATH_AVATAR;
const bucket_route = config.ROOM_CONFIG.bucket_route;
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
const app = express();
 
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
                if (!['video360', '3d'].includes(room_name)) {
                    gallery_content[room_name].push(result);
                }
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
    app.use(function(req, res, next) {
        res.setHeader("Access-Control-Allow-Origin", "*");
        res.setHeader("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
        next();
      });

    // serve static files
    app.use('/static/', express.static(path.join(__dirname, '../static')));
    app.use(express.static('./dist'));
    app.use('/dist', express.static('./dist'));

    // test content
    app.get('/test/content/', function(req, res) {
        // //debugger;
        res.json(gallery_content);
    });

    // room configuration
    app.get('/roomconfig', function (req, res) {
        res.json(ROOM_CONFIG);
    });

    // avatars
    app.get('/avatars', function (req, res) {
        // console.log(avatars);
        res.json(avatars);
    });

    // start websockets for NAF
    // Start Express http server for NAF
    var NAFapp = express();
    var NAFServer = http.createServer(NAFapp);
    var io = socketIO(NAFServer);
    const rooms = {};

    io.on("connection", socket => {
        console.log("user connected", socket.id);

        let curRoom = null;

        socket.on("joinRoom", data => {
            const { room } = data;

            if (!rooms[room]) {
            rooms[room] = {
                name: room,
                occupants: {},
            };
            }

            const joinedTime = Date.now();
            rooms[room].occupants[socket.id] = joinedTime;
            curRoom = room;

            console.log(`${socket.id} joined room ${room}`);
            socket.join(room);

            socket.emit("connectSuccess", { joinedTime });
            const occupants = rooms[room].occupants;
            io.in(curRoom).emit("occupantsChanged", { occupants });
        });

        socket.on("send", data => {
            io.to(data.to).emit("send", data);
        });

        socket.on("broadcast", data => {
            socket.to(curRoom).broadcast.emit("broadcast", data);
        });

        socket.on("disconnect", () => {
            console.log('disconnected: ', socket.id, curRoom);
            if (rooms[curRoom]) {
            console.log("user disconnected", socket.id);

            delete rooms[curRoom].occupants[socket.id];
            const occupants = rooms[curRoom].occupants;
            socket.to(curRoom).broadcast.emit("occupantsChanged", { occupants });

            if (occupants == {}) {
                console.log("everybody left room");
                delete rooms[curRoom];
            }
            }
        });
    });

    NAFServer.listen(NAF_LISTEN_PORT, function () {
        console.log('NAFServer listening on http://localhost:' + NAF_LISTEN_PORT);
    });

    app.listen(LISTEN_PORT, () => console.log('LIFESCOPE XR config server listening on port:' + LISTEN_PORT));

  })