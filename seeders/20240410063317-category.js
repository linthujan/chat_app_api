'use strict';

const { v4 } = require('uuid');
const { faker } = require('@faker-js/faker');
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    try {
      const categories = [];
      const assets = [];
      const totalCategory = 5;

      for (let i = 0; i < totalCategory; i++) {
        const category_id = v4();
        const name = faker.lorem.words(2);

        categories.push({
          category_id: category_id,
          name: name,
          slug: name.toLowerCase().trim().replace(/[^\w\s-]/g, '').replace(/[\s_-]+/g, '-').replace(/^-+|-+$/g, ''),
          details: faker.lorem.paragraph({ max: 6, min: 4 }),
          created_at: new Date(),
          updated_at: new Date(),
        });

        const thumbnail_path = faker.image.urlLoremFlickr({ category: 'electronics' })
          .split("https://loremflickr.com").pop();

        assets.push({
          asset_id: v4(),
          owner_id: category_id,
          path: thumbnail_path,
          base_url: 'https://loremflickr.com',
          asset_type: 'category_thumbnail',
          created_at: new Date(),
          updated_at: new Date(),
        });
      }

      await queryInterface.bulkInsert('categories', categories, {});
      await queryInterface.bulkInsert('assets', assets, {});
    } catch (error) {
      console.log(error);
    }
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('categories', null, {});
  }
};