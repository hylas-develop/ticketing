import mongoose from 'mongoose';
import { Password } from '../services/password';
// An interface that describe the properties
// that are required to create a User
interface UserAttrs {
	email: string;
	password: string;
}

// An interface that describes the properties
// that a User Model has
interface UserModel extends mongoose.Model<UserDoc> {
	build(attrs: UserAttrs): UserDoc;
}

// An interface that describes the properties
// that a User Document has
interface UserDoc extends mongoose.Document {
	email: string;
	password: string;
}

const userScheme = new mongoose.Schema(
	{
		email: {
			type: String,
			required: true
		},
		password: {
			type: String,
			required: true
		}
	},
	{
		// view level logic
		toJSON: {
			transform(doc, ret) {
				ret.id = ret._id;
				// remove property from object (vanilla js)
				delete ret._id;
				delete ret.password;
				delete ret.__v;
			}
		}
	}
);

// Don't use arrow function
userScheme.pre('save', async function(done) {
	if (this.isModified('password')) {
		const hashed = await Password.toHash(this.get('password'));
		this.set('password', hashed);
	}
	done();
});

userScheme.statics.build = (attrs: UserAttrs) => {
	return new User(attrs);
};

const User = mongoose.model<UserDoc, UserModel>('User', userScheme);

export { User };
