module.exports = function(grunt) {
 

 
	grunt.registerTask('foo', 'A sample task that logs stuff.', function(arg1, arg2) {
		  if (arguments.length === 0) {
			grunt.log.writeln(this.name + ", no args");
		  } else {
			grunt.log.writeln(this.name + ", " + arg1 + " " + arg2);
		  }
	});
	grunt.registerTask('az', 'My "default" task description.', function() {
		grunt.log.writeln('Currently running the "default" task.');
		grunt.log.writeln('Currently running the "default" task.');
		grunt.log.writeln('Currently running the "default" task.');
	});
	grunt.registerTask('bar', 'My "foo" task.', function() {
		  // Enqueue "bar" and "baz" tasks, to run after "foo" finishes, in-order.
		  grunt.task.run('foo', 'az');
		  // Or:
		 // grunt.task.run(['foo', 'az']);
	});
	
};