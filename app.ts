import { feathers } from "@feathersjs/feathers";

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

const app = feathers<ServiceTypes>();
app.use("messages", new MessageService());

app.service("messages").on("created", (message: Message) => {
  console.log("A new message has been created", message);
});

const main = async () => {
   await app.service("messages").create({
    text: "Hello feathers",
  });

    
  await app.service("messages").create({
    text: "Hello again",
  });


  const messages = app.service("messages").find();

  console.log("All messages", messages);
};

main();

