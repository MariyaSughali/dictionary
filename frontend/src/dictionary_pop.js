import React, { useEffect, useState } from "react";
import axios from "axios";
import "./App.css";

function DictionaryPop() {
  const [languageList, setLanguageList] = useState([]);
  const [selectedLanguage, setSelectedLanguage] = useState("");
  const [categoryList, setCategoryList] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [subcategoryList, setSubcategoryList] = useState([]);
  const [selectedSubCategory, setSelectedSubCategory] = useState("");
  const [toShow, setToShow] = useState(false);
  const [data, setData] = useState([]);
  const [headings, setHeadings] = useState([]);

  useEffect(() => {
    axios
      .get("http://localhost:9090/getlanguage")
      .then((res) => {
        if (res.data && res.data.length > 0) {
          setLanguageList(res.data);
        }
      })
      .catch((error) => {
        console.error("Error fetching languages:", error);
      });
  }, []);

  const handleLanguageChange = (e) => {
    const selectedLanguageId = e.target.value;
    setSelectedLanguage(selectedLanguageId);
    axios
      .get(`http://localhost:9090/getcategory/${selectedLanguageId}`)
      .then((res) => {
        if (res.data && res.data.length > 0) {
          setCategoryList(res.data);
          setSelectedCategory("");
          setSelectedSubCategory("");
          setSubcategoryList([]);
        }
      })
      .catch((error) => {
        console.error("Error fetching categories:", error);
      });
  };

  const handleCategoryChange = (e) => {
    const selectedCategoryId = e.target.value;
    setSelectedCategory(selectedCategoryId);
    axios
      .get(`http://localhost:9090/getsubcategory/${selectedCategoryId}`)
      .then((res) => {
        if (res.data && res.data.length > 0) {
          setSubcategoryList(res.data);
          setSelectedSubCategory("");
        }
      })
      .catch((error) => {
        console.error("Error fetching subcategories:", error);
      });
  };

  const handleSubCategoryChange = (e) => {
    const selectedSubCategoryId = e.target.value;
    setSelectedSubCategory(selectedSubCategoryId);
  };

  const handleApply = async () => {
    setToShow(true);
    try {
      const res = await axios.get(
        `http://localhost:9090/getData/${selectedSubCategory}`
      );
      const responseData = res.data;

      if (responseData.length > 0) {
        setData(responseData);
        console.log(responseData);

        // Assuming the first item in the data contains headings
        if (responseData.length > 0 && responseData[0].file_data) {
          // Parse the stringified JSON to extract headings
          const parsedFileData = JSON.parse(responseData[0].file_data);

          if (Array.isArray(parsedFileData) && parsedFileData.length > 0) {
            // Access keys (headings) from the first object in the parsed array
            const firstObject = parsedFileData[0];
            const headings = Object.keys(firstObject);
            console.log(headings);
            setHeadings(headings);
          }
        }
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  return (
    <div>
      <div className="pop">
        {toShow ? (
          <div>
            {/* Content visible when toShow is true */}
            {data ? (
              <div>
                <table>
                  <thead>
                    <tr>
                      {headings.map((heading, index) => (
                        <th key={index}>{heading.toUpperCase()}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {data.map(
                      (item, index) =>
                        Array.isArray(JSON.parse(item.file_data)) &&
                        JSON.parse(item.file_data).map((entry, subIndex) => (
                          <tr key={index + "-" + subIndex}>
                            {headings.map((key, colIndex) => (
                              <td key={colIndex}>{entry[key]}</td>
                            ))}
                          </tr>
                        ))
                    )}
                  </tbody>
                </table>
              </div>
            ) : (
              <div>No File is uploaded yet!</div>
            )}
            <button onClick={() => setToShow(false)}>Back</button>
          </div>
        ) : (
          // Visible when toShow is false
          <div>
            {/* Content visible when toShow is false */}
            <p>Choose your dictionary</p>
            <label>Language </label>
            <br></br>
            <select value={selectedLanguage} onChange={handleLanguageChange}>
              <option value="">Select a language</option>
              {languageList.map((lang, index) => (
                <option key={index} value={lang.language_id}>
                  {lang.language_name}
                </option>
              ))}
            </select>

            <br></br>
            <label>Category </label>
            <br></br>
            <select value={selectedCategory} onChange={handleCategoryChange}>
              <option value="">Select a category</option>
              {categoryList.map((cat, index) => (
                <option key={index} value={cat.category_id}>
                  {cat.name}
                </option>
              ))}
            </select>

            <br></br>

            <label>Sub-category </label>
            <br></br>
            <select
              value={selectedSubCategory}
              onChange={handleSubCategoryChange}
            >
              <option value="">Select a subcategory</option>
              {subcategoryList.map((subcat, index) => (
                <option key={index} value={subcat.category_id}>
                  {subcat.name}
                </option>
              ))}
            </select>

            <br></br>
            <br></br>
            <div className="center">
              <button onClick={handleApply}>APPLY</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default DictionaryPop;
