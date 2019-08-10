package forms;

public class ReturnUserForm {
	private int id;
	private String username;
	private String first;
	private String last;
	private String token;
	
	public ReturnUserForm() {
		super();
		// TODO Auto-generated constructor stub
	}
	public ReturnUserForm(int id, String username, String first, String last, String token) {
		super();
		this.id = id;
		this.username = username;
		this.first = first;
		this.last = last;
		this.token = token;
	}
	public int getId() {
		return id;
	}
	public void setId(int id) {
		this.id = id;
	}
	public String getUsername() {
		return username;
	}
	public void setUsername(String username) {
		this.username = username;
	}
	public String getFirst() {
		return first;
	}
	public void setFirst(String first) {
		this.first = first;
	}
	public String getLast() {
		return last;
	}
	public void setLast(String last) {
		this.last = last;
	}
	public String getToken() {
		return token;
	}
	public void setToken(String token) {
		this.token = token;
	}	
	
	
}
