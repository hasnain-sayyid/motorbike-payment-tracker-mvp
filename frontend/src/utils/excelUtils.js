import * as XLSX from 'xlsx';

// Excel Export Utilities for Motorbike Payment Tracker

export const exportCustomersToExcel = (customers) => {
  try {
    // Create a new workbook
    const workbook = XLSX.utils.book_new();

    // Prepare customer summary data
    const customerSummary = customers.map(customer => {
      const totalPaid = customer.paymentHistory?.reduce((sum, payment) => 
        payment.status === 'completed' ? sum + payment.amount : sum, 0) || 0;
      const remainingAmount = customer.totalAmount - totalPaid;
      const completedPayments = customer.paymentHistory?.filter(p => p.status === 'completed').length || 0;

      return {
        'Customer Name': customer.name,
        'Phone': customer.phone,
        'Bike Details': customer.bikeDetails,
        'Bike Price': customer.bikePrice,
        'Down Payment': customer.downPayment,
        'Monthly Amount': customer.monthlyAmount,
        'Due Date': customer.dueDate,
        'Status': customer.status,
        'Total Amount': customer.totalAmount,
        'Amount Paid': totalPaid,
        'Remaining Amount': remainingAmount,
        'Completed Payments': completedPayments,
        'Next Due Date': customer.nextDue ? new Date(customer.nextDue).toLocaleDateString() : 'N/A',
        'Last Payment Date': customer.lastPayment ? new Date(customer.lastPayment).toLocaleDateString() : 'N/A'
      };
    });

    // Create customer summary worksheet
    const customerWS = XLSX.utils.json_to_sheet(customerSummary);
    XLSX.utils.book_append_sheet(workbook, customerWS, 'Customer Summary');

    // Create detailed payment history worksheet
    const paymentDetails = [];
    customers.forEach(customer => {
      if (customer.paymentHistory && customer.paymentHistory.length > 0) {
        customer.paymentHistory.forEach(payment => {
          paymentDetails.push({
            'Customer Name': customer.name,
            'Phone': customer.phone,
            'Payment ID': payment.id,
            'Amount': payment.amount,
            'Date': new Date(payment.date).toLocaleDateString(),
            'Type': payment.type === 'down_payment' ? 'Down Payment' : 
                   payment.type === 'monthly' ? 'Monthly Payment' : payment.type,
            'Status': payment.status.charAt(0).toUpperCase() + payment.status.slice(1)
          });
        });
      }
    });

    if (paymentDetails.length > 0) {
      const paymentWS = XLSX.utils.json_to_sheet(paymentDetails);
      XLSX.utils.book_append_sheet(workbook, paymentWS, 'Payment History');
    }

    // Create financial overview worksheet
    const totalBikesPrice = customers.reduce((sum, customer) => sum + customer.bikePrice, 0);
    const totalDownPayments = customers.reduce((sum, customer) => sum + customer.downPayment, 0);
    const totalAmountPaid = customers.reduce((sum, customer) => {
      const customerPaid = customer.paymentHistory?.reduce((customerSum, payment) => 
        payment.status === 'completed' ? customerSum + payment.amount : customerSum, 0) || 0;
      return sum + customerPaid;
    }, 0);
    const totalRemaining = customers.reduce((sum, customer) => {
      const customerPaid = customer.paymentHistory?.reduce((customerSum, payment) => 
        payment.status === 'completed' ? customerSum + payment.amount : customerSum, 0) || 0;
      return sum + (customer.totalAmount - customerPaid);
    }, 0);

    const financialOverview = [
      { 'Metric': 'Total Customers', 'Value': customers.length },
      { 'Metric': 'Active Customers', 'Value': customers.filter(c => c.status === 'active').length },
      { 'Metric': 'Overdue Customers', 'Value': customers.filter(c => c.status === 'overdue').length },
      { 'Metric': 'Total Bikes Value', 'Value': totalBikesPrice },
      { 'Metric': 'Total Down Payments', 'Value': totalDownPayments },
      { 'Metric': 'Total Amount Paid', 'Value': totalAmountPaid },
      { 'Metric': 'Total Amount Remaining', 'Value': totalRemaining },
      { 'Metric': 'Collection Rate', 'Value': `${((totalAmountPaid / totalBikesPrice) * 100).toFixed(2)}%` }
    ];

    const financialWS = XLSX.utils.json_to_sheet(financialOverview);
    XLSX.utils.book_append_sheet(workbook, financialWS, 'Financial Overview');

    // Generate filename with current date
    const currentDate = new Date().toISOString().split('T')[0];
    const filename = `Motorbike_Payment_Tracker_${currentDate}.xlsx`;

    // Write the file
    XLSX.writeFile(workbook, filename);
    
    return {
      success: true,
      filename: filename,
      message: `Excel file exported successfully as ${filename}`
    };

  } catch (error) {
    console.error('Error exporting to Excel:', error);
    return {
      success: false,
      error: error.message,
      message: 'Failed to export Excel file'
    };
  }
};

