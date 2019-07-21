package com.rykan.auth.jwt.rabbitmq;

import org.springframework.stereotype.Component;
import org.springframework.amqp.core.Binding;
import org.springframework.amqp.core.BindingBuilder;
import org.springframework.amqp.core.DirectExchange;
import org.springframework.amqp.core.Queue;
import org.springframework.amqp.rabbit.connection.ConnectionFactory;
import org.springframework.amqp.rabbit.listener.SimpleMessageListenerContainer;
import org.springframework.amqp.rabbit.listener.adapter.MessageListenerAdapter;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;

@Component
public class UserCreated {
	public static final String queue_name = "general.user.created"; // Also routing key
	public static final String exchange_name = "general.user";

  // Here, configure rabbitmq
	@Bean
	Queue queue() {
		return new Queue(queue_name);
	}

	@Bean
	DirectExchange exchange() {
		return new DirectExchange(exchange_name);
	}

	@Bean
	Binding binding(Queue queue, DirectExchange exchange) {
		return BindingBuilder.bind(queue).to(exchange).with(queue_name);
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