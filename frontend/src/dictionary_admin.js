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
  const [reloadView, setReloadView] = useState(false);
  const [exists, setexists] = useState(false);

  useEffect(() => {
    axios
      .get("http://localhost:9090/getlanguage")
      .then((res) => {
        if (res.data && res.data.length > 0) {
          setLanguage(res.data);
          setFileName("");
        }
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  }, [ischanged]);

  const handleLanguageChange = (e) => {
    const selectedLanguageId = e.target.value;
    setSelectedLanguage(selectedLanguageId);
    axios
      .get(`http://localhost:9090/getcategory/${selectedLanguageId}`)
      .then((res) => {
        if (res.data && res.data.length > 0) {
          setCategories(res.data);
          setSelectedCategory("");
          setSelectedSubCategory("");
          setSubcategories([]);
        }
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  };

  const handleCategoryChange = (e) => {
    const selectedCategoryId = e.target.value;
    setSelectedCategory(selectedCategoryId);
    axios
      .get(`http://localhost:9090/getsubcategory/${selectedCategoryId}`)
      .then((res) => {
        if (res.data && res.data.length > 0) {
          setSubcategories(res.data);
          setSelectedSubCategory("");
        }
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  };

  const handleSubCategoryChange = (e) => {
    const selectedSubCategoryId = e.target.value;
    setSelectedSubCategory(selectedSubCategoryId);
  };

  const handleFile = (e) => {
    let fileTypes = [
      "application/vnd.ms-excel",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      "text/csv",
    ];
    let selectedFile = e.target.files[0];

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

  // const handleFileSubmit = async (e) => {
  //   e.preventDefault();

  //   if (excelFile !== null) {
  //     const workbook = XLSX.read(excelFile, { type: "buffer" });
  //     const worksheetName = workbook.SheetNames[0];
  //     const worksheet = workbook.Sheets[worksheetName];
  //     const datas = XLSX.utils.sheet_to_json(worksheet);
  //     // request
  //     function uploadData(datas) {
  //       const jsondata = datas.map((item) => ({
  //         original_word: item.original_word,
  //         translated_word: item.translated_word,
  //       }));

  //       const data = {
  //         category: selectedCategory,
  //         subcategory: selectedSubCategory,
  //         jsonData: jsondata,
  //         language: selectedLanguage,
  //       };

  //       axios
  //         .put("http://localhost:9090/updateData", data)
  //         .then((response) => {
  //           console.log("Axios Response: ", response.data);
  //           setReloadView(!reloadView);
  //         })
  //         .catch((error) => {
  //           console.error("Axios Error: ", error);
  //         });
  //     }

  //     axios
  //       .get(`http://localhost:9090/checkDataExists/${selectedSubCategory}`)
  //       .then((response) => {
  //         if (response.status === 200 && response.data === "Data exists") {
  //           console.log(response.status);
  //           const confirmInsert = window.confirm(
  //             "Data already exists. Do you want to replace the existing data?"
  //           );

  //           if (confirmInsert) {
  //             uploadData(datas);
  //           } else {
  //             return;
  //           }
  //         } else if (
  //           response.status === 404 &&
  //           response.data === "Data does not exist"
  //         ) {
  //           console.log(response.status);
  //           uploadData(datas);
  //         }
  //       })
  //       .catch((error) => {
  //         console.error("Error while checking data existence:", error);
  //       });

  //     //uploadData(datas);
  //     setischanged(!ischanged);
  //     setSelectedCategory("");
  //     setSelectedSubCategory("");
  //     setSelectedLanguage("");
  //     // setFileName("")
  //   }
  // };

  const handleFileSubmit = async (e) => {
    e.preventDefault();

    if (excelFile !== null) {
      const workbook = XLSX.read(excelFile, { type: "buffer" });
      const worksheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[worksheetName];
      const datas = XLSX.utils.sheet_to_json(worksheet);

      function uploadData(datas, url) {
        const jsondata = datas.map((item) => ({
          original_word: item.original_word,
          translated_word: item.translated_word,
        }));
        const data = {
          category_id: selectedSubCategory,
          jsonData: jsondata,
        };

        axios
          .put(url, data)
          .then((response) => {
            console.log("Axios Response: ", response.data);
            setReloadView(!reloadView);
          })
          .catch((error) => {
            console.error("Axios Error: ", error);
          });
      }
      axios
        .get(`http://localhost:9090/checkDataExists/${selectedSubCategory}`)
        .then((res) => {
          if (res.data.length > 0) {
            console.log("exists");
            setexists(true);
            uploadData(datas, "http://localhost:9090/updateExistingData");
          } else {
            console.log(res);
            console.log("does not exists");
            uploadData(datas, "http://localhost:9090/updateData");
          }
        })
        .catch((error) => {
          console.error("Error while checking data existence:", error);
        });

      setischanged(!ischanged);
      setSelectedCategory("");
      setSelectedSubCategory("");
      setSelectedLanguage("");
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
                <th>Language</th>
                <th>Category</th>
                <th>Subcategory</th>
                <th></th>
                <th></th>
              </thead>
              <tbody>
                <td className="body_content">
                  <select
                    value={selectedLanguage}
                    onChange={handleLanguageChange}
                  >
                    <option value="">Select a language</option>
                    {language.map((lang, index) => (
                      <option key={index} value={lang.language_id}>
                        {lang.language_name}
                      </option>
                    ))}
                  </select>
                </td>
                <td className="body_content">
                  <select
                    value={selectedCategory}
                    onChange={handleCategoryChange}
                  >
                    <option value="">Select a category</option>
                    {categories.map((cat, index) => (
                      <option key={index} value={cat.category_id}>
                        {cat.name}
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
                    {subcategories.map((subcat, index) => (
                      <option key={index} value={subcat.category_id}>
                        {subcat.name}
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
          {exists && (
            <div>
              <p> data exist</p>
            </div>
          )}

          <div className="table2">
            <DictionaryView
              ischanged={ischanged}
              reloadView={reloadView}
              key={reloadView}
            />{" "}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dictionary;
