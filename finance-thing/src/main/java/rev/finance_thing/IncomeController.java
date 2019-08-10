package rev.finance_thing;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.PatchMapping;

import entities.Income;
import forms.IncomeForm;
import services.IncomeService;
import forms.UpdateIncomeForm;

@RestController
public class IncomeController {
	@GetMapping("/income/{id}")
	public ResponseEntity<Income> getIncome(@PathVariable("id") int id) {
		
		return new ResponseEntity<>(IncomeService.getIncome(id),HttpStatus.OK);
	}
	
	@PostMapping("/income")
	public ResponseEntity<Object> incomeInfo(@RequestBody IncomeForm incomeForm) {
		IncomeService.IncomeInfo(incomeForm);
		return new ResponseEntity<>(HttpStatus.CREATED);
	}
	
	@PatchMapping("/income")
	public ResponseEntity<String> updateIncome(@RequestBody UpdateIncomeForm income) {
		IncomeService incomeService = new IncomeService();
		incomeService.updateIncome(income);
		return new ResponseEntity<>("Successfully Updated", HttpStatus.ACCEPTED);
	}
}