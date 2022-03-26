class SecurityGroup {
  constructor(name, groupName) {
    this.name = name;
    this.groupName = groupName;
  }
}

export default [
  new SecurityGroup('tldj-rds', 'sg-0de0015ddb203348c'),
  new SecurityGroup('tldj-api, tetrix', 'sg-09a8956dd016ed97b')
];


