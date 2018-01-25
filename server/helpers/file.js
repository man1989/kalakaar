const path = require("path");
const util = require("util");
let {stat, mkdir} = require("fs");
f_stat   = util.promisify(stat);
f_mkdir  = util.promisify(mkdir);

let obtainDirectory = async function(basePath, dirPath){
    let filePath = path.resolve(basePath, dirPath);
    try{
        let stats = await f_stat(filePath);
        if(!stats.isDirectory()){
            throw {
                errorCode:-2
            }
        }
    }
    catch(err){
        // console.error(err);
        await f_mkdir(filePath);
    }
    return filePath;
}

module.exports = {
    obtainDirectory: obtainDirectory
}