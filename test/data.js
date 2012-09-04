var fs = require('fs'),
  qfs = require('..'),
  path = require('path'),
  filename = __filename,
  item = qfs(filename);

describe('Data', function(){
  it('path()', function(done){
    item.path().should.equal(filename);

    done();
  });

  it('name()', function(done){
    item.name().should.equal(path.basename(filename));

    done();
  });

  it('dir()', function(done){
    item.dir().should.equal(path.dirname(filename));

    done();
  });

  it('ext()', function(done){
    item.ext().should.equal(path.extname(filename));

    done();
  });

  it('stat()', function(done){
    item.stat().should.be.an.instanceof(fs.Stats);

    done();
  });

  it('stat() - async', function(done){
    item.stat(function(err, stat){
      stat.should.be.an.instanceof(fs.Stats);
    });

    done();
  });

  it('exists()', function(done){
    item.exists().should.be.true;

    done();
  });

  it('exists() - async', function(done){
    item.exists(function(exist){
      exist.should.be.true;
    });

    done();
  });
});