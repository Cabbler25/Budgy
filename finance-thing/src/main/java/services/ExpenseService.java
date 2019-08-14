package services;

import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.List;

import javax.persistence.Query;
import javax.persistence.criteria.CriteriaBuilder;
import javax.persistence.criteria.CriteriaQuery;
import javax.persistence.criteria.Root;

import org.hibernate.Hibernate;
import org.hibernate.Session;
import org.hibernate.SessionFactory;
import org.hibernate.Transaction;
import org.hibernate.boot.registry.StandardServiceRegistryBuilder;
import org.hibernate.cfg.Configuration;
import org.hibernate.service.ServiceRegistry;

import entities.Expense;
import entities.ExpenseType;
import exceptions.ExpenseNotFoundException;
import forms.ExpenseForm;
import forms.UpdateExpenseForm;
import rev.finance_thing.ExpenseController;

public class ExpenseService {
	static SessionFactory sessionFactory;
	ExpenseController expense;
	
//	Get expense by id
	public Expense getExpenseById(int id) throws ExpenseNotFoundException {
		sessionFactory = configure();
		try(Session session = sessionFactory.openSession()) {
			Expense expense = session.get(Expense.class, id);
			if(expense == null) {
				throw new
				ExpenseNotFoundException("Expense not found");
			} else {
				return expense;
			}
		}
	}
//	Get All expenses by user_id. In this case, the typical session.get() won't work as well
//	since the user_id is not the primary key (Id) of the Expense entity. So, the 
//	criteriaQuery was used here.
	public List<Expense> getExpensesByUserId(int id) throws ExpenseNotFoundException {
		sessionFactory = configure();
		try(Session session = sessionFactory.openSession()) {
//			Create the query to search expense by user_id
			CriteriaBuilder cb = session.getCriteriaBuilder();
//			Create the criteria query
			CriteriaQuery<Expense> expenseQuery = cb.createQuery(Expense.class);
//			Define the data type expected to be returned from the query result
			Root<Expense> root = expenseQuery.from(Expense.class);
//			Perform query
			expenseQuery.select(root).
				where(cb.equal(root.get("userId"), id));
			Query query = session.createQuery(expenseQuery);
			List<Expense> expenses = (List<Expense>) query.getResultList();
			if(expenses.size() == 0) {
				throw new
				ExpenseNotFoundException("Expenses not found");
			} else {
				return expenses;
			}
		}
//		Get all expenses by userId and expense type (Use hql to simplify the query that
//		matches 2 fields
		
	}
	
	public static void createNewExpense(ExpenseForm expense) throws ParseException {
		Expense newExpense = new Expense();
		newExpense.setUserId(expense.getUserId());
		newExpense.setDescription(expense.getDescription());
//		Handle the date conversion
		SimpleDateFormat date = new SimpleDateFormat("yyyy-MM-dd");
		Date convertedDate;
		try {
			convertedDate = date.parse(expense.getDate());
			newExpense.setDate(convertedDate);
		} catch (ParseException e) {
			throw e;
		}
//		Handle expense type
		ExpenseType expenseType = getExpenseTypeById(expense.getType());
		newExpense.setExpenseType(expenseType);
		newExpense.setAmount(expense.getAmount());
		try(Session session = sessionFactory.openSession()) {
			Transaction tx = session.beginTransaction();
			session.save(newExpense);
			tx.commit();
		}
	}
	
	//	This is an internal function only used for ORM purposes. This is a shorthand for
//	using joins in sql to get other tables fields
	public static ExpenseType getExpenseTypeById(int id) {
		sessionFactory = configure();
		try(Session session = sessionFactory.openSession()) {
			ExpenseType expenseType = session.load(ExpenseType.class, id);
			Hibernate.initialize(expenseType);
			return expenseType;
		}
	}
	
//	Update expense
	public void updateExpense(UpdateExpenseForm expense) 
			throws ParseException, ExpenseNotFoundException {
		Expense updatedExpense;
//		See if there is any expense with the provided id
		try {
			updatedExpense = getExpenseById(expense.getId());
//			Only modify fields with values
			if (expense.getUserId() != 0) {
				updatedExpense.setUserId(expense.getUserId());
			}
			if (expense.getType() != 0) {
//				Handle expense type
				ExpenseType expenseType = getExpenseTypeById(expense.getType());
				updatedExpense.setExpenseType(expenseType);
			}
			if (expense.getDescription() != null) {
				updatedExpense.setDescription(expense.getDescription());
			}
			if (expense.getDate() != null) {
//				Handle the date conversion
				SimpleDateFormat date = new SimpleDateFormat("yyyy-MM-dd");
				Date convertedDate;
				try {
					convertedDate = date.parse(expense.getDate());
					updatedExpense.setDate(convertedDate);
				} catch (ParseException e) {
//					If date provided is wrongly formatted throw corresponding exception
					throw e;
				}
			}
			if (expense.getAmount() != 0) {
				updatedExpense.setAmount(expense.getAmount());
			}
			try(Session session = sessionFactory.openSession()) {
				Transaction tx = session.beginTransaction();
				session.update(updatedExpense);
				tx.commit();
			}
		} catch (ExpenseNotFoundException e1) {
//			If not found exception with provided id, throw corresponding exception
			throw e1;
		}
	}
	
//	Create the configuration for the Expense entity
	public static SessionFactory configure() {
		// Configuration is one of the primary interfaces of Hibernate
		
		// Builder pattern
		Configuration configuration = new Configuration()
			.configure()
			.addAnnotatedClass(Expense.class)
			.addAnnotatedClass(ExpenseType.class);
			
		ServiceRegistry serviceRegistry = new StandardServiceRegistryBuilder()
				.applySettings(configuration.getProperties()).build();
		return configuration.buildSessionFactory(serviceRegistry);
	}
}