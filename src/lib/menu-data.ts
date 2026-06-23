import chickenWrap from "@/assets/chicken-wrap.jpg";
import spicyWrap from "@/assets/spicy-wrap.jpg";
import beefWrap from "@/assets/beef-wrap.jpg";
import loadedFries from "@/assets/loaded-fries.jpg";
import burger from "@/assets/burger.jpg";
import clubSandwich from "@/assets/club-sandwich.jpg";
import drinks from "@/assets/drinks.jpg";

export type MenuCategory = "Wraps" | "Burgers" | "Sides" | "Sandwiches" | "Drinks";

export type MenuItem = {
  id: string;
  name: string;
  desc: string;
  price: number;
  img: string;
  category: MenuCategory;
  tag?: string;
};

export const MENU: MenuItem[] = [
  { id: "chicken-wrap", name: "Chicken Wrap", desc: "Grilled chicken, fresh greens, signature creamy sauce in a warm tortilla.", price: 450, img: chickenWrap, category: "Wraps", tag: "Bestseller" },
  { id: "spicy-chicken-wrap", name: "Spicy Chicken Wrap", desc: "Fiery marinated chicken, chili flakes, peppers — for the bold.", price: 490, img: spicyWrap, category: "Wraps", tag: "Hot" },
  { id: "beef-wrap", name: "Beef Wrap", desc: "Tender beef strips, caramelized onions and melted cheese.", price: 550, img: beefWrap, category: "Wraps" },
  { id: "loaded-fries", name: "Loaded Fries", desc: "Crispy fries piled with cheese, chicken, jalapeños and sauces.", price: 520, img: loadedFries, category: "Sides", tag: "Sharing" },
  { id: "classic-burger", name: "Classic Burger", desc: "Juicy beef patty, cheddar, lettuce, tomato on a toasted bun.", price: 600, img: burger, category: "Burgers" },
  { id: "club-sandwich", name: "Club Sandwich", desc: "Triple-decker with chicken, crispy bacon, lettuce and tomato.", price: 580, img: clubSandwich, category: "Sandwiches" },
  { id: "fresh-drinks", name: "Fresh Drinks", desc: "Mint lemonade, berry fizz and classic lemon — ice cold.", price: 180, img: drinks, category: "Drinks" },
];

export const formatPKR = (n: number) => `Rs ${n.toLocaleString("en-PK")}`;

export const WHATSAPP_NUMBER = "923283777553";