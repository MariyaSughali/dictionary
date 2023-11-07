import React, { useEffect, useState } from "react";
import axios from "axios";

function DictionaryPop() {
  const [data, setData] = useState([]);
  const [categoryFilter, setCategoryFilter] = useState("All");
  const [subcategoryFilter, setSubcategoryFilter] = useState("All");
  const [languageFilter, setLanguageFilter] = useState("All");
  const [subcategories, setSubcategories] = useState([]);

  useEffect(() => {
    axios
      .get("http://localhost:9090/getData")
      .then((res) => {
        if (res.data && res.data.length > 0) {
          setData(res.data);
        }
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  }, []);

  // Update subcategories whenever a category is selected
  useEffect(() => {
    if (categoryFilter !== "All") {
      const filteredSubcategories = [
        ...new Set(
          data
            .filter((item) => item.category === categoryFilter)
            .map((item) => item.subcategory)
        ),
      ];
      setSubcategories(filteredSubcategories);
    } else {
      setSubcategories([]);
    }
  }, [categoryFilter, data]);

  const filteredData = data.filter((item) => {
    return (
      (categoryFilter === "All" || item.category === categoryFilter) &&
      (subcategoryFilter === "All" || item.subcategory === subcategoryFilter) &&
      (languageFilter === "All" || item.language_name === languageFilter)
    );
  });

  return (
    <div>
      <p>DICTIONARY</p>
      <div className="dictionary">
        <label>
          Category:
          <select onChange={(e) => setCategoryFilter(e.target.value)}>
            <option value="All">All</option>
            {[...new Set(data.map((item) => item.category))].map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
        </label>

        {categoryFilter !== "All" && (
          <label>
            Subcategory:
            <select onChange={(e) => setSubcategoryFilter(e.target.value)}>
              <option value="All">All</option>
              {subcategories.map((subcategory) => (
                <option key={subcategory} value={subcategory}>
                  {subcategory}
                </option>
              ))}
            </select>
          </label>
        )}

        <label>
          Language:
          <select onChange={(e) => setLanguageFilter(e.target.value)}>
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
        <table>
          <thead>
            <tr>
              <th>ORIGINAL WORD</th>
              <th>TRANSLATED WORD</th>
            </tr>
          </thead>
          <tbody>
            {filteredData.map((item, index) =>
              item.data.map((entry, subIndex) => (
                <tr key={index + "-" + subIndex}>
                  <td>{entry.original_word}</td>
                  <td>{entry.translated_word}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default DictionaryPop;
