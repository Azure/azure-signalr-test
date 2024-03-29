import { getConnections, startConnections, stopConnections } from "./utils";
import { Constant } from "./constant";
import * as request from "request-promise";

function AadTokenFactory(): Promise<string> {
  return request(`${Constant.Server.Host}/aad/login`);
}

test("connect to server with aad token", async () => {
  const connections = getConnections(
    1,
    Constant.Server.ChatUrl,
    null,
    AadTokenFactory
  );
  await startConnections(connections);
  await stopConnections(connections);
});
