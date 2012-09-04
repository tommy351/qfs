var qfs = require('..'),
  path = require('path'),
  dirname = __dirname,
  filename = __filename;

describe('Query', function(){
  it('children()', function(done){
    qfs(dirname).children().should.be.an.instanceof(qfs);

    done();
  });

  it('children() - async', function(done){
    qfs(dirname).children(function(err, files){
      files.should.be.an.instanceof(qfs);
    });

    done();
  });

  it('siblings()', function(done){
    qfs(filename).siblings().should.be.an.instanceof(qfs);

    done();
  });

  it('siblings() - async', function(done){
    qfs(filename).siblings(function(err, files){
      files.should.be.an.instanceof(qfs);
    });

    done();
  });

  it('parent()', function(done){
    qfs(filename).parent().should.be.an.instanceof(qfs);

    done();
  });

  it('parents()', function(done){
    qfs(filename).parents().should.be.an.instanceof(qfs);

    done();
  });

  it('parentsUntil()', function(done){
    qfs(filename).parentsUntil('qfs').should.be.an.instanceof(qfs);

    done();
  });
});