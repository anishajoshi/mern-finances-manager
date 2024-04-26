import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";

export default function Record() {
  const [form, setForm] = useState({
    name: "",
    cost: "",
    type: "",
    date: "",
  });
  const [isNew, setIsNew] = useState(true);
  const [errors, setErrors] = useState({});
  const params = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchData() {
      const id = params.id?.toString() || undefined;
      if(!id) return;
      setIsNew(false);
      const response = await fetch(
        `http://localhost:5050/record/${params.id.toString()}`
      );
      if (!response.ok) {
        const message = `An error has occurred: ${response.statusText}`;
        console.error(message);
        return;
      }
      const record = await response.json();
      if (!record) {
        console.warn(`Record with id ${id} not found`);
        navigate("/");
        return;
      }
      setForm(record);
    }
    fetchData();
    return;
  }, [params.id, navigate]);

  // These methods will update the state properties.
  function updateForm(value) {
    return setForm((prev) => {
      return { ...prev, ...value };
    });
  }

  // Making sure that fields aren't left empty
  function validateForm() {
    const errors = {};
    if (!form.name.trim()) {
      errors.name = "Name field is required";
    }
    if (!form.cost.trim()) {
      errors.cost = "Cost field is required";
    }
    if (!form.date.trim()) {
      errors.date = "Date field is required";
    }
    setErrors(errors);
    return Object.keys(errors).length === 0;
  }

  // Handling the submission - this is what gets executed when submit button is pressed
  async function onSubmit(e) {
    e.preventDefault();
    if (!validateForm()) {
      return; // Don't submit if there are validation errors
    }
    const expense = { ...form };
    try {
      let response;
      if (isNew) {
        // adding a new record - we will POST (CREATE) to /record.
        response = await fetch("http://localhost:5050/record", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(expense),
        });
      } else {
        // we will PATCH (this is UPDATING) to /record/:id.
        response = await fetch(`http://localhost:5050/record/${params.id}`, {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(expense),
        });
      }
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      // Providing feedback to the user that their record was saved well
      alert("Expense record saved successfully!");
      navigate("/");

    } catch (error) {
      console.error('A problem occurred with your fetch operation: ', error);
      // Provide error feedback to the user
      alert("An error occurred while saving the expense record. Please try again.");
    } finally {
      setForm({ name: "", cost: "", type: "", date: "" });
      navigate("/");
    }
  }

  // This following section will display the form that takes the input from the user.
  return (
    <>
      <h3 className="text-lg font-semibold p-4">Add or Update your Expenses here!</h3>
      <form
        onSubmit={onSubmit}
        className="border rounded-lg overflow-hidden p-4 shadow-lg ring-2 ring-purple-500 ring-opacity-100"
      >
        {/* Error messages */}
        {errors.name && <p className="text-red-500">{errors.name}</p>}
        {errors.cost && <p className="text-red-500">{errors.cost}</p>}
        {errors.type && <p className="text-red-500">{errors.type}</p>}
        {errors.date && <p className="text-red-500">{errors.date}</p>}
        <div>
          <div className="grid max-w-2xl grid-cols-1 gap-x-6 gap-y-8 ">
            {/*Expense name part of the Form starts here*/}
            <div className="sm:col-span-4">
              <label
                htmlFor="name"
                className="block text-md font-medium leading-6"
              >
                Expense Name
              </label>
              <div className="mt-2">
                <div className="flex rounded-md shadow-sm ring-1 ring-inset ring-slate-300 sm:max-w-md">
                  <input
                    type="text"
                    name="name"
                    id="name"
                    className="block flex-1 border-0 bg-transparent py-1.5 pl-1 text-slate-900 placeholder-slate focus:ring-0 sm:text-sm sm:leading-6"
                    placeholder="eg. Iced Matcha"
                    value={form.name}
                    onChange={(e) => updateForm({ name: e.target.value })}
                  />
                </div>
              </div>
            </div>

            <div className="sm:col-span-4">
              <label
                htmlFor="cost"
                className="block text-md font-medium leading-6 text-slate-900"
              >
                Cost
              </label>
              <div className="mt-2">
                <div className="flex rounded-md shadow-sm ring-1 ring-inset ring-slate-300 sm:max-w-md">
                  <input
                    type="number" //type is number here ; need to cross check if this works
                    name="cost"
                    id="cost"
                    className="block flex-1 border-0 bg-transparent py-1.5 pl-1 text-slate-900 placeholder:text-slate-400 focus:ring-0 sm:text-sm sm:leading-6"
                    placeholder="eg. 5.99"
                    value={form.cost}
                    onChange={(e) => updateForm({ cost: e.target.value })}
                    step="0.01" // Allow decimals if needed
                  />
                </div>
              </div>
            </div>

            <div className="sm:col-span-4">
              <label
                htmlFor="type"
                className="block text-md font-medium leading-6 text-slate-900"
              >
                Type
              </label>
              <div className="mt-2">
                <div className="flex rounded-md shadow-sm ring-1 ring-inset ring-slate-300 sm:max-w-md">
                  <select
                    id="type"
                    name="type"
                    className="block flex-1 border-0 bg-transparent py-1.5 pl-1 text-slate-900 placeholder:text-slate-400 focus:ring-0 sm:text-sm sm:leading-6"
                    value={form.type}
                    onChange={(e) => updateForm({ type: e.target.value })}
                  >
                    <option value="Food">Food</option>
                    <option value="Transportation">Transportation</option>
                    <option value="Housing">Housing</option>
                    <option value="Entertainment">Clothing</option>
                    <option value="Recreation">Recreation</option>
                    <option value="Health">Health</option>
                    <option value="Education">Education</option>
                    <option value="Miscallaneous">Miscallaneous</option>
                  </select>
                </div>
              </div>
            </div>
            <div className="sm:col-span-4">
              <label
                htmlFor="date"
                className="block text-md font-medium leading-6 text-slate-900"
              >
                Date
              </label>
              <div className="mt-2">
                <div className="flex rounded-md shadow-sm ring-1 ring-inset ring-slate-300 focus-within:ring-2 focus-within:ring-inset focus-within:ring-indigo-600 sm:max-w-md">
                  <input
                    type="date"
                    name="date"
                    id="date"
                    className="block flex-1 border-0 bg-transparent py-1.5 pl-1 text-slate-900 placeholder:text-slate-400 focus:ring-0 sm:text-sm sm:leading-6"
                    value={form.date}
                    onChange={(e) => updateForm({ date: e.target.value })}
                    max={new Date().toISOString().split('T')[0]} // Set max date to current date to make sure User can't choose further dates
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
        <input
          type="submit"
          value="Save Expense Record"
          className="inline-flex items-center justify-center whitespace-nowrap text-md font-medium ring-offset-background transition-colors 
          focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none 
          disabled:opacity-50 border border-input bg-background hover:bg-blue-100 hover:text-accent-foreground h-9 rounded-md px-3 cursor-pointer mt-4
          ring-2 ring-blue-500 ring-opacity-50 shadow-md"
        />
      </form>
    </>
  );
}