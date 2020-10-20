export class Constant {

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

  public static readonly delay = Number(process.env.DELAY || 1000);
  public static readonly timeout = Number(process.env.TIMEOUT || 60000); // Timeout for each test
  public static readonly awaitTimeout = Number(process.env.TIMEOUT_AWAIT || 1000); // Timeout for await operation
}