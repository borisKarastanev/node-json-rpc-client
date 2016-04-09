/**
 * Created by boris on 3/11/16.
 */
'use strict';

const http = require('http');
const rpcClient = require('./rpcClient');

function parseConsoleArgs() {
    var args = process.argv;

    if (args.length === 2) {
        return; // No arguments
    }

    if (args.indexOf('-h') > -1 || args.indexOf('--help') > -1) {
        rpcClient.printHelp();
        process.exit(0);
    }

    if (args.indexOf('-v') > -1 || args.indexOf('--version') > -1) {
        this.printVersion();
        process.exit(0);
    }

    if (args.indexOf('-dh') > -1 || args.indexOf('--destination-host') > -1) {
        rpcClient.assignHost();
    }

    if (args.indexOf('-rm') > -1 || args.indexOf('--rpc-method') > -1) {
        rpcClient.assignRpcMethod();
    }

    if (args.indexOf('-a') > -1 || args.indexOf('--args') > -1) {
        rpcClient.parseRpcArgs();
    }
}
parseConsoleArgs();

function rpcCall(data, rpcOpt) {
    var options = {
        host: rpcOpt.host.hostAddr,
        port: rpcOpt.host.port,
        path: rpcOpt.host.apiPath,
        method: 'POST'
    };
    var rpcReq = http.request(options, function (res) {
        res.setEncoding('utf8');
        res.on('data', function (chunk) {
            console.log('RPC Server response with: ' + chunk);
        });
        res.on('error', function (err) {
            console.error(err);
        });
    });

    rpcReq.end(data);
}

rpcClient.getOptions(function (err, opt) {
    if (err) {
        console.error(err);
    } else {
        var rpcCallSettings = opt;
        var testRpcServer = {
            jsonrpc: "2.0",
            method: rpcCallSettings.method,
            params: rpcCallSettings.rpcArgs,
            id: parseInt(Math.random() * 100000)
        };
        testRpcServer = JSON.stringify(testRpcServer);
        var timer = 0;
        console.time('Benchmark test');
        //var benchmark = setInterval(function () {
        //    var promise = new Promise(function (resolve, reject) {
        //        resolve(++timer);
        //    });
        //
        //    promise.then(function (val) {
        //        rpcCall(testRpcServer, rpcCallSettings);
        //        console.log(val);
        //        if (val === 1000) {
        //            clearInterval(benchmark);
        //            console.timeEnd('Benchmark test');
        //        }
        //    }).catch(function (err) {
        //        console.error(err);
        //    });
        //}, 1000);
        rpcCall(testRpcServer, rpcCallSettings);

    }
});










