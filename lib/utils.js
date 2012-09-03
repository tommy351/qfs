var isArray = exports.isArray = function(obj){
  return Array.isArray(obj);
};

var isObject = exports.isObject = function(obj){
  return obj === Object(obj);
};

var isRegExp = exports.isRegExp = function(obj){
  return obj instanceof RegExp;
};

var isFunction = exports.isFunction = function(obj){
  return typeof obj === 'function';
};

var isUndefined = exports.isUndefined = function(obj){
  return typeof obj === 'undefined';
};

var toArray = exports.toArray = function(obj){
  return Array.prototype.slice.call(obj);
};

var inArray = exports.inArray = function(arr, obj, index){
  if (isUndefined(index)){
    for (var i=0, len=arr.length; i<len; i++){
      if (arr[i] === obj){
        return i;
      }
    }

    return -1;
  } else {
    return (arr[index] === obj ? index : -1);
  }
};

var each = exports.each = function(obj, callback){
  if (isArray(obj)){
    for (var i=0, len=obj.length; i<len; i++){
      var _callback = callback(obj[i], i);
      if (!isUndefined(_callback)){
        if (_callback){
          continue;
        } else {
          break;
        }
      }
    }
  } else if (isObject(obj)){
    var index = 0;
    for (var i in obj){
      var _callback = callback(obj[i], i, index++);
      if (!isUndefined(_callback)){
        if (_callback){
          continue;
        } else {
          break;
        }
      }
    }
  }
};

var merge = exports.merge = function(){
  var args = toArray(arguments),
    arr = [];

  return arr.concat.apply(arr, args);
};

var map = exports.map = function(obj, iterator){
  if (isArray(obj)){
    var result = [];
  } else {
    var result = {};
  }

  each(obj, function(value, key){
    result[key] = iterator.apply(null, arguments);
  });

  return result;
};

var unique = exports.unique = function(arr){
  var result = [];

  each(arr, function(item){
    if (inArray(result, item) === -1){
      result.push(item);
    }
  });

  return result;
};