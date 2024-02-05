import React, { useState, useRef } from "react";
import ImageCarousel from "@/components/Product/ImageCarousel";
import { storage, auth, db } from "../firebase";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { Timestamp } from "firebase/firestore";
import { addDoc, collection } from "firebase/firestore";
import { Button } from "@/components/ui/button";

interface Product {
  sellerId: string;
  productName: string;
  productPrice: number;
  productQuantity: number;
  productDescription: string;
  productCategory: string;
  productImage: string[];
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

const ProductUpload = () => {
  const categories = [
    "카테고리1",
    "카테고리2",
    "카테고리3",
    "카테고리4",
    "카테고리5",
  ];

  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [productDetail, setProductDetail] = useState("");
  const [productName, setProductName] = useState("");
  const [productPrice, setProductPrice] = useState<null | number>(null);
  const [productQuantity, setProductQuantity] = useState<null | number>(null);
  const [productCategory, setProductCategory] = useState(categories[0]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      const fileArray = Array.from(event.target.files);
      setSelectedFiles((prevFiles) => [...prevFiles, ...fileArray]);
    }

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleUpload = async () => {
    if (selectedFiles.length === 0) {
      alert("상품 이미지를 첨부해주세요.");
      return;
    }

    const urls: string[] = [];
    for (const file of selectedFiles) {
      const imageRef = ref(
        storage,
        `products/${file.name}_${new Date().getTime()}`
      );
      await uploadBytesResumable(imageRef, file);
      const url = await getDownloadURL(imageRef);
      urls.push(url);
    }

    const product: Product = {
      sellerId: auth.currentUser?.uid || "",
      productName,
      productPrice: productPrice || 0,
      productQuantity: productQuantity || 0,
      productDescription: productDetail,
      productCategory,
      productImage: urls,
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now(),
    };

    try {
      const productsCollection = collection(db, "products");
      await addDoc(productsCollection, product);
      alert("상품이 성공적으로 등록되었습니다.");
      setProductName("");
      setProductDetail("");
      setProductPrice(null);
      setProductQuantity(null);
      setSelectedFiles([]);
      setProductCategory("");
    } catch (e) {
      console.error("Error adding document: ", e);
    }
  };

  const handlePriceChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    if (value != "") {
      setProductPrice(parseInt(value));
    } else {
      setProductPrice(0);
    }
  };

  const handleQuantityChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    if (value != "") {
      setProductQuantity(parseInt(value));
    } else {
      setProductQuantity(0);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center space-y-4">
      <h1 className="text-2xl font-bold">상품 등록 페이지입니다</h1>
      <input
        type="file"
        multiple
        onChange={handleFileSelect}
        ref={fileInputRef}
        className="mt-5"
      />
      {selectedFiles.length > 0 && (
        <ImageCarousel
          selectedFiles={selectedFiles}
          setSelectedFiles={setSelectedFiles}
          imageUrls={[]}
          setImageUrls={() => {}}
        />
      )}
      <input
        type="text"
        value={productName}
        onChange={(e) => setProductName(e.target.value)}
        placeholder="상품 이름을 입력하세요."
        className="w-64 p-2 border border-gray-300 rounded"
      />
      <div className="relative w-64">
        <input
          type="number"
          value={productPrice ?? ""}
          onChange={handlePriceChange}
          placeholder="상품 가격을 입력하세요."
          className="w-full p-2 border border-gray-300 rounded [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
        />
        <span className="absolute inset-y-0 flex items-center text-gray-500 right-2">
          ₩
        </span>
      </div>
      <div className="relative w-64">
        <input
          type="number"
          value={productQuantity ?? ""}
          onChange={handleQuantityChange}
          placeholder="상품 수량을 입력하세요."
          className="w-full p-2 border border-gray-300 rounded [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
        />
        <span className="absolute inset-y-0 flex items-center text-gray-500 right-2">
          개
        </span>
      </div>
      <select
        className="w-64 p-2 border border-gray-300 rounded"
        value={productCategory}
        onChange={(e) => setProductCategory(e.target.value)}
      >
        {categories.map((category) => (
          <option key={category} value={category}>
            {category}
          </option>
        ))}
      </select>
      <textarea
        value={productDetail}
        onChange={(e) => setProductDetail(e.target.value)}
        placeholder="상품 상세 정보를 입력하세요."
        className="w-64 h-24 p-2 border border-gray-300 rounded"
      />
      <Button
        onClick={handleUpload}
        className="px-4 py-2 text-white bg-blue-500 rounded"
      >
        상품 등록
      </Button>
    </div>
  );
};

export default ProductUpload;
