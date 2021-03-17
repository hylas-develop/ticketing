import mongoose from 'mongoose';
import { TicketCreatedEvent } from '@highbredticket/common';
import { natsWrapper } from '../../../nats-wrapper';
import { TicketCreatedListener } from '../ticket-created-listener';
import { Message } from 'node-nats-streaming';
import { Ticket } from '../../../models/ticket';

const setup = async () => {
	// create an instance for listener
	const listener = new TicketCreatedListener(natsWrapper.client);
	// create a fake data event
	const data: TicketCreatedEvent['data'] = {
		version: 0,
		id: new mongoose.Types.ObjectId().toHexString(),
		title: 'concert',
		price: 20,
		userId: new mongoose.Types.ObjectId().toHexString()
	};
	// create fake message object
	// @ts-ignore
	const msg: Message = {
		ack: jest.fn()
	};

	return { listener, data, msg };
};

it('creates and save a ticket', async () => {
	const { listener, data, msg } = await setup();
	// call the onMessage function with the data object + message object
	await listener.onMessage(data, msg);
	// write assertions to make sure a ticket was created!
	const ticket = await Ticket.findById(data.id);
	expect(ticket).not.toBeNull();
	expect(ticket!.title).toEqual(data.title);
	expect(ticket!.price).toEqual(data.price);
});

it('ack the message', async () => {
	const { listener, data, msg } = await setup();
	// call the onMessage function with the data object + message object
	await listener.onMessage(data, msg);
	// write assertions to maske sure ack function is called
	expect(msg.ack).toHaveBeenCalled();
});
