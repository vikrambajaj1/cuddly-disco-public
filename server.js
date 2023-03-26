const express = require("express");
const {execSync} = require('child_process')
const fetch = (...args)=>import('node-fetch').then(({default: fetch})=> fetch(...args))

const cors = require("cors");
const bodyParser = require('body-parser');
const path = require("path");

const GITHUB_CLIENT_ID = "Iv1.3daff80a821d2674";
const GITHUB_CLIENT_SECRET = "df9df233474bf94de849808958f1731d31acdb81";

const app = express();
const PORT = process.env.PORT || 4000;

app.use(cors());
app.use(bodyParser.json())

app.get('/getAccessToken', async function(req, res){
    console.log(req.query.code);

    const params = `?client_id=${GITHUB_CLIENT_ID}&client_secret=${GITHUB_CLIENT_SECRET}&code=${req.query.code}`

    await fetch(`https://github.com/login/oauth/access_token${params}`,{
        method: 'POST',
        headers: {
            "Accept" : "application/json"
        }
    }).then((response)=>{
        return response.json()
    }).then((data)=>{
        console.log(data);
        res.json(data)
    })
})

app.get("/getUserData", async function(req, res){
    req.get("Authorization");
    await fetch("https://api.github.com/user", {
        method: "GET",
        headers: {
            "Authorization": req.get("Authorization")
        }
    }).then((response)=>{
        return response.json()
    }).then((data)=>{
        console.log(data);
        res.json(data)
    })
})

app.get('/cloneRepo', async function(req, res){
    const {repoName, userName} = req.query;
   console.log(repoName);
    accessToken = req.get('Authorization');
    console.log(accessToken);
await fetch(`https://api.github.com/repos/${userName}/${repoName}`, {
    method: 'GET',
    headers: {
        "Authorization": accessToken
    }
}).then((response)=> {
    return response.json()
}).then((data)=>{
    console.log(accessToken);
    cloneRepo(data.clone_url)
    res.json(data)
})    
})

async function cloneRepo(url){
    console.log(url);
    execSync(`git clone ${url}`, {
        stdio: [0, 1, 2], // we need this so node will print the command output
        cwd: path.cwd, // path to where you want to save the file
      })
}

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
