import { v4 as uuidv4 } from "uuid";

export async function getMeals(page) {
  return getMockMeals(page);
}

// Mock paginated API
// code to return meals with Food images instead of generic ones from the internet.
async function getMockMeals(page) {
  const mealSlugs = shuffleArray([
    "beef-tacos",
    "caesar-salad",
    "chicken-curry",
    "chocolate-brownie",
    "eggplant-parmesan",
    "falafel-wrap",
    "grilled-chicken-sandwich",
    "lemon-cheesecake",
    "lobster-bisque",
    "mac-and-cheese",
    "margherita-pizza",
    "miso-ramen",
    "mushroom-risotto",
    "pancake-stack",
    "seafood-paella",
    "spaghetti-carbonara",
    "steak-frites",
    "sushi-roll-platter",
    "vegan-buddha-bowl",
    "veggie-burger",
  ]);

  const pageSize = 10;
  const start = (page - 1) * pageSize + 1;
  const end = Math.min(start + pageSize - 1, 100);

  await new Promise((res) => setTimeout(res, 1000)); // simulate delay

  return Array.from({ length: end - start + 1 }, (_, i) => {
    const id = uuidv4();
    const slug = mealSlugs[i % mealSlugs.length];
    return {
      id,
      name: toTitleCase(slug),
      calories: 300 + Math.floor(Math.random() * 200),
      image: `/assets/meals/${slug}.jpg`,
    };
  });
}

// consider seed parameter to allow deterministic output for testing
function shuffleArray(array) {
  return array
    .map((value) => ({ value, sort: Math.random() }))
    .sort((a, b) => a.sort - b.sort)
    .map(({ value }) => value);
}

function toTitleCase(slug) {
  return slug.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
}

async function getMockMealsGenericImages(page) {
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
