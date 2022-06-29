const { execSync } = require('child_process');

// trim spaces and strip string vars
const cleanStr = str => str
  .trim()
  // remove wrapper quotes
  .replaceAll(/^"|"$/g, '')
  .replaceAll(/^'|'$/g, '')
  // escape inner quotes
  .replace(/\"/g, '\\\"')
  .replace(/\'/g, "\\\'");

const parseStr = str =>
  str === 'true' || str === 'TRUE'
    ? true
    : str === 'false' || str === 'FALSE'
      ? false
      : isNaN(str)
        ? `'${str}'`.replaceAll(/"/g, '\x22')
        : parseFloat(str);

const addWorkflowEnvVar = v => {
  execSync('echo "${v.name}=' + parseStr(v.value) + '" >> $GITHUB_ENV');
}

const varsStr = process.env.ENV_VARS || '';
const vars = varsStr
  .split('\n')
  .map(variable => variable.trim())
  .filter(variable => variable.indexOf('=') > 0)
  .map(variable => ({
    name: cleanStr(variable.split('=')[0]),
    value: cleanStr(variable.slice(variable.indexOf('=') + 1))
  }));

console.log(vars);
console.log(vars.map(v => [v.name, parseStr(v.value)]));
vars.forEach(addWorkflowEnvVar);
