import { v4 as uuidv4 } from "uuid";

export async function getMeals(page) {
  return getMockMeals(page);
}

// Using this function to implement/test infinite scrolling.
// Mock paginated API - returns 10 meals per page
async function getMockMeals(page) {
  const images = Array.from(
    { length: 20 },
    (_, i) => `https://picsum.photos/200/200?random=${i + 1}`
  );
  const start = (page - 1) * 10 + 1;
  const end = Math.min(start + 9, 100);

  await new Promise((res) => setTimeout(res, 2000)); // simulate delay

  return Array.from({ length: end - start + 1 }, (_, i) => {
    const id = uuidv4();
    const index = start + i;
    return {
      id,
      name: `Meal ${index}`,
      calories: 300 + Math.floor(Math.random() * 200),
      image: images[index % images.length],
    };
  });
}
