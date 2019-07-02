// todo: implement npm run publish
// cp readme and package.json do dist and make some change
const tool = require('./tool').init();
const fs = require('fs');

const distDir = `${__dirname}/dist`;
const srcDir = __dirname;

fs.copyFileSync(`${srcDir}/README.md`,`${distDir}/README.md`);

const packageStr = fs.readFileSync(`${srcDir}/package.json`, { encoding: 'utf8' });
const packageObj = JSON.parse(packageStr);

delete packageObj.scripts.publish;

fs.writeFileSync(`${distDir}/package.json`, JSON.stringify(packageObj, null, 2));
fs.writeFileSync(`${distDir}/.npmignore`,"demo");
tool.runCMDSync('npm publish',{cwd:distDir});



