
function getConnectionString() {
  let connectionString = process.env.Azure__SignalR__ConnectionString;
  let pairs = connectionString.split(';');
  let result = {};
  pairs.forEach(pair => {
    let index = pair.indexOf('=');
    if (index > 0){
      console.log(pair.substring(0, index));
      console.log(pair.substring(index+1));
      result[pair.substring(0, index)] = pair.substring(index+1);
    }
  });
  return result;
}

export class ConnectionString {
  public static readonly value = getConnectionString();
  public static readonly clientUrl = `${ConnectionString.value.Endpoint}:5001/client/?hub=serverless`;
  public static readonly serverUrl = `${ConnectionString.value.Endpoint}:5002/api/v1-preview/hub/serverless`;
  public static readonly key = ConnectionString.value.AccessKey;
}