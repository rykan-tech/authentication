package com.rykan.auth.jwt.rabbitmq;

import java.util.UUID;
import java.util.concurrent.CountDownLatch;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import com.google.protobuf.InvalidProtocolBufferException;
import com.rykan.auth.jwt.db.Permissions;
import com.rykan.auth.jwt.db.UserRecord;
import com.rykan.auth.jwt.db.UserRecordsDAO;
import com.rykan.protobuf.mq.general.User;
import com.rykan.protobuf.mq.general.User.UserEvent.UserEventMessageType;

@Component
public class UserEventRec {

	private CountDownLatch latch = new CountDownLatch(1);
	Logger logger = LoggerFactory.getLogger(UserEventRec.class);

	public UserEventRec(UserRecordsDAO providedUserRecordsDAO) {
		this.userRecordsDAO = providedUserRecordsDAO;
	}

	private final UserRecordsDAO userRecordsDAO;

	public void receiveMessage(byte[] message) {
		logger.info("Got message from RabbitMQ for a user event.");
		logger.debug("Decoding a RabbitMQ message for user event");
		User.UserEvent event;
		try {
			event = User.UserEvent.parseFrom(message);
		} catch (InvalidProtocolBufferException err) {
			logger.error("Error parsing user event: " + err.getMessage());
			return;
		}
		if (event.getEvent() == UserEventMessageType.CREATE) {
			logger.info("Adding a new user to db...");
			UserRecord user = new UserRecord(
				UUID.fromString(event.getUuid()),
				"starter",
				new Permissions(new Permissions.Mail(true))
			);
			userRecordsDAO.save(user);
			logger.info("The user should have been added.");
		}
		latch.countDown();
	}

	public CountDownLatch getLatch() {
		return latch;
	}

}