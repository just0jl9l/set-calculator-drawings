module.exports = function() {

    var kb = 'kb/set_calculator_drawings/';
    var components = 'sc-web/components/set_calculator/';
    var clientJsDirPath = '../sc-web/client/static/components/js/';
    var clientCssDirPath = '../sc-web/client/static/components/css/';
    var clientHtmlDirPath = '../sc-web/client/static/components/html/';
    var clientImgDirPath = '../sc-web/client/static/components/images/';

    return  {
        concat: {
            setCalculatorcmp: {
                src: [
                    components + 'src/set-calculator-component.js'],
                dest: clientJsDirPath + 'set_calculator/set_calculator.js'
            }
        },
        copy: {
            setCalculatorIMG: {
                cwd: components + 'static/components/images/',
                src: ['*'],
                dest: clientImgDirPath + 'set_calculator/',
                expand: true,
                flatten: true
            },
            setCalculatorCSS: {
                cwd: components + 'static/components/css/',
                src: ['set_calculator.css'],
                dest: clientCssDirPath,
                expand: true,
                flatten: true
            },
            setCalculatorHTML: {
                cwd: components + 'static/components/html/',
                src: ['*.html'],
                dest: clientHtmlDirPath,
                expand: true,
                flatten: true
            },
            kb: {
                cwd: kb,
                src: ['*'],
                dest: '../kb/set_calculator_drawings/',
                expand: true,
                flatten: true
            }
        },
        watch: {
            setcmp: {
                files: components + 'src/**',
                tasks: ['concat:set_calculatorcmp']
            },
            setIMG: {
                files: [components + 'static/components/images/**'],
                tasks: ['copy:set_calculatorIMG']
            },
            setCSS: {
                files: [components + 'static/components/css/**'],
                tasks: ['copy:set_calculatorCSS']
            },
            setHTML: {
                files: [components + 'static/components/html/**',],
                tasks: ['copy:set_calculatorHTML']
            },
            copyKB: {
                files: [kb + '**',],
                tasks: ['copy:kb']
            }
        },
        exec: {
          updateCssAndJs: 'sh add-css-and-js.sh'
        }
    }
};

