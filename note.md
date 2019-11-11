## 执行原理
`npm run test`的执行步骤：    
+ 从package.json文件中读取scripts对象里面的全部配置
+ 以传给npm run的第一个参数为键(`test`)，获取对应的value值作为将要执行的命令，没找打的话直接报错;
+ 在系统默认的shell中执行上述命令 **npm命令钩子pre&post**
    - 检查scripts对象中是否存在`pretest`命令，如果有的话先执行该命令
    - 检查是否有`test`命令，有的话执行，没有的话报错
    - 检查是否有`posttest`命令，有的话执行
+ 自动在环境变量PATH中注入./node_modules/.bin目录下的命令，这样可以使这些命令在脚本中直接使用，不必要使用完整的路径，在结束之后再清除掉


## 执行机制
### 串行
command 1 && command 2 && command 3

### 并行
command 1 & command 2 & command 3

并行执行，只负责触发多条命令，而不管结果的收集

在并行的命令集后面加上 `& wait`，可以使用`ctrl + c`结束后台进程

### 第三方执行机制解决方案
串行执行：      
`npm-run-all command1 command2 ...` 
并行执行：     
`npm-run-all --parallel command1 command2 ...`

## 传递参数
### shell命令传递参数   
通过`--`传递参数，这种传递参数是在命令注册的时候直接写在命令里的 
```bash
...
scripts: {
    "test": "eslint *.js --fix"
}
...
```
### npm script命令传递参数
通过`-- --fix`传递参数，这种是在npm script脚本执行的时候动态传递到实际执行的命令中的
```bash
npm run test -- --fix
```
这样`--fix`将会传递到`test`对应的命令中

## 日志输出控制
针对的是npm script脚本，在`npm run script`的时候传递的，用来控制命令输出的时候日志输出的粒度
`--loglevel verbose` `--verbose` `-d` 标示细粒度的输出       
`--loglevel silent` `--silent` `-s` 标示静默输出，只报错

不加任何参数，是常用的，可以看到执行的命令以及执行的结果

## 环境变量
### 预定义变量
npm预定义了变量，可以通过`npm run env`查看完整的变量列表      
其中包含了`package.json`里面的所有信息

#### 使用方式
1. 在注册scripts命令的时候，可以直接在命令里以类似`$npm_package_name`的形式直接使用，符合`shell`里面的语法
2. 在node环境下，这些变量挂载在`process.env`下，可以在js文件内以该对象的属性形式调用

### 自定义变量
自定义变量注册在`package.json`中的`config`字段下      
因此可以通过`$npm_package_config_xx`来访问

## 跨平台兼容
### 文件系统操作的跨平台
bash平台（linux、mac）等与widnows平台的shell命令兼容，    
主要设计文件目录的创建、移动、拷贝、删除等      
可以借助第三方库来实现

### 变量引用的跨平台
linux下引用变量，可以直接按照上述的`$npm_package_xx`的形式，但是在window下是不行的，必须使用`%npm_package_xx%`的形式，     
可以使用`cross-var`实现跨平台的变量引用

```js
    "scripts": {
        "test": "cross-var opn http://localhost:$npm_package_config_port",  // 单条命令直接在命令前加上cross-var即可
        "test:all": "cross-var \"command1 && command2\"" // 复合命令需要将整条命令使用双引号包起来，在前面加上cross-var， 注意双引号需要转义符
    }
```

### 环境变量设置的跨平台
在node.js脚本和npm script中使用环境变量，     
可以使用`cross-env`来实现npm script的跨平台兼容 

```js
    "scripts": {
        "test": "NODE_ENV=test mocha tests/"
    }
```


