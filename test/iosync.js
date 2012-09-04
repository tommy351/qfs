var qfs = require('..'),
  path = require('path'),
  dirname = __dirname;

describe('I/O - sync', function(){
  var dir, file;

  it('mkdir()', function(done){
    qfs(dirname).mkdir('testDir');

    done();
  });

  it('rename()', function(done){
    qfs(dirname).children('testDir').rename('test');
    dir = qfs(dirname).children('test');

    done();
  });

  it('append() - dir', function(done){
    dir.append('testFile');
    file = dir.children('testFile');

    done();
  });

  it('write()', function(done){
    file.write('test');

    done();
  });

  it('read()', function(done){
    file.read().should.equal('test');

    done();
  });

  it('content()', function(done){
    file.content().should.equal('test');
    file.content('test2').read().should.equal('test2');

    done();
  });

  it('append() - file', function(done){
    file.append('test').read().should.equal('test2test');

    done();
  });

  it('empty() - file', function(done){
    file.empty();
    file.read().should.equal('');

    done();
  });

  it('empty() - dir', function(done){
    dir.empty();
    dir.children().length.should.equal(0);

    done();
  });

  it('remove()', function(done){
    dir.remove();

    done();
  });
});