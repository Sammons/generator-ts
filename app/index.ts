import * as Generator from 'yeoman-generator';
import yosay = require('yosay');
import chalk from 'chalk';
import _ = require('lodash');

function copyToDirectory(generator: Generator & { props: any }, outDir: string, files: string[]) {
  for (let l of files) {
    generator.fs.copyTpl(
      generator.templatePath(l),
      generator.destinationPath(outDir, l.replace('root', generator.props.kebabname).replace('.tts', '.ts')),
      generator.props
    );
  }
}

module.exports = class LibraryGenerator extends Generator {
  constructor(args: string | string[], opts: {}) {
    super(args, opts);
  }
  props: { libname: string; importable: string; libdesc: string; pascalname: string; kebabname: string } = null;
  async prompting() {
    this.log(
      yosay(`Welcome to the ${chalk.red('juicy')} typescript library generator!`)
    );
    const prompts = [
      {
        type: 'text',
        name: 'libname',
        message: 'What shall we call this artifact?',
        required: true
      },
      {
        type: 'text',
        name: 'libdesc',
        message: '...and what words do you use to describe its majesty?',
        default: 'Plainly ordinary, and yet pleasingly functional.'
      }
    ];
    const props = await this.prompt(prompts);
    this.props = props as this['props'];
    this.props.importable = _.camelCase(this.props.libname);
    this.props.pascalname = this.props.importable.substr(0, 1).toUpperCase() + this.props.importable.substr(1);
    this.props.kebabname = _.kebabCase(this.props.pascalname);
  }
  writing() {
    this.destinationRoot('.');

    const toplevels = [
      'tsconfig.json',
      'package.json',
      'README.md',
      'LICENSE',
      'tslint.json',
      'wallaby.js',
      '.travis.yml',
      '.gitignore',
      '.gitattributes'
    ];
    copyToDirectory(this, this.props.libname, toplevels);

    const vsCode = [
      'launch.json',
      'tasks.json',
      'settings.json'
    ];
    copyToDirectory(this, `${this.props.libname}/.vscode`, vsCode);
    copyToDirectory(this, `${this.props.libname}/code/src`, ['root.tts']);
    copyToDirectory(this, `${this.props.libname}/code/test`, ['root.test.tts']);
  }
  install() {
    const dest = this.props.libname;
    this.destinationRoot(dest);
    this.installDependencies({
      bower: false,
      npm: true
    });
  }
};