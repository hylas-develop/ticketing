import {
	Listener,
	OrderCancelledEvent,
	Subjects
} from '@highbredticket/common';
import { Message } from 'node-nats-streaming';
import { Ticket } from '../../models/ticket';
import { queueGroupName } from './queue-group-name';
import { TicketUpdatedPublisher } from '../publishers/ticket-updated-publisher';

export class OrderCancelledListener extends Listener<OrderCancelledEvent> {
	readonly subject = Subjects.OrderCancelled;
	queueGroupName = queueGroupName;
	async onMessage(data: OrderCancelledEvent['data'], msg: Message) {
		// Find the ticket that the order is reserving
		const ticket = await Ticket.findById(data.ticket.id);
		// If no ticket, throw error
		if (!ticket) {
			throw new Error('Ticket not found');
		}
		// Mark the ticket as being reserved by setting its orderId propery
		ticket.set({ orderId: undefined });
		// Save the ticket
		await ticket.save();
		// ack the message
		new TicketUpdatedPublisher(this.client).publish({
			id: ticket.id,
			price: ticket.price,
			title: ticket.title,
			userId: ticket.userId,
			version: ticket.version,
			orderId: ticket.orderId
		});
		msg.ack();
	}
}
