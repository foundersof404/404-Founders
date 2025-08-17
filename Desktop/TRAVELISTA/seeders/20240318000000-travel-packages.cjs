'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const travelPackages = [
      {
        destination: "Paris, France",
        image: "https://images.unsplash.com/photo-1499856871958-5b9627545d1a",
        price: 2499,
        duration: "7 days",
        description: "Experience the romance of Paris with this all-inclusive package",
        departure_city: "New York",
        rating: 4.8,
        amenities: {
          breakfast: true,
          wifi: true,
          pool: false,
          gym: true,
          spa: true,
          airportTransfer: true,
          guidedTour: true,
          allInclusive: true,
          freeCancellation: true
        },
        highlights: [
          "Eiffel Tower guided tour",
          "Louvre Museum skip-the-line access",
          "Seine River dinner cruise",
          "Versailles Palace visit",
          "French cooking class"
        ],
        itinerary: [
          { day: 1, description: "Arrival and welcome dinner at a traditional French restaurant" },
          { day: 2, description: "Morning Eiffel Tower visit, afternoon at the Louvre" },
          { day: 3, description: "Full-day trip to Versailles Palace" },
          { day: 4, description: "Montmartre walking tour and Sacré-Cœur visit" },
          { day: 5, description: "Seine River cruise and Notre-Dame Cathedral" },
          { day: 6, description: "French cooking class and free time for shopping" },
          { day: 7, description: "Farewell breakfast and departure" }
        ]
      }
      // You can add more packages here from your data
    ];

    // Add created_at and updated_at to each package
    const packagesWithTimestamps = travelPackages.map(pkg => ({
      ...pkg,
      created_at: new Date(),
      updated_at: new Date()
    }));

    await queryInterface.bulkInsert('travel_packages', packagesWithTimestamps, {});
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('travel_packages', null, {});
  }
}; 