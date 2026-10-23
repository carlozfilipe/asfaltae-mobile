export const schema = /* sql */ `
  CREATE TABLE IF NOT EXISTS points (
    id        INTEGER PRIMARY KEY AUTOINCREMENT,
    name      TEXT    NOT NULL,
    about     TEXT    NOT NULL,
    latitude  REAL    NOT NULL,
    longitude REAL    NOT NULL
  );

  CREATE TABLE IF NOT EXISTS images (
    id       INTEGER PRIMARY KEY AUTOINCREMENT,
    path     TEXT    NOT NULL,
    point_id INTEGER NOT NULL REFERENCES points (id) ON DELETE CASCADE ON UPDATE CASCADE
  );

  CREATE INDEX IF NOT EXISTS images_point_id_idx ON images (point_id);
`;
