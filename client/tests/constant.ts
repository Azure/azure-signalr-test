export class Constant {
  public static readonly broadcast = 'broadcast';
  public static readonly echo = 'echo';
  public static readonly sendOthers = 'sendothers';
  public static readonly joinGroup = 'joingroup';
  public static readonly leaveGroup = 'leavegroup';
  public static readonly sendGroup = 'sendgroup';
  public static readonly sendGroups = 'sendgroups';
  public static readonly sendGroupExcept = 'sendgroupexcept';
  public static readonly sendOthersInGroup = 'sendothersingroup';
  public static readonly sendUser = 'senduser';
  public static readonly sendUsers = 'sendusers';
  public static readonly getConnectionId = 'getconnectionid';

  public static readonly port = parseInt(process.env.PORT) || 80;

  public static readonly Server = function () {
    let port = Constant.port;
    let host = `http://localhost:${port}`;
    return {
      Host: host,
      Port: port,
      ChatUrl: `${host}/chat`,
      ChatJwtUrl: `${host}/chatJwt`,
      JwtLoginUrl: `${host}/Jwt/login`,
    }
  }();

  public static readonly ServerAad = function () {
    let port = parseInt(process.env.PORTAAD) || 81;
    let host = `http://localhost:${port}`;
    return {
      Host: host,
      Port: port,
      ChatUrl: `${host}/chat`,
    }
  }();

  public static readonly delay = Number(process.env.DELAY || 1000);
  public static readonly timeout = Number(process.env.TIMEOUT || 60000); // Timeout for each test
  public static readonly awaitTimeout = Number(process.env.TIMEOUT_AWAIT || 1000); // Timeout for await operation
}