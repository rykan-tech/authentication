package com.rykan.auth.jwt.rabbitmq;

import org.springframework.stereotype.Component;
import org.springframework.amqp.core.Binding;
import org.springframework.amqp.core.BindingBuilder;
import org.springframework.amqp.core.FanoutExchange;
import org.springframework.amqp.core.Queue;
import org.springframework.amqp.rabbit.connection.ConnectionFactory;
import org.springframework.amqp.rabbit.listener.SimpleMessageListenerContainer;
import org.springframework.amqp.rabbit.listener.adapter.MessageListenerAdapter;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;

import com.rykan.auth.jwt.utils.Constants;

@Component
public class UserCreated {
	public static final String queue_name = "general.user." + Constants.RABBITMQ_APP_QUEUE_NAME; // Applicatiom queue for this service
	public static final String exchange_name = "general.user";

  // Here, configure rabbitmq
	@Bean
	Queue queue() {
		return new Queue(queue_name);
	}

	@Bean
	FanoutExchange exchange() {
		return new FanoutExchange(exchange_name);
	}

	@Bean
	Binding binding(Queue queue, FanoutExchange exchange) {
		return BindingBuilder.bind(queue).to(exchange);
	}

	@Bean
	SimpleMessageListenerContainer container(ConnectionFactory connectionFactory,
			MessageListenerAdapter listenerAdapter) {
		SimpleMessageListenerContainer container = new SimpleMessageListenerContainer();
		container.setConnectionFactory(connectionFactory);
		container.setQueueNames(queue_name);
		container.setMessageListener(listenerAdapter);
		return container;
	}

	@Bean
	MessageListenerAdapter listenerAdapter(UserCreatedRec receiver) {
		return new MessageListenerAdapter(receiver, "receiveMessage");
	}
}