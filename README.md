<!--
 * @Author: CasualMing
 * @Date: 2020-12-09 18:38:06
 * @LastEditTime: 2022-01-19 17:29:25
 * @Description: 使用说明
-->
## 项目结构
``` 
 |--lib                       # 公共方法
 |--components                # 公共组件
 |--assets                    # 静态资源
 |--index.js                  # 入口文件
 |--packge.json               # 项目配置文件
 |--node_modules              # 第三方依赖
 |--.gitignore                # git忽略的文件列表
 |--nodemon.json              # nodemon配置文件
```

## 本地调试
  + 修改全局npm配置
    - 方法一：输入命令
      ```
      npm config set registry '组件库源地址'
      ```
    - 方法二：修改配置文件，位置在C:\Users\用户名\\.npmrc
      ```
      registry='组件库源地址'
      ```
  + 安装局部的第三方依赖
    ```
    npm install
    ```
  + 安装全局的第三方依赖
    ```
    npm install yalc nodemon -g
    ```
  + 将整个组件包注入到全局，并启用文件监听器
    ```
    npm run link
    ```
  + 在指定的前端项目中
    - 首先，在package.json文件的scripts中添加2个命令
       ```
      "link-ui": "yalc add ming-ui",
      "unlink-ui": "yalc remove ming-ui && npm i ming-ui -S"
      ```
    - 然后，调试本地的包
      ```
      npm run link-ui
      ```
    - 最后，打包上线的时候，必须移除用于调试的包，然后安装线上的包
      ```
      npm run unlink-ui
      ```  

## 发布到仓库中
  + 如果不是首次发布，需要修改组件包的版本号
    - 方法一：直接修改package.json中的version字段
    - 方法二：输入命令，小版本号自动加一
      ```
      npm version patch
      ```
  + 将组件包发布到仓库中
    ```
    npm publish
    ```
  + 在指定的前端项目中，引入组件包
    ```
    npm install ming-ui --save
    ```

