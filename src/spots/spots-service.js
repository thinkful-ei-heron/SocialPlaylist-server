const SpotsService = {
  getAllSpots(knex) {
    return knex.select('*').from('spots');
  },
  insertSpot(knex, newSpots) {
    return knex
      .insert(newSpots)
      .into('spots')
      .returning('*')
      .then(rows => rows[0]);
  },
  getSpotById(knex, id) {
    return knex
      .from('spots')
      .select('*')
      .where({ id })
      .first();
  },
  deleteSpots(knex, id) {
    return knex('spots')
      .where({ id })
      .delete();
  },
  updateSpot(knex, id, newSpotsField) {
    return knex('spots')
      .where({ id })
      .update(newSpotsField);
  }
};

module.exports = SpotsService;
