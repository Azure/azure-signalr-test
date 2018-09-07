import {ConnectionString} from "./connectionString";
import * as request from "request-promise";

async function sendRequest(url:string, method:string, target:string, args: string[]){
  await request({
    method: method,
    uri: url,
    headers: {
      'Authorization': 'Bearer ' + ConnectionString.getToken(url)
    },
    body: {
      target: target,
      arguments: args
    },
    json: true
  });
}

export class Rest {
  public static readonly broadcast = async function (hub:string, target:string, args:string[]) {
    let url = ConnectionString.getPreviewRestUrl(hub);
    await sendRequest(url, 'POST', target, args);
  };

  public static readonly sendToUser = async function (hub:string, userId:string, target:string, args:string[]) {
    let url = ConnectionString.getPreviewRestUrl(hub) + '/user/' + userId;
    await sendRequest(url, 'POST', target, args);
  }
};