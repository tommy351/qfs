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

qfs.fn.filter = function(iterator){
  if (iterator instanceof qfs){

  } else if (utils.isRegExp(iterator)){

  } else if (utils.isFunction(iterator)){

  } else {

  }
};

qfs.fn.not = function(iterator){
  if (iterator instanceof qfs){

  } else if (utils.isRegExp(iterator)){

  } else if (utils.isFunction(iterator)){

  } else {

  }
};

utils.each(['stat', 'exists'], function(item){
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

    },
    function(name){

    }
  ],
  remove: [
    function(callback){
      var fn = [];

      this.each(function(){
        var path = this.path();
        fn.push(function(next){
          fn.unlink(path, next);
        });
      });

      async.parallel(fn, callback.bind(this));

      return this;
    },
    function(){
      this.each(function(){
        fs.unlinkSync(this.path());
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
    function(callback){

    },
    function(){

    }
  ],
  append: [
    function(data, callback){

    },
    function(data){

    }
  ],
  content: [
    function(data, callback){

    },
    function(data){

    }
  ],
  chmod: [
    function(mode, callback){

    },
    function(mode){

    }
  ],
  chown: [
    function(uid, gid, callback){

    },
    function(uid, gid){

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