package com.revature.services;

import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.bcrypt.BCrypt;
import org.springframework.stereotype.Service;

import com.revature.models.ClientInfo;
import com.revature.models.Family;
import com.revature.models.User;
import com.revature.repositories.FamilyRepository;
import com.revature.repositories.UserRepository;

@Service
public class UserServices {
	UserRepository<User> userRepository;
	FamilyRepository<Family> familyRepository;

	@Autowired
	public UserServices(UserRepository<User> userRepository, FamilyRepository<Family> familyRepository) {
		super();
		this.userRepository = userRepository;
		this.familyRepository = familyRepository;
	}

	public ClientInfo loginUser(String un, String pw) {
		Optional<User> user = userRepository.findByUsername(un);
		if (user.isPresent()) {
			if (BCrypt.checkpw(pw, user.get().getPassword())) {
				ClientInfo clientInfo = new ClientInfo(user.get().getId(), user.get().getUsername(),
						user.get().getFirstname(), user.get().getLastname(),
						JWTService.createJWT(String.valueOf(user.get().getId()), user.get().getUsername(),
								user.get().getEmail(), 0));
				return clientInfo;
			} else
				return null;
		}
		return null;
	}

	public boolean userExists(String un) {
		Optional<User> user = userRepository.findByUsername(un);
		if (user.isPresent()) {
			return true;
		}

		return false;

	}

	public boolean emailUsed(String email) {
		Optional<User> user = userRepository.findByEmail(email);
		if (user.isPresent()) {
			return true;
		}

		return false;
	}

	public boolean registerUser(User user) {
		String pw = BCrypt.hashpw(user.getPassword(), BCrypt.gensalt());
		user.setPassword(pw);
		return userRepository.save(user) != null;
	}

	public boolean updateUser(User user) {
		if (user.getPassword() != null) {
			String pw = BCrypt.hashpw(user.getPassword(), BCrypt.gensalt());
			user.setPassword(pw);
		}
		return userRepository.save(user) != null;
	}

	public Optional<User> getById(int id) {
		return userRepository.findById(id);
	}

}
