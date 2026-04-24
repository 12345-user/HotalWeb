const { getPool } = require('./db')

async function hasRows(tableName) {
  const pool = getPool()
  const [rows] = await pool.query(`SELECT COUNT(*) AS total FROM ${tableName}`)
  return rows[0].total > 0
}

async function seedIfEmpty() {
  const pool = getPool()

  if (!(await hasRows('activities'))) {
    await pool.query(
      'INSERT INTO activities (title, time, people, `desc`, photos) VALUES (?, ?, ?, ?, ?), (?, ?, ?, ?, ?)',
      [
        '环岛摩旅自驾',
        '2025.1.25-2025.2.7',
        '11人',
        '11人组队环岛，从东线到西线。',
        JSON.stringify(['/images/activities/H1.jpg']),
        '沙滩露营',
        '2025.4.3-2025.4.7',
        '',
        '野地真人CS，露营，营火，沙地越野。',
        JSON.stringify(['/images/activities/H3.jpg'])
      ]
    )
  }

  if (!(await hasRows('people'))) {
    await pool.query(
      'INSERT INTO people (name, personality, skills, contact, photos) VALUES (?, ?, ?, ?, ?)',
      [
        '留雨',
        '0.5个男人，会骑车，手工技艺，常年旅居',
        '',
        '',
        JSON.stringify(['/images/person/person1.jpg'])
      ]
    )
  }

  if (!(await hasRows('items'))) {
    await pool.query(
      'INSERT INTO items (name, time, description, image) VALUES (?, ?, ?, ?), (?, ?, ?, ?)',
      ['物品 1', '', '', '', '物品 2', '', '', '']
    )
  }
}

module.exports = { seedIfEmpty }
