import * as signalR from "@aspnet/signalr";

test('connect to server', () => {
  const connection = new signalR.HubConnectionBuilder()
    .withUrl('/chat')
    .build();
  const testMsg = "Test Message";

  connection.on("send", data => {
    expect(data).toBe(testMsg);
  });

  connection.start()
    .then(() => connection.invoke("send", testMsg));
});
