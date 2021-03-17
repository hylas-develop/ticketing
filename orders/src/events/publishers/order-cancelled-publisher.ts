import {
	Publisher,
	OrderCancelledEvent,
	Subjects
} from '@highbredticket/common';

export class OrderCancelledPublisher extends Publisher<OrderCancelledEvent> {
	readonly subject = Subjects.OrderCancelled;
}
