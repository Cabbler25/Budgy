package services;

import java.util.ArrayList;
import java.util.List;

import org.hibernate.Session;
import org.hibernate.SessionFactory;
import org.hibernate.Transaction;
import org.hibernate.boot.registry.StandardServiceRegistryBuilder;
import org.hibernate.cfg.Configuration;
import org.hibernate.query.Query;
import org.hibernate.service.ServiceRegistry;

import entities.Budget;
import forms.BudgetForm;

public class BudgetService {
	static SessionFactory sessionFactory;

	public static Budget GetBudget(int id) {
		Budget budget = new Budget();

		sessionFactory = configure();
		try (Session session = sessionFactory.openSession()) {
			budget = session.get(Budget.class, id);
		}

		System.out.println(budget);
		return budget;
	}

	public static List<Budget> GetBudgetsByUser(int userId) {
		List<Budget> budgets = new ArrayList<>();

		sessionFactory = configure();
		String hql = "FROM Budget WHERE Budget.userId = :id";
		try (Session session = sessionFactory.openSession()) {
			Query<Budget> query = session.createQuery(hql, Budget.class);
			query.setParameter("id", userId);
			System.out.println("called");
			budgets = query.getResultList();
		}
		return budgets;
	}

	public static Budget PostBudget(BudgetForm budgetForm) {
		Budget budget = new Budget();
		budget.setUserId(budgetForm.getUserId());
		budget.setDescription(budgetForm.getDescription());
		budget.setAmount(budgetForm.getAmount());

		sessionFactory = configure();
		try (Session session = sessionFactory.openSession()) {
			Transaction tx = session.beginTransaction();
			session.save(budget);
			tx.commit();
		}
		return budget;
	}

	public static SessionFactory configure() {
		Configuration configuration = new Configuration().configure().addAnnotatedClass(Budget.class);

		ServiceRegistry serviceRegistry = new StandardServiceRegistryBuilder()
				.applySettings(configuration.getProperties()).build();
		return configuration.buildSessionFactory(serviceRegistry);

	}

}
