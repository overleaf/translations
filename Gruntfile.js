// TODO: This file was created by bulk-decaffeinate.
// Sanity-check the conversion and remove this comment.
/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/master/docs/suggestions.md
 */
const fs = require("fs");

module.exports = function(grunt) {
	grunt.loadNpmTasks('grunt-contrib-coffee');
	grunt.loadNpmTasks('grunt-contrib-clean');
	grunt.loadNpmTasks('grunt-mocha-test');
	
	grunt.initConfig({


		coffee: {

			app_dir: { 
				expand: true,
				flatten: false,
				cwd: 'app/coffee',
				src: ['**/*.coffee'],
				dest: 'app/js/',
				ext: '.js'
			},
				


			unit_tests: { 
				expand: true,
				flatten: false,
				cwd: 'test/unit/coffee',
				src: ['**/*.coffee'],
				dest: 'test/unit/js/',
				ext: '.js'
			}
		},

	

		mochaTest: {
			unit: {
				src: [`test/unit/js/${grunt.option('feature') || '**'}/*.js`],
				options: {
					reporter: grunt.option('reporter') || 'spec',
					grep: grunt.option("grep")
				}
			}
		}
	});
	


	grunt.registerTask('compile:server', 'Compile the server side coffee script', ['coffee:app_dir']);
	grunt.registerTask('compile:unit_tests', 'Compile the unit tests', ['coffee:unit_tests']);

	return grunt.registerTask('test:unit', 'Run the unit tests (use --grep=<regex> or --feature=<feature> for individual tests)', ['compile:server', 'compile:unit_tests', 'mochaTest:unit']);
};


