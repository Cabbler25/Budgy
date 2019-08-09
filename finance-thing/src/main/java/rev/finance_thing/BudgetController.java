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

import entities.Budget;
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

	@GetMapping("/budget/user/{userId}")
	public ResponseEntity<List<Budget>> getBudgetsByUser(@PathVariable("userId") int userId) {
		return new ResponseEntity<>(BudgetService.GetBudgetsByUser(userId), HttpStatus.OK);
	}
}
