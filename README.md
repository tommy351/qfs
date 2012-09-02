#qfs

File I/O in jQuery way.

##Download

You can download it from NPM:

```
$ npm install qfs
```

or clone the repository from [Github](https://github.com/tommy351/qfs):

```
$ git clone git://github.com/tommy351/qfs.git
```

##Example

```js
// Get the stats synchronously
qfs(path).stat();

// Get the stats asynchronously
qfs(path).stat(function(err, stats){
	// do something
});
```

##Documentaion

qfs is partially same with the official file I/O module. Please read the [document](<http://nodejs.org/api/fs.html>) first.

##Contents

###Status

- [stat](#statcallback)
- [exists](#existscallback)

###Query

- [children](#childrenselector-callback)
- [siblings](#siblingsselector-callback)
- [parent](#parent)

###I/O 

- [mkdir](#mkdirname-callback)
- [write](#writedata-callback)
- [read](#readcallback)
- [content](#contentdata-callback)
- [append](#appenddata-callback)
- [rename](#renamename-callback)
- [remove](#removecallback)
- [empty](#emptycallback)

##Status

###stat([callback])

Get status of target.

Reference: <http://nodejs.org/api/fs.html#fs_fs_stat_path_callback>

###exists([callback])

Check if target exists.

Reference: <http://nodejs.org/api/fs.html#fs_fs_exists_path_callback>

##Query

###children([selector], [callback])

Get children of target directory.

Reference: <http://nodejs.org/api/fs.html#fs_fs_readdir_path_callback>

###siblings([selector], [callback])

Get siblings of target.

###parent()

Get parent of target.

##I/O

###mkdir(name, [callback])

Create a new directory in target directory.

Reference: <http://nodejs.org/api/fs.html#fs_fs_mkdir_path_mode_callback>

###write(data, [callback])

Overwrite target file with `data` if exists, otherwise create a new file with `data`.

Reference: <http://nodejs.org/api/fs.html#fs_fs_writefile_filename_data_encoding_callback>

###read([callback])

Read data from target file.

Reference: <http://nodejs.org/api/fs.html#fs_fs_readfile_filename_encoding_callback>

###content([data], [callback])

Write `data` to target file if `data` is defined, otherwise read data from it.

###append(data, [callback])

Append `data` to target file if exists, otherwise create a new file with `data`.

Reference: <http://nodejs.org/api/fs.html#fs_fs_appendfile_filename_data_encoding_utf8_callback>

###rename(name, [callback])

Rename target with `name`.

Reference: <http://nodejs.org/api/fs.html#fs_fs_rename_oldpath_newpath_callback>

###remove([callback])

Remove target.

Reference: <http://nodejs.org/api/fs.html#fs_fs_unlink_path_callback>

###empty([callback])

Clear everything from target directory.