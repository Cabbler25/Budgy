package services;

import org.hibernate.Hibernate;
import org.hibernate.Session;
import org.hibernate.SessionFactory;
import org.hibernate.Transaction;
import org.hibernate.boot.registry.StandardServiceRegistryBuilder;
import org.hibernate.cfg.Configuration;
import org.hibernate.service.ServiceRegistry;

import entities.Income;
import entities.IncomeTypes;
import forms.IncomeForm;
import forms.UpdateIncomeForm;
import rev.finance_thing.IncomeController;
import exceptions.IncomeNotFoundException;


public class IncomeService {
	
	static SessionFactory sessionFactory;
	IncomeController income;
	//get income by id
	public static Income getIncome(int id) throws IncomeNotFoundException {
		Income income = new Income();
		
		sessionFactory = configure();
		try(Session session = sessionFactory.openSession()) {
			income = session.get(Income.class, id);
			if(income == null) {
				throw new	
				IncomeNotFoundException("Income not found");	
				} else {
					return income;
				}
			}
	}
	
	public static void IncomeInfo(IncomeForm incomeForm) {
		Income income = new Income();
		income.setDescription(incomeForm.getDescription());
		income.setAmount(incomeForm.getAmount());
		income.setUser_id(incomeForm.getUser_id());
		income.setType(incomeForm.getType());
		
		//IncomeTypes incomeTypes = new IncomeTypes();
		//incomeTypes.setType("");
		//System.out.println(income);
		
		sessionFactory = configure();
		try(Session session = sessionFactory.openSession()){
			Transaction tx = session.beginTransaction();
			//session.save(incomeTypes);
			//income.setType(incomeTypes.getId());
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
	
	// patch income
	public void updateIncome(UpdateIncomeForm income) throws IncomeNotFoundException {
		Income updatedIncome;
		
		try {
			updatedIncome = getIncome(income.getId());
			if (income.getUser_id() !=0) {
				updatedIncome.setUser_id(income.getUser_id());
			}
			if (income.getType() !=0) {
				updatedIncome.setType(income.getType());;
			}
			if (income.getDescription() != null) {
				updatedIncome.setDescription(income.getDescription());
			}
			if (income.getAmount() !=0) {
				updatedIncome.setAmount(income.getAmount());
			}
			
			try (Session session = sessionFactory.openSession()) {
				Transaction tx = session.beginTransaction();
				session.update(updatedIncome);
				tx.commit();
			}
		}	catch (IncomeNotFoundException e) {
			throw e;
		}
	}
}