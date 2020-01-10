const ListService = {
  getAllLists(knex) {
    return knex
      .raw(
        `
        SELECT count(list_id) AS liked,
               lists.id, 
               lists.name, 
               lists.tags, 
               lists.city, 
               lists.state, 
               lists.is_public 
               FROM liked_by
               RIGHT JOIN lists 
               ON lists.id = liked_by.list_id
               WHERE is_public = true
               GROUP BY lists.id;
        `
      )
      .then(rows => rows);
  },
  getAllListsFromCity(knex, city) {
    // needs implementation
    return knex
      .select('*')
      .from('lists')
      .where({ is_public: true})
      .where('city', 'ilike', city);
  },
  insertList(knex, newList) {
    return knex
      .insert(newList)
      .into('lists')
      .returning('*')
      .then(rows => rows[0]);
  },
  getListById(knex, id) {
    return knex.raw(`
        SELECT lists_spots.list_id,
               lists.name AS list_name,
               lists.tags AS list_tags,
               users.name AS created_by,
               spot_id,
               spots.name,
               spots.tags AS spots_tags,
               spots.address,
               spots.city,
               spots.state,
               spots.lat,
               spots.lon AS lng
               FROM lists_spots
               JOIN spots
               ON spot_id = spots.id
               JOIN lists
               ON list_id = lists.id
               JOIN users_lists
               ON lists_spots.list_id = users_lists.list_id
               JOIN users
               ON users_lists.users_id = users.id
               WHERE lists_spots.list_id = ${id};
    `);
  },
  deleteListReference(knex, list_id, users_id) {
    return knex.transaction(trx => {
      return knex('users_lists')
        .transacting(trx)
        .where({list_id})
        .where({users_id})
        .delete()
        .then(res => {
          return knex('lists_spots')
            .transacting(trx)
            .where({list_id})
            .delete()
            .then(res => {
              return knex('lists')
                .transacting(trx)
                .where('id', list_id)
                .delete()
                .then(res => res)
            })
        })
    })
    //    return knex('users_lists')
    //      .where({ list_id, users_id })
    //      .delete();
  },
  deleteList(knex, id) {
    // currently unused
    return knex('lists')
      .where({ id })
      .delete();
  },
  updateListReference(knex, user_id, list_id, newListField) {
    return knex('users_lists')
      .where({ user_id, list_id })
      .update(newListField);
  }
};

module.exports = ListService;
