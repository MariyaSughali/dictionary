import React, { useEffect, useState } from "react";
import axios from "axios";

function DictionaryView() {
  const [data, setData] = useState([]);
  useEffect(() => {
    axios
      .get("http://localhost:9090/getData")
      .then((res) => {
        if (res.data && res.data.length > 0) {
          // console.log(res.data);
          setData(res.data);
        }
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  }, []);

  return (
    <div>
      <div className="dictionaryheader">DICTIONARY</div>
      <div className="dictionary">
        <table>
          <thead>
            <tr>
              <th>Category</th>
              <th>Subcategory</th>
              <th>Language</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {data.map((item, index) => (
              <tr key={index}>
                <td>{item.category}</td>
                <td>{item.subcategory}</td>
                <td>{item.language_name}</td>
                <td>
                  <button>Disable</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default DictionaryView;
