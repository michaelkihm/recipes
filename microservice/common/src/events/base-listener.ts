import { Message, Stan, SubscriptionOptions } from 'node-nats-streaming';
import { Event } from './event.type';


export abstract class Listener<T extends Event> {

    private client: Stan;
    protected ackWait = 5000; //in ms

    abstract subject: T['subject'];
    abstract queueGroupName: string;
    abstract onMessage(data: T['data'], msg: Message): void;
    

    constructor(client: Stan,) {

        this.client = client;
    }

    subscriptionOptions(): SubscriptionOptions {

        return this.client
            .subscriptionOptions()
            .setDeliverAllAvailable()
            .setManualAckMode(true)
            .setAckWait(this.ackWait)
            .setDurableName(this.queueGroupName);
    }

    listen(): void {

        const subscription = this.client.subscribe(
            this.subject,
            this.queueGroupName,
            this.subscriptionOptions()
        );

        subscription.on('message', (msg: Message) => {

            console.log(`Messagee received ${this.subject} / ${this.queueGroupName}`);
            const parsedData = Listener.parseMessage(msg);
            this.onMessage(parsedData, msg);
        });
    }

    static parseMessage(msg: Message): any {
        const data = msg.getData();
        return typeof data === 'string'
            ? JSON.parse(data)
            : JSON.parse(data.toString('utf-8'));
    }
}