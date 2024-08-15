'use strict';

const { v4 } = require('uuid');
const { faker } = require('@faker-js/faker');
const { Category } = require('../models');
const { default: axios } = require('axios');
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    try {
      const products = [];
      const assets = [];
      const categories = await Category.findAll();
      const totalProducts = 15;

      for (let i = 0; i < totalProducts; i++) {
        const product_id = v4();
        const name = faker.lorem.words(4);

        products.push({
          product_id: product_id,
          category_id: categories[i % categories.length].category_id,
          name: name,
          slug: name.toLowerCase().trim().replace(/[^\w\s-]/g, '').replace(/[\s_-]+/g, '-').replace(/^-+|-+$/g, ''),
          // details: faker.commerce.productDescription(),
          details: await getDescriptionLorem(),
          price: faker.commerce.price(),
          code: faker.commerce.isbn(),
          stock: faker.number.int({ max: 100, min: 1 }),
          status: true,
          created_at: new Date(),
          updated_at: new Date(),
        });

        const thumbnail_path = faker.image.urlLoremFlickr({ category: 'electronics' }).split("https://loremflickr.com").pop();

        assets.push({
          asset_id: v4(),
          owner_id: product_id,
          path: thumbnail_path,
          base_url: 'https://loremflickr.com',
          asset_type: 'product_thumbnail',
          created_at: new Date(),
          updated_at: new Date(),
        });

        for (let i = 0; i < 6; i++) {
          const image_path = faker.image.urlLoremFlickr({ category: 'electronics' }).split("https://loremflickr.com").pop();

          assets.push({
            asset_id: v4(),
            owner_id: product_id,
            path: image_path,
            base_url: 'https://loremflickr.com',
            asset_type: 'product_image',
            created_at: new Date(),
            updated_at: new Date(),
          });
        }
      }

      await queryInterface.bulkInsert('products', products, {});
      await queryInterface.bulkInsert('assets', assets, {});
    } catch (error) {
      console.log(error);
    }
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('products', null, {});
  }
};

async function getDescriptionLorem() {
  const formData = new FormData();
  formData.append('d[ty]', 'custom');
  formData.append('d[ct]', '');
  formData.append('d[st]', 1);
  formData.append('d[n]', 3);
  formData.append('d[l]', 1);
  formData.append('d[a]', 1);
  formData.append('d[bi]', 1);
  formData.append('d[h]', 1);
  formData.append('d[dl]', 1);
  formData.append('d[ul]', 1);
  formData.append('d[to]', 'aa5db07bd34a31d15c124045c34693c4');

  const response = await axios.post('https://www.loremipzum.com/libraries/system/g4L1s3.php', formData);

  // console.log(response.data);
  return response.data;
}