
export const vehicles = [
  {
    id: 1,
    name: "Mercedes-Benz C200",
    brand: "Mercedes-Benz",
    category: "Sedan",
    year: 2022,
    transmission: "Automatic",
    mileage: "18.000 km",
    price: 685000000,
    image:
      "https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?w=1000",
    featured: true,
  },
  {
    id: 2,
    name: "BMW 320i Sport",
    brand: "BMW",
    category: "Sedan",
    year: 2021,
    transmission: "Automatic",
    mileage: "25.000 km",
    price: 595000000,
    image:
      "https://images.unsplash.com/photo-1555215695-3004980ad54e?w=1000",
    featured: true,
  },
  {
    id: 3,
    name: "Toyota Alphard",
    brand: "Toyota",
    category: "MPV",
    year: 2023,
    transmission: "Automatic",
    mileage: "12.000 km",
    price: 825000000,
    image:
      "https://images.unsplash.com/photo-1617469767053-d3b523a0b982?w=1000",
    featured: true,
  },
];

export const formatRupiah = (price) => {
  return "Rp " + new Intl.NumberFormat("id-ID").format(price);
};