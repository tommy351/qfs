var qfs = require('..'),
  dirname = __dirname,
  children = qfs(dirname);

describe('Loop', function(){
  it('each()', function(done){
    children.each(function(){
      this.should.be.an.instanceof(qfs);
    });

    done();
  });

  it('map()', function(done){
    children.map(function(){
      this.should.be.an.instanceof(qfs);
    });

    done();
  });
});