import { feathers } from "@feathersjs/feathers";
import { koa, rest, bodyParser, serveStatic } from "@feathersjs/koa";

import socketio from "@feathersjs/socketio";
import { errorHandler } from "@feathersjs/koa";

interface Message {
  id?: number;
  text: string;
}

class MessageService {
  messages: Message[] = [];
  async find() {
    return this.messages;
  }

  async create(data: Pick<Message, "text">) {
    const message: Message = {
      id: this.messages.length,
      text: data.text,
    };

    this.messages.push(message);

    return message;
  }
}

type ServiceTypes = {
  messages: MessageService;
};

const app = koa<ServiceTypes>(feathers());

// use the current folder for static file hosting
app.use(serveStatic("."));

// register the error handling
app.use(errorHandler());

// parse the JSON request body
app.use(bodyParser());

// register Rest service handler
app.configure(rest());

// configure socket.io in real time apis
app.configure(socketio());

// register our message service
app.use("messages", new MessageService());

// add any new realtime connection to the 'everybody' channel
app.on("connection", (connection: any) =>
  app.channel("everybody").join(connection)
);

// publish all events to the 'everybody' channel
app.publish((_data: any) => app.channel("everybody"));

// start the server
app.listen(3030).then(() => console.log("Feathers server listening: 3030"));

app.service("messages").create({ text: "Hello world from the server" });
