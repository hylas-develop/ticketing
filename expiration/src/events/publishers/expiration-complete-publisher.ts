import {
	Subjects,
	Publisher,
	ExpirationCompleteEvent
} from '@highbredticket/common';

export class ExpirationCompletePublisher extends Publisher<
	ExpirationCompleteEvent
> {
	readonly subject = Subjects.ExpirationComplete;
}
