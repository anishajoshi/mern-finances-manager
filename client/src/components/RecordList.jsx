import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const Record = (props) => (
  <tr className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
    <td className="p-4 align-middle [&amp;:has([role=checkbox])]:pr-0">
      {props.record.name}
    </td>
    <td className="p-4 align-middle [&amp;:has([role=checkbox])]:pr-0">
      {props.record.cost}
    </td>
    <td className="p-4 align-middle [&amp;:has([role=checkbox])]:pr-0">
      {props.record.type}
    </td>
    <td className="p-4 align-middle [&amp;:has([role=checkbox])]:pr-0">
      {props.record.date}
    </td>
    <td className="p-4 align-middle [&amp;:has([role=checkbox])]:pr-0">
      <div className="flex gap-2">
        <Link
          className="inline-flex items-center justify-center whitespace-nowrap text-sm font-medium ring-offset-background 
          transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 
          disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-blue-100 h-9 rounded-md px-5
          shadow-md border-blue-500"
          to={`/edit/${props.record._id}`}
        >
          Edit
        </Link>
        <button
          className="inline-flex items-center justify-center whitespace-nowrap text-sm font-medium ring-offset-background 
          transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 
          disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-red-100 hover:text-accent-foreground
          h-9 rounded-md px-3 shadow-md border-red-500"
          type="button"
          onClick={() => {
            props.deleteRecord(props.record._id);
          }}
        >
          Delete
        </button>
      </div>
    </td>
  </tr>
);

export default function RecordList() {
  const [records, setRecords] = useState([]);
  const [filterType, setFilterType] = useState("");
  const [minAmount, setMinAmount] = useState("");
  const [maxAmount, setMaxAmount] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [filteredRecords, setFilteredRecords] = useState([]);

  useEffect(() => {
    async function getRecords() {
      const response = await fetch(`http://localhost:5050/record/`);
      if (!response.ok) {
        const message = `An error occurred: ${response.statusText}`;
        console.error(message);
        return;
      }
      const records = await response.json();
      setRecords(records);
      setFilteredRecords(records);
    }
    getRecords();
  }, []);

  function applyFilters() {
    let filtered = records;

    if (filterType) {
      filtered = filtered.filter((record) => record.type === filterType);
    }

    /* 
    Integrated input sanitizations for minAmount and maxAmount inputs in the applyFilters function. 
    It checks if the inputs are not empty and if they are valid numbers before applying the filter.
    By using a calendar input directly, it automatically also sanitizes input.  
    */

    if (minAmount !== "" && !isNaN(minAmount)) { // Validate minAmount
      filtered = filtered.filter((record) => record.cost >= parseFloat(minAmount));
    }

    if (maxAmount !== "" && !isNaN(maxAmount)) { // Validate maxAmount
      filtered = filtered.filter((record) => record.cost <= parseFloat(maxAmount));
    }  
  
    if (startDate) {
      filtered = filtered.filter(
        (record) => new Date(record.date) >= new Date(startDate)
      );
    }

    if (endDate) {
      filtered = filtered.filter(
        (record) => new Date(record.date) <= new Date(endDate)
      );
    }

    setFilteredRecords(filtered);
  }

  function clearFilters() {
    setFilterType("");
    setMinAmount("");
    setMaxAmount("");
    setStartDate("");
    setEndDate("");
    setFilteredRecords(records);
  }

  function recordList() {

    return filteredRecords.map((record) => {
      return (
        <Record
          record={record}
          deleteRecord={() => deleteRecord(record._id)}
          key={record._id}
        />
      );
    });
  }

  function getUniqueTypes() {
    const types = new Set();
    records.forEach((record) => types.add(record.type));
    return Array.from(types);
  }

  return (
    <>
      <h3 className="text-lg font-semibold p-4">All Your Expenses!</h3>
      <div className="border rounded-lg overflow-hidden shadow-lg border-purple-600">
        <div className="p-4 space-y-4">
          <div className="flex items-center justify-center space-x-4">
          <select
            className="border rounded-md p-2 focus:outline-none"
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
          >
            <option value="">Select Type</option>
            {getUniqueTypes().map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </select>
            <input
              type="number"
              placeholder="Min Amount"
              value={minAmount}
              onChange={(e) => setMinAmount(e.target.value)}
              className="border rounded-md p-2 focus:outline-none"
            />
            <input
              type="number"
              placeholder="Max Amount"
              value={maxAmount}
              onChange={(e) => setMaxAmount(e.target.value)}
              className="border rounded-md p-2 focus:outline-none"
            />
            <input
              type="date"
              placeholder="Start Date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="border rounded-md p-2 focus:outline-none"
            />
            <input
              type="date"
              placeholder="End Date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="border rounded-md p-2 focus:outline-none"
            />
            <button
              onClick={applyFilters}
              className="bg-purple-600 text-white px-4 py-2 rounded-md hover:bg-purple-700 transition-colors focus:outline-none"
            >
              Filter
            </button>
            <button
              onClick={clearFilters}
              className="bg-gray-300 text-gray-800 px-4 py-2 rounded-md hover:bg-gray-400 transition-colors focus:outline-none"
            >
              Clear
            </button>
          </div>
        </div>
        <div className="relative w-full overflow-auto">
          <table className="w-full caption-bottom text-md">
            <thead className="[&amp;_tr]:border-b">
              <tr className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
                <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground [&amp;:has([role=checkbox])]:pr-0">
                  Name
                </th>
                <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground [&amp;:has([role=checkbox])]:pr-0">
                  Expense Amount
                </th>
                <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground [&amp;:has([role=checkbox])]:pr-0">
                  Type
                </th>
                <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground [&amp;:has([role=checkbox])]:pr-0">
                  Date of Expense
                </th>
                <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground [&amp;:has([role=checkbox])]:pr-0">
                  Edit / Delete Actions
                </th>
              </tr>
            </thead>
            <tbody className="[&amp;_tr:last-child]:border-0">{recordList()}</tbody>
          </table>
        </div>
      </div>
    </>
  );
}
