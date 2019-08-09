package services;

import java.util.List;

import javax.persistence.criteria.CriteriaBuilder;
import javax.persistence.criteria.CriteriaQuery;
import javax.persistence.criteria.Root;

import org.hibernate.Session;
import org.hibernate.SessionFactory;
import org.hibernate.Transaction;
import org.hibernate.boot.registry.StandardServiceRegistryBuilder;
import org.hibernate.cfg.Configuration;
import org.hibernate.query.Query;
import org.hibernate.service.ServiceRegistry;

import entities.Budget;
import exceptions.BudgetNotFoundException;
import forms.BudgetForm;

public class BudgetService {
	static SessionFactory sessionFactory;

	public static Budget GetBudget(int id) {
		Budget budget = new Budget();

		sessionFactory = configure();
		try (Session session = sessionFactory.openSession()) {
			budget = session.get(Budget.class, id);
		}

		return budget;
	}

//	Get All Budgets by user_id. In this case, the typical session.get() won't work as well
//	since the user_id is not the primary key (Id) of the Budget entity. So, the 
//	criteriaQuery was used here.
	public List<Budget> getBudgetsByUserId(int id) throws BudgetNotFoundException {
		sessionFactory = configure();
		try (Session session = sessionFactory.openSession()) {
//			Create the query to search Budget by user_id
			CriteriaBuilder cb = session.getCriteriaBuilder();
//			Create the criteria query
			CriteriaQuery<Budget> BudgetQuery = cb.createQuery(Budget.class);
//			Define the data type expected to be returned from the query result
			Root<Budget> root = BudgetQuery.from(Budget.class);
//			Perform query
			BudgetQuery.select(root).where(cb.equal(root.get("userId"), id));
			Query query = session.createQuery(BudgetQuery);
			List<Budget> Budgets = query.getResultList();
			if (Budgets.size() == 0) {
				throw new BudgetNotFoundException("Budget not found");
			} else {
				return Budgets;
			}
		}
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
