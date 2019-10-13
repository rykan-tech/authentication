/**
 * Contains definition for permissions
 */
package com.rykan.auth.jwt.db;

import java.io.Serializable;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class Permissions implements Serializable {

	@Data
	@AllArgsConstructor
	@NoArgsConstructor
	public static class Mail implements Serializable {
		private boolean all;
	}

	private Mail mail;
}