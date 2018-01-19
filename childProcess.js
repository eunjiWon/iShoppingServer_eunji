var PythonShell = require('python-shell');
var options = {
	args: ['--graph=tf_files/retrained_graph.pb', '--image=tf_files/flower_photos/roses/2414954629_3708a1a04d.jpg'],	 scriptPath: '/opt/tensorflow-for-poets-2/scripts'
};
PythonShell.run('label_image.py', options, function (err, res) {
	if (err) {console.log("err is  " + err);}
  console.log(res);
});
