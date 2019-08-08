package services;


import org.hibernate.Session;
import org.hibernate.SessionFactory;
import org.hibernate.Transaction;
import org.hibernate.boot.registry.StandardServiceRegistryBuilder;
import org.hibernate.cfg.Configuration;
import org.hibernate.service.ServiceRegistry;

import entities.Family;
import entities.User;
import forms.UserForm;
import rev.finance_thing.UserController;

public class UserService {
	
	static SessionFactory sessionFactory;
	UserController user;
	
	public static User GetUser(int id) {
		User user = new User();
		
		sessionFactory = configure();
		try(Session session = sessionFactory.openSession()) {
			user = session.get(User.class, id);
		}
		
		System.out.println(user);
		return user;
	}
	
	public static void RegisterUser(UserForm userForm) {
		
		User user = new User();
		user.setUsername(userForm.getUn());
		user.setFirstName(userForm.getFname());
		user.setLastName(userForm.getLname());
		user.setPassword(userForm.getPw());
		user.setEmail(userForm.getEmail());
		user.setFamilyRole(3);
		
		
		Family family = new Family();
		family.setName("someFamily");
		
		

		
		sessionFactory = configure();
		try(Session session = sessionFactory.openSession()) {
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
			Configuration configuration = new Configuration()
				.configure() // Loads the configuration from hibernate.cfg.xml
				.addAnnotatedClass(User.class)
				.addAnnotatedClass(Family.class);
//				.setProperty("hibernate.connection.username", System.getenv("DB_PASSWORD")); 
				// Used to set property values programmatically
				
				
				
			ServiceRegistry serviceRegistry = new StandardServiceRegistryBuilder()
					.applySettings(configuration.getProperties()).build();
			return configuration.buildSessionFactory(serviceRegistry);
	
	}

	
}
