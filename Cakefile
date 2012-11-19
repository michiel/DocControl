# build script adapted from ShareJ

{exec} = require 'child_process'

task 'build', 'Build the .js files', (options) ->
	console.log('Compiling Coffee from coffee to source')
	exec "coffee --compile --output source/ coffee/", (err, stdout, stderr) ->
		throw err if err
		console.log stdout + stderr
	console.log('Compiling Coffee from spec to SpecRunner')
	exec "coffee --compile --bare --output SpecRunner/ spec/", (err, stdout, stderr) ->
		throw err if err
		console.log stdout + stderr
	

task 'watch', 'Watch coffee directory and build the .js files', (options) ->
	console.log('Watching Coffee in coffee and compiling to source')
	cp = exec "coffee --watch --output source/ coffee/"
	cp.stdout.on "data", (data) -> console.log(data)
	cp.stderr.on "data", (data) -> console.log(data)