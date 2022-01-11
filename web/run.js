#! /usr/bin/env node
const fs =require('fs') ;
const net = require('net');
const path =require("path");
const util=require("util")
const {exec}=require('child_process');
const execPromisify = util.promisify(exec);

const {GIT_PROJECT_NAME,GIT_ADDRESS} =require("../config/constant")
const branchConfig =require("../config")





const shell= async(cmd,options={})=>{
    console.log(`\n--------------------- ${cmd} start ----------------------------`);
    // const {stdout,stderr}= await execPromisify(cmd,options);
    // if(stderr){
    //     console.log("------");
    //     console.log('stderr:', stderr);
    // }else{
    //     console.log('stdout:', stdout);
    // }
    return new Promise((resolve,reject)=>{
      const cp=  exec(cmd,options,(err)=>err?reject(err):resolve())
      cp.stdout.pipe(process.stdout)
      cp.stderr.pipe(process.stderr)
    })
   
}

const updateCode=async(basedir,branch)=>{

    if(!fs.existsSync(`../project/${branch}`)){
        fs.mkdirSync(`../project/${branch}`)
    }

    if(!fs.existsSync(`../project/${branch}/${basedir}`)){
        console.log(path.resolve(__dirname,`../project/${branch}/${basedir}`));
       await shell(`git clone ${GIT_ADDRESS}`,{cwd:path.resolve(__dirname,`../project/${branch}`)});
       await shell(`git checkout ${branch}`,{cwd:path.resolve(__dirname,`../project/${branch}/${basedir}`)});
    }else{
        await shell(`git checkout ${branch}`,{cwd:path.resolve(__dirname,`../project/${branch}/${basedir}`)});
       await shell("git pull",{cwd:path.resolve(__dirname,`../project/${branch}/${basedir}`)});
    }
}

const codeBuild=async()=>{
   await shell("npm install");
   await shell("npm run build");
}

const rmContainerAndImage=async(containerName,imageName)=>{
   await shell(`docker rmi -f ${imageName}`);
   await shell(`docker rm -f ${containerName}`);
}

const imageBuild=async({imageName,projectName,branch})=>{
    await shell(`docker build --build-arg GIT_PROJECT_NAME=${projectName} --build-arg BRANCH=${branch} -t ${imageName} .`);
}

const runContainer=async({containerName,imageName,port})=>{
    await shell(`docker run -d -p ${port}:80 --name ${containerName} ${imageName}`); 
}

// 检测端口是否被占用
function portIsOccupied (port) {
    let server = net.createServer().listen(port)
    server.on('listening', ()=> { server.close() })
    server.on('error', (err)=> { throw err})
}



const initVariable=(gitBaseName,branch,branchConfig)=>{
    const baseDir=`${gitBaseName}-${branch}`
    const imageName=`${baseDir}-image`
    const containerName=`${baseDir}-container`
    const projectPath=path.resolve(__dirname,`../project/${branch}/${gitBaseName}`);
    const buildPath=path.resolve(__dirname,"../");

    const {port} =branchConfig.find(item=>item.branch===branch)

    return {
        baseDir,
        imageName,
        containerName,
        projectPath,
        buildPath,
        port
    }
}



module.exports=async function run({res,branch}){

  

   const {
    imageName,
    containerName,
    projectPath,
    buildPath,
    port
    } =initVariable(GIT_PROJECT_NAME,branch,branchConfig);

    console.log(`\n--------------------- deploy ${branch} start ----------------------------\n`);
    console.time("deploy time")

    await updateCode(GIT_PROJECT_NAME,branch)

    process.chdir(projectPath)
    await codeBuild(imageName)


    process.chdir(buildPath)
    await rmContainerAndImage(containerName,imageName)

    await imageBuild({imageName,projectName:GIT_PROJECT_NAME,branch})

    await runContainer({containerName,imageName,port})

    console.log(`\n--------------------- deploy ${branch} end ----------------------------\n`);
    console.log(`serve is running in ${port} port`);

    console.timeEnd("deploy time")

}