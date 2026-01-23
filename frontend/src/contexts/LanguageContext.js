import React, { createContext, useContext, useState } from 'react';

const translations = {
  en: {
    // Header
    title: "Motorbike Payment Tracker",
    subtitle: "Automated payment tracking and reminders for your installment business",
    
    // Buttons
    addCustomer: "Add Customer",
    testReminders: "Test Reminders",
    tryAgain: "Try Again",
    submit: "Submit",
    cancel: "Cancel",
    save: "Save Changes",
    delete: "Delete",
    edit: "Edit",
    sendReminder: "Send Reminder",
    recordPayment: "Record Payment",
    details: "Details",
    
    // Excel Export/Import
    exportToExcel: "Export to Excel",
    importFromExcel: "Import from Excel",
    excelExported: "Excel file exported successfully",
    excelImported: "Customers imported successfully",
    exportingExcel: "Exporting to Excel...",
    importingExcel: "Importing from Excel...",
    
    // Customer Details
    customerDetails: "Customer Details",
    bikePrice: "Bike Price",
    downPayment: "Down Payment",
    paymentHistory: "Payment History",
    remainingAmount: "Remaining Amount",
    totalPaid: "Total Paid",
    paymentType: "Type",
    paymentDate: "Date",
    paymentAmount: "Amount",
    paymentStatus: "Status",
    downPaymentType: "Down Payment",
    monthlyPaymentType: "Monthly Payment",
    completed: "Completed",
    pending: "Pending",
    close: "Close",
    
    // Dashboard Stats
    totalCustomers: "Total Customers",
    dueOverdue: "Due/Overdue", 
    paidThisMonth: "Paid This Month",
    customerPaymentTracking: "Customer Payment Tracking",
    
    // Customer Status
    paid: "PAID",
    due: "DUE", 
    overdue: "OVERDUE",
    active: "ACTIVE",
    
    // Customer Details
    monthlyAmount: "Monthly Amount",
    dueDate: "Due Date",
    phone: "Phone",
    bikeDetails: "Bike Details",
    ofEachMonth: "th of each month",
    
    // Forms
    customerName: "Customer Name",
    phoneNumber: "Phone Number",
    totalAmount: "Total Amount",
    installmentAmount: "Monthly Installment",
    startDate: "Start Date",
    dueDay: "Due Date (Day of Month)",
    dueDayHelper: "Enter the day of the month when payment is due (1-31)",
    notes: "Notes",
    notesPlaceholder: "Any additional notes about this customer...",
    editCustomer: "Edit Customer",
    addNewCustomer: "Add New Customer",
    updateCustomer: "Update Customer",
    fillRequiredFields: "Please fill in all required fields",
    validPhoneNumber: "Please enter a valid phone number",
    validDueDate: "Due date must be between 1 and 31",
    validAmount: "Please enter a valid amount",
    
    // Messages
    connectionError: "Connection Error",
    failedToLoad: "Failed to load customers. Please check if the server is running.",
    loadingCustomers: "Loading customers...",
    noCustomers: "No customers found",
    
    // Language
    language: "Language",
    english: "English",
    urdu: "اردو",
    
    // Admin
    adminLogin: "Admin Login",
    adminAuthentication: "Admin Authentication Required",
    invalidCredentials: "Invalid admin credentials",
    adminLoggedIn: "Admin logged in successfully",
    adminLoggedOut: "Admin logged out"
  },
  
  ur: {
    // Header
    title: "موٹر سائیکل پیمنٹ ٹریکر",
    subtitle: "آپ کے قسط کے کاروبار کے لیے خودکار ادائیگی کی نگرانی اور یاد دہانیاں",
    
    // Buttons
    addCustomer: "کسٹمر شامل کریں",
    testReminders: "یاددہانی ٹیسٹ کریں",
    tryAgain: "دوبارہ کوشش کریں",
    submit: "جمع کریں",
    cancel: "منسوخ کریں",
    save: "تبدیلیاں محفوظ کریں",
    delete: "حذف کریں",
    edit: "تبدیل کریں",
    sendReminder: "یاددہانی بھیجیں",
    recordPayment: "ادائیگی ریکارڈ کریں",
    details: "تفصیلات",
    
    // Excel Export/Import
    exportToExcel: "Excel میں ایکسپورٹ کریں",
    importFromExcel: "Excel سے امپورٹ کریں",
    excelExported: "Excel فائل کامیابی سے ایکسپورٹ ہوئی",
    excelImported: "کسٹمرز کامیابی سے امپورٹ ہوئے",
    exportingExcel: "Excel میں ایکسپورٹ ہو رہا ہے...",
    importingExcel: "Excel سے امپورٹ ہو رہا ہے...",
    
    // Customer Details
    customerDetails: "کسٹمر کی تفصیلات",
    bikePrice: "بائیک کی قیمت",
    downPayment: "پیشگی ادائیگی",
    paymentHistory: "ادائیگی کی تاریخ",
    remainingAmount: "باقی رقم",
    totalPaid: "کل ادا شدہ",
    paymentType: "قسم",
    paymentDate: "تاریخ",
    paymentAmount: "رقم",
    paymentStatus: "حالت",
    downPaymentType: "پیشگی ادائیگی",
    monthlyPaymentType: "ماہانہ ادائیگی",
    completed: "مکمل",
    pending: "باقی",
    close: "بند کریں",
    
    // Dashboard Stats
    totalCustomers: "کل کسٹمرز",
    dueOverdue: "واجب/تاخیر شدہ",
    paidThisMonth: "اس مہینے ادا شدہ",
    customerPaymentTracking: "کسٹمر پیمنٹ ٹریکنگ",
    
    // Customer Status
    paid: "ادا شدہ",
    due: "واجب",
    overdue: "تاخیر شدہ", 
    active: "فعال",
    
    // Customer Details
    monthlyAmount: "ماہانہ رقم",
    dueDate: "آخری تاریخ",
    phone: "فون",
    bikeDetails: "بائیک کی تفصیلات",
    ofEachMonth: "ہر مہینے کی",
    
    // Forms
    customerName: "کسٹمر کا نام",
    phoneNumber: "فون نمبر",
    totalAmount: "کل رقم",
    installmentAmount: "ماہانہ قسط",
    startDate: "شروع کی تاریخ",
    dueDay: "آخری تاریخ (مہینے کا دن)",
    dueDayHelper: "مہینے کا دن درج کریں جب ادائیگی واجب ہے (1-31)",
    notes: "نوٹس",
    notesPlaceholder: "اس کسٹمر کے بارے میں کوئی اضافی نوٹس...",
    editCustomer: "کسٹمر میں تبدیلی",
    addNewCustomer: "نیا کسٹمر شامل کریں",
    updateCustomer: "کسٹمر اپ ڈیٹ کریں",
    fillRequiredFields: "برائے کرم تمام ضروری فیلڈز بھریں",
    validPhoneNumber: "برائے کرم درست فون نمبر درج کریں",
    validDueDate: "آخری تاریخ 1 سے 31 کے درمیان ہونی چاہیے",
    validAmount: "برائے کرم درست رقم درج کریں",
    
    // Messages
    connectionError: "کنکشن کی خرابی",
    failedToLoad: "کسٹمرز لوڈ نہیں ہو سکے۔ برائے کرم چیک کریں کہ سرور چل رہا ہے۔",
    loadingCustomers: "کسٹمرز لوڈ ہو رہے ہیں...",
    noCustomers: "کوئی کسٹمر نہیں ملا",
    
    // Language
    language: "زبان",
    english: "English",
    urdu: "اردو",
    
    // Admin
    adminLogin: "ایڈمن لاگ ان",
    adminAuthentication: "ایڈمن کی تصدیق درکار ہے",
    invalidCredentials: "غلط ایڈمن کی معلومات",
    adminLoggedIn: "ایڈمن کامیابی سے لاگ ان ہوا",
    adminLoggedOut: "ایڈمن لاگ آؤٹ ہوا"
  }
};

const LanguageContext = createContext();

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};

export const LanguageProvider = ({ children }) => {
  const [language, setLanguage] = useState('en');
  
  const toggleLanguage = () => {
    setLanguage(prev => prev === 'en' ? 'ur' : 'en');
  };
  
  const t = (key) => {
    return translations[language][key] || key;
  };
  
  return (
    <LanguageContext.Provider value={{ 
      language, 
      setLanguage, 
      toggleLanguage, 
      t,
      isUrdu: language === 'ur' 
    }}>
      <div className={language === 'ur' ? 'rtl' : 'ltr'}>
        {children}
      </div>
    </LanguageContext.Provider>
  );
};

export default LanguageContext;