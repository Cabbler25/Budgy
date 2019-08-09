package services;

import org.hibernate.Session;
import org.hibernate.SessionFactory;
import org.hibernate.Transaction;
import org.hibernate.boot.registry.StandardServiceRegistryBuilder;
import org.hibernate.cfg.Configuration;
import org.hibernate.service.ServiceRegistry;

import entities.Income;
import entities.IncomeTypes;
import forms.IncomeForm;
import rev.finance_thing.IncomeController;


public class IncomeService {
	
	static SessionFactory sessionFactory;
	IncomeController income;
	
	public static Income GetIncome(int id) {
		Income income = new Income();
		
		sessionFactory = configure();
		try(Session session = sessionFactory.openSession()) {
			income = session.get(Income.class, id);
		}
		System.out.println(income);
		return income;
	}
	
	public static void IncomeInfo(IncomeForm incomeForm) {
		Income income = new Income();
		income.setDescription(incomeForm.getDescription());
		income.setAmount(incomeForm.getAmount());
		income.setUser_id(incomeForm.getUser_id());
		income.setType(incomeForm.getType());
		
		IncomeTypes incomeTypes = new IncomeTypes();
		incomeTypes.setType("");
		System.out.println(income);
		
		sessionFactory = configure();
		try(Session session = sessionFactory.openSession()){
			Transaction tx = session.beginTransaction();
			session.save(incomeTypes);
			income.setType(incomeTypes.getId());
			session.save(income);
			tx.commit();
		}
		
	}
	public static SessionFactory configure() {
		// Configuration is one of the primary interfaces of Hibernate
		
		// Builder pattern
		Configuration configuration = new Configuration()
			.configure() // Loads the configuration from hibernate.cfg.xml
			.addAnnotatedClass(Income.class)
			.addAnnotatedClass(IncomeTypes.class);
//			.setProperty("hibernate.connection.username", System.getenv("DB_PASSWORD")); 
			// Used to set property values programmatically
			
			
			
		ServiceRegistry serviceRegistry = new StandardServiceRegistryBuilder()
				.applySettings(configuration.getProperties()).build();
		return configuration.buildSessionFactory(serviceRegistry);

	}
}