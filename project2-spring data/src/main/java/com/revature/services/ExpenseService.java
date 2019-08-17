package com.revature.services;

import java.time.LocalDate;
import java.util.Calendar;
import java.util.Date;
import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.revature.models.Expense;
import com.revature.models.ExpenseType;
import com.revature.repositories.ExpenseRepository;
import com.revature.repositories.ExpenseTypeRepository;

@Service
public class ExpenseService {
	ExpenseRepository<Expense> expenseRepository;
	ExpenseTypeRepository<ExpenseType> expenseTypeRepository;

	@Autowired
	public ExpenseService(ExpenseRepository<Expense> expenseRepository,
			ExpenseTypeRepository<ExpenseType> expenseTypeRepository) {
		super();
		this.expenseRepository = expenseRepository;
		this.expenseTypeRepository = expenseTypeRepository;
	}

//	@Transactional
//	public List<Expense> getAllExpenses() {
//		return (List<Expense>) ExpenseRepository.findAll();
//	}
	public Optional<Expense> getById(int id) {
		return expenseRepository.findById(id);
	}

	public List<Expense> findByUserId(int userId) {
		return expenseRepository.findByUserIdOrderByIdDesc(userId);
	}

	public Optional<ExpenseType> findExpenseTypeById(int id) {
		return expenseTypeRepository.findById(id);
	}

	public List<Expense> findExpenseByUserIdAndExpenseType(int userId, Optional<ExpenseType> expenseType) {
		return expenseRepository.findByUserIdAndExpenseType(userId, expenseType);
	}

	public List<ExpenseType> findAllExpenseTypes() {
		return expenseTypeRepository.findAll();
	}
//	Function used to calculate both previous and next months dates in order to search
//	expenses for the current month
	public Date calculateDate(LocalDate date) {
		int year = date.getYear();
		int month = date.getMonthValue();
		int day = date.getDayOfMonth();
		Calendar cal = Calendar.getInstance();
		cal.set(year, month-1, day);
		Date calcDate = cal.getTime();
		return calcDate;
	}
	
//	Function used to get monthly expenses; it means, after the start of current month and before
//	the start of next month
	public List<Expense> findMonthlyExpensesByUserId(int userId) {
//		Define the Date object according to the date parameter
		
//		Define previous month date
		Date currMonthStart = calculateDate(LocalDate.now().withDayOfMonth(1));
//		Define next month date
		Date nextMonthStart = calculateDate(LocalDate.now().plusMonths(1).withDayOfMonth(1));
		return expenseRepository.findByUserIdAndDateBetween(userId,currMonthStart,nextMonthStart);
	}

	public void deleteExpense(int id) {
		expenseRepository.deleteById(id);
	}

	public boolean addExpense(Expense expense) {
		return expenseRepository.save(expense) != null;
	}

	public boolean updateExpense(Expense expense) {
		return expenseRepository.save(expense) != null;
	}

	public void deleteByUserId(int userId) {
		List<Expense> toBeGone = expenseRepository.findByUserId(userId);
		for (Expense b : toBeGone) {
			expenseRepository.deleteById(b.getId());
		}
		return;
	}

}
