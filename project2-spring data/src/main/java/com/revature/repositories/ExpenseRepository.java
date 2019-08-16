package com.revature.repositories;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.revature.models.Expense;
import com.revature.models.ExpenseType;

public interface ExpenseRepository<P> extends JpaRepository<Expense, Integer> {
<<<<<<< HEAD
	List<Expense> findByUserId(int userId);

	List<Expense> findByUserIdAndExpenseType(int userId, Optional<ExpenseType> expenseType);
=======
	List<Expense> findByUserIdOrderByIdDesc(int userId);
>>>>>>> 2c78bb2057959678553d26c8f53b97cfb9b8d260
}