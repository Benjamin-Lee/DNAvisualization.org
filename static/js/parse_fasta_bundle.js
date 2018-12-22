(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class FastaObj {
    constructor() {
        this.name = "";
        this.sequence = "";
        this.id = 1;
    }
}
class Fasta {
    // private _instance:IFasta<T>;
    // public getInstance():IFasta<T>{
    // return this._instance;
    // }
    parse(text) {
        var obj = new FastaObj();
        if (!text || text.length === 0)
            return [];
        var arr = text.split("\n");
        var seq = new Array();
        //get the object for parsing.....
        var name1;
        for (var line of arr) {
            if (line[0] === '>' || line[0] === ';') {
                if (obj.sequence != "") {
                    seq.push({ id: obj.id, name: obj.name, sequence: obj.sequence });
                    obj.sequence = "";
                    obj.name = "";
                }
                obj.name = line.slice(1);
            }
            else {
                // if(obj.sequence===undefined){
                // obj.sequence=line;}
                obj.sequence += line;
            }
        }
        seq.push(obj);
        return seq;
    }
    write(obj) {
        var fastafile = "";
        for (var ob = 0; ob < obj.length; ob++) {
            ;
            fastafile += ">" + obj[ob].name + "\n";
            fastafile += this.splitNchar(obj[ob].sequence, 80).join("\n");
            if (ob != obj.length - 1)
                fastafile += "\n";
        }
        return fastafile;
    }
    // public setOptions(opt:T){
    //     obj.name=opt.name;
    //     this.obj.sequence=opt.sequence;
    //     // this.obj.id= opt.id;
    // }
    splitNchar(str, num) {
        var i, _ref;
        num = num || 80;
        var result = [];
        for (i = 0, _ref = str.length - 1; i <= _ref; i += num) {
            result.push(str.substr(i, num));
        }
        return result;
    }
}
exports.Fasta = Fasta;
module.exports.fasta = new Fasta();

},{}],2:[function(require,module,exports){
"use strict";
/**
 * Created by shdba on 10/24/17.
 */
module.exports.Fasta = require("./FastaUtil");

},{"./FastaUtil":1}],3:[function(require,module,exports){
var fastautil = require('fastautil');
window.parse_fasta = fastautil.Fasta.fasta.parse;
},{"fastautil":2}]},{},[3]);
