export const mockApplication = {
  _id: "507f1f77bcf86cd799439011",
  fullName: "Иван Иванов",
  phoneNumber: "+7 (999) 999-99-99",
  problemDescription: "Тестовая проблема",
  status: "new",
  createdAt: new Date("2024-01-01"),
};

export const mockUser = {
  _id: "507f1f77bcf86cd799439012",
  email: "test@example.com",
  password: "$2a$10$Xt5wqIy0Xt5wqIy0Xt5wqO",
  role: "operator",
  comparePassword: async password => password === "correct_password",
};
