import CategoryList from "@/components/Category/CategoryList";
import NavBar from "@/components/NavBar/NavBar";

const Home = () => {
  const categories = ["상의", "바지", "신발", "모자", "액세서리"];

  return (
    <div>
      <NavBar />
      {categories.map((category) => (
        <CategoryList key={category} category={category} />
      ))}
    </div>
  );
};

export default Home;
