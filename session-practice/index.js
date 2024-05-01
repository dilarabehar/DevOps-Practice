const express = require('express');
const session = require('express-session');
const redis = require('redis');
const connectRedis = require('connect-redis');
var bodyParser = require('body-parser');
const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
const RedisStore = connectRedis(session);



const redisClient = redis.createClient({
    host: 'redis_container',
    port: 6379
});


redisClient.on('error', function (err) {
    console.log('Could not establish a connection with redis. ' + err);
});
redisClient.on('connect', function (err) {
    console.log('Connected to redis successfully');
});

app.use(session({
    store: new RedisStore({ client: redisClient }),
    secret: 'secret$%^134',
    resave: false,
    saveUninitialized: false,
    cookie: {
        secure: false, 
        httpOnly: false, 
        maxAge: 1000 * 60 * 10 
    }
}));


app.get("/", (req,res)=>{
    res.send("hello world");
});

app.get("/profile", (req,res)=>{
    const session = req.session;
    if(session.username)
    {
        res.send("welcome");
        return;
    }
    res.sendStatus(401);
});

app.post("/login", (req,res)=>{
    const session = req.session;
    const { username, password } = req.body;
    if(username == "dilara"&& password=="1234")
    {
        session.username = username;
        session.password = password;
        res.send("login succesfull");
        return;
    }
    res.send("login failed");
});

app.get("/logout",(req,res)=>{
    req.session.destroy((err)=>{
        if(err)
        {
            res.send("error");
            return;
        }
        res.send("logout successful");
    });
});


app.listen(3000,()=>{
    console.log("server is running on port 3000");
});