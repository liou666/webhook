### 基于webhook的自动化部署服务

> 服务器需要配置git，node，docker环境，并且需要配置ssh密钥

+ webhook配置

   `webhook url`上目前需加上**branch** `params` http://localhost:8000?branch=master

+ 项目启动

    ```shell
        git clone https://github.com/liou666/webhook.git
        cd webhook/web
        node app.js
    ```

+ 项目基础配置

    ```js
    // config/constant.js

    const GIT_PROJECT_NAME="xxx"; //git项目名称
    const GIT_ADDRESS="git@gitlab.gridsum.com:xxx/xxx.git";//git    仓库地址
    const PORT=xxx ;//node服务启动端口
    const GITLABEL_TOKEN="xxx"//webhook的token

    module.exports={
        GIT_PROJECT_NAME,
        GIT_ADDRESS,
        PORT,
        GITLABEL_TOKEN
    }

    ```

    ```js
    // config/index.js

    //branch对应git仓库的分支名，port对应docker容器映射到本地的端口 
    module.exports=[{
        branch:"master",
        port:80
    },
    {
        branch:"test",
        port:81
    }]

    ```





