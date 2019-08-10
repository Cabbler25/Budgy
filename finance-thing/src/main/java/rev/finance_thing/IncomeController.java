package rev.finance_thing;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.client.HttpClientErrorException;

import entities.Income;
import forms.IncomeForm;
import services.IncomeService;
import forms.UpdateIncomeForm;
import exceptions.IncomeNotFoundException;

@RestController
public class IncomeController {
	@GetMapping("/income/{id}")
	public ResponseEntity<Income> getIncome(@PathVariable("id") int id) {
		
		try {
			return new ResponseEntity<>(IncomeService.getIncome(id),HttpStatus.OK);
		} catch (IncomeNotFoundException e) {
			throw new HttpClientErrorException(HttpStatus.NOT_FOUND);
		}
	}
	
	@PostMapping("/income")
	public ResponseEntity<Object> incomeInfo(@RequestBody IncomeForm incomeForm) {
		
		IncomeService.IncomeInfo(incomeForm);
		return new ResponseEntity<>("Successfully Created",HttpStatus.CREATED);
	}
	
	@PatchMapping("/income")
	public ResponseEntity<String> updateIncome(@RequestBody UpdateIncomeForm income) {
		IncomeService incomeService = new IncomeService();
		try {
			incomeService.updateIncome(income);
			return new ResponseEntity<>("Successfully Updated", HttpStatus.ACCEPTED);
		} catch (IncomeNotFoundException e){
			throw new HttpClientErrorException(HttpStatus.NOT_FOUND);
		}
	}
	
//	Handle exceptions to send messages to the client
	@ExceptionHandler(HttpClientErrorException.class)
	public ResponseEntity<String> errorHandler(HttpClientErrorException e) {
		return ResponseEntity.status(e.getStatusCode()).body(e.getMessage());
	}
}