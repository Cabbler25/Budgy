package exceptions;

public class IncomeNotFoundException extends Exception {
	public IncomeNotFoundException(String errorMessage) {
		super(errorMessage);
	}
}