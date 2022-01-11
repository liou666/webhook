#! /usr/bin/env node
const fs =require('fs') ;
var net = require('net');
const path =require("path")
const {exec,execSync}=require("child_process")
// const exec = util.promisify(require('child_process').exec);
// 检测端口是否被占用
function portIsOccupied (port) {
    let server = net.createServer().listen(port)
    server.on('listening', ()=> { server.close() })
    server.on('error', (err)=> { throw err})
   
}




const GIT_DIR="test-cicd"
const IMAGE_NAME=GIT_DIR+"-image"
const CONTAINER_NAME=GIT_DIR+"-container"

let projectPath=path.resolve(__dirname,`./${GIT_DIR}`);
let buildPath=path.resolve(__dirname);

console.log(__dirname);


process.chdir(buildPath)
console.log(`New directory: ${process.cwd()}`);

if(!fs.existsSync(GIT_DIR)){
    execSync("git clone git@gitlab.gridsum.com:liuxinqi/test-cicd.git");
}else{
    console.log("start git pull----------------")
    execSync("git pull",{cwd:projectPath});
    console.log(" git pull end------------")
}

process.chdir(projectPath)
console.log(`New directory: ${process.cwd()}`);

console.log("npm install------------")
execSync("npm install");
console.log("npm install end------------")

console.log("npm  run build------------")
execSync("npm run build");
console.log("npm  run build end------------")

process.chdir(buildPath)
console.log(`New directory: ${process.cwd()}`);

//删除之前镜像和容器
console.log("docker rm-----------")
execSync(`docker rmi -f ${IMAGE_NAME}`);
execSync(`docker rm -f ${CONTAINER_NAME}`);
console.log("docker rm end------------")

//构建镜像
console.log("docker build-----------")
execSync(`docker build -t ${IMAGE_NAME} .`);
console.log("docker build end------------")

console.log("docker run ------------")
execSync(`docker run -d -p 80:80 --name ${CONTAINER_NAME} ${IMAGE_NAME}`);
console.log("docker run end------------")

//1.pull
//2.build dist
//3.build images



