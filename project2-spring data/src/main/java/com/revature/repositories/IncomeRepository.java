package com.revature.repositories;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.revature.models.Income;

public interface IncomeRepository<P> extends JpaRepository<Income, Integer> {
	List<Income> findByUserId(int userId);

<<<<<<< HEAD
=======
	List<Income> findByUserIdOrderByIdDesc(int userId);
>>>>>>> 2c78bb2057959678553d26c8f53b97cfb9b8d260
}