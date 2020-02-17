// Tyrian -- the new look of gentoo.org
// Alex Legler <a3li@gentoo.org>

'use strict';
module.exports = function(grunt) {
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        less: {
            compile: {
                options: {
                    strictMath: true,
                    paths: ["node_modules"]
                },
                files: {
                    "dist/tyrian.css": "src/less/tyrian.less"
                }
            },
            minify: {
                options: {
                    compress: true,
                    yuicompress: true,
                    optimization: 2
                },
                files: {
                    "dist/tyrian.min.css": "dist/tyrian.css"
                }
            }
        },
        replace: {
            compile: {
                options: {
                    patterns: [
                        {
                            match: /^(.*\r?\n)*\/\* tyrian-start \*\/\r?\n/gm,
                            replacement: ""
                        }
                    ]
                },
                files: [
                    {expand: true, flatten: true, src: ['dist/tyrian.css'], dest: 'dist/'}
                ]
            },
            inject_variables: {
		options: {
	                patterns: [
				{
					match: /@import "variables\.less";$/m,
					replacement: '@import "variables.less"; @import "../../tyrian/bootstrap/variables-tyrian.less";'
				}
			],
			silent: true
		},
                files: [
			{expand: true, flatten: true, src: ['../bootstrap/less/bootstrap.less'], dest: '../bootstrap/less/'}
                ]
            }
        },
        shell: {
            build_bootstrap: {
                command: 'grunt dist',
                options: {
                    stdout: true,
                    execOptions: {
                        cwd: '../bootstrap/'
                    }
                }
            }
        }
    });

    grunt.loadNpmTasks("grunt-contrib-less");
    grunt.loadNpmTasks("grunt-replace-regex");
    grunt.loadNpmTasks("grunt-shell");

    grunt.registerTask("compile", ["less:compile", "replace:compile"]);
    grunt.registerTask("compress", ["less:minify"]);
    grunt.registerTask("bootstrap", ["replace:inject_variables", "shell:build_bootstrap"]);

    grunt.registerTask("dist", ["compile", "compress"]);
    grunt.registerTask("default", ["dist"]);
};

