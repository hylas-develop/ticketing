import {
	Publisher,
	Subjects,
	TicketUpdatedEvent
} from '@highbredticket/common';

export class TicketUpdatedPublisher extends Publisher<TicketUpdatedEvent> {
	readonly subject = Subjects.TicketUpdated;
}
