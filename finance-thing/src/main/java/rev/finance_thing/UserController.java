package rev.finance_thing;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import entities.User;
import forms.LoginForm;
import forms.UpdateForm;
import forms.UserForm;
import services.UserService;

@RestController
public class UserController {

	@PostMapping("/register")
	public ResponseEntity<Object> userRegister(@RequestBody UserForm userForm) {
		UserService.RegisterUser(userForm);
		return new ResponseEntity<>(HttpStatus.CREATED);
	}

	@GetMapping("/user/{id}")
	public ResponseEntity<User> getUser(@PathVariable("id") int id) {

		return new ResponseEntity<>(UserService.GetUser(id), HttpStatus.OK);
	}

	@CrossOrigin
	@PostMapping("/login")
	public ResponseEntity<String> userLogin(@RequestBody LoginForm loginForm) {
		String token = UserService.LoginUser(loginForm);
		if (token == null)
			return new ResponseEntity<>("Incorrect Password", HttpStatus.BAD_REQUEST);
		if (token == "User not Found")
			return new ResponseEntity<>("User not found", HttpStatus.NOT_FOUND);
		return new ResponseEntity<>(token, HttpStatus.OK);

	}

	@PatchMapping("/update")
	public ResponseEntity<User> updateUser(@RequestBody UpdateForm user) {

		User newUser = UserService.updateUser(user);
		if (newUser == null)
			return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
		else
			return new ResponseEntity<>(newUser, HttpStatus.OK);

	}

}
