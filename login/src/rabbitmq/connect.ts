/**
 * Connects to rabbitmq
 */
import amqplib from "amqplib";
import createLogger from "../util/logger";
import { RABBITMQ_ADDRESS, RABBITMQ_EXCHANGES } from "../util/constants";

const logger = createLogger("rabbitmq");

export default async function connect() {
	logger.info("Connecting to rabbitmq...");
	const connection = await amqplib.connect(RABBITMQ_ADDRESS);
	const channel = await connection.createChannel();

	logger.debug("Running init for modules...");
	for (const exchange in RABBITMQ_EXCHANGES) {
		if (RABBITMQ_EXCHANGES.hasOwnProperty(exchange)) {
			// Create exchange
			const exchangeObj = RABBITMQ_EXCHANGES[exchange];
			logger.debug(`Creating exchange of name ${exchangeObj.name}...`);
			await channel.assertExchange(exchangeObj.name, exchangeObj.type, exchangeObj.options);
			// Create queues for the exchange
			logger.debug(`Creating queues for ${exchangeObj.name}...`);
			for (const queueKey in exchangeObj.queues) {
				if (exchangeObj.queues.hasOwnProperty(queueKey)) {
					// Create a queue
					const queue = exchangeObj.queues[queueKey];
					logger.debug(`Creating queue ${queue.name} in ${exchangeObj.name}...`);
					await channel.assertQueue(queue.name, queue.options);
					logger.debug("Binding exchange & queues...");
					await channel.bindQueue(queue.name, exchangeObj.name, "");
				}
			}
		}
	}
	// Setup done! return the channel!
	logger.info("Connected & setup for rabbitmq");
	return { channel, connection };
}