package services;

import java.security.Key;
import java.util.Date;

import javax.crypto.spec.SecretKeySpec;
import javax.xml.bind.DatatypeConverter;

import org.hibernate.Session;
import org.hibernate.SessionFactory;
import org.hibernate.Transaction;
import org.hibernate.boot.registry.StandardServiceRegistryBuilder;
import org.hibernate.cfg.Configuration;
import org.hibernate.query.Query;
import org.hibernate.service.ServiceRegistry;
import org.springframework.security.crypto.bcrypt.BCrypt;

import entities.Family;
import entities.User;
import forms.LoginForm;
import forms.UpdateForm;
import forms.UserForm;
import io.jsonwebtoken.JwtBuilder;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import rev.finance_thing.UserController;

public class UserService {

	static SessionFactory sessionFactory;
	UserController user;

	public static User updateUser(UpdateForm updatedInfo) {

		User oldUser = new User();
		User newUser = new User();

		sessionFactory = configure();
		try (Session session = sessionFactory.openSession()) {
			oldUser = session.get(User.class, updatedInfo.getId());
		}

		if (oldUser == null)
			return null;
		else {
			newUser.setId(oldUser.getId());
			newUser.setFamilyId(oldUser.getFamilyId());
		}

		if (updatedInfo.getEmail() == "") {
			newUser.setEmail(oldUser.getEmail());
		} // Check for updated email. If empty string set to value of oldUser.getEmail
		else
			newUser.setEmail(updatedInfo.getEmail()); // Else set to value of updatedInfo

		if (updatedInfo.getFamilyRole() == -99) {
			newUser.setFamilyRole(oldUser.getFamilyRole());
		} // Check for -99 meaning 'No role provided'
		else
			newUser.setFamilyRole(updatedInfo.getFamilyRole());

		if (updatedInfo.getFirstname() == "") {
			newUser.setFirstname(oldUser.getFirstname());
		} else
			newUser.setFirstname(updatedInfo.getFirstname());

		if (updatedInfo.getLastname() == "") {
			newUser.setLastname(oldUser.getLastname());
		} else
			newUser.setLastname(updatedInfo.getLastname());

		if (updatedInfo.getUsername() == "") {
			newUser.setUsername(oldUser.getUsername());
		} else
			newUser.setUsername(updatedInfo.getUsername());

		if (updatedInfo.getPassword() == "") {
			newUser.setPassword(oldUser.getPassword());
		} else
			newUser.setPassword(updatedInfo.getPassword());

		try (Session session = sessionFactory.openSession()) {
			Transaction tx = session.beginTransaction();
			session.update(newUser);
			tx.commit();
		}

		return newUser;
	}

	public static String createJWT(String id, String aud, String subject, long ttlMillis) {

		// The JWT signature algorithm we will be using to sign the token
		SignatureAlgorithm signatureAlgorithm = SignatureAlgorithm.HS256;

		long nowMillis = System.currentTimeMillis();
		Date now = new Date(nowMillis);

		// We will sign our JWT with our ApiKey secret
		byte[] apiKeySecretBytes = DatatypeConverter.parseBase64Binary(System.getenv("A_SECRET_KEY"));
		Key signingKey = new SecretKeySpec(apiKeySecretBytes, signatureAlgorithm.getJcaName());

		// Let's set the JWT Claims
		JwtBuilder builder = Jwts.builder().setId(id).setIssuedAt(now).setSubject(subject).setAudience(aud)
				.signWith(signingKey, signatureAlgorithm);

		// if it has been specified, let's add the expiration
		if (ttlMillis > 0) {
			long expMillis = nowMillis + ttlMillis;
			Date exp = new Date(expMillis);
			builder.setExpiration(exp);
		}

		// Builds the JWT and serializes it to a compact, URL-safe string
		return builder.compact();
	}

	public static String LoginUser(LoginForm loginForm) {
		User user = new User();

		sessionFactory = configure();
		try (Session session = sessionFactory.openSession()) {
			String hql = "FROM User WHERE username = :un";
			Query<?> query = session.createQuery(hql);
			query.setParameter("un", loginForm.getUsername());
			user = (User) query.uniqueResult();
		}
		if (user == null)
			return null;

		if (BCrypt.checkpw(loginForm.getPassword(), user.getPassword())) {

			return createJWT(String.valueOf(user.getId()), user.getUsername(), String.valueOf(user.getFamilyRole()), 0);
		} else
			return null;

	}// Returns User Object for the time being TODO Change to token or whatever

	public static User GetUser(int id) {
		User user = new User();

		sessionFactory = configure();
		try (Session session = sessionFactory.openSession()) {
			user = session.get(User.class, id);
		}

		System.out.println(user);
		return user;
	}

	public static void RegisterUser(UserForm userForm) {

		User user = new User();
		user.setUsername(userForm.getUn());
		user.setFirstname(userForm.getFname());
		user.setLastname(userForm.getLname());
		user.setPassword(BCrypt.hashpw(userForm.getPw(), BCrypt.gensalt()));
		user.setEmail(userForm.getEmail());
		user.setFamilyRole(3);

		Family family = new Family();
		family.setName("someFamily");

		sessionFactory = configure();
		try (Session session = sessionFactory.openSession()) {
			Transaction tx = session.beginTransaction();
			session.save(family);
			user.setFamilyId(family.getId());
			session.save(user);
			tx.commit();
		}

	}

	public static SessionFactory configure() {
		// Configuration is one of the primary interfaces of Hibernate

		// Builder pattern
		Configuration configuration = new Configuration().configure() // Loads the configuration from hibernate.cfg.xml
				.addAnnotatedClass(User.class).addAnnotatedClass(Family.class);
//				.setProperty("hibernate.connection.username", System.getenv("DB_PASSWORD")); 
		// Used to set property values programmatically

		ServiceRegistry serviceRegistry = new StandardServiceRegistryBuilder()
				.applySettings(configuration.getProperties()).build();
		return configuration.buildSessionFactory(serviceRegistry);

	}

}
