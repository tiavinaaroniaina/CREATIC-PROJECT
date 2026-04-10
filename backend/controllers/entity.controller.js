const pool = require('../db');

// Create 
exports.createEntity = async (req, res) => {
  const { name } = req.body;
  if (!name) {
    return res.status(400).json({ error: 'Entity name is required.' });
  }
  try {
    const result = await pool.query(
      'INSERT INTO entity (name) VALUES ($1) RETURNING *',
      [name]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
};

// Get all
exports.getAllEntities = async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM entity');
    res.status(200).json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
};

// Get by ID
exports.getEntityById = async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query('SELECT * FROM entity WHERE id = $1', [id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Entity not found' });
    }
    res.status(200).json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
};

// Update 
exports.updateEntity = async (req, res) => {
  const { id } = req.params;
  const { name } = req.body;
  if (!name) {
    return res.status(400).json({ error: 'Entity name is required.' });
  }
  try {
    const result = await pool.query(
      'UPDATE entity SET name = $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2 RETURNING *',
      [name, id]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Entity not found' });
    }
    res.status(200).json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
};

// Delete
exports.deleteEntity = async (req, res) => {
  const { id } = req.params;
  try {
    // Vérifier si l'entité existe
    const entity = await pool.query('SELECT * FROM entity WHERE id = $1', [id]);
    if (entity.rows.length === 0) {
      return res.status(404).json({ error: 'Entity not found' });
    }

    // Vérifier s'il y a des associations dans user_entity
    const associations = await pool.query('SELECT * FROM user_entity WHERE entity_id = $1', [id]);
    const hasAssociations = associations.rows.length > 0;

    // Supprimer les associations dans la table de liaison
    if (hasAssociations) {
      await pool.query('DELETE FROM user_entity WHERE entity_id = $1', [id]);
    }

    // Supprimer l'entité
    const result = await pool.query('DELETE FROM entity WHERE id = $1 RETURNING *', [id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Entity not found' });
    }

    res.status(200).json({
      message: hasAssociations
        ? 'Entité supprimée ainsi que ses associations'
        : 'Entité supprimée'
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
};

// Check associations
exports.checkEntityAssociations = async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query('SELECT COUNT(*) FROM user_entity WHERE entity_id = $1', [id]);
    res.status(200).json({ count: parseInt(result.rows[0].count) });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
};
