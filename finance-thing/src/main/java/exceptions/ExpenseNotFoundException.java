package exceptions;
// Exception created for notify that the expense being searched wasn't found
public class ExpenseNotFoundException extends Exception {
	public ExpenseNotFoundException(String errorMessage) {
		super(errorMessage);
	}
}