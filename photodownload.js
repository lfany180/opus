const  request = require("request");
const fs = require("fs");
const path = require("path");

getImg("波多野结衣",1000);

function getImg (word,num) {
    /*判断输入参数的类型*/
    if(typeof word !== "string" || typeof num !== "number" || num <= 0)return;

    /*建立目录*/
    fs.readdir(
        /*查看目录内容*/
        path.join(__dirname,"/img"),
        (err,data)=>{
            if (err) return;
            /*判断是否已经存在图片的文件夹*/
            if (data.indexOf(word) === -1){
                /*图片文件夹不存在，新建图片文件夹*/
                fs.mkdir("./img/"+word,()=>{
                    init();
                })
            }else {
                init();
            }
        }
    );

    /*初始化开始运行*/
    function init() {
        /*要调用多少次req函数*/
        let times = Math.ceil(num / 60);
        for (let i = 0;i < times;i++){
            /*设置参数*/
            req(
                word,
                i*60,
                Math.min(60,num-i*60)
            );
        }
    }

    /*请求操作的封装*/
    function req (word,pn,rn) {
        /*拼接网址，搜索关键字转码*/
        request.get(
            "https://image.baidu.com/search/acjson?tn=resultjson_com&ipn=rj&word="+encodeURI(word)+"&pn="+pn+"&rn="+rn,
            (err,res,body)=> {
                if (err) {
                    console.log(err);
                    return;
                }
                /*通过正则匹配出图片路径*/
                let data = body.match(/https.+?\.jpg/g);
                /*去除重复路径*/
                data = [...new Set(data)];
                /*遍历访问*/
                data.forEach(url => {
                    /*创建随机数名字*/
                    let str = (new Date().getTime() + Math.floor(Math.random() * 9999)).toString(16);
                    request.get(url)
                        .pipe(fs.createWriteStream("./img/" + word + "/" + str + ".jpg"));
                });
            }
        );
    }
}

