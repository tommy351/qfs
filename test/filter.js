var qfs = require('..'),
  dirname = __dirname,
  children = qfs(__dirname).children();

describe('Filter', function(){
  it('eq()', function(done){
    children.eq(0)[0].should.equal(children[0]);

    done();
  });

  it('first()', function(done){
    children.first()[0].should.equal(children[0]);

    done();
  });

  it('last()', function(done){
    children.last()[0].should.equal(children[children.length - 1]);

    done();
  });

  it('slice()', function(done){
    children.slice(0, 1).length.should.equal(1);

    done();
  });

  it('filter()', function(done){
    children.filter('.js').should.be.an.instanceof(qfs);

    done();
  });

  it('not()', function(done){
    children.not('.js').should.be.an.instanceof(qfs);

    done();
  });
});