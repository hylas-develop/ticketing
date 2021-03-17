import { Publisher, OrderCreatedEvent, Subjects } from '@highbredticket/common';

export class OrderCreatedPublisher extends Publisher<OrderCreatedEvent> {
	readonly subject = Subjects.OrderCreated;
}
