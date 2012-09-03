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

##Data

###path()

Get the path of the target.

###name()

Get the name of the target.

###dir()

Get the directory name of the target.

###ext()

Get the extension of the target.

###stat([callback])

Get the status of the target.

###fstat([callback])

Same as `stat`, except that the target is specified by the file descriptor `fd`.

###lstat([callback])

Same as `stat`, except that if the target is a symbolic link, then return the status of link itself.

###exists([callback])

Check whether the target exists or not.

##Query

###children([selector], [callback])

Get the children of the target directory.

###siblings([selector], [callback])

Get the siblings of the target directory.

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

###rename(name, [callback])

Rename the target to `name`.

###remove([callback])

Remove the target.

###empty([callback])

If the target is a **directory**, remove everything in the target.

If the target is a **file**, clear the target.

###write(data, [callback])

Write `data` to the target file.

If the target exists, overwrite the target with `data`, otherwise create a new file with `data`.

###read([callback])

Read the data from the target.

If the target is a **directory**, get the children of the target.

If the target is a **file**, get the content of the target.

###append(data, [callback])

Append `data` to the target file.

If the target is a **directory**, create a new directory named `data` in the target.

If the target is a **file**, append `data` to the target.

###content([data], [callback])

If `data` is defined, write `data` to the target file, otherwise read the data from the target.

###chmod(mode, [callback])

Change the permissions of the target.

###fchmod(mode, [callback])

###lchmod(mode, [callback])

###chown(uid, gid, [callback])

Change the ownership of the target.

###fchown(uid, gid, [callback])

###lchown(uid, gid, [callback])

##Utilities

###toArray()

Transform the target to an array.