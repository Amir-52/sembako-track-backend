'use strict';
const bcrypt = require('bcryptjs');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash('admin123', salt);

    // Gunakan 'Users' sesuai nama tabel di DBeaver
    await queryInterface.bulkInsert('Users', [{
      username: 'admin',
      password: hashedPassword,
      role: 'admin'
      }], {});
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Users', { username: 'admin' }, {});
  }
};
