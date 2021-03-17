import request from 'supertest';
import { app } from '../../app';
import mongoose from 'mongoose';
import { Order } from '../../models/order';
import { OrderStatus } from '@highbredticket/common';

it('return a 404 when purchasing an order that does not exist.', async () => {
	await request(app)
		.post('/api/payments')
		.set('Cookie', global.signin())
		.send({
			token: 'asdf',
			orderId: mongoose.Types.ObjectId().toHexString()
		})
		.expect(404);
});

it('return a 401 when purchasing an order that does not belong to the user.', async () => {
	const order = Order.build({
		id: mongoose.Types.ObjectId().toHexString(),
		price: 100,
		status: OrderStatus.Created,
		version: 0,
		userId: mongoose.Types.ObjectId().toHexString()
	});
	await order.save();

	await request(app)
		.post('/api/payments')
		.set('Cookie', global.signin())
		.send({
			token: 'asdf',
			orderId: order.id
		})
		.expect(401);
});

it('return a 400 when purchasing an order that cancelled order.', async () => {
	const userId = mongoose.Types.ObjectId().toHexString();
	const order = Order.build({
		id: mongoose.Types.ObjectId().toHexString(),
		price: 100,
		status: OrderStatus.Cancelled,
		version: 0,
		userId
	});
	await order.save();

	await request(app)
		.post('/api/payments')
		.set('Cookie', global.signin(userId))
		.send({
			token: 'asdf',
			orderId: order.id
		})
		.expect(400);
});
