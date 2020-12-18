package main

import (
	"github.com/jmoiron/sqlx"
	_ "github.com/mattn/go-sqlite3"
)

// Database pointer
type Database struct {
	*sqlx.DB
}

// Link to a PC
type Link struct {
	LinkID     string `json:"link,omitempty"`
	Permission string `json:"permission,omitempty"`
	PCID       int    `json:"pcId,omitempty"`
}

// Links to send back upon creation
type Links struct {
	EditID string `json:"editId,omitempty" db:"link_id"`
	ViewID string `json:"viewId,omitempty" db:"link_id"`
}

// PC Info
type PC struct {
	PCID   int     `json:"pcId,omitempty"`
	Name   string  `json:"name,omitempty"`
	Info   string  `json:"info,omitempty"`
	Parts  []Part  `json:"parts,omitempty"`
	Images []Image `json:"images,omitempty"`
}

// Image contains info of a PC image
type Image struct {
	ImageID int    `json:"imageId,omitempty"`
	Link    string `json:"link,omitempty"`
	PCID    int    `json:"pcId,omitempty"`
}

// Part of a PC
type Part struct {
	PartID int    `json:"partId,omitempty"`
	Type   string `json:"type,omitempty"`
	Brand  string `json:"brand,omitempty"`
	Model  string `json:"model,omitempty"`
	Qty    int    `json:"qty,omitempty"`
	PCID   int    `json:"pcId,omitempty"`
}

// ConnectToDB connects to the database
func ConnectToDB() (*Database, error) {
	db, err := sqlx.Connect("sqlite3", "file:pcshowdown.db?_fk=true")
	return &Database{db}, err
}

func (database *Database) addPC(pc PC) (Links, error) {
	var links Links

	// Start transaction due to multiple items
	tx, err := database.Beginx()

	if err != nil {
		return links, err
	}

	// add pc  to pc table
	query := `INSERT INTO pc (name, info) VALUES (?, ?);`
	result, err := tx.Exec(query, pc.Name, pc.Info)
	if err != nil {
		tx.Rollback()

		return links, err
	}

	// get the pc id
	pcID, err := result.LastInsertId()
	if err != nil {
		tx.Rollback()
		return links, err
	}

	// add parts to parts table
	for _, part := range pc.Parts {
		query = `INSERT INTO part (type, brand, model, qty, pc_id) VALUES (?, ?, ?, ?, ?);`
		_, err = tx.Exec(query, part.Type, part.Brand, part.Model, part.Qty, pcID)
		if err != nil {
			tx.Rollback()
			return links, err
		}
	}

	// add images to image table
	for _, image := range pc.Images {
		query = `INSERT INTO image (pc_id, link) VALUES (?, ?);`
		_, err = tx.Exec(query, pcID, image.Link)
		if err != nil {
			tx.Rollback()
			return links, err
		}
	}

	// Make and return links
	links, err = database.createLinks(tx, pcID)
	if err != nil {
		tx.Rollback()
		return links, err
	}

	tx.Commit()
	return links, nil
}

// createLinks creates a view and edit link
// Returns a Links, edit and view link and error
func (database *Database) createLinks(tx *sqlx.Tx, pcID int64) (Links, error) {
	var links Links

	// add edit link
	query := `INSERT INTO link (pc_id, permission) VALUES (?, ?);`
	_, err := tx.Exec(query, pcID, "edit")
	if err != nil {
		return links, err
	}

	// get edit link id
	linkQuery := `SELECT link_id FROM link WHERE pc_id = ? AND permission = ?;`
	err = tx.Get(&(links.EditID), linkQuery, pcID, "edit")
	if err != nil {
		return links, err
	}
	// add view link
	_, err = tx.Exec(query, pcID, "view")
	if err != nil {
		return links, err
	}
	// get view link id
	err = tx.Get(&(links.ViewID), linkQuery, pcID, "view")
	if err != nil {
		return links, err
	}

	return links, nil
}
