package rev.finance_thing;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.client.HttpClientErrorException;

import entities.Budget;
import exceptions.BudgetNotFoundException;
import forms.BudgetForm;
import services.BudgetService;

@RestController
@CrossOrigin(allowedHeaders = "*", methods = { RequestMethod.POST })
public class BudgetController {

	@PostMapping("/budget/")
	public ResponseEntity<Budget> postBudget(@RequestBody BudgetForm budgetForm) {
		Budget budget = BudgetService.PostBudget(budgetForm);
		return new ResponseEntity<>(budget, HttpStatus.CREATED);
	}

	@GetMapping("/budget/{id}")
	public ResponseEntity<Budget> getBudget(@PathVariable("id") int id) {
		return new ResponseEntity<>(BudgetService.GetBudget(id), HttpStatus.OK);
	}

//	Find Budgets by user id. If not found, send message to the client
	@GetMapping("/budget/user/{id}")
	public ResponseEntity<List<Budget>> getBudgetsByUserId(@PathVariable("id") int id) {
		BudgetService BudgetService = new BudgetService();
		try { // Search the reimbursement
			List<Budget> Budgets = BudgetService.getBudgetsByUserId(id);
			return new ResponseEntity<>(Budgets, HttpStatus.OK);
//			If not found, proper response is sent to the server
		} catch (BudgetNotFoundException e) {
			throw new HttpClientErrorException(HttpStatus.NOT_FOUND);
		}
	}
}
