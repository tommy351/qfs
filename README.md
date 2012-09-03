#qfs

File I/O in jQuery way.

#Download

<!--

You can download it from NPM:

```
$ npm install qfs
```

or clone the repository from [Github](https://github.com/tommy351/qfs):

-->

```
$ git clone git://github.com/tommy351/qfs.git
```

#Example

```js
// Get the stats synchronously
qfs(path).stat();

// Get the stats asynchronously
qfs(path).stat(function(err, stat){
	// do something
});
```

#Documentaion

##Status

###path()

###name()

###dir()

###ext()

###stat([callback])

###fstat([callback])

###lstat([callback])

###exists([callback])

##Query

###children([selector], [callback])

###siblings([selector], [callback])

###parent()

###parents()

###parentsUntil()

##Filter

###eq(index)

###first()

###last()

###slice(start, [end])

###filter(selector)

###not(selector)

##Traversing

###each(iterator)

###map(iterator)

##I/O

###mkdir(name, [callback])

###rename(name, [callback])

###remove([callback])

###empty([callback])

###write(data, [callback])

###read([callback])

###append(data, [callback])

###content([data], [callback])

###chmod(mode, [callback])

###fchmod(mode, [callback])

###lchmod(mode, [callback])

###chown(uid, gid, [callback])

###fchown(uid, gid, [callback])

###lchown(uid, gid, [callback])

##Utilities

###toArray()