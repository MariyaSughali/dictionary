import React, { useEffect, useState } from "react";
import axios from "axios";

function DictionaryView() {
  const [data, setData] = useState([]);
  const [toggleStates, setToggleStates] = useState([]);

  useEffect(() => {
    axios
      .get("http://localhost:9090/getData")
      .then((res) => {
        if (res.data && res.data.length > 0) {
          setData(res.data);
          const initialToggleStates = res.data.map((item) => item.isactive);
          setToggleStates(initialToggleStates);
        }
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  }, []);

  const toggleSwitch = (index) => {
    const updatedToggleStates = [...toggleStates];
    updatedToggleStates[index] = !updatedToggleStates[index];
    setToggleStates(updatedToggleStates);
  };
  const updateDataInDatabase = (id, isactive) => {
    axios
      .put(`http://localhost:9090/isactive/${id}`, { isactive })
      .then((res) => {
        if (res.status === 200) {
          console.log("Data updated successfully in the database.");
        } else {
          console.error("Unexpected response status:", res.status);
        }
      })
      .catch((error) => {
        if (error.response) {
          if (error.response.status === 404) {
            console.error("Data not found. Check the ID:", id);
          } else {
            console.error(
              "Server responded with an error status:",
              error.response.status
            );
            console.error("Error response data:", error.response.data);
          }
        } else if (error.request) {
          console.error("No response received from the server:", error.request);
        } else {
          console.error("Error setting up the request:", error.message);
        }
      });
  };

  return (
    <div>
      <div className="dictionary">
        <table>
          <thead>
            <tr>
              <th>Category</th>
              <th>Subcategory</th>
              <th>Language</th>
              <th></th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {data.map((item, index) => (
              <tr key={item.id}>
                <td>{item.category}</td>
                <td>{item.subcategory}</td>
                <td>{item.language_name}</td>
                <td>
                  <label className="switch">
                    <input
                      type="checkbox"
                      onChange={() => {
                        toggleSwitch(index);
                        updateDataInDatabase(item.id, !toggleStates[index]);
                      }}
                      checked={toggleStates[index]}
                    />
                    <span className="slider round"></span>
                  </label>
                </td>
                <td>{toggleStates[index] ? "Enabled" : "Disabled"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default DictionaryView;
