var fs = require('fs'),
  pathFn = require('path'),
  async = require('async'),
  utils = require('./utils'),
  sep = pathFn.sep;

// If Node version under v0.8, port path.exists to fs.exists
if (fs.exists === undefined){
  fs.exists = pathFn.exists;
  fs.existsSync = pathFn.existsSync;
}

module.exports = qfs;

function qfs(){
  return new qfs.fn.init(arguments);
};

function Item(path){
  path = pathFn.normalize(path);
  this.path = path;
  this.name = pathFn.basename(path);
  this.dir = pathFn.dirname(path);
  this.ext = pathFn.extname(path);
};

qfs.fn = qfs.prototype = {
  length: 0,
  init: function(args){
    var arr = [],
      _this = this;

    args = utils.toArray(args);

    // No argument
    if (!args.length){
      return this;
    // Multiple arguments
    } else if (args.length > 1){
      var path = pathFn.join.apply(null, args);
      arr.push(path);
    // One argument
    } else {
      var obj = args.shift();

      // Invalid arguments
      if (!obj){
        return this;
      } else {
        // object is array
        if (utils.isArray(obj)){
          arr = obj;
        // qfs object
        } else if (obj instanceof Item){
          this.length = 1;
          this[0] = obj;
          return this;
        // path string
        } else {
          arr.push(obj);
        }
      }
    }

    this.length = arr.length;
    utils.each(arr, function(item, i){
      _this[i] = new Item(item);
    });

    return this;
  }
};

qfs.fn.init.prototype = qfs.fn;

qfs.fn.eq = function(i){
  i = +i;
  return i < 0 ? qfs(this[this.length + i]) : qfs(this[i]);
};

qfs.fn.first = function(){
  return this.eq(0);
};

qfs.fn.last = function(){
  return this.eq(-1);
};

qfs.fn.slice = function(start, end){
  return qfs([].slice.apply(this.toArray(), arguments));
};

qfs.fn.toArray = function(){
  var arr = [];

  this.each(function(){
    arr.push(this.path());
  });

  return arr;
};

utils.each(['path', 'name', 'dir', 'ext'], function(item){
  qfs.fn[item] = function(){
    return this[0][item];
  };
});

qfs.fn.each = function(callback){
  for (var i=0; i<this.length; i++){
    var _callback = callback.call(this.eq(i), i);
    // Skip current loop if callback return true, otherwise stop the loop
    if (utils.isUndefined(callback)){
      if (_callback){
        continue;
      } else {
        break;
      }
    }
  }

  return this;
};

qfs.fn.map = function(callback){
  var _this = this;

  this.each(function(i){
    _this[i] = callback.call(this, i);
  });

  return this;
};

var filter = function(iterator){
  var arr = [];

  if (utils.isRegExp(iterator)){
    this.each(function(){
      var path = this.path();

      if (path.match(iterator)){
        arr.push(path);
      }
    });
  } else if (utils.isFunction(iterator)){
    this.each(function(i){
      var callback = iterator.call(this, i);
      if (callback){
        arr.push(this.path());
      }
    });
  } else {
    var identity = iterator.substring(0, 1);

    if (identity === '.'){
      this.each(function(){
        if (this.ext() === iterator){
          arr.push(this.path());
        }
      });
    } else {
      this.each(function(){
        if (this.name() === iterator){
          arr.push(this.path());
        }
      });
    }
  }

  return arr;
};

qfs.fn.filter = function(iterator){
  return qfs(filter.call(this, iterator));
};

qfs.fn.not = function(iterator){
  return qfs(utils.inverse(this.toArray(), filter.call(this, iterator)));
};

utils.each(['stat', 'fstat', 'lstat', 'exists'], function(item){
  qfs.fn[item] = function(callback){
    if (utils.isFunction(callback)){
      fs[item](this.path(), callback.bind(this));
    } else {
      return fs[item + 'Sync'](this.path());
    }
  };
});

qfs.fn.parent = function(){
  var arr = [];

  this.each(function(){
    arr.push(this.dir());
  });

  return qfs(utils.unique(arr));
};

qfs.fn.parents = function(){
  var arr = [];

  this.each(function(){
    var dirs = this.dir().split(sep),
      i = dirs.length,
      parents = [];

    while (i){
      var dir = dirs.join(sep);
      parents.push(dir ? dir : sep);
      dirs.pop();
      i--;
    }

    arr = utils.merge(arr, parents);
  });

  return qfs(utils.unique(arr));
};

qfs.fn.parentsUntil = function(name){
  var arr = [];

  this.each(function(){
    var dirs = this.dir().split(sep),
      i = dirs.length,
      parents = [];

    while (i){
      var dir = dirs.join(sep);
      parents.push(dir ? dir : sep);

      if (dirs[i - 1] === name){
        break;
      }

      dirs.pop();
      i--;
    }

    arr = utils.merge(arr, parents);
  });

  return qfs(utils.unique(arr));
};

