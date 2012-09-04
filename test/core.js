var qfs = require('..');

describe('Core', function(){
  it('init()', function(done){
    qfs(__dirname).should.be.an.instanceof(qfs);
    qfs(__dirname + '..').should.be.an.instanceof(qfs);
    qfs([__dirname]).should.be.an.instanceof(qfs);

    done();
  });
});