package exceptions;

// Exception created for notify that the expense being searched wasn't found
public class BudgetNotFoundException extends Exception {
	public BudgetNotFoundException(String errorMessage) {
		super(errorMessage);
	}
}