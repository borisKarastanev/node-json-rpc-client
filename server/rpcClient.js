/**
 * Created by boris on 3/11/16.
 */

var rpcClient = {
    args: process.argv,
    options: {}
};

rpcClient.getOptions = function (callback) {
    if (!this.options) {
        callback(new Error('No options available'));
    } else {
        callback(null, this.options);
    }
};

rpcClient.printHelp = function () {
    var buff = '\nNode JSON RPC Client help\n' +
            '===================\n' +
            '-v | --version  : print the program version.\n' +
            '-h | --help  : print this help.\n';

    console.log(buff);
};

rpcClient.printVersion = function () {
    var buff = '\nNode JSON RPC Client Version\n' + 'Read Config file version';
    console.log(buff);
};

rpcClient._stripArgs = function (argument) {
    var tmp = this.args.join();
    tmp = tmp.replace(/,/g, ' ');
    var match = tmp.match(argument);
    match = match.toString().split(' ');
    if (match.indexOf('-dh') > -1){
        match = match.toString().split('http').toString().split(':').toString().split('/').toString().replace(',,,', '').split(',');
        match.splice(0,2);

        var destAddr = match.splice(0,2);
        var apiPath = match.join('/');
        apiPath = '/' + apiPath;

        var hostOpt = {
            hostAddr: destAddr[0],
            port: destAddr[1],
            apiPath: apiPath
        };
        return hostOpt
    } else {
        return match[1];
    }

};

//rpcClient.assignPort = function () {
//    var validPort = new RegExp(/-p\s[0-9]+|--port\s[0-9]+/g);
//    this.options.port = this._stripArgs(validPort);
//};

rpcClient.assignHost = function () {
    var validHost = new RegExp(/-dh\shttp:\/+.+|https:\/+.+|--destination-host\shttp:\/+.+|https:\/+.+/g);
    this.options.host = this._stripArgs(validHost);
};

rpcClient.assignRpcMethod = function () {
    var validmethod = new RegExp(/-rm\s[A-Za-z0-9]+|--rpc-method\s[A-Za-z0-9]+/g);
    this.options.method = this._stripArgs(validmethod);

};

rpcClient.parseRpcArgs = function () {
    var rpcArgs = [];
    var tmp = this.args.join();
    tmp = tmp.replace(/,/g, ' ');
    var validArgsList = new RegExp(/-a\s\[[A-Za-z0-9,|\s,|,\s]+\]|--args\s\[[A-Za-z0-9,|\s,|,\s]+\]/g);
    var match = tmp.match(validArgsList);
    match = match.toString().replace('[', '').replace(']', '').split(' ');
    match.shift();
    // Will remove values: undefined, null, 0, false, NaN and "" (empty string)
    for (var i = 0; i < match.length; i++) {
        if (match[i]) {
            rpcArgs.push(match[i]);
        }
    }
    this.options.rpcArgs = rpcArgs;
    console.log('RPC ARGS', this.options.rpcArgs);

};


module.exports = rpcClient;