export const exportSingleCustomerToExcel = (customer) => {
  try {
    const workbook = XLSX.utils.book_new();

    // Customer details
    const totalPaid = customer.paymentHistory?.reduce((sum, payment) => 
      payment.status === 'completed' ? sum + payment.amount : sum, 0) || 0;
    const remainingAmount = customer.totalAmount - totalPaid;

    const customerInfo = [
      { 'Field': 'Customer Name', 'Value': customer.name },
      { 'Field': 'Phone', 'Value': customer.phone },
      { 'Field': 'Bike Details', 'Value': customer.bikeDetails },
      { 'Field': 'Bike Price', 'Value': customer.bikePrice },
      { 'Field': 'Down Payment', 'Value': customer.downPayment },
      { 'Field': 'Monthly Amount', 'Value': customer.monthlyAmount },
      { 'Field': 'Due Date', 'Value': customer.dueDate },
      { 'Field': 'Status', 'Value': customer.status },
      { 'Field': 'Total Amount', 'Value': customer.totalAmount },
      { 'Field': 'Amount Paid', 'Value': totalPaid },
      { 'Field': 'Remaining Amount', 'Value': remainingAmount }
    ];

    const infoWS = XLSX.utils.json_to_sheet(customerInfo);
    XLSX.utils.book_append_sheet(workbook, infoWS, 'Customer Info');

    // Payment history
    if (customer.paymentHistory && customer.paymentHistory.length > 0) {
      const paymentHistory = customer.paymentHistory.map(payment => ({
        'Payment ID': payment.id,
        'Amount': payment.amount,
        'Date': new Date(payment.date).toLocaleDateString(),
        'Type': payment.type === 'down_payment' ? 'Down Payment' : 
               payment.type === 'monthly' ? 'Monthly Payment' : payment.type,
        'Status': payment.status.charAt(0).toUpperCase() + payment.status.slice(1)
      }));

      const historyWS = XLSX.utils.json_to_sheet(paymentHistory);
      XLSX.utils.book_append_sheet(workbook, historyWS, 'Payment History');
    }

    const currentDate = new Date().toISOString().split('T')[0];
    const filename = `${customer.name.replace(/\s+/g, '_')}_Payment_Details_${currentDate}.xlsx`;

    XLSX.writeFile(workbook, filename);

    return {
      success: true,
      filename: filename,
      message: `Excel file exported successfully as ${filename}`
    };

  } catch (error) {
    console.error('Error exporting customer to Excel:', error);
    return {
      success: false,
      error: error.message,
      message: 'Failed to export customer Excel file'
    };
  }
};

