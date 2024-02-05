import React, { useState, useRef, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import ImageCarousel from "@/components/Product/ImageCarousel";
import { storage, auth, db } from "../firebase";
import {
  ref,
  uploadBytesResumable,
  getDownloadURL,
  deleteObject,
} from "firebase/storage";
import {
  Timestamp,
  doc,
  getDoc,
  updateDoc,
  deleteDoc,
} from "firebase/firestore";
import { Button } from "@/components/ui/button";

const ProductManage = () => {
  const categories = [
    "카테고리1",
    "카테고리2",
    "카테고리3",
    "카테고리4",
    "카테고리5",
  ];
  const { id: productId } = useParams<{ id: string }>();
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [productDetail, setProductDetail] = useState("");
  const [productName, setProductName] = useState("");
  const [productPrice, setProductPrice] = useState<null | number>(null);
  const [productQuantity, setProductQuantity] = useState<null | number>(null);
  const [productCategory, setProductCategory] = useState(categories[0]);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [originalImages, setOriginalImages] = useState<string[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProduct = async () => {
      if (!productId) {
        console.error("Product ID is undefined");
        return;
      }

      const productDoc = doc(db, "products", productId);
      const productData = await getDoc(productDoc);
      const product = productData.data();
      if (product) {
        setProductName(product.productName);
        setProductDetail(product.productDescription);
        setProductPrice(product.productPrice);
        setProductQuantity(product.productQuantity);
        setProductCategory(product.productCategory);
        setOriginalImages(product.productImage);
      }
    };
    fetchProduct();
  }, [productId]);

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (!event.target.files) return;

    const files = Array.from(event.target.files).map((file) => {
      const newFile = new File([file], `${file.name}_${new Date().getTime()}`, {
        type: file.type,
      });
      return newFile;
    });

    setSelectedFiles([...selectedFiles, ...files]); // 원래 있던 이미지 뒤에 추가
  };

  const handleUpload = async () => {
    if (selectedFiles.length === 0 && originalImages.length === 0) {
      alert("상품 이미지를 첨부해주세요.");
      return;
    }

    const confirmUpdate = window.confirm("상품 정보를 수정하시겠습니까?");
    if (!confirmUpdate) {
      return; // 사용자가 취소버튼을 누르면 수정을 취소합니다.
    }

    const urls: string[] = [...originalImages];
    for (const file of selectedFiles) {
      const imageRef = ref(storage, `products/${file.name}`);
      await uploadBytesResumable(imageRef, file);
      const url = await getDownloadURL(imageRef);
      urls.push(url);
    }

    const product = {
      sellerId: auth.currentUser?.uid || "",
      productName,
      productPrice: productPrice || 0,
      productQuantity: productQuantity || 0,
      productDescription: productDetail,
      productCategory,
      productImage: urls,
      updatedAt: Timestamp.now(),
    };

    try {
      if (!productId) {
        throw new Error("Product ID is undefined");
      }

      const productDoc = doc(db, "products", productId);
      await updateDoc(productDoc, {
        sellerId: product.sellerId,
        productName: product.productName,
        productPrice: product.productPrice,
        productQuantity: product.productQuantity,
        productDescription: product.productDescription,
        productCategory: product.productCategory,
        productImage: product.productImage,
        updatedAt: product.updatedAt,
      });
      alert("상품이 성공적으로 수정되었습니다.");
      navigate("/mypage/product-list", { replace: true });
    } catch (e) {
      console.error("Error updating document: ", e);
    }

    // 새로운 이미지가 업로드되면 기존 이미지를 삭제합니다.
    if (urls.length > 0) {
      originalImages.forEach(async (imageUrl) => {
        const imageRef = ref(storage, imageUrl);
        await deleteObject(imageRef);
      });
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

  const handleDelete = async () => {
    if (!productId) {
      console.error("Product ID is undefined");
      return;
    }

    const confirmDelete = window.confirm("정말 삭제하시겠습니까?");
    if (!confirmDelete) {
      return; // 사용자가 취소버튼을 누르면 삭제를 취소합니다.
    }

    // 데이터베이스에서 상품 데이터를 삭제합니다.
    const productDoc = doc(db, "products", productId);
    await deleteDoc(productDoc);

    // 스토리지에서 상품 이미지를 삭제합니다.
    for (const imageUrl of originalImages) {
      const imageRef = ref(storage, imageUrl);
      await deleteObject(imageRef);
    }

    alert("상품이 성공적으로 삭제되었습니다.");
    navigate("/mypage/product-list", { replace: true });
  };

  return (
    <div className="flex flex-col items-center justify-center space-y-4">
      <h1 className="text-2xl font-bold">상품 수정 페이지입니다</h1>
      <input
        type="file"
        multiple
        onChange={handleFileSelect}
        ref={fileInputRef}
        className="mt-5"
      />
      <ImageCarousel
        selectedFiles={selectedFiles}
        setSelectedFiles={setSelectedFiles}
        imageUrls={originalImages}
        setImageUrls={setOriginalImages}
      />
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
        상품 수정
      </Button>
      <Button
        onClick={handleDelete}
        className="px-4 py-2 text-white bg-red-500 rounded"
      >
        상품 삭제
      </Button>
    </div>
  );
};

export default ProductManage;
