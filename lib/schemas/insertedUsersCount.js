insertedUsersCount = new Mongo.Collection('insertedUsersCount');

insertedUsersCountSchema = new SimpleSchema({
	counterValue: {
		type: Number,
		label: "counter value of players inserted from csv"
	},
});

insertedUsersCount.attachSchema(insertedUsersCountSchema);