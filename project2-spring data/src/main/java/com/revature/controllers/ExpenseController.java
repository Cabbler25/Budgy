
package com.revature.controllers;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.RestController;

import com.revature.models.Expense;
import com.revature.models.ExpenseType;
import com.revature.services.ExpenseService;

@RestController
@CrossOrigin(origins = "*", allowedHeaders = "*", 
			 methods = { RequestMethod.POST, RequestMethod.GET, RequestMethod.PUT,
		RequestMethod.DELETE })

@RequestMapping("expense")
public class ExpenseController {

	ExpenseService expenseService;

	@Autowired
	public ExpenseController(ExpenseService expenseService) {
		super();
		this.expenseService = expenseService;
	}
//	Endpoint for getting expense by id
	@RequestMapping(value = "/{id}", method = RequestMethod.GET)
	public @ResponseBody Optional<Expense> getExpenseById(@PathVariable int id) {
		return expenseService.getById(id);
	}
//	Endpoint for getting expenses by user id
	@RequestMapping(value = "/user/{userId}", method = RequestMethod.GET)
	public List<Expense> getExpenseByUserId(@PathVariable int userId) {
		return expenseService.findByUserId(userId);
	}
//	Endpoint for getting expenses by type id
	@RequestMapping(value = "/type/{id}", method = RequestMethod.GET)
	public Optional<ExpenseType> getExpenseTypeById(@PathVariable int id) {
		return expenseService.findExpenseTypeById(id);
	}
//	Endpoint for getting expenses by type id
	@RequestMapping(value = "/user/{userId}/type/{typeId}", method = RequestMethod.GET)
	public List<Expense> getExpenseByUserIdAndTypeId(@PathVariable int userId,
												     @PathVariable int typeId) 
	{
		return expenseService.findExpenseByUserIdAndTypeId(userId, typeId);
	}
//	Endpoint for getting expenses by type id
	@RequestMapping(value = "/types", method = RequestMethod.GET)
	public List<ExpenseType> getExpenseTypes() {
		return expenseService.findAllExpenseTypes();
	}
//	Endpoint for deleting expense by id
	@RequestMapping(value = "/{id}", method = RequestMethod.DELETE)
	public HttpStatus deleteExpense(@PathVariable int id) {
		expenseService.deleteExpense(id);
		return HttpStatus.NO_CONTENT;
	}
//	Endpoint for creating a new expense
	@RequestMapping(value = "", method = RequestMethod.POST)
	public HttpStatus insertExpense(@RequestBody Expense expense) {
		return expenseService.addExpense(expense) ? HttpStatus.CREATED : HttpStatus.BAD_REQUEST;
	}
//	Endpoint for modifying an existing expense
	@RequestMapping(value = "", method = RequestMethod.PUT)
	public HttpStatus updateExpense(@RequestBody Expense expense) {
		return expenseService.updateExpense(expense) ? HttpStatus.ACCEPTED : HttpStatus.BAD_REQUEST;
	}

//	@RequestMapping(value = "/expense", method = RequestMethod.GET)
//	public List<Expense> getAll() {
//		return ExpenseService.getAllExpenses();
//	}
}