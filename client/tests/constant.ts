export class Constant {
  public static readonly broadcast = 'broadcast';
  public static readonly echo = 'echo';
  public static readonly joinGroup = 'joingroup';
  public static readonly leaveGroup = 'leavegroup';
  public static readonly sendGroup = 'sendgroup';
  public static readonly sendGroups = 'sendgroups';
  public static readonly sendGroupExcept = 'sendgroupexcept';
  public static readonly sendUser = 'senduser';
  public static readonly sendUsers = 'sendusers';
  public static readonly getConnectionId = 'getconnectionid';
  public static readonly port = process.env.PORT || 5000;
  public static url = `http://localhost:${Constant.port}/chat`;
  public static readonly delay = Number(process.env.DELAY || 500);
}