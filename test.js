var async = require('async');


function test(time,callback){
	setTimeout(function(){
		console.log(time)
		callback(null, time-500, 'converted to array');
	}, time);
}


// async.auto({
// 	get_data: function(callback){
// 		console.log('in get_data');
//         test(2000,callback)
//     },
//     make_folder: function(callback){
//     	console.log('in make_folder');
//         // async code to create a directory to store a file in
//         // this is run at the same time as getting the data
//       test(1000,callback)
//     },
//     write_file: ['get_data', 'make_folder', function(callback, results){
//     	console.log('in write_file', JSON.stringify(results));
//         // once there is some data and the directory exists,
//         // write the data to a file in the directory
//         callback(null, 'filename');
//     }],
//     email_link: ['write_file', function(callback, results){
//     	console.log('in email_link', JSON.stringify(results));
//         // once the file is written let's email a link to it...
//         // results.write_file contains the filename returned by write_file.
//         callback(null, {'file':results.write_file, 'email':'user@example.com'});
//     }]
// }, function(err, results) {
// 	console.log('err = ', err);
// 	console.log('results = ', results);
// });

var co = require('co');
var thunkify = require('thunkify');
var co_test = thunkify(test);


// co(function *(){
// 	var a = yield co_test(1000);
// 	var b = yield co_test(3000);
// 	console.log(a)
// })()

// co(function *(){
// 	var a = co_test(3000);
// 	var b = co_test(1000);
// 	var res = yield [a, b];
// 	console.log(res)
// })()



// var q = require('q');

// var test = q.denodeify(test)


// q.fcall(function(){
// 	return test(3000)
// })
// .then(function (value4) {
// 	return test(xsx);
// })
// .then(function (value4) {
// 	return test(1000);
// })
// .catch(function (error) {
// 	// console.log(error)
// })
// .done();

// var retsult = q.all([
// 	test(3000),
// 	test(2000),
// 	test(1000)
// 	]);

// console.log(retsult)

// retsult.then(function(data){
// 	console.log(data)
// })

// var count = 0;

// async.whilst(
//     function () { return count < 5; },
//     function (callback) {
//     	console.log(count)
//         count++;
//         setTimeout(callback, 1000);
//     },
//     function (err) {
//         // 5 seconds have passed
//     }
// );


// var FTPS = require('ftps');
// try{
//     var ftps = new FTPS({
//       host: 'fwind.me', 
//       username: 'leeke', 
//       password: 'ls20080813', 
//       protocol: 'ftp', 

//   });
// }catch(err){
//     console.error(err)
// }

// ftps.put('./test.js', '~/backup/').exec(function(err,data){
//     console.log('test')
//     console.log(data)
// })

var path = require('path');

var filePath = path.join('/home/leeke','~/backup');
console.log(filePath);
