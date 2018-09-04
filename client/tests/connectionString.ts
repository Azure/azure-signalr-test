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
  public static readonly endpoint = ConnectionString.value.endpoint;
  public static readonly key = ConnectionString.value.accesskey;
  public static readonly getClientUrl = function(hub:string) {
    return `${ConnectionString.endpoint}:5001/client/?hub=${hub}`;
  }
  public static readonly getServerUrl = function(hub:string){
    return  `${ConnectionString.endpoint}:5002/api/v1-preview/hub/${hub}`;
  }
  public static readonly getToken = function(aud:string){
    return nJwt.create({
      "aud": aud,
      "exp": new Date().valueOf() + (24*60*60*1000)
    },ConnectionString.key,"HS256").compact()
  }
}