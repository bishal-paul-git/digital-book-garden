
// Mock service for Library Management System
// In a real application, these would be actual API calls to your Python backend

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Mock data
let books = [
  { id: 1, title: "Python Programming", author: "John Doe", isbn: "978-0123456789", genre: "Technology", publicationYear: 2023, totalCopies: 5, availableCopies: 3, description: "A comprehensive guide to Python programming" },
  { id: 2, title: "Data Structures", author: "Jane Smith", isbn: "978-0987654321", genre: "Computer Science", publicationYear: 2022, totalCopies: 3, availableCopies: 1, description: "Understanding data structures and algorithms" },
  { id: 3, title: "Web Development", author: "Bob Wilson", isbn: "978-0456789123", genre: "Technology", publicationYear: 2024, totalCopies: 4, availableCopies: 4, description: "Modern web development techniques" },
];

let members = [
  { id: 1, memberId: "M001", name: "Alice Johnson", email: "alice@university.edu", phone: "123-456-7890", memberType: "Student", address: "123 Campus St", joinDate: "2024-01-15" },
  { id: 2, memberId: "M002", name: "Dr. Robert Brown", email: "robert@university.edu", phone: "098-765-4321", memberType: "Faculty", address: "456 Faculty Ave", joinDate: "2023-08-20" },
  { id: 3, memberId: "M003", name: "Carol Davis", email: "carol@university.edu", phone: "555-123-4567", memberType: "Staff", address: "789 Staff Rd", joinDate: "2024-02-10" },
];

let borrowings = [
  { id: 1, bookId: 1, memberId: 1, bookTitle: "Python Programming", memberName: "Alice Johnson", borrowDate: "2024-06-01", dueDate: "2024-06-15", returnDate: null },
  { id: 2, bookId: 2, memberId: 2, bookTitle: "Data Structures", memberName: "Dr. Robert Brown", borrowDate: "2024-05-20", dueDate: "2024-06-03", returnDate: "2024-06-02" },
];

export const libraryService = {
  // Dashboard
  getDashboardStats: async () => {
    await delay(500);
    return {
      totalBooks: books.length,
      totalMembers: members.length,
      booksBorrowed: borrowings.filter(b => !b.returnDate).length,
      overdueBooks: borrowings.filter(b => !b.returnDate && new Date(b.dueDate) < new Date()).length,
    };
  },

  getRecentBorrowings: async () => {
    await delay(300);
    return borrowings.slice(0, 5);
  },

  // Books
  getBooks: async (searchTerm: string = "") => {
    await delay(500);
    return books.filter(book => 
      book.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      book.author.toLowerCase().includes(searchTerm.toLowerCase()) ||
      book.isbn.includes(searchTerm)
    );
  },

  getAvailableBooks: async () => {
    await delay(300);
    return books.filter(book => book.availableCopies > 0);
  },

  addBook: async (bookData: any) => {
    await delay(500);
    const newBook = {
      id: books.length + 1,
      ...bookData,
      totalCopies: parseInt(bookData.totalCopies),
      availableCopies: parseInt(bookData.totalCopies),
    };
    books.push(newBook);
    return newBook;
  },

  updateBook: async (id: number, bookData: any) => {
    await delay(500);
    const index = books.findIndex(book => book.id === id);
    if (index !== -1) {
      books[index] = { ...books[index], ...bookData };
      return books[index];
    }
    throw new Error("Book not found");
  },

  deleteBook: async (id: number) => {
    await delay(500);
    books = books.filter(book => book.id !== id);
    return true;
  },

  // Members
  getMembers: async (searchTerm: string = "") => {
    await delay(500);
    return members.filter(member => 
      member.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      member.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      member.memberId.includes(searchTerm)
    );
  },

  addMember: async (memberData: any) => {
    await delay(500);
    const newMember = {
      id: members.length + 1,
      memberId: `M${String(members.length + 1).padStart(3, '0')}`,
      ...memberData,
      joinDate: new Date().toISOString().split('T')[0],
    };
    members.push(newMember);
    return newMember;
  },

  updateMember: async (id: number, memberData: any) => {
    await delay(500);
    const index = members.findIndex(member => member.id === id);
    if (index !== -1) {
      members[index] = { ...members[index], ...memberData };
      return members[index];
    }
    throw new Error("Member not found");
  },

  deleteMember: async (id: number) => {
    await delay(500);
    members = members.filter(member => member.id !== id);
    return true;
  },

  // Borrowings
  getBorrowings: async (searchTerm: string = "") => {
    await delay(500);
    return borrowings.filter(borrowing => 
      borrowing.bookTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
      borrowing.memberName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      borrowing.id.toString().includes(searchTerm)
    );
  },

  borrowBook: async (borrowData: any) => {
    await delay(500);
    const book = books.find(b => b.id === parseInt(borrowData.bookId));
    const member = members.find(m => m.id === parseInt(borrowData.memberId));
    
    if (!book || !member) {
      throw new Error("Book or member not found");
    }

    if (book.availableCopies <= 0) {
      throw new Error("No copies available");
    }

    const newBorrowing = {
      id: borrowings.length + 1,
      bookId: parseInt(borrowData.bookId),
      memberId: parseInt(borrowData.memberId),
      bookTitle: book.title,
      memberName: member.name,
      borrowDate: new Date().toISOString().split('T')[0],
      dueDate: borrowData.dueDate,
      returnDate: null,
    };

    // Update book availability
    book.availableCopies -= 1;
    borrowings.push(newBorrowing);
    
    return newBorrowing;
  },

  returnBook: async (borrowingId: number) => {
    await delay(500);
    const borrowing = borrowings.find(b => b.id === borrowingId);
    if (!borrowing) {
      throw new Error("Borrowing not found");
    }

    const book = books.find(b => b.id === borrowing.bookId);
    if (book) {
      book.availableCopies += 1;
    }

    borrowing.returnDate = new Date().toISOString().split('T')[0];
    return borrowing;
  },

  // Reports
  getReportData: async () => {
    await delay(500);
    return {
      totalBooks: books.length,
      totalMembers: members.length,
      activeBorrowings: borrowings.filter(b => !b.returnDate).length,
      overdueBooks: borrowings.filter(b => !b.returnDate && new Date(b.dueDate) < new Date()).length,
    };
  },
};
