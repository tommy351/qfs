var utils = require('../lib/utils');

describe('Utilities', function(){
  it('isArray()', function(done){
    utils.isArray([]).should.be.true;
    utils.isArray({}).should.not.be.true;
    done();
  });

  it('isObject()', function(done){
    utils.isObject({}).should.be.true;
    utils.isObject('').should.not.be.true;
    done();
  });

  it('isRegExp()', function(done){
    utils.isRegExp(/pattern/).should.be.true;
    utils.isRegExp('').should.not.be.true;
    done();
  });

  it('isFunction()', function(done){
    utils.isFunction(function(){}).should.be.true;
    utils.isFunction('').should.not.be.true;
    done();
  });

  it('isUndefined()', function(done){
    utils.isUndefined(undefined).should.be.true;
    utils.isUndefined('').should.not.be.true;
    done();
  });

  it('toArray()', function(done){
    var arr = utils.toArray(arguments);
    utils.isArray(arr).should.be.true;
    done();
  });

  it('inArray()', function(done){
    var arr = [1, 2, 3];
    utils.inArray(arr, 1).should.equal(0);
    utils.inArray(arr, 4).should.equal(-1);
    utils.inArray(arr, 1, 1).should.equal(-1);
    done();
  });

  it('each()', function(done){
    utils.each([1, 2, 3], function(item, i){
      item.should.equal(i + 1);
    });

    utils.each({a: 1, b: 2, c: 3}, function(value, key, i){
      (parseInt(key, 16) - 10).should.equal(i);
      value.should.equal(i + 1);
    });

    done();
  });

  it('merge()', function(done){
    var arr1 = [1, 2],
      arr2 = [3, 4],
      arr = utils.merge(arr1, arr2);

    arr.should.eql(arr1.concat(arr2));

    done();
  });

  it('map()', function(done){
    var arr = utils.map([1, 2, 3], function(item, i){
      item.should.equal(i + 1);
      return item * 3;
    });

    arr.should.eql([3, 6, 9]);

    var obj = utils.map({a: 1, b: 2, c: 3}, function(value, key, i){
      (parseInt(key, 16) - 10).should.equal(i);
      return value * 3;
    });

    obj.should.eql({a: 3, b: 6, c: 9});

    done();
  });

  it('unique()', function(done){
    utils.unique([1, 1, 3, 4, 9, 4]).should.eql([1, 3, 4, 9]);

    done();
  });

  it('inverse()', function(done){
    utils.inverse([1, 2, 3, 4, 5], [1, 4]).should.eql([2, 3, 5]);

    utils.inverse({a: 1, b: 2, c: 3}, {a: 1}).should.eql({b: 2, c: 3});

    done();
  });
});