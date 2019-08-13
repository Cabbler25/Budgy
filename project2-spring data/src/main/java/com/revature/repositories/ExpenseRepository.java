package com.revature.repositories;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.revature.models.Expense;

public interface ExpenseRepository<P> extends JpaRepository<Expense, Integer> {
	List<Expense> findByUserId(int userId);
}