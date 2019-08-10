package rev.finance_thing;

import java.text.ParseException;
import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.client.HttpClientErrorException;

import entities.Expense;
import exceptions.ExpenseNotFoundException;
import forms.ExpenseForm;
import forms.UpdateExpenseForm;
import services.ExpenseService;

@RestController
@RequestMapping("expense")
@CrossOrigin(origins="*",allowedHeaders = "*", methods = {RequestMethod.POST})
public class ExpenseController {
//	Find expense by id. If not found, send message to the client
	@GetMapping("/{id}")
	public ResponseEntity<Expense> getExpenseById(@PathVariable("id") int id){
		ExpenseService expenseService = new ExpenseService();
		try { // Search the reimbursement
			Expense expense = expenseService.getExpenseById(id);
			return new ResponseEntity<>(expense,HttpStatus.OK);
//			If not found, proper response is sent to the server
		} catch (ExpenseNotFoundException e) {
			throw new HttpClientErrorException(HttpStatus.NOT_FOUND);
		}
	}
	
//	Find expenses by user id. If not found, send message to the client
	@GetMapping("/user/{id}")
	public ResponseEntity<List<Expense>> getExpensesByUserId(@PathVariable("id") int id){
		ExpenseService expenseService = new ExpenseService();
		try { // Search the reimbursement
			List<Expense> expenses = expenseService.getExpensesByUserId(id);
			return new ResponseEntity<>(expenses,HttpStatus.OK);
//			If not found, proper response is sent to the server
		} catch (ExpenseNotFoundException e) {
			throw new HttpClientErrorException(HttpStatus.NOT_FOUND);
		}
	}
//	Create a new expense
	@PostMapping("/create")
	public ResponseEntity<String> createExpense(@RequestBody ExpenseForm expense) {
		try {
			ExpenseService.createNewExpense(expense);
			return new ResponseEntity<>("Succesfully Created",HttpStatus.CREATED);
		} catch (ParseException e) {
			throw new HttpClientErrorException(HttpStatus.NOT_ACCEPTABLE);
		}
	}
//	Update an existing expense
	@PatchMapping("/update")
	public ResponseEntity<String> updateExpense(@RequestBody UpdateExpenseForm expense) {
		ExpenseService expenseService = new ExpenseService();
		try {
			expenseService.updateExpense(expense);
			return new ResponseEntity<>("Succesfully Updated",HttpStatus.ACCEPTED);
		} catch (ParseException e) {
			throw new HttpClientErrorException(HttpStatus.NOT_ACCEPTABLE);
		} catch (ExpenseNotFoundException e2 ) {
			throw new HttpClientErrorException(HttpStatus.NOT_FOUND);
		}
	}
	
//	Handle exceptions to send messages to the client
	@ExceptionHandler(HttpClientErrorException.class)
	public ResponseEntity<String> errorHandler(HttpClientErrorException e) {
		return ResponseEntity.status(e.getStatusCode()).body(e.getMessage());
	}
}