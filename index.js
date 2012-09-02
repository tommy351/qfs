var fs = require('fs'),
  pathFn = require('path'),
  async = require('async');

if (fs.exists === undefined){
  fs.exists = pathFn.exists;
  fs.existsSync = pathFn.existsSync;
}

var _isArray = function(obj){
  return Array.isArray(obj);
};

var _isObject = function(obj){
  return obj === Object(obj);
};

var _isRegExp = function(obj){
  return obj instanceof RegExp;
};

var _isFunction = function(obj){
  return typeof obj === 'function';
};

var _toArray = function(obj){
  return Array.prototype.slice.call(obj);
};

var _each = function(obj, callback){
  if (_isArray(obj)){
    for (var i=0, len=obj.length; i<len; i++){
      var _callback = callback(obj[i], i);
      if (typeof _callback !== 'undefined'){
        if (_callback){
          continue;
        } else {
          break;
        }
      }
    }
  } else if (_isObject(obj)){
    var index = 0;
    for (var i in obj){
      var _callback = callback(obj[i], i, index++);
      if (typeof _callback !== 'undefined'){
        if (_callback){
          continue;
        } else {
          break;
        }
      }
    }
  }
};

module.exports = function(path){
  return new qfs(path);
};

function qfs(path){
  this.path = path;
  this.name = pathFn.basename(path);
  this.dir = pathFn.dirname(path);
  this.ext = pathFn.extname(path);
};

qfs.prototype.stat = function(callback){
  if (typeof callback === 'function'){
    fs.stat(this.path, callback.bind(this));
    return this;
  } else {
    return fs.statSync(this.path);
  }
};

qfs.prototype.exists = function(callback){
  if (typeof callback === 'function'){
    fs.exists(this.path, callback.bind(this));
    return this;
  } else {
    return fs.existsSync(this.path);
  }
};

var fsChildren = function(path, files){
  var arr = [];

  _each(files, function(item){
    arr.push(new qfs(path + '/' + item));
  });

  return arr;
};

qfs.prototype.children = function(){
  var args = _toArray(arguments);

  if (args.length){
    var callback = args.pop();
    if (typeof callback === 'function'){
      if (args.length){
        fs.readdir(this.path + '/' + args.shift(), function(err, files){
          if (err) return callback(err);
          callback(null, fsChildren(this.path, files));
        });
      } else {
        fs.readdir(this.path, function(err, files){
          if (err) return callback(err);
          this.children = fsChildren(this.path, files);
          callback(null, this.children);
        });
      }

      return this;
    } else {
      return new qfs(this.path + '/' + callback);
    }
  } else {
    this.children = fsChildren(this.path, fs.readdirSync(this.path));
    return this.children;
  }
};

qfs.prototype.parent = function(){
  return new qfs(this.dir);
};

qfs.prototype.mkdir = function(name, callback){
  var _this = this;

  if (typeof callback === 'function'){
    var parent = this.parent();
    parent.exists(function(exist){
      if (exist){
        fs.mkdir(_this.path + '/' + name, callback.bind(this));
      } else {
        this.parent().mkdir(this.name, function(){
          fs.mkdir(_this.path + '/' + name, callback.bind(this));
        });
      }
    });
  } else {
    var parent = this.parent();
    if (!parent.exists()){
      parent.parent().mkdir(parent.name);
    }
    fs.mkdirSync(this.path + '/' + name);
  }
  
  return this;
};

qfs.prototype.write = function(data, callback){
  var _this = this;

  if (typeof callback === 'function'){
    var parent = this.parent();
    parent.exists(function(exist){
      if (exist){
        fs.writeFile(_this.path, data, callback.bind(_this));
      } else {
        this.parent().mkdir(this.name, function(){
          fs.writeFile(_this.path, data, callback.bind(_this));
        });
      }
    });
  } else {
    var parent = this.parent();
    if (!parent.exists()){
      parent.parent().mkdir(parent.name);
    }
    fs.writeFileSync(this.path, data);
  }

  return this;
};

qfs.prototype.read = function(callback){
  if (typeof callback === 'function'){
    fs.readFile(this.path, 'utf8', callback.bind(this));
    return this;
  } else {
    return fs.readFileSync(this.path, 'utf8');
  }
};

qfs.prototype.content = function(){
  var args = _toArray(arguments);

  if (args.length){
    var callback = args.pop();

    if (typeof callback === 'function'){
      if (args.length){
        this.write(args.shift(), callback);
      } else {
        this.read(callback);
      }
    } else {
      this.write(callback);
    }

    return this;
  } else {
    return this.read();
  }
};

qfs.prototype.append = function(data, callback){
  if (typeof callback === 'function'){
    this.parent().exists(function(exist){
      if (exist){
        fs.appendFile(this.path, data, callback.bind(this));
      } else {
        this.write(data, callback);
      }
    })
  } else {
    if (this.parent().exists()){
      fs.appendFileSync(this.path, data);
    } else {
      this.write(data);
    }
  }

  return this;
};

qfs.prototype.rename = function(newName, callback){
  if (typeof callback === 'function'){
    fs.rename(this.path, this.dir + '/' + newName, function(){
      this.path = this.dir + '/' + newName;
      this.name = newName;
      this.ext = pathFn.extname(newName);
      callback.bind(this);
    });
  } else {
    fs.renameSync(this.path, this.dir + '/' + newName);
    this.path = this.dir + '/' + newName;
    this.name = newName;
    this.ext = pathFn.extname(newName);
  }

  return this;
};

qfs.prototype.remove = function(callback){
  if (typeof callback === 'function'){
    fs.unlink(this.path, callback.bind(this));
  } else {
    fs.unlinkSync(this.path);
  }

  return this;
};