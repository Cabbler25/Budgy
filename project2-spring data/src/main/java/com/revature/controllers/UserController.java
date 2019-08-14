package com.revature.controllers;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

import com.revature.models.ClientInfo;
import com.revature.models.User;
import com.revature.services.UserServices;

@RestController
@CrossOrigin(origins = "*", allowedHeaders = "*", methods = { RequestMethod.POST, RequestMethod.GET, RequestMethod.PUT,
		RequestMethod.DELETE })
public class UserController {

	UserServices userService;

	@Autowired
	public UserController(UserServices userService) {
		super();
		this.userService = userService;
	}

	@PostMapping("/register")
	public ResponseEntity<Object> userRegister(@RequestBody User userForm) {
		userService.registerUser(userForm);
		return new ResponseEntity<>(HttpStatus.CREATED);
	}

	@GetMapping("/user/{id}")
	public ResponseEntity<Object> getUser(@PathVariable("id") int id) {

		return new ResponseEntity<>(userService.getById(id), HttpStatus.OK);
	}

	@CrossOrigin
	@PostMapping("/login")
	public ResponseEntity<Object> userLogin(@RequestBody User user) {
		ClientInfo token = userService.loginUser(user.getUsername(), user.getPassword());
		if (token == null)
			return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
		return new ResponseEntity<>(token, HttpStatus.OK);

	}

	@PatchMapping("/update")
	public HttpStatus updateUser(@RequestBody User user) {

		return userService.updateUser(user) ? HttpStatus.OK : HttpStatus.BAD_REQUEST;

	}

}
