#qfs

File I/O in jQuery way.

#Install

You can download it from NPM:

```
$ npm install qfs
```

or clone the repository from [Github](https://github.com/tommy351/qfs):

```
$ git clone git://github.com/tommy351/qfs.git
```

#Test

```
make test
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

##Core

###qfs(path, […])

`path` can be a path, or an array with multiple paths.

When pass multiple arguments, qfs will join them automatically.

Example:

```js

qfs('/foo/bar');

qfs(['/foo', '/bar']);

qfs('/foo/bar', 'baz');
```

##Data

###path()

Get the path of the target.

Example:

```js
qfs('/foo/bar').path();
// Return '/foo/bar'

qfs('/foo/bar/baz/..').path();
// Return '/foo/bar'
```

###name()

Get the name of the target.

Example:

```js
qfs('/foo/bar').name();
// Return 'bar'

qfs('/foo/bar/baz.js').name();
// Return 'baz.js'
```

###dir()

Get the directory name of the target.

Example:

```js
qfs('/foo/bar').dir();
// Return '/foo'
```

###ext()

Get the extension of the target.

```js
qfs('/foo/bar/baz.js').ext();
// Return '.js'
```

###stat([callback])

Get the status of the target.

`callback` gets two arguments `(err, stats)`. 

Reference: [Class: fs.Stats](http://nodejs.org/api/fs.html#fs_class_fs_stats)

###fstat([callback])

Same as `stat`, except that the target is specified by the file descriptor `fd`.

###lstat([callback])

Same as `stat`, except that if the target is a symbolic link, then return to the link itself.

###exists([callback])

Check whether the target exists or not.

`callback` gets one argument `(exist)`.

##Query

###children([selector], [callback])

Get the children of the target directory.

`selector` can be a regular expression, function or a string.

`callback` gets two arguments `(err, files)`.

###siblings([selector], [callback])

Get the siblings of the target directory.

`selector` can be a regular expression, function or a string.

`callback` gets two arguments `(err, files)`.

###parent()

Get the parent of the target.

###parents()

Get the ancestors of the target, up to the root directory.

###parentsUntil(name)

Get the ancestors of the target, up to but not including the directory matched by the `name`.

##Filter

###eq(index)

Get the specified index of the target.

`index` can be a negative integer, counting backwards from last.

###first()

Get the first element of the target.

###last()

Get the last element of the target.

###slice(start, [end])

Get the elements of a specified range from the target.

`start` and `end` can be a negative integer, counting backwards from last.

###filter(selector)

Get the elements matched `selector` from the target.

`selector` can be a regular expression, function or a string.

Example:

```js
// Regular expression
qfs(path).children().filter(/pattern/)

// Function
qfs(path).children().filter(function(i){
  return this.ext() === '.txt';
});

// String
qfs(path).children().filter('.txt');
qfs(path).children().filter('test.txt');
```

###not(selector)

Remove the elements matched `selector` from the target.

An inverse function of `filter`.

##Loop

###each(iterator)

Iterate over the target.

###map(iterator)

Produce a new object with return values.

##I/O

###mkdir(name, [callback])

Create a directory named `name` in the target directory.

No arguments other than a possible exception are given to the completion callback.

###rename(name, [callback])

Rename the target to `name`.

No arguments other than a possible exception are given to the completion callback.

###remove([callback])

Remove the target.

No arguments other than a possible exception are given to the completion callback.

###empty([callback])

If the target is a **directory**, remove everything in the target.

If the target is a **file**, clear the target.

No arguments other than a possible exception are given to the completion callback.

###write(data, [callback])

Write `data` to the target file.

If the target exists, overwrite the target with `data`, otherwise create a new file with `data`.

`callback` gets one argument `(err)`.

###read([callback])

Read the data from the target.

If the target is a **directory**, get the children of the target.

If the target is a **file**, get the content of the target.

`callback` gets two arguments `(err, data)`.

###append(data, [callback])

Append `data` to the target file.

If the target is a **directory**, create a new directory named `data` in the target.

If the target is a **file**, append `data` to the target.

`callback` gets one argument `(err)`.

###content([data], [callback])

If `data` is defined, write `data` to the target file, otherwise read the data from the target.

`callback` get two arguments `(err, data)` when reading, one argument `(err)` when writing.

###chmod(mode, [callback])

Change the permissions of the target.

No arguments other than a possible exception are given to the completion callback.

###fchmod(mode, [callback])

Same as `chmod`, except that the target is specified by the file descriptor `fd`.

###lchmod(mode, [callback])

Same as `chmod`, except that the target is a symbolic link, then return to the link itself.

###chown(uid, gid, [callback])

Change the ownership of the target.

No arguments other than a possible exception are given to the completion callback.

###fchown(uid, gid, [callback])

Same as `chown`, except that the target is specified by the file descriptor `fd`.

###lchown(uid, gid, [callback])

Same as `chown`, except that the target is a symbolic link, then return to the link itself.

##Utilities

###toArray()

Transform the target to an array.