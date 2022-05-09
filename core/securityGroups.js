class SecurityGroup {
  constructor(name, groupName) {
    this.name = name;
    this.groupName = groupName;
  }
}

export default [
  new SecurityGroup('tldj-rds', 'sg-0de0015ddb203348c'),
  new SecurityGroup('clubtetrix', 'sg-03c81c22d5e32edf5')
];


