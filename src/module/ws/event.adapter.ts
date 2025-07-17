/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-function-type */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
import { INestApplicationContext, WebSocketAdapter } from '@nestjs/common';
import { MessageMappingProperties } from '@nestjs/websockets';
import { EMPTY, filter, fromEvent, mergeMap, Observable } from 'rxjs';
import * as WebSocket from 'ws';

export class EventsAdapter implements WebSocketAdapter {
  constructor(private app: INestApplicationContext) {}
  create(port: number, options: any = {}): any {
    console.log('ws create', port);
    return new WebSocket.Server({ port, ...options });
  }
  bindClientConnect(server, callback: Function) {
    // console.log('server connected:',server)
    server.on('connection', callback);
  }
  bindMessageHandlers(
    client: WebSocket,
    handlers: MessageMappingProperties[],
    process: (data: any) => Observable<any>,
  ) {
    console.log('新的链接进来');
    fromEvent(client, 'message')
      .pipe(
        mergeMap((data) =>
          this.bindMessageHandler(client, data, handlers, process),
        ),
        filter((result) => result),
      )
      .subscribe((response) => client.send(JSON.stringify(response)));
  }
  bindMessageHandler(
    client: WebSocket,
    buffer,
    handlers: MessageMappingProperties[],
    process: (data: any) => Observable<any>,
  ): Observable<any> {
    let message = null;
    try {
      message = JSON.parse(buffer.data);
    } catch (error) {
      console.log('error', error.message);
      return EMPTY;
    }
    // const messageHandler = handlers.find(
    //   (handler) => handler.message === message.event,
    // );
    // if (!messageHandler) {
    //   return EMPTY;
    // }
    return process('message');
  }
  close(server) {
    console.log('close');
    server.close();
  }
}
