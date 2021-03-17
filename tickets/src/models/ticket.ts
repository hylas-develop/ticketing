import mongoose from 'mongoose';
import { updateIfCurrentPlugin } from 'mongoose-update-if-current';

interface TicketAttrs {
	title: string;
	price: number;
	userId: string;
}

interface TicketModel extends mongoose.Model<TicketDoc> {
	build(attrs: TicketAttrs): TicketDoc;
}

interface TicketDoc extends mongoose.Document {
	title: string;
	price: number;
	userId: string;
	version: number;
	orderId?: string; // Not required
}

const ticketScheme = new mongoose.Schema(
	{
		title: {
			type: String,
			required: true
		},
		price: {
			type: Number,
			required: true
		},
		userId: {
			type: String,
			required: true
		},
		orderId: {
			type: String,
			required: false
		}
	},
	{
		// view level logic
		toJSON: {
			transform(doc, ret) {
				ret.id = ret._id;
				// remove property from object (vanilla js)
				delete ret._id;
				delete ret.__v;
			}
		}
	}
);

ticketScheme.set('versionKey', 'version');
ticketScheme.plugin(updateIfCurrentPlugin);

ticketScheme.statics.build = (attrs: TicketAttrs) => {
	return new Ticket(attrs);
};

const Ticket = mongoose.model<TicketDoc, TicketModel>('Ticket', ticketScheme);

export { Ticket };
