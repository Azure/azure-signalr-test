import * as signalR from "@aspnet/signalr";
import {LogLevel} from "@aspnet/signalr";

test('connect to server', async () => {
  const connection = new signalR.HubConnectionBuilder()
    .withUrl('http://localhost:5001/chat', {
      logger: LogLevel.Trace
    })
    .build();
  const testMsg = "Test Message";

  connection.on("send", data => {
    expect(data).toBe(testMsg);
  });

  await connection.start()
    .catch(err => expect(err).toBeNull());

});

test('test echo', async () => {
  const connection = new signalR.HubConnectionBuilder()
    .withUrl('/chat')
    .build();
  const testMsg = "Test Message";

  connection.on("send", data => {
    expect(data).toBe(testMsg);
  });

  await connection.start()
    .then(() => connection.invoke('send', 'connection1', testMsg))
    .catch(err => expect(err).toBeNull());
});