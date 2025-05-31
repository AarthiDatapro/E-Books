import React, { useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { addProductRoute, secretKey } from "../../utils/APIRoutes";
import axios from "axios";
import "../../styles/AddProduct.css";

function AddProduct() {
  const [productValues, setProductValues] = useState({
    bookName: "",
    description: "",
    category: "",
    subCategory: "",
    author: "",
    price: "",
    discPrice: "",
    bookImage: null,
    bookPdf: null,
  });

  const categoryOptions = {
    fiction: [
      "Dystopian",
      "Action & Adventure",
      "Thriller",
      "Horror",
      "Mystery",
      "Romance",
      "Historical",
      "Science",
      "Fantasy",
      "Plays",
      "Short Stories",
      "Novels",
    ],
    "non-fiction": [
      "Mythology",
      "Children",
      "Poetry",
      "Religious",
      "Inspirational",
      "Self-Help",
      "History",
      "Memoirs",
      "Autobiographies",
      "Biographies",
    ],
  };

  const toastOptions = {
    position: "bottom-right",
    autoClose: 8000,
    pauseOnHover: true,
    draggable: true,
    theme: "dark",
  };

  const handleChange = (e) => {
    const { name, value, type } = e.target;

    if (type === "file") {
      setProductValues((prevState) => ({
        ...prevState,
        [name]: e.target.files[0],
      }));
    } else {
      setProductValues((prevState) => ({
        ...prevState,
        [name]: value,
        ...(name === "category" ? { subCategory: "" } : {}),
      }));
    }
  };

  const handleValidation = () => {
    const {
      bookName,
      description,
      category,
      subCategory,
      author,
      price,
      discPrice,
      bookImage,
      bookPdf,
    } = productValues;

    if (
      !bookName ||
      !description ||
      !category ||
      !subCategory ||
      !author ||
      !price ||
      !discPrice ||
      !bookImage ||
      !bookPdf
    ) {
      toast.error("Please enter all the fields", toastOptions);
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (handleValidation()) {
      const formData = new FormData();
      formData.append("bookName", productValues.bookName);
      formData.append("description", productValues.description);
      formData.append("category", productValues.category);
      formData.append("subCategory", productValues.subCategory);
      formData.append("author", productValues.author);
      formData.append("price", productValues.price);
      formData.append("discPrice", productValues.discPrice);
      formData.append("bookImage", productValues.bookImage);
      formData.append("bookPdf", productValues.bookPdf);

      try {
        const res = await axios.post(addProductRoute, formData, {
          headers: {
            "Content-Type": "multipart/form-data",
            "api-key": secretKey
          }
        });

        if (res.data.status) {
          toast.success(res.data.msg, toastOptions);
          setProductValues({
            bookName: "",
            description: "",
            category: "",
            subCategory: "",
            author: "",
            price: "",
            discPrice: "",
            bookImage: null,
            bookPdf: null,
          });
        } else {
          toast.error(res.data.msg, toastOptions);
        }
      } catch (error) {
        toast.error("Something went wrong!", toastOptions);
      }
    }
  };

  return (
    <div className="add-product-container">
      <form className="add-product-form" onSubmit={handleSubmit}>
        <div className="form-group">
          <label className="add-label">Book Name</label>
          <input
            type="text"
            name="bookName"
            className="form-input"
            placeholder="Enter book name"
            value={productValues.bookName}
            onChange={handleChange}
          />
        </div>

        <div className="form-group">
          <label className="add-label">Description</label>
          <input
            type="text"
            name="description"
            className="form-input"
            placeholder="Enter book description"
            value={productValues.description}
            onChange={handleChange}
          />
        </div>

        <div className="form-group">
          <label className="add-label">Category</label>
          <select
            name="category"
            className="form-select"
            value={productValues.category}
            onChange={handleChange}
          >
            <option value="">Select Category</option>
            <option value="fiction">Fiction</option>
            <option value="non-fiction">Non-Fiction</option>
          </select>
        </div>

        <div className="form-group">
          <label className="add-label">Sub-Category</label>
          <select
            name="subCategory"
            className="form-select"
            value={productValues.subCategory}
            onChange={handleChange}
            disabled={!productValues.category}
          >
            <option value="">Select Sub Category</option>
            {(categoryOptions[productValues.category] || []).map((subCat) => (
              <option key={subCat} value={subCat}>
                {subCat}
              </option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label className="add-label">Author</label>
          <input
            type="text"
            name="author"
            className="form-input"
            placeholder="Enter book author"
            value={productValues.author}
            onChange={handleChange}
          />
        </div>


        <div className="form-group">
          <label className="add-label">Price (₹)</label>
          <input
            type="number"
            name="price"
            className="form-input"
            placeholder="Enter price"
            value={productValues.price}
            onChange={handleChange}
          />
        </div>
        <div className="form-group">
          <label className="add-label">Discounted Price (₹)</label>
          <input
            type="number"
            name="discPrice"
            className="form-input"
            placeholder="Enter price"
            value={productValues.discPrice}
            onChange={handleChange}
          />
        </div>

        <div className="file-input-container">
          <label className="file-input-label">
            <input
              type="file"
              name="bookImage"
              className="file-input"
              accept=".jpeg, .jpg, .png"
              onChange={handleChange}
            />
            <div className="file-input-text">
              {productValues.bookImage ? (
                <span>Selected: {productValues.bookImage.name}</span>
              ) : (
                <>
                  <i className="fas fa-cloud-upload-alt"></i> Click to upload
                  Book image
                </>
              )}
            </div>
          </label>
        </div>

        <div className="file-input-container">
          <label className="file-input-label">
            <input
              type="file"
              name="bookPdf"
              className="file-input"
              accept=".pdf"
              onChange={handleChange}
            />
            <div className="file-input-text">
              {productValues.bookPdf ? (
                <span>Selected: {productValues.bookPdf.name}</span>
              ) : (
                <>
                  <i className="fas fa-file-pdf"></i> Click to upload
                  Book PDF
                </>
              )}
            </div>
          </label>
        </div>

        <button type="submit" className="submit-button">
          Add Product
        </button>
      </form>
      <ToastContainer />
    </div>
  );
}

export default AddProduct;
