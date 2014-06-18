module.exports = function(grunt) {

    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),

        less: {
            production: {
                options: {
                    paths: ["css"],
                    cleancss: true
                },
                files: {
                    "build/css/global.css": "build/less/style.less"
                }
            }
        },

        cssmin: {
            production: {
                options: {
                    banner: "/* css file @authors Shaun Hare */"
                },
                files: {
                    'css/global.css': [
						        'build/css/global.css',

					]
                }
            }
        },

        concat: {
            production: {
                src: [
					'build/js/global.js'
				],
                dest: 'js/global.js'
            }
        },

		copy: {
			non_compiled_js: {
				files: [
					{expand: true, flatten: true, src: ['build/js/global.js'],
						dest: 'js/', filter: 'isFile'}
				]
			},
      css:{
        files:[
        {expand: true, flatten: true, src: ['build/css/global.css'],
          dest: 'css/', filter: 'isFile'}
        ]
      }
		}
    });

    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-less');
    grunt.loadNpmTasks('grunt-contrib-cssmin');
	grunt.loadNpmTasks('grunt-contrib-copy');

    grunt.registerTask('default', ['less', 'copy', 'cssmin', 'concat']);
}
