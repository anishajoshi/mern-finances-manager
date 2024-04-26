import { useEffect, useState } from "react";

const Report = () => {
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [type, setType] = useState("");
  const [report, setReport] = useState(null);
  const [records, setRecords] = useState([]);

  useEffect(() => {
    async function getRecords() {
      try {
        const response = await fetch(`http://localhost:5050/record/`);
        if (!response.ok) {
          throw new Error(`An error occurred: ${response.statusText}`);
        }
        const records = await response.json();
        setRecords(records);
      } catch (error) {
        console.error(error.message);
      }
    }
    getRecords();
  }, []);

  const generateReport = () => {
    // Filter the records based on start date, end date, and type
    const filteredRecords = records.filter((record) => {
      // Convert date strings to Date objects for comparison
      const recordDate = new Date(record.date);
      const startDateObj = new Date(startDate);
      const endDateObj = new Date(endDate);
  
      // Check if the record date is within the selected date range
      const isWithinDateRange =
        recordDate >= startDateObj && recordDate <= endDateObj;
  
      // Check if the record type matches the selected type or if type is empty
      const isMatchingType = type === "" || record.type === type;
  
      return isWithinDateRange && isMatchingType;
    });
  
    // Calculate total expenses
    const totalExpenses = filteredRecords.reduce(
      (total, record) => total + parseFloat(record.cost),
      0
    );
  
    // Calculate average cost
    const averageCost =
      filteredRecords.length > 0
        ? totalExpenses / filteredRecords.length
        : 0; // Prevent division by zero
  
    // Calculate expenses by category
    const expensesByCategory = {};
    filteredRecords.forEach((record) => {
      if (!expensesByCategory[record.type]) {
        expensesByCategory[record.type] = 0;
      }
      expensesByCategory[record.type] += parseFloat(record.cost);
    });
  
    // Calculate expenses over time
    const expensesOverTime = {};
    filteredRecords.forEach((record) => {
      const yearMonth = record.date.substring(0, 7); // Extract year-month (YYYY-MM)
      if (!expensesOverTime[yearMonth]) {
        expensesOverTime[yearMonth] = 0;
      }
      expensesOverTime[yearMonth] += parseFloat(record.cost);
    });
  
    // Construct the report
    const report = {
      totalExpenses,
      averageCost,
      expensesByCategory,
      expensesOverTime,
    };
  
    setReport(report);
  };  

  function getUniqueTypes() {
    const types = new Set();
    records.forEach((record) => types.add(record.type));
    return Array.from(types);
  }

  return (
    <div className="border rounded-lg p-4 shadow-lg bg-white">
      <h1 className="text-3xl font-semibold text-600 mb-4">Financial Report</h1>
      <div className="flex items-center space-x-4 mb-4">
        <label className="text-purple-600">Start Date:</label>
        <input
          type="date"
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
          className="border rounded-md p-2 focus:outline-none"
        />
        <label className="text-purple-600">End Date:</label>
        <input
          type="date"
          value={endDate}
          onChange={(e) => setEndDate(e.target.value)}
          className="border rounded-md p-2 focus:outline-none"
        />
        <label className="text-purple-600">Type:</label>
        <select
          value={type}
          onChange={(e) => setType(e.target.value)}
          className="border rounded-md p-2 focus:outline-none"
        >
          <option value="">Select Type</option>
            {getUniqueTypes().map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
            
        </select>
        <button
          onClick={generateReport}
          className="bg-purple-600 text-white px-4 py-2 rounded-md hover:bg-purple-700 transition-colors focus:outline-none"
        >
          Generate Report
        </button>
      </div>
      {/* Display the generated report here */}
      {report && (
      <div>
        {/* Total expenses and average cost */}
        <h2>Total Expenses: ${report.totalExpenses.toFixed(2)}</h2>
        <h2>Average Cost: ${report.averageCost.toFixed(2)}</h2>

        {/* Expenses by category */}
        <h2>Expenses by Category:</h2>
        <table>
          <thead>
            <tr>
              <th>Category</th>
              <th>Total Cost</th>
            </tr>
          </thead>
          <tbody>
            {Object.entries(report.expensesByCategory).map(([category, total]) => (
              <tr key={category}>
                <td>{category}</td>
                <td>${total.toFixed(2)}</td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Expenses over time */}
        <h2>Expenses Over Time:</h2>
        <table>
          <thead>
            <tr>
              <th>Year-Month</th>
              <th>Total Cost</th>
            </tr>
          </thead>
          <tbody>
            {Object.entries(report.expensesOverTime).map(([yearMonth, total]) => (
              <tr key={yearMonth}>
                <td>{yearMonth}</td>
                <td>${total.toFixed(2)}</td>
              </tr>
            ))}
          </tbody>
        </table>
        </div>
      )}
    </div>
  );
};

export default Report;