export const importCustomersFromExcel = (file) => {
  return new Promise((resolve, reject) => {
    try {
      const reader = new FileReader();
      
      reader.onload = (e) => {
        try {
          console.log('File read successfully, parsing Excel...');
          const data = new Uint8Array(e.target.result);
          const workbook = XLSX.read(data, { type: 'array' });
          
          console.log('Workbook sheets:', workbook.SheetNames);
          const sheetName = workbook.SheetNames[0];
          const worksheet = workbook.Sheets[sheetName];
          const jsonData = XLSX.utils.sheet_to_json(worksheet);
          
          console.log('=== EXCEL PARSING DEBUG ===');
          console.log('Parsed Excel data:', jsonData);
          console.log('Number of rows found:', jsonData.length);
          
          // Show debugging info in alert boxes
          if (jsonData.length > 0) {
            const columns = Object.keys(jsonData[0]);
            console.log('Column names in Excel file:', columns);
            console.log('First row data:', jsonData[0]);
            
            // Show what we found in the Excel file
            alert(`EXCEL FILE ANALYSIS 📊\n\nRows found: ${jsonData.length}\n\nColumn names found:\n${columns.join('\n')}\n\nFirst row data:\n${JSON.stringify(jsonData[0], null, 2)}`);
          } else {
            alert('❌ EXCEL FILE EMPTY\n\nThe Excel file appears to have no data rows.\n\nPlease make sure your Excel file has:\n• Header row with column names\n• Data rows with customer information');
          }
          
          if (jsonData.length === 0) {
            reject({
              success: false,
              error: 'No data found in Excel file',
              message: 'The Excel file appears to be empty or has no data in the first sheet'
            });
            return;
          }

          // Transform Excel data to customer format with flexible column matching
          const customers = jsonData.map((row, index) => {
            console.log(`Processing row ${index + 1}:`, row);
            
            // Flexible column name matching
            const getName = () => {
              return row['Customer Name'] || row['Name'] || row['customer_name'] || row['name'] || '';
            };
            
            const getPhone = () => {
              return row['Phone'] || row['phone'] || row['Phone Number'] || row['Mobile'] || '';
            };
            
            const getBikeDetails = () => {
              return row['Bike Details'] || row['bike_details'] || row['Bike'] || row['Vehicle'] || 'N/A';
            };
            
            const getBikePrice = () => {
              const price = row['Bike Price'] || row['bike_price'] || row['Total Amount'] || row['total_amount'] || row['Price'] || 0;
              return parseFloat(price) || 0;
            };
            
            const getDownPayment = () => {
              const down = row['Down Payment'] || row['down_payment'] || row['Down'] || 0;
              return parseFloat(down) || 0;
            };
            
            const getMonthlyAmount = () => {
              const monthly = row['Monthly Amount'] || row['monthly_amount'] || row['Monthly'] || 0;
              return parseFloat(monthly) || 0;
            };
            
            const getDueDate = () => {
              return String(row['Due Date'] || row['due_date'] || row['Due'] || '');
            };
            
            const getStatus = () => {
              return row['Status'] || row['status'] || 'active';
            };
            
            const customer = {
              id: Date.now() + index + Math.random(), // Generate unique ID
              name: getName(),
              phone: getPhone(),
              bikeDetails: getBikeDetails(),
              bikePrice: getBikePrice(),
              downPayment: getDownPayment(),
              totalAmount: getBikePrice(), // Use bike price as total amount
              monthlyAmount: getMonthlyAmount(),
              dueDate: getDueDate(),
              status: getStatus(),
              nextDue: new Date().toISOString(),
              lastPayment: null,
              paymentHistory: []
            };
            
            console.log(`Transformed customer ${index + 1}:`, customer);
            return customer;
          }).filter(customer => {
            const isValid = customer.name && customer.name.trim() !== '';
            console.log('Customer valid?', isValid, 'Name:', customer.name);
            return isValid;
          }); // Remove entries without names
          
          console.log('Transformed customers:', customers);
          
          // Show detailed results
          if (customers.length === 0) {
            const originalRowCount = jsonData.length;
            alert(`❌ NO VALID CUSTOMERS FOUND\n\nOriginal rows: ${originalRowCount}\nValid customers: 0\n\nPossible issues:\n• Missing "Customer Name" or "Name" column\n• All name fields are empty\n• Column names don't match expected format\n\nExpected columns:\n• Customer Name (required)\n• Phone\n• Bike Details\n• Bike Price\n• Down Payment\n• Monthly Amount`);
          } else {
            alert(`✅ CUSTOMERS PROCESSED\n\nOriginal rows: ${jsonData.length}\nValid customers found: ${customers.length}\n\nCustomers:\n${customers.map(c => `• ${c.name} (${c.phone})`).slice(0, 5).join('\n')}${customers.length > 5 ? `\n... and ${customers.length - 5} more` : ''}`);
          }
          
          if (customers.length === 0) {
            reject({
              success: false,
              error: 'No valid customer data found',
              message: 'Could not find any valid customer records in the Excel file'
            });
            return;
          }

          resolve({
            success: true,
            customers: customers,
            count: customers.length,
            message: `Successfully imported ${customers.length} customers`
          });

        } catch (parseError) {
          console.error('Excel parsing error:', parseError);
          reject({
            success: false,
            error: parseError.message,
            message: `Failed to parse Excel file: ${parseError.message}`
          });
        }
      };

      reader.onerror = (error) => {
        console.error('File reading failed:', error);
        reject({
          success: false,
          error: 'File reading failed',
          message: 'Could not read the Excel file. Please check the file and try again.'
        });
      };

      console.log('Starting to read file:', file.name);
      reader.readAsArrayBuffer(file);

    } catch (error) {
      reject({
        success: false,
        error: error.message,
        message: 'Failed to import Excel file'
      });
    }
  });
};