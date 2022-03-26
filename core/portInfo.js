class Port {
  constructor(port, name) {
    this.port = port;
    this.name = name;
  }
}


export default [
  new Port(3306, 'mysql'),
  new Port(80, 'HTTP'),
  new Port(443, 'HTTPS'),
  new Port(3000, 'Front-test'),
  new Port(4000, 'Front-test2'),
  new Port(8080, 'Tomcat-default'),
  new Port(22, 'SSH'),
  new Port(21, 'FTP'),
  new Port(25, 'SMTP'),
  new Port(110, 'POP3'),
];

