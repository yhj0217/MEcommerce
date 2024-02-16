import CategoryList from "@/components/Category/CategoryList";
import NavBar from "@/components/NavBar/NavBar";

const Home = () => {
  const categories = [
    "카테고리1",
    "카테고리2",
    "카테고리3",
    "카테고리4",
    "카테고리5",
  ];

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
