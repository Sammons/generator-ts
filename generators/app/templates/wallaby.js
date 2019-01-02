module.exports = (/*wallaby*/) => {
  return {
    "files": [
      "code/src/**/*.ts*",
    ],
    "tests": [
      "code/test/**/*.test.ts*"
    ],
    "env": {
      "type": "node"
    }
  }
}