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
        // Calculate earliest and latest purchase dates
        const dates = records.map(record => new Date(record.date));
        const earliestDate = new Date(Math.min(...dates)).toISOString().split("T")[0];
        const latestDate = new Date(Math.max(...dates)).toISOString().split("T")[0];
        
        // Set start and end dates to earliest and latest dates
        setStartDate(earliestDate);
        setEndDate(latestDate);
        generateReport();
      } catch (error) {
        console.error(error.message);
      }
    }
    getRecords();
  }, []);

  useEffect(() => {
    if (startDate && endDate) {
      generateReport();
    }
  }, [startDate, endDate]);

  const generateReport = () => {
    const filteredRecords = records.filter((record) => {

      const recordDate = new Date(record.date);
      const startDateObj = new Date(startDate);
      const endDateObj = new Date(endDate);
  
      const isWithinDateRange =
        recordDate >= startDateObj && recordDate <= endDateObj;
  
      const isMatchingType = type === "" || record.type === type;
  
      return isWithinDateRange && isMatchingType;
    });
  
    const totalExpenses = filteredRecords.reduce(
      (total, record) => total + parseFloat(record.cost),
      0
    );

    const totalUniqueItems = new Set(filteredRecords.map(record => record.name)).size;

    const averageExpensePerItem = totalUniqueItems > 0 ? totalExpenses / totalUniqueItems : 0;
  
    // Calculate  cost
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

    // Calculate additional statistics
    const totalRecords = filteredRecords.length;
    const minExpense = filteredRecords.length > 0 ? Math.min(...filteredRecords.map(record => parseFloat(record.cost))) : 0;
    const maxExpense = filteredRecords.length > 0 ? Math.max(...filteredRecords.map(record => parseFloat(record.cost))) : 0;
    const mostExpensiveItem = filteredRecords.reduce((prev, current) => (parseFloat(prev.cost) > parseFloat(current.cost) ? prev : current));
    const leastExpensiveItem = filteredRecords.reduce((prev, current) => (parseFloat(prev.cost) < parseFloat(current.cost) ? prev : current));
    
    const percentageByCategory = {};
    const averageCostByCategory = {};
    Object.entries(expensesByCategory).forEach(([category, totalCost]) => {
      percentageByCategory[category] = (totalCost / totalExpenses) * 100;
      averageCostByCategory[category] = totalCost / (filteredRecords.filter(record => record.type === category).length || 1);
    });
  
    // Construct the report
    const report = {
      totalExpenses,
      totalUniqueItems,
      averageExpensePerItem,
      averageCost,
      expensesByCategory,
      expensesOverTime,
      totalRecords,
      minExpense,
      maxExpense,
      mostExpensiveItem,
      leastExpensiveItem,
      percentageByCategory,
      averageCostByCategory,
    };
    console.log(report);
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
          Submit :)
        </button>
      </div>
      {/* Display the generated report here */}
      {/* Display the generated report here */}
      {report && (
        <div>
          {/* Total expenses and average cost */}
          <div className="mb-8">
            <h2 className="text-xl font-semibold mb-2">Total Expenses</h2>
            <p className="text-2xl font-bold text-purple-600">${report.totalExpenses.toFixed(2)}</p>
          </div>
          <div className="mb-8">
            <h2 className="text-xl font-semibold mb-2">Average Cost</h2>
            <p className="text-2xl font-bold text-purple-600">${report.averageCost.toFixed(2)}</p>
          </div>

          {/* Other statistics in nicely formatted tables */}
          <div className="grid grid-cols-2 gap-8 mb-8">
            {/* Minimum and Maximum Expenses */}
            <div className="rounded-lg border border-purple-600 p-4 shadow-lg">
              <h2 className="text-xl font-semibold mb-2">Minimum and Maximum Expenses</h2>
              <table className="w-full border-purple-600">
                <tbody>
                  <tr>
                    <td className="font-semibold border-b border-purple-600">Min Expense: </td>
                    <td className="text-purple-600 border-b border-purple-600">${report.minExpense.toFixed(2)}</td>
                  </tr>
                  <tr>
                    <td className="font-semibold text-purple-600">Max Expense: </td>
                    <td className="text-purple-600">${report.maxExpense.toFixed(2)}</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div className="rounded-lg border border-purple-600 p-4 shadow-lg">
              <h2 className="text-xl font-semibold mb-2">Most and Least Expensive Items</h2>
              <table className="w-full border-purple-600">
                <tbody>
                  <tr>
                    <td className="font-semibold border-b border-purple-600">Most Expensive: </td>
                    <td className="text-purple-600 border-b border-purple-600">{report.mostExpensiveItem.name}</td>
                  </tr>
                  <tr>
                    <td className="font-semibold text-purple-600">Least Expensive: </td>
                    <td className="text-purple-600">{report.leastExpensiveItem.name}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* Percentage by Category and Average Cost by Category */}
          <div className="mb-8 grid grid-cols-2 gap-8">
            <div className="rounded-lg border border-purple-600 p-4 shadow-lg">
              <h2 className="text-xl font-semibold mb-2">Percentage by Category</h2>
              <ul>
                {Object.entries(report.percentageByCategory).map(([category, percentage]) => (
                  <li key={category} className="text-purple-600">{category}: {percentage.toFixed(2)}%</li>
                ))}
              </ul>
            </div>

            <div className="rounded-lg border border-purple-600 p-4 shadow-lg">
              <h2 className="text-xl font-semibold mb-2">Average Cost by Category</h2>
              <table className="w-full border-purple-600">
                <tbody>
                  {Object.entries(report.averageCostByCategory).map(([category, averageCost]) => (
                    <tr key={category}>
                      <td className="font-semibold border-b border-purple-600">{category}</td>
                      <td className="text-purple-600 border-b border-purple-600">${averageCost.toFixed(2)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Additional statistics */}
          <div className="mb-8 rounded-lg border border-purple-600 p-4 shadow-lg">
            <h2 className="text-xl font-semibold mb-2">Additional Statistics</h2>
            <table className="w-full border-purple-600">
              <tbody>
                <tr>
                  <td className="font-semibold">Total Unique Items </td>
                  <td className="font-semibold">Average Expense per Item </td>
                </tr>
                <tr>
                  <td className="text-purple-600">{report.totalUniqueItems}</td>
                  <td className="text-purple-600">${report.averageExpensePerItem.toFixed(2)}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default Report;
