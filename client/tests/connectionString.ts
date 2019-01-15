import * as nJwt from "njwt";

function getConnectionString() {
  let connectionString:string = process.env.Azure__SignalR__ConnectionString;
  let pairs = connectionString.split(';');
  let result = {};
  pairs.forEach(pair => {
    let index = pair.indexOf('=');
    if (index > 0){
      result[pair.substring(0, index).toLowerCase()] = pair.substring(index+1);
    }
  });
  return result;
}

export class ConnectionString {
  public static readonly value = getConnectionString();
  // @ts-ignore
  public static readonly endpoint = ConnectionString.value.endpoint;
  // @ts-ignore
  public static readonly key = ConnectionString.value.accesskey;
  public static readonly getClientUrl = function(hub:string) {
    return `${ConnectionString.endpoint}/client/?hub=${hub}`;
  }
  public static readonly getRestUrl = function(hub:string){
    return  `${ConnectionString.endpoint}/api/v1/hubs/${hub}`;
  }
  public static readonly getToken = function(aud:string,userId?:string){
    let claim = {
      "aud": aud,
      "exp": new Date().valueOf() + (24*60*60*1000)
    };
    if (userId) {
      claim['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier'] = userId;
    }
    return nJwt.create(claim,ConnectionString.key,"HS256").compact()
  }
}