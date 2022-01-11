const {URL} =require("url")

const run=require("./run")

const {GITLABEL_TOKEN} =require("../config/constant")


module.exports=async (req,res)=>{
    if(req.headers['x-gitlab-token']!==GITLABEL_TOKEN){
        res.writeHead(500, { 'Content-Type': 'text/plain' });
        return res.end("the serve is only used by gitlab")
    }


  	let {searchParams} = new URL(req.url, `http://${req.headers.host}`)


    run({res,branch:searchParams.get("branch")})

  
    res.end("webhook")
    
}