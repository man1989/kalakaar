module.exports = function(){
    return {
        PORT: process.env.APP_PORT || 8080,
        MONGODB_URI: process.env.MONGODB_URI || "mongodb://localhost/kalakaar"
    }
}