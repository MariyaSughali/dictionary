import React, { useEffect, useState } from "react";
import axios from "axios";
import * as XLSX from "xlsx";
import "./App.css";
import DictionaryView from "./dictionary_view";
import Topbar from "./topbar";
import Sidebar from "./sidebar";

function Dictionary() {
  const [language, setLanguage] = useState([]);
  const [selectedLanguage, setSelectedLanguage] = useState("");
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [subcategories, setSubcategories] = useState([]);
  const [selectedSubCategory, setSelectedSubCategory] = useState("");
  const [excelFile, setExcelFile] = useState(null);
  const [typeError, setTypeError] = useState(null);
  const [fileName, setFileName] = useState("");
  const [ischanged, setischanged] = useState("true");

  useEffect(() => {
    axios
      .get("http://localhost:9090/getcategory")
      .then((res) => {
        if (res.data && res.data.length > 0) {
          setCategories(res.data);
        }
      })
      .catch((error) => {
        console.error("Error:", error);
      });
    axios
      .get("http://localhost:9090/getlanguage")
      .then((res) => {
        if (res.data && res.data.length > 0) {
          // console.log(res.data);
          setLanguage(res.data);
          setFileName("");
        }
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  }, [ischanged]);

  const handleCategoryChange = (e) => {
    const category = e.target.value;
    setSelectedCategory(category);

    axios
      .get(`http://localhost:9090/getsubcategory/${category}`)
      .then((res) => {
        setSubcategories(res.data);
      });
  };

  const handleSubCategoryChange = (e) => {
    const subcategory = e.target.value;
    setSelectedSubCategory(subcategory);
  };
  const handleLanguageChange = (e) => {
    const language = e.target.value;
    setSelectedLanguage(language);
  };

  const handleFile = (e) => {
    let fileTypes = [
      "application/vnd.ms-excel",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      "text/csv",
    ];
    let selectedFile = e.target.files[0];
    // console.log("handlefile");

    if (selectedFile) {
      if (selectedFile && fileTypes.includes(selectedFile.type)) {
        setTypeError(null);
        let reader = new FileReader();
        reader.readAsArrayBuffer(selectedFile);
        reader.onload = (e) => {
          setExcelFile(e.target.result);
          setFileName(selectedFile.name);
        };
      } else {
        setTypeError("Please select only excel file types");
        setExcelFile(null);
      }
    } else {
      console.log("Please select your file");
    }
  };

  const handleFileSubmit = async (e) => {
    e.preventDefault();

    if (excelFile !== null) {
      const workbook = XLSX.read(excelFile, { type: "buffer" });
      const worksheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[worksheetName];
      const datas = XLSX.utils.sheet_to_json(worksheet);
      // request
      function uploadData(datas) {
        const jsondata = datas.map((item) => ({
          original_word: item.original_word,
          translated_word: item.translated_word,
        }));
        // console.log(jsondata);

        const data = {
          category: selectedCategory,
          subcategory: selectedSubCategory,
          jsonData: jsondata,
          language: selectedLanguage,
        };

        axios
          .put("http://localhost:9090/updateData", data)
          .then((response) => {
            console.log("Axios Response: ", response.data);
          })
          .catch((error) => {
            console.error("Axios Error: ", error);
          });
      }

      uploadData(datas);
      setischanged(!ischanged);
      setSelectedCategory("");
      setSelectedSubCategory("");
      setSelectedLanguage("");
      // setFileName("")
    }
  };

  return (
    <div>
      <Topbar />

      <div className="dictionary">
        <Sidebar />
        <div className="table1">
          <div className="tables">
            <table>
              <thead>
                <th>Category</th>
                <th>Subcategory</th>
                <th>Language</th>
                <th></th>
                <th></th>
              </thead>
              <tbody>
                <td className="body_content">
                  <select
                    value={selectedCategory}
                    onChange={handleCategoryChange}
                  >
                    <option value="">Select a category</option>
                    {categories.map((category, index) => (
                      <option key={index} value={category}>
                        {category}
                      </option>
                    ))}
                  </select>
                </td>
                <td className="body_content">
                  <select
                    value={selectedSubCategory}
                    onChange={handleSubCategoryChange}
                  >
                    <option value="">Select a subcategory</option>
                    {subcategories.map((subcategory, index) => (
                      <option key={index} value={subcategory}>
                        {subcategory}
                      </option>
                    ))}
                  </select>
                </td>
                <td className="body_content">
                  <select
                    value={selectedLanguage}
                    onChange={handleLanguageChange}
                  >
                    <option value="">Select a language</option>
                    {language.map((language, index) => (
                      <option key={index} value={language}>
                        {language}
                      </option>
                    ))}
                  </select>
                </td>
                <td>
                  <label htmlFor="file" className="label">
                    {fileName || "Upload file"}
                  </label>
                  <input
                    className="input"
                    type="file"
                    accept=".xlsx"
                    id="file"
                    required
                    onChange={handleFile}
                  />
                  {typeError && <div role="alert">{typeError}</div>}
                </td>
                <td>
                  {" "}
                  <button type="submit" onClick={handleFileSubmit}>
                    SUBMIT
                  </button>
                </td>
              </tbody>
            </table>
          </div>

          <div className="table2">
            <DictionaryView ischanged={ischanged} />
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dictionary;
