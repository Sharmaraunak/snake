module.exports = {
    makeId
}


function makeId(length){
    let result = '';
    let characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let charactersLength = length;

    for(let i = 0; i< charactersLength; i++){
        result += characters.charAt(Math.random() * charactersLength);
    }

    return result;

}