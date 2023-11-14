import React, { useEffect, useState } from "react";
import axios from "axios";

function DictionaryView({ ischanged, reloadView }) {
  const [data, setData] = useState([]);
  const [toggleStates, setToggleStates] = useState([]);

  useEffect(() => {
    axios
      .get("http://localhost:9090/getData")
      .then((res) => {
        if (res.data && res.data.length > 0) {
          setData(res.data);
          // Initialize toggle states based on data from the database
          console.log(res.data);
          const initialToggleStates = res.data.map((item) => item.is_active);
          setToggleStates(initialToggleStates);
        }
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  }, [ischanged, reloadView]);

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
        }
      })
      .catch((error) => {
        console.error("Error updating data:", error);
      });
  };

  return (
    <div>
      <div className="view_dictionary">
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
                <td>{item.parent_category_name}</td>
                <td>{item.category_name}</td>
                <td>{item.language_name}</td>
                <td>
                  <label className="switch">
                    <input
                      type="checkbox"
                      onChange={() => {
                        toggleSwitch(index);
                        updateDataInDatabase(
                          item.category_id,
                          !toggleStates[index]
                        );
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
