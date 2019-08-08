package rev.finance_thing;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import entities.User;
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
		 
		 return new ResponseEntity<>(UserService.GetUser(id),HttpStatus.OK);
	  }

}
