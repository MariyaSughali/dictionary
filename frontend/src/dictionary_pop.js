import React, { useEffect, useState } from "react";
import axios from "axios";

function DictionaryPop() {
  const [data, setData] = useState([]);
  const [categoryFilter, setCategoryFilter] = useState("All");
  const [subcategoryFilter, setSubcategoryFilter] = useState("All");
  const [languageFilter, setLanguageFilter] = useState("All");
  const [subcategories, setSubcategories] = useState([]);
  const [filteredData, setFilteredData] = useState([]);

  useEffect(() => {
    axios
      .get("http://localhost:9090/getData")
      .then((res) => {
        if (res.data && res.data.length > 0) {
          const filteredData = res.data.filter(
            (item) => item.is_active === true || item.is_active === null
          );
          setData(filteredData);
          console.log(filteredData);
        }
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  }, []);

  useEffect(() => {
    const filteredSubcategories = [
      ...new Set(
        data
          .filter((item) => item.parent_category_name === categoryFilter)
          .map((item) => item.category_name)
      ),
    ];
    setSubcategories(filteredSubcategories);
  }, [categoryFilter, data]);

  useEffect(() => {
    const updatedFilteredData = data.filter((item) => {
      return (
        (categoryFilter === "All" ||
          item.parent_category_name === categoryFilter) &&
        (subcategoryFilter === "All" ||
          item.category_name === subcategoryFilter) &&
        (languageFilter === "All" || item.language_name === languageFilter)
      );
    });
    console.log(updatedFilteredData);
    setFilteredData(updatedFilteredData);
  }, [categoryFilter, subcategoryFilter, languageFilter, data]);

  // const handleFilter = (e) => {
  //   const inputValue = e.target.value.toLowerCase();

  //   const updatedFilteredData = data.map((item) => ({
  //     ...item,
  //     data: item.file_data.filter(
  //       (entry) =>
  //         entry.original_word.toLowerCase().startsWith(inputValue) &&
  //         (categoryFilter === "All" ||
  //           item.parent_category_name === categoryFilter) &&
  //         (subcategoryFilter === "All" ||
  //           item.category_name === subcategoryFilter) &&
  //         (languageFilter === "All" || item.language_name === languageFilter)
  //     ),
  //   }));

  //   setFilteredData(updatedFilteredData);
  // };

  return (
    <div>
      <p>DICTIONARY</p>
      <div className="dictionary">
        <label>
          Language:
          <select
            value={languageFilter}
            onChange={(e) => setLanguageFilter(e.target.value)}
          >
            <option value="All">All</option>
            {[...new Set(data.map((item) => item.language_name))].map(
              (language) => (
                <option key={language} value={language}>
                  {language}
                </option>
              )
            )}
          </select>
        </label>
        <br></br>
        <br></br>
        <label>
          Category:
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
          >
            <option value="All">All</option>
            {[...new Set(data.map((item) => item.parent_category_name))].map(
              (category_name) => (
                <option key={category_name} value={category_name}>
                  {category_name}
                </option>
              )
            )}
          </select>
        </label>

        <label>
          Subcategory:
          <select
            value={subcategoryFilter}
            onChange={(e) => setSubcategoryFilter(e.target.value)}
          >
            <option value="All">All</option>
            {subcategories.map((category_name) => (
              <option key={category_name} value={category_name}>
                {category_name}
              </option>
            ))}
          </select>
        </label>

        <br></br>
        <br></br>

        {/* <label>
          Search <input type="text" onChange={handleFilter}></input>
        </label> */}
        <table>
          <thead>
            <tr>
              <th>ORIGINAL WORD</th>
              <th>TRANSLATED WORD</th>
            </tr>
          </thead>
          <tbody>
            {filteredData.length > 0 ? (
              filteredData.map((item, index) =>
                item.file_data.map((entry, subIndex) => (
                  <tr key={index + "-" + subIndex}>
                    <td>{entry.original_word}</td>
                    <td>{entry.translated_word}</td>
                  </tr>
                ))
              )
            ) : (
              <tr>
                <td colSpan="2">No data available</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default DictionaryPop;
