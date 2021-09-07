const YAML = require('yaml')
const fs = require('fs')
const path = require('path')

function getFileName () {
  return 'config.yml'
}

function readConfigFile () {
  // cwd for actions and in local are different. For actions it refers to the root folder while locally it refers
  // to the place where the project is (as we execute it from there). To fix this we execute the folder
  // depending where config.json exists
  if (fs.existsSync(`${process.cwd()}/${getFileName()}`)) {
    return YAML.parse(fs.readFileSync(`${process.cwd()}/${getFileName()}`, 'utf8'))
  }
  return YAML.parse(fs.readFileSync(path.join(process.cwd(), './admin-support-cli', `/${getFileName()}`), 'utf8'))
}

module.exports = () => readConfigFile()