utils.each({
  children: [
    function(selector, callback){
      if (utils.isFunction(selector)){
        callback = selector;
        selector = null;
      }

      var _this = this,
        fn = [];

      this.each(function(){
        var path = this.path();

        fn.push(function(next){
          fs.readdir(path, function(err, files){
            if (err) return callback(err);
            var arr = utils.map(files, function(item){
              return path + sep + item;
            });
            next(null, arr);
          });
        });
      });

      async.parallel(fn, function(err, results){
        if (err) return callback(err);
        var arr = qfs(utils.merge.apply(null, results));
        callback(_this, arr);
      });

      return this;
    },
    function(selector){
      var arr = [];

      this.each(function(){
        var path = this.path();

        arr = utils.merge(arr, utils.map(fs.readdirSync(path), function(item){
          return path + sep + item;
        }));
      });

      return qfs(arr);
    }
  ],
  mkdir: [
    function(name, callback){
      var fn = [];

      this.each(function(){
        var _this = this,
          parent = this.parent();

        fn.push(function(next){
          parent.exists(function(exist){
            if (exist){
              fs.mkdir(_this.path() + sep + name, next);
            } else {
              this.parent().mkdir(this.name(), function(){
                fs.mkdir(_this.path() + sep + name, next);
              });
            }
          });
        });
      });

      async.parallel(fn, callback.bind(this));

      return this;
    },
    function(name){
      this.each(function(){
        var parent = this.parent();

        if (!parent.exists()){
          parent.parent().mkdir(parent.name());
        }

        fs.mkdirSync(this.path() + sep + name);
      });

      return this;
    }
  ],
  rename: [
    function(name, callback){
      var arr = [],
        fn = [];

      this.each(function(){
        var _this = this;

        fn.push(function(next){
          fs.rename(_this.dir() + sep + name, next);
        });
      });

      async.parallel(fn, callback.bind(qfs(arr)));

      return this;
    },
    function(name){
      var arr = [];

      this.each(function(){
        var path = this.dir() + sep + name;
        fs.renameSync(path);
        arr.push(path);
      });

      return qfs(arr);
    }
  ],
  remove: [
    function(callback){
      var fn = [];

      this.each(function(){
        var path = this.path();
        fn.push(function(next){
          this.stat(function(err, stat){
            if (err) return callback(err);
            if (stat.isFile()){
              fs.unlink(path, next);
            } else {
              this.empty(function(){
                fs.rmdir(path, next);
              });
            }
          });
        });
      });

      async.parallel(fn, callback.bind(this));

      return this;
    },
    function(){
      this.each(function(){
        var stat = this.stat();
        if (stat.isFile()){
          fs.unlinkSync(this.path());
        } else {
          this.empty();
          fs.rmdirSync(this.path());
        }
      });

      return this;
    }
  ],
  empty: [
    function(callback){

    },
    function(){

    }
  ],
  write: [
    function(data, callback){

    },
    function(data){

    }
  ],
  read: [
    function(encoding, callback){
      if (utils.isFunction(encoding)){
        callback = encoding;
        encoding = 'utf8';
      }

      this.stat(function(err, stat){
        if (err) return callback(err);
        if (stat.isFile()){
          fs.readFile(this.path(), encoding, callback.bind(this));
          return this;
        } else {
          return this.children(callback);
        }
      })
    },
    function(encoding){
      if (utils.isUndefined(encoding)){
        encoding = 'utf8';
      }

      var stat = this.stat();

      if (stat.isFile()){
        return fs.readFileSync(this.path(), encoding);
      } else {
        return this.children();
      }
    }
  ],
  append: [
    function(data, callback){
      var fn = [];

      this.each(function(){
        var _this = this;

        fn.push(function(next){
          var stat = _this.stat();

          if (stat.isFile()){
            if (_this.exists()){
              fs.appendFile(this.path(), data, next);
            } else {
              _this.write(data, next);
            }
          } else {
            var newFile = qfs(this.path() + sep + data);
            newFile.write('', next);
          }
        });
      });

      async.parallel(fn, callback);

      return this;
    },
    function(data){
      this.each(function(){
        var stat = this.stat();

        if (stat.isFile()){
          if (this.exists()){
            fs.appendFileSync(this.path(), data);
          } else {
            this.write(data);
          }
        } else {
          var newFile = qfs(this.path() + sep + data);
          newFile.write('');
        }
      });

      return this;
    }
  ],
  content: [
    function(data, callback){
      if (utils.isFunction(data)){
        callback = data;
        data = null;
      }

      // read data
      if (utils.isUndefined(data)){
        this.read(callback);
      // write data
      } else {
        this.write(data, callback);
      }

      return this;
    },
    function(data){
      // read data
      if (utils.isUndefined(data)){
        return this.read();
      // write data
      } else {
        this.write(data);
        return this;
      }
    }
  ]
}, function(value, key){
  qfs.fn[key] = function(){
    var args = utils.toArray(arguments),
      callback = args[args.length - 1];

    // async
    if (utils.isFunction(callback)){
      return value[0].apply(this, args);
    // sync
    } else {
      return value[1].apply(this, args);
    }
  };
});

utils.each(['chmod', 'fchmod', 'lchmod', 'chown', 'fchown', 'lchown'], function(item){
  qfs.fn[item] = function(){
    var args = utils.toArray(arguments),
      callback = args[args.length - 1];

    // async
    if (utils.isFunction(callback)){
      var fn = [];

      this.each(function(){
        var path = this.path();

        fn.push(function(next){
          fs[item].apply(null, args.unshift(path));
        });
      });

      async.parallel(fn, callback);
    // sync
    } else {
      this.each(function(){
        fs[item + 'Sync'].apply(null, args.unshift(this.path()));
      });
    }

    return this;
  };
});