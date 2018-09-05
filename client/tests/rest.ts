import {ConnectionString} from "./connectionString";
import * as request from "request-promise";

export class Rest {
  public static readonly broadcast = async function (hub:string, target:string, args:string[]) {
    let url = ConnectionString.getPreviewRestUrl(hub);
    await request({
      method: 'POST',
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
  };

  public static readonly sendToUser = async function (hub:string, userId:string, target:string, args:string[]) {
    let url = ConnectionString.getPreviewRestUrl(hub) + '/user/' + userId;
    await request({
      method: 'POST',
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
};