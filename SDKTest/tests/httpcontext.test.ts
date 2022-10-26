import { getConnections, startConnections, stopConnections } from "./utils";
import { Constant } from "./constant";

const semver = require("semver");
var sdkVerion = process.env.SDKVersion;
// Skip tests for service SDK before version 1.0.0-preview1-10197
if (semver.gte(sdkVerion, "1.0.0-preview1-10197")) {
  test("HttpRequest.Request.Path is preserved", async () => {
    let path: string;
    const connections = getConnections(1);
    await startConnections(connections);
    path = await connections[0].invoke("getPath");
    expect(path).toBe("/chat");
    await stopConnections(connections);
  });

  test("HttpRequest.Request.QueryString is preserved", async () => {
    let queryString: string;
    const connections = getConnections(
      1,
      Constant.Server.ChatUrl + "?customName=customValue"
    );
    await startConnections(connections);
    queryString = await connections[0].invoke("getQueryString");
    expect(queryString).toContain("&customName=customValue&");
    await stopConnections(connections);
  });
} else {
  test("Fake test", async () => {
    expect(1).toBe(1);
  });
}